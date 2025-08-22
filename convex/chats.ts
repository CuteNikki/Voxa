import { v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';

import { Doc, Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

export const createChat = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const existingChat = await ctx.db
      .query('chats')
      .filter((q) => q.and(q.eq(q.field('userIdOne'), user.subject), q.eq(q.field('userIdTwo'), args.userId)))
      .first();

    if (existingChat) {
      throw new Error('Chat already exists with this user');
    }

    return await ctx.db.insert('chats', {
      userIdOne: user.subject,
      userIdTwo: args.userId,
    });
  },
});

// Only called from the server side
export const createGroupChat = mutation({
  args: {
    name: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingChat = await ctx.db
      .query('groups')
      .filter((q) => q.eq(q.field('name'), args.name))
      .first();

    if (existingChat) {
      throw new Error('Group chat with this name already exists');
    }

    return await ctx.db.insert('groups', {
      name: args.name,
      members: [],
      createdBy: args.userId,
    });
  },
});

// Only called from the server side
export const getChats = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query('chats')
      .filter((q) => q.or(q.eq(q.field('userIdOne'), userId), q.eq(q.field('userIdTwo'), userId)))
      .collect();
  },
});

export const getOwnChats = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    return await ctx.db
      .query('chats')
      .filter((q) => q.or(q.eq(q.field('userIdOne'), user.subject), q.eq(q.field('userIdTwo'), user.subject)))
      .collect();
  },
});

export const getOwnChatsPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    return await ctx.db
      .query('chats')
      .filter((q) => q.or(q.eq(q.field('userIdOne'), user.subject), q.eq(q.field('userIdTwo'), user.subject)))
      .order('desc')
      .paginate(paginationOpts);
  },
});

// Only called from the server side
export const getGroups = query({
  handler: async (ctx) => {
    return await ctx.db.query('groups').collect();
  },
});

// Only called from the server side
export const getChatByUserId = query({
  args: { targetUserId: v.string(), currentUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('chats')
      .filter((q) =>
        q.or(
          q.and(q.eq(q.field('userIdOne'), args.currentUserId), q.eq(q.field('userIdTwo'), args.targetUserId)),
          q.and(q.eq(q.field('userIdOne'), args.targetUserId), q.eq(q.field('userIdTwo'), args.currentUserId)),
        ),
      )
      .first();
  },
});

export const getGroupById = query({
  args: { groupId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('groups')
      .filter((q) => q.eq(q.field('_id'), args.groupId))
      .first();
  },
});

export const getLastMessage = query({
  args: { chatId: v.string() },
  handler: async (ctx, { chatId }) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_chatId', (q) => q.eq('chatId', chatId))
      .order('desc')
      .first();
  },
});

export const getChatById = query({
  args: { chatId: v.string() },
  handler: async (ctx, { chatId }) => {
    return await ctx.db
      .query('chats')
      .filter((q) => q.eq(q.field('_id'), chatId))
      .first();
  },
});

export const clearMessages = mutation({
  args: { chatId: v.string() },
  handler: async (ctx, { chatId }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const chat = await ctx.db.get(chatId as Id<'chats'>);

    if (!chat) {
      throw new Error('Chat does not exist');
    }

    if (![chat.userIdOne, chat.userIdTwo].includes(user.subject)) {
      throw new Error('You are not a participant in this chat');
    }

    const messages = await ctx.db
      .query('messages')
      .filter((q) => q.eq(q.field('chatId'), chatId))
      .collect();

    if (messages.length === 0) {
      return 'No messages to delete';
    }

    await Promise.all(messages.map((message) => ctx.db.delete(message._id)));
  },
});

export const setLastRead = mutation({
  args: {
    chatId: v.string(),
    lastReadAt: v.number(),
    isGroup: v.optional(v.boolean()),
  },
  handler: async (ctx, { chatId, lastReadAt }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const channel = await ctx.db.get(chatId as Id<'chats' | 'groups'>);

    if (!channel) {
      throw new Error('Chat does not exist');
    }

    function isChat(obj: unknown): obj is Doc<'chats'> {
      return obj !== null && typeof obj === 'object' && 'userIdOne' in obj && 'userIdTwo' in obj;
    }

    if (isChat(channel)) {
      if (![channel.userIdOne, channel.userIdTwo].includes(user.subject)) {
        throw new Error('You are not a participant in this chat');
      }

      const field = channel.userIdOne === user.subject ? 'userLastReadOne' : 'userLastReadTwo';

      await ctx.db.patch(channel._id, {
        [field]: lastReadAt,
      });
    } else {
      const existingMember = channel.members.find((m) => m.userId === user.subject);

      let updatedMembers;
      if (existingMember) {
        updatedMembers = channel.members.map((m) => (m.userId === user.subject ? { ...m, lastReadAt } : m));
      } else {
        updatedMembers = [...channel.members, { userId: user.subject, lastReadAt }];
      }

      await ctx.db.patch(channel._id, {
        members: updatedMembers,
      });
    }
  },
});

export const getUnreadMessages = query({
  args: { chatId: v.string() },
  handler: async (ctx, { chatId }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const chat = await ctx.db.get(chatId as Id<'chats'>);

    if (!chat) {
      throw new Error('Chat does not exist');
    }

    if (![chat.userIdOne, chat.userIdTwo].includes(user.subject)) {
      throw new Error('You are not a participant in this chat');
    }

    const lastReadAt = chat.userIdOne === user.subject ? chat.userLastReadOne : chat.userLastReadTwo;

    return await ctx.db
      .query('messages')
      .withIndex('by_chatId', (q) => q.eq('chatId', chatId))
      .filter((q) => q.gt(q.field('_creationTime'), lastReadAt ?? 0))
      .collect();
  },
});

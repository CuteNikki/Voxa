import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const createChat = mutation({
  args: {
    name: v.optional(v.string()),
    isGroup: v.boolean(),
    members: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    if (args.members.length + 1 > 2 && !args.isGroup) {
      throw new Error('Cannot create a group chat with isGroup set to false');
    }

    if (!args.isGroup && args.members.length + 1 !== 2) {
      throw new Error('Private chats must have exactly two members');
    }

    if (!args.isGroup) {
      const existingChat = await ctx.db
        .query('chats')
        .filter((q) => q.and(q.eq(q.field('isGroup'), false), q.eq(q.field('memberIds'), args.members)))
        .first();

      if (existingChat) {
        throw new Error('A private chat with these members already exists');
      }
    }

    if (args.isGroup && !args.name) {
      throw new Error('Group chats must have a name');
    }

    return await ctx.db.insert('chats', {
      createdBy: user?.subject || '',
      createdAt: Date.now(),
      memberIds: [...args.members, user.subject],
      isGroup: args.isGroup,
      name: args.name,
    });
  },
});

export const getChat = query({
  args: { chatId: v.id('chats') },
  handler: async (ctx, { chatId }) => {
    const chat = await ctx.db.get(chatId);

    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }

    return chat;
  },
});

export const addMemberToChat = mutation({
  args: { chatId: v.id('chats'), userId: v.string() },
  handler: async (ctx, { chatId, userId }) => {
    const chat = await ctx.db.get(chatId);

    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }

    if (!chat.memberIds.includes(userId)) {
      await ctx.db.patch(chatId, {
        memberIds: [...chat.memberIds, userId],
      });
    }

    return await ctx.db.get(chatId);
  },
});

export const getUserChats = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const allChats = await ctx.db.query('chats').collect();

    return allChats.filter((chat) => chat.memberIds.includes(user.subject) && !chat.isGroup);
  },
});

export const getChats = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('chats')
      .filter((q) => q.eq(q.field('isGroup'), true))
      .collect();
  },
});

export const deleteChat = mutation({
  args: { chatId: v.id('chats') },
  handler: async (ctx, { chatId }) => {
    const user = await ctx.auth.getUserIdentity();
    const chat = await ctx.db.get(chatId);

    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }

    if (chat.createdBy !== user?.subject) {
      throw new Error('Only the creator of the chat can delete it');
    }

    await ctx.db.delete(chatId);
    return { success: true, message: `Chat with ID ${chatId} deleted successfully` };
  },
});

export const getPrivateChatWithUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const chat = await ctx.db
      .query('chats')
      .filter((q) =>
        q.and(q.eq(q.field('isGroup'), false), q.or(q.eq(q.field('memberIds'), [user.subject, userId]), q.eq(q.field('memberIds'), [userId, user.subject]))),
      )
      .first();

    if (!chat) {
      console.error(`No private chat found with user ${userId}`);
      return null;
    }

    return chat;
  },
});

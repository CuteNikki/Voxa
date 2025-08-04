import { v } from 'convex/values';

import { paginationOptsValidator } from 'convex/server';
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
      createdAt: Date.now(),
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
      memberIds: [],
      createdBy: args.userId,
      createdAt: Date.now(),
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
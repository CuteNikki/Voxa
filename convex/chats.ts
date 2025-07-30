import { v } from 'convex/values';

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

export const createGroupChat = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

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
      createdBy: user.subject,
      createdAt: Date.now(),
    });
  },
});

export const getChats = query({
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

export const getGroups = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    return await ctx.db.query('groups').collect();
  },
});

export const getChatByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    return await ctx.db
      .query('chats')
      .filter((q) =>
        q.or(
          q.and(q.eq(q.field('userIdOne'), user.subject), q.eq(q.field('userIdTwo'), args.userId)),
          q.and(q.eq(q.field('userIdOne'), args.userId), q.eq(q.field('userIdTwo'), user.subject)),
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

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
    members: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    if (args.members.length < 2) {
      throw new Error('Group chat must have at least two members');
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
      memberIds: [...args.members, user.subject],
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
      .filter((q) => q.and(q.eq(q.field('userIdOne'), user.subject), q.eq(q.field('userIdTwo'), args.userId)))
      .first();
  },
});

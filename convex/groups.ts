import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

function randomId(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

export const getGroupsPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    return await ctx.db.query('groups').order('desc').paginate(paginationOpts);
  },
});

export const getGroupById = query({
  args: { chatId: v.string() },
  handler: async (ctx, { chatId }) => {
    return await ctx.db
      .query('groups')
      .filter((q) => q.eq(q.field('_id'), chatId))
      .first();
  },
});

export const createGroupChat = mutation({
  args: {
    name: v.optional(v.string()),
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
      name: args.name ?? `${Date.now()}-${randomId(5)}`,
      members: [],
      createdBy: user.subject,
    });
  },
});
import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';

import { query } from './_generated/server';

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

export const getLastMessage = query({
  args: { groupId: v.string() },
  handler: async (ctx, { groupId }) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_chatId', (q) => q.eq('chatId', groupId))
      .order('desc')
      .first();
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

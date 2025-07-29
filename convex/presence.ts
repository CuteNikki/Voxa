import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getOnlineUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('presence')
      .filter((q) => q.eq(q.field('isOnline'), true))
      .take(5);
  },
});

export const setOnlineStatus = mutation({
  args: { isOnline: v.boolean() },
  handler: async (ctx, { isOnline }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('Unauthorized');
    }

    const existing = await ctx.db
      .query('presence')
      .withIndex('by_userId', (q) => q.eq('userId', user.subject))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isOnline,
        lastSeen: Date.now(),
      });
    } else {
      await ctx.db.insert('presence', {
        userId: user.subject,
        lastSeen: Date.now(),
        isOnline,
      });
    }
  },
});

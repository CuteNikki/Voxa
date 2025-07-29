import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getOnlineUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('presence')
      .filter((q) => q.eq(q.field('isOnline'), true))
      .collect();
  },
});

export const setOnlineStatus = mutation({
  args: { userId: v.string(), isOnline: v.boolean() },
  handler: async (ctx, { userId, isOnline }) => {
    const existing = await ctx.db
      .query('presence')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isOnline,
        lastSeen: Date.now(),
      });
    } else {
      await ctx.db.insert('presence', {
        userId,
        isOnline,
        lastSeen: Date.now(),
      });
    }
  },
});

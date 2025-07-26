import { v } from 'convex/values';

import { mutation } from '../../_generated/server';

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

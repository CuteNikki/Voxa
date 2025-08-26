import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const setOnlineStatus = mutation({
  handler: async (ctx) => {
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
        lastSeen: Date.now(),
      });
    } else {
      await ctx.db.insert('presence', {
        userId: user.subject,
        lastSeen: Date.now(),
      });
    }
  },
});

// Only called from the server side
export const getUserPresence = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const presence = await ctx.db
      .query('presence')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();

    if (!presence) {
      return null;
    }

    return {
      userId: presence.userId,
      lastSeen: presence.lastSeen,
    };
  },
});

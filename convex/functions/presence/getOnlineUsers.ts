import { query } from '../../_generated/server';

export const getOnlineUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('presence')
      .filter((q) => q.eq(q.field('isOnline'), true))
      .collect();
  },
});

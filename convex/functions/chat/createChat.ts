import { v } from 'convex/values';

import { mutation } from '../../_generated/server';

export const createChat = mutation({
  args: {
    isGroup: v.boolean(),
    name: v.optional(v.string()),
    members: v.array(v.id('users')),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('chats', args);
  },
});

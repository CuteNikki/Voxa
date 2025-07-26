import { v } from 'convex/values';

import { query } from '../../_generated/server';

export const getUserChats = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const allChats = await ctx.db.query('chats').collect();
    return allChats.filter((chat) => chat.members.includes(args.userId));
  },
});

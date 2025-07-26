import { v } from 'convex/values';

import { query } from '../../_generated/server';

export const getTypingUsers = query({
  args: { chatId: v.id('chats') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('typingIndicators')
      .withIndex('by_chatId', (q) => q.eq('chatId', args.chatId))
      .collect();
  },
});

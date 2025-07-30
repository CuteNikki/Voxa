import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getTypingUsers = query({
  args: { chatId: v.id('chats') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('typing')
      .withIndex('by_chatId', (q) => q.eq('chatId', args.chatId))
      .collect();
  },
});

export const setTyping = mutation({
  args: {
    chatId: v.id('chats'),
    userId: v.id('users'),
    typing: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('typing')
      .withIndex('by_chatId', (q) => q.eq('chatId', args.chatId))
      .collect();

    const found = existing.find((entry) => entry.userId === args.userId);
    if (found) {
      await ctx.db.patch(found._id, {
        typing: args.typing,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert('typing', {
        ...args,
        updatedAt: Date.now(),
      });
    }
  },
});

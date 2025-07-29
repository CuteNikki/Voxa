import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const sendMessage = mutation({
  args: {
    chatId: v.id('chats'),
    senderId: v.id('users'),
    content: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('messages', {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getMessages = query({
  args: { chatId: v.id('chats') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_chatId', (q) => q.eq('chatId', args.chatId))
      .order('desc')
      .collect();
  },
});

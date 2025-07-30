import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const sendChatMessage = mutation({
  args: {
    chatId: v.string(),
    content: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!args.content && !args.imageUrl) {
      throw new Error('Message must have either content or an image URL');
    }

    const existingChat = await ctx.db
      .query('chats')
      .filter((q) => q.eq(q.field('_id'), args.chatId))
      .first();

    if (!existingChat) {
      throw new Error('Chat does not exist');
    }

    return await ctx.db.insert('messages', {
      ...args,
      createdAt: Date.now(),
      senderId: user.subject,
    });
  },
});

export const getMessages = query({
  args: { chatId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_chatId', (q) => q.eq('chatId', args.chatId))
      .order('asc')
      .take(50);
  },
});

import { v } from 'convex/values';

import { TYPING_THRESHOLD } from '../src/constants/limits';
import { mutation, query } from './_generated/server';

export const getTypingUsers = query({
  args: { chatId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('typing')
      .withIndex('by_chatId', (q) => q.eq('chatId', args.chatId))
      .filter((q) => q.and(q.gt(q.field('updatedAt'), Date.now() - TYPING_THRESHOLD), q.eq(q.field('typing'), true)))
      .collect();
  },
});

export const setTyping = mutation({
  args: {
    chatId: v.string(),
    typing: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const typingUsers = await ctx.db
      .query('typing')
      .withIndex('by_chatId', (q) => q.eq('chatId', args.chatId))
      .collect();

    const typingUserExists = typingUsers.find((entry) => entry.userId === user.subject);

    if (typingUserExists) {
      await ctx.db.patch(typingUserExists._id, {
        typing: args.typing,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert('typing', {
        chatId: args.chatId,
        userId: user.subject,
        typing: args.typing,
        updatedAt: Date.now(),
      });
    }
  },
});

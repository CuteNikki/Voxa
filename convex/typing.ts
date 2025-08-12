import { v } from 'convex/values';

import { TYPING_THRESHOLD } from '../src/constants/limits';
import { mutation, query } from './_generated/server';

export const getTypingUsers = query({
  args: { chatId: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const activeThreshold = now - TYPING_THRESHOLD;

    const all = await ctx.db
      .query('typing')
      .withIndex('by_chatId', (q) => q.eq('chatId', args.chatId))
      .collect();

    return all.filter((entry) => entry.typing && entry.updatedAt > activeThreshold);
  },
});

export const setTyping = mutation({
  args: {
    chatId: v.string(),
    userId: v.string(),
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

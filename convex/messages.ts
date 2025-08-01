import { v } from 'convex/values';

import { paginationOptsValidator } from 'convex/server';
import { mutation, query } from './_generated/server';

export const sendGroupMessage = mutation({
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
      .query('groups')
      .filter((q) => q.eq(q.field('_id'), args.chatId))
      .first();

    if (!existingChat) {
      throw new Error('Group chat does not exist');
    }

    return await ctx.db.insert('messages', {
      ...args,
      createdAt: Date.now(),
      senderId: user.subject,
    });
  },
});

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
      .order('desc')
      .take(50);
  },
});

export const getPaginatedMessages = query({
  args: {
    chatId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { chatId, paginationOpts }) => {
    const options = paginationOpts ?? { numItems: 50, cursor: null };
    return await ctx.db
      .query('messages')
      .withIndex('by_chatId', (q) => q.eq('chatId', chatId))
      .order('desc')
      .paginate(options);
  },
});

export const deleteMessage = mutation({
  args: { messageId: v.string() },
  handler: async (ctx, { messageId }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const message = await ctx.db
      .query('messages')
      .filter((q) => q.eq(q.field('_id'), messageId))
      .first();
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId !== user.subject) {
      throw new Error('You can only delete your own messages');
    }

    await ctx.db.delete(message._id);
  },
});

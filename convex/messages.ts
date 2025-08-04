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

    if (args.content && args.content.length > 1000) {
      throw new Error('Message content exceeds maximum length of 1000 characters');
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

    if (args.content && args.content.length > 1000) {
      throw new Error('Message content exceeds maximum length of 1000 characters');
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

export const editMessage = mutation({
  args: {
    messageId: v.string(),
    content: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, { messageId, content, imageUrl }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!content && !imageUrl) {
      throw new Error('Message must have either content or an image URL');
    }

    if (content && content.length > 1000) {
      throw new Error('Message content exceeds maximum length of 1000 characters');
    }

    const message = await ctx.db
      .query('messages')
      .filter((q) => q.eq(q.field('_id'), messageId))
      .first();
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId !== user.subject) {
      throw new Error('You can only edit your own messages');
    }

    const updatedFields: { content?: string; imageUrl?: string } = {};
    if (content !== undefined) updatedFields.content = content;
    if (imageUrl !== undefined) updatedFields.imageUrl = imageUrl;

    return await ctx.db.patch(message._id, updatedFields);
  },
});

export const sendMessage = mutation({
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

    if (args.content && args.content.length > 1000) {
      throw new Error('Message content exceeds maximum length of 1000 characters');
    }

    const existingChat = await ctx.db
      .query('chats')
      .filter((q) => q.eq(q.field('_id'), args.chatId))
      .first();

    if (!existingChat) {
      throw new Error('Chat does not exist');
    }

    return await ctx.db.insert('messages', {
      chatId: args.chatId,
      content: args.content?.trim() || '',
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
      senderId: user.subject,
    });
  },
});

import { v } from 'convex/values';

import { paginationOptsValidator } from 'convex/server';
import { mutation, query } from './_generated/server';

import { MAX_IMAGE_COUNT, MAX_MESSAGE_LENGTH, MAX_UNIQUE_REACTIONS } from '../src/constants/limits';

export const sendChatMessage = mutation({
  args: {
    chatId: v.string(),
    isGroup: v.optional(v.boolean()),
    content: v.optional(v.string()),
    imageUrls: v.optional(v.array(v.string())),
    reference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!args.content && !args.imageUrls?.length) {
      throw new Error('Message must have either content or an image URL');
    }

    if (args.imageUrls && args.imageUrls.length > MAX_IMAGE_COUNT) {
      throw new Error(`You can upload a maximum of ${MAX_IMAGE_COUNT} images per message`);
    }

    if (args.content && args.content.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Message content exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`);
    }

    if (args.reference) {
      const referencedMessage = await ctx.db
        .query('messages')
        .filter((q) => q.eq(q.field('_id'), args.reference))
        .first();

      if (!referencedMessage) {
        throw new Error('Referenced message does not exist');
      }
    }

    if (args.isGroup) {
      const existingGroup = await ctx.db
        .query('groups')
        .filter((q) => q.eq(q.field('_id'), args.chatId))
        .first();

      if (!existingGroup) {
        throw new Error('Group chat does not exist');
      }
    } else {
      const existingChat = await ctx.db
        .query('chats')
        .filter((q) => q.eq(q.field('_id'), args.chatId))
        .first();

      if (!existingChat) {
        throw new Error('Chat does not exist');
      }
    }

    return await ctx.db.insert('messages', {
      chatId: args.chatId,
      content: args.content?.trim() || '',
      imageUrls: args.imageUrls,
      senderId: user.subject,
      reference: args.reference,
    });
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
    imageUrls: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { messageId, content, imageUrls }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!content && !imageUrls?.length) {
      throw new Error('Message must have either content or an image URL');
    }

    if (imageUrls && imageUrls.length > MAX_IMAGE_COUNT) {
      throw new Error(`You can upload a maximum of ${MAX_IMAGE_COUNT} images per message`);
    }

    if (content && content.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Message content exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`);
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

    if (message.content === content && message.imageUrls === imageUrls) {
      throw new Error('No changes detected in the message');
    }

    const updatedFields: { content?: string; imageUrls?: string[]; editedAt: number } = { editedAt: Date.now() };
    if (content !== undefined) updatedFields.content = content;
    if (imageUrls !== undefined) updatedFields.imageUrls = imageUrls;

    return await ctx.db.patch(message._id, updatedFields);
  },
});

export const addReaction = mutation({
  args: {
    messageId: v.string(),
    reaction: v.string(),
  },
  handler: async (ctx, { messageId, reaction }) => {
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

    const uniqueEmojis = new Set((message.reactions || []).map((r) => r.reaction));
    if (!uniqueEmojis.has(reaction) && uniqueEmojis.size >= MAX_UNIQUE_REACTIONS) {
      throw new Error('Maximum of 6 unique emojis per message');
    }

    const existingReaction = message.reactions?.find((r) => r.userId === user.subject && r.reaction === reaction);

    if (existingReaction) {
      throw new Error('You have already reacted with this reaction');
    }

    return await ctx.db.patch(message._id, {
      reactions: [
        ...(message.reactions || []),
        {
          userId: user.subject,
          reaction,
          createdAt: Date.now(),
        },
      ],
    });
  },
});

export const removeReaction = mutation({
  args: {
    messageId: v.string(),
    reaction: v.string(),
  },
  handler: async (ctx, { messageId, reaction }) => {
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

    const existingReactionIndex = message.reactions?.findIndex((r) => r.userId === user.subject && r.reaction === reaction);

    if (existingReactionIndex === undefined || existingReactionIndex < 0) {
      throw new Error('You have not reacted with this reaction');
    }

    const updatedReactions = [...(message.reactions || [])];
    updatedReactions.splice(existingReactionIndex, 1);
    return await ctx.db.patch(message._id, {
      reactions: updatedReactions,
    });
  },
});

export const getMessageById = query({
  args: { messageId: v.string() },
  handler: async (ctx, { messageId }) => {
    return await ctx.db
      .query('messages')
      .filter((q) => q.eq(q.field('_id'), messageId))
      .first();
  },
});

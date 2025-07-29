import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const createChat = mutation({
  args: {
    isGroup: v.boolean(),
    name: v.optional(v.string()),
    members: v.array(v.id('users')),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    return await ctx.db.insert('chats', { ...args, createdBy: user?.subject || '' });
  },
});

export const getChat = query({
  args: { chatId: v.id('chats') },
  handler: async (ctx, { chatId }) => {
    const chat = await ctx.db.get(chatId);

    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }

    return chat;
  },
});

export const addMemberToChat = mutation({
  args: { chatId: v.id('chats'), userId: v.id('users') },
  handler: async (ctx, { chatId, userId }) => {
    const chat = await ctx.db.get(chatId);

    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }

    if (!chat.members.includes(userId)) {
      await ctx.db.patch(chatId, {
        members: [...chat.members, userId],
      });
    }

    return await ctx.db.get(chatId);
  },
});

export const getUserChats = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const allChats = await ctx.db.query('chats').collect();

    return allChats.filter((chat) => chat.members.includes(args.userId) && !chat.isGroup);
  },
});

export const getChats = query({
  handler: async (ctx) => {
    return await ctx.db.query('chats').collect();
  },
});

export const deleteChat = mutation({
  args: { chatId: v.id('chats') },
  handler: async (ctx, { chatId }) => {
    const user = await ctx.auth.getUserIdentity();
    const chat = await ctx.db.get(chatId);

    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }

    if (chat.createdBy !== user?.subject) {
      throw new Error('Only the creator of the chat can delete it');
    }

    await ctx.db.delete(chatId);
    return { success: true, message: `Chat with ID ${chatId} deleted successfully` };
  },
});

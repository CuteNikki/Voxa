import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    return users;
  },
});

// Only called from the server side
export const getUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .unique();

    if (!user) {
      throw new Error(`User with clerkId ${clerkId} not found`);
    }

    return user;
  },
});

export const getUsersByIds = query({
  args: { ids: v.array(v.string()) },
  handler: async (ctx, { ids }) => {
    if (ids.length === 0) return [];
    const allUsers = await ctx.db.query('users').collect();
    const users = allUsers.filter((user) => ids.includes(user.clerkId));
    return users;
  },
});

export const getOrCreateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const { subject, email, pictureUrl, nickname, emailVerified } = identity;

    if (!email || !subject) {
      throw new Error('User must have an email and subject to create or update a user');
    }

    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', subject))
      .unique();

    const userData = {
      email: email,
      imageUrl: pictureUrl,
      username: nickname,
      emailVerified: emailVerified,
    };

    if (existing) {
      // Update if any field has changed
      const needsUpdate = Object.entries(userData).some(([key, value]) => (existing as Record<string, unknown>)[key] !== value);

      if (needsUpdate) {
        await ctx.db.patch(existing._id, userData);
        return await ctx.db.get(existing._id); // return fresh
      }

      return existing;
    }

    const newUser = await ctx.db.insert('users', {
      clerkId: subject,
      createdAt: Date.now(),
      ...userData,
    });

    return await ctx.db.get(newUser);
  },
});

export const getUserNames = query({
  args: { ids: v.array(v.string()) },
  handler: async (ctx, { ids }) => {
    const allUsers = await ctx.db.query('users').collect();
    const users = allUsers.filter((user) => ids.includes(user.clerkId)).map((user) => user.username ?? user.clerkId);
    return users;
  },
});

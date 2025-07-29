import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

// This function was for debugging purposes and is not used in the current codebase.
// export const getAllUsers = query({
//   args: {},
//   handler: async (ctx) => {
//     return await ctx.db.query('users').collect();
//   },
// });

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

export const getOrCreateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const { subject, email, pictureUrl, nickname, emailVerified, updatedAt } = identity;

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
      updatedAt: updatedAt,
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
      ...userData,
    });

    return await ctx.db.get(newUser);
  },
});

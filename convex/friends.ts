import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const sendRequest = mutation({
  args: {
    to: v.string(),
  },
  handler: async (ctx, args) => {
    const from = await ctx.auth.getUserIdentity();

    if (!from) {
      throw new Error('User not authenticated');
    }

    const toUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.to))
      .unique();

    if (!toUser) {
      throw new Error(`User with clerkId ${args.to} not found`);
    }

    if (toUser.clerkId === from.subject) {
      throw new Error('You cannot send a friend request to yourself');
    }

    const existingRequest = await ctx.db
      .query('requests')
      .filter((q) => q.and(q.eq(q.field('to'), args.to), q.eq(q.field('from'), from.subject)))
      .first();

    if (existingRequest) {
      throw new Error('Friend request already sent');
    }

    return await ctx.db.insert('requests', {
      from: from.subject,
      to: args.to,
      createdAt: Date.now(),
    });
  },
});

export const removeFriend = mutation({
  args: {
    friendId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const friend = await ctx.db
      .query('friends')
      .filter((q) =>
        q.or(
          q.and(q.eq(q.field('userIdOne'), user.subject), q.eq(q.field('userIdTwo'), args.friendId)),
          q.and(q.eq(q.field('userIdOne'), args.friendId), q.eq(q.field('userIdTwo'), user.subject)),
        ),
      )
      .first();

    if (!friend) {
      throw new Error('Friend not found');
    }

    await ctx.db.delete(friend._id);

    const chat = await ctx.db
      .query('chats')
      .filter((q) =>
        q.or(
          q.and(q.eq(q.field('userIdOne'), user.subject), q.eq(q.field('userIdTwo'), args.friendId)),
          q.and(q.eq(q.field('userIdOne'), args.friendId), q.eq(q.field('userIdTwo'), user.subject)),
        ),
      )
      .first();

    if (chat) {
      await ctx.db.delete(chat._id);
    }

    return { success: true };
  },
});

// Only called from the server side
export const getFriendRequests = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query('requests')
      .filter((q) => q.eq(q.field('to'), userId))
      .collect();
  },
});

// Only called from the server side
export const getSentRequests = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query('requests')
      .filter((q) => q.eq(q.field('from'), userId))
      .collect();
  },
});

export const respondToRequest = mutation({
  args: {
    userId: v.string(),
    targetId: v.string(),
    response: v.union(v.literal('accept'), v.literal('decline')),
  },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query('requests')
      .filter((q) => q.or(q.eq(q.field('to'), args.targetId), q.eq(q.field('from'), args.targetId)))
      .collect();

    const request = requests[0];

    if (!request) {
      throw new Error(`Friend request to ${args.targetId} not found`);
    }

    if (args.response === 'accept') {
      if (request.from === args.userId) {
        throw new Error('You cannot accept your own friend request');
      }

      await ctx.db.insert('friends', {
        userIdOne: request.from,
        userIdTwo: request.to,
        createdAt: Date.now(),
      });

      await ctx.db.insert('chats', {
        userIdOne: request.from,
        userIdTwo: request.to,
        createdAt: Date.now(),
      });

      await ctx.db.delete(request._id);
    } else {
      const channel = await ctx.db
        .query('chats')
        .filter((q) => q.or(q.eq(q.field('userIdOne'), request.from), q.eq(q.field('userIdTwo'), request.from)))
        .first();
      if (channel) {
        await ctx.db.delete(channel._id);
      }

      await ctx.db.delete(request._id);
    }

    return request;
  },
});

export const getFriends = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const friendIds = await ctx.db
      .query('friends')
      .filter((q) => q.or(q.eq(q.field('userIdOne'), user.subject), q.eq(q.field('userIdTwo'), user.subject)))
      .collect();

    const friends = await ctx.db
      .query('users')
      .filter((q) => q.or(...friendIds.map((friend) => q.or(q.eq(q.field('clerkId'), friend.userIdOne), q.eq(q.field('clerkId'), friend.userIdTwo)))))
      .collect();

    return friends.filter((friend) => friend.clerkId !== user.subject);
  },
});

export const getFriendIds = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const friends = await ctx.db
      .query('friends')
      .filter((q) => q.or(q.eq(q.field('userIdOne'), userId), q.eq(q.field('userIdTwo'), userId)))
      .collect();

    return friends.map((friend) => (friend.userIdOne === userId ? friend.userIdTwo : friend.userIdOne));
  },
});

export const isFriend = query({
  args: { targetId: v.string() },
  handler: async (ctx, { targetId }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const friends = await ctx.db
      .query('friends')
      .filter((q) =>
        q.or(
          q.and(q.eq(q.field('userIdOne'), user.subject), q.eq(q.field('userIdTwo'), targetId)),
          q.and(q.eq(q.field('userIdOne'), targetId), q.eq(q.field('userIdTwo'), user.subject)),
        ),
      )
      .collect();

    return friends.length > 0;
  },
});

export const isPendingRequest = query({
  args: { targetId: v.string() },
  handler: async (ctx, { targetId }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const request = await ctx.db
      .query('requests')
      .filter((q) =>
        q.or(
          q.and(q.eq(q.field('to'), targetId), q.eq(q.field('from'), user.subject)),
          q.and(q.eq(q.field('to'), user.subject), q.eq(q.field('from'), targetId)),
        ),
      )
      .first();

    return !!request;
  },
});

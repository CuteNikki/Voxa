import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const sendRequest = mutation({
  args: {
    from: v.string(),
    to: v.string(),
  },
  handler: async (ctx, args) => {
    const toUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.to))
      .unique();

    if (!toUser) {
      throw new Error(`User with clerkId ${args.to} not found`);
    }

    if (toUser.clerkId === args.from) {
      throw new Error('You cannot send a friend request to yourself');
    }

    const existingRequest = await ctx.db
      .query('requests')
      .filter((q) => q.and(q.eq(q.field('to'), args.to), q.eq(q.field('from'), args.from)))
      .first();

    if (existingRequest) {
      throw new Error('Friend request already sent');
    }

    return await ctx.db.insert('requests', {
      from: args.from,
      to: args.to,
      createdAt: Date.now(),
    });
  },
});

export const removeFriend = mutation({
  args: {
    userId: v.string(),
    targetUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const friend = await ctx.db
      .query('friends')
      .filter((q) =>
        q.or(
          q.and(q.eq(q.field('userIdOne'), args.userId), q.eq(q.field('userIdTwo'), args.targetUserId)),
          q.and(q.eq(q.field('userIdOne'), args.targetUserId), q.eq(q.field('userIdTwo'), args.userId)),
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
          q.and(q.eq(q.field('userIdOne'), args.userId), q.eq(q.field('userIdTwo'), args.targetUserId)),
          q.and(q.eq(q.field('userIdOne'), args.targetUserId), q.eq(q.field('userIdTwo'), args.userId)),
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
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const friendIds = await ctx.db
      .query('friends')
      .filter((q) => q.or(q.eq(q.field('userIdOne'), userId), q.eq(q.field('userIdTwo'), userId)))
      .collect();

    const friends = await ctx.db
      .query('users')
      .filter((q) => q.or(...friendIds.map((friend) => q.or(q.eq(q.field('clerkId'), friend.userIdOne), q.eq(q.field('clerkId'), friend.userIdTwo)))))
      .collect();

    return friends.filter((friend) => friend.clerkId !== userId);
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
  args: { userId: v.string(), targetId: v.string() },
  handler: async (ctx, { targetId, userId }) => {
    const friends = await ctx.db
      .query('friends')
      .filter((q) =>
        q.or(
          q.and(q.eq(q.field('userIdOne'), userId), q.eq(q.field('userIdTwo'), targetId)),
          q.and(q.eq(q.field('userIdOne'), targetId), q.eq(q.field('userIdTwo'), userId)),
        ),
      )
      .collect();

    return friends.length > 0;
  },
});

export const isPendingRequest = query({
  args: { targetId: v.string(), userId: v.string() },
  handler: async (ctx, { targetId, userId }) => {
    const request = await ctx.db
      .query('requests')
      .filter((q) =>
        q.or(q.and(q.eq(q.field('to'), targetId), q.eq(q.field('from'), userId)), q.and(q.eq(q.field('to'), userId), q.eq(q.field('from'), targetId))),
      )
      .first();

    return !!request;
  },
});

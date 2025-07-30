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

    const existingRequest = await ctx.db
      .query('friendRequests')
      .filter((q) => q.and(q.eq(q.field('to'), args.to), q.eq(q.field('from'), from.subject)))
      .first();

    if (existingRequest) {
      throw new Error('Friend request already sent');
    }

    return await ctx.db.insert('friendRequests', {
      from: from.subject,
      to: args.to,
      status: 'pending',
      createdAt: Date.now(),
    });
  },
});

export const getFriendRequests = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    return await ctx.db
      .query('friendRequests')
      .filter((q) => q.and(q.eq(q.field('to'), user.subject), q.eq(q.field('status'), 'pending')))
      .collect();
  },
});

export const getSentRequests = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    return await ctx.db
      .query('friendRequests')
      .filter((q) => q.and(q.eq(q.field('from'), user.subject), q.eq(q.field('status'), 'pending')))
      .collect();
  },
});

export const respondToRequest = mutation({
  args: {
    targetId: v.string(),
    response: v.union(v.literal('accept'), v.literal('decline')),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const requests = await ctx.db
      .query('friendRequests')
      .filter((q) => q.or(q.eq(q.field('to'), args.targetId), q.eq(q.field('from'), args.targetId)))
      .collect();

    const request = requests[0];

    if (!request) {
      throw new Error(`Friend request to ${args.targetId} not found`);
    }

    if (args.response === 'accept') {
      await ctx.db.patch(request._id, { status: 'accepted' });
    } else {
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
      .query('friendRequests')
      .filter((q) => q.and(q.eq(q.field('status'), 'accepted'), q.or(q.eq(q.field('from'), user.subject), q.eq(q.field('to'), user.subject))))
      .collect()
      .then((requests) => requests.map((request) => (request.from === user.subject ? request.to : request.from)));

    return await ctx.db
      .query('users')
      .filter((q) => q.or(...friendIds.map((id) => q.eq(q.field('clerkId'), id))))
      .collect();
  },
});

export const getFriendIds = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const friends = await ctx.db
      .query('friendRequests')
      .filter((q) => q.and(q.eq('status', 'accepted'), q.or(q.eq('from', user.subject), q.eq('to', user.subject))))
      .collect();

    return friends.map((friend) => (friend.from === user.subject ? friend.to : friend.from));
  },
});

export const isFriend = query({
  args: { targetId: v.string() },
  handler: async (ctx, { targetId }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const friendIds = await ctx.db
      .query('friendRequests')
      .filter((q) => q.and(q.eq(q.field('status'), 'accepted'), q.or(q.eq(q.field('from'), user.subject), q.eq(q.field('to'), user.subject))))
      .collect()
      .then((requests) => requests.map((request) => (request.from === user.subject ? request.to : request.from)));

    return friendIds.includes(targetId);
  },
});

export const isFriendOrRequestSent = query({
  args: { targetId: v.string() },
  handler: async (ctx, { targetId }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const isFriend = await ctx.db
      .query('friendRequests')
      .filter((q) => q.and(q.eq(q.field('status'), 'accepted'), q.or(q.eq(q.field('from'), user.subject), q.eq(q.field('to'), user.subject))))
      .collect()
      .then((requests) => requests.some((request) => (request.from === user.subject ? request.to : request.from) === targetId));

    if (isFriend) {
      return true;
    }

    const requestSent = await ctx.db
      .query('friendRequests')
      .filter((q) => q.and(q.eq(q.field('to'), targetId), q.eq(q.field('from'), user.subject), q.eq(q.field('status'), 'pending')))
      .first();
    return !!requestSent;
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
      .query('friendRequests')
      .filter((q) => q.and(q.eq('to', targetId), q.eq('from', user.subject), q.eq('status', 'pending')))
      .first();

    return !!request;
  },
});

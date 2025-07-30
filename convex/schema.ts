import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    username: v.optional(v.string()),
    emailVerified: v.optional(v.boolean()),
    updatedAt: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
  }).index('by_clerkId', ['clerkId']),

  friends: defineTable({
    userIdOne: v.string(),
    userIdTwo: v.string(),
    createdAt: v.number(),
  })
    .index('by_userIdOne', ['userIdOne'])
    .index('by_userIdTwo', ['userIdTwo']),

  requests: defineTable({
    from: v.string(),
    to: v.string(),
    createdAt: v.number(),
  })
    .index('by_to', ['to'])
    .index('by_from', ['from']),

  chats: defineTable({
    userIdOne: v.string(),
    userIdTwo: v.string(),
    createdAt: v.number(),
  })
    .index('by_userIdOne', ['userIdOne'])
    .index('by_userIdTwo', ['userIdTwo']),

  groups: defineTable({
    name: v.string(),
    memberIds: v.array(v.string()),
    createdBy: v.string(),
    createdAt: v.number(),
  }).index('by_memberIds', ['memberIds']),

  messages: defineTable({
    chatId: v.string(),
    senderId: v.string(),
    content: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_chatId', ['chatId']),

  typing: defineTable({
    chatId: v.string(),
    userId: v.string(),
    typing: v.boolean(),
    updatedAt: v.number(),
  }).index('by_chatId', ['chatId']),

  presence: defineTable({
    userId: v.string(),
    lastSeen: v.number(),
  }).index('by_userId', ['userId']),
});

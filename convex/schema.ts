import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    fullName: v.optional(v.string()),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    username: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    emailVerified: v.optional(v.boolean()),
    phoneVerified: v.optional(v.boolean()),
    updatedAt: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
  }).index('by_clerkId', ['clerkId']),

  chats: defineTable({
    name: v.optional(v.string()),
    isGroup: v.boolean(),
    members: v.array(v.string()),
  }),

  messages: defineTable({
    chatId: v.string(),
    senderId: v.string(),
    content: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_chatId', ['chatId']),

  typingIndicators: defineTable({
    chatId: v.string(),
    userId: v.string(),
    typing: v.boolean(),
    updatedAt: v.number(),
  }).index('by_chatId', ['chatId']),

  presence: defineTable({
    userId: v.string(),
    isOnline: v.boolean(),
    lastSeen: v.number(),
  }).index('by_userId', ['userId']),
});

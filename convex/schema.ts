import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    username: v.optional(v.string()),
    emailVerified: v.optional(v.boolean()),
    isAdmin: v.optional(v.boolean()),
  }).index('by_clerkId', ['clerkId']),

  friends: defineTable({
    userIdOne: v.string(),
    userIdTwo: v.string(),
  })
    .index('by_userIdOne', ['userIdOne'])
    .index('by_userIdTwo', ['userIdTwo']),

  requests: defineTable({
    from: v.string(),
    to: v.string(),
  })
    .index('by_to', ['to'])
    .index('by_from', ['from']),

  chats: defineTable({
    userIdOne: v.string(),
    userIdTwo: v.string(),
    userLastReadOne: v.optional(v.number()),
    userLastReadTwo: v.optional(v.number()),
  })
    .index('by_userIdOne', ['userIdOne'])
    .index('by_userIdTwo', ['userIdTwo']),

  groups: defineTable({
    name: v.string(),
    members: v.array(
      v.object({
        userId: v.string(),
        lastReadAt: v.optional(v.number()),
      }),
    ),
    createdBy: v.string(),
  }),

  messages: defineTable({
    chatId: v.string(),
    senderId: v.string(),
    content: v.optional(v.string()),
    attachments: v.optional(v.array(v.object({ url: v.string(), type: v.string(), name: v.string(), size: v.number(), key: v.string() }))),
    editedAt: v.optional(v.number()),
    reactions: v.optional(v.array(v.object({ userId: v.string(), reaction: v.string(), createdAt: v.number() }))),
    reference: v.optional(v.string()), // (messageId) reference to the original message if this is a reply
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

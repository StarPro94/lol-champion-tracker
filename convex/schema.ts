import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),
  userChampionProgress: defineTable({
    userId: v.id("users"),
    championId: v.string(),
    validatedAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_champion", ["userId", "championId"]),
  migrationStates: defineTable({
    userId: v.id("users"),
    source: v.string(),
    migratedAt: v.number(),
    itemCount: v.number(),
  }).index("by_user_source", ["userId", "source"]),
  riotAccounts: defineTable({
    userId: v.id("users"),
    gameName: v.optional(v.string()),
    tagLine: v.optional(v.string()),
    region: v.optional(v.string()),
    linkedAt: v.number(),
    status: v.string(),
  }).index("by_user", ["userId"]),
});
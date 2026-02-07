import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users (auth via Convex Auth)
  users: defineTable({
    username: v.string(),
    email: v.optional(v.string()),
    createdAt: v.number(),
    lastActive: v.number(),
  }).index("by_username", ["username"]),

  // Champion Progress (remplace localStorage)
  championProgress: defineTable({
    userId: v.id("users"),
    championId: v.string(), // "Ahri", "Zed", etc.
    championName: v.string(),
    isPlayed: v.boolean(),
    playedAt: v.optional(v.number()), // timestamp
    laneRoles: v.array(v.string()), // ["MID", "JUNGLE"]
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_champion", ["userId", "championId"]),

  // Riot Account Linking
  riotAccounts: defineTable({
    userId: v.id("users"),
    region: v.string(), // "euw1", "na1", etc.
    summonerName: v.string(),
    summonerId: v.string(),
    puuid: v.string(),
    lastSync: v.optional(v.number()),
    isSyncing: v.boolean(),
  }).index("by_user", ["userId"]),
});

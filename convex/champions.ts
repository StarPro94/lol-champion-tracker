import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Queries
export const getUserProgress = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("championProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return progress;
  },
});

export const getChampionStatus = query({
  args: { userId: v.id("users"), championId: v.string() },
  handler: async (ctx, args) => {
    const status = await ctx.db
      .query("championProgress")
      .withIndex("by_user_champion", (q) =>
        q.eq("userId", args.userId).eq("championId", args.championId)
      )
      .first();

    return status;
  },
});

export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("championProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Convert to map format compatible with existing code
    const played: string[] = [];
    const laneRoles: Record<string, string[]> = {};
    const playedAt: Record<string, string> = {};

    for (const p of progress) {
      if (p.isPlayed) {
        played.push(p.championId);
      }
      if (p.laneRoles.length > 0) {
        laneRoles[p.championId] = p.laneRoles;
      }
      if (p.playedAt) {
        playedAt[p.championId] = new Date(p.playedAt).toISOString();
      }
    }

    return { played, laneRoles, playedAt };
  },
});

// Mutations
export const toggleChampion = mutation({
  args: {
    userId: v.id("users"),
    championId: v.string(),
    championName: v.string(),
    laneRoles: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("championProgress")
      .withIndex("by_user_champion", (q) =>
        q.eq("userId", args.userId).eq("championId", args.championId)
      )
      .first();

    if (existing) {
      // Toggle off
      await ctx.db.delete(existing._id);
      return { isPlayed: false };
    } else {
      // Toggle on
      const now = Date.now();
      await ctx.db.insert("championProgress", {
        userId: args.userId,
        championId: args.championId,
        championName: args.championName,
        isPlayed: true,
        playedAt: now,
        laneRoles: args.laneRoles ?? [],
        updatedAt: now,
      });
      return { isPlayed: true };
    }
  },
});

export const setChampionPlayed = mutation({
  args: {
    userId: v.id("users"),
    championId: v.string(),
    championName: v.string(),
    isPlayed: v.boolean(),
    laneRoles: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("championProgress")
      .withIndex("by_user_champion", (q) =>
        q.eq("userId", args.userId).eq("championId", args.championId)
      )
      .first();

    const now = Date.now();

    if (args.isPlayed && !existing) {
      // Add as played
      await ctx.db.insert("championProgress", {
        userId: args.userId,
        championId: args.championId,
        championName: args.championName,
        isPlayed: true,
        playedAt: now,
        laneRoles: args.laneRoles ?? [],
        updatedAt: now,
      });
    } else if (!args.isPlayed && existing) {
      // Remove
      await ctx.db.delete(existing._id);
    } else if (existing && args.laneRoles) {
      // Update lane roles
      await ctx.db.patch(existing._id, {
        laneRoles: args.laneRoles,
        updatedAt: now,
      });
    }

    return { success: true };
  },
});

export const syncLocalData = mutation({
  args: {
    userId: v.id("users"),
    played: v.array(v.string()),
    laneRoles: v.record(v.string(), v.array(v.string())),
    playedAt: v.record(v.string(), v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    for (const championId of args.played) {
      const existing = await ctx.db
        .query("championProgress")
        .withIndex("by_user_champion", (q) =>
          q.eq("userId", args.userId).eq("championId", championId)
        )
        .first();

      if (!existing) {
        await ctx.db.insert("championProgress", {
          userId: args.userId,
          championId,
          championName: championId, // Will be updated with real name
          isPlayed: true,
          playedAt: args.playedAt[championId]
            ? new Date(args.playedAt[championId]).getTime()
            : now,
          laneRoles: args.laneRoles[championId] ?? [],
          updatedAt: now,
        });
      }
    }

    return { success: true, importedCount: args.played.length };
  },
});

export const syncChampionsFromRiot = mutation({
  args: {
    userId: v.id("users"),
    champions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let addedCount = 0;

    for (const championName of args.champions) {
      const existing = await ctx.db
        .query("championProgress")
        .withIndex("by_user_champion", (q) =>
          q.eq("userId", args.userId).eq("championId", championName)
        )
        .first();

      if (!existing) {
        await ctx.db.insert("championProgress", {
          userId: args.userId,
          championId: championName,
          championName: championName,
          isPlayed: true,
          playedAt: now,
          laneRoles: [],
          updatedAt: now,
        });
        addedCount++;
      }
    }

    return { success: true, addedCount };
  },
});

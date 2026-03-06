import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";

async function requireUserId(ctx: MutationCtx | QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError("Authentication required");
  }
  return userId;
}

export const getState = query({
  args: { source: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return ctx.db
      .query("migrationStates")
      .withIndex("by_user_source", (q) => q.eq("userId", userId).eq("source", args.source))
      .first();
  },
});

export const migrateLegacyProgress = mutation({
  args: {
    source: v.string(),
    entries: v.array(
      v.object({
        championId: v.string(),
        validatedAt: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existingState = await ctx.db
      .query("migrationStates")
      .withIndex("by_user_source", (q) => q.eq("userId", userId).eq("source", args.source))
      .first();

    if (existingState) {
      return { skipped: true, importedCount: 0 };
    }

    const normalizedEntries = new Map<string, number>();
    for (const entry of args.entries) {
      if (!normalizedEntries.has(entry.championId)) {
        normalizedEntries.set(entry.championId, entry.validatedAt);
      }
    }

    let importedCount = 0;
    for (const [championId, validatedAt] of normalizedEntries.entries()) {
      const existingProgress = await ctx.db
        .query("userChampionProgress")
        .withIndex("by_user_champion", (q) =>
          q.eq("userId", userId).eq("championId", championId),
        )
        .first();

      if (existingProgress) {
        continue;
      }

      await ctx.db.insert("userChampionProgress", {
        userId,
        championId,
        validatedAt,
        createdAt: validatedAt,
        updatedAt: validatedAt,
      });
      importedCount += 1;
    }

    await ctx.db.insert("migrationStates", {
      userId,
      source: args.source,
      migratedAt: Date.now(),
      itemCount: importedCount,
    });

    return { skipped: false, importedCount };
  },
});

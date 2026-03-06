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

export const listForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return ctx.db
      .query("userChampionProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const toggleChampionValidation = mutation({
  args: { championId: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("userChampionProgress")
      .withIndex("by_user_champion", (q) =>
        q.eq("userId", userId).eq("championId", args.championId),
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { championId: args.championId, isValidated: false };
    }

    const now = Date.now();
    await ctx.db.insert("userChampionProgress", {
      userId,
      championId: args.championId,
      validatedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return { championId: args.championId, isValidated: true, validatedAt: now };
  },
});

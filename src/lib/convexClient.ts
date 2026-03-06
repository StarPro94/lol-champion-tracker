import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL?.trim();

if (!convexUrl) {
  console.warn("VITE_CONVEX_URL is missing. Convex features stay disabled until it is configured.");
}

export const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Get Convex URL from environment variable or use default for development
const convexUrl = import.meta.env.VITE_CONVEX_URL || "";

if (!convexUrl) {
  console.warn(
    "VITE_CONVEX_URL is not set. Convex features will be disabled. " +
    "Run 'npx convex dev' to get the URL."
  );
}

export const convex = new ConvexReactClient(convexUrl);

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

export const ConvexClientProvider: React.FC<ConvexClientProviderProps> = ({ children }) => {
  if (!convexUrl) {
    return React.createElement(React.Fragment, null, children);
  }

  return React.createElement(
    ConvexProvider,
    { client: convex },
    children
  );
};

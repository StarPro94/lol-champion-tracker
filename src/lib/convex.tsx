import { ConvexAuthProvider } from "@convex-dev/auth/react";
import type { PropsWithChildren } from "react";
import { convexClient } from "./convexClient";

export function ConvexClientProvider({ children }: PropsWithChildren) {
  if (convexClient === null) {
    return children;
  }

  return <ConvexAuthProvider client={convexClient}>{children}</ConvexAuthProvider>;
}

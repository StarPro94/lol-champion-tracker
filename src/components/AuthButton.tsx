import React, { useState } from "react";
import "./AuthButton.css";

// Placeholder for Auth functionality
// Once Convex is properly set up with 'npx convex dev', we can use the real auth
// The @convex-dev/auth/react package exports might be different

export const AuthButton: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if Convex is configured
  const convexUrl = import.meta.env.VITE_CONVEX_URL;

  if (!convexUrl) {
    return (
      <button
        type="button"
        className="auth-button auth-disabled"
        title="Convex not configured. Run 'npx convex dev' to enable sync."
        disabled
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 3C5.23858 3 3 5.23858 3 8C3 10.7614 5.23858 13 8 13C10.7614 13 13 10.7614 13 8C13 5.23858 10.7614 3 8 3Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        Sync (Coming Soon)
      </button>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="auth-button-group">
        <button
          type="button"
          className="auth-button auth-logout"
          onClick={() => setIsAuthenticated(false)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 3H3C2.44772 3 2 3.44772 2 4V12C2 12.5523 2.44772 13 3 13H6M10 8L14 8M10 8L6 4M10 8L6 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="auth-button auth-login"
      onClick={() => setIsAuthenticated(true)}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 3C5.23858 3 3 5.23858 3 8C3 10.7614 5.23858 13 8 13C10.7614 13 13 10.7614 13 8C13 5.23858 10.7614 3 8 3Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 5V8L10 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      Sign In
    </button>
  );
};

import React from "react";
import { useAuth } from "../context/AuthContext";
import Landing from "./Landing";
import Shopping from "./Shopping";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  // Show Landing page for non-authenticated users
  if (!isAuthenticated) {
    return <Landing />;
  }

  // Only families should access the shopping page
  // Vendors and donators will be redirected to their respective dashboards
  if (user?.role === "family") {
    return <Shopping />;
  }

  // For other authenticated users (vendors, donators), show the landing page
  // as it explains the platform (they have their own dashboards)
  return <Landing />;
}

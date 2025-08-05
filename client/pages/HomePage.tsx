import React from "react";
import { useAuth } from "../context/AuthContext";
import Landing from "./Landing";
import Index from "./Index";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  // Show Landing page for non-authenticated users
  if (!isAuthenticated) {
    return <Landing />;
  }

  // For authenticated users, show Index (families can shop, others can see products but not shop)
  return <Index />;
}

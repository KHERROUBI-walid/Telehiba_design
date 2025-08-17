import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "../context/AuthContext";
import { ROLE_MAPPING } from "../types/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo = "/login",
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated but doesn't have the required role
  if (
    isAuthenticated &&
    allowedRoles.length > 0 &&
    user &&
    user.type_utilisateur
  ) {
    const userRole = ROLE_MAPPING[user.type_utilisateur];
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on user role
      const roleRedirects: Record<UserRole, string> = {
        family: "/",
        vendor: "/vendor-dashboard",
        donator: "/donator-dashboard",
      };

      return <Navigate to={roleRedirects[userRole]} replace />;
    }
  }

  // If all checks pass, render the component
  return <>{children}</>;
};

// Specific role-based protection components for easier use
export const FamilyRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute allowedRoles={["family"]}>{children}</ProtectedRoute>;

export const VendorRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute allowedRoles={["vendor"]}>{children}</ProtectedRoute>;

export const DonatorRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute allowedRoles={["donator"]}>{children}</ProtectedRoute>;

// Component for routes that should only be accessible when NOT authenticated
export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    // Redirect authenticated users to their appropriate dashboard
    const roleRedirects: Record<UserRole, string> = {
      family: "/",
      vendor: "/vendor-dashboard",
      donator: "/donator-dashboard",
    };

    return <Navigate to={roleRedirects[user.type_utilisateur]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

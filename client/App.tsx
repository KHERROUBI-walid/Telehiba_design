import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import CartSidebar from "./components/CartSidebar";
import ApiStatus from "./components/common/ApiStatus";
import ConnectionBanner from "./components/common/ConnectionBanner";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ProtectedRoute, {
  VendorRoute,
  DonatorRoute,
  FamilyRoute,
  PublicOnlyRoute,
} from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shopping from "./pages/Shopping";
import Landing from "./pages/Landing";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VendorProducts from "./pages/VendorProducts";
import VendorDashboard from "./pages/VendorDashboard";
import VendorOrders from "./pages/VendorOrders";
import VendorScanner from "./pages/VendorScanner";
import DonatorDashboard from "./pages/DonatorDashboard";
import CategoryProducts from "./pages/CategoryProducts";
import AllCategories from "./pages/AllCategories";
import AllVendors from "./pages/AllVendors";
import AllProducts from "./pages/AllProducts";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Check if we're in demo mode (API not available)
const isCloudEnvironment =
  window.location.hostname.includes(".fly.dev") ||
  window.location.hostname.includes(".vercel.app") ||
  window.location.hostname.includes(".netlify.app") ||
  window.location.hostname.includes(".herokuapp.com");

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const isApiAvailable =
  Boolean(apiBaseUrl) &&
  !(isCloudEnvironment && apiBaseUrl.includes("127.0.0.1"));

console.log("🏗️  Environment:", {
  hostname: window.location.hostname,
  isCloudEnvironment,
  apiBaseUrl: apiBaseUrl || "not configured",
  isApiAvailable,
});

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <ConnectionBanner
              isConnected={isApiAvailable}
              isDemoMode={!isApiAvailable}
            />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes - accessible to everyone */}
                <Route path="/" element={<HomePage />} />

                {/* Public only routes - redirect if authenticated */}
                <Route
                  path="/login"
                  element={
                    <PublicOnlyRoute>
                      <Login />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PublicOnlyRoute>
                      <SignUp />
                    </PublicOnlyRoute>
                  }
                />

                {/* Shopping page - families only */}
                <Route
                  path="/shopping"
                  element={
                    <FamilyRoute>
                      <Shopping />
                    </FamilyRoute>
                  }
                />

                {/* General marketplace routes - accessible to all authenticated users */}
                <Route
                  path="/vendor-products"
                  element={
                    <ProtectedRoute>
                      <VendorProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/category-products"
                  element={
                    <ProtectedRoute>
                      <CategoryProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/all-categories"
                  element={
                    <ProtectedRoute>
                      <AllCategories />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/all-vendors"
                  element={
                    <ProtectedRoute>
                      <AllVendors />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/all-products"
                  element={
                    <ProtectedRoute>
                      <AllProducts />
                    </ProtectedRoute>
                  }
                />

                {/* Family-specific routes */}
                <Route
                  path="/orders"
                  element={
                    <FamilyRoute>
                      <Orders />
                    </FamilyRoute>
                  }
                />
                <Route
                  path="/order-details/:orderId"
                  element={
                    <FamilyRoute>
                      <OrderDetails />
                    </FamilyRoute>
                  }
                />

                {/* Vendor-specific routes */}
                <Route
                  path="/vendor-dashboard"
                  element={
                    <VendorRoute>
                      <VendorDashboard />
                    </VendorRoute>
                  }
                />
                <Route
                  path="/vendor-orders"
                  element={
                    <VendorRoute>
                      <VendorOrders />
                    </VendorRoute>
                  }
                />
                <Route
                  path="/vendor-scanner"
                  element={
                    <VendorRoute>
                      <VendorScanner />
                    </VendorRoute>
                  }
                />

                {/* Donator-specific routes */}
                <Route
                  path="/donator-dashboard"
                  element={
                    <DonatorRoute>
                      <DonatorDashboard />
                    </DonatorRoute>
                  }
                />

                {/* User account routes - require authentication */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-profile"
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/change-password"
                  element={
                    <ProtectedRoute>
                      <ChangePassword />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CartSidebar />
              <ApiStatus />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);

import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VendorProducts from "./pages/VendorProducts";
import CategoryProducts from "./pages/CategoryProducts";
import AllCategories from "./pages/AllCategories";
import AllVendors from "./pages/AllVendors";
import AllProducts from "./pages/AllProducts";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vendor-products" element={<VendorProducts />} />
            <Route path="/category-products" element={<CategoryProducts />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/notifications" element={<Notifications />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CartSidebar />
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

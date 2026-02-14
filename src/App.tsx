import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AuthGuard from "./components/auth/AuthGuard";
import { MenuProvider } from "./contexts/MenuContext";
import { CartProvider } from "@/features/cart/context/CartContext";
import AnimatedBackground from "./components/AnimatedBackground";
import { ToastProvider } from "@/components/ui/Toast/ToastContext";
import CartSidebar from "@/features/cart/components/CartSidebar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MenuProvider>
      <CartProvider>
        <ToastProvider>
          <CartSidebar />
          <AnimatedBackground />
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                } />
                <Route path="/admin" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AuthGuard requireAdmin={true}>
                      <AdminDashboard />
                    </AuthGuard>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ToastProvider>
      </CartProvider>
    </MenuProvider>
  </QueryClientProvider>
);

export default App;

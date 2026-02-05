
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailConfirmation from "./pages/EmailConfirmation";
import ConfirmAccount from "./pages/ConfirmAccount";
import LandlordDashboard from "./pages/LandlordDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import Properties from "./pages/Properties";
import Tenants from "./pages/Tenants";
import Maintenance from "./pages/Maintenance";
import PropertyVerification from "./pages/PropertyVerification";
import MyRentals from "./pages/MyRentals";
import PayRent from "./pages/PayRent";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            <Route path="/confirm-account" element={<ConfirmAccount />} />
            <Route 
              path="/landlord-dashboard" 
              element={
                <ProtectedRoute requiredRole="landlord">
                  <LandlordDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tenant-dashboard" 
              element={
                <ProtectedRoute requiredRole="tenant">
                  <TenantDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/properties" 
              element={
                <ProtectedRoute>
                  <Properties />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-rentals" 
              element={
                <ProtectedRoute requiredRole="tenant">
                  <MyRentals />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pay-rent" 
              element={
                <ProtectedRoute requiredRole="tenant">
                  <PayRent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tenants" 
              element={
                <ProtectedRoute requiredRole="landlord">
                  <Tenants />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/maintenance" 
              element={
                <ProtectedRoute>
                  <Maintenance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/property-verification" 
              element={
                <ProtectedRoute>
                  <PropertyVerification />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

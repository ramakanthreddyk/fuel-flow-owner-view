import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UnifiedLayout from "@/layouts/UnifiedLayout";
import { AuthProvider } from "@/context/AuthContext";
import AuthPage from "@/pages/AuthPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import React from "react";

// Import new simplified unified pages
import DashboardPage from "@/pages/Dashboard";
import StationsPage from "@/pages/Stations";
import SalesPage from "@/pages/Sales";
import DataEntryPage from "@/pages/DataEntry";
import UsersPage from "@/pages/Users";
import SettingsPage from "@/pages/Settings";
import NotFound from "./pages/NotFound";
import EmployeesPage from "@/pages/Employees";

const queryClient = new QueryClient();

// Move App to a function so we can use hooks for conditional rendering/layout
const App = () => {
  // useAuth should work at root level because <AuthProvider> wraps the app
  const { user, loading } = useAuth();

  // Show a global navbar on all routes
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              {/* Auth/Login / Signup Page */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Unauthenticated: only root landing page */}
              {!user && !loading && (
                <>
                  <Route path="/" element={<Index />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
              {/* Authenticated: Protected App */}
              {user && (
                <Route
                  path="*"
                  element={
                    <UnifiedLayout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/stations" element={<StationsPage />} />
                        <Route path="/sales" element={<SalesPage />} />
                        <Route path="/data-entry" element={<DataEntryPage />} />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/employees" element={<EmployeesPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </UnifiedLayout>
                  }
                />
              )}
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
      <Toaster />
      <Sonner />
    </QueryClientProvider>
  );
};

export default App;

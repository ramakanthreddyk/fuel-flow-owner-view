
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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<Index />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UnifiedLayout>
              <DashboardPage />
            </UnifiedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stations"
        element={
          <ProtectedRoute>
            <UnifiedLayout>
              <StationsPage />
            </UnifiedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <UnifiedLayout>
              <SalesPage />
            </UnifiedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/data-entry"
        element={
          <ProtectedRoute>
            <UnifiedLayout>
              <DataEntryPage />
            </UnifiedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UnifiedLayout>
              <UsersPage />
            </UnifiedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <UnifiedLayout>
              <SettingsPage />
            </UnifiedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <UnifiedLayout>
              <EmployeesPage />
            </UnifiedLayout>
          </ProtectedRoute>
        }
      />
      {/* Redirect / to /dashboard if logged in */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <UnifiedLayout>
              <NotFound />
            </UnifiedLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

// Move App to a function so we can use hooks for conditional rendering/layout
const App = () => {
  // useAuth should work at root level because <AuthProvider> wraps the app
  // (No longer needed for route logic due to ProtectedRoute usage)
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
      <Toaster />
      <Sonner />
    </QueryClientProvider>
  );
};

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UnifiedLayout from "@/layouts/UnifiedLayout";
import { AuthProvider } from "@/context/AuthContext";
import AuthPage from "@/pages/AuthPage";
import ProtectedRoute from "@/components/ProtectedRoute";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <UnifiedLayout>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              {/* All app pages below are protected */}
              <Route
                path="*"
                element={
                  <ProtectedRoute>
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
                  </ProtectedRoute>
                }
              />
            </Routes>
          </UnifiedLayout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
    <Toaster />
    <Sonner />
  </QueryClientProvider>
);

export default App;

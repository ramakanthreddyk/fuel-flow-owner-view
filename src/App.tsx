
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OwnerDashboard from "./pages/OwnerDashboard";
import { WizardProvider } from "@/context/WizardContext";
import AppSuperadminSidebar from "@/components/superadmin-wizard/AppSuperadminSidebar";

// Wizard step pages
import CreateUser from "@/pages/superadmin-wizard/CreateUser";
import CreateStation from "@/pages/superadmin-wizard/CreateStation";
import AddPumps from "@/pages/superadmin-wizard/AddPumps";
import AddNozzles from "@/pages/superadmin-wizard/AddNozzles";
import AssignEmployee from "@/pages/superadmin-wizard/AssignEmployee";
import WizardSummary from "@/pages/superadmin-wizard/Summary";

const queryClient = new QueryClient();

const SuperadminWizardLayout = ({ children }: { children: React.ReactNode }) => (
  <WizardProvider>
    <div className="flex min-h-screen w-full">
      <AppSuperadminSidebar />
      <main className="flex-1 w-full px-6 py-10 bg-background flex flex-col items-center">
        {children}
      </main>
    </div>
    <Toaster />
    <Sonner />
  </WizardProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          {/* Superadmin wizard */}
          <Route
            path="/superadmin-wizard/*"
            element={
              <SuperadminWizardLayout>
                {/* This inner Routes (below) are for wizard-only area */}
                <Routes>
                  <Route path="/" element={<Navigate to="create-user" />} />
                  <Route path="create-user" element={<CreateUser />} />
                  <Route path="create-station" element={<CreateStation />} />
                  <Route path="add-pumps" element={<AddPumps />} />
                  <Route path="add-nozzles" element={<AddNozzles />} />
                  <Route path="assign-employee" element={<AssignEmployee />} />
                  <Route path="summary" element={<WizardSummary />} />
                  <Route path="*" element={<Navigate to="create-user" />} />
                </Routes>
              </SuperadminWizardLayout>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

import SummaryCards from "@/components/dashboard/SummaryCards";
import SalesChart from "@/components/dashboard/SalesChart";
import TankLevelChart from "@/components/dashboard/TankLevelChart";
import StationHierarchy from "@/components/dashboard/StationHierarchy";
import UpgradeCard from "@/components/dashboard/UpgradeCard";

const MOCK_OWNER = { name: "Amit Sharma", is_premium: false, role: "owner" };

const OwnerDashboard = () => {
  const { toast } = useToast();
  // Simulate loading for charts
  const [loading, setLoading] = useState({ sales: false, tank: false });

  // Testing: show a toast on button click
  const handleTestToast = (type: "success" | "error") =>
    toast({
      title: type === "success" ? "Export Complete" : "Error",
      description:
        type === "success"
          ? "Your export was generated successfully."
          : "Something went wrong during export.",
      // Use the allowed variants: "default" or "destructive"
      variant: type === "success" ? "default" : "destructive",
    });

  // Only allow owners
  if (MOCK_OWNER.role !== "owner") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card>
          <CardContent className="p-8 flex flex-col gap-4 items-center">
            <Lock className="size-12 text-muted-foreground mb-2" />
            <div className="font-semibold text-xl">Access Denied</div>
            <div className="text-muted-foreground">You must be an owner to view this dashboard.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      {/* Header */}
      <header className="w-full pt-8 pb-4 px-2 md:px-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard</h1>
            <div className="text-muted-foreground text-lg">
              Welcome, {MOCK_OWNER.name}
            </div>
          </div>
          <div className="text-muted-foreground text-base font-medium">{format(new Date(), "do MMMM, yyyy")}</div>
        </div>
      </header>
      {/* Top Summary */}
      <section className="w-full max-w-6xl mx-auto mt-6">
        <SummaryCards />
      </section>
      {/* Main charts */}
      <section className="w-full max-w-6xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 mt-8">
        <Card className="h-[340px] flex flex-col">
          <CardContent className="flex-1 pt-6 pb-2">
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-lg">7-Day Sales Trend</span>
              <span className="text-xs text-muted-foreground">₹ per day</span>
            </div>
            <SalesChart loading={loading.sales} />
          </CardContent>
        </Card>
        <Card className="h-[340px] flex flex-col">
          <CardContent className="flex-1 pt-6 pb-2">
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-lg">Tank Stock Levels</span>
              <span className="text-xs text-muted-foreground">% Filled</span>
            </div>
            <TankLevelChart loading={loading.tank} />
          </CardContent>
        </Card>
      </section>
      {/* Station Hierarchy */}
      <section className="w-full max-w-6xl mx-auto mt-10">
        <div className="font-semibold text-lg mb-3">Station → Pump → Nozzle Overview</div>
        <StationHierarchy />
      </section>
      {/* Upgrade Card */}
      {!MOCK_OWNER.is_premium && (
        <section className="w-full max-w-6xl mx-auto mt-10">
          <UpgradeCard />
        </section>
      )}
      {/* Toast test controls */}
      <section className="fixed bottom-6 right-8 flex flex-col gap-2 z-40">
        <button
          className="bg-primary text-primary-foreground px-5 py-2 rounded-md font-semibold shadow hover:bg-primary/90 transition"
          onClick={() => handleTestToast("success")}
        >
          Show Success Toast
        </button>
        <button
          className="bg-destructive text-destructive-foreground px-5 py-2 rounded-md font-semibold shadow hover:bg-destructive/90 transition"
          onClick={() => handleTestToast("error")}
        >
          Show Error Toast
        </button>
      </section>
    </main>
  );
};

export default OwnerDashboard;

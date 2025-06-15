
import { useUser } from "@/context/UserContext";
import RequireRole from "@/components/RequireRole";
import { useQuery } from "@tanstack/react-query";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { AddStationDialog } from "@/components/AddStationDialog";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

type SalesByDay = { date: string; totalSales: number };

interface DashboardData {
  salesByDay: SalesByDay[];
}

async function fetchSalesByDayForUser(userId: string): Promise<SalesByDay[]> {
  // Fetch stations for user (owner or employee). For demo, owner
  const { data: stations, error: stnError } = await supabase
    .from("stations")
    .select("id, name, created_at")
    .eq("created_by", userId);

  if (stnError) throw new Error("Failed to fetch stations: " + stnError.message);

  const stationIds = (stations || []).map(s => s.id);
  if (!stationIds.length) return [];

  // Fetch sales for these stations, group by date
  // We'll fetch all sales from last 7 days for these stations and rollup totals
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const { data: sales, error: salesError } = await supabase
    .from("sales")
    .select("station_id, recorded_at, amount")
    .in("station_id", stationIds)
    .gte("recorded_at", since.toISOString());

  if (salesError) throw new Error("Failed to fetch sales: " + salesError.message);

  // Group sales by day (YYYY-MM-DD), sum amount
  const dayMap: Record<string, number> = {};
  (sales || []).forEach((sale) => {
    const day = sale.recorded_at ? sale.recorded_at.slice(0, 10) : "";
    if (!day) return;
    if (!dayMap[day]) dayMap[day] = 0;
    dayMap[day] += Number(sale.amount || 0);
  });

  // Fill each recent day even if no sales
  const days: SalesByDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    days.push({ date: dateStr, totalSales: dayMap[dateStr] || 0 });
  }
  return days;
}

export default function StationsPage() {
  const { user, loading, error } = useUser();
  console.log("[StationsPage] useUser():", { user, loading, error });

  const { data: salesByDay, isLoading, error: queryError } = useQuery({
    queryKey: ["sales-by-day", user?.id],
    queryFn: () => user?.id ? fetchSalesByDayForUser(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
  });

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!user) return <div className="p-8 text-gray-600">No user data found.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Stations</h1>
      {/* Hide or show controls/buttons based on role */}
      <RequireRole roles={["superadmin"]}>
        <AddStationDialog />
      </RequireRole>
      <div className="p-4 border rounded bg-white mb-8">
        <h2 className="font-semibold text-lg mb-3">Sales By Day</h2>
        {isLoading && <div>Loading sales data...</div>}
        {queryError && <div className="text-red-600">Error loading data</div>}
        {salesByDay && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead align="right">Total Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesByDay.map((s) => (
                <TableRow key={s.date}>
                  <TableCell>{s.date}</TableCell>
                  <TableCell align="right">{s.totalSales.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="p-4 border rounded bg-white">Here’s where your station list goes...</div>
    </div>
  );
}

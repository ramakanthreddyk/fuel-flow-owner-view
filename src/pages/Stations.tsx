
import { useUser } from "@/context/UserContext";
import RequireRole from "@/components/RequireRole";
import { useQuery } from "@tanstack/react-query";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { AddStationDialog } from "@/components/AddStationDialog";

type SalesByDay = { date: string; totalSales: number };

interface DashboardData {
  salesByDay: SalesByDay[];
}

async function fetchDashboard(userId: string): Promise<DashboardData> {
  const res = await fetch(`/api/dashboard/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
}

export default function StationsPage() {
  const { user, loading, error } = useUser();
  console.log("[StationsPage] useUser():", { user, loading, error });

  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ["dashboard", user?.id],
    queryFn: () => fetchDashboard(user?.id || ""),
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
        {data && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead align="right">Total Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.salesByDay.map((s) => (
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

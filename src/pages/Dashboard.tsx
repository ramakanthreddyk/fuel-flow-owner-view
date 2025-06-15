
import { useUser } from "@/context/UserContext";
import RequirePlan from "@/components/RequirePlan";
import RequireRole from "@/components/RequireRole";

export default function DashboardPage() {
  const user = useUser();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="mb-6 text-gray-700">Welcome, {user.name} ({user.role})!</div>
      {/* Example guarded section */}
      <RequirePlan plans={["premium"]}>
        <div className="p-4 mb-4 bg-blue-50 border rounded">Premium Analytics 🏆</div>
      </RequirePlan>
      <RequireRole roles={["owner"]}>
        <div className="p-4 mb-4 border rounded">Manage your stations here.</div>
      </RequireRole>
      <RequireRole roles={["employee"]}>
        <div className="p-4 mb-4 border rounded">See your assigned station data.</div>
      </RequireRole>
    </div>
  );
}

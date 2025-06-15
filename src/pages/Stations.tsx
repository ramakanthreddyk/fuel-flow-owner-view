
import { useUser } from "@/context/UserContext";
import RequireRole from "@/components/RequireRole";

export default function StationsPage() {
  const user = useUser();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Stations</h1>
      {/* Hide or show controls/buttons based on role */}
      <RequireRole roles={["owner", "superadmin"]}>
        <button className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded">Add Station</button>
      </RequireRole>
      <div className="p-4 border rounded bg-white">Here’s where your station list goes...</div>
    </div>
  );
}

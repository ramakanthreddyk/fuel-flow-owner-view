
import RequireRole from "@/components/RequireRole";

export default function UsersPage() {
  return (
    <RequireRole roles={["superadmin"]}>
      <div>
        <h1 className="text-3xl font-bold mb-4">User Management</h1>
        <div className="p-4 border rounded bg-white">Superadmin-only list/users management here.</div>
      </div>
    </RequireRole>
  );
}

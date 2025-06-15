
import { useUser } from "@/context/UserContext";

export default function SettingsPage() {
  const { user, loading, error } = useUser();
  console.log("[SettingsPage] useUser():", { user, loading, error });

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!user) return <div className="p-8 text-gray-600">No user data found.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <div className="p-4 border rounded bg-white">
        Settings for {user.name} — role: {user.role} — plan: {user.plan}
      </div>
    </div>
  );
}


import { useUser } from "@/context/UserContext";

export default function SettingsPage() {
  const user = useUser();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <div className="p-4 border rounded bg-white">
        Settings for {user.name} — role: {user.role} — plan: {user.plan}
      </div>
    </div>
  );
}

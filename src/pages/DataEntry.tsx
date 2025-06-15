
import { useUser } from "@/context/UserContext";

export default function DataEntryPage() {
  const user = useUser();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Data Entry</h1>
      <div className="p-4 border rounded bg-white">Forms and data input tools here.</div>
    </div>
  );
}

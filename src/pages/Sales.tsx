
import { useUser } from "@/context/UserContext";

export default function SalesPage() {
  const user = useUser();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Sales</h1>
      <div className="p-4 border rounded bg-white">Sales analytics and transaction data visible here.</div>
    </div>
  );
}

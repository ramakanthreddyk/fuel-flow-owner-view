
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const STATIONS = [
  { station_id: "station_a", station_name: "Fuel Point Main" },
  { station_id: "station_b", station_name: "Express Service" },
  { station_id: "station_c", station_name: "Downtown Pumpz" }
];

const StepAssignStation: React.FC<{
  onNext: (assignedStation: { station_id: string; station_name: string }) => void;
  onBack: () => void;
}> = ({ onNext }) => {
  const [sel, setSel] = useState<string>(STATIONS[0].station_id);
  const [loading, setLoading] = useState(false);

  async function handleAssign() {
    setLoading(true);
    toast({ title: "Assigning...", description: "Simulating request." });
    await new Promise(r => setTimeout(r, 900));
    toast({ title: "Employee assigned!", variant: "default" });
    const found = STATIONS.find(s => s.station_id === sel)!;
    onNext(found);
  }

  return (
    <div className="grid gap-5">
      <div>
        <label className="block mb-1 font-medium">Select Station *</label>
        <select className="w-full border rounded py-2 px-2 bg-background"
          value={sel}
          onChange={e => setSel(e.target.value)}
        >
          {STATIONS.map(s => (
            <option key={s.station_id} value={s.station_id}>{s.station_name}</option>
          ))}
        </select>
      </div>
      <Button onClick={handleAssign} disabled={loading}>
        {loading ? "Assigning..." : "Next"}
      </Button>
    </div>
  );
};

export default StepAssignStation;

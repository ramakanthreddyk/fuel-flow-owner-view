
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const StepAddPumps: React.FC<{
  defaultValues?: { label: string }[];
  onNext: (pumps: { label: string; pump_id?: string }[]) => void;
  onBack: () => void;
}> = ({ defaultValues, onNext, onBack }) => {
  const [pumps, setPumps] = useState(defaultValues || []);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  function addPump() {
    if (!label.trim()) return;
    setPumps(ps => [...ps, { label }]);
    setLabel("");
  }

  async function handleNext() {
    if (pumps.length === 0) {
      setError("Please add at least one pump.");
      return;
    }
    setLoading(true);
    toast({ title: "Adding pumps...", description: "Simulating request." });
    await new Promise(r => setTimeout(r, 1000));
    toast({ title: "Pumps added!", variant: "default" });
    // Generate dummy pump_id
    onNext(pumps.map(p => ({ ...p, pump_id: "pump_" + Math.random().toString(36).slice(2,9) })));
  }

  return (
    <div className="grid gap-5">
      <div>
        <div className="font-semibold mb-2">Pumps Added:</div>
        {pumps.length === 0 && <div className="text-muted-foreground text-sm">No pumps added yet.</div>}
        <ul className="flex flex-col gap-1">{pumps.map((p, i) => (
          <li key={i} className="border px-3 py-1 rounded bg-muted">{p.label}</li>
        ))}</ul>
      </div>
      <div className="flex gap-2 mt-3">
        <Input
          placeholder="Pump Label"
          value={label}
          onChange={e => setLabel(e.target.value)}
        />
        <Button type="button" onClick={addPump} disabled={!label.trim()}>
          Add Pump
        </Button>
      </div>
      {error && <div className="text-destructive text-sm">{error}</div>}
      <Button onClick={handleNext} disabled={loading || pumps.length === 0}>
        {loading ? "Saving..." : "Next"}
      </Button>
    </div>
  );
};

export default StepAddPumps;

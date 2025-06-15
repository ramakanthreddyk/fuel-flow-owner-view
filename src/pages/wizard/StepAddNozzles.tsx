
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

type Props = {
  pumps: { label: string; pump_id?: string }[];
  defaultValues?: any[];
  onNext: (nozzles: any[]) => void;
  onBack: () => void;
};

const NOZZLE_TYPES = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" }
];

const StepAddNozzles: React.FC<Props> = ({ pumps, defaultValues, onNext, onBack }) => {
  const [nozzles, setNozzles] = useState<{ pump_idx: number; label: string; fuel_type: "petrol"|"diesel"; initial_cumulative_reading?: string; }[]>(defaultValues || []);
  const [form, setForm] = useState({ label: "", fuel_type: "petrol", initial_cumulative_reading: "" });
  const [selectedPumpIdx, setSelectedPumpIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const handleAddNozzle = () => {
    if (!form.label) return setError("Nozzle label required.");
    setNozzles(nz => [...nz, { ...form, pump_idx: selectedPumpIdx }]);
    setForm({ label: "", fuel_type: "petrol", initial_cumulative_reading: "" });
    setError(null);
  };

  async function handleNext() {
    if (!nozzles.length) {
      setError("Please add at least one nozzle.");
      return;
    }
    setLoading(true);
    toast({ title: "Saving nozzles...", description: "Simulating request." });
    await new Promise(r => setTimeout(r, 1000));
    toast({ title: "Nozzles added!", variant: "default" });
    onNext(nozzles.map(nz => ({ ...nz, nozzle_id: "nozzle_" + Math.random().toString(36).slice(2,9) })));
  }

  return (
    <div className="grid gap-5">
      <div>
        <Label htmlFor="pump">Pump</Label>
        <select className="w-full border rounded py-2 px-2 bg-background" id="pump"
          value={selectedPumpIdx}
          onChange={e => setSelectedPumpIdx(Number(e.target.value))}
        >
          {pumps.map((p, idx) => (
            <option key={idx} value={idx}>{p.label}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="label">Nozzle Label *</Label>
        <Input id="label" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
      </div>
      <div>
        <Label htmlFor="fuel_type">Fuel Type *</Label>
        <select id="fuel_type" className="w-full border rounded py-2 px-2 bg-background" value={form.fuel_type}
          onChange={e => setForm(f => ({ ...f, fuel_type: e.target.value }))}>
          {NOZZLE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div>
        <Label htmlFor="init_read">Initial Cumulative Reading</Label>
        <Input id="init_read" value={form.initial_cumulative_reading} onChange={e =>
          setForm(f => ({ ...f, initial_cumulative_reading: e.target.value }))} type="number" min={0}/>
      </div>
      <Button type="button" onClick={handleAddNozzle} disabled={!form.label}>
        Add Nozzle
      </Button>
      <div>
        <div className="font-semibold mb-2">Nozzles:</div>
        <ul className="flex flex-col gap-1">
          {nozzles.map((nz, i) => (
            <li key={i} className="border px-3 py-1 rounded bg-muted">
              Pump: {pumps[nz.pump_idx]?.label || "?"} | {nz.label} | {nz.fuel_type} {nz.initial_cumulative_reading ? `| Init: ${nz.initial_cumulative_reading}` : ""}
            </li>
          ))}
        </ul>
        {nozzles.length === 0 && <div className="text-muted-foreground text-sm">No nozzles added yet.</div>}
      </div>
      {error && <div className="text-destructive text-sm">{error}</div>}
      <Button onClick={handleNext} disabled={loading || !nozzles.length}>
        {loading ? "Saving..." : "Next"}
      </Button>
    </div>
  );
};

export default StepAddNozzles;

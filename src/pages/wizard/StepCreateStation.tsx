
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const INIT = { station_name: "", address: "", city: "", state: "" };

const StepCreateStation: React.FC<{
  defaultValues?: any;
  onNext: (station: any) => void;
  onBack: () => void;
}> = ({ defaultValues, onNext }) => {
  const [form, setForm] = useState(defaultValues || INIT);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    toast({ title: "Creating station...", description: "Simulating request." });
    await new Promise(r => setTimeout(r, 1200));
    toast({ title: "Station created!", description: `${form.station_name}`, variant: "default" });
    onNext({ ...form, station_id: "station_" + Math.random().toString(36).slice(2,10) });
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="station_name">Station Name *</Label>
        <Input id="station_name" name="station_name" required value={form.station_name} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={form.address} onChange={handleChange} />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={form.city} onChange={handleChange} />
        </div>
        <div className="flex-1">
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" value={form.state} onChange={handleChange} />
        </div>
      </div>
      <Button type="submit" disabled={loading || !form.station_name}>
        {loading ? "Creating..." : "Next"}
      </Button>
    </form>
  );
};

export default StepCreateStation;

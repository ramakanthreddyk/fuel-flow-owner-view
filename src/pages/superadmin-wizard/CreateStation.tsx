
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import WizardNavButtons from "@/components/superadmin-wizard/WizardNavButtons";
import { toast } from "@/components/ui/use-toast";

export default function CreateStation() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast({
      title: "Simulated submit",
      description: "Normally this would send data to the backend.",
    });
    // Simulate some async delay
    await new Promise((r) => setTimeout(r, 1000));
    toast({
      title: "Station Created!",
      description: `${form.name} in ${form.city || "Unknown City"}`,
    });
    setLoading(false);
    // You might want to move to next step here
  };

  return (
    <Card className="max-w-xl w-full p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2">Create Station</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="name">Station Name *</Label>
          <Input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Fuel Point Main"
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="e.g. 123 Main St"
            disabled={loading}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. New City"
              disabled={loading}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="e.g. CA"
              disabled={loading}
            />
          </div>
        </div>
        <Button type="submit" disabled={loading || !form.name}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </form>
      <div className="rounded bg-indigo-50 dark:bg-indigo-900/30 p-4 text-sm text-indigo-900 dark:text-indigo-50 mt-2">
        <strong>API Example:</strong> Submitting this form would call <code>POST /stations</code> on your Node.js backend (see below for OpenAPI/endpoint spec!).
      </div>
      <WizardNavButtons />
    </Card>
  );
}

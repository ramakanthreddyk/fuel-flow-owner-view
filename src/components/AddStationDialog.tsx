
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // <-- make sure import
import { toast } from "@/components/ui/use-toast";

interface AddStationDialogProps {
  onStationAdded?: (station: any) => void;
}

const PLAN_OPTIONS = [
  { value: "free", label: "Free Plan" },
  { value: "premium", label: "Premium Plan" }
];

export function AddStationDialog({ onStationAdded }: AddStationDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    address: "",
    city: "",
    state: "",
    planId: "free"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePlanChange = (value: string) => {
    setForm(f => ({ ...f, planId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast({
      title: "Station added",
      description: `Station '${form.name}' was created.`,
      variant: "default",
    });
    setLoading(false);
    setOpen(false);
    setForm({ name: "", brand: "", address: "", city: "", state: "", planId: "free" });
    if (onStationAdded) onStationAdded(form);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded">Add Station</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Station</DialogTitle>
          <DialogDescription>
            Fill out the details for your new station.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 mt-2" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Station Name *</label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="brand">Brand</label>
            <Input id="brand" name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. IndianOil" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="address">Address</label>
            <Input id="address" name="address" value={form.address} onChange={handleChange} />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1" htmlFor="city">City</label>
              <Input id="city" name="city" value={form.city} onChange={handleChange} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1" htmlFor="state">State</label>
              <Input id="state" name="state" value={form.state} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="planId">Plan</label>
            <Select value={form.planId} onValueChange={handlePlanChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Plan" />
              </SelectTrigger>
              <SelectContent>
                {PLAN_OPTIONS.map(plan => (
                  <SelectItem key={plan.value} value={plan.value}>{plan.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !form.name}>
              {loading ? "Adding..." : "Add Station"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


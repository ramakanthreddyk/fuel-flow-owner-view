
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

const INIT = { name: "", email: "", password: "", role: "owner" as "owner"|"employee" };

const StepCreateUser: React.FC<{
  defaultValues?: any;
  onNext: (user: { name: string; email: string; password: string; role: "owner"|"employee"; user_id?: string }) => void;
}> = ({ defaultValues, onNext }) => {
  const [form, setForm] = useState(defaultValues || INIT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null|string>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    toast({ title: "Creating user...", description: "Simulating network request." });
    await new Promise(r => setTimeout(r, 1200));
    // Simulate duplicate email error:
    if (form.email.trim().toLowerCase() === "taken@email.com") {
      setLoading(false);
      setError("Email is already taken");
      toast({ title: "Error", description: "This email is already taken.", variant: "destructive" });
      return;
    }
    // Simulate successful user creation
    toast({ title: "User created!", description: `Role: ${form.role}`, variant: "default" });
    onNext({ ...form, user_id: "user_" + Math.random().toString(36).slice(2,9) });
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input id="name" name="name" required value={form.name} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="password">Password *</Label>
        <Input id="password" name="password" type="password" required value={form.password} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="role">Role *</Label>
        <select id="role" name="role" value={form.role} onChange={handleChange} className="w-full border rounded py-2 px-2 bg-background text-foreground" required>
          <option value="owner">Owner</option>
          <option value="employee">Employee</option>
        </select>
      </div>
      {error && <div className="text-destructive text-sm">{error}</div>}
      <Button type="submit" disabled={loading || !form.name || !form.email || !form.password || !form.role}>
        {loading ? "Creating..." : "Next"}
      </Button>
    </form>
  );
};

export default StepCreateUser;

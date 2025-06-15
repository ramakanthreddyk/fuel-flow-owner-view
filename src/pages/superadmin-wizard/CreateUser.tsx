
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import WizardNavButtons from "@/components/superadmin-wizard/WizardNavButtons";
import { toast } from "@/components/ui/use-toast";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "owner",
};

export default function CreateUser() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Simulated API
    await new Promise((r) => setTimeout(r, 700));
    toast({
      title: "User created!",
      description: `User: ${form.name}, Email: ${form.email}, Role: ${form.role}`,
    });
    setLoading(false);
  }

  return (
    <Card className="max-w-xl w-full p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2">Create User</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Username *</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="e.g. johndoe"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            autoComplete="username"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            required
            type="email"
            placeholder="e.g. john@example.com"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            placeholder="Enter a password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
          />
        </div>
        <div>
          <Label htmlFor="role">Role *</Label>
          <select
            id="role"
            name="role"
            className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            value={form.role}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="owner">Owner</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        <Button type="submit" disabled={loading || !form.name || !form.email || !form.password}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </form>
      <div className="rounded bg-blue-50 dark:bg-blue-900/30 p-4 text-sm text-blue-700 dark:text-blue-100">
        <strong>Note:</strong> This information is not sent to a backend.<br />
        You can later replace the "submit" handler to call your real backend API.
      </div>
      <WizardNavButtons />
    </Card>
  );
}

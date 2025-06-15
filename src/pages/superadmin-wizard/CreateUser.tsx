
import React, { useState, useContext } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { User as UserIcon, Mail, Lock, BadgeAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { WizardContext } from "@/context/WizardContext";

const schema = z.object({
  name: z.string().min(2, "Username is required"),
  email: z.string().email("Email format invalid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["owner", "employee"]),
});

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "owner",
};
type FormState = typeof initialForm;

export default function CreateUser() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const wizardCtx = useContext(WizardContext);

  // Validate form with zod
  const validation = schema.safeParse(form);
  const errors: Record<string, string> = {};
  if (!validation.success) {
    for (const err of validation.error.issues) {
      errors[err.path[0]] = err.message;
    }
  }
  const formValid = validation.success;

  // Handlers
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, role: true });
    if (!formValid) return;
    setLoading(true);

    await new Promise((r) => setTimeout(r, 700));
    setSuccess(true);
    // Update wizard context to mark step as completed
    wizardCtx?.setCompletedStep("user");
    toast({
      title: "User staged!",
      description: `User: ${form.name}, Email: ${form.email}, Role: ${form.role}`,
      variant: "default",
    });
    setLoading(false);
    // Mock function
    console.log("User staged:", form);
    // Optionally you could navigate to next step here
  }

  function handleCancel() {
    navigate("/owner-dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-3 py-10">
      <div className="w-full max-w-xl md:max-w-[700px] mx-auto flex flex-col gap-0">
        {/* Step info */}
        <div className="text-gray-500 text-sm font-normal mt-2 mb-2 text-right">Step 1 of 5</div>
        <Card className="border border-gray-200 bg-white shadow-md rounded-xl p-8 md:p-10 flex flex-col gap-7">
          {/* Heading Section */}
          <div className="flex items-center gap-4 pb-3 mb-1 border-b border-gray-100">
            <span className="bg-blue-50 p-3 rounded-full flex items-center justify-center">
              <UserIcon size={26} className="text-blue-600" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">Create a User Account</h2>
              <p className="text-gray-500 text-base font-normal">
                Begin by creating your main account. Owners can manage setup; employees have limited access.
              </p>
            </div>
          </div>
          {success && (
            <div className="rounded bg-blue-50 px-4 py-3 text-blue-900 border border-blue-200 mb-3 flex items-center gap-2 shadow-sm text-sm">
              User staged successfully. Proceed to next step!
            </div>
          )}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <Label htmlFor="name" className="mb-1 text-gray-800 font-medium">Username</Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    required
                    minLength={2}
                    placeholder="e.g. johndoe"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    autoComplete="username"
                    className={`w-full border border-gray-300 rounded-md p-2 text-sm ${errors.name && touched.name ? "border-red-400 ring-1 ring-red-200" : ""}`}
                  />
                  <UserIcon className="absolute left-2 top-2.5 text-gray-300 pointer-events-none" size={16} />
                </div>
                {touched.name && errors.name && (
                  <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <BadgeAlert size={13} /> {errors.name}
                  </div>
                )}
              </div>
              {/* Email */}
              <div>
                <Label htmlFor="email" className="mb-1 text-gray-800 font-medium">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    required
                    type="email"
                    placeholder="e.g. john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    autoComplete="email"
                    className={`w-full border border-gray-300 rounded-md p-2 text-sm pl-9 ${errors.email && touched.email ? "border-red-400 ring-1 ring-red-200" : ""}`}
                  />
                  <Mail className="absolute left-2 top-2.5 text-gray-300 pointer-events-none" size={15} />
                </div>
                {touched.email && errors.email && (
                  <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <BadgeAlert size={13} /> {errors.email}
                  </div>
                )}
              </div>
            </div>
            {/* Password */}
            <div className="md:col-span-2">
              <Label htmlFor="password" className="mb-1 text-gray-800 font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  required
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  autoComplete="new-password"
                  minLength={6}
                  className={`w-full border border-gray-300 rounded-md p-2 text-sm pl-9 ${errors.password && touched.password ? "border-red-400 ring-1 ring-red-200" : ""}`}
                />
                <Lock className="absolute left-2 top-2.5 text-gray-300 pointer-events-none" size={15} />
              </div>
              {touched.password && errors.password && (
                <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <BadgeAlert size={13} /> {errors.password}
                </div>
              )}
            </div>
            {/* Role */}
            <div className="md:col-span-2">
              <Label htmlFor="role" className="mb-1 text-gray-800 font-medium flex items-center gap-2">
                Role
                <span title="Role determines user permissions. Owners manage setup; Employees have limited access." className="ml-1 cursor-pointer text-blue-600 text-xs">?</span>
              </Label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              >
                <option value="owner">👑 Owner</option>
                <option value="employee">👷 Employee</option>
              </select>
            </div>
            {/* Navigation Actions */}
            <div className="flex justify-between items-center mt-2">
              <Button
                variant="ghost"
                type="button"
                onClick={handleCancel}
                className="text-gray-500 hover:bg-gray-100"
              >
                ← Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formValid}
                className="bg-blue-600 text-white rounded-md px-7 py-2 font-semibold hover:bg-blue-700"
              >
                {loading ? "Creating..." : "Next →"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

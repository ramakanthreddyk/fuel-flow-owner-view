
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Mail, Lock, User as UserIcon, BadgeCheck, BadgeAlert } from "lucide-react";
import RoleSelect from "./RoleSelect";
import ProgressBar from "./ProgressBar";
import { useNavigate } from "react-router-dom";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "owner",
};

function validate(form: typeof initialForm) {
  const errors: { [key: string]: string } = {};
  if (!form.name.trim()) errors.name = "Username is required";
  if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) errors.email = "Email format invalid";
  if (form.password.length < 6) errors.password = "Password must be at least 6 characters";
  return errors;
}

export default function CreateUser() {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const errors = validate(form);
  const formValid = Object.keys(errors).length === 0;

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

    // Simulated API
    await new Promise((r) => setTimeout(r, 700));
    setSuccess(true);
    toast({
      title: "User staged!",
      description: `User: ${form.name}, Email: ${form.email}, Role: ${form.role}`,
    });
    setLoading(false);
  }

  function handleCancel() {
    navigate("/owner-dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-3 py-10">
      {/* Main Content: Centered Card */}
      <div className="w-full max-w-xl mx-auto">
        <ProgressBar step={1} total={5} />
        {/* Step indicator */}
        <div className="text-gray-400 text-xs font-normal mt-4 mb-2 text-right">Step 1 of 5</div>
        <Card className="border border-gray-200 bg-white shadow-lg rounded-xl p-8 flex flex-col gap-7">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-gray-100 p-3 rounded-full shadow-sm flex items-center justify-center">
              <UserIcon size={26} className="text-blue-500" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-0.5">
                Create a User Account
              </h2>
              <p className="text-gray-500 text-sm font-normal">
                Begin by creating your main account. Owners manage everything; employees have limited access.
              </p>
            </div>
          </div>
          {/* Success Banner */}
          {success && (
            <div className="rounded bg-green-50 px-4 py-3 text-green-900 border border-green-200 mb-3 flex items-center gap-2 shadow-sm text-sm">
              <BadgeCheck className="mr-1.5 text-green-500" />
              User staged successfully. Proceed to next step!
            </div>
          )}
          {/* User Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Username */}
              <div>
                <Label htmlFor="name" className="mb-1 font-medium text-gray-700">Username</Label>
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
                    className={`pl-9 ${errors.name && touched.name ? "border-red-400 ring-1 ring-red-200" : ""}`}
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
                <Label htmlFor="email" className="mb-1 font-medium text-gray-700">Email</Label>
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
                    className={`pl-9 ${errors.email && touched.email ? "border-red-400 ring-1 ring-red-200" : ""}`}
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
            <div>
              <Label htmlFor="password" className="mb-1 font-medium text-gray-700">Password</Label>
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
                  className={`pl-9 ${errors.password && touched.password ? "border-red-400 ring-1 ring-red-200" : ""}`}
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
            <div>
              <Label htmlFor="role" className="mb-1 font-medium text-gray-700 flex items-center gap-2">
                Role
                <span
                  className="ml-1 inline-flex text-blue-600 cursor-pointer rounded-full bg-blue-50 p-1"
                  title="Role determines user permissions. Owners manage setup; Employees have limited access."
                >?</span>
              </Label>
              <RoleSelect
                id="role"
                value={form.role}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <Button variant="ghost" type="button" onClick={handleCancel} className="text-gray-500 hover:bg-gray-100">
                ← Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formValid}
                className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 transition"
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

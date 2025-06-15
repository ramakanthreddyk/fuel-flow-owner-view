
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import WizardNavButtons from "@/components/superadmin-wizard/WizardNavButtons";
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
    <div className="min-h-screen bg-gradient-to-bl from-blue-50 via-white to-indigo-50 dark:from-blue-950 dark:via-background dark:to-indigo-900 flex flex-col">
      <ProgressBar step={1} total={5} />

      <div className="flex flex-1 flex-col md:flex-row w-full max-w-5xl mx-auto gap-10 py-10 animate-fade-in">

        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 mb-10 md:mb-0">
          <SidebarSteps current={1} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <Card className="relative w-full max-w-xl mx-auto p-8 flex flex-col gap-7 shadow-xl rounded-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 mb-3">
              <span className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full shadow">
                <UserIcon size={30} className="text-blue-500" />
              </span>
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">Create a User Account</h2>
                <p className="text-muted-foreground text-base">
                  Start your station setup by creating your main account. Owners can manage everything; employees have limited access.
                </p>
              </div>
            </div>

            {success && (
              <div className="rounded bg-green-100 dark:bg-green-900/40 px-4 py-3 text-green-900 dark:text-green-100 font-medium border border-green-300 dark:border-green-800 mb-3 flex items-center gap-2 animate-fade-in">
                <BadgeCheck className="mr-1.5 text-green-500" />
                User staged successfully. Proceed to next step!
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit} autoComplete="off">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Username */}
                <div>
                  <Label htmlFor="name" className="mb-1">Username</Label>
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
                      className={errors.name && touched.name ? "border-destructive ring-2 ring-destructive/20" : ""}
                    />
                    <UserIcon className="absolute left-3 top-2.5 text-blue-300 pointer-events-none" size={18} />
                  </div>
                  {touched.name && errors.name && (
                    <div className="text-red-600 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                      <BadgeAlert size={14} /> {errors.name}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="mb-1">Email</Label>
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
                      className={errors.email && touched.email ? "border-destructive ring-2 ring-destructive/20" : ""}
                    />
                    <Mail className="absolute left-3 top-2.5 text-blue-300 pointer-events-none" size={17} />
                  </div>
                  {touched.email && errors.email && (
                    <div className="text-red-600 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                      <BadgeAlert size={14} /> {errors.email}
                    </div>
                  )}
                </div>
              </div>
              {/* Password */}
              <div className="max-w-md">
                <Label htmlFor="password" className="mb-1">Password</Label>
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
                    className={errors.password && touched.password ? "border-destructive ring-2 ring-destructive/20" : ""}
                  />
                  <Lock className="absolute left-3 top-2.5 text-blue-300 pointer-events-none" size={17} />
                </div>
                {touched.password && errors.password && (
                  <div className="text-red-600 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                    <BadgeAlert size={14} /> {errors.password}
                  </div>
                )}
              </div>
              {/* Role */}
              <div className="max-w-xs">
                <Label htmlFor="role" className="mb-1 flex items-center gap-2">
                  Role
                  <span className="tooltip-parent">
                    <span className="ml-1 inline-flex text-blue-500 cursor-help rounded-full bg-blue-100 p-1 dark:bg-blue-900" title="Role determines user permissions. Owners manage station setup; Employees have limited access.">?</span>
                  </span>
                </Label>
                <RoleSelect
                  id="role"
                  value={form.role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setForm((f) => ({ ...f, role: e.target.value }));
                  }}
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !formValid}
                className="mt-3 w-full"
              >
                {loading ? "Creating..." : "Next →"}
              </Button>
            </form>
          </Card>
          <div className="mt-8 flex justify-between w-full max-w-xl mx-auto">
            <Button variant="ghost" onClick={handleCancel}>
              ← Cancel
            </Button>
            <WizardNavButtons nextDisabled={!formValid} nextLabel="Next →" />
          </div>
        </main>
      </div>
    </div>
  );
}

// SidebarSteps as inline here for clarity for now
function SidebarSteps({ current }: { current: number }) {
  const steps = [
    { label: "Create User", icon: <UserIcon size={17} />, done: true },
    { label: "Create Station", icon: <BadgeCheck size={17} />, done: false },
    { label: "Add Pumps", icon: <BadgeAlert size={17} />, done: false },
    { label: "Add Nozzles", icon: <BadgeAlert size={17} />, done: false },
    { label: "Assign Employee", icon: <BadgeAlert size={17} />, done: false },
  ];
  return (
    <div className="rounded-2xl bg-white/80 dark:bg-blue-950/70 px-3 pb-5 pt-6 shadow-lg border border-blue-100 dark:border-blue-900 animate-fade-in flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-6 pl-2">
        <UserIcon size={23} className="text-blue-500" />
        <span className="font-extrabold text-lg tracking-tight text-blue-900 dark:text-blue-100">
          SuperAdmin Wizard
        </span>
      </div>
      {steps.map((step, i) => {
        const isActive = current === i + 1;
        const disabled = i + 1 > current;
        return (
          <div
            key={step.label}
            className={[
              "flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors relative",
              isActive
                ? "bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-200 shadow"
                : disabled
                  ? "opacity-60 text-blue-400 cursor-not-allowed"
                  : "text-blue-900 dark:text-blue-200",
            ].join(" ")}
            style={{
              marginBottom: i === steps.length - 1 ? 0 : "4px",
              pointerEvents: disabled ? "none" : "auto",
            }}
          >
            <span>{step.icon}</span>
            <span>{step.label}</span>
            {isActive && (
              <span className="absolute left-0 top-2 h-2/3 w-1.5 bg-blue-400 rounded-r-2xl shadow-md transition-all duration-200" />
            )}
          </div>
        );
      })}
      <div className="mt-6 pl-2 text-xs text-blue-700 dark:text-blue-300/80">
        Step 1 of 5
      </div>
    </div>
  );
}

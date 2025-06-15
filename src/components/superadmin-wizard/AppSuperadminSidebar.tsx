
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { User, Store, Wrench, Fuel, Briefcase, Clipboard } from "lucide-react";
import { useWizard } from "@/context/WizardContext";

const steps = [
  { url: "/superadmin-wizard/create-user", label: "Create User", icon: <User size={20} /> },
  { url: "/superadmin-wizard/create-station", label: "Create Station", icon: <Store size={20} /> },
  { url: "/superadmin-wizard/add-pumps", label: "Add Pumps", icon: <Wrench size={20} /> },
  { url: "/superadmin-wizard/add-nozzles", label: "Add Nozzles", icon: <Fuel size={20} /> },
  { url: "/superadmin-wizard/assign-employee", label: "Assign Employee", icon: <Briefcase size={20} /> },
  { url: "/superadmin-wizard/summary", label: "Summary", icon: <Clipboard size={20} /> },
];

export default function AppSuperadminSidebar() {
  const { state } = useWizard();
  const { pathname } = useLocation();
  // Determine allowed steps based on branching
  let allowedIdx = 0;
  if (state.user?.role === "owner") {
    if (state.user) allowedIdx = 1;
    if (state.station) allowedIdx = 2;
    if (state.pumps.length > 0) allowedIdx = 3;
    if (state.nozzles.length > 0) allowedIdx = 4;
    // summary always unlocked after all required
    if (
      state.user &&
      state.station &&
      state.pumps.length > 0 &&
      state.nozzles.length > 0
    ) allowedIdx = 5;
  } else if (state.user?.role === "employee") {
    if (state.user) allowedIdx = 4;
    if (state.employeeAssignment) allowedIdx = 5;
  }
  // Employee disables all but 1, 4, 5; Owner disables 4 only for employee flow
  return (
    <aside className="bg-card border-r w-56 min-h-screen flex flex-col">
      <div className="px-5 py-5 border-b font-bold text-lg tracking-tight flex items-center gap-2">
        <Clipboard size={22} className="text-primary" />
        SuperAdmin Panel
      </div>
      <nav className="flex-1 px-1 pt-2 flex flex-col gap-1">
        {steps.map((step, idx) => {
          let disabled = false;
          // Hide irrelevant routes per role
          if (
            (idx === 1 || idx === 2 || idx === 3) && // Station setup OWNER only
            state.user?.role === "employee"
          )
            disabled = true;
          if (idx === 4 && state.user?.role === "owner") disabled = true;
          // Lock to step order
          if (idx > allowedIdx) disabled = true;
          return (
            <NavLink
              key={step.url}
              to={disabled ? "#" : step.url}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                } ${disabled ? "pointer-events-none opacity-40" : ""}`
              }
              aria-disabled={disabled}
            >
              {step.icon}
              <span>{step.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}


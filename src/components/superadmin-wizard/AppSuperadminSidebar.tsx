
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { User, Store, Wrench, Fuel, Briefcase, Clipboard } from "lucide-react";
import { useWizard } from "@/context/WizardContext";

const steps = [
  { url: "/superadmin-wizard/create-user", label: "Create User", icon: <User size={18} /> },
  { url: "/superadmin-wizard/create-station", label: "Create Station", icon: <Store size={18} /> },
  { url: "/superadmin-wizard/add-pumps", label: "Add Pumps", icon: <Wrench size={18} /> },
  { url: "/superadmin-wizard/add-nozzles", label: "Add Nozzles", icon: <Fuel size={18} /> },
  { url: "/superadmin-wizard/assign-employee", label: "Assign Employee", icon: <Briefcase size={18} /> },
  { url: "/superadmin-wizard/summary", label: "Summary", icon: <Clipboard size={18} /> },
];

export default function AppSuperadminSidebar() {
  const { state } = useWizard();
  const { pathname } = useLocation();

  let allowedIdx = 0;
  if (state.user?.role === "owner") {
    if (state.user) allowedIdx = 1;
    if (state.station) allowedIdx = 2;
    if (state.pumps.length > 0) allowedIdx = 3;
    if (state.nozzles.length > 0) allowedIdx = 4;
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

  return (
    <aside className="bg-card border-r border-border w-60 min-h-screen flex flex-col shadow-lg relative z-10">
      {/* Brand / Logo Section */}
      <div className="px-5 py-6 border-b border-muted flex items-center gap-2 bg-primary/95">
        <Clipboard size={22} className="text-primary-foreground" />
        <span className="font-extrabold text-lg tracking-tight text-primary-foreground">SuperAdmin Wizard</span>
      </div>

      {/* Steps Navigation */}
      <nav className="flex-1 px-2 pt-6 flex flex-col gap-1">
        {steps.map((step, idx) => {
          let disabled = false;
          if (
            (idx === 1 || idx === 2 || idx === 3) && 
            state.user?.role === "employee"
          )
            disabled = true;
          if (idx === 4 && state.user?.role === "owner") disabled = true;
          if (idx > allowedIdx) disabled = true;

          const isActive = pathname === step.url;
          return (
            <NavLink
              key={step.url}
              to={disabled ? "#" : step.url}
              tabIndex={disabled ? -1 : 0}
              aria-disabled={disabled}
              className={({ isActive: navActive }) =>
                [
                  "flex items-center gap-3 px-4 py-2 rounded-md transition-colors cursor-pointer relative group",
                  "font-medium tracking-wide select-none",
                  disabled
                    ? "pointer-events-none opacity-40"
                    : navActive || isActive
                      ? "bg-primary text-primary-foreground shadow-inner"
                      : "hover:bg-muted hover:text-foreground/90",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  "duration-150"
                ].join(" ")
              }
              style={{
                marginBottom: idx === steps.length - 1 ? 0 : "3px",
              }}
            >
              <span
                className={[
                  "flex items-center justify-center",
                  "transition-transform duration-150",
                  disabled ? "" : "group-hover:scale-110"
                ].join(" ")}
              >
                {step.icon}
              </span>
              <span className="truncate">{step.label}</span>
              {/* Side accent bar for active state */}
              {pathname === step.url && !disabled && (
                <span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-md shadow-md" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Nice subtle bottom border */}
      <div className="mt-auto h-6 border-t border-muted bg-gradient-to-t from-muted/60 to-transparent" />
    </aside>
  );
}

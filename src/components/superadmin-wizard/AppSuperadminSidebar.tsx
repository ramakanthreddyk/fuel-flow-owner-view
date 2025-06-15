
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { User, Store, Wrench, Fuel, Briefcase, Clipboard } from "lucide-react";
import { useWizard } from "@/context/WizardContext";

// Soft Lucid-inspired accent color for icons and gradients:
const iconAccent = "text-blue-400 dark:text-blue-300";

const steps = [
  { url: "/superadmin-wizard/create-user", label: "Create User", icon: <User size={18} className={iconAccent} /> },
  { url: "/superadmin-wizard/create-station", label: "Create Station", icon: <Store size={18} className={iconAccent} /> },
  { url: "/superadmin-wizard/add-pumps", label: "Add Pumps", icon: <Wrench size={18} className={iconAccent} /> },
  { url: "/superadmin-wizard/add-nozzles", label: "Add Nozzles", icon: <Fuel size={18} className={iconAccent} /> },
  { url: "/superadmin-wizard/assign-employee", label: "Assign Employee", icon: <Briefcase size={18} className={iconAccent} /> },
  { url: "/superadmin-wizard/summary", label: "Summary", icon: <Clipboard size={18} className={iconAccent} /> },
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
    <aside
      className="w-64 min-h-screen flex flex-col z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950 dark:via-background dark:to-indigo-900 border-r border-border shadow-xl transition-colors duration-300"
      style={{ borderTopRightRadius: "1.5rem", borderBottomRightRadius: "1.5rem" }}
    >
      {/* Brand/Logo Section */}
      <div className="px-7 py-7 border-b border-muted flex items-center gap-3 bg-gradient-to-r from-blue-400/70 via-cyan-200/70 to-indigo-300/30 dark:from-blue-900 dark:via-blue-800 dark:to-indigo-950 rounded-tr-3xl"
        style={{ borderTopRightRadius: '1.5rem' }}
      >
        <Clipboard size={26} className="mr-2 text-blue-500 dark:text-blue-200 drop-shadow" />
        <span className="font-extrabold text-2xl tracking-tight text-blue-600 dark:text-blue-200 drop-shadow">
          SuperAdmin Wizard
        </span>
      </div>

      {/* Steps Navigation */}
      <nav className="flex-1 px-4 pt-7 flex flex-col gap-1">
        {steps.map((step, idx) => {
          // Determine disabled state as before:
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
              to={step.url}
              tabIndex={disabled ? -1 : 0}
              aria-disabled={disabled}
              className={({ isActive: navActive }) =>
                [
                  "flex items-center gap-3 px-5 py-3 rounded-xl text-lg transition-colors relative group shadow-sm",
                  "font-medium tracking-wide select-none",
                  navActive || isActive
                    ? "bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-800 dark:to-blue-600 text-blue-700 dark:text-blue-100 shadow-lg"
                    : "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/30",
                  "duration-200",
                  disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                ].join(" ")
              }
              style={{
                marginBottom: idx === steps.length - 1 ? 0 : "6px",
                pointerEvents: disabled ? "none" : undefined, // prevents navigation for disabled, but link always remains a NavLink
              }}
            >
              <span
                className={[
                  "flex items-center justify-center transition-transform duration-200",
                  disabled ? "" : "group-hover:scale-110"
                ].join(" ")}
                style={{ minWidth: 24 }}
              >
                {step.icon}
              </span>
              <span className="truncate">{step.label}</span>
              {/* Side accent bar for active state */}
              {isActive && !disabled && (
                <span className="absolute left-0 top-2 h-2/3 w-1.5 bg-blue-400 dark:bg-blue-300 rounded-r-2xl shadow-md transition-all duration-200" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Nice subtle bottom gradient */}
      <div className="mt-auto h-10 bg-gradient-to-t from-blue-100/80 via-indigo-50/0 to-transparent dark:from-blue-900/60 dark:via-transparent" style={{ borderBottomRightRadius: "1.5rem" }} />
    </aside>
  );
}

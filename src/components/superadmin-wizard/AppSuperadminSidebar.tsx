
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { User, Store, Wrench, Fuel, Briefcase, Clipboard } from "lucide-react";

const iconAccent = "text-blue-500";

const steps = [
  { url: "/superadmin-wizard/create-user", label: "Create User", icon: <User size={18} className={iconAccent} /> },
  { url: "/superadmin-wizard/create-station", label: "Create Station", icon: <Store size={18} className={iconAccent} /> },
  { url: "/superadmin-wizard/add-pumps", label: "Add Pumps", icon: <Wrench size={18} className={iconAccent} /> },
  { url: "/superadmin-wizard/add-nozzles", label: "Add Nozzles", icon: <Fuel size={18} className={iconAccent} /> },
  { url: "/superadmin-wizard/assign-employee", label: "Assign Employee", icon: <Briefcase size={18} className={iconAccent} /> },
  { url: "/superadmin-wizard/summary", label: "Summary", icon: <Clipboard size={18} className={iconAccent} /> },
];

export default function AppSuperadminSidebar() {
  const { pathname } = useLocation();

  return (
    <aside
      className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-gray-200 shadow-lg"
      style={{ borderTopRightRadius: "1.5rem", borderBottomRightRadius: "1.5rem" }}
    >
      {/* Brand/Logo Section */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
        <Clipboard size={26} className="mr-2 text-blue-500 drop-shadow" />
        <span className="font-extrabold text-xl tracking-tight text-gray-800">SuperAdmin Wizard</span>
      </div>
      {/* Steps Navigation */}
      <nav className="flex-1 px-3 py-7 flex flex-col gap-1">
        {steps.map((step, idx) => {
          const isActive = pathname === step.url;
          const isDisabled = idx > steps.findIndex(s => s.url === pathname);
          return (
            <NavLink
              key={step.url}
              to={isDisabled ? "#" : step.url}
              tabIndex={isDisabled ? -1 : 0}
              className={[
                "flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-colors relative group",
                isActive
                  ? "bg-blue-50 text-blue-900 border-l-4 border-blue-500"
                  : isDisabled
                  ? "text-gray-400 bg-transparent cursor-not-allowed"
                  : "hover:bg-blue-50 hover:text-blue-700",
              ].join(" ")}
              aria-disabled={isDisabled}
              style={{
                marginBottom: idx === steps.length - 1 ? 0 : "3px",
                pointerEvents: isDisabled ? "none" : "auto",
              }}
            >
              <span className="flex items-center justify-center" style={{ minWidth: 24 }}>
                {step.icon}
              </span>
              <span className="truncate">{step.label}</span>
              {isActive && (
                <span className="absolute left-0 top-1 h-3/4 w-1.5 bg-blue-500 rounded-r-lg" />
              )}
            </NavLink>
          );
        })}
      </nav>
      {/* Empty space at the end */}
      <div className="mt-auto py-3" />
    </aside>
  );
}

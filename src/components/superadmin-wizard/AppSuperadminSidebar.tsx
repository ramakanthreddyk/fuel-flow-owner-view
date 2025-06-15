
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { User, Store, Wrench, Fuel, Briefcase, Clipboard, Check } from "lucide-react";
import { useWizard } from "@/context/WizardContext";

const steps = [
  { url: "/superadmin-wizard/create-user", label: "Create User", icon: <User size={18} />, key: "user" },
  { url: "/superadmin-wizard/create-station", label: "Create Station", icon: <Store size={18} />, key: "station" },
  { url: "/superadmin-wizard/add-pumps", label: "Add Pumps", icon: <Wrench size={18} />, key: "pumps" },
  { url: "/superadmin-wizard/add-nozzles", label: "Add Nozzles", icon: <Fuel size={18} />, key: "nozzles" },
  { url: "/superadmin-wizard/assign-employee", label: "Assign Employee", icon: <Briefcase size={18} />, key: "employeeAssignment" },
  { url: "/superadmin-wizard/summary", label: "Summary", icon: <Clipboard size={18} />, key: "summary" },
];

function getCompletedSteps(state: any) {
  const completed: string[] = [];
  if (state.user) completed.push("user");
  if (state.station) completed.push("station");
  if (state.pumps && state.pumps.length > 0) completed.push("pumps");
  if (state.nozzles && state.nozzles.length > 0) completed.push("nozzles");
  if (state.employeeAssignment) completed.push("employeeAssignment");
  // 'summary' step will only be completed at the very end, typically.
  return completed;
}

export default function AppSuperadminSidebar() {
  const { pathname } = useLocation();
  const { state } = useWizard();
  const completedSteps = getCompletedSteps(state);

  // Responsive: sidebar collapsed on mobile (simple hamburger logic)
  // For full drawer/hamburger, use state, but for brevity we show/hide on md:
  return (
    <aside className="bg-white border-r border-gray-200 shadow-sm min-h-screen w-64 flex-col px-0 py-0 hidden md:flex">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
        <Clipboard size={24} className="text-blue-600" />
        <span className="font-extrabold text-xl text-gray-800">Superadmin Wizard</span>
      </div>
      <nav className="flex-1 flex flex-col py-6 px-2 gap-1">
        {steps.map((step, i) => {
          const isActive = pathname === step.url;
          const isCompleted = completedSteps.includes(step.key);
          return (
            <NavLink
              key={step.url}
              to={step.url}
              className={[
                "flex items-center gap-3 px-4 py-2 rounded-lg",
                "transition-colors font-normal text-gray-700 group relative",
                isActive
                  ? "border-l-4 border-blue-600 text-blue-700 bg-blue-50"
                  : "hover:bg-gray-100",
              ].join(" ")}
              style={{ marginBottom: i === steps.length - 1 ? 0 : 2 }}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="flex items-center justify-center min-w-[26px]">
                {isCompleted && !isActive ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  React.cloneElement(step.icon, {
                    className: isActive ? "text-blue-600" : "text-gray-400"
                  })
                )}
              </span>
              <span className={"truncate"}>{step.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto py-4" />
    </aside>
  );
}

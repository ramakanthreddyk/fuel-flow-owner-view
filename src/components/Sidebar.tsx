
import { NavLink } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Stations", to: "/stations" },
  { label: "Sales", to: "/sales" },
  { label: "Data Entry", to: "/data-entry" },
  { label: "Users", to: "/users" },      // Guarded for superadmin only
  { label: "Settings", to: "/settings" }
];

const Sidebar = () => {
  const user = useUser();
  return (
    <aside className="bg-white border-r w-60 min-h-screen py-6 px-0 flex flex-col shadow-sm">
      <div className="font-bold text-2xl px-6 pb-8 tracking-tight text-gray-800">FuelSaaS</div>
      <nav className="flex flex-col gap-1 px-4 flex-1">
        {navItems.map((item) => {
          // Only show "Users" page to superadmin in nav, but you could also show a lock for non-superadmins
          if (item.to === "/users" && user.role !== "superadmin") {
            return (
              <span key={item.to} className="text-gray-400 px-3 py-2 rounded cursor-not-allowed flex items-center opacity-60">
                {item.label}
                <span className="ml-1 text-xs">🔒</span>
              </span>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "block px-3 py-2 rounded font-medium",
                  isActive ? "bg-blue-50 text-blue-800" : "text-gray-700 hover:bg-gray-100"
                )
              }
              end
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

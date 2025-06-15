
import { NavLink, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building,
  ShoppingCart,
  FileEdit,
  Users,
  Settings,
  Lock,
} from "lucide-react";

const navSections = [
  {
    label: "General",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
      { label: "Stations", to: "/stations", icon: Building },
      { label: "Sales", to: "/sales", icon: ShoppingCart },
      { label: "Data Entry", to: "/data-entry", icon: FileEdit },
    ],
  },
  {
    label: "Admin",
    items: [{ label: "Users", to: "/users", icon: Users, requireRole: "superadmin" }],
  },
  {
    label: "Other",
    items: [{ label: "Settings", to: "/settings", icon: Settings }],
  },
];

const Sidebar = () => {
  const user = useUser();
  const location = useLocation();

  return (
    <aside className="bg-white border-r w-60 min-h-screen py-6 px-0 flex flex-col shadow-sm">
      <div className="font-bold text-2xl px-6 pb-6 tracking-tight text-primary">
        FuelSaaS
      </div>
      <nav className="flex flex-col gap-6 px-2 flex-1">
        {navSections.map((section) => (
          <div key={section.label} className="mb-1">
            <span className="block px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {section.label}
            </span>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                if (item.to === "/users" && user.role !== "superadmin") {
                  return (
                    <div
                      key={item.to}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded text-gray-400 opacity-60 cursor-not-allowed relative"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      <Lock className="w-4 h-4 ml-auto" />
                    </div>
                  );
                }
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 px-3 py-2 rounded font-medium transition-colors",
                        isActive
                          ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50"
                      )
                    }
                    end
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-auto px-6 py-3 text-xs text-gray-400 opacity-50">
        &copy; {new Date().getFullYear()} FuelSaaS
      </div>
    </aside>
  );
};

export default Sidebar;

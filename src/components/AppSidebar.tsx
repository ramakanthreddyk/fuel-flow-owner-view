import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";
import {
  LayoutDashboard,
  Building,
  ShoppingCart,
  FileEdit,
  Users,
  Settings,
  Lock,
} from "lucide-react";
import React from "react";
import { useLocation, Link } from "react-router-dom";

// Map icon names to Tailwind color classes
const ICON_COLORS: Record<string, string> = {
  LayoutDashboard: "text-blue-600",
  Building: "text-green-600",
  ShoppingCart: "text-pink-600",
  FileEdit: "text-orange-500",
  Users: "text-teal-600",
  Settings: "text-indigo-700",
  Lock: "text-gray-400",
};

// Sidebar items, with required role if restricted
const NAV_ITEMS = [
  {
    section: "General",
    items: [
      {
        label: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
        iconKey: "LayoutDashboard",
        requireRole: null,
      },
      {
        label: "Stations",
        to: "/stations",
        icon: Building,
        iconKey: "Building",
        requireRole: "owner",
      },
      {
        label: "Sales",
        to: "/sales",
        icon: ShoppingCart,
        iconKey: "ShoppingCart",
        requireRole: "owner",
      },
      {
        label: "Data Entry",
        to: "/data-entry",
        icon: FileEdit,
        iconKey: "FileEdit",
        requireRole: "owner",
      },
      {
        label: "Employees",
        to: "/employees",
        icon: Users,
        iconKey: "Users",
        requireRole: "superadmin",
      },
    ],
  },
  {
    section: "Admin",
    items: [
      {
        label: "Users",
        to: "/users",
        icon: Users,
        iconKey: "Users",
        requireRole: "superadmin",
      },
    ],
  },
  {
    section: "Other",
    items: [
      {
        label: "Settings",
        to: "/settings",
        icon: Settings,
        iconKey: "Settings",
        requireRole: null,
      },
    ],
  },
];

export function AppSidebar() {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) return null; // Or loading skeleton

  const getRoleRank = (role: string | undefined | null) =>
    role === "superadmin" ? 3 : role === "owner" ? 2 : 1;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="font-bold text-2xl pl-2 pb-3 pt-2 tracking-tight text-primary">
          FuelSaaS
        </div>
      </SidebarHeader>
      <SidebarContent>
        {NAV_ITEMS.map((section) => (
          <SidebarGroup key={section.section}>
            <SidebarGroupLabel>{section.section}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const colorClass =
                    ICON_COLORS[item.iconKey || ""] || "text-gray-500";
                  const isActive = location.pathname === item.to;
                  // If item has requireRole, check if user has at least that role's privilege
                  if (
                    item.requireRole &&
                    getRoleRank(user?.role) < getRoleRank(item.requireRole)
                  ) {
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton disabled>
                          <Icon className={colorClass + " opacity-60"} />
                          <span className="opacity-60">{item.label}</span>
                          <Lock className={ICON_COLORS.Lock + " w-4 h-4 ml-auto"} />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                      >
                        <Link to={item.to}>
                          <Icon className={colorClass} />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="mt-auto px-2 py-2 text-xs text-gray-400 opacity-50">
          &copy; {new Date().getFullYear()} FuelSaaS
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}


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
import { LayoutDashboard, Building, ShoppingCart, FileEdit, Users, Settings, Lock } from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";

// Sidebar items, with required role if restricted
const NAV_ITEMS = [
  {
    section: "General",
    items: [
      {
        label: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
        requireRole: null,
      },
      {
        label: "Stations",
        to: "/stations",
        icon: Building,
        requireRole: "owner",
      },
      {
        label: "Sales",
        to: "/sales",
        icon: ShoppingCart,
        requireRole: "owner",
      },
      {
        label: "Data Entry",
        to: "/data-entry",
        icon: FileEdit,
        requireRole: "owner",
      },
      {
        label: "Employees",
        to: "/employees",
        icon: Users,
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
        requireRole: null,
      },
    ],
  },
];

export function AppSidebar() {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) return null; // Or loading skeleton

  const getRoleRank = (role) =>
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
                  // If item has requireRole, check if user has at least that role's privilege
                  // superadmin always sees all, owner sees items with requireRole null or "owner"
                  if (
                    item.requireRole &&
                    getRoleRank(user?.role) < getRoleRank(item.requireRole)
                  ) {
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton disabled>
                          <item.icon className="opacity-60" />
                          <span className="opacity-60">{item.label}</span>
                          <Lock className="w-4 h-4 ml-auto text-gray-300" />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.to}
                      >
                        <a href={item.to}>
                          <item.icon />
                          <span>{item.label}</span>
                        </a>
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

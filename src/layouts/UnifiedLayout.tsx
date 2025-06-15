
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useLocation } from "react-router-dom";

export default function UnifiedLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  // Wrap in SidebarProvider for sidebar state and style
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 px-4 py-8">
          {/* SidebarTrigger: can also be put in Navbar, but here lets owners toggle */}
          <div className="mb-2 block md:hidden">
            <SidebarTrigger />
          </div>
          {/* Page transition wrapper */}
          <div
            key={location.pathname}
            className="animate-fade-in transition-all duration-300"
          >
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

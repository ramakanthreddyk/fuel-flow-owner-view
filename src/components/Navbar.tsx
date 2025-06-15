
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/owner-dashboard" },
  { label: "Superadmin Wizard", to: "/superadmin-wizard/create-user" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-2">
        <Link
          to="/"
          className="font-bold text-xl text-gray-800 tracking-tight flex items-center gap-2"
        >
          FuelSaaS
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "text-gray-700 hover:text-blue-600 px-2 py-1 rounded transition-colors font-medium",
                location.pathname.startsWith(item.to)
                  ? "text-blue-700 font-semibold"
                  : ""
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="size-6 text-gray-800" />
        </button>
      </div>
      {/* Mobile Nav Items */}
      {mobileOpen && (
        <nav className="md:hidden px-4 pb-2 animate-in fade-in-0 slide-in-from-top-3">
          <div className="flex flex-col gap-1 bg-white rounded-md shadow px-2 py-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "block px-3 py-2 rounded text-gray-700 hover:text-blue-600 font-medium transition-colors",
                  location.pathname.startsWith(item.to)
                    ? "text-blue-700 font-semibold"
                    : ""
                )}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;


import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Stations", to: "/stations" },
  { label: "Sales", to: "/sales" },
  { label: "Data Entry", to: "/data-entry" },
  { label: "Users", to: "/users" },
  { label: "Employees", to: "/employees" },
  { label: "Settings", to: "/settings" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleLogin = () => (window.location.href = "/auth");
  const handleLogout = async () => {
    await signOut();
    window.location.href = "/"; // redirect to landing page after logout
  };

  // Only show navigation if logged in
  const showNavItems = !!user;

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-3 md:py-2">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8 flex-1">
          <Link
            to="/"
            className="font-bold text-xl text-gray-800 tracking-tight flex items-center gap-2"
          >
            FuelSaaS
          </Link>
          {showNavItems && (
            <nav className="hidden md:flex items-center gap-5 mt-2 md:mt-0 ml-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "text-gray-700 hover:text-blue-600 px-2 py-1 rounded transition-colors font-medium",
                    location.pathname === item.to ? "text-blue-700 font-semibold" : ""
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        {/* Auth Buttons on Right */}
        <div className="flex-0 flex w-full justify-end md:w-auto mt-4 md:mt-0 gap-2">
          {user ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 text-blue-600" />
              Logout
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={handleLogin}>
              Login
            </Button>
          )}
          {/* Mobile Hamburger - show only if authenticated */}
          {showNavItems && (
            <button
              className="md:hidden ml-2 p-2 rounded hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="size-6 text-blue-700" />
            </button>
          )}
        </div>
      </div>
      {/* Mobile Nav Items */}
      {mobileOpen && showNavItems && (
        <nav className="md:hidden px-4 pb-2 animate-in fade-in-0 slide-in-from-top-3">
          <div className="flex flex-col gap-1 bg-white rounded-md shadow px-2 py-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "block px-3 py-2 rounded text-gray-700 hover:text-blue-600 font-medium transition-colors",
                  location.pathname === item.to ? "text-blue-700 font-semibold" : ""
                )}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <Button
                variant="outline"
                size="sm"
                className="mt-2 flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 text-blue-600" />
                Logout
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="mt-2"
                onClick={handleLogin}
              >
                Login
              </Button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;

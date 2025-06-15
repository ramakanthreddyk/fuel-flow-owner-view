
import { Link } from "react-router-dom";
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const appUser = useUser();

  const handleLogin = () => (window.location.href = "/auth");
  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  // Map role for display
  const roleLabel =
    appUser.role === "superadmin"
      ? "Superadmin"
      : appUser.role === "owner"
      ? "Owner"
      : appUser.role === "employee"
      ? "Employee"
      : appUser.role;

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-2">
        {/* Left: Logo only */}
        <Link
          to="/"
          className="font-bold text-xl text-gray-800 tracking-tight flex items-center gap-2"
        >
          FuelSaaS
        </Link>
        {/* Right: User Info and Logout/Login */}
        <div className="flex items-center gap-2">
          {user && (
            <>
              <div className="mr-2 text-sm font-medium text-gray-700 select-none flex items-center gap-2">
                <span className="truncate">{appUser.name}</span>
                <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 border border-gray-200 font-semibold">
                  {roleLabel}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 text-blue-600" />
                Logout
              </Button>
            </>
          )}
          {!user && (
            <Button variant="default" size="sm" onClick={handleLogin}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

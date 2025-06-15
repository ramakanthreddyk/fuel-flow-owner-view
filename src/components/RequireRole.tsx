
import { ReactNode } from "react";
import { useUser } from "@/context/UserContext";

interface RequireRoleProps {
  roles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Role-based UI lock. Superadmin always has access.
 */
export default function RequireRole({ roles, children, fallback = null }: RequireRoleProps) {
  const { user, loading } = useUser();
  if (loading) return null;
  if (user && (user.role === "superadmin" || roles.includes(user.role))) {
    return <>{children}</>;
  }
  return (
    fallback ||
    <div className="p-4 text-muted-foreground bg-gray-50 rounded-md border border-gray-200 my-6">
      You do not have access to this section.
    </div>
  );
}

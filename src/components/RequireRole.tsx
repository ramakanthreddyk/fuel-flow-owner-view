
import { ReactNode } from "react";
import { useUser } from "@/context/UserContext";

interface RequireRoleProps {
  roles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RequireRole({ roles, children, fallback = null }: RequireRoleProps) {
  const user = useUser();
  if (roles.includes(user.role)) {
    return <>{children}</>;
  }
  return fallback || <div className="p-4 text-muted-foreground bg-gray-50 rounded-md border border-gray-200 my-6">You do not have access to this section.</div>;
}


import { ReactNode } from "react";
import { useUser } from "@/context/UserContext";

interface GuardProps {
  roles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Generic role-based guard. Example usage:
 *   <Guard roles={['owner', 'superadmin']}><Section /></Guard>
 *   Superadmin always has access to all sections.
 */
export default function Guard({ roles, children, fallback = null }: GuardProps) {
  const { user, loading } = useUser();
  if (loading) return null;
  if (user && (user.role === "superadmin" || roles.includes(user.role))) {
    return <>{children}</>;
  }
  return fallback;
}

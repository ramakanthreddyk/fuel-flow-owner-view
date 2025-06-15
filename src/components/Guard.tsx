
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
 */
export default function Guard({ roles, children, fallback = null }: GuardProps) {
  const user = useUser();
  if (roles.includes(user.role)) {
    return <>{children}</>;
  }
  return fallback;
}

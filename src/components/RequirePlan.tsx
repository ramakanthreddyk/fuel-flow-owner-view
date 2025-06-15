
import { ReactNode } from "react";
import { useUser } from "@/context/UserContext";

interface RequirePlanProps {
  plans: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Plan-based UI lock. Superadmin always has access to all features.
 */
export default function RequirePlan({ plans, children, fallback = null }: RequirePlanProps) {
  const { user, loading } = useUser();
  if (loading) return null;
  if (user && (user.role === "superadmin" || plans.includes(user.plan))) {
    return <>{children}</>;
  }
  return (
    fallback || (
      <div className="p-4 flex items-center gap-2 bg-yellow-50 border border-yellow-300 text-yellow-900 rounded-md my-6">
        <span className="inline-block mr-1">🔒</span>
        <span>This feature requires a premium plan. <a href="/settings" className="underline">Upgrade to unlock</a></span>
      </div>
    )
  );
}

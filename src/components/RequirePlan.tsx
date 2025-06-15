
import { ReactNode } from "react";
import { useUser } from "@/context/UserContext";

interface RequirePlanProps {
  plans: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RequirePlan({ plans, children, fallback = null }: RequirePlanProps) {
  const user = useUser();
  if (plans.includes(user.plan)) {
    return <>{children}</>;
  }
  return fallback || (
    <div className="p-4 flex items-center gap-2 bg-yellow-50 border border-yellow-300 text-yellow-900 rounded-md my-6">
      <span className="inline-block mr-1">🔒</span>
      <span>This feature requires a premium plan. <a href="/settings" className="underline">Upgrade to unlock</a></span>
    </div>
  );
}

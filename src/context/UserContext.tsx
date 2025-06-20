
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define the user shape expected by old code
export interface AppUser {
  name: string;
  role: "owner" | "superadmin" | "employee";
  plan: "free" | "premium";
  email?: string;
  id?: string;
}

// New type for return
interface UseUserResult {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to get current profile from Supabase.
 * Usage: const { user, loading, error } = useUser();
 */
export function useUser(): UseUserResult {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    supabase
      .from("profiles")
      .select("id, name, email, role")
      .eq("id", authUser.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setProfile(null);
          setError(error.message);
        } else if (!data) {
          setProfile(null);
          setError("No profile found for authenticated user.");
        } else {
          // Log the exact result from Supabase
          console.log("[useUser] Fetched profile from Supabase:", data);
          // TODO: For "plan", assume "premium" if user is superadmin, else "free". Modify logic if plan becomes available.
          setProfile({
            name: data.name ?? data.email ?? "Unknown",
            email: data.email,
            id: data.id,
            role: data.role,
            plan: data.role === "superadmin" ? "premium" : "free",
          });
        }
        setLoading(false);
      });
  }, [authUser]);

  return { user: profile, loading, error };
}

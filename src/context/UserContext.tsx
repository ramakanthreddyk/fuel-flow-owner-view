
import { useAuth } from "./AuthContext";

// Define the user shape expected by old code
export interface AppUser {
  name: string;
  role: "owner" | "superadmin" | "employee";
  plan: "free" | "premium";
  email?: string;
  id?: string;
}

// Use user from AuthContext. Provide fallback role/plan for now.
export function useUser(): AppUser {
  const { user } = useAuth();

  // Fallback to dummy info if not signed in
  if (!user) {
    return {
      name: "Demo User",
      role: "owner",
      plan: "free",
    };
  }

  // Use Supabase user email as name; customize role/plan as you wish (for now, all users are "owner"/"free", update when backend ready)
  return {
    name: user.email || "No Email",
    email: user.email,
    id: user.id,
    role: "owner",
    plan: "free",
  };
}

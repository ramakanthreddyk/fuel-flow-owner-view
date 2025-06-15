
import React, { createContext, useContext } from "react";

type Role = "superadmin" | "owner" | "employee";
type Plan = "free" | "premium";

export interface User {
  id: string;
  name: string;
  role: Role;
  plan: Plan;
}

const MOCK_USER: User = {
  id: "1",
  name: "Amit Sharma",
  role: "superadmin",   // Changed for demo
  plan: "free",    // Change for testing
};

const UserContext = createContext<User>(MOCK_USER);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => (
  <UserContext.Provider value={MOCK_USER}>{children}</UserContext.Provider>
);


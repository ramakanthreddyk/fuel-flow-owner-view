
export type RoleOption = "superadmin" | "owner" | "employee";
export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleOption;
}

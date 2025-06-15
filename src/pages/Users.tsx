
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import RequireRole from "@/components/RequireRole";
import { toast } from "@/hooks/use-toast";
import { AddUserDialog } from "@/components/AddUserDialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type RoleOption = "superadmin" | "owner" | "employee";

interface User {
  id: string;
  name: string;
  email: string;
  role: RoleOption;
}

const ROLE_LABELS: Record<RoleOption, string> = {
  superadmin: "Superadmin",
  owner: "Owner",
  employee: "Employee",
};

function UserRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
      </TableCell>
    </TableRow>
  );
}

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<RoleOption | "">("");
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  // Filter users by selected role
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return roleFilter
      ? users.filter((u) => u.role === roleFilter)
      : users;
  }, [users, roleFilter]);

  return (
    <RequireRole roles={["superadmin"]}>
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h1 className="text-3xl font-bold">User Management</h1>
          <AddUserDialog onCreated={refetch} />
        </div>

        <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex gap-2 items-center">
            <span className="font-medium text-sm">Role Filter:</span>
            <Select value={roleFilter} onValueChange={v => setRoleFilter(v as RoleOption | "")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="superadmin">Superadmin</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-4 border rounded bg-white mt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 7 }).map((_, k) => <UserRowSkeleton key={k} />)
                : filteredUsers.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 opacity-60 italic">
                        No users found.
                      </TableCell>
                    </TableRow>
                    )
                  : filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{ROLE_LABELS[user.role]}</TableCell>
                      </TableRow>
                    ))}
            </TableBody>
          </Table>
        </div>
        {error && <div className="text-red-600 mt-2">There was an error loading users.</div>}
      </div>
    </RequireRole>
  );
}

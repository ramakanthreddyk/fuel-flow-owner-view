import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import RequireRole from "@/components/RequireRole";
import { toast } from "@/hooks/use-toast";
import { AddUserDialog } from "@/components/AddUserDialog";
import EditUserDialog from "@/components/EditUserDialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChartContainer, ChartLegend, ChartTooltip, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

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
      <TableCell>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-28" />
      </TableCell>
    </TableRow>
  );
}

async function fetchUsersFromSupabase(): Promise<User[]> {
  // Get users and their roles from Supabase
  const { data: usersData, error: usersError } = await supabase.from("users").select("id, name, email");
  if (usersError) throw new Error("Failed to fetch users: " + usersError.message);
  // Fetch the user_roles table as well
  const { data: rolesData, error: rolesError } = await supabase.from("user_roles").select("user_id, role");
  if (rolesError) throw new Error("Failed to fetch user roles: " + rolesError.message);
  // Map roles to users
  return (usersData || []).map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: (rolesData?.find(r => r.user_id === u.id)?.role || "employee") as RoleOption,
  }));
}

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<RoleOption | "all">("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // Fetch users from Supabase
  const {
    data: usersFromServer,
    isLoading,
    error,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["users-supabase"],
    queryFn: fetchUsersFromSupabase,
  });

  // Add user
  const addUserMutation = useMutation({
    mutationFn: async (newUser: { name: string; email: string; password: string; role: RoleOption }) => {
      // Insert into users table
      const { data: insertUser, error: insertUserErr } = await supabase
        .from("users")
        .insert([{ name: newUser.name, email: newUser.email, password: newUser.password }])
        .select("id, name, email")
        .maybeSingle();
      if (insertUserErr || !insertUser) throw new Error(insertUserErr?.message || "User creation failed");

      // Insert into user_roles table
      const { error: insertRoleErr } = await supabase
        .from("user_roles")
        .insert([{ user_id: insertUser.id, role: newUser.role }]);
      if (insertRoleErr) {
        // Rollback: delete user if role insert fails
        await supabase.from("users").delete().eq("id", insertUser.id);
        throw new Error(insertRoleErr.message || "Role insert failed");
      }

      return {
        id: insertUser.id,
        name: insertUser.name,
        email: insertUser.email,
        role: newUser.role,
      };
    },
    onSuccess: () => {
      toast({ title: "User added", description: "The user was added to User Management." });
      queryClient.invalidateQueries({ queryKey: ["users-supabase"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  // Edit user
  const editUserMutation = useMutation({
    mutationFn: async (updatedUser: User) => {
      // Update users and user_roles
      const { error: userErr } = await supabase
        .from("users")
        .update({ name: updatedUser.name, email: updatedUser.email })
        .eq("id", updatedUser.id);
      if (userErr) throw new Error(userErr.message);

      const { error: roleErr } = await supabase
        .from("user_roles")
        .update({ role: updatedUser.role })
        .eq("user_id", updatedUser.id);
      if (roleErr) throw new Error(roleErr.message);

      return updatedUser;
    },
    onSuccess: (_, updatedUser) => {
      toast({ title: "User updated", description: `User ${updatedUser.name} saved.` });
      queryClient.invalidateQueries({ queryKey: ["users-supabase"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  // Delete user (now via edge function)
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error, data } = await supabase.functions.invoke("delete-user-fully", {
        body: { id },
      });
      if (error) {
        throw new Error(error.message || "Edge function failed");
      }
      if (data && data.error) {
        throw new Error(data.error);
      }
    },
    onSuccess: () => {
      toast({ title: "User deleted", description: "User account fully removed." });
      setDeleteUser(null);
      queryClient.invalidateQueries({ queryKey: ["users-supabase"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  // Filter users by selected role
  const filteredUsers = useMemo(() => {
    if (!usersFromServer) return [];
    return roleFilter !== "all"
      ? usersFromServer.filter((u) => u.role === roleFilter)
      : usersFromServer;
  }, [usersFromServer, roleFilter]);

  // Data for the chart: count of users per role
  const roleCount = ["superadmin", "owner", "employee"].map(role => ({
    role,
    label: ROLE_LABELS[role as RoleOption],
    count: (usersFromServer || []).filter(u => u.role === role).length,
  }));

  return (
    <RequireRole roles={["superadmin"]}>
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h1 className="text-3xl font-bold">User Management</h1>
          <AddUserDialog
            onCreated={refetch}
            onUserCreated={(usr) => {
              // Only pass name, email, password, role; drop other fields
              // (AddUserDialog always supplies all required fields)
              addUserMutation.mutate({
                name: usr.name,
                email: usr.email,
                password: (usr as any).password, // password is supplied from AddUserDialog form; fallback for types
                role: usr.role,
              });
            }}
          />
        </div>
        <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex gap-2 items-center">
            <span className="font-medium text-sm">Role Filter:</span>
            <Select value={roleFilter} onValueChange={v => setRoleFilter(v as RoleOption | "all")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 7 }).map((_, k) => <UserRowSkeleton key={k} />)
                : filteredUsers.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 opacity-60 italic">
                        No users found.
                      </TableCell>
                    </TableRow>
                    )
                  : filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{ROLE_LABELS[user.role]}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>Edit</Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="ml-2"
                            onClick={() => setDeleteUser(user)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
            </TableBody>
          </Table>
        </div>
        {error && <div className="text-red-600 mt-2">There was an error loading users.</div>}

        {/* User Counts Chart */}
        <div className="my-8">
          <h2 className="text-xl font-semibold mb-2">Users per Role</h2>
          <div className="bg-white border rounded-md p-4 max-w-xl">
            <ChartContainer config={{
              superadmin: { label: "Superadmin", color: "#5a67d8" },
              owner: { label: "Owner", color: "#38b2ac" },
              employee: { label: "Employee", color: "#f6ad55" },
            }}>
              <BarChart data={roleCount} height={200}>
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Bar dataKey="count" name="Count"
                  fill="#4A90E2"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
                <ChartTooltip content={<ChartTooltipContent labelKey="label" />} />
                <ChartLegend content={<ChartLegendContent nameKey="label" />} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
        {/* Edit User Dialog */}
        {editingUser && (
          <EditUserDialog
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onUserEdited={(usr) => editUserMutation.mutate(usr)}
          />
        )}
        {/* Delete Confirmation Dialog */}
        {deleteUser && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
            <div className="bg-white rounded shadow-lg p-6 w-[350px]">
              <h3 className="text-lg font-semibold mb-2">Delete User?</h3>
              <p className="mb-4">
                Are you sure you want to delete user
                <span className="font-medium ml-1">{deleteUser.name}</span>?
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteUserMutation.mutate(deleteUser.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireRole>
  );
}

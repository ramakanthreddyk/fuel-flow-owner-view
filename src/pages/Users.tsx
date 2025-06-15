import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import RequireRole from "@/components/RequireRole";
import { toast } from "@/hooks/use-toast";
import { AddUserDialog } from "@/components/AddUserDialog";
import EditUserDialog from "@/components/EditUserDialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserTable } from "@/components/UserTable";
import { UsersRoleChart } from "@/components/UsersRoleChart";
import { DeleteUserDialog } from "@/components/DeleteUserDialog";
import { RoleOption, User } from "@/types/user";
import { ROLE_LABELS } from "@/constants/roles";

type RoleOption = "superadmin" | "owner" | "employee";

interface User {
  id: string;
  name: string;
  email: string;
  role: RoleOption;
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
          <UserTable
            users={filteredUsers}
            isLoading={isLoading}
            onEdit={setEditingUser}
            onDelete={setDeleteUser}
          />
        </div>
        {error && <div className="text-red-600 mt-2">There was an error loading users.</div>}
        <UsersRoleChart users={usersFromServer || []} />
        {editingUser && (
          <EditUserDialog
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onUserEdited={(usr) => editUserMutation.mutate(usr)}
          />
        )}
        {deleteUser && (
          <DeleteUserDialog
            user={deleteUser}
            onClose={() => setDeleteUser(null)}
            onDelete={deleteUserMutation.mutate}
            loading={deleteUserMutation.isPending}
          />
        )}
      </div>
    </RequireRole>
  );
}

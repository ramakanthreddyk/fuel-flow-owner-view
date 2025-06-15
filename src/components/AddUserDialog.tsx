import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

type RoleOption = "superadmin" | "owner" | "employee";

interface AddUserDialogProps {
  onCreated?: () => void;
  onUserCreated?: (user: { id: string; name: string; email: string; role: RoleOption; password?: string }) => void;
}

export function AddUserDialog({ onCreated, onUserCreated }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "employee" as RoleOption,
    },
  });

  // Add a helper to retry fetching just-created user, up to 3 tries (750ms total)
  async function ensureUserInDb(userId: string, retries = 3, delayMs = 250): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
      const { data, error } = await import("@/integrations/supabase/client").then(mod =>
        mod.supabase.from("users").select("id").eq("id", userId).maybeSingle()
      );
      if (data) return true;
      await new Promise(res => setTimeout(res, delayMs));
    }
    return false;
  }

  async function onSubmit(values: { name: string; email: string; password: string; role: string }) {
    setLoading(true);
    try {
      // Create user in Supabase (users table)
      const { data: insertUser, error: insertUserErr } = await import("@/integrations/supabase/client").then(mod =>
        mod.supabase
          .from("users")
          .insert([{ name: values.name, email: values.email, password: values.password }])
          .select("id, name, email")
          .maybeSingle()
      );
      console.log("Attempted to insert user into users table:", insertUser, insertUserErr);

      if (insertUserErr || !insertUser) {
        throw new Error(insertUserErr?.message || "User creation failed");
      }

      // Confirm user exists before inserting role (helps avoid 409 race condition)
      const userExists = await ensureUserInDb(insertUser.id);
      console.log("User existence check for role insert:", insertUser.id, userExists);
      if (!userExists) {
        throw new Error(
          "User insert found, but user record not yet available. Please try again."
        );
      }

      // Assign role
      const { error: insertRoleErr } = await import("@/integrations/supabase/client").then(mod =>
        mod.supabase
          .from("user_roles")
          .insert([{ user_id: insertUser.id, role: values.role }])
      );
      console.log("Tried inserting user role:", { user_id: insertUser.id, role: values.role }, insertRoleErr);
      if (insertRoleErr) {
        // Clean up: rollback user insert
        await import("@/integrations/supabase/client").then(mod =>
          mod.supabase.from("users").delete().eq("id", insertUser.id)
        );
        throw new Error(insertRoleErr.message || "Role insert failed");
      }

      setOpen(false);
      toast({ title: "User added", description: "The user has been created." });
      form.reset();
      onUserCreated?.({
        id: insertUser.id,
        name: insertUser.name,
        email: values.email,
        role: values.role as RoleOption,
        password: values.password,
      });
      onCreated?.();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      console.error("Error in AddUserDialog onSubmit chain:", err);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>Enter details for the new user</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^@]+@[^@]+\.[^@]+$/,
                  message: "Invalid email",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="off" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="off" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="superadmin">Superadmin</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

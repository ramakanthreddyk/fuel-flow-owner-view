
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type RoleOption = "superadmin" | "owner" | "employee";
interface User {
  id: string;
  name: string;
  email: string;
  role: RoleOption;
}

interface EditUserDialogProps {
  user: User;
  onClose: () => void;
  onUserEdited: (updated: User) => void;
}

const ROLE_LABELS: Record<RoleOption, string> = {
  superadmin: "Superadmin",
  owner: "Owner",
  employee: "Employee",
};

export default function EditUserDialog({ user, onClose, onUserEdited }: EditUserDialogProps) {
  const [form, setForm] = useState<User>(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Update users table (name, email)
      const { error: userErr } = await import("@/integrations/supabase/client").then(mod =>
        mod.supabase.from("users").update({ name: form.name, email: form.email }).eq("id", form.id)
      );
      if (userErr) throw new Error(userErr.message);

      // Update user_roles table (role)
      const { error: roleErr } = await import("@/integrations/supabase/client").then(mod =>
        mod.supabase.from("user_roles").update({ role: form.role }).eq("user_id", form.id)
      );
      if (roleErr) throw new Error(roleErr.message);

      onUserEdited({ ...form });
      onClose();
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Name</label>
            <Input name="name" value={form.name} onChange={handleChange} disabled={loading} />
          </div>
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Role</label>
            <Select
              value={form.role}
              onValueChange={val => setForm(f => ({ ...f, role: val as RoleOption }))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue>
                  {ROLE_LABELS[form.role]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">{ROLE_LABELS.superadmin}</SelectItem>
                <SelectItem value="owner">{ROLE_LABELS.owner}</SelectItem>
                <SelectItem value="employee">{ROLE_LABELS.employee}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

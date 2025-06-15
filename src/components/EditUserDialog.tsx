
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
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.email?._errors?.[0] || data.error || "Failed to update user");
      }
      const updated = await res.json();
      onUserEdited({ ...updated, email: form.email });
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
            <Select value={form.role} onValueChange={val => setForm(f => ({ ...f, role: val as RoleOption }))} disabled={loading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">Superadmin</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
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

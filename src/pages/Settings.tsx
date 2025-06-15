
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user, loading, error } = useUser();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // When user data loads, update the name field
  // eslint-disable-next-line
  // @ts-ignore
  if (user && !editing && name !== user.name) setName(user.name);

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!user) return <div className="p-8 text-gray-600">No user data found.</div>;

  async function handleSave() {
    setSaving(true);
    const { error: updateErr } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", user.id);
    setSaving(false);

    if (updateErr) {
      toast({
        title: "Failed to update name",
        description: updateErr.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Name updated!",
        description: "Your display name was changed successfully.",
      });
      setEditing(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="p-4 border rounded bg-white max-w-lg">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Display name:</span>
            {!editing ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            ) : null}
          </div>
          {!editing ? (
            <div className="mt-1">{user.name}</div>
          ) : (
            <form
              className="mt-2 flex items-center gap-2"
              onSubmit={e => {
                e.preventDefault();
                handleSave();
              }}
            >
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-48"
                disabled={saving}
              />
              <Button type="submit" size="sm" disabled={saving || !name.trim()}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={saving}
                onClick={() => {
                  setEditing(false);
                  setName(user.name);
                }}
              >
                Cancel
              </Button>
            </form>
          )}
        </div>
        <div className="text-sm text-gray-500 mt-3">
          Email: {user.email}<br />
          Role: <span className="capitalize">{user.role}</span><br />
          Plan: <span className={user.plan === "premium" ? "text-yellow-700 font-semibold" : ""}>{user.plan}</span>
        </div>
      </div>
    </div>
  );
}


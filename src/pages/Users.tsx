
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import RequireRole from "@/components/RequireRole";
import { toast } from "@/hooks/use-toast";

// Mock user data for demo purposes
const USERS = [
  { id: "1", name: "Amit Sharma", email: "amit@email.com", role: "superadmin" },
  { id: "2", name: "Priya Singh", email: "priya@email.com", role: "owner" },
  { id: "3", name: "Rahul Kumar", email: "rahul@email.com", role: "employee" },
];

export default function UsersPage() {
  function handleAddUser() {
    toast({ title: "Add User", description: "This would open a dialog to add a new user." });
  }

  return (
    <RequireRole roles={["superadmin"]}>
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Button onClick={handleAddUser}>Add User</Button>
        </div>
        <div className="p-4 border rounded bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USERS.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </RequireRole>
  );
}

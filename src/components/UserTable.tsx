
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { ROLE_LABELS } from "@/constants/roles";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

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

export function UserTable({ users, isLoading, onEdit, onDelete }: UserTableProps) {
  return (
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
          : users.length === 0
            ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 opacity-60 italic">
                  No users found.
                </TableCell>
              </TableRow>
              )
            : users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{ROLE_LABELS[user.role]}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => onEdit(user)}>Edit</Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="ml-2"
                      onClick={() => onDelete(user)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
      </TableBody>
    </Table>
  );
}

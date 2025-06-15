
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";

interface DeleteUserDialogProps {
  user: User;
  onClose: () => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export function DeleteUserDialog({ user, onClose, onDelete, loading }: DeleteUserDialogProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded shadow-lg p-6 w-[350px]">
        <h3 className="text-lg font-semibold mb-2">Delete User?</h3>
        <p className="mb-4">
          Are you sure you want to delete user
          <span className="font-medium ml-1">{user.name}</span>?
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(user.id)}
            disabled={loading}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}


import React from "react";
import { Select } from "@/components/ui/select";
import { User as UserIcon, BadgeCheck } from "lucide-react";

type Props = {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
};

export default function RoleSelect({ id, value, onChange, disabled }: Props) {
  return (
    <select
      id={id}
      name="role"
      className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      value={value}
      onChange={onChange}
      disabled={disabled}
      required
    >
      <option value="owner">
        👑 Owner (Full Access)
      </option>
      <option value="employee">
        👷 Employee (Limited)
      </option>
    </select>
  );
}

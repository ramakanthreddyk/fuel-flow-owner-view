
import { ChartContainer, ChartLegend, ChartTooltip, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { ROLE_LABELS } from "@/constants/roles";
import { User } from "@/types/user";

interface UsersRoleChartProps {
  users: User[];
}

export function UsersRoleChart({ users }: UsersRoleChartProps) {
  const roleCount = ["superadmin", "owner", "employee"].map(role => ({
    role,
    label: ROLE_LABELS[role as keyof typeof ROLE_LABELS],
    count: (users || []).filter(u => u.role === role).length,
  }));

  return (
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
  );
}

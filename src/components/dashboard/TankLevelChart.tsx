
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Dummy tank stock data
const tankLevels = [
  { name: "Petrol", value: 3400, capacity: 5000 },
  { name: "Diesel", value: 1200, capacity: 4000 },
];

const COLORS = ["#22c55e", "#3b82f6"];

const TankLevelChart = ({ loading }: { loading?: boolean }) => {
  if (loading) {
    return <Skeleton className="h-[220px] w-full rounded-md" />;
  }

  // Transform for the doughnut chart as % of total capacity
  const pieData = tankLevels.map((t) => ({
    name: t.name,
    value: t.value,
    percent: Number(((t.value / t.capacity) * 100).toFixed(1)),
    capacity: t.capacity,
  }));

  return (
    <div className="w-full h-[220px] flex flex-col items-center">
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="percent"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={42}
            outerRadius={70}
            paddingAngle={5}
            labelLine={false}
            label={({ percent }) =>
              `${percent}%`
            }
          >
            {pieData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(_: any, name: any, props: any) =>
              [
                `${props.payload.value * props.payload.capacity / 100}% filled`,
                name,
              ]
            }
            contentStyle={{ fontSize: 14, borderRadius: 8 }}
          />
          <Legend iconType="rect" wrapperStyle={{ fontSize: 13 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2 text-sm justify-center">
        {pieData.map((t, idx) => (
          <div key={t.name} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[idx] }}
            />
            <span>{t.name}: {t.value} L / {t.capacity} L</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TankLevelChart;

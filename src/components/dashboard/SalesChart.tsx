
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

// Dummy 7-day grouped sales data per fuel type
const salesData = [
  { date: "07 Jun", Petrol: 9000, Diesel: 5800 },
  { date: "08 Jun", Petrol: 6400, Diesel: 4100 },
  { date: "09 Jun", Petrol: 7100, Diesel: 4300 },
  { date: "10 Jun", Petrol: 8900, Diesel: 5400 },
  { date: "11 Jun", Petrol: 9200, Diesel: 6100 },
  { date: "12 Jun", Petrol: 8600, Diesel: 5050 },
  { date: "13 Jun", Petrol: 10500, Diesel: 7000 },
];

const COLORS = {
  Petrol: "#22c55e", // Tailwind green-500
  Diesel: "#3b82f6", // Tailwind blue-500
};

const SalesChart = ({ loading }: { loading?: boolean }) => {
  if (loading)
    return <Skeleton className="h-[220px] w-full rounded-md" />;

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesData} margin={{ top: 6, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 13 }} />
          <YAxis
            tickFormatter={(v) => `₹${v / 1000}k`}
            tick={{ fill: "#6b7280", fontSize: 13 }}
          />
          <Tooltip
            formatter={(value: any, name: any) => [`₹${value.toLocaleString()}`, name]}
            contentStyle={{ fontSize: 14, borderRadius: 8 }}
          />
          <Legend verticalAlign="top" iconType="circle" wrapperStyle={{ fontSize: 13 }} />
          <Line
            type="monotone"
            dataKey="Petrol"
            stroke={COLORS.Petrol}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Diesel"
            stroke={COLORS.Diesel}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;

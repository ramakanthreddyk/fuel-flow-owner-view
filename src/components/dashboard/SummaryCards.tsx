
import { CircleDollarSign, Fuel, ListChecks, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Hardcoded summary demo data
const stats = [
  {
    label: "Total Sales Today",
    value: "₹42,000",
    icon: <CircleDollarSign className="w-7 h-7 text-green-600" />,
    sub: "Petrol + Diesel",
  },
  {
    label: "Litres Dispensed Today",
    value: "3,250 L",
    icon: <Fuel className="w-7 h-7 text-blue-600" />,
    sub: "All Nozzles",
  },
  {
    label: "Entries Today",
    value: "98",
    icon: <ListChecks className="w-7 h-7 text-orange-500" />,
    sub: "Billing/Dispense",
  },
  {
    label: "Tank Refills Today",
    value: "1,200 L",
    icon: <RefreshCcw className="w-7 h-7 text-purple-500" />,
    sub: "All Tanks",
  },
];

const SummaryCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((s) => (
        <Card key={s.label} className="h-full">
          <CardContent className="flex items-center gap-4 py-6 px-4">
            <div className="rounded-full bg-muted flex items-center justify-center size-14 shrink-0">
              {s.icon}
            </div>
            <div>
              <div className="text-2xl font-bold leading-snug">{s.value}</div>
              <div className="text-muted-foreground text-xs font-medium mt-1">{s.label}</div>
              <div className="text-xs text-muted-foreground/70">{s.sub}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;

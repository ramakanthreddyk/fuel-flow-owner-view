
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type FuelTypeSummary = {
  fuelType: string;
  amount: number;
  litres: number;
};

interface SalesSummaryProps {
  loading: boolean;
  summary: null | {
    totalAmount: number;
    totalLitres: number;
    breakdown: FuelTypeSummary[];
  };
}

export default function SalesSummary({ loading, summary }: SalesSummaryProps) {
  return (
    <div className="flex gap-4 flex-wrap mb-6">
      <Card className="min-w-[180px]">
        <CardHeader>
          <CardDescription>Total Sales Amount</CardDescription>
          <CardTitle className="text-2xl">
            {loading ? <span className="animate-pulse bg-gray-200 rounded px-6 py-2" /> : "₹" + (summary?.totalAmount?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) ?? "0")}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="min-w-[180px]">
        <CardHeader>
          <CardDescription>Total Litres Sold</CardDescription>
          <CardTitle className="text-2xl">
            {loading ? <span className="animate-pulse bg-gray-200 rounded px-4 py-2" /> : summary?.totalLitres?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) ?? "0"}
          </CardTitle>
        </CardHeader>
      </Card>
      {summary?.breakdown?.map((b) => (
        <Card className="min-w-[180px]" key={b.fuelType}>
          <CardHeader className="flex flex-row items-center gap-2">
            <Badge variant={b.fuelType === "diesel" ? "secondary" : "default"}>
              {b.fuelType[0].toUpperCase() + b.fuelType.slice(1)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">Amount</div>
            <div className="font-semibold mb-2">₹{b.amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
            <div className="text-xs text-muted-foreground">Litres</div>
            <div className="font-semibold">{b.litres.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

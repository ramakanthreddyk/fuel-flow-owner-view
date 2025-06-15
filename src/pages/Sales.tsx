
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import SalesSummary from "./sales/SalesSummary";
import SalesFilters from "./sales/SalesFilters";
import SalesTable from "./sales/SalesTable";

function getInitialDateRange() {
  // Last 7 days
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate()-6);
  return { from, to };
}

function buildFiltersQuery(filter: any) {
  const params = new URLSearchParams();
  if (filter.dateRange?.from) params.append("from", filter.dateRange.from.toISOString());
  if (filter.dateRange?.to) params.append("to", filter.dateRange.to.toISOString());
  // "all" means unfiltered, send blank to API
  if (filter.fuelType && filter.fuelType !== "all") params.append("fuelType", filter.fuelType);
  if (filter.source && filter.source !== "all") params.append("source", filter.source);
  if (filter.stationId && filter.stationId !== "all") params.append("stationId", filter.stationId);
  return params;
}

export default function SalesPage() {
  const user = useUser();

  const [filter, setFilter] = React.useState(() => ({
    dateRange: getInitialDateRange(),
    fuelType: "all",
    source: "all",
    stationId: "all",
  }));

  const [page, setPage] = React.useState(1);
  const pageSize = 20;

  const [sort, setSort] = React.useState<{ field: string; order: "asc"|"desc" }>({
    field: "sale_datetime", order: "desc"
  });

  // You might want to fetch these stations options from an API (mocked here)
  const stationOptions = [
    { id: "a1b2c3", name: "Main Station" },
    { id: "b2c3d4", name: "City Fuel Stop" },
  ];

  // Fetch summary stats
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["sales-summary", filter],
    queryFn: async () => {
      const qs = buildFiltersQuery(filter);
      const res = await fetch(`/api/sales/summary?${qs}`).then(r=>r.json());
      // API shape: { totalAmount, totalLitres, breakdown: [{fuelType, amount, litres}] }
      return res;
    },
  });

  // Fetch sales with filters & pagination
  const { data: salesRes, isLoading: loadingTable } = useQuery({
    queryKey: ["sales-list", filter, page, sort],
    queryFn: async () => {
      const qs = buildFiltersQuery({ ...filter, page, pageSize, sortField: sort.field, sortOrder: sort.order });
      const res = await fetch(`/api/sales?${qs}`).then(r=>r.json());
      return res; // { results: SaleRow[], total: number }
    },
  });

  function handleSort(field: string) {
    setSort(s => {
      if (s.field === field) {
        return { field, order: s.order==="asc"?"desc":"asc" };
      }
      return { field, order: "asc" };
    });
  }

  function handleExportCsv() {
    // If premium, would export. Otherwise just show alert for demo.
    alert("CSV export is a premium feature. Please upgrade!");
  }

  // Show station select if multiple stations
  const showStationSelect = stationOptions.length > 1;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Sales</h1>
      <SalesSummary loading={loadingSummary} summary={summary || null} />
      <SalesFilters
        filter={filter}
        onChange={f => { setFilter(f); setPage(1); }}
        stationOptions={stationOptions}
        showStationSelect={showStationSelect}
      />
      <SalesTable
        sales={salesRes?.results || []}
        loading={loadingTable}
        page={page}
        pageSize={pageSize}
        total={salesRes?.total || 0}
        onPageChange={setPage}
        onSort={handleSort}
        sortField={sort.field}
        sortOrder={sort.order}
        onExportCsv={handleExportCsv}
        canExport={false}
      />
    </div>
  );
}

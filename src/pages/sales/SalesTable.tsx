import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from "@/components/ui/pagination";
import { Download, Badge as BadgeIcon } from "lucide-react";

type SaleRow = {
  id: string;
  sale_datetime: string;
  station: string;
  nozzle: string;
  fuel_type: string;
  litres: number;
  fuel_price: number;
  sale_amount: number;
  source: string; // "ocr" | "manual"
};

interface SalesTableProps {
  sales: SaleRow[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onSort: (field: string) => void;
  sortField: string;
  sortOrder: "asc" | "desc";
  onExportCsv: () => void;
  canExport: boolean;
}

function getSourceBadge(source: string) {
  if (source === "ocr") {
    return <Badge variant="default" className="flex gap-1 items-center"><BadgeIcon size={14} />OCR</Badge>;
  }
  return <Badge variant="secondary" className="flex gap-1 items-center"><BadgeIcon size={14} />Manual</Badge>;
}

export default function SalesTable({
  sales, loading, page, pageSize, total,
  onPageChange, onSort, sortField, sortOrder,
  onExportCsv, canExport,
}: SalesTableProps) {
  // Pagination UI
  const lastPage = Math.ceil(total / pageSize);

  return (
    <div className="bg-white rounded shadow border">
      <div className="flex items-center justify-between px-2 py-2">
        <div className="font-semibold">Sales Entries</div>
        <button
          className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded disabled:opacity-40"
          onClick={onExportCsv}
          disabled={!canExport}
          title={canExport ? "Export CSV" : "Premium only"}
        >
          <Download size={16} /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => onSort("sale_datetime")}>
                Date {sortField==="sale_datetime" && (sortOrder==="asc"?"↑":"↓")}
              </TableHead>
              <TableHead>Station</TableHead>
              <TableHead>Nozzle</TableHead>
              <TableHead>Fuel Type</TableHead>
              <TableHead className="text-right">Litres</TableHead>
              <TableHead>Price/Litre</TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => onSort("sale_amount")}>
                Sale Amount {sortField==="sale_amount" && (sortOrder==="asc"?"↑":"↓")}
              </TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="h-12 flex items-center justify-center">
                    <span className="animate-pulse text-muted">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) :
              sales.length===0 ? (
                <TableRow>
                  <TableCell colSpan={8}><span className="text-muted">No sales found.</span></TableCell>
                </TableRow>
              ) :
              sales.map(sale => (
                <TableRow key={sale.id}>
                  <TableCell>{new Date(sale.sale_datetime).toLocaleString("en-IN")}</TableCell>
                  <TableCell>{sale.station}</TableCell>
                  <TableCell>{sale.nozzle}</TableCell>
                  <TableCell className="capitalize">{sale.fuel_type}</TableCell>
                  <TableCell className="text-right">{sale.litres?.toLocaleString("en-IN")}</TableCell>
                  <TableCell>₹{sale.fuel_price?.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-right">₹{sale.sale_amount?.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>{getSourceBadge(sale.source)}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-2 flex items-center justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => page>1 && onPageChange(page-1)}
                aria-disabled={page<=1}
              />
            </PaginationItem>
            {[...Array(lastPage>1?lastPage:1)].map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  isActive={page === idx+1}
                  onClick={() => onPageChange(idx+1)}
                  className="cursor-pointer"
                >
                  {idx+1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() => page<lastPage && onPageChange(page+1)}
                aria-disabled={page>=lastPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}


import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type FilterState = {
  dateRange: { from: Date | null; to: Date | null }, // both inclusive
  fuelType: string;
  source: string;
  stationId: string;
};

interface SalesFiltersProps {
  filter: FilterState;
  onChange: (newFilter: FilterState) => void;
  stationOptions: { id: string; name: string }[];
  showStationSelect: boolean;
}

export default function SalesFilters({ filter, onChange, stationOptions, showStationSelect }: SalesFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6 items-end">
      <div>
        <div className="text-xs text-muted-foreground mb-1">Date Range</div>
        <Calendar 
          mode="range"
          selected={{ from: filter.dateRange.from ?? undefined, to: filter.dateRange.to ?? undefined }}
          onSelect={range => onChange({ ...filter, dateRange: { from: range?.from ?? null, to: range?.to ?? null } })}
          numberOfMonths={1}
        />
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-1">Fuel Type</div>
        <Select value={filter.fuelType} onValueChange={val => onChange({ ...filter, fuelType: val })}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="petrol">Petrol</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-1">Source</div>
        <Select value={filter.source} onValueChange={val => onChange({ ...filter, source: val })}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ocr">OCR</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {showStationSelect &&
        <div>
          <div className="text-xs text-muted-foreground mb-1">Station</div>
          <Select value={filter.stationId} onValueChange={val => onChange({ ...filter, stationId: val })}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {stationOptions.map(s => (
                <SelectItem value={s.id} key={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      <Button variant="ghost" size="sm" className="md:ml-8" onClick={() => onChange({
        dateRange: { from: null, to: null },
        fuelType: "all",
        source: "all",
        stationId: "all",
      })}>Clear All</Button>
    </div>
  );
}

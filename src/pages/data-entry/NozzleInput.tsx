
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { usePumpNozzles, useLastNozzleReading, useLatestPrice } from "@/hooks/useManualEntryData";

// NozzleInput props: pumpId, stationId, onSelection, onReadingChange
export default function NozzleInput({
  pumpId,
  stationId,
  value,
  onChange,
  onNozzleChange,
}: {
  pumpId?: string;
  stationId?: string;
  value?: number;
  onChange: (reading: number) => void;
  onNozzleChange: (id: string | undefined) => void;
}) {
  const [selectedNozzleId, setSelectedNozzleId] = useState<string>();
  const { data: nozzles = [], isLoading, error } = usePumpNozzles(pumpId);
  const lastReadingQ = useLastNozzleReading(selectedNozzleId);
  const nozzle = nozzles.find((n: any) => n.id === selectedNozzleId);
  const priceQ = useLatestPrice(stationId, nozzle?.fuel_type);

  function handleNozzleSelect(nzId: string) {
    setSelectedNozzleId(nzId);
    onNozzleChange(nzId);
  }

  if (!pumpId) return <div className="text-sm text-muted-foreground px-2 py-2">Select a pump first</div>;
  if (isLoading) return <div>Loading nozzles...</div>;
  if (error) return <div>Error loading nozzles</div>;
  if (!nozzles.length) return <div>No nozzles for this pump.</div>;

  return (
    <div className="space-y-4">
      <Select value={selectedNozzleId} onValueChange={handleNozzleSelect} required>
        <SelectTrigger>
          <SelectValue placeholder="Select Nozzle" />
        </SelectTrigger>
        <SelectContent>
          {nozzles.map((nozzle: any) => (
            <SelectItem key={nozzle.id} value={nozzle.id}>
              {nozzle.label} ({nozzle.fuel_type})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedNozzleId && (
        <div className="mt-2 text-sm">
          <b>Last Reading:</b>{" "}
          {lastReadingQ.isLoading
            ? "Loading..."
            : lastReadingQ.data
            ? `${lastReadingQ.data.cumulative_volume} @ ${new Date(lastReadingQ.data.recorded_at).toLocaleString()}`
            : "None"}
        </div>
      )}
      <Input
        type="number"
        min={0}
        step="any"
        value={value || ""}
        onChange={e => onChange(Number(e.target.value))}
        placeholder="Enter new reading"
        required
        disabled={!selectedNozzleId}
      />
      {selectedNozzleId && nozzle && (
        <div className="mt-1 text-xs text-gray-500">
          Current Fuel Price:{" "}
          {priceQ.isLoading
            ? "Loading..."
            : priceQ.data
            ? `₹${priceQ.data}`
            : "Not set"}
        </div>
      )}
    </div>
  );
}

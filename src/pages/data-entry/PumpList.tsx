
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStationPumps } from "@/hooks/useManualEntryData";

// PumpList props: stationId, selectedPumpId, onChange
export default function PumpList({
  stationId, value, onChange
}: { stationId?: string; value?: string; onChange: (id: string) => void; }) {
  const { data: pumps = [], isLoading, error } = useStationPumps(stationId);

  if (!stationId) return <div className="text-sm text-muted-foreground px-2 py-2">Select a station first</div>;
  if (isLoading) return <div>Loading pumps...</div>;
  if (error) return <div>Error loading pumps</div>;
  if (!pumps.length) return <div>No pumps for this station.</div>;

  return (
    <Select value={value} onValueChange={onChange} required>
      <SelectTrigger>
        <SelectValue placeholder="Select Pump" />
      </SelectTrigger>
      <SelectContent>
        {pumps.map((pump: any) => (
          <SelectItem key={pump.id} value={pump.id}>{pump.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

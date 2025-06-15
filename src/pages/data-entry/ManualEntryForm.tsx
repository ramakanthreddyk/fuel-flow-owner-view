
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAssignedStations, usePumps, useNozzles, useLastNozzleReading } from "@/hooks/useStationPumpNozzleDropdowns";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

type Station = { id: string; name: string };
type Pump = { id: string; label: string };
type Nozzle = { id: string; label: string; fuel_type: string; pump_id: string };

export default function ManualEntryForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Dropdowns
  const { data: stations = [], isLoading: stnLoading } = useAssignedStations(user?.id);
  const [selectedStationId, setSelectedStationId] = useState<string | undefined>(undefined);
  const { data: pumps = [] } = usePumps(selectedStationId);
  const [selectedPumpId, setSelectedPumpId] = useState<string | undefined>();
  const { data: nozzles = [] } = useNozzles(selectedPumpId);
  const [selectedNozzleId, setSelectedNozzleId] = useState<string | undefined>();
  const lastManualReading = useLastNozzleReading(selectedNozzleId);

  // Form fields
  const [cumVol, setCumVol] = useState("");
  const [readingDate, setReadingDate] = useState<Date>(new Date());
  const [submitting, setSubmitting] = useState(false);

  // Set defaults, reset pump/nozzle on station change
  useEffect(() => {
    if (!selectedStationId && stations.length) setSelectedStationId(stations[0].id);
  }, [stations, selectedStationId]);

  useEffect(() => {
    setSelectedPumpId(undefined);
    setSelectedNozzleId(undefined);
  }, [selectedStationId]);
  useEffect(() => {
    setSelectedNozzleId(undefined);
  }, [selectedPumpId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStationId || !selectedPumpId || !selectedNozzleId || !cumVol || !readingDate) {
      toast({ title: "Missing field", description: "Fill all required fields.", variant: "destructive" });
      return;
    }
    // Validate nozzle belongs to station:
    const selectedNozzle = nozzles.find(nz => nz.id === selectedNozzleId);
    if (!selectedNozzle) {
      toast({ title: "Error", description: "Nozzle not found.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const payload = {
      stationId: selectedStationId,
      nozzleId: selectedNozzleId,
      cumulativeVolume: Number(cumVol),
      recordedAt: readingDate.toISOString(),
      userId: user?.id,
      method: "manual",
    };
    try {
      const res = await fetch("/api/manual-readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Failed submission");
      toast({ title: "Success", description: "Manual reading submitted!" });
      setTimeout(() => navigate("/manual-readings-history"), 800);
    } catch (e: any) {
      toast({ title: "Submission failed", description: e?.message, variant: "destructive" });
    }
    setSubmitting(false);
  }

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
      {/* Left column */}
      <div className="space-y-4">
        <label className="block font-medium">Station <span className="text-red-500">*</span></label>
        <Select value={selectedStationId} onValueChange={v => setSelectedStationId(v)} required>
          <SelectTrigger>
            <SelectValue placeholder={stnLoading ? "Loading..." : "Select Station"} />
          </SelectTrigger>
          <SelectContent>
            {stations.map((station: Station) => (
              <SelectItem key={station.id} value={station.id}>{station.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="block font-medium">Pump <span className="text-red-500">*</span></label>
        <Select value={selectedPumpId} onValueChange={setSelectedPumpId} required disabled={!selectedStationId}>
          <SelectTrigger>
            <SelectValue placeholder={!selectedStationId ? "Select Station first" : (pumps.length ? "Select Pump" : "No Pumps")} />
          </SelectTrigger>
          <SelectContent>
            {pumps.map((pump: Pump) => (
              <SelectItem key={pump.id} value={pump.id}>{pump.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="block font-medium">Nozzle <span className="text-red-500">*</span></label>
        <Select value={selectedNozzleId} onValueChange={setSelectedNozzleId} required disabled={!selectedPumpId}>
          <SelectTrigger>
            <SelectValue placeholder={!selectedPumpId ? "Select Pump first" : (nozzles.length ? "Select Nozzle" : "No Nozzles")} />
          </SelectTrigger>
          <SelectContent>
            {nozzles.map((nozzle: Nozzle) => (
              <SelectItem key={nozzle.id} value={nozzle.id}>{nozzle.label} ({nozzle.fuel_type})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Right column */}
      <div className="space-y-4">
        <label className="block font-medium">Cumulative Reading <span className="text-red-500">*</span></label>
        <Input type="number" min={0} step="any" required value={cumVol} onChange={e => setCumVol(e.target.value)} />
        <label className="block font-medium">Date & Time <span className="text-red-500">*</span></label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              type="button"
              tabIndex={0}
            >
              {readingDate ? format(readingDate, "PPP p") : <span className="text-destructive">Pick a date & time</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={readingDate}
              onSelect={setReadingDate}
              initialFocus
              className="p-3 pointer-events-auto"
              showOutsideDays
            />
          </PopoverContent>
        </Popover>
        {lastManualReading.data && (
          <div className="text-sm bg-gray-50 rounded px-2 py-1">
            <b>Last Reading:</b> {lastManualReading.data.cumulative_volume} at {format(new Date(lastManualReading.data.recorded_at), "PPP p")}
          </div>
        )}
      </div>
      <div className="col-span-2 flex gap-4 justify-between mt-4">
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto px-8">{submitting ? "Submitting..." : "Submit"}</Button>
        <Button type="button" variant="outline" onClick={() => navigate("/manual-readings-history")}>Recent Entries</Button>
      </div>
    </form>
  );
}

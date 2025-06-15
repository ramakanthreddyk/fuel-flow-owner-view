
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Upload as UploadIcon, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAssignedStations, usePumps, useNozzles } from "@/hooks/useStationPumpNozzleDropdowns";
import { useUser } from "@/context/UserContext";

type Station = { id: string; name: string };
type Pump = { id: string; label: string };
type Nozzle = { id: string; label: string; fuel_type: string; pump_id: string };

export default function OcrEntryForm() {
  const { user } = useUser();
  const { toast } = useToast();

  const { data: stations = [], isLoading: stnLoading } = useAssignedStations(user?.id);
  const [selectedStationId, setSelectedStationId] = useState<string | undefined>(undefined);
  const { data: pumps = [] } = usePumps(selectedStationId);
  const [selectedPumpId, setSelectedPumpId] = useState<string | undefined>();
  const { data: nozzles = [] } = useNozzles(selectedPumpId);
  const [selectedNozzleId, setSelectedNozzleId] = useState<string | undefined>();

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

  // OCR form fields
  const [cumVol, setCumVol] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFileUrl(undefined);
    }
  }, [file]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStationId || !selectedPumpId || !selectedNozzleId || !cumVol || !date || !file) {
      toast({ title: "Missing field", description: "Please fill all fields.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    let uploadedUrl = fileUrl; // Just using preview for mock
    const payload = {
      stationId: selectedStationId,
      nozzleId: selectedNozzleId,
      cumulativeVolume: Number(cumVol),
      readingDatetime: date.toISOString(),
      imageUrl: uploadedUrl || "",
      method: "ocr",
      userId: user?.id,
    };
    try {
      // Simulate API call; you should implement real upload/insert logic
      toast({ title: "OCR Entry Saved", description: "Your OCR entry has been saved." });
      setFile(null);
      setFileUrl(undefined);
      setCumVol("");
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Unable to save", variant: "destructive" });
    }
    setSubmitting(false);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Station <span className="text-red-500">*</span></label>
          <Select value={selectedStationId} onValueChange={setSelectedStationId} disabled={stnLoading}>
            <SelectTrigger>
              <SelectValue placeholder={stnLoading ? "Loading..." : "Select Station"} />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station: Station) => (
                <SelectItem key={station.id} value={station.id}>{station.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Pump <span className="text-red-500">*</span></label>
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
        </div>
        <div>
          <label className="block mb-1 font-medium">Nozzle <span className="text-red-500">*</span></label>
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
        <div>
          <label className="block mb-1 font-medium">Reading Date/Time <span className="text-red-500">*</span></label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                type="button"
                tabIndex={0}
              >
                {date ? format(date, "PPP p") : <span className="text-destructive">Pick a date & time</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3 pointer-events-auto"
                showOutsideDays
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="block mb-1 font-medium">Cumulative Volume <span className="text-red-500">*</span></label>
          <Input type="number" min={0} value={cumVol} onChange={e => setCumVol(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Image Upload <span className="text-red-500">*</span></label>
          <label className="cursor-pointer flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition" tabIndex={0}>
            <UploadIcon className="text-blue-500" />
            <span>{file ? file.name : "Choose file"}</span>
            <Input type="file" className="hidden" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required />
          </label>
          {fileUrl && (<img src={fileUrl} alt="Preview" className="mt-2 rounded w-36 bg-gray-100 shadow" />)}
        </div>
      </div>
      <Button type="submit" disabled={submitting} className="w-full">Submit OCR Entry</Button>
    </form>
  );
}

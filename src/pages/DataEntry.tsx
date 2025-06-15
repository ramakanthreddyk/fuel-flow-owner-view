import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Upload as UploadIcon, 
  FileText, 
  FileEdit, 
  CreditCard, 
  Fuel
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import RequireRole from "@/components/RequireRole";
import { useUser } from "@/context/UserContext";

type Station = { id: string; name: string; };
type Nozzle = { id: string; label: string; pumpId: string; fuelType: string; };

const TENDER_TYPES = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "credit", label: "Credit" },
];

const FUEL_TYPES = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
];

function INRFormat(amount: string | number) {
  if (!amount && amount !== 0) return "";
  return Number(amount).toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 });
}

function generateMockApiResponse(payload: any) {
  // simulate a backend response containing id
  return {
    ...payload,
    id: Math.floor(Math.random() * 1000000).toString(),
    createdAt: new Date().toISOString(),
  };
}

export default function DataEntryPage() {
  const { toast } = useToast();
  const user = useUser();

  // For local preview of entries
  const [entries, setEntries] = useState<any[]>([]);
  const [ocrImgFile, setOcrImgFile] = useState<File | null>(null);
  const [ocrImgUrl, setOcrImgUrl] = useState<string | undefined>(undefined);

  // Station and nozzle fetching
  const { data: stations, isLoading: stnLoading } = useQuery({
    queryKey: ["stations"],
    queryFn: async () => {
      const r = await fetch("/api/stations");
      if (!r.ok) throw new Error("Could not fetch stations");
      return r.json();
    },
    select: (d) => Array.isArray(d) ? d : d.data || [],
  });

  // This will change when station changes
  const [selectedStationId, setSelectedStationId] = useState<string | undefined>(undefined);
  const { data: nozzles = [], refetch: refetchNozzles, isFetching: nozLoading } = useQuery({
    // Use empty string to ensure queryKey is always defined
    queryKey: ["nozzles", selectedStationId || ""], 
    queryFn: async () => {
      if (!selectedStationId) return [];
      const r = await fetch("/api/nozzles?station_id=" + selectedStationId);
      if (!r.ok) throw new Error("Could not fetch nozzles");
      return r.json();
    },
    select: (d) => Array.isArray(d) ? d : d.data || [],
    enabled: !!selectedStationId,
  });

  // Whenever stations loaded, set default station
  useEffect(() => {
    if (!selectedStationId && Array.isArray(stations) && stations.length > 0) {
      setSelectedStationId(stations[0].id);
    }
  }, [stations, selectedStationId]);

  // OCR Image preview
  useEffect(() => {
    if (ocrImgFile) {
      const url = URL.createObjectURL(ocrImgFile);
      setOcrImgUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setOcrImgUrl(undefined);
    }
  }, [ocrImgFile]);

  // Helper for date/datetime picker
  function DatePickerBtn({ value, onChange, mode = "date", required = false }: { value: Date | undefined, onChange: (d: Date | undefined) => void, mode?: "date"|"datetime", required?: boolean }) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            type="button"
            tabIndex={0}
          >
            {value ? format(value, mode === "date" ? "PPP" : "PPP p") : <span className={required ? "text-destructive" : "text-muted-foreground"}>Pick a {mode === "date" ? "date" : "date & time"}</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            className="p-3 pointer-events-auto"
            showOutsideDays
          />
        </PopoverContent>
      </Popover>
    )
  }

  // --- OCR ENTRY FORM ---
  function OcrForm() {
    const [nozzleId, setNozzleId] = useState<string | undefined>();
    const [date, setDate] = useState<Date>(new Date());
    const [cumVol, setCumVol] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [fileUrl, setFileUrl] = useState<string | undefined>();

    useEffect(() => {
      if (file) {
        const url = URL.createObjectURL(file);
        setFileUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setFileUrl(undefined);
      }
    }, [file]);

    function reset() {
      setNozzleId(undefined);
      setDate(new Date());
      setCumVol("");
      setFile(null);
      setFileUrl(undefined);
    }

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!selectedStationId || !nozzleId || !cumVol || !date || !file) {
        toast({ title: "Missing field", description: "Please fill all fields.", variant: "destructive" });
        return;
      }
      setSubmitting(true);
      let uploadedUrl = fileUrl; // For the mock, just use preview
      const payload = {
        stationId: selectedStationId,
        nozzleId,
        cumulativeVolume: Number(cumVol),
        readingDatetime: date.toISOString(),
        imageUrl: uploadedUrl || "",
        method: "ocr",
      };
      try {
        // Simulate API call: endpoint, payload, mock response
        const apiEndpoint = "/api/ocr-readings";
        const apiResponse = generateMockApiResponse(payload);
        setEntries((prev) => [
          { tab: "OCR Entry", ...payload, apiEndpoint, apiPayload: payload, apiResponse },
          ...prev
        ]);
        toast({ title: "OCR Entry Saved", description: "Your OCR entry has been saved." });
        reset();
      } catch (e:any) {
        toast({ title: "Error", description: e?.message || "Unable to save", variant: "destructive" });
      }
      setSubmitting(false);
    }

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Nozzle <span className="text-red-500">*</span></label>
            <Select value={nozzleId} onValueChange={setNozzleId} disabled={nozLoading || !selectedStationId} required>
              <SelectTrigger>
                <SelectValue placeholder={nozLoading ? "Loading..." : "Select Nozzle"} />
              </SelectTrigger>
              <SelectContent>
                {nozzles && nozzles.length ? (
                  nozzles.map((nozzle: Nozzle) => (
                    <SelectItem key={nozzle.id} value={nozzle.id}>{nozzle.label} ({nozzle.fuelType})</SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1 text-muted-foreground text-sm">No nozzles</div>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Reading Date/Time <span className="text-red-500">*</span></label>
            <DatePickerBtn mode="datetime" value={date} onChange={setDate} required />
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
    )
  }

  // --- MANUAL ENTRY FORM ---
  function ManualForm() {
    const [nozzleId, setNozzleId] = useState<string | undefined>();
    const [date, setDate] = useState<Date>(new Date());
    const [cumVol, setCumVol] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function reset() {
      setNozzleId(undefined);
      setDate(new Date());
      setCumVol("");
    }

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!selectedStationId || !nozzleId || !cumVol || !date) {
        toast({ title: "Missing field", description: "Please fill all fields.", variant: "destructive" });
        return;
      }
      setSubmitting(true);
      const payload = {
        stationId: selectedStationId,
        nozzleId,
        cumulativeVolume: Number(cumVol),
        readingDatetime: date.toISOString(),
        method: "manual"
      };
      try {
        const apiEndpoint = "/api/manual-readings";
        const apiResponse = generateMockApiResponse(payload);
        setEntries((prev) => [
          { tab: "Manual Entry", ...payload, apiEndpoint, apiPayload: payload, apiResponse },
          ...prev
        ]);
        toast({ title: "Manual Entry Saved", description: "Your manual entry has been saved." });
        reset();
      } catch (e:any) {
        toast({ title: "Error", description: e?.message || "Unable to save", variant: "destructive" });
      }
      setSubmitting(false);
    }

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Nozzle <span className="text-red-500">*</span></label>
            <Select value={nozzleId} onValueChange={setNozzleId} disabled={nozLoading || !selectedStationId} required>
              <SelectTrigger>
                <SelectValue placeholder={nozLoading ? "Loading..." : "Select Nozzle"} />
              </SelectTrigger>
              <SelectContent>
                {nozzles && nozzles.length ? (
                  nozzles.map((nozzle: Nozzle) => (
                    <SelectItem key={nozzle.id} value={nozzle.id}>{nozzle.label} ({nozzle.fuelType})</SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1 text-muted-foreground text-sm">No nozzles</div>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Reading Date/Time <span className="text-red-500">*</span></label>
            <DatePickerBtn mode="datetime" value={date} onChange={setDate} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Cumulative Volume <span className="text-red-500">*</span></label>
            <Input type="number" min={0} value={cumVol} onChange={e => setCumVol(e.target.value)} required />
          </div>
        </div>
        <Button type="submit" disabled={submitting} className="w-full">Submit Manual Entry</Button>
      </form>
    );
  }

  // --- TENDER ENTRY FORM ---
  function TenderForm() {
    const [stationId, setStationId] = useState<string | undefined>(selectedStationId);
    const [date, setDate] = useState<Date>(new Date());
    const [tenderType, setTenderType] = useState<string>();
    const [amount, setAmount] = useState("");
    const [remarks, setRemarks] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // If only one station, disable select
    const singleStation = Array.isArray(stations) && stations.length === 1;

    function reset() {
      setStationId(selectedStationId);
      setDate(new Date());
      setTenderType(undefined);
      setAmount("");
      setRemarks("");
    }

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!stationId || !tenderType || !amount || !date) {
        toast({ title: "Missing field", description: "Please fill all required fields.", variant: "destructive" });
        return;
      }
      setSubmitting(true);
      const payload = {
        stationId,
        entryDate: date.toISOString().split("T")[0],
        tenderType,
        amount: Number(amount),
        remarks,
      };
      try {
        const apiEndpoint = "/api/tenders";
        const apiResponse = generateMockApiResponse(payload);
        setEntries((prev) => [
          { tab: "Tender Entry", ...payload, apiEndpoint, apiPayload: payload, apiResponse },
          ...prev
        ]);
        toast({ title: "Tender Entry Saved", description: "Your tender entry has been saved." });
        reset();
      } catch (e:any) {
        toast({ title: "Error", description: e?.message || "Unable to save", variant: "destructive" });
      }
      setSubmitting(false);
    }

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Station <span className="text-red-500">*</span></label>
            <Select
              value={stationId}
              onValueChange={setStationId}
              required
              disabled={singleStation}
            >
              <SelectTrigger>
                <SelectValue placeholder={stnLoading ? "Loading..." : "Select Station"} />
              </SelectTrigger>
              <SelectContent>
                {stations && stations.length ? (
                  stations.map((st: Station) => (
                    <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1 text-muted-foreground text-sm">No stations</div>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Entry Date <span className="text-red-500">*</span></label>
            <DatePickerBtn mode="date" value={date} onChange={setDate} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Tender Type <span className="text-red-500">*</span></label>
            <Select value={tenderType} onValueChange={setTenderType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {TENDER_TYPES.map(tp => (
                  <SelectItem key={tp.value} value={tp.value}>{tp.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Amount <span className="text-red-500">*</span></label>
            <Input
              type="number"
              min={0}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              step="0.01"
              placeholder="Enter amount"
            />
            <div className="text-xs text-gray-400">{amount && INRFormat(amount)}</div>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Remarks <span className="text-gray-400 text-xs">(optional)</span></label>
            <Input value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Remarks" />
          </div>
        </div>
        <Button type="submit" disabled={submitting} className="w-full">Submit Tender Entry</Button>
      </form>
    );
  }

  // --- TANK REFILL FORM ---
  function RefillForm() {
    const [stationId, setStationId] = useState<string | undefined>(selectedStationId);
    const [fuelType, setFuelType] = useState<string | undefined>();
    const [litres, setLitres] = useState("");
    const [time, setTime] = useState<Date>(new Date());
    const [submitting, setSubmitting] = useState(false);

    function reset() {
      setStationId(selectedStationId);
      setFuelType(undefined);
      setLitres("");
      setTime(new Date());
    }

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!stationId || !fuelType || !litres || !time) {
        toast({ title: "Missing field", description: "Please fill all required fields.", variant: "destructive" });
        return;
      }
      setSubmitting(true);
      const payload = {
        stationId,
        fuelType,
        refillLitres: Number(litres),
        refillTime: time.toISOString(),
        filledBy: user.name,
      };
      try {
        const apiEndpoint = "/api/refills";
        const apiResponse = generateMockApiResponse(payload);
        setEntries((prev) => [
          { tab: "Tank Refill", ...payload, apiEndpoint, apiPayload: payload, apiResponse },
          ...prev
        ]);
        toast({ title: "Refill Entry Saved", description: "Your tank refill entry has been saved." });
        reset();
      } catch (e:any) {
        toast({ title: "Error", description: e?.message || "Unable to save", variant: "destructive" });
      }
      setSubmitting(false);
    }

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Station <span className="text-red-500">*</span></label>
            <Select
              value={stationId}
              onValueChange={setStationId}
              required
              disabled={stnLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={stnLoading ? "Loading..." : "Select Station"} />
              </SelectTrigger>
              <SelectContent>
                {stations && stations.length ? (
                  stations.map((st: Station) => (
                    <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1 text-muted-foreground text-sm">No stations</div>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Fuel Type <span className="text-red-500">*</span></label>
            <Select value={fuelType} onValueChange={setFuelType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {FUEL_TYPES.map(tp => (
                  <SelectItem key={tp.value} value={tp.value}>{tp.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Refill Litres <span className="text-red-500">*</span></label>
            <Input type="number" min={0} value={litres} onChange={e => setLitres(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Refill Time <span className="text-red-500">*</span></label>
            <DatePickerBtn mode="datetime" value={time} onChange={setTime} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Filled By</label>
            <Input type="text" value={user.name} readOnly disabled />
          </div>
        </div>
        <Button type="submit" disabled={submitting} className="w-full">Submit Refill Entry</Button>
      </form>
    );
  }

  return (
    <RequireRole roles={["superadmin", "owner", "employee"]}>
      <div>
        <h1 className="text-3xl font-bold mb-4">Data Entry</h1>
        <Card>
          <CardHeader>
            <CardTitle>Operational Data Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ocr" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
                <TabsTrigger value="ocr">
                  <FileText className="inline-block mr-2 text-blue-600" size={20} /> 
                  OCR Entry
                </TabsTrigger>
                <TabsTrigger value="manual">
                  <FileEdit className="inline-block mr-2 text-pink-500" size={20} />
                  Manual Entry
                </TabsTrigger>
                <TabsTrigger value="tender">
                  <CreditCard className="inline-block mr-2 text-green-600" size={20} />
                  Tender Entry
                </TabsTrigger>
                <TabsTrigger value="refill">
                  <Fuel className="inline-block mr-2 text-yellow-500" size={20} />
                  Tank Refill
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ocr"><OcrForm /></TabsContent>
              <TabsContent value="manual"><ManualForm /></TabsContent>
              <TabsContent value="tender"><TenderForm /></TabsContent>
              <TabsContent value="refill"><RefillForm /></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        {/* Preview Data */}
        {entries.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Submitted Entries (Preview)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto max-h-96">
                  <table className="table-auto w-full text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left">Tab</th>
                        <th className="p-2 text-left">Station</th>
                        <th className="p-2 text-left">Nozzle</th>
                        <th className="p-2 text-left">Fuel</th>
                        <th className="p-2 text-left">Datetime / Date</th>
                        <th className="p-2 text-left">Cumulative Vol / Amount / Litres</th>
                        <th className="p-2 text-left">Image</th>
                        <th className="p-2 text-left">Tender Type</th>
                        <th className="p-2 text-left">Filled By</th>
                        <th className="p-2 text-left">Remarks</th>
                        <th className="p-2 text-left">API Endpoint</th>
                        <th className="p-2 text-left">API Payload</th>
                        <th className="p-2 text-left">API Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry, idx) => (
                        <tr key={idx} className="even:bg-gray-50">
                          <td className="p-2">{entry.tab}</td>
                          <td className="p-2">{entry.stationId || ""}</td>
                          <td className="p-2">{entry.nozzleId || ""}</td>
                          <td className="p-2">{entry.fuelType || ""}</td>
                          <td className="p-2">{entry.readingDatetime ? format(new Date(entry.readingDatetime), "PPP p") : entry.entryDate || entry.refillTime ? format(new Date(entry.entryDate || entry.refillTime), "PPP p") : ""}</td>
                          <td className="p-2">
                            {typeof entry.cumulativeVolume !== "undefined"
                              ? entry.cumulativeVolume
                              : typeof entry.amount !== "undefined"
                                ? INRFormat(entry.amount)
                                : typeof entry.refillLitres !== "undefined"
                                  ? entry.refillLitres
                                  : ""}
                          </td>
                          <td className="p-2">
                            {entry.imageUrl && (<img src={entry.imageUrl} className="h-10 rounded" alt="img preview" />)}
                          </td>
                          <td className="p-2">{entry.tenderType || ""}</td>
                          <td className="p-2">{entry.filledBy || ""}</td>
                          <td className="p-2">{entry.remarks || ""}</td>
                          <td className="p-2">
                            <div className="break-all text-xs">{entry.apiEndpoint || ""}</div>
                          </td>
                          <td className="p-2">
                            <pre className="max-w-xs whitespace-pre-wrap break-all text-xs bg-gray-50 p-1 rounded">{entry.apiPayload ? JSON.stringify(entry.apiPayload, null, 2) : ""}</pre>
                          </td>
                          <td className="p-2">
                            <pre className="max-w-xs whitespace-pre-wrap break-all text-xs bg-gray-50 p-1 rounded">{entry.apiResponse ? JSON.stringify(entry.apiResponse, null, 2) : ""}</pre>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </RequireRole>
  );
}

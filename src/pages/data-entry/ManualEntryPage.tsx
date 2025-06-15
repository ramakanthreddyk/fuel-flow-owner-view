
import { useState } from "react";
import StationSelector from "./StationSelector";
import PumpList from "./PumpList";
import NozzleInput from "./NozzleInput";
import SalePreview from "./SalePreview";
import { useUser } from "@/context/UserContext";
import { useLastNozzleReading, useLatestPrice, submitManualReadingAndSale } from "@/hooks/useManualEntryData";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// The main orchestrating page for manual reading entries
export default function ManualEntryPage() {
  const { user } = useUser();
  const { toast } = useToast();

  // Form state
  const [stationId, setStationId] = useState<string>();
  const [pumpId, setPumpId] = useState<string>();
  const [nozzleId, setNozzleId] = useState<string>();
  const [reading, setReading] = useState<number>(0);

  // These can be loaded in the subcomponents, but also brought here for SalePreview
  const lastQ = useLastNozzleReading(nozzleId);
  const nozzleFuelType = nozzleId ? undefined : undefined; // could fetch fuel_type if needed
  const priceQ = useLatestPrice(stationId, undefined); // see above
  const [submitting, setSubmitting] = useState(false);

  // Extract previous value
  const previousReading = lastQ.data?.cumulative_volume ?? 0;
  const fuelPrice = priceQ.data ?? 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stationId || !pumpId || !nozzleId || !user?.id || !reading) {
      toast({ title: "Missing field", description: "Fill all required fields.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await submitManualReadingAndSale({
        stationId, pumpId, nozzleId, userId: user.id, value: reading,
        recordedAt: new Date(),
        previousReading,
        fuelPrice,
      });
      toast({ title: "Submitted!", description: "Manual reading and sale (if any) saved." });
      setReading(0);
    } catch (e: any) {
      toast({ title: "Submission failed", description: e?.message, variant: "destructive" });
    }
    setSubmitting(false);
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <label className="block font-medium">Station</label>
      <StationSelector value={stationId} onChange={(id) => { setStationId(id); setPumpId(undefined); setNozzleId(undefined); }} />
      <label className="block font-medium">Pump</label>
      <PumpList stationId={stationId} value={pumpId} onChange={(id) => { setPumpId(id); setNozzleId(undefined); }} />
      <label className="block font-medium">Nozzle & Reading</label>
      <NozzleInput
        pumpId={pumpId}
        stationId={stationId}
        value={reading}
        onChange={setReading}
        onNozzleChange={setNozzleId}
      />
      {/* Preview sale if valid */}
      <SalePreview previousReading={previousReading} currentReading={reading} fuelPrice={fuelPrice} />
      <Button disabled={submitting} type="submit" className="w-full">
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}

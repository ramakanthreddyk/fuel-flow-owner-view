
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch stations for current owner (created_by = user.id)
export function useOwnerStations(userId?: string) {
  return useQuery({
    queryKey: ["owner-stations", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("stations")
        .select("id, name, address")
        .eq("created_by", userId);
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!userId,
  });
}

// Fetch pumps for a station
export function useStationPumps(stationId?: string) {
  return useQuery({
    queryKey: ["station-pumps", stationId],
    queryFn: async () => {
      if (!stationId) return [];
      const { data, error } = await supabase
        .from("pumps")
        .select("id, label")
        .eq("station_id", stationId);
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!stationId,
  });
}

// Fetch nozzles for a pump
export function usePumpNozzles(pumpId?: string) {
  return useQuery({
    queryKey: ["pump-nozzles", pumpId],
    queryFn: async () => {
      if (!pumpId) return [];
      const { data, error } = await supabase
        .from("nozzles")
        .select("id, label, fuel_type")
        .eq("pump_id", pumpId);
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!pumpId,
  });
}

// Fetch last reading for a nozzle
export function useLastNozzleReading(nozzleId?: string) {
  return useQuery({
    queryKey: ["last-nozzle-reading", nozzleId],
    queryFn: async () => {
      if (!nozzleId) return null;
      const { data, error } = await supabase
        .from("manual_readings")
        .select("cumulative_volume, recorded_at")
        .eq("nozzle_id", nozzleId)
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!nozzleId,
  });
}

// Fetch latest price for station + fuel_type
export function useLatestPrice(stationId?: string, fuelType?: string) {
  return useQuery({
    queryKey: ["fuel-price", stationId, fuelType],
    queryFn: async () => {
      if (!stationId || !fuelType) return null;
      const { data, error } = await supabase
        .from("fuel_prices")
        .select("price")
        .eq("station_id", stationId)
        .eq("fuel_type", fuelType)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data?.price ?? null;
    },
    enabled: !!stationId && !!fuelType,
  });
}

export async function submitManualReadingAndSale({
  stationId,
  pumpId,
  nozzleId,
  userId,
  value,
  recordedAt,
  previousReading,
  fuelPrice,
}: {
  stationId: string;
  pumpId: string;
  nozzleId: string;
  userId: string;
  value: number;
  recordedAt: Date;
  previousReading: number;
  fuelPrice: number;
}) {
  // Insert manual_reading
  const { data: reading, error: readingError } = await supabase
    .from("manual_readings")
    .insert([
      {
        station_id: stationId,
        nozzle_id: nozzleId,
        cumulative_volume: value,
        recorded_at: recordedAt.toISOString(),
      },
    ])
    .select("id")
    .maybeSingle();
  if (readingError) throw new Error(readingError.message);

  // Insert sale if delta > 0 and price known
  const saleVolume = value - previousReading;
  let saleResult = undefined;
  if (saleVolume > 0 && fuelPrice > 0) {
    const amount = saleVolume * fuelPrice;
    const { data: sale, error: saleError } = await supabase.from("sales").insert([
      {
        station_id: stationId,
        nozzle_id: nozzleId,
        user_id: userId,
        recorded_at: recordedAt.toISOString(),
        cumulative_reading: value,
        previous_reading: previousReading,
        sale_volume: saleVolume,
        fuel_price: fuelPrice,
        amount,
        status: "draft",
        price_per_litre: fuelPrice,
        reading_id: reading?.id,
      },
    ]);
    if (saleError) throw new Error(saleError.message);
    saleResult = sale;
  }
  return { reading, sale: saleResult };
}


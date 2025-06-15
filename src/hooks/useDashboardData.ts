
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";

// Types for returned data
export interface TankSummary {
  fuelType: string;
  nozzleId: string;
  latestReading?: number;
  latestAt?: string;
}

export interface NozzleData {
  id: string;
  label: string;
  fuel_type: string;
  pump_id: string;
  latestReading?: number;
  latestAt?: string;
}

export interface PumpData {
  id: string;
  label: string;
  nozzles: NozzleData[];
}

export interface StationData {
  id: string;
  name: string;
  address?: string;
  city?: string;
  pumps: PumpData[];
}

export interface DashboardData {
  stations: StationData[];
  loading: boolean;
  error: string | null;
}

export function useDashboardData(): DashboardData {
  const { user } = useUser();
  const [stations, setStations] = useState<StationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setStations([]);
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Get all stations owned by this user
        let { data: stationsRaw, error: stationsError } = await supabase
          .from("stations")
          .select("id,name,address,city")
          .eq("created_by", user.id);

        if (stationsError) throw new Error(stationsError.message);

        // For each station, join pumps & nozzles
        const fullStations: StationData[] = [];

        for (const st of stationsRaw ?? []) {
          // Fetch pumps
          let { data: pumpsRaw, error: pumpsErr } = await supabase
            .from("pumps")
            .select("id,label")
            .eq("station_id", st.id);

          if (pumpsErr) throw new Error(pumpsErr.message);

          const pumps: PumpData[] = [];

          for (const pump of pumpsRaw ?? []) {
            // Fetch nozzles (including fuel type)
            let { data: nozzlesRaw, error: nozErr } = await supabase
              .from("nozzles")
              .select("id,label,fuel_type")
              .eq("pump_id", pump.id);

            if (nozErr) throw new Error(nozErr.message);

            // For each nozzle, get latest manual_reading
            const nozzles: NozzleData[] = [];
            for (const nozzle of nozzlesRaw ?? []) {
              let { data: reading, error: rdErr } = await supabase
                .from("manual_readings")
                .select("cumulative_volume,recorded_at")
                .eq("nozzle_id", nozzle.id)
                .order("recorded_at", { ascending: false })
                .limit(1)
                .maybeSingle();

              if (rdErr) throw new Error(rdErr.message);

              nozzles.push({
                ...nozzle,
                latestReading: reading?.cumulative_volume ?? undefined,
                latestAt: reading?.recorded_at ?? undefined,
                pump_id: pump.id,
              });
            }

            pumps.push({
              id: pump.id,
              label: pump.label,
              nozzles,
            });
          }

          fullStations.push({
            id: st.id,
            name: st.name,
            address: st.address,
            city: st.city,
            pumps,
          });
        }

        setStations(fullStations);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      }
      setLoading(false);
    }

    fetchData();
  }, [user?.id]);

  return { stations, loading, error };
}

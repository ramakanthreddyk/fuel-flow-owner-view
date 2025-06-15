
import { useQuery } from "@tanstack/react-query";

// Fetch stations assigned to a user
export function useAssignedStations(userId?: string) {
  return useQuery({
    queryKey: ["assigned-stations", userId],
    queryFn: async () => {
      if (!userId) return [];
      const r = await fetch(`/api/stations/assigned?user_id=${userId}`);
      if (!r.ok) throw new Error("Could not fetch assigned stations");
      return r.json();
    },
    enabled: !!userId
  });
}

// Fetch pumps for station
export function usePumps(stationId?: string) {
  return useQuery({
    queryKey: ["pumps", stationId],
    queryFn: async () => {
      if (!stationId) return [];
      const r = await fetch(`/api/pumps?station_id=${stationId}`);
      if (!r.ok) throw new Error("Could not fetch pumps");
      return r.json();
    },
    enabled: !!stationId
  });
}

// Fetch nozzles for pump
export function useNozzles(pumpId?: string) {
  return useQuery({
    queryKey: ["nozzles", pumpId],
    queryFn: async () => {
      if (!pumpId) return [];
      const r = await fetch(`/api/nozzles?pump_id=${pumpId}`);
      if (!r.ok) throw new Error("Could not fetch nozzles");
      return r.json();
    },
    enabled: !!pumpId
  });
}

// Last reading for nozzle
export function useLastNozzleReading(nozzleId?: string) {
  return useQuery({
    queryKey: ["last-nozzle-reading", nozzleId],
    queryFn: async () => {
      if (!nozzleId) return null;
      const r = await fetch(`/api/manual-readings?nozzle_id=${nozzleId}&latest=1`);
      if (!r.ok) return null;
      const arr = await r.json();
      return arr?.[0] ?? null;
    },
    enabled: !!nozzleId,
  });
}

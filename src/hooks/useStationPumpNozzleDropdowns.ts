
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";

// Determine user's role and fetch assigned/owned stations
export function useAssignedStations(user) {
  const { role, id } = user || {};
  return useQuery({
    queryKey: ["assigned-stations", id, role],
    queryFn: async () => {
      if (!id) return [];
      // Owner: stations.created_by = $CURRENT_USER_ID
      if (role === "owner") {
        const r = await fetch(`/api/stations?created_by=${id}`);
        if (!r.ok) throw new Error("Could not fetch owned stations");
        return r.json();
      }
      // Employee: stations assigned via employee_station_assignments
      const r = await fetch(`/api/stations/assigned?user_id=${id}`);
      if (!r.ok) throw new Error("Could not fetch assigned stations");
      return r.json();
    },
    enabled: !!id && !!role
  });
}

// Fetch pumps for a station (stationId)
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

// Fetch nozzles for a pump/group of pumps (pumpId or stationId)
export function useNozzles({ stationId, pumpId }: { stationId?: string; pumpId?: string }) {
  return useQuery({
    queryKey: ["nozzles", stationId, pumpId],
    queryFn: async () => {
      if (pumpId) {
        const r = await fetch(`/api/nozzles?pump_id=${pumpId}`);
        if (!r.ok) throw new Error("Could not fetch nozzles");
        return r.json();
      }
      if (stationId) {
        const r = await fetch(`/api/nozzles?station_id=${stationId}`);
        if (!r.ok) throw new Error("Could not fetch nozzles");
        return r.json();
      }
      return [];
    },
    enabled: !!stationId || !!pumpId
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


import express from "express";
import { users, stations, pumps, nozzles, assignments } from "../data/memoryStore";

const router = express.Router();

router.get("/:userId", (req, res) => {
  const user = users.get(req.params.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  // Get station for owner (if any)
  let userStation = Array.from(stations.values()).find(
    (st) => st.ownerId === user.id
  );
  let out: any = { user, assignments: assignments.filter(a => a.employeeId === user.id) };

  if (userStation) {
    // Build nested pumps->nozzles for the station
    const stationPumps = Array.from(pumps.values()).filter(
      (p) => p.stationId === userStation.id
    );
    out.station = {
      ...userStation,
      pumps: stationPumps.map((pump) => ({
        ...pump,
        nozzles: Array.from(nozzles.values()).filter((n) => n.pumpId === pump.id),
      })),
    };
  }

  res.json(out);
});

export default router;

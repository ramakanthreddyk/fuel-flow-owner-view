
import { Router } from "express";

const router = Router();

// In-memory mock DB
let manualReadings: any[] = [];

// POST /api/manual-readings
router.post("/", (req, res) => {
  const { nozzleId, cumulativeVolume, recordedAt, stationId } = req.body;
  if (!nozzleId || !cumulativeVolume || !stationId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const entry = {
    id: Date.now().toString(),
    method: "manual",
    nozzleId,
    cumulativeVolume,
    recordedAt: recordedAt || new Date().toISOString(),
    stationId,
  };

  manualReadings.push(entry);
  res.status(201).json(entry);
});

// GET /api/manual-readings
router.get("/", (_req, res) => {
  res.json(manualReadings);
});

export default router;


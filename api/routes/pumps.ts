import express from "express";
import { v4 as uuidv4 } from "uuid";
import { PumpInput, Pump } from "../data/types";
import { pumps, stations } from "../data/memoryStore";

const router = express.Router();

router.post("/", (req, res) => {
  console.log("[POST /api/pumps] received:", req.body);
  const result = PumpInput.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { stationId, label } = result.data;
  if (!stations.has(stationId)) {
    return res.status(404).json({ error: "Station not found" });
  }
  const id = uuidv4();
  const pump: Pump = { id, stationId, label };
  pumps.set(id, pump);
  res.status(201).json({ id, label, stationId });
});

export default router;

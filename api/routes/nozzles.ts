import express from "express";
import { v4 as uuidv4 } from "uuid";
import { NozzleInput, Nozzle } from "../data/types";
import { nozzles, pumps } from "../data/memoryStore";

const router = express.Router();

router.post("/", (req, res) => {
  console.log("[POST /api/nozzles] received:", req.body);
  const result = NozzleInput.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { pumpId, label, fuelType, initialReading } = result.data;
  if (!pumps.has(pumpId)) {
    return res.status(404).json({ error: "Pump not found" });
  }
  const id = uuidv4();
  const nozzle: Nozzle = { id, pumpId, label, fuelType, initialReading };
  nozzles.set(id, nozzle);
  res.status(201).json({ id, label, pumpId });
});

export default router;

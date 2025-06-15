
import express from "express";
const router = express.Router();

let refills: any[] = [];

// GET (already present, for completeness)
router.get("/", (_req, res) => {
  res.json(refills);
});

// POST /api/refills
router.post("/", (req, res) => {
  console.log("[POST /api/refills] received:", req.body);
  const { stationId, fuelType, refillLitres, refillTime, filledBy } = req.body;
  if (!stationId || !fuelType || refillLitres === undefined || !refillTime || !filledBy) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const entry = {
    id: Date.now().toString(),
    stationId,
    fuelType,
    refillLitres,
    refillTime,
    filledBy
  };
  refills.push(entry);
  res.status(201).json(entry);
});

export default router;


import express from "express";
const router = express.Router();

let tenderEntries: any[] = [];

// GET (already present, for completeness)
router.get("/", (_req, res) => {
  res.json(tenderEntries);
});

// POST /api/tenders
router.post("/", (req, res) => {
  console.log("[POST /api/tenders] received:", req.body);
  const { stationId, entryDate, tenderType, amount, remarks } = req.body;
  if (!stationId || !entryDate || !tenderType || amount === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const entry = {
    id: Date.now().toString(),
    stationId,
    entryDate,
    tenderType,
    amount,
    remarks: remarks || ""
  };
  tenderEntries.push(entry);
  res.status(201).json(entry);
});

export default router;

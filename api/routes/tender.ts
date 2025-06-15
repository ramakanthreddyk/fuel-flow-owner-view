
import express from "express";
const router = express.Router();

let tenders: any[] = [];

router.post("/", (req, res) => {
  console.log("[POST /api/tender] received:", req.body);
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
  tenders.push(entry);
  res.status(201).json(entry);
});

export default router;

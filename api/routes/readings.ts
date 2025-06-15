
import express from "express";
const router = express.Router();

let readings: any[] = [];

router.post("/", (req, res) => {
  console.log("[POST /api/readings] received:", req.body);
  const { stationId, nozzleId, cumulativeVolume, readingDatetime, method } = req.body;
  if (!stationId || !nozzleId || !readingDatetime || !method) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const entry = {
    id: Date.now().toString(),
    nozzleId,
    stationId,
    cumulativeVolume: cumulativeVolume || null,
    recordedAt: readingDatetime,
    method,
    ...(method === "ocr" ? { imageUrl: "https://dummyimage.com/320x120/eee/000.jpg&text=OCR+upload" } : {})
  };
  readings.push(entry);
  res.status(201).json(entry);
});

export default router;

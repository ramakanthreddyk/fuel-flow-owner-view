
import express from "express";
const router = express.Router();

let ocrReadings: any[] = [];

// POST /api/ocr-readings
// (simulate file upload: returns contract shape with dummy imageUrl)
router.post("/", (req, res) => {
  // For mock: parse fields from form-data or JSON
  // In prod, use multer/etc. Here, just expect JSON body.
  console.log("[POST /api/ocr-readings] received:", req.body);
  const { stationId, nozzleId, cumulativeVolume, readingDatetime, method } = req.body;
  if (!stationId || !nozzleId || !readingDatetime || method !== "ocr") {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const entry = {
    id: Date.now().toString(),
    nozzleId,
    cumulativeVolume: cumulativeVolume || null,
    recordedAt: readingDatetime,
    method: "ocr",
    imageUrl: "https://dummyimage.com/320x120/eee/000.jpg&text=OCR+upload"
  };
  ocrReadings.push(entry);
  res.status(201).json(entry);
});

// GET endpoint (dummy)
router.get("/", (_req, res) => {
  res.json(ocrReadings);
});

export default router;

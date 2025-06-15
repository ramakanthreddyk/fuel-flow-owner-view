
import express from "express";
const router = express.Router();

// Dummy sales summary
router.get("/summary", (_req, res) => {
  res.json({
    totalAmount: 62000,
    totalLitres: 2031,
    breakdown: [
      { fuelType: "petrol", amount: 42000, litres: 1120 },
      { fuelType: "diesel", amount: 20000, litres: 911 }
    ]
  });
});

// Dummy paginated sales list
router.get("/", (_req, res) => {
  // params: from, to, fuelType, etc. For now, ignore.
  const results = [
    { id: "sale1", sale_datetime: new Date().toISOString(), stationId: "a1b2c3", fuelType: "petrol", litres: 7.2, amount: 750, nozzleId: "noz1", source: "manual" },
    { id: "sale2", sale_datetime: new Date().toISOString(), stationId: "a1b2c3", fuelType: "diesel", litres: 8.1, amount: 830, nozzleId: "noz2", source: "ocr" }
  ];
  res.json({ results, total: 2 });
});

export default router;

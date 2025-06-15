
import express from "express";
const router = express.Router();

// Mock: return all pumps and their nozzles
router.get("/", (_req, res) => {
  res.json([
    {
      id: "pump_1",
      label: "Pump 1",
      stationId: "a1b2c3",
      nozzles: [
        { id: "noz1", label: "Nozzle 1", fuelType: "petrol", initialReading: 100 },
        { id: "noz2", label: "Nozzle 2", fuelType: "diesel", initialReading: 200 }
      ]
    }
  ]);
});

export default router;

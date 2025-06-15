
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  // Return dashboard data (dummy)
  res.json({
    id: "user123",
    role: "owner",
    totalSalesToday: 58300,
    litresDispensedToday: 823,
    entriesToday: 11,
    tankRefillToday: 390,
    stationSummary: {
      id: "station_abc123",
      name: "FuelX Station A",
      pumps: [
        {
          id: "pump_1",
          label: "Pump 1",
          nozzles: [
            { id: "nozzle_1", fuelType: "petrol", litresToday: 440 },
            { id: "nozzle_2", fuelType: "diesel", litresToday: 383 },
          ],
        },
      ],
    },
    premiumFeaturesUnlocked: false
  });
});

export default router;

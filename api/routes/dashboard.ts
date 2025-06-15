
import express from "express";

// Example: To expand with role/type-specific dashboards, add logic to alter this payload per user.
const router = express.Router();

router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  // Demo: switch based on test user ids for variety (expand as needed)
  let role: string = "owner";
  if (userId === "superadmin_id") role = "superadmin";
  if (userId === "employee_id") role = "employee";

  // Mock dashboard data (expand as needed)
  const dashboardData = {
    userId,
    role,
    totalSalesToday: role === "superadmin" ? 212340 : 82340,
    litresDispensedToday: 3120,
    entriesToday: 14,
    tankRefillToday: role === "employee" ? 0 : 1200,
    stationSummary: {
      id: "station_abc123",
      name: role === "employee" ? "FuelX - Worker" : "FuelX Station A",
      pumps: [
        {
          id: "pump_1",
          label: "Pump 1",
          nozzles: [
            { id: "nozzle_1", fuelType: "petrol", litresToday: 1400 },
            { id: "nozzle_2", fuelType: "diesel", litresToday: 1720 },
          ],
        },
      ],
    },
    premiumFeaturesUnlocked: role !== "employee" && userId !== "1",
    // You can add more realness here, e.g. recent activity array, charts data, etc.
  };

  res.json(dashboardData);
});

export default router;

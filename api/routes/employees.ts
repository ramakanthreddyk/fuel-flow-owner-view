
import express from "express";
import { AssignmentInput, AssignmentOutput, UserRole } from "../data/types";
import { users, stations, assignments } from "../data/memoryStore";

const router = express.Router();

router.post("/assign", (req, res) => {
  const result = AssignmentInput.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { employeeId, stationId } = result.data;

  const user = users.get(employeeId);
  if (!user) return res.status(404).json({ error: "Employee not found" });
  if (user.role !== UserRole.enum.employee)
    return res.status(400).json({ error: "User is not an employee" });
  if (!stations.has(stationId))
    return res.status(404).json({ error: "Station not found" });

  assignments.push({ employeeId, stationId });
  res.status(200).json({ success: true });
});

export default router;

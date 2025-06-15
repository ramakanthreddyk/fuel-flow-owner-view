
import express from "express";
const router = express.Router();

/**
 * @openapi
 * /manual-readings:
 *   post:
 *     summary: Create a manual pump reading entry
 *     tags: [Readings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ManualReadingInput"
 *     responses:
 *       "201":
 *         description: Entry created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Reading"
 *       "400":
 *         description: Bad request
 */

// (This is a placeholder; add schema/data store as needed)
router.post("/", async (req, res) => {
  const { nozzleId, cumulativeVolume, recordedAt, method } = req.body;
  // Basic validation
  if (!nozzleId || typeof cumulativeVolume !== "number" || !recordedAt || method !== "manual") {
    return res.status(400).json({ error: "Invalid input for manual reading." });
  }
  // Simulate insertion and ID creation
  const reading = {
    id: Math.floor(Math.random() * 1e9).toString(),
    nozzleId,
    cumulativeVolume,
    recordedAt,
    method,
    createdAt: new Date().toISOString(),
  };
  res.status(201).json(reading);
});

export default router;

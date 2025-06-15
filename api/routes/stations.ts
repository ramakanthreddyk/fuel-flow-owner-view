
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { StationInput, Station } from "../data/types";
import { stations, users } from "../data/memoryStore";

const router = express.Router();

router.post("/", (req, res) => {
  const result = StationInput.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { ownerId, name, address, city, state } = result.data;
  if (!users.has(ownerId)) {
    return res.status(404).json({ error: "Owner not found" });
  }
  const id = uuidv4();
  const station: Station = { id, ownerId, name, address, city, state };
  stations.set(id, station);
  res.status(201).json({ id, name, ownerId });
});

export default router;

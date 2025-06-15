
import express from "express";
const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ message: "Analytics endpoint not implemented yet." });
});

export default router;

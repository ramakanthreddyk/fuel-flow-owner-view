
import express from "express";
const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ message: "Tank refills endpoint not implemented yet." });
});

export default router;

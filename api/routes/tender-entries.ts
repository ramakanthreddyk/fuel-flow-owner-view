
import express from "express";
const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ message: "Tender entries endpoint not implemented yet." });
});

export default router;

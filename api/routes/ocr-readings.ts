
import express from "express";
const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ message: "OCR readings endpoint not implemented yet." });
});

export default router;

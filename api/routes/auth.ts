
import express from "express";
import { users } from "../data/memoryStore";

const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Find user by email & "check" the password (no hashing in mock setup)
  const user = Array.from(users.values()).find(
    (u) => u.email === email && u.password === password
  );
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  // Return a mock token and the user info (never send password)
  res.json({
    token: "mock-jwt-token",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// POST /api/auth/logout
router.post("/logout", (_req, res) => {
  // In a real app, this would clear the session/server-side token
  res.json({ success: true });
});

export default router;


import express from "express";
import { v4 as uuidv4 } from "uuid";
import { UserInput, User, UserRole } from "../data/types";
import { users } from "../data/memoryStore";

const router = express.Router();

router.post("/", (req, res) => {
  const result = UserInput.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { name, email, password, role } = result.data;
  if (![UserRole.enum.owner, UserRole.enum.employee].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  // Email should be unique
  if ([...users.values()].some(u => u.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }
  const id = uuidv4();
  const user: User = { id, name, email, password, role };
  users.set(id, user);
  res.status(201).json({ id, name, role });
});

export default router;

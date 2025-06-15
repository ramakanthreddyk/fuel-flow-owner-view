// Employee CRUD API

import express from "express";
import { v4 as uuidv4 } from "uuid";
import { UserInput, UserRole, User } from "../data/types";
import { users } from "../data/memoryStore";

const router = express.Router();

/**
 * @openapi
 * /employees:
 *   get:    # List all employees
 *     summary: Get all employees
 *   post:   # Create new employee
 *     summary: Create a new employee
 * /employees/{employeeId}:
 *   get:    # Get a specific employee
 *     summary: Get an employee by ID
 *   put:    # Update an employee
 *     summary: Update an employee
 *   delete: # Delete an employee
 *     summary: Delete an employee
 */

// List all employees
router.get("/", (_req, res) => {
  const employees = Array.from(users.values()).filter(u => u.role === UserRole.enum.employee);
  res.json(employees.map(({password, ...u}) => u)); // omit password from API response
});

// Get a specific employee
router.get("/:id", (req, res) => {
  const user = users.get(req.params.id);
  if (!user || user.role !== UserRole.enum.employee)
    return res.status(404).json({ error: "Employee not found" });
  const { password, ...response } = user;
  res.json(response);
});

// Create a new employee
router.post("/", (req, res) => {
  console.log("[POST /api/employees] received:", req.body);
  const result = UserInput.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { name, email, password, role } = result.data;
  if (role !== UserRole.enum.employee) {
    return res.status(400).json({ error: "Role must be 'employee'" });
  }
  if ([...users.values()].some(u => u.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }
  const id = uuidv4();
  const employee: User = { id, name, email, password, role };
  users.set(id, employee);
  const { password: _, ...response } = employee;
  res.status(201).json(response);
});

// Update an employee
router.put("/:id", (req, res) => {
  console.log(`[PUT /api/employees/${req.params.id}] received:`, req.body);
  const { id } = req.params;
  const existing = users.get(id);
  if (!existing || existing.role !== UserRole.enum.employee) {
    return res.status(404).json({ error: "Employee not found" });
  }
  const result = UserInput.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const updates = result.data;
  // Only allow updating name, email, password
  if (updates.role && updates.role !== UserRole.enum.employee) {
    return res.status(400).json({ error: "Role must stay 'employee'" });
  }
  const updated = {
    ...existing,
    ...updates,
    role: UserRole.enum.employee,
  };
  users.set(id, updated);
  const { password, ...response } = updated;
  res.json(response);
});

// Delete an employee
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.get(id);
  if (!user || user.role !== UserRole.enum.employee)
    return res.status(404).json({ error: "Employee not found" });
  users.delete(id);
  res.status(204).end();
});

export default router;

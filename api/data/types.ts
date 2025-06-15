
import { z } from "zod";

// ----- User -----
export const UserRole = z.enum(["owner", "employee"]);
export type UserRole = z.infer<typeof UserRole>;

export const UserInput = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  role: UserRole,
});
export type UserInput = z.infer<typeof UserInput>;

export const User = UserInput.extend({
  id: z.string().uuid(),
});
export type User = z.infer<typeof User>;

// ----- Station -----
export const StationInput = z.object({
  ownerId: z.string().uuid(),
  name: z.string().min(1),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});
export type StationInput = z.infer<typeof StationInput>;

export const Station = StationInput.extend({
  id: z.string().uuid(),
});
export type Station = z.infer<typeof Station>;

// ----- Pump -----
export const PumpInput = z.object({
  stationId: z.string().uuid(),
  label: z.string().min(1),
});
export type PumpInput = z.infer<typeof PumpInput>;

export const Pump = PumpInput.extend({
  id: z.string().uuid(),
});
export type Pump = z.infer<typeof Pump>;

// ----- Nozzle -----
export const NozzleInput = z.object({
  pumpId: z.string().uuid(),
  label: z.string().min(1),
  fuelType: z.enum(["petrol", "diesel"]),
  initialReading: z.number().optional(),
});
export type NozzleInput = z.infer<typeof NozzleInput>;

export const Nozzle = NozzleInput.extend({
  id: z.string().uuid(),
});
export type Nozzle = z.infer<typeof Nozzle>;

// ----- Employee Assignment -----
export const AssignmentInput = z.object({
  employeeId: z.string().uuid(),
  stationId: z.string().uuid(),
});
export type AssignmentInput = z.infer<typeof AssignmentInput>;

export const AssignmentOutput = z.object({
  success: z.literal(true),
});
export type AssignmentOutput = z.infer<typeof AssignmentOutput>;

// ----- Wizard Summary -----
export type WizardSummary = {
  user: User;
  station?: Station & { pumps: (Pump & { nozzles: Nozzle[] })[] };
  assignments: { employeeId: string; stationId: string }[];
};

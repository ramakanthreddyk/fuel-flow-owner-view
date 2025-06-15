
// ─────────────────────────────────────────────────────
// Types for Superadmin Setup Wizard (Full Flow)
// ─────────────────────────────────────────────────────

export type UserRole = "superadmin" | "owner" | "employee";
export type FuelType = "petrol" | "diesel";

// ─── Step 1: Create User ──────────────────────────────
export interface UserCreationInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// ─── Step 2: Create Station ───────────────────────────
export interface StationInput {
  name: string;
  brand?: string;              // e.g., IndianOil, BharatPetroleum, etc.
  address?: string;
  city?: string;
  state?: string;
  planId?: string;             // Superadmin chooses plan during setup
}

// ─── Step 3: Add Pumps ────────────────────────────────
export interface PumpInput {
  label: string;
  stationId?: string;
}

// ─── Step 4: Add Nozzles ──────────────────────────────
export interface NozzleInput {
  pumpId: string;
  label: string;
  fuelType: FuelType;
  initialCumulativeReading?: number;
}

// ─── Step 5: Assign Employee ──────────────────────────
export interface EmployeeAssignmentInput {
  stationId: string;
}

// ─── Full Wizard Context ──────────────────────────────
export interface WizardContextData {
  user?: UserCreationInput & { id?: string };
  station?: StationInput & { id?: string };
  pumps: (PumpInput & { id?: string })[];
  nozzles: (NozzleInput & { id?: string })[];
  employeeAssignment?: EmployeeAssignmentInput;
}

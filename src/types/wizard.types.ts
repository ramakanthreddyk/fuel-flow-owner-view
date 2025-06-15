
// Wizard Types for Superadmin Setup

export type UserRole = "owner" | "employee";

export interface UserCreationInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface StationInput {
  name: string;
  address?: string;
  city?: string;
  state?: string;
}

export interface PumpInput {
  label: string;
}

export type FuelType = "petrol" | "diesel";

export interface NozzleInput {
  pumpId: string; // references the pump this nozzle belongs to
  label: string;
  fuelType: FuelType;
  initialCumulativeReading?: number;
}

export interface EmployeeAssignmentInput {
  stationId: string;
}

export interface WizardContextData {
  user?: UserCreationInput & { id?: string };
  station?: StationInput & { id?: string };
  pumps: (PumpInput & { id?: string })[];
  nozzles: (NozzleInput & { id?: string })[];
  employeeAssignment?: EmployeeAssignmentInput;
}

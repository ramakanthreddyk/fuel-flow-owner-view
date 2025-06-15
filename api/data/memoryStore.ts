
import type { User, Station, Pump, Nozzle, AssignmentInput } from "./types";

// In-memory maps
export const users = new Map<string, User>();
export const stations = new Map<string, Station>();
export const pumps = new Map<string, Pump>();
export const nozzles = new Map<string, Nozzle>();
export const assignments: AssignmentInput[] = [];

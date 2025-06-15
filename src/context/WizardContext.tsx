
import React, { createContext, useContext, useReducer } from "react";
import type { WizardContextData, UserCreationInput, StationInput, PumpInput, NozzleInput, EmployeeAssignmentInput } from "@/types/wizard.types";

type Action =
  | { type: "reset" }
  | { type: "setUser"; user: WizardContextData["user"] }
  | { type: "setStation"; station: WizardContextData["station"] }
  | { type: "setPumps"; pumps: WizardContextData["pumps"] }
  | { type: "setNozzles"; nozzles: WizardContextData["nozzles"] }
  | { type: "setEmployeeAssignment"; employeeAssignment: EmployeeAssignmentInput };

const initialState: WizardContextData = {
  user: undefined,
  station: undefined,
  pumps: [],
  nozzles: [],
  employeeAssignment: undefined,
};

function reducer(state: WizardContextData, action: Action): WizardContextData {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setUser":
      return { ...state, user: action.user };
    case "setStation":
      return { ...state, station: action.station };
    case "setPumps":
      return { ...state, pumps: action.pumps };
    case "setNozzles":
      return { ...state, nozzles: action.nozzles };
    case "setEmployeeAssignment":
      return { ...state, employeeAssignment: action.employeeAssignment };
    default:
      return state;
  }
}

const WizardContext = createContext<{
  state: WizardContextData;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  return useContext(WizardContext);
}

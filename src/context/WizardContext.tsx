
import React, { createContext, useContext, useReducer } from "react";

type WizardRole = "owner" | "employee" | "";

export interface WizardState {
  user: null | {
    name: string;
    email: string;
    password: string;
    role: WizardRole;
    user_id?: string;
  };
  station: null | {
    station_name: string;
    address?: string;
    city?: string;
    state?: string;
    station_id?: string;
  };
  pumps: { label: string; pump_id?: string }[];
  nozzles: {
    pump_idx: number;
    label: string;
    fuel_type: "petrol" | "diesel";
    initial_cumulative_reading?: string;
    nozzle_id?: string;
  }[];
  assignedStation: null | { station_id: string; station_name: string };
}

const initialState: WizardState = {
  user: null,
  station: null,
  pumps: [],
  nozzles: [],
  assignedStation: null,
};

type Action =
  | { type: "reset" }
  | { type: "setUser"; user: WizardState["user"] }
  | { type: "setStation"; station: WizardState["station"] }
  | { type: "setPumps"; pumps: WizardState["pumps"] }
  | { type: "setNozzles"; nozzles: WizardState["nozzles"] }
  | { type: "setAssignedStation"; assignedStation: WizardState["assignedStation"] };

function reducer(state: WizardState, action: Action): WizardState {
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
    case "setAssignedStation":
      return { ...state, assignedStation: action.assignedStation };
    default:
      return state;
  }
}

const WizardContext = createContext<{
  state: WizardState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

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


import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { WizardData } from "../SuperadminUserWizard";

const StepSummary: React.FC<{ data: WizardData }> = ({ data }) => {
  const nav = useNavigate();
  return (
    <div className="grid gap-6 pt-2">
      <div className="text-lg font-semibold">User Created:</div>
      <div>
        <div>Email: <b>{data.user?.email}</b></div>
        <div>Role: <b>{data.user?.role}</b></div>
      </div>
      {data.station && (
        <div>
          <div className="font-semibold">Station:</div>
          <div>Name: {data.station.station_name}</div>
          {data.station.address && <div>Address: {data.station.address}</div>}
        </div>
      )}
      {data.pumps && data.pumps.length > 0 && (
        <div>
          <div className="font-semibold">Pumps:</div>
          <ul>
            {data.pumps.map((p, i) => <li key={i}>{p.label}</li>)}
          </ul>
        </div>
      )}
      {data.nozzles && data.nozzles.length > 0 && (
        <div>
          <div className="font-semibold">Nozzles:</div>
          <ul>
            {data.nozzles.map((n, i) =>
              <li key={i}>{n.label} ({n.fuel_type}, Pump: {data.pumps?.[n.pump_idx]?.label || "-"})</li>
            )}
          </ul>
        </div>
      )}
      {data.assignedStation && (
        <div>
          <div className="font-semibold">Assigned Station:</div>
          <div>{data.assignedStation.station_name}</div>
        </div>
      )}
      <div className="text-green-700 font-medium">All steps completed successfully!</div>
      <Button onClick={() => nav("/owner-dashboard")}>Go to Dashboard</Button>
    </div>
  );
};
export default StepSummary;


import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import StepCreateUser from "./wizard/StepCreateUser";
import StepCreateStation from "./wizard/StepCreateStation";
import StepAddPumps from "./wizard/StepAddPumps";
import StepAddNozzles from "./wizard/StepAddNozzles";
import StepAssignStation from "./wizard/StepAssignStation";
import StepSummary from "./wizard/StepSummary";

export type WizardData = {
  user?: { name: string; email: string; password: string; role: "owner"|"employee"; user_id?: string };
  station?: { station_name: string; address?: string; city?: string; state?: string; station_id?: string };
  pumps?: { label: string; pump_id?: string }[];
  nozzles?: { pump_idx: number; label: string; fuel_type: "petrol"|"diesel"; initial_cumulative_reading?: string; nozzle_id?: string }[];
  assignedStation?: { station_id: string; station_name: string };
};

const WIZARD_OWNER_STEPS = [
  "createUser",
  "createStation",
  "addPumps",
  "addNozzles",
  "summary"
] as const;
const WIZARD_EMPLOYEE_STEPS = [
  "createUser",
  "assignStation",
  "summary"
] as const;

const stepTitles: Record<string, string> = {
  createUser: "Create New User",
  createStation: "Create Station",
  addPumps: "Add Pumps",
  addNozzles: "Add Nozzles",
  assignStation: "Assign to Station",
  summary: "Summary"
};

const SuperadminUserWizard: React.FC = () => {
  const [data, setData] = useState<WizardData>({});
  const [stepIdx, setStepIdx] = useState(0);
  const getSteps = () =>
    data.user?.role === "owner" ? WIZARD_OWNER_STEPS : WIZARD_EMPLOYEE_STEPS;
  const stepKey = getSteps()[stepIdx];

  const goNext = (newData: Partial<WizardData>) => {
    setData((d) => ({ ...d, ...newData }));
    setStepIdx((idx) => idx + 1);
  };

  const goBack = () => setStepIdx((idx) => Math.max(idx - 1, 0));

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-10">
      <Card className="w-full max-w-xl p-6">
        <h2 className="text-2xl font-bold mb-1">{stepTitles[stepKey]}</h2>
        <div className="mb-4 text-muted-foreground">
          Step {stepIdx + 1} of {getSteps().length}
        </div>
        <div className="min-h-32 mt-2">
          {stepKey === "createUser" && (
            <StepCreateUser
              defaultValues={data.user}
              onNext={(user) => goNext({ user })}
            />
          )}
          {stepKey === "createStation" && (
            <StepCreateStation
              defaultValues={data.station}
              onNext={(station) => goNext({ station })}
              onBack={goBack}
            />
          )}
          {stepKey === "addPumps" && (
            <StepAddPumps
              defaultValues={data.pumps}
              onNext={(pumps) => goNext({ pumps })}
              onBack={goBack}
            />
          )}
          {stepKey === "addNozzles" && (
            <StepAddNozzles
              pumps={data.pumps || []}
              defaultValues={data.nozzles}
              onNext={(nozzles) => goNext({ nozzles })}
              onBack={goBack}
            />
          )}
          {stepKey === "assignStation" && (
            <StepAssignStation
              onNext={(assignedStation) => goNext({ assignedStation })}
              onBack={goBack}
            />
          )}
          {stepKey === "summary" && (
            <StepSummary data={data} />
          )}
        </div>
        {stepKey !== "createUser" && stepKey !== "summary" && (
          <Button variant="ghost" className="mt-6" onClick={goBack}>
            Back
          </Button>
        )}
      </Card>
    </div>
  );
};
export default SuperadminUserWizard;


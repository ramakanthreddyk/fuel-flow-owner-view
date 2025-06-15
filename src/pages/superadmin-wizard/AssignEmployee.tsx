
import React from "react";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/context/WizardContext";
import WizardNavButtons from "@/components/superadmin-wizard/WizardNavButtons";
import type { EmployeeAssignmentInput } from "@/types/wizard.types";

export default function AssignEmployee() {
  const { state, dispatch } = useWizard();

  return (
    <Card className="max-w-xl w-full p-8 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Assign Employee to Station</h2>
      <div className="mb-6">Assign form goes here.</div>
      <WizardNavButtons />
    </Card>
  );
}

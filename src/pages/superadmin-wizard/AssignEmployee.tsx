
import React from "react";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/context/WizardContext";
import type { EmployeeAssignmentInput } from "@/types/wizard.types";

export default function AssignEmployee() {
  const { state, dispatch } = useWizard();

  return (
    <Card className="max-w-xl w-full p-8">
      <h2 className="text-2xl font-bold mb-6">Assign Employee to Station</h2>
      <div>Assign form goes here.</div>
    </Card>
  );
}

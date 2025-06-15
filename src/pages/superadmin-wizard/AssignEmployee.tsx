
import React from "react";
import { Card } from "@/components/ui/card";
import WizardNavButtons from "@/components/superadmin-wizard/WizardNavButtons";

export default function AssignEmployee() {
  return (
    <Card className="max-w-xl w-full p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2">Assign Employee</h2>
      <div className="mb-4 space-y-2">
        <div className="text-sm text-muted-foreground">Employee assignment preview:</div>
        <ul className="list-disc list-inside pl-2 text-base text-orange-900 dark:text-orange-200">
          <li>Employee: <span className="font-mono">Jane Smith</span></li>
          <li>Assigned Station: <span className="font-mono">Fuel Point Main</span></li>
        </ul>
      </div>
      <div className="rounded bg-orange-50 dark:bg-orange-900/20 p-4 text-sm text-orange-900 dark:text-orange-50">
        <strong>Note:</strong> Placeholder for employee assignment UI.
      </div>
      <WizardNavButtons />
    </Card>
  );
}

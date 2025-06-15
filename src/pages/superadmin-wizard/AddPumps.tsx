
import React from "react";
import { Card } from "@/components/ui/card";
import WizardNavButtons from "@/components/superadmin-wizard/WizardNavButtons";

export default function AddPumps() {
  return (
    <Card className="max-w-xl w-full p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2">Add Pumps</h2>
      <div className="mb-4 space-y-2">
        <div className="text-sm text-muted-foreground">Dummy list of created pumps for preview:</div>
        <ul className="list-disc list-inside pl-2 text-base text-green-900 dark:text-green-200">
          <li>Pump 1: <span className="font-mono">Mainline #1</span></li>
          <li>Pump 2: <span className="font-mono">Diesel #2</span></li>
        </ul>
      </div>
      <div className="rounded bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-900 dark:text-green-50">
        <strong>Note:</strong> Placeholder for pump adding UI/components.
      </div>
      <WizardNavButtons />
    </Card>
  );
}

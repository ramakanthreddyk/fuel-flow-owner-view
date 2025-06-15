
import React from "react";
import { Card } from "@/components/ui/card";
import WizardNavButtons from "@/components/superadmin-wizard/WizardNavButtons";

export default function WizardSummary() {
  return (
    <Card className="max-w-xl w-full p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2">Summary</h2>
      <div className="mb-3 text-base">
        <div>Here is your wizard summary (dummy output):</div>
        <ul className="list-disc list-inside pl-2 mt-2 text-violet-900 dark:text-violet-100">
          <li>User: <span className="font-mono">johndoe / owner</span></li>
          <li>Station: <span className="font-mono">Fuel Point Main / 123 Main St</span></li>
          <li>Pumps: <span className="font-mono">2</span></li>
          <li>Nozzles: <span className="font-mono">2</span></li>
          <li>Assigned Employee: <span className="font-mono">Jane Smith</span></li>
        </ul>
      </div>
      <div className="rounded bg-violet-50 dark:bg-violet-900/20 p-4 text-sm text-violet-900 dark:text-violet-50">
        <strong>Note:</strong> Final wizard summary will appear here.
      </div>
      <WizardNavButtons />
    </Card>
  );
}

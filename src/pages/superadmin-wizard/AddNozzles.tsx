
import React from "react";
import { Card } from "@/components/ui/card";
import WizardNavButtons from "@/components/superadmin-wizard/WizardNavButtons";

export default function AddNozzles() {
  return (
    <Card className="max-w-xl w-full p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2">Add Nozzles</h2>
      <div className="mb-4 space-y-2">
        <div className="text-sm text-muted-foreground">Sample nozzles for preview:</div>
        <ul className="list-disc list-inside pl-2 text-base text-pink-900 dark:text-pink-200">
          <li>Nozzle 1: <span className="font-mono">Regular</span></li>
          <li>Nozzle 2: <span className="font-mono">Premium</span></li>
        </ul>
      </div>
      <div className="rounded bg-pink-50 dark:bg-pink-900/20 p-4 text-sm text-pink-900 dark:text-pink-50">
        <strong>Note:</strong> Placeholder for nozzle adding UI/components.
      </div>
      <WizardNavButtons />
    </Card>
  );
}

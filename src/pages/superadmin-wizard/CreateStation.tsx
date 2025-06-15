
import React from "react";
import { Card } from "@/components/ui/card";
import WizardNavButtons from "@/components/superadmin-wizard/WizardNavButtons";

export default function CreateStation() {
  return (
    <Card className="max-w-xl w-full p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2">Create Station</h2>
      <div className="mb-4 space-y-2">
        <div className="text-sm text-muted-foreground">Simulate station details:</div>
        <ul className="list-disc list-inside pl-2 text-base text-indigo-900 dark:text-indigo-200">
          <li>Name: <span className="font-mono">Fuel Point Main</span></li>
          <li>Address: <span className="font-mono">123 Main St</span></li>
          <li>City: <span className="font-mono">New City</span></li>
          <li>State: <span className="font-mono">CA</span></li>
        </ul>
      </div>
      <div className="rounded bg-indigo-50 dark:bg-indigo-900/30 p-4 text-sm text-indigo-900 dark:text-indigo-50">
        <strong>Note:</strong> This is a placeholder for the station creation form.
      </div>
      <WizardNavButtons />
    </Card>
  );
}

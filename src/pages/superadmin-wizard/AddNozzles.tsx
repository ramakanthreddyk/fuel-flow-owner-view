
import React from "react";
import { Card } from "@/components/ui/card";
import WizardNavButtons from "@/components/superadmin-wizard/WizardNavButtons";

export default function AddNozzles() {
  return (
    <Card className="max-w-xl w-full p-8 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Add Nozzles</h2>
      <div className="mb-6">Nozzle addition UI goes here.</div>
      <WizardNavButtons />
    </Card>
  );
}

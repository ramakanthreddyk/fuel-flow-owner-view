
import React from "react";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/context/WizardContext";
import type { PumpInput } from "@/types/wizard.types";

export default function AddPumps() {
  const { state, dispatch } = useWizard();

  return (
    <Card className="max-w-xl w-full p-8">
      <h2 className="text-2xl font-bold mb-6">Add Pumps</h2>
      <div>Pumps UI goes here.</div>
    </Card>
  );
}

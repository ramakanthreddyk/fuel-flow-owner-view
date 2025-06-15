
import React from "react";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/context/WizardContext";
import type { WizardContextData } from "@/types/wizard.types";

export default function WizardSummary() {
  const { state } = useWizard();

  return (
    <Card className="max-w-xl w-full p-8">
      <h2 className="text-2xl font-bold mb-6">Summary</h2>
      {/* TODO: Show collected info */}
      <div>Summary goes here.</div>
    </Card>
  );
}

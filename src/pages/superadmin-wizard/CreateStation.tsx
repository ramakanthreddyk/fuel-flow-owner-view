
import React from "react";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/context/WizardContext";
import type { StationInput } from "@/types/wizard.types";

export default function CreateStation() {
  const { state, dispatch } = useWizard();

  return (
    <Card className="max-w-xl w-full p-8">
      <h2 className="text-2xl font-bold mb-6">Create Station</h2>
      <div>Form goes here.</div>
    </Card>
  );
}

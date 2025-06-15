
import React from "react";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/context/WizardContext";
import WizardNavButtons from "@/components/superadmin-wizard/WizardNavButtons";
import type { UserCreationInput } from "@/types/wizard.types";

export default function CreateUser() {
  const { state, dispatch } = useWizard();

  // Placeholder UI for demonstration, real form & logic to be added soon.
  return (
    <Card className="max-w-xl w-full p-8 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Create New User</h2>
      <div className="mb-6">Form goes here.</div>
      <WizardNavButtons />
    </Card>
  );
}

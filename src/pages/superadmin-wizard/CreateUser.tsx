
import React from "react";
import { Card } from "@/components/ui/card";
import { useWizard } from "@/context/WizardContext";
import type { UserCreationInput } from "@/types/wizard.types";

export default function CreateUser() {
  // Usage example
  const { state, dispatch } = useWizard();

  // Placeholder UI for demonstration, real form & logic to be added soon.
  return (
    <Card className="max-w-xl w-full p-8">
      <h2 className="text-2xl font-bold mb-6">Create New User</h2>
      <div>Form goes here.</div>
    </Card>
  );
}

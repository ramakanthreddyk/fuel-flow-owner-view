
import React from "react";
import { Card } from "@/components/ui/card";
import WizardNavButtons from "@/components/superadmin-wizard/WizardNavButtons";

export default function CreateStation() {
  return (
    <Card className="max-w-xl w-full p-8 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Create Station</h2>
      <div className="mb-6">Station creation form goes here.</div>
      <WizardNavButtons />
    </Card>
  );
}


import React from "react";
import { Card } from "@/components/ui/card";
import WizardNavButtons from "@/components/superadmin-wizard/WizardNavButtons";

export default function CreateUser() {
  return (
    <Card className="max-w-xl w-full p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2">Create User</h2>
      <div className="mb-4 space-y-2">
        <div className="text-sm text-muted-foreground">Simulate entering user details below:</div>
        <ul className="list-disc list-inside pl-2 text-base text-blue-800 dark:text-blue-200">
          <li>Username: <span className="font-mono">johndoe</span></li>
          <li>Email: <span className="font-mono">john@example.com</span></li>
          <li>Password: <span className="font-mono">********</span></li>
          <li>Role: <span className="font-mono">owner</span></li>
        </ul>
      </div>
      <div className="rounded bg-blue-50 dark:bg-blue-900/30 p-4 text-sm text-blue-700 dark:text-blue-100">
        <strong>Note:</strong> This is a placeholder for the user creation form.
      </div>
      <WizardNavButtons />
    </Card>
  );
}

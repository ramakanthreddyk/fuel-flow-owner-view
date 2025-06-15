
import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useWizard } from "@/context/WizardContext";

// Wizard steps and routes, also considering role-based flows
const wizardRoutes = [
  "/superadmin-wizard/create-user",
  "/superadmin-wizard/create-station",
  "/superadmin-wizard/add-pumps",
  "/superadmin-wizard/add-nozzles",
  "/superadmin-wizard/assign-employee",
  "/superadmin-wizard/summary",
];

type Props = {
  // Optional disable/handler logic
  onNext?: () => Promise<void | boolean> | void | boolean; // updated type
  onBack?: () => Promise<void> | void;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
};

const WizardNavButtons: React.FC<Props> = ({
  onNext,
  onBack,
  nextDisabled,
  backDisabled,
  nextLabel,
  backLabel,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state } = useWizard();

  // Determine steps based on user role
  const role: "owner"|"employee"|undefined = state.user?.role;
  let steps = wizardRoutes;
  // Adjust for employee flow (skip station, pumps, nozzles)
  if (role === "employee") {
    steps = [
      "/superadmin-wizard/create-user",
      "/superadmin-wizard/assign-employee",
      "/superadmin-wizard/summary",
    ];
  }

  const idx = steps.indexOf(pathname);

  function handleBack() {
    if (onBack) onBack();
    if (idx > 0) navigate(steps[idx - 1]);
  }

  async function handleNext() {
    if (onNext) {
      const result = await onNext();
      // If handler returns false, don't auto-navigate
      if (result === false) return;
    }
    if (idx < steps.length - 1) navigate(steps[idx + 1]);
  }

  return (
    <div className="flex w-full justify-between pt-10 gap-3">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={idx === 0 || backDisabled}
        type="button"
      >
        {backLabel || "Back"}
      </Button>
      {idx !== steps.length - 1 && (
        <Button
          onClick={handleNext}
          disabled={nextDisabled}
          type="button"
        >
          {nextLabel || "Next"}
        </Button>
      )}
    </div>
  );
};

export default WizardNavButtons;

import { useState } from "react";
import { AuthGate } from "@/components/features/auth-gate";
import { CaregiverWelcome } from "@/components/features/caregiver-welcome";
import { CaregiverDashboard } from "@/components/features/caregiver-dashboard";
import { OnboardingWizard } from "@/components/features/onboarding/onboarding-wizard";

const STORAGE_KEY = "carematch_has_account";
const FIRST_NAME_KEY = "carematch_first_name";

type CaregiverScreen = "welcome" | "onboarding" | "dashboard";
type AuthVariant = "new" | "returning";

interface CaregiverFlowProps {
  onBack: () => void;
}

export const CaregiverFlow = ({ onBack }: CaregiverFlowProps) => {
  const isReturningUser = localStorage.getItem(STORAGE_KEY) === "true";

  const [screen, setScreen] = useState<CaregiverScreen>("welcome");
  const [authOpen, setAuthOpen] = useState(isReturningUser);
  const [authVariant, setAuthVariant] = useState<AuthVariant>(
    isReturningUser ? "returning" : "new",
  );
  const [firstName, setFirstName] = useState(
    () => localStorage.getItem(FIRST_NAME_KEY) ?? "",
  );

  const handleStart = () => {
    setAuthVariant("new");
    setAuthOpen(true);
  };

  const handleAuthComplete = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setAuthOpen(false);
    if (authVariant === "returning") {
      setScreen("dashboard");
    } else {
      setScreen("onboarding");
    }
  };

  const handleOnboardingComplete = (name: string) => {
    localStorage.setItem(FIRST_NAME_KEY, name);
    setFirstName(name);
    setScreen("dashboard");
  };

  const handleAuthDismiss = (open: boolean) => {
    setAuthOpen(open);
    if (!open && isReturningUser && screen === "welcome") {
      onBack();
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#f8f4f0]">
      {screen === "welcome" && (
        <CaregiverWelcome onStart={handleStart} onBack={onBack} />
      )}
      {screen === "onboarding" && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onBack={() => setScreen("welcome")}
        />
      )}
      {screen === "dashboard" && <CaregiverDashboard firstName={firstName} onBack={onBack} />}

      <AuthGate
        open={authOpen}
        onOpenChange={handleAuthDismiss}
        mode="caregiver"
        variant={authVariant}
        onComplete={handleAuthComplete}
      />
    </div>
  );
};

import { useState } from "react";
import { AuthGate } from "@/components/features/auth-gate";
import { CaregiverWelcome } from "@/components/features/caregiver-welcome";
import { OnboardingWizard } from "@/components/features/onboarding/onboarding-wizard";

const STORAGE_KEY = "carematch_has_account";

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

  const handleStart = () => {
    setAuthVariant("new");
    setAuthOpen(true);
  };

  const handleLogin = () => {
    setAuthVariant("returning");
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

  const handleAuthDismiss = (open: boolean) => {
    setAuthOpen(open);
    if (!open && isReturningUser && screen === "welcome") {
      onBack();
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#f8f4f0]">
      {screen === "welcome" && (
        <CaregiverWelcome
          onStart={handleStart}
          onLogin={handleLogin}
          onBack={onBack}
        />
      )}
      {screen === "onboarding" && (
        <OnboardingWizard
          onComplete={() => setScreen("dashboard")}
          onBack={() => setScreen("welcome")}
        />
      )}
      {screen === "dashboard" && (
        <div className="flex min-h-screen items-center justify-center px-6 text-center">
          <p className="text-[17px] font-medium text-[#3c3c43]/60">
            Dashboard — wkrótce
          </p>
        </div>
      )}

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

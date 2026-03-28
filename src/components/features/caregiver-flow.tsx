import { useState } from "react";
import { AuthGate } from "@/components/features/auth-gate";
import { CaregiverWelcome } from "@/components/features/caregiver-welcome";
import { CaregiverDashboard } from "@/components/features/caregiver-dashboard";
import { OnboardingWizard } from "@/components/features/onboarding/onboarding-wizard";
import type { OnboardingData } from "@/components/features/onboarding/onboarding-types";

const STORAGE_KEY = "carematch_has_account";
const FIRST_NAME_KEY = "carematch_first_name";
const ONBOARDING_STEP_KEY = "carematch_onboarding_step";
const ONBOARDING_DATA_KEY = "carematch_onboarding_data";
const ONBOARDING_COMPLETE_KEY = "carematch_onboarding_complete";

type CaregiverScreen = "welcome" | "onboarding" | "dashboard";
type AuthVariant = "new" | "returning";

interface CaregiverFlowProps {
  onBack: () => void;
}

export const CaregiverFlow = ({ onBack }: CaregiverFlowProps) => {
  const isReturningUser = localStorage.getItem(STORAGE_KEY) === "true";
  const onboardingComplete =
    localStorage.getItem(ONBOARDING_COMPLETE_KEY) === "true";

  const savedStep = (() => {
    const v = localStorage.getItem(ONBOARDING_STEP_KEY);
    if (!v) return null;
    const n = parseInt(v, 10);
    return n >= 1 && n <= 4 ? n : null;
  })();

  const savedData = (() => {
    const v = localStorage.getItem(ONBOARDING_DATA_KEY);
    if (!v) return undefined;
    try {
      return JSON.parse(v) as OnboardingData;
    } catch {
      return undefined;
    }
  })();

  // Routing: authorized + complete → dashboard
  //          authorized + incomplete (savedStep) → resume onboarding
  //          authorized + no step saved → onboarding from step 1
  //          not authorized → welcome
  const initialScreen: CaregiverScreen = isReturningUser
    ? onboardingComplete
      ? "dashboard"
      : "onboarding"
    : "welcome";

  const [screen, setScreen] = useState<CaregiverScreen>(initialScreen);
  const [authOpen, setAuthOpen] = useState(false);
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

    if (
      authVariant === "returning" &&
      localStorage.getItem(ONBOARDING_COMPLETE_KEY) === "true"
    ) {
      setAuthOpen(false);
      setScreen("dashboard");
    } else {
      // New user or returning with incomplete onboarding
      setScreen("onboarding");
      setAuthOpen(false);
    }
  };

  const handleOnboardingComplete = (name: string) => {
    localStorage.setItem(FIRST_NAME_KEY, name);
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
    setFirstName(name);
    setScreen("dashboard");
  };

  const handleAuthDismiss = (open: boolean) => {
    setAuthOpen(open);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#f8f4f0]">
      {screen === "welcome" && (
        <CaregiverWelcome onStart={handleStart} onBack={onBack} />
      )}
      {screen === "onboarding" && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onBack={onBack}
          initialStep={savedStep ?? 1}
          initialData={savedData}
        />
      )}
      {screen === "dashboard" && (
        <CaregiverDashboard firstName={firstName} onBack={onBack} />
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

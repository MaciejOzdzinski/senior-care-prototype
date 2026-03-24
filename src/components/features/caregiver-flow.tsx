import { useState } from "react";
import { CaregiverWelcome } from "@/components/features/caregiver-welcome";
import { OnboardingWizard } from "@/components/features/onboarding/onboarding-wizard";

type CaregiverScreen = "welcome" | "onboarding" | "dashboard";

interface CaregiverFlowProps {
  onBack: () => void;
}

export function CaregiverFlow({ onBack }: CaregiverFlowProps) {
  const [screen, setScreen] = useState<CaregiverScreen>("welcome");

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-black/3" />
      {screen === "welcome" && (
        <CaregiverWelcome
          onStart={() => setScreen("onboarding")}
          onLogin={() => {
            // TODO: navigate to login
          }}
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
    </div>
  );
}

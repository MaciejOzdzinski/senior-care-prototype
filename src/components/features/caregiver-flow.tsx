import { useState } from "react";
import { CaregiverWelcome } from "@/components/features/caregiver-welcome";

type CaregiverScreen = "welcome";

interface CaregiverFlowProps {
  onBack: () => void;
}

export function CaregiverFlow({ onBack }: CaregiverFlowProps) {
  const [screen] = useState<CaregiverScreen>("welcome");

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-black/3" />
      {screen === "welcome" && (
        <CaregiverWelcome
          onStart={() => {
            // TODO: navigate to profile builder
          }}
          onLogin={() => {
            // TODO: navigate to login
          }}
          onBack={onBack}
        />
      )}
    </div>
  );
}

import { useState, useCallback } from "react";
import { OnboardingScaffold } from "./onboarding-scaffold";
import { StepBasicInfo } from "./step-basic-info";
import { StepSpecializations } from "./step-specializations";
import { StepAvailability } from "./step-availability";
import { StepRateExperience } from "./step-rate-experience";
import { OnboardingSuccess } from "./onboarding-success";
import { type OnboardingData, emptyOnboarding } from "./onboarding-types";

const ONBOARDING_STEP_KEY = "carematch_onboarding_step";
const ONBOARDING_DATA_KEY = "carematch_onboarding_data";

const steps = [
  {
    headline: "Dane podstawowe",
    supporting: "Powiedz nam kim jesteś — to pomoże rodzinom Cię poznać.",
  },
  {
    headline: "W czym pomagasz?",
    supporting: "Zaznacz wszystkie obszary, w których masz doświadczenie.",
  },
  {
    headline: "Twoja dostępność",
    supporting: "Kiedy możesz przyjmować podopiecznych?",
  },
  {
    headline: "Stawka i doświadczenie",
    supporting: "Ostatni krok — podaj stawkę i opowiedz o sobie.",
  },
];

interface OnboardingWizardProps {
  onComplete: (firstName: string) => void;
  onBack: () => void;
  initialStep?: number;
  initialData?: OnboardingData;
}

export const OnboardingWizard = ({
  onComplete,
  onBack,
  initialStep = 1,
  initialData,
}: OnboardingWizardProps) => {
  const [step, setStep] = useState(initialStep);
  const [data, setData] = useState<OnboardingData>(
    initialData ?? emptyOnboarding,
  );
  const [done, setDone] = useState(false);

  // Persist step 1 on first mount so incomplete onboarding is always detectable
  useState(() => {
    if (!localStorage.getItem(ONBOARDING_STEP_KEY)) {
      localStorage.setItem(ONBOARDING_STEP_KEY, String(initialStep));
    }
  });

  const patch = useCallback(
    (updates: Partial<OnboardingData>) =>
      setData((prev) => ({ ...prev, ...updates })),
    [],
  );

  const handleBack = () => {
    if (step === 1) {
      if (window.confirm("Czy na pewno?\nTwoje dane nie zostaną zapisane.")) {
        localStorage.removeItem(ONBOARDING_STEP_KEY);
        localStorage.removeItem(ONBOARDING_DATA_KEY);
        onBack();
      }
    } else {
      setStep((s) => s - 1);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      const nextStep = step + 1;
      setStep(nextStep);
      localStorage.setItem(ONBOARDING_STEP_KEY, String(nextStep));
      localStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(ONBOARDING_STEP_KEY);
      localStorage.removeItem(ONBOARDING_DATA_KEY);
      setDone(true);
    }
  };

  const isStepValid = (): boolean => {
    switch (step) {
      case 1:
        return (
          data.firstName.trim().length > 0 &&
          data.lastName.trim().length > 0 &&
          data.city.trim().length > 0
        );
      case 2:
        return data.specializations.length > 0;
      case 3:
        return data.availableDays.length > 0;
      case 4:
        return data.hourlyRate.trim().length > 0;
      default:
        return false;
    }
  };

  if (done) {
    return (
      <OnboardingSuccess
        firstName={data.firstName}
        onContinue={() => onComplete(data.firstName.trim())}
      />
    );
  }

  const { headline, supporting } = steps[step - 1];
  const isLast = step === 4;

  return (
    <OnboardingScaffold
      step={step}
      headline={headline}
      supporting={supporting}
      ctaLabel={isLast ? "Zakończ" : "Dalej"}
      ctaDisabled={!isStepValid()}
      onNext={handleNext}
      onBack={handleBack}
      secondaryLabel={step >= 2 && !isLast ? "Uzupełnię później" : undefined}
      onSecondary={step >= 2 && !isLast ? handleNext : undefined}
    >
      {step === 1 && <StepBasicInfo data={data} onChange={patch} />}
      {step === 2 && (
        <StepSpecializations
          selected={data.specializations}
          onChange={(ids) => patch({ specializations: ids })}
        />
      )}
      {step === 3 && <StepAvailability data={data} onChange={patch} />}
      {step === 4 && <StepRateExperience data={data} onChange={patch} />}
    </OnboardingScaffold>
  );
};

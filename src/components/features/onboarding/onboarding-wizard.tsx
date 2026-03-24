import { useState, useCallback } from "react";
import { OnboardingScaffold } from "./onboarding-scaffold";
import { StepAccount } from "./step-account";
import { StepBasicInfo } from "./step-basic-info";
import { StepSpecializations } from "./step-specializations";
import { StepAvailability } from "./step-availability";
import { StepRateExperience } from "./step-rate-experience";
import { OnboardingSuccess } from "./onboarding-success";
import { type OnboardingData, emptyOnboarding } from "./onboarding-types";

const steps = [
  {
    headline: "Utwórz konto",
    supporting: "Wybierz jak chcesz się zalogować. Minimum formalności.",
  },
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
  onComplete: () => void;
  onBack: () => void;
}

export function OnboardingWizard({
  onComplete,
  onBack,
}: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(emptyOnboarding);
  const [done, setDone] = useState(false);

  const patch = useCallback(
    (updates: Partial<OnboardingData>) =>
      setData((prev) => ({ ...prev, ...updates })),
    [],
  );

  function handleBack() {
    if (step === 1) {
      onBack();
    } else {
      setStep((s) => s - 1);
    }
  }

  function handleNext() {
    if (step < 5) {
      setStep((s) => s + 1);
    } else {
      setDone(true);
    }
  }

  function isStepValid(): boolean {
    switch (step) {
      case 1:
        return data.authMethod !== null;
      case 2:
        return (
          data.firstName.trim().length > 0 &&
          data.lastName.trim().length > 0 &&
          data.city.trim().length > 0
        );
      case 3:
        return data.specializations.length > 0;
      case 4:
        return data.availableDays.length > 0;
      case 5:
        return data.hourlyRate.trim().length > 0;
      default:
        return false;
    }
  }

  if (done) {
    return (
      <OnboardingSuccess firstName={data.firstName} onContinue={onComplete} />
    );
  }

  const { headline, supporting } = steps[step - 1];
  const isLast = step === 5;

  return (
    <OnboardingScaffold
      step={step}
      headline={headline}
      supporting={supporting}
      ctaLabel={isLast ? "Zakończ" : "Dalej"}
      ctaDisabled={!isStepValid()}
      onNext={handleNext}
      onBack={handleBack}
      secondaryLabel={
        step === 1
          ? "Mam już konto"
          : step >= 3 && !isLast
            ? "Uzupełnię później"
            : undefined
      }
      onSecondary={
        step === 1 || (step >= 3 && !isLast) ? handleNext : undefined
      }
    >
      {step === 1 && (
        <StepAccount
          selected={data.authMethod}
          onChange={(method) => patch({ authMethod: method })}
        />
      )}
      {step === 2 && <StepBasicInfo data={data} onChange={patch} />}
      {step === 3 && (
        <StepSpecializations
          selected={data.specializations}
          onChange={(ids) => patch({ specializations: ids })}
        />
      )}
      {step === 4 && <StepAvailability data={data} onChange={patch} />}
      {step === 5 && <StepRateExperience data={data} onChange={patch} />}
    </OnboardingScaffold>
  );
}

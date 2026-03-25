import { motion } from "motion/react";
import type { OnboardingData } from "./onboarding-types";

const tapSpring = { type: "spring" as const, stiffness: 300, damping: 20 };

const weekDays = [
  { id: "mon", label: "Pon" },
  { id: "tue", label: "Wt" },
  { id: "wed", label: "Śr" },
  { id: "thu", label: "Czw" },
  { id: "fri", label: "Pt" },
  { id: "sat", label: "Sob" },
  { id: "sun", label: "Ndz" },
];

const startOptions = ["Od zaraz", "Za tydzień", "Za 2 tygodnie", "Za miesiąc"];

/** Light haptic feedback — closest web equivalent to UIImpactFeedbackGenerator(.light) */
const haptic = () => {
  if ("vibrate" in navigator) navigator.vibrate(10);
};

interface StepAvailabilityProps {
  data: Pick<
    OnboardingData,
    | "availableDays"
    | "availableHoursFrom"
    | "availableHoursTo"
    | "availableFrom"
  >;
  onChange: (patch: Partial<OnboardingData>) => void;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-2 block text-[13px] font-medium tracking-[-0.08px] text-[#8e8e93]">
    {children}
  </span>
);

interface TimeFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

const TimeField = ({ label, value, onChange }: TimeFieldProps) => (
  <label className="block flex-1">
    <span className="mb-1.5 block text-[13px] font-medium tracking-[-0.08px] text-[#8e8e93]">
      {label}
    </span>
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-black/6 bg-white/50 px-4 py-3 text-[15px] tracking-[-0.41px] text-[#1c1c1e] outline-none transition-colors focus:border-[#FF9500]/40 focus:bg-white/70"
    />
  </label>
);

export const StepAvailability = ({ data, onChange }: StepAvailabilityProps) => {
  const toggleDay = (id: string) => {
    haptic();
    const next = data.availableDays.includes(id)
      ? data.availableDays.filter((d) => d !== id)
      : [...data.availableDays, id];
    onChange({ availableDays: next });
  };

  return (
    <div className="space-y-4">
      {/* Days — min 44px touch targets per HIG */}
      <div>
        <SectionLabel>Dni tygodnia</SectionLabel>
        <div className="flex gap-1.5">
          {weekDays.map(({ id, label }) => {
            const active = data.availableDays.includes(id);
            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => toggleDay(id)}
                whileTap={{ scale: 0.92 }}
                transition={tapSpring}
                className={`flex-1 min-h-11 rounded-xl text-center text-[13px] font-semibold tracking-[-0.08px] transition-colors ${
                  active
                    ? "bg-[#FF9500]/12 text-[#FF9500]"
                    : "bg-white/50 text-[#3c3c43]/60"
                }`}
              >
                {label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto h-px w-full bg-black/6" />

      {/* Hours — native time picker instead of select */}
      <div>
        <SectionLabel>Godziny pracy</SectionLabel>
        <div className="flex gap-3">
          <TimeField
            label="Od"
            value={data.availableHoursFrom}
            onChange={(v) => onChange({ availableHoursFrom: v })}
          />
          <TimeField
            label="Do"
            value={data.availableHoursTo}
            onChange={(v) => onChange({ availableHoursTo: v })}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto h-px w-full bg-black/6" />

      {/* Available from — HIG-compliant 44px touch targets + haptic */}
      <div>
        <SectionLabel>Od kiedy możesz zacząć?</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {startOptions.map((opt) => {
            const active = data.availableFrom === opt;
            return (
              <motion.button
                key={opt}
                type="button"
                onClick={() => {
                  haptic();
                  onChange({ availableFrom: opt });
                }}
                whileTap={{ scale: 0.95 }}
                transition={tapSpring}
                className={`min-h-11 rounded-full border px-4 py-2.5 text-[14px] font-medium tracking-[-0.41px] transition-colors ${
                  active
                    ? "border-[#FF9500]/40 bg-[#FF9500]/10 text-[#1c1c1e]"
                    : "border-black/6 bg-white/50 text-[#3c3c43]/70"
                }`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

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

const hourSlots = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

const startOptions = ["Od zaraz", "Za tydzień", "Za 2 tygodnie", "Za miesiąc"];

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-[13px] font-medium tracking-[-0.08px] text-[#8e8e93]">
      {children}
    </span>
  );
}

function SelectField({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block flex-1">
      <span className="mb-1.5 block text-[13px] font-medium tracking-[-0.08px] text-[#8e8e93]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-black/6 bg-white/50 px-4 py-3 text-[15px] tracking-[-0.41px] text-[#1c1c1e] outline-none transition-colors focus:border-[#FF9500]/40 focus:bg-white/70"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function StepAvailability({ data, onChange }: StepAvailabilityProps) {
  function toggleDay(id: string) {
    const next = data.availableDays.includes(id)
      ? data.availableDays.filter((d) => d !== id)
      : [...data.availableDays, id];
    onChange({ availableDays: next });
  }

  return (
    <div className="space-y-6">
      {/* Days */}
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
                className={`flex-1 rounded-xl py-2.5 text-center text-[13px] font-semibold tracking-[-0.08px] transition-colors ${
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

      {/* Hours */}
      <div className="flex gap-3">
        <SelectField
          label="Od"
          value={data.availableHoursFrom}
          options={hourSlots}
          placeholder="—"
          onChange={(v) => onChange({ availableHoursFrom: v })}
        />
        <SelectField
          label="Do"
          value={data.availableHoursTo}
          options={hourSlots}
          placeholder="—"
          onChange={(v) => onChange({ availableHoursTo: v })}
        />
      </div>

      {/* Available from */}
      <div>
        <SectionLabel>Od kiedy możesz zacząć?</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {startOptions.map((opt) => {
            const active = data.availableFrom === opt;
            return (
              <motion.button
                key={opt}
                type="button"
                onClick={() => onChange({ availableFrom: opt })}
                whileTap={{ scale: 0.95 }}
                transition={tapSpring}
                className={`rounded-full border px-3.5 py-2 text-[14px] font-medium tracking-[-0.41px] transition-colors ${
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
}

import type { OnboardingData } from "./onboarding-types";

const experienceOptions = [
  "Brak — zaczynam",
  "< 1 rok",
  "1–3 lata",
  "3–5 lat",
  "5–10 lat",
  "10+ lat",
];

interface StepRateExperienceProps {
  data: Pick<OnboardingData, "yearsExperience" | "hourlyRate" | "bio">;
  onChange: (patch: Partial<OnboardingData>) => void;
}

function FormField({
  label,
  value,
  placeholder,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium tracking-[-0.08px] text-[#8e8e93]">
        {label}
      </span>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-black/6 bg-white/50 px-4 py-3 text-[15px] tracking-[-0.41px] text-[#1c1c1e] outline-none transition-colors placeholder:text-[#3c3c43]/30 focus:border-[#FF9500]/40 focus:bg-white/70"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#8e8e93]">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

export function StepRateExperience({
  data,
  onChange,
}: StepRateExperienceProps) {
  return (
    <div className="space-y-5">
      {/* Experience */}
      <div>
        <span className="mb-1.5 block text-[13px] font-medium tracking-[-0.08px] text-[#8e8e93]">
          Doświadczenie
        </span>
        <select
          value={data.yearsExperience}
          onChange={(e) => onChange({ yearsExperience: e.target.value })}
          className="w-full appearance-none rounded-xl border border-black/6 bg-white/50 px-4 py-3 text-[15px] tracking-[-0.41px] text-[#1c1c1e] outline-none transition-colors focus:border-[#FF9500]/40 focus:bg-white/70"
        >
          <option value="" disabled>
            Wybierz
          </option>
          {experienceOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {/* Hourly rate */}
      <FormField
        label="Stawka godzinowa"
        value={data.hourlyRate}
        placeholder="np. 35"
        onChange={(v) => onChange({ hourlyRate: v })}
        suffix="zł / h"
      />

      {/* Bio */}
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium tracking-[-0.08px] text-[#8e8e93]">
          Krótko o sobie
        </span>
        <textarea
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="Kilka zdań o Twoim podejściu do opieki…"
          rows={4}
          maxLength={300}
          className="w-full resize-none rounded-xl border border-black/6 bg-white/50 px-4 py-3 text-[15px] leading-[22px] tracking-[-0.41px] text-[#1c1c1e] outline-none transition-colors placeholder:text-[#3c3c43]/30 focus:border-[#FF9500]/40 focus:bg-white/70"
        />
        <span className="mt-1 block text-right text-[12px] text-[#8e8e93]">
          {data.bio.length}/300
        </span>
      </label>
    </div>
  );
}

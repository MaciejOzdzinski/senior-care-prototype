import { Camera } from "lucide-react";
import type { OnboardingData } from "./onboarding-types";

interface StepBasicInfoProps {
  data: Pick<OnboardingData, "firstName" | "lastName" | "city" | "avatarUrl">;
  onChange: (patch: Partial<OnboardingData>) => void;
}

function FormField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium tracking-[-0.08px] text-[#8e8e93]">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/6 bg-white/50 px-4 py-3 text-[15px] tracking-[-0.41px] text-[#1c1c1e] outline-none transition-colors placeholder:text-[#3c3c43]/30 focus:border-[#FF9500]/40 focus:bg-white/70"
      />
    </label>
  );
}

export function StepBasicInfo({ data, onChange }: StepBasicInfoProps) {
  return (
    <div className="space-y-5">
      {/* Avatar placeholder */}
      <div className="flex justify-center">
        <button
          type="button"
          className="group relative grid size-24 place-items-center rounded-full border-2 border-dashed border-black/8 bg-white/40 transition-colors hover:border-[#FF9500]/30"
        >
          {data.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt=""
              className="size-full rounded-full object-cover"
            />
          ) : (
            <Camera className="size-7 text-[#8e8e93] transition-colors group-hover:text-[#FF9500]" />
          )}
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[#FF9500] px-2 py-0.5 text-[11px] font-medium text-white">
            Dodaj
          </span>
        </button>
      </div>

      <FormField
        label="Imię"
        value={data.firstName}
        placeholder="np. Anna"
        onChange={(v) => onChange({ firstName: v })}
      />
      <FormField
        label="Nazwisko"
        value={data.lastName}
        placeholder="np. Kowalska"
        onChange={(v) => onChange({ lastName: v })}
      />
      <FormField
        label="Miasto"
        value={data.city}
        placeholder="np. Warszawa, Mokotów"
        onChange={(v) => onChange({ city: v })}
      />
    </div>
  );
}

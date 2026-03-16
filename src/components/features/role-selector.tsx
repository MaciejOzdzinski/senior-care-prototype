import { ChevronRight, HeartHandshake, UserRoundSearch } from "lucide-react";
import type { RoleMode } from "@/types/domain";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  value: RoleMode;
  onChange: (value: RoleMode) => void;
}

const roleOptions: Array<{
  value: RoleMode;
  title: string;
  description: string;
  helper: string;
  Icon: typeof UserRoundSearch;
}> = [
  {
    value: "family",
    title: "Rodzina",
    description: "Szukam bezpiecznej, godzinowej opieki dla bliskiej osoby.",
    helper: "Dopasowani opiekunowie",
    Icon: UserRoundSearch,
  },
  {
    value: "caregiver",
    title: "Opiekun",
    description:
      "Chcę odbierać dopasowane zgłoszenia i budować zaufany profil.",
    helper: "Mapa zgłoszeń rodzin",
    Icon: HeartHandshake,
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      {roleOptions.map(
        ({ value: roleValue, title, description, helper, Icon }) => {
          const isActive = value === roleValue;

          return (
            <button
              key={roleValue}
              type="button"
              onClick={() => onChange(roleValue)}
              className="group block w-full text-left"
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl border px-5 py-5 transition-all duration-200",
                  isActive
                    ? "border-[#007AFF]/25 bg-[#007AFF]/[0.04] shadow-[0_2px_12px_rgba(0,122,255,0.1)]"
                    : "border-black/[0.06] bg-white group-hover:border-black/[0.1] group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "grid size-12 shrink-0 place-items-center rounded-2xl transition-colors duration-200",
                      isActive
                        ? "bg-[#007AFF]/10"
                        : "bg-[#f2f2f7] group-hover:bg-[#e5e5ea]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5.5",
                        isActive ? "text-[#007AFF]" : "text-[#8e8e93]",
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[1.1rem] font-semibold tracking-[-0.01em] text-[#1c1c1e]">
                      {title}
                    </div>
                    <p className="mt-1 text-[0.9rem] leading-[1.45] text-[#8e8e93]">
                      {description}
                    </p>
                  </div>
                  <ChevronRight
                    className={cn(
                      "size-5 shrink-0 transition-all duration-200",
                      isActive
                        ? "text-[#007AFF] translate-x-0"
                        : "text-[#c7c7cc] -translate-x-1 group-hover:translate-x-0 group-hover:text-[#8e8e93]",
                    )}
                  />
                </div>
                <div className="mt-3.5 ml-16">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium tracking-wide transition-colors duration-200",
                      isActive
                        ? "bg-[#007AFF]/10 text-[#007AFF]"
                        : "bg-[#f2f2f7] text-[#8e8e93] group-hover:bg-[#e5e5ea]",
                    )}
                  >
                    {helper}
                  </span>
                </div>
              </div>
            </button>
          );
        },
      )}
    </div>
  );
}

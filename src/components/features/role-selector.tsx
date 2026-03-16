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
  iconBg: string;
  iconBgActive: string;
  iconColor: string;
  accentBorder: string;
  accentBg: string;
  accentShadow: string;
  badgeBg: string;
  badgeText: string;
}> = [
  {
    value: "family",
    title: "Szukam opiekuna",
    description: "Znajdź zaufaną osobę do opieki nad bliskim seniorem.",
    helper: "Rozpocznij dopasowanie →",
    Icon: UserRoundSearch,
    iconBg: "bg-[#34C759]/8",
    iconBgActive: "bg-[#34C759]/15",
    iconColor: "text-[#34C759]",
    accentBorder: "border-[#34C759]/25",
    accentBg: "bg-[#34C759]/[0.03]",
    accentShadow: "shadow-[0_2px_12px_rgba(52,199,89,0.12)]",
    badgeBg: "bg-[#34C759]/10",
    badgeText: "text-[#34C759]",
  },
  {
    value: "caregiver",
    title: "Jestem opiekunem",
    description: "Odbieraj dopasowane zlecenia i buduj zaufany profil.",
    helper: "Przeglądaj zlecenia →",
    Icon: HeartHandshake,
    iconBg: "bg-[#FF9500]/8",
    iconBgActive: "bg-[#FF9500]/15",
    iconColor: "text-[#FF9500]",
    accentBorder: "border-[#FF9500]/25",
    accentBg: "bg-[#FF9500]/[0.03]",
    accentShadow: "shadow-[0_2px_12px_rgba(255,149,0,0.12)]",
    badgeBg: "bg-[#FF9500]/10",
    badgeText: "text-[#FF9500]",
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      {roleOptions.map(
        ({
          value: roleValue,
          title,
          description,
          helper,
          Icon,
          iconBg,
          iconBgActive,
          iconColor,
          accentBorder,
          accentBg,
          accentShadow,
          badgeBg,
          badgeText,
        }) => {
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
                    ? cn(accentBorder, accentBg, accentShadow)
                    : "border-black/6 bg-white group-hover:border-black/10 group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "grid size-12 shrink-0 place-items-center rounded-2xl transition-colors duration-200",
                      isActive
                        ? iconBgActive
                        : cn(iconBg, "group-hover:opacity-80"),
                    )}
                  >
                    <Icon className={cn("size-5.5", iconColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[17px] font-semibold tracking-[-0.41px] text-[#1c1c1e]">
                      {title}
                    </div>
                    <p className="mt-1 text-[15px] leading-[20px] text-[#6c6c70]">
                      {description}
                    </p>
                  </div>
                  <ChevronRight
                    className={cn(
                      "size-5 shrink-0 transition-all duration-200",
                      isActive
                        ? cn(iconColor, "translate-x-0")
                        : "text-[#c7c7cc] -translate-x-1 group-hover:translate-x-0 group-hover:text-[#8e8e93]",
                    )}
                  />
                </div>
                <div className="mt-3.5 ml-16">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold tracking-wide transition-colors duration-200",
                      isActive
                        ? cn(badgeBg, badgeText)
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

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
  Icon: typeof UserRoundSearch;
  iconColor: string;
}> = [
  {
    value: "family",
    title: "Szukam opiekuna",
    description: "Znajdź zaufaną osobę do opieki nad bliskim seniorem.",
    Icon: UserRoundSearch,
    iconColor: "text-[#34C759]",
  },
  {
    value: "caregiver",
    title: "Jestem opiekunem",
    description: "Odbieraj dopasowane zlecenia i buduj zaufany profil.",
    Icon: HeartHandshake,
    iconColor: "text-[#FF9500]",
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      {roleOptions.map(
        ({ value: roleValue, title, description, Icon, iconColor }) => {
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
                  "bg-white/40 backdrop-blur-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)]",
                  "group-active:scale-[0.97] group-active:bg-white/60",
                  isActive
                    ? "border-white/70 bg-white/55"
                    : "border-white/40 group-hover:border-white/60 group-hover:bg-white/50",
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/60">
                    <Icon className={cn("size-5.5", iconColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[17px] font-semibold tracking-[-0.41px] text-[#1c1c1e]">
                      {title}
                    </div>
                    <p className="mt-1 text-[15px] leading-5 text-[#3c3c43]/60">
                      {description}
                    </p>
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-[#c7c7cc] transition-transform duration-200 group-active:translate-x-0.5" />
                </div>
              </div>
            </button>
          );
        },
      )}
    </div>
  );
}

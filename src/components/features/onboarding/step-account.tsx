import { motion } from "motion/react";
import { Apple, Smartphone } from "lucide-react";
import type { OnboardingData } from "./onboarding-types";

const tapSpring = { type: "spring" as const, stiffness: 300, damping: 20 };

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09A6.97 6.97 0 0 1 5.47 12c0-.72.13-1.43.37-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
        fill="#EA4335"
      />
    </svg>
  );
}

interface AuthOption {
  id: OnboardingData["authMethod"];
  label: string;
  icon: React.ReactNode;
}

const authOptions: AuthOption[] = [
  {
    id: "apple",
    label: "Kontynuuj z Apple",
    icon: <Apple className="size-5" />,
  },
  {
    id: "google",
    label: "Kontynuuj z Google",
    icon: <GoogleIcon className="size-5" />,
  },
  {
    id: "phone",
    label: "Użyj numeru telefonu",
    icon: <Smartphone className="size-5" />,
  },
];

interface StepAccountProps {
  selected: OnboardingData["authMethod"];
  onChange: (method: OnboardingData["authMethod"]) => void;
}

export function StepAccount({ selected, onChange }: StepAccountProps) {
  return (
    <div className="space-y-3">
      {authOptions.map(({ id, label, icon }) => {
        const active = selected === id;
        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            whileTap={{ scale: 0.97, opacity: 0.7 }}
            transition={tapSpring}
            className={`flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
              active
                ? "border-[#FF9500]/40 bg-[#FF9500]/8"
                : "border-black/6 bg-white/50"
            }`}
          >
            <div
              className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                active
                  ? "bg-[#FF9500]/12 text-[#FF9500]"
                  : "bg-black/4 text-[#3c3c43]/60"
              }`}
            >
              {icon}
            </div>
            <span className="text-[15px] font-medium tracking-[-0.41px] text-[#1c1c1e]">
              {label}
            </span>
            {active && (
              <motion.div
                layoutId="auth-check"
                className="ml-auto size-5 rounded-full bg-[#FF9500]"
                initial={false}
                transition={tapSpring}
              >
                <svg viewBox="0 0 20 20" fill="none" className="size-5">
                  <path
                    d="M6 10.5l2.5 2.5L14 7.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

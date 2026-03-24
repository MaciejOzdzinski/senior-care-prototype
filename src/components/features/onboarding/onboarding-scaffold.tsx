import { type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 5;

interface OnboardingScaffoldProps {
  step: number;
  headline: string;
  supporting: string;
  children: ReactNode;
  ctaLabel: string;
  ctaDisabled?: boolean;
  onNext: () => void;
  onBack: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div
          key={i}
          className="h-[3px] flex-1 overflow-hidden rounded-full bg-black/6"
        >
          <motion.div
            className="h-full rounded-full bg-[#FF9500]"
            initial={{ width: 0 }}
            animate={{ width: i < step ? "100%" : "0%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      ))}
    </div>
  );
}

function StepHeader({
  headline,
  supporting,
}: {
  headline: string;
  supporting: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-[22px] font-semibold tracking-[0.37px] text-[#1c1c1e]">
        {headline}
      </h1>
      <p className="mt-2 text-[15px] leading-[20px] tracking-[-0.41px] text-[#3c3c43]/60">
        {supporting}
      </p>
    </div>
  );
}

export function OnboardingScaffold({
  step,
  headline,
  supporting,
  children,
  ctaLabel,
  ctaDisabled = false,
  onNext,
  onBack,
  secondaryLabel,
  onSecondary,
}: OnboardingScaffoldProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/60 px-4 pb-3 pt-[max(env(safe-area-inset-top),12px)] backdrop-blur-2xl">
        <div className="mb-3 flex items-center">
          <motion.button
            type="button"
            onClick={onBack}
            whileTap={{ scale: 0.97, opacity: 0.7 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="grid size-10 place-items-center rounded-full text-[#FF9500]"
            aria-label="Wróć"
          >
            <ArrowLeft className="size-5" />
          </motion.button>
          <span className="flex-1 text-center text-[13px] font-medium tracking-[-0.08px] text-[#8e8e93]">
            Krok {step} z {TOTAL_STEPS}
          </span>
          <div className="size-10" /> {/* spacer for centering */}
        </div>
        <ProgressBar step={step} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <StepHeader headline={headline} supporting={supporting} />
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-black/4 bg-white/80 px-6 pb-[max(env(safe-area-inset-bottom),16px)] pt-3 backdrop-blur-2xl">
        <motion.button
          type="button"
          onClick={ctaDisabled ? undefined : onNext}
          whileTap={ctaDisabled ? undefined : { scale: 0.97, opacity: 0.7 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cn(
            "inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-[17px] font-semibold transition-all duration-200",
            ctaDisabled
              ? "bg-[#FF9500]/40 text-white/60 shadow-none"
              : "bg-[#FF9500] text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-[#E88A00]",
          )}
        >
          {ctaLabel}
        </motion.button>
        {secondaryLabel && onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="mt-2.5 w-full text-center text-[15px] font-semibold tracking-[-0.41px] text-[#48484a] transition-colors active:text-[#1c1c1e]"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}

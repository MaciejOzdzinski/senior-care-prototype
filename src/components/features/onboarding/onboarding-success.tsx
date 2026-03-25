import { motion } from "motion/react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingSuccessProps {
  firstName: string;
  onContinue: () => void;
}

export function OnboardingSuccess({
  firstName,
  onContinue,
}: OnboardingSuccessProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="w-full max-w-sm text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 18,
            delay: 0.15,
          }}
          className="mx-auto mb-6 grid size-20 place-items-center rounded-full bg-[#34C759]/12"
        >
          <CheckCircle2 className="size-10 text-[#34C759]" />
        </motion.div>

        <h1 className="text-[22px] font-semibold tracking-[0.37px] text-[#1c1c1e]">
          {firstName ? `${firstName}, Twój profil` : "Twój profil"} jest gotowy!
        </h1>

        <p className="mx-auto mt-3 max-w-[280px] text-[15px] leading-[20px] tracking-[-0.41px] text-[#3c3c43]/60">
          Rodziny w Twojej okolicy już mogą Cię znaleźć. Wkrótce otrzymasz
          pierwsze zapytania.
        </p>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-8 flex items-center justify-center gap-2 rounded-xl bg-[#ece6e0] px-4 py-2.5 text-[14px] font-medium tracking-[-0.41px] text-[#FF9500]"
        >
          <Sparkles className="size-4" />
          Dopasowania pojawią się wkrótce
        </motion.div>

        {/* CTA */}
        <div className="mt-10">
          <Button
            size="lg"
            onClick={onContinue}
            className="w-full bg-[#FF9500] text-[17px] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-[#E88A00]"
          >
            Przejdź do panelu
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

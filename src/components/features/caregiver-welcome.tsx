import { motion } from "motion/react";
import { ArrowLeft, Clock, Sparkles, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

interface CaregiverWelcomeProps {
  onStart: () => void;
  onLogin: () => void;
  onBack: () => void;
}

const benefits = [
  { icon: Clock, text: "około 3 minuty" },
  { icon: Sparkles, text: "bez opłat na start" },
  { icon: CalendarCheck, text: "resztę danych dodasz później" },
];

export function CaregiverWelcome({
  onStart,
  onLogin,
  onBack,
}: CaregiverWelcomeProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      {/* Back button */}
      <div className="fixed left-4 top-[max(env(safe-area-inset-top),12px)] z-10">
        <motion.button
          type="button"
          onClick={onBack}
          whileTap={{ scale: 0.97, opacity: 0.7 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="grid size-10 place-items-center rounded-full bg-white/80 text-[#FF9500] shadow-[0_1px_4px_rgba(0,0,0,0.12)] backdrop-blur-sm"
          aria-label="Wróć"
        >
          <ArrowLeft className="size-5" />
        </motion.button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="w-full max-w-sm text-center"
      >
        {/* Logo */}
        <img
          src={logoSrc}
          alt="CareMatch"
          className="mx-auto mb-6 size-20 object-contain"
        />

        {/* Headline */}
        <h1 className="text-[22px] font-semibold tracking-[0.37px] text-[#1c1c1e]">
          Pomożemy Ci zacząć
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-3 max-w-[280px] text-[15px] leading-[20px] tracking-[-0.41px] text-[#3c3c43]/60">
          W kilku krokach przygotujesz profil i zaczniesz otrzymywać zapytania
          od rodzin.
        </p>

        {/* Benefits list */}
        <div className="mt-8 space-y-3">
          {benefits.map(({ icon: Icon, text }) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
                delay: 0.15,
              }}
              className="flex items-center gap-3 rounded-xl border border-black/4 bg-white/40 px-4 py-2.5 text-left backdrop-blur-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            >
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#FF9500]/10">
                <Icon className="size-[18px] text-[#FF9500]" />
              </div>
              <span className="text-[15px] font-medium tracking-[-0.41px] text-[#1c1c1e]">
                {text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Button
            size="lg"
            onClick={onStart}
            className="w-full bg-[#FF9500] text-[17px] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-[#E88A00]"
          >
            Zaczynam
          </Button>

          <button
            type="button"
            onClick={onLogin}
            className="mt-3 text-[15px] font-semibold tracking-[-0.41px] text-[#48484a] transition-colors active:text-[#1c1c1e]"
          >
            Mam już konto
          </button>
        </div>
      </motion.div>
    </div>
  );
}

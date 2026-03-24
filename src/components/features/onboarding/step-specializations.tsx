import { motion } from "motion/react";

const tapSpring = { type: "spring" as const, stiffness: 300, damping: 20 };

const specializations = [
  { id: "companion", label: "Towarzyszenie", emoji: "🤝" },
  { id: "hygiene", label: "Higiena", emoji: "🛁" },
  { id: "meds", label: "Leki", emoji: "💊" },
  { id: "shopping", label: "Zakupy", emoji: "🛒" },
  { id: "dementia", label: "Demencja", emoji: "🧠" },
  { id: "mobility", label: "Mobilność", emoji: "🦽" },
  { id: "cooking", label: "Gotowanie", emoji: "🍲" },
  { id: "cleaning", label: "Sprzątanie", emoji: "🧹" },
  { id: "night", label: "Opieka nocna", emoji: "🌙" },
  { id: "rehab", label: "Rehabilitacja", emoji: "💪" },
  { id: "transport", label: "Transport", emoji: "🚗" },
  { id: "palliative", label: "Opieka paliatywna", emoji: "🕊️" },
];

interface StepSpecializationsProps {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function StepSpecializations({
  selected,
  onChange,
}: StepSpecializationsProps) {
  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {specializations.map(({ id, label, emoji }) => {
        const active = selected.includes(id);
        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => toggle(id)}
            whileTap={{ scale: 0.95 }}
            transition={tapSpring}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[14px] font-medium tracking-[-0.41px] transition-colors ${
              active
                ? "border-[#FF9500]/40 bg-[#FF9500]/10 text-[#1c1c1e]"
                : "border-black/6 bg-white/50 text-[#3c3c43]/70"
            }`}
          >
            <span className="text-[16px]">{emoji}</span>
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}

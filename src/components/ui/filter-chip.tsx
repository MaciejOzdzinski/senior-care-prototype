import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97, opacity: 0.7 }}
      className={cn(
        "shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold shadow-sm backdrop-blur-md transition-colors duration-200",
        active
          ? "bg-[#007AFF] text-white shadow-[0_2px_8px_rgba(0,122,255,0.35)]"
          : "bg-white/80 text-[#1c1c1e]",
      )}
    >
      {label}
    </motion.button>
  );
}

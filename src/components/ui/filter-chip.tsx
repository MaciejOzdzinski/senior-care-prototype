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
        "shrink-0 rounded-full px-3 py-1 text-[12px] font-medium transition-colors duration-200",
        active ? "bg-[#007AFF] text-white" : "bg-[#e5e5ea] text-[#1c1c1e]/80",
      )}
    >
      {label}
    </motion.button>
  );
}

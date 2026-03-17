import type { HTMLAttributes } from "react";
import type { ComponentProps } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const cardSpring = { type: "spring" as const, stiffness: 300, damping: 20 };

export function GlassCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      whileHover={{ scale: 1.005, y: -2 }}
      whileTap={{ scale: 0.97, opacity: 0.85 }}
      transition={cardSpring}
      className={cn(
        "rounded-2xl border border-black/4 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]",
        className,
      )}
      {...(props as ComponentProps<typeof motion.div>)}
    />
  );
}

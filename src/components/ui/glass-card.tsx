import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/60 bg-white/50 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-2xl",
        className,
      )}
      {...props}
    />
  );
}

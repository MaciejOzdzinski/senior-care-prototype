import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/4 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]",
        className,
      )}
      {...props}
    />
  );
}

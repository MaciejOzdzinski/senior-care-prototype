import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[#f2f2f7] px-3 py-1 text-[12px] font-medium text-[#1c1c1e]/70",
        className,
      )}
      {...props}
    />
  );
}

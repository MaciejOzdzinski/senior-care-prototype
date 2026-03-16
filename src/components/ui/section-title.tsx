import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function SectionTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-[15px] font-semibold tracking-wide text-[#1c1c1e]",
        className,
      )}
      {...props}
    />
  );
}

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function SectionTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-[20px] font-semibold tracking-[0.38px] text-[#1c1c1e]",
        className,
      )}
      {...props}
    />
  );
}

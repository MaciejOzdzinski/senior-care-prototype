import type { ElementType } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface BottomNavTab {
  id: string;
  icon: ElementType;
  label: string;
  badge?: number;
}

interface BottomNavProps {
  tabs: BottomNavTab[];
  activeId: string;
  accentClass: string;
  className?: string;
  onTabChange?: (id: string) => void;
}

export const BottomNav = ({
  tabs,
  activeId,
  accentClass,
  className,
  onTabChange,
}: BottomNavProps) => (
  <nav
    className={cn(
      "border-t border-black/6 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 backdrop-blur-2xl",
      className,
    )}
  >
    <div className="flex">
      {tabs.map(({ id, icon: Icon, label, badge }) => {
        const isActive = id === activeId;
        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => onTabChange?.(id)}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative flex flex-1 flex-col items-center gap-0.5 py-1.5"
          >
            <div className="relative">
              <Icon
                className={cn(
                  "size-6 transition-colors duration-150",
                  isActive ? accentClass : "text-[#c7c7cc]",
                )}
                strokeWidth={isActive ? 2.2 : 1.6}
              />
              {badge != null && badge > 0 && (
                <span className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-[#FF3B30] text-[10px] font-bold leading-none text-white shadow-sm">
                  {badge}
                </span>
              )}
            </div>
            <span
              className={cn(
                "text-[10px] font-medium transition-colors duration-150",
                isActive ? accentClass : "text-[#c7c7cc]",
              )}
            >
              {label}
            </span>
          </motion.button>
        );
      })}
    </div>
  </nav>
);

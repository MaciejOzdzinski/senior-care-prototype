import { Tabs } from "@base-ui/react/tabs";
import { motion } from "motion/react";
import type { DiscoveryMode } from "@/types/domain";
import { cn } from "@/lib/utils";

interface DiscoverySwitcherProps {
  value: DiscoveryMode;
  onChange: (value: DiscoveryMode) => void;
}

export function DiscoverySwitcher({ value, onChange }: DiscoverySwitcherProps) {
  return (
    <Tabs.Root
      value={value}
      onValueChange={(next) => onChange(next as DiscoveryMode)}
    >
      <Tabs.List className="relative grid grid-cols-2 rounded-[10px] bg-black/[0.06] p-[3px]">
        <SwitcherTab value="cards" label="Karty" activeValue={value} />
        <SwitcherTab value="map" label="Mapa" activeValue={value} />
      </Tabs.List>
    </Tabs.Root>
  );
}

interface SwitcherTabProps {
  value: DiscoveryMode;
  label: string;
  activeValue: DiscoveryMode;
}

function SwitcherTab({ value, label, activeValue }: SwitcherTabProps) {
  const active = value === activeValue;

  return (
    <Tabs.Tab
      value={value}
      render={<motion.button whileTap={{ scale: 0.97, opacity: 0.7 }} />}
      className={cn(
        "inline-flex h-[32px] items-center justify-center rounded-[7px] px-4 text-[13px] font-semibold outline-none transition-colors duration-200",
        active
          ? "bg-white text-[#1c1c1e] shadow-[0_1px_4px_rgba(0,0,0,0.12),0_0.5px_1px_rgba(0,0,0,0.06)]"
          : "text-[#8e8e93]",
      )}
    >
      {label}
    </Tabs.Tab>
  );
}

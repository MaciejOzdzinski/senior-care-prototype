import { Tabs } from "@base-ui/react/tabs";
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
      <Tabs.List className="relative grid grid-cols-2 rounded-lg bg-black/[0.06] p-0.5">
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
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-md px-4 text-[13px] font-medium outline-none transition-all",
        active
          ? "bg-white text-[#1c1c1e] shadow-[0_0.5px_2px_rgba(0,0,0,0.12),0_0.5px_1px_rgba(0,0,0,0.08)]"
          : "text-[#8e8e93]",
      )}
    >
      {label}
    </Tabs.Tab>
  );
}

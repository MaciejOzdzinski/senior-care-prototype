import { Tabs } from "@base-ui/react/tabs";
import { LayoutPanelTop, Map } from "lucide-react";
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
      <Tabs.List className="grid grid-cols-2 gap-1 rounded-full bg-[#f2f2f7] p-1">
        <SwitcherTab
          value="cards"
          icon={LayoutPanelTop}
          label="Karty"
          activeValue={value}
        />
        <SwitcherTab value="map" icon={Map} label="Mapa" activeValue={value} />
      </Tabs.List>
    </Tabs.Root>
  );
}

interface SwitcherTabProps {
  value: DiscoveryMode;
  label: string;
  icon: typeof Map;
  activeValue: DiscoveryMode;
}

function SwitcherTab({
  value,
  label,
  icon: Icon,
  activeValue,
}: SwitcherTabProps) {
  const active = value === activeValue;

  return (
    <Tabs.Tab
      value={value}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-medium outline-none transition-all",
        active
          ? "bg-white text-[#1c1c1e] shadow-[0_1px_4px_rgba(0,0,0,0.1)]"
          : "text-[#8e8e93] hover:text-[#1c1c1e]",
      )}
    >
      <Icon className="size-4" />
      {label}
    </Tabs.Tab>
  );
}

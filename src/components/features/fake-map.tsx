import { caregivers, familyNeeds, mapCenter } from "@/data/mock-data";
import type { RoleMode } from "@/types/domain";
import { cn } from "@/lib/utils";

interface FakeMapProps {
  role: RoleMode;
  activeCaregiverId: string;
  onSelectCaregiver: (id: string) => void;
}

export function FakeMap({
  role,
  activeCaregiverId,
  onSelectCaregiver,
}: FakeMapProps) {
  return (
    <div className="relative h-64 overflow-hidden rounded-2xl border border-black/[0.06] bg-[#e8e4d8]">
      {/* Water body */}
      <div className="absolute right-[-10%] top-[-8%] h-[55%] w-[45%] rounded-bl-[60px] bg-[#aad3df]" />
      <div className="absolute right-[-5%] top-[30%] h-[25%] w-[20%] rounded-bl-[30px] bg-[#aad3df]" />

      {/* Parks / green areas */}
      <div className="absolute left-[8%] top-[12%] h-[28%] w-[22%] rounded-[12px] bg-[#c8e6a0]" />
      <div className="absolute bottom-[10%] left-[55%] h-[22%] w-[18%] rounded-[16px] bg-[#c8e6a0]/70" />
      <div className="absolute bottom-[25%] right-[28%] h-[14%] w-[10%] rounded-[8px] bg-[#d4edaa]/60" />

      {/* Street grid — horizontal */}
      <div className="absolute left-0 top-[26%] h-[3px] w-full bg-white/90" />
      <div className="absolute left-0 top-[52%] h-[2px] w-full bg-white/70" />
      <div className="absolute left-0 top-[74%] h-[3px] w-full bg-white/90" />
      <div className="absolute left-[5%] top-[40%] h-[2px] w-[55%] rotate-[-8deg] bg-white/50" />

      {/* Street grid — vertical */}
      <div className="absolute left-[35%] top-0 h-full w-[3px] bg-white/90" />
      <div className="absolute left-[58%] top-0 h-full w-[2px] bg-white/70" />
      <div className="absolute left-[18%] top-[10%] h-[80%] w-[2px] bg-white/60" />
      <div className="absolute left-[78%] top-[20%] h-[60%] w-[2px] bg-white/50" />

      {/* Building blocks */}
      <div className="absolute left-[20%] top-[28%] h-[22%] w-[14%] rounded-[3px] bg-[#ddd8cd]" />
      <div className="absolute left-[37%] top-[54%] h-[18%] w-[20%] rounded-[3px] bg-[#ddd8cd]" />
      <div className="absolute left-[60%] top-[55%] h-[16%] w-[12%] rounded-[3px] bg-[#ddd8cd]" />
      <div className="absolute left-[5%] top-[55%] h-[16%] w-[12%] rounded-[3px] bg-[#ddd8cd]" />
      <div className="absolute left-[40%] top-[8%] h-[16%] w-[14%] rounded-[3px] bg-[#ddd8cd]" />

      {/* District label */}
      <div className="absolute left-3 top-3 z-10 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#1c1c1e] shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
        {mapCenter.district}
      </div>

      {/* User location — blue pulsing dot (Apple Maps style) */}
      <div className="absolute left-[44%] top-[38%] z-10 grid size-5 place-items-center">
        <div className="absolute size-5 rounded-full bg-[#007AFF]/20 animate-pulse-blue" />
        <div className="size-3 rounded-full border-2 border-white bg-[#007AFF] shadow-[0_1px_4px_rgba(0,122,255,0.4)]" />
      </div>

      {/* Caregiver pins */}
      {caregivers.map((caregiver, index) => {
        const positions = [
          "left-[28%] top-[28%]",
          "left-[64%] top-[22%]",
          "left-[58%] top-[62%]",
        ];
        const isActive = caregiver.id === activeCaregiverId;
        return (
          <button
            key={caregiver.id}
            type="button"
            aria-label={`Wybierz ${caregiver.name}`}
            onClick={() => onSelectCaregiver(caregiver.id)}
            className={cn(
              "absolute z-10 grid size-10 place-items-center rounded-full border-2 border-white bg-[#007AFF] text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-200",
              positions[index],
              isActive
                ? "scale-115 shadow-[0_4px_16px_rgba(0,122,255,0.45)] ring-3 ring-[#007AFF]/25"
                : "hover:scale-105",
            )}
          >
            <span className="text-[13px] font-bold">{caregiver.name[0]}</span>
          </button>
        );
      })}

      {/* Family need markers (caregiver mode) */}
      {role === "caregiver"
        ? familyNeeds.map((need, index) => {
            const positions = ["left-[37%] top-[18%]", "left-[71%] top-[50%]"];
            return (
              <div
                key={need.id}
                className={cn(
                  "absolute z-10 rounded-lg border border-[#FF9500]/30 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#FF9500] shadow-[0_1px_4px_rgba(0,0,0,0.1)]",
                  positions[index],
                )}
              >
                {need.district}
              </div>
            );
          })
        : null}
    </div>
  );
}

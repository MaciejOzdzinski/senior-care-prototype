import { useRef, useCallback } from "react";
import { motion, useAnimation } from "motion/react";
import {
  BadgeCheck,
  Briefcase,
  ChevronUp,
  Clock,
  MapPin,
  Star,
} from "lucide-react";
import type { CaregiverProfile } from "@/types/domain";
import { cn } from "@/lib/utils";

export type SheetState = "collapsed" | "half" | "expanded";

interface MapBottomSheetProps {
  caregiver: CaregiverProfile;
  sheetState: SheetState;
  onSheetStateChange: (state: SheetState) => void;
  onContact: () => void;
  onSave: () => void;
  onViewProfile: () => void;
  contentHeight: number;
}

const SNAP_FRACTIONS: Record<SheetState, number> = {
  collapsed: 0.2,
  half: 0.38,
  expanded: 0.72,
};

function getSnapHeight(state: SheetState, contentH: number) {
  return Math.round(contentH * SNAP_FRACTIONS[state]);
}

export function MapBottomSheet({
  caregiver,
  sheetState,
  onSheetStateChange,
  onContact,
  onSave,
  onViewProfile,
  contentHeight,
}: MapBottomSheetProps) {
  const controls = useAnimation();
  const dragStartY = useRef(0);
  const currentH = getSnapHeight(sheetState, contentHeight);

  const animateTo = useCallback(
    (state: SheetState) => {
      const h = getSnapHeight(state, contentHeight);
      controls.start({
        height: h,
        transition: { type: "spring", stiffness: 350, damping: 32 },
      });
      onSheetStateChange(state);
    },
    [contentHeight, controls, onSheetStateChange],
  );

  const ordered: SheetState[] = ["collapsed", "half", "expanded"];

  const handleDragEnd = (_: unknown, info: { offset: { y: number } }) => {
    const dy = info.offset.y;
    const threshold = 40;
    const idx = ordered.indexOf(sheetState);

    if (dy < -threshold && idx < ordered.length - 1) {
      animateTo(ordered[idx + 1]);
    } else if (dy > threshold && idx > 0) {
      animateTo(ordered[idx - 1]);
    } else {
      animateTo(sheetState);
    }
  };

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[20px] bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.12)]"
      animate={controls}
      initial={{ height: currentH }}
      style={{ height: currentH }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragStart={(_, info) => {
        dragStartY.current = info.point.y;
      }}
      onDragEnd={handleDragEnd}
    >
      {/* Drag handle */}
      <div className="flex shrink-0 justify-center pb-2 pt-2.5">
        <div className="h-[5px] w-9 rounded-full bg-[#c7c7cc]" />
      </div>

      {/* Content — scrollable only when expanded */}
      <div
        className={cn(
          "flex-1 min-h-0 px-5",
          sheetState === "expanded"
            ? "overflow-y-auto overscroll-contain"
            : "overflow-hidden",
        )}
      >
        {/* ── Collapsed: identification ── */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={caregiver.avatarUrl}
              alt={caregiver.name}
              className="size-12 rounded-full object-cover ring-2 ring-black/5"
            />
            {caregiver.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#34C759] ring-2 ring-white">
                <BadgeCheck className="size-2.5 text-white" strokeWidth={2.5} />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[17px] font-semibold tracking-[-0.41px] text-[#1c1c1e]">
              {caregiver.name}
            </h2>
            <div className="flex items-center gap-1.5 text-[13px] text-[#8e8e93]">
              <span>{caregiver.distanceKm.toFixed(1)} km</span>
              <span className="text-[#8e8e93]/40">·</span>
              <Star className="size-3 text-[#FF9500]" fill="currentColor" />
              <span className="font-medium text-[#1c1c1e]">
                {caregiver.rating}
              </span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-[20px] font-bold tracking-tight text-[#34C759]">
              {caregiver.hourlyRate} zł
            </span>
            <p className="text-[11px] text-[#8e8e93]">/godz.</p>
          </div>
        </div>

        {/* ── Half-open: evaluation ── */}
        {(sheetState === "half" || sheetState === "expanded") && (
          <div className="mt-3 space-y-3">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {caregiver.specializations.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-[#34C759]/10 px-2.5 py-1 text-[13px] font-medium text-[#34C759]"
                >
                  {tag.label}
                </span>
              ))}
            </div>

            {/* Experience + Availability */}
            <div className="flex items-center gap-4 text-[13px] text-[#3c3c43]">
              <span className="flex items-center gap-1.5">
                <Briefcase className="size-3.5 text-[#8e8e93]" />
                {caregiver.yearsExperience} lat doświadczenia
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-[#8e8e93]" />
                {caregiver.availableLabel}
              </span>
            </div>

            {/* Match bar */}
            <div className="h-9 w-full overflow-hidden rounded-xl bg-[#007AFF]/8">
              <div
                className="flex h-full items-center px-3"
                style={{
                  width: `${caregiver.compatibility}%`,
                  backgroundColor: "rgba(0, 122, 255, 0.12)",
                }}
              >
                <p className="whitespace-nowrap text-[12px] font-medium text-[#007AFF]">
                  {caregiver.compatibility}% dopasowania
                </p>
              </div>
            </div>

            {/* CTA row — HIG 3-tier */}
            <div className="flex items-center justify-center gap-4 pb-1">
              <button
                type="button"
                className="px-4 py-2.5 text-[15px] font-medium text-[#8e8e93] transition-opacity active:opacity-50"
              >
                Pomiń
              </button>
              <button
                type="button"
                onClick={onContact}
                className="rounded-full bg-[#007AFF] px-6 py-2.5 text-[15px] font-semibold text-white shadow-[0_2px_10px_rgba(0,122,255,0.35)] transition-transform active:scale-95"
              >
                Napisz
              </button>
              <button
                type="button"
                onClick={onSave}
                className="rounded-full bg-[#007AFF]/10 px-5 py-2.5 text-[15px] font-semibold text-[#007AFF] transition-transform active:scale-95"
              >
                Zapisz
              </button>
            </div>
          </div>
        )}

        {/* ── Expanded: decision ── */}
        {sheetState === "expanded" && (
          <div className="mt-4 space-y-5 pb-6">
            {/* All tags */}
            {caregiver.specializations.length > 3 && (
              <div className="flex flex-wrap gap-1.5">
                {caregiver.specializations.slice(3).map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-[#34C759]/10 px-2.5 py-1 text-[13px] font-medium text-[#34C759]"
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <StatCell
                icon={<MapPin className="size-4 text-[#007AFF]" />}
                value={`${caregiver.distanceKm.toFixed(1)} km`}
                label="Odległość"
              />
              <StatCell
                icon={<Briefcase className="size-4 text-[#FF9500]" />}
                value={`${caregiver.yearsExperience} lat`}
                label="Doświadczenie"
              />
              <StatCell
                icon={<Star className="size-4 text-[#FF9500]" />}
                value={`${caregiver.compatibility}%`}
                label="Dopasowanie"
              />
            </div>

            {/* Why match */}
            {caregiver.whyMatch.length > 0 && (
              <section>
                <h4 className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-[#8e8e93]">
                  Dlaczego to dopasowanie?
                </h4>
                <ul className="space-y-2">
                  {caregiver.whyMatch.map((reason, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-[15px] leading-[22px] text-[#3c3c43]"
                    >
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#007AFF]/10 text-[11px] font-bold text-[#007AFF]">
                        {i + 1}
                      </span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* View full profile link */}
            <button
              type="button"
              onClick={onViewProfile}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#f2f2f7] py-3 text-[15px] font-semibold text-[#007AFF] transition-transform active:scale-[0.98]"
            >
              <ChevronUp className="size-4" />
              Zobacz pełny profil
            </button>
          </div>
        )}

        {/* Collapsed-only: tap hint */}
        {sheetState === "collapsed" && (
          <div className="mt-2 flex items-center justify-center">
            <span className="text-[12px] text-[#8e8e93]">
              Przesuń w górę, aby zobaczyć więcej
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function StatCell({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-[#f2f2f7] px-3 py-3">
      {icon}
      <span className="text-[17px] font-bold text-[#1c1c1e]">{value}</span>
      <span className="text-[11px] text-[#8e8e93]">{label}</span>
    </div>
  );
}

import { motion } from "motion/react";
import { BadgeCheck, Briefcase, Clock, Star } from "lucide-react";
import type { CaregiverProfile } from "@/types/domain";

interface MapBottomSheetProps {
  caregiver: CaregiverProfile;
  onViewProfile: () => void;
}

export const MapBottomSheet = ({
  caregiver,
  onViewProfile,
}: MapBottomSheetProps) => {
  const handleDragEnd = (_: unknown, info: { offset: { y: number } }) => {
    if (info.offset.y < -40) onViewProfile();
  };

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-20 touch-none rounded-t-[20px] bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.12)] after:absolute after:inset-x-0 after:top-[calc(100%-1px)] after:h-[200px] after:bg-white"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.25}
      onDragEnd={handleDragEnd}
    >
      {/* Grabber */}
      <div className="flex shrink-0 justify-center pb-2 pt-2.5">
        <div className="h-[5px] w-9 rounded-full bg-[#c7c7cc]" />
      </div>

      {/* Content — tap opens full ProfileDrawer */}
      <button
        type="button"
        onClick={onViewProfile}
        className="flex w-full flex-col gap-2.5 px-5 pb-4 text-left"
      >
        {/* Top row: avatar + name/stats + price */}
        <div className="flex w-full items-center gap-3">
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

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {caregiver.specializations.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-[#7676801f] px-2.5 py-1 text-[13px] font-medium text-[#636366]"
            >
              {tag.label}
            </span>
          ))}
        </div>

        {/* Experience + Availability */}
        <div className="flex items-center gap-4 text-[13px] text-[#8e8e93]">
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="size-3.5" />
            {caregiver.yearsExperience} lat doświadczenia
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
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
      </button>
    </motion.div>
  );
};

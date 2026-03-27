import { BadgeCheck, Briefcase, Clock, Star } from "lucide-react";
import type { CaregiverProfile } from "@/types/domain";

interface ProfileCardProps {
  caregiver: CaregiverProfile;
}

export function ProfileCard({ caregiver }: ProfileCardProps) {
  return (
    <>
      {/* Header: avatar + info + price */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img
            src={caregiver.avatarUrl}
            alt={caregiver.name}
            className="size-14 rounded-full object-cover ring-2 ring-black/5"
          />
          {caregiver.verified && (
            <div className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-[#34C759] ring-2 ring-white">
              <BadgeCheck className="size-3 text-white" strokeWidth={2.5} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-[18px] font-semibold tracking-tight text-[#1c1c1e]">
              {caregiver.name}
            </h2>
            <div className="size-2 shrink-0 rounded-full bg-[#34C759]" />
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[#8e8e93]">
            <span>{caregiver.age} lat</span>
            <span className="text-[#8e8e93]/40">·</span>
            <span>{caregiver.distanceKm.toFixed(1)} km</span>
            <span className="text-[#8e8e93]/40">·</span>
            <Star className="size-3 text-[#FF9500]" fill="currentColor" />
            <span className="font-medium text-[#1c1c1e]">
              {caregiver.rating}
            </span>
            <span>({caregiver.reviews})</span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-[20px] font-bold tracking-tight text-[#34C759]">
            {caregiver.hourlyRate} zł
          </span>
          <p className="text-[11px] text-[#8e8e93]">/godzinę</p>
        </div>
      </div>

      {/* Specialization tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {caregiver.specializations.map((tag) => (
          <span
            key={tag.id}
            className="rounded-full bg-[#7676801f] px-2.5 py-1 text-[13px] font-medium text-[#636366]"
          >
            {tag.label}
          </span>
        ))}
      </div>

      {/* Experience + Availability — single line */}
      <div className="mt-3 flex items-center gap-4 text-[13px] text-[#3c3c43]">
        <span className="flex items-center gap-1.5">
          <Briefcase className="size-3.5 text-[#8e8e93]" />
          {caregiver.yearsExperience} lat doświadczenia
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5 text-[#8e8e93]" />
          {caregiver.availableLabel}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1 min-h-2" />

      {/* Match percentage bar */}
      <div className="relative mb-2">
        <div className="h-9 w-full overflow-hidden rounded-xl bg-[#007AFF]/8">
          <div
            className="flex h-full items-center px-3 transition-all duration-500"
            style={{
              width: `${caregiver.compatibility}%`,
              backgroundColor: "rgba(0, 122, 255, 0.12)",
            }}
          >
            <p className="whitespace-nowrap text-[12px] font-medium text-[#007AFF]">
              {caregiver.compatibility}% dopasowania — blisko seniora,{" "}
              {caregiver.distanceKm.toFixed(1)} km
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

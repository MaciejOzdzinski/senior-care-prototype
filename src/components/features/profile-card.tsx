import { BadgeCheck, Briefcase, Clock, MapPin, Star } from "lucide-react";
import type { CaregiverProfile } from "@/types/domain";

interface ProfileCardProps {
  caregiver: CaregiverProfile;
}

export function ProfileCard({ caregiver }: ProfileCardProps) {
  return (
    <>
      {/* Header: avatar + info + price */}
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={caregiver.avatarUrl}
            alt={caregiver.name}
            className="size-[72px] rounded-full object-cover ring-2 ring-black/5"
          />
          {caregiver.verified && (
            <div className="absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full bg-[#34C759] ring-2 ring-white">
              <BadgeCheck className="size-3.5 text-white" strokeWidth={2.5} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-[20px] font-semibold tracking-tight text-[#1c1c1e]">
              {caregiver.name}
            </h2>
            <div className="size-2 shrink-0 rounded-full bg-[#34C759]" />
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[13px] text-[#8e8e93]">
            <span>{caregiver.age} lat</span>
            <span className="text-[#8e8e93]/40">·</span>
            <MapPin className="size-3" />
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
          <span className="text-[22px] font-bold tracking-tight text-[#34C759]">
            {caregiver.hourlyRate} zł
          </span>
          <p className="mt-0.5 text-[11px] text-[#8e8e93]">/godzinę</p>
        </div>
      </div>

      {/* Specialization tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        {caregiver.specializations.map((tag) => (
          <span
            key={tag.id}
            className="rounded-full bg-[#34C759]/10 px-3 py-1.5 text-[13px] font-medium text-[#34C759]"
          >
            {tag.label}
          </span>
        ))}
      </div>

      {/* Experience + Availability */}
      <div className="mt-5 flex flex-col gap-3">
        <div className="flex items-center gap-2.5 text-[14px] text-[#3c3c43]">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#f2f2f7]">
            <Briefcase className="size-4 text-[#8e8e93]" />
          </div>
          <span>{caregiver.yearsExperience} lat doświadczenia</span>
        </div>
        <div className="flex items-center gap-2.5 text-[14px] text-[#3c3c43]">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#f2f2f7]">
            <Clock className="size-4 text-[#8e8e93]" />
          </div>
          <span>{caregiver.availableLabel}</span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Match percentage bar */}
      <div className="relative">
        <div className="h-11 w-full overflow-hidden rounded-2xl bg-[#34C759]/8">
          <div
            className="flex h-full items-center px-4 transition-all duration-500"
            style={{
              width: `${caregiver.compatibility}%`,
              backgroundColor: "rgba(52, 199, 89, 0.15)",
            }}
          >
            <p className="whitespace-nowrap text-[13px] font-medium text-[#34C759]">
              {caregiver.compatibility}% dopasowania — blisko seniora,{" "}
              {caregiver.distanceKm.toFixed(1)} km
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

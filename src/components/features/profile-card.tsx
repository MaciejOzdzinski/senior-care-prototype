import {
  Bookmark,
  Briefcase,
  Clock,
  Heart,
  Shield,
  Star,
  X,
} from "lucide-react";
import type { CaregiverProfile } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

interface ProfileCardProps {
  caregiver: CaregiverProfile;
  onSkip: () => void;
  onSave: () => void;
  onContact: () => void;
  onTapCard?: () => void;
}

export function ProfileCard({
  caregiver,
  onSkip,
  onSave,
  onContact,
  onTapCard,
}: ProfileCardProps) {
  return (
    <GlassCard className="relative h-[360px] overflow-hidden p-4">
      <div
        role="button"
        tabIndex={0}
        onClick={onTapCard}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onTapCard?.();
        }}
        className="flex h-full flex-col gap-3 cursor-pointer"
      >
        {/* Top row: avatar + info + price */}
        <div className="flex items-start gap-3">
          <img
            src={caregiver.avatarUrl}
            alt={caregiver.name}
            className="size-14 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-[17px] font-bold tracking-[-0.41px] text-[#1c1c1e]">
                {caregiver.name}
              </h3>
              {caregiver.verified && (
                <Shield className="size-4 shrink-0 fill-[#34C759] text-white" />
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[#8e8e93]">
              <span>{caregiver.age} lat</span>
              <span>·</span>
              <span>{caregiver.distanceKm.toFixed(1)} km</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Star className="size-3 fill-[#FF9500] text-[#FF9500]" />
                <span className="font-medium text-[#1c1c1e]">
                  {caregiver.rating}
                </span>
                <span>({caregiver.reviews})</span>
              </span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-[20px] font-bold tracking-tight text-[#34C759]">
              {caregiver.hourlyRate} zł
            </div>
            <div className="text-[11px] text-[#8e8e93]">/godzinę</div>
          </div>
        </div>

        {/* Specialization tags */}
        <div className="flex flex-wrap gap-1.5">
          {caregiver.specializations.map((tag, i) => (
            <span
              key={tag.id}
              className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
                i < 2
                  ? "bg-[#34C759]/12 text-[#34C759]"
                  : "bg-[#e5e5ea] text-[#3c3c43]"
              }`}
            >
              {tag.label}
            </span>
          ))}
        </div>

        {/* Experience + Availability */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#3c3c43]">
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="size-3.5 text-[#8e8e93]" />
            {caregiver.yearsExperience} lat doświadczenia
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-[#8e8e93]" />
            {caregiver.availableLabel}
          </span>
        </div>

        {/* Compatibility banner */}
        <div className="mt-auto truncate rounded-xl bg-[#007AFF]/8 px-3 py-2 text-[13px] font-medium text-[#007AFF]">
          {caregiver.compatibility}% dopasowania —{" "}
          {caregiver.whyMatch[0]?.toLowerCase().replace(/\.$/, "")}
        </div>

        {/* Action buttons */}
        {/* Stop propagation so these buttons don't trigger onTapCard */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className="grid grid-cols-3 gap-2 pt-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="destructive" onClick={onSkip}>
            <X className="size-4" /> Pomiń
          </Button>
          <Button variant="secondary" onClick={onSave}>
            <Bookmark className="size-4" /> Zapisz
          </Button>
          <Button onClick={onContact}>
            <Heart className="size-4" /> Kontakt
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

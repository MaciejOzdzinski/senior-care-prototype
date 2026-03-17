import { ArrowRight, Bookmark, Heart, Info, Star, X } from "lucide-react";
import { motion } from "motion/react";
import type { CaregiverProfile } from "@/types/domain";
import { formatCompatibility } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

interface ProfileCardProps {
  caregiver: CaregiverProfile;
  onSkip: () => void;
  onSave: () => void;
  onContact: () => void;
}

export function ProfileCard({
  caregiver,
  onSkip,
  onSave,
  onContact,
}: ProfileCardProps) {
  return (
    <GlassCard className="relative overflow-hidden p-4 md:p-5">
      <div className="relative flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`grid size-18 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${caregiver.avatarGradient}`}
          >
            <span className="text-2xl font-semibold tracking-tight text-slate-700">
              {caregiver.name[0]}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[22px] font-bold tracking-[0.35px] text-[#1c1c1e]">
                {caregiver.name}
              </h3>
              {caregiver.verified ? (
                <Badge className="bg-[#34C759]/12 text-[#34C759]">
                  Zweryfikowana
                </Badge>
              ) : null}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] leading-[18px] text-[#8e8e93]">
              <span>{caregiver.age} lat</span>
              <span>•</span>
              <span>{caregiver.distanceKm.toFixed(1)} km</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Star className="size-3.5 fill-[#FF9500] text-[#FF9500]" />{" "}
                {caregiver.rating} ({caregiver.reviews})
              </span>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#007AFF]/10 px-3 py-1 text-[12px] font-medium text-[#007AFF]">
              {formatCompatibility(caregiver.compatibility)}
              <Info className="size-3.5 opacity-60" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {caregiver.specializations.map((tag) => (
            <Badge key={tag.id}>{tag.label}</Badge>
          ))}
        </div>

        <div className="grid gap-3 rounded-xl bg-[#f2f2f7] p-4 md:grid-cols-3">
          <Metric label="Dostępność" value={caregiver.availableLabel} />
          <Metric
            label="Doświadczenie"
            value={`${caregiver.yearsExperience} lat`}
          />
          <Metric label="Stawka" value={`${caregiver.hourlyRate} zł / h`} />
        </div>

        <div className="space-y-3 rounded-xl bg-[#f2f2f7] p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8e8e93]">
            Dlaczego pasuje
          </div>
          <ul className="space-y-2">
            {caregiver.whyMatch.map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-3 text-[15px] leading-[20px] text-[#3c3c43]"
              >
                <div className="mt-1.5 size-2 rounded-full bg-[#34C759]" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-1">
          <Button variant="destructive" size="lg" onClick={onSkip}>
            <X className="size-4" /> Pomiń
          </Button>
          <Button variant="secondary" size="lg" onClick={onSave}>
            <Bookmark className="size-4" /> Zapisz
          </Button>
          <Button size="lg" onClick={onContact}>
            <Heart className="size-4" /> Kontakt
          </Button>
        </div>

        <motion.button
          whileTap={{ scale: 0.97, opacity: 0.7 }}
          className="inline-flex items-center gap-2 self-start text-[15px] font-medium text-[#007AFF]"
        >
          Zobacz pełny profil
          <ArrowRight className="size-4" />
        </motion.button>
      </div>
    </GlassCard>
  );
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] uppercase tracking-[0.06em] text-[#8e8e93]">
        {label}
      </div>
      <div className="text-[15px] font-medium leading-[20px] text-[#1c1c1e]">
        {value}
      </div>
    </div>
  );
}

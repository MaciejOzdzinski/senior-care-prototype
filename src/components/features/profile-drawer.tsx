import { Drawer } from "vaul";
import {
  Bookmark,
  Briefcase,
  Clock,
  Heart,
  MapPin,
  Shield,
  Star,
} from "lucide-react";
import type { CaregiverProfile } from "@/types/domain";
import { Button } from "@/components/ui/button";

interface ProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caregiver: CaregiverProfile;
  onContact: () => void;
  onSave: () => void;
}

export function ProfileDrawer({
  open,
  onOpenChange,
  caregiver,
  onContact,
  onSave,
}: ProfileDrawerProps) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[0.6, 1]}
      fadeFromIndex={0}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/30" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[96dvh] flex-col rounded-t-[20px] bg-white outline-none">
          {/* Grabber — iOS handle */}
          <div className="mx-auto mt-2.5 mb-0 h-[5px] w-9 shrink-0 rounded-full bg-[#c7c7cc]" />

          <Drawer.Title className="sr-only">
            Profil — {caregiver.name}
          </Drawer.Title>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-[max(env(safe-area-inset-bottom),20px)]">
            {/* Header — avatar + key info */}
            <div className="flex items-start gap-4">
              <img
                src={caregiver.avatarUrl}
                alt={caregiver.name}
                className="size-20 shrink-0 rounded-full object-cover ring-2 ring-white shadow-md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-[22px] font-bold tracking-[-0.26px] text-[#1c1c1e]">
                    {caregiver.name}
                  </h3>
                  {caregiver.verified && (
                    <Shield className="size-5 shrink-0 fill-[#34C759] text-white" />
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[15px] text-[#8e8e93]">
                  <span>{caregiver.age} lat</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3.5 fill-[#FF9500] text-[#FF9500]" />
                    <span className="font-semibold text-[#1c1c1e]">
                      {caregiver.rating}
                    </span>
                    <span>({caregiver.reviews} opinii)</span>
                  </span>
                </div>
                <div className="mt-2 text-[28px] font-bold tracking-tight text-[#34C759]">
                  {caregiver.hourlyRate} zł
                  <span className="text-[15px] font-normal text-[#8e8e93]">
                    {" "}
                    / godzinę
                  </span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-5 grid grid-cols-3 gap-3">
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

            {/* Availability */}
            <div className="mt-5 flex items-center gap-2.5 rounded-2xl bg-[#f2f2f7] px-4 py-3">
              <Clock className="size-4.5 shrink-0 text-[#8e8e93]" />
              <span className="text-[15px] text-[#1c1c1e]">
                {caregiver.availableLabel}
              </span>
            </div>

            {/* Specializations */}
            <section className="mt-6">
              <h4 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#8e8e93]">
                Specjalizacje
              </h4>
              <div className="flex flex-wrap gap-2">
                {caregiver.specializations.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-[#34C759]/12 px-3.5 py-1.5 text-[13px] font-semibold text-[#34C759]"
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </section>

            {/* Why match */}
            <section className="mt-6">
              <h4 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#8e8e93]">
                Dlaczego to dopasowanie?
              </h4>
              <ul className="space-y-2.5">
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

            {/* CTA buttons */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <Button size="lg" variant="secondary" onClick={onSave}>
                <Bookmark className="size-4" /> Zapisz
              </Button>
              <Button size="lg" onClick={onContact}>
                <Heart className="size-4" /> Kontakt
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
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

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  Bookmark,
  Briefcase,
  Clock,
  Filter,
  Heart,
  House,
  MessageCircleMore,
  Star,
  UserRound,
  Users,
} from "lucide-react";
import { caregivers, mapCenter } from "@/data/mock-data";
import { DiscoverySwitcher } from "@/components/features/discovery-switcher";
import { FakeMap } from "@/components/features/fake-map";
import { FilterBar } from "@/components/features/filter-bar";
import { MapBottomSheet } from "@/components/features/map-bottom-sheet";
import { ProfileDrawer } from "@/components/features/profile-drawer";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassDialog } from "@/components/ui/dialog";
import type { DiscoveryMode } from "@/types/domain";

interface FamilyDiscoveryProps {
  onBack: () => void;
}

export function FamilyDiscovery({ onBack }: FamilyDiscoveryProps) {
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>("profile");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const savedCaregivers = useMemo(
    () => caregivers.filter((c) => savedIds.has(c.id)),
    [savedIds],
  );

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredCaregivers = useMemo(
    () =>
      activeFilters.size === 0
        ? caregivers
        : caregivers.filter((c) =>
            [...activeFilters].every((id) =>
              c.specializations.some((s) => s.id === id),
            ),
          ),
    [activeFilters],
  );

  const [deck, setDeck] = useState(filteredCaregivers);

  useEffect(() => {
    setDeck(filteredCaregivers);
  }, [filteredCaregivers]);

  const topCard = deck[deck.length - 1] ?? null;
  const activeCaregiver = topCard ?? caregivers[0];

  return (
    <>
      {discoveryMode === "map" ? (
        /* ─── MAP MODE: fullscreen map + bottom sheet ─── */
        <div className="fixed inset-0 flex flex-col bg-[#f4f4f8]">
          {/* Top bar — floating over map */}
          <div className="relative z-20 flex items-center gap-3 bg-[#eeeef2]/72 px-4 pb-2 pt-[max(env(safe-area-inset-top),12px)] shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-2xl">
            <motion.button
              type="button"
              onClick={onBack}
              whileTap={{ scale: 0.97, opacity: 0.7 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white/80 text-[#007AFF] shadow-[0_1px_4px_rgba(0,0,0,0.12)] backdrop-blur-sm"
              aria-label="Wróć do wyboru trybu"
            >
              <ArrowLeft className="size-5" />
            </motion.button>
            <h1 className="min-w-0 flex-1 truncate text-[17px] font-semibold tracking-[-0.41px] text-[#1c1c1e]">
              {mapCenter.district}
            </h1>
            <div className="flex shrink-0 items-center gap-2">
              <IconBubble icon={Bell} label="Powiadomienia" />
              <IconBubble icon={Filter} label="Filtry" />
            </div>
          </div>

          {/* Segmented control — floating */}
          <div className="relative z-20 flex justify-center bg-[#eeeef2]/72 pb-2 backdrop-blur-2xl">
            <DiscoverySwitcher
              value={discoveryMode}
              onChange={setDiscoveryMode}
            />
          </div>

          {/* Map + bottom sheet content area */}
          <div className="relative min-h-0 flex-1">
            {/* Fullscreen map background */}
            <FakeMap
              role="family"
              activeCaregiverId={activeCaregiver.id}
              filteredCaregivers={filteredCaregivers}
              fullscreen
              onMapClick={() => {}}
              onSelectCaregiver={(id) => {
                setDeck((prev) => {
                  const idx = prev.findIndex((p) => p.id === id);
                  if (idx < 0 || idx === prev.length - 1) return prev;
                  const next = [...prev];
                  const [item] = next.splice(idx, 1);
                  next.push(item);
                  return next;
                });
              }}
            />

            {/* Filter chips — floating on map */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-4 pt-3">
              <FilterBar
                activeFilters={activeFilters}
                onToggle={toggleFilter}
                className="pointer-events-auto"
              />
            </div>

            {/* Bottom sheet */}
            <MapBottomSheet
              caregiver={activeCaregiver}
              onViewProfile={() => setDrawerOpen(true)}
            />
          </div>

          {/* Bottom navigation */}
          <nav className="relative z-20 grid grid-cols-4 border-t border-black/6 bg-[#eeeef2]/72 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-1px_0_rgba(0,0,0,0.04)] backdrop-blur-2xl">
            <BottomNavItem icon={House} label="Główna" active />
            <BottomNavItem icon={Users} label="Odkrywaj" />
            <BottomNavItem
              icon={MessageCircleMore}
              label="Wiadomości"
              badgeCount={3}
            />
            <BottomNavItem icon={UserRound} label="Profil" />
          </nav>
        </div>
      ) : (
        /* ─── PROFILE / SAVED MODE ─── */
        <div className="fixed inset-0 flex flex-col bg-[#f4f4f8]">
          {/* Top bar */}
          <div className="relative z-20 flex items-center gap-3 bg-[#eeeef2]/72 px-4 pb-2 pt-[max(env(safe-area-inset-top),12px)] shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-2xl">
            <motion.button
              type="button"
              onClick={onBack}
              whileTap={{ scale: 0.97, opacity: 0.7 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white/80 text-[#007AFF] shadow-[0_1px_4px_rgba(0,0,0,0.12)] backdrop-blur-sm"
              aria-label="Wróć do wyboru trybu"
            >
              <ArrowLeft className="size-5" />
            </motion.button>
            <h1 className="min-w-0 flex-1 truncate text-[17px] font-semibold tracking-[-0.41px] text-[#1c1c1e]">
              {mapCenter.district}
            </h1>
            <div className="flex shrink-0 items-center gap-2">
              <IconBubble icon={Bell} label="Powiadomienia" />
              <IconBubble icon={Filter} label="Filtry" />
            </div>
          </div>

          {/* Segmented control */}
          <div className="relative z-20 flex justify-center bg-[#eeeef2]/72 pb-2 backdrop-blur-2xl">
            <DiscoverySwitcher
              value={discoveryMode}
              onChange={setDiscoveryMode}
            />
          </div>

          {/* Scrollable content area */}
          <div className="min-h-0 flex-1 overflow-y-auto bg-[#f4f4f8]">
            <div className="mx-auto max-w-md px-4 py-4 md:max-w-6xl md:px-6">
              {discoveryMode === "profile" ? (
                <>
                  {/* Sort summary */}
                  <div className="mb-3 flex items-center justify-between px-1">
                    <span className="text-[13px] font-medium text-[#8e8e93]">
                      Najlepsze dopasowanie · {filteredCaregivers.length}{" "}
                      profili
                    </span>
                  </div>

                  {/* Filter chips */}
                  <FilterBar
                    activeFilters={activeFilters}
                    onToggle={toggleFilter}
                    className="mb-4"
                  />

                  {/* Card list */}
                  <div className="space-y-3">
                    {filteredCaregivers.map((caregiver, index) => (
                      <motion.div
                        key={caregiver.id}
                        role="button"
                        tabIndex={0}
                        whileTap={{ scale: 0.98, opacity: 0.8 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        onClick={() => {
                          setDeck((prev) => {
                            const idx = prev.findIndex(
                              (p) => p.id === caregiver.id,
                            );
                            if (idx < 0 || idx === prev.length - 1) return prev;
                            const next = [...prev];
                            const [item] = next.splice(idx, 1);
                            next.push(item);
                            return next;
                          });
                          setDrawerOpen(true);
                        }}
                        className="w-full cursor-pointer text-left"
                      >
                        <div
                          className={`rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] ${
                            index === 0
                              ? "ring-1 ring-[#007AFF]/20"
                              : "border border-black/4"
                          }`}
                        >
                          {/* Top pick badge */}
                          {index === 0 && (
                            <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-[#007AFF]/10 px-2.5 py-1 text-[11px] font-semibold text-[#007AFF]">
                              <Star className="size-3" fill="currentColor" />
                              Najlepsze dopasowanie
                            </div>
                          )}

                          {/* Main row: avatar | info | match + save */}
                          <div className="flex items-start gap-3">
                            {/* Avatar + verified label */}
                            <div className="flex shrink-0 flex-col items-center">
                              <div className="relative">
                                <img
                                  src={caregiver.avatarUrl}
                                  alt={caregiver.name}
                                  className="size-12 rounded-full object-cover ring-2 ring-black/5"
                                />
                                {caregiver.verified && (
                                  <div className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#34C759] ring-2 ring-white">
                                    <BadgeCheck
                                      className="size-2.5 text-white"
                                      strokeWidth={2.5}
                                    />
                                  </div>
                                )}
                              </div>
                              {caregiver.verified && (
                                <span className="mt-0.5 text-[10px] font-medium text-[#34C759]">
                                  Zweryfikowana
                                </span>
                              )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-[17px] font-semibold tracking-[-0.41px] text-[#1c1c1e]">
                                {caregiver.name}
                              </h3>
                              <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[#8e8e93]">
                                <span>
                                  {caregiver.distanceKm
                                    .toFixed(1)
                                    .replace(".", ",")}{" "}
                                  km
                                </span>
                                <span className="text-[#8e8e93]/40">·</span>
                                <span>{caregiver.hourlyRate} zł/godz.</span>
                                <span className="text-[#8e8e93]/40">·</span>
                                <Star
                                  className="size-3 text-[#FF9500]"
                                  fill="currentColor"
                                />
                                <span className="font-medium text-[#1c1c1e]">
                                  {caregiver.rating}
                                </span>
                              </div>
                            </div>

                            {/* Match % + bookmark — unified right column */}
                            <div className="flex shrink-0 flex-col items-center gap-2">
                              <span className="rounded-full bg-[#007AFF]/10 px-2.5 py-1 text-[13px] font-bold tabular-nums text-[#007AFF]">
                                {caregiver.compatibility}%
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSave(caregiver.id);
                                }}
                                className={`grid size-8 place-items-center rounded-full transition-colors active:scale-95 ${
                                  savedIds.has(caregiver.id)
                                    ? "bg-[#007AFF]/12 text-[#007AFF]"
                                    : "bg-[#e8e8ec] text-[#8e8e93]"
                                }`}
                              >
                                <Bookmark
                                  className="size-[18px]"
                                  fill={
                                    savedIds.has(caregiver.id)
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              </button>
                            </div>
                          </div>

                          {/* Tags — max 3, label style */}
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {caregiver.specializations
                              .slice(0, 3)
                              .map((tag) => (
                                <span
                                  key={tag.id}
                                  className="rounded-full bg-[#7676801f] px-2.5 py-0.5 text-[12px] font-medium text-[#636366]"
                                >
                                  {tag.label}
                                </span>
                              ))}
                          </div>

                          {/* Experience + Availability */}
                          <div className="mt-2 flex items-center gap-4 text-[12px] text-[#8e8e93]">
                            <span className="inline-flex items-center gap-1">
                              <Briefcase className="size-3" />
                              {caregiver.yearsExperience} lat dośw.
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="size-3" />
                              {caregiver.availableLabel}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : savedCaregivers.length === 0 ? (
                <GlassCard className="p-6">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#007AFF]/10">
                      <Heart className="size-8 text-[#007AFF]" />
                    </div>
                    <h3 className="mb-2 text-[20px] font-semibold tracking-tight text-[#1c1c1e]">
                      Brak zapisanych profili
                    </h3>
                    <p className="max-w-xs text-[15px] text-[#8e8e93]">
                      Kliknij ikonę zakładki na karcie profilu, aby zapisać
                      opiekunkę do ulubionych.
                    </p>
                  </div>
                </GlassCard>
              ) : (
                <>
                  {/* Summary */}
                  <div className="mb-3 px-1">
                    <span className="text-[13px] font-medium text-[#8e8e93]">
                      Zapisane · {savedCaregivers.length}{" "}
                      {savedCaregivers.length === 1 ? "profil" : "profili"}
                    </span>
                  </div>

                  {/* Saved card list — same layout as Profile tab */}
                  <div className="space-y-3">
                    {savedCaregivers.map((caregiver) => (
                      <motion.div
                        key={caregiver.id}
                        role="button"
                        tabIndex={0}
                        whileTap={{ scale: 0.98, opacity: 0.8 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        onClick={() => {
                          setDeck((prev) => {
                            const idx = prev.findIndex(
                              (p) => p.id === caregiver.id,
                            );
                            if (idx < 0 || idx === prev.length - 1) return prev;
                            const next = [...prev];
                            const [item] = next.splice(idx, 1);
                            next.push(item);
                            return next;
                          });
                          setDrawerOpen(true);
                        }}
                        className="w-full cursor-pointer text-left"
                      >
                        <div className="rounded-2xl border border-black/4 bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                          {/* Main row: avatar | info | match + save */}
                          <div className="flex items-start gap-3">
                            {/* Avatar + verified label */}
                            <div className="flex shrink-0 flex-col items-center">
                              <div className="relative">
                                <img
                                  src={caregiver.avatarUrl}
                                  alt={caregiver.name}
                                  className="size-12 rounded-full object-cover ring-2 ring-black/5"
                                />
                                {caregiver.verified && (
                                  <div className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#34C759] ring-2 ring-white">
                                    <BadgeCheck
                                      className="size-2.5 text-white"
                                      strokeWidth={2.5}
                                    />
                                  </div>
                                )}
                              </div>
                              {caregiver.verified && (
                                <span className="mt-0.5 text-[10px] font-medium text-[#34C759]">
                                  Zweryfikowana
                                </span>
                              )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-[17px] font-semibold tracking-[-0.41px] text-[#1c1c1e]">
                                {caregiver.name}
                              </h3>
                              <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[#8e8e93]">
                                <span>
                                  {caregiver.distanceKm
                                    .toFixed(1)
                                    .replace(".", ",")}{" "}
                                  km
                                </span>
                                <span className="text-[#8e8e93]/40">·</span>
                                <span>{caregiver.hourlyRate} zł/godz.</span>
                                <span className="text-[#8e8e93]/40">·</span>
                                <Star
                                  className="size-3 text-[#FF9500]"
                                  fill="currentColor"
                                />
                                <span className="font-medium text-[#1c1c1e]">
                                  {caregiver.rating}
                                </span>
                              </div>
                            </div>

                            {/* Match % + bookmark — unified right column */}
                            <div className="flex shrink-0 flex-col items-center gap-2">
                              <span className="rounded-full bg-[#007AFF]/10 px-2.5 py-1 text-[13px] font-bold tabular-nums text-[#007AFF]">
                                {caregiver.compatibility}%
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSave(caregiver.id);
                                }}
                                className="grid size-8 place-items-center rounded-full bg-[#007AFF]/12 text-[#007AFF] transition-colors active:scale-95"
                              >
                                <Bookmark
                                  className="size-[18px]"
                                  fill="currentColor"
                                />
                              </button>
                            </div>
                          </div>

                          {/* Tags — max 3, label style */}
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {caregiver.specializations
                              .slice(0, 3)
                              .map((tag) => (
                                <span
                                  key={tag.id}
                                  className="rounded-full bg-[#7676801f] px-2.5 py-0.5 text-[12px] font-medium text-[#636366]"
                                >
                                  {tag.label}
                                </span>
                              ))}
                          </div>

                          {/* Experience + Availability */}
                          <div className="mt-2 flex items-center gap-4 text-[12px] text-[#8e8e93]">
                            <span className="inline-flex items-center gap-1">
                              <Briefcase className="size-3" />
                              {caregiver.yearsExperience} lat dośw.
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="size-3" />
                              {caregiver.availableLabel}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom navigation */}
          <nav className="relative z-20 grid grid-cols-4 border-t border-black/6 bg-[#eeeef2]/72 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-1px_0_rgba(0,0,0,0.04)] backdrop-blur-2xl">
            <BottomNavItem icon={House} label="Główna" active />
            <BottomNavItem icon={Users} label="Odkrywaj" />
            <BottomNavItem
              icon={MessageCircleMore}
              label="Wiadomości"
              badgeCount={3}
            />
            <BottomNavItem icon={UserRound} label="Profil" />
          </nav>
        </div>
      )}

      <GlassDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Skontaktuj się z opiekunem"
        description="Bottom sheet stylizowany jak iOS glass panel. Tu możesz potem podpiąć prawdziwy czat lub formularz pierwszego kontaktu."
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-[#e8e8ec] p-4 text-sm leading-6 text-[#3c3c43]">
            <p>
              <strong className="text-[#1c1c1e]">{activeCaregiver.name}</strong>{" "}
              jest dostępna jako najlepsze dopasowanie w okolicy. W MVP możesz
              tu uruchomić:
            </p>
            <ul className="mt-3 space-y-2">
              <li>• pierwszy kontakt tekstowy,</li>
              <li>• propozycję krótkiej rozmowy telefonicznej,</li>
              <li>• zapisanie profilu do shortlisty rodziny.</li>
            </ul>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Button size="lg">Wyślij wiadomość</Button>
            <Button size="lg" variant="secondary">
              Zapisz do shortlisty
            </Button>
          </div>
        </div>
      </GlassDialog>

      <ProfileDrawer
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
        }}
        caregiver={activeCaregiver}
        onContact={() => {
          setDrawerOpen(false);
          setDialogOpen(true);
        }}
        onSave={() => {
          toggleSave(activeCaregiver.id);
          setDrawerOpen(false);
        }}
        isSaved={savedIds.has(activeCaregiver.id)}
      />
    </>
  );
}

/* ─── Helper components ─── */

interface IconBubbleProps {
  icon: typeof Bell;
  label?: string;
}

function IconBubble({ icon: Icon, label }: IconBubbleProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileTap={{ scale: 0.97, opacity: 0.7 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="grid size-10 place-items-center rounded-full bg-white/80 shadow-[0_1px_4px_rgba(0,0,0,0.12)] backdrop-blur-sm"
    >
      <Icon className="size-5 text-[#1c1c1e]" />
    </motion.button>
  );
}

interface BottomNavItemProps {
  icon: typeof House;
  label: string;
  active?: boolean;
  badgeCount?: number;
}

function BottomNavItem({
  icon: Icon,
  label,
  active = false,
  badgeCount,
}: BottomNavItemProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97, opacity: 0.7 }}
      className={`relative inline-flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 text-[10px] ${
        active ? "text-[#007AFF]" : "text-[#8e8e93]"
      }`}
    >
      <div className="relative">
        <Icon className="size-5.5" strokeWidth={active ? 2.2 : 1.8} />
        {badgeCount != null && badgeCount > 0 ? (
          <span className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-[#FF3B30] text-[10px] font-bold leading-none text-white shadow-sm">
            {badgeCount}
          </span>
        ) : null}
      </div>
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}

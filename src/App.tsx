import { useEffect, useMemo, useRef, useState } from "react";
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
import type { SheetState } from "@/components/features/map-bottom-sheet";
import { RoleSelector } from "@/components/features/role-selector";
import { ProfileDrawer } from "@/components/features/profile-drawer";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassDialog } from "@/components/ui/dialog";
import type { DiscoveryMode, RoleMode } from "@/types/domain";

const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

export default function App() {
  const [role, setRole] = useState<RoleMode>("family");
  const [screen, setScreen] = useState<"role" | "discovery">("role");
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>("profile");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [sheetState, setSheetState] = useState<SheetState>("collapsed");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const mapContentRef = useRef<HTMLDivElement>(null);
  const [mapContentHeight, setMapContentHeight] = useState(500);

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
            c.specializations.some((s) => activeFilters.has(s.id)),
          ),
    [activeFilters],
  );

  const [deck, setDeck] = useState(filteredCaregivers);

  // Reset deck when filters change
  useEffect(() => {
    setDeck(filteredCaregivers);
  }, [filteredCaregivers]);

  const topCard = deck[deck.length - 1] ?? null;
  const activeCaregiver = topCard ?? caregivers[0];

  // Measure map content area height
  useEffect(() => {
    const measure = () => {
      if (mapContentRef.current) {
        setMapContentHeight(mapContentRef.current.clientHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [screen, discoveryMode]);

  return (
    <div className="relative min-h-screen text-[#1c1c1e]">
      {/* Shared warm gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-[#f5e6d3] via-[#ede0d4] to-[#e2d8ce]" />
        <div className="absolute -top-1/4 -left-1/4 h-[80%] w-[80%] rounded-full bg-[#c8dbb6]/40 blur-[120px]" />
        <div className="absolute -right-1/4 -bottom-1/4 h-[70%] w-[70%] rounded-full bg-[#f0cdb0]/50 blur-[120px]" />
        <div className="absolute top-1/3 left-1/2 h-[50%] w-[50%] -translate-x-1/2 rounded-full bg-[#b8cfe0]/30 blur-[100px]" />
      </div>

      {screen === "role" ? (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
          {/* Extra warmth layer for role screen */}
          <div className="absolute inset-0 -z-10 bg-black/3" />

          <div className="w-full max-w-sm px-6">
            <div className="mb-6 text-center">
              <img
                src={logoSrc}
                alt="CareMatch"
                className="mx-auto mb-4 size-25 object-contain"
              />
              <h1 className="text-[34px] font-bold tracking-[0.37px] text-[#1c1c1e]">
                Kim jesteś?
              </h1>
              <p className="mx-auto mt-2 max-w-64 text-[15px] leading-5 text-[#3c3c43]/60">
                Dopasujemy Cię do idealnego opiekuna w kilka chwil.
              </p>
            </div>

            <RoleSelector
              value={role}
              onChange={(nextRole) => {
                setRole(nextRole);
                setScreen("discovery");
              }}
            />
          </div>
        </div>
      ) : discoveryMode === "map" ? (
        /* ─── MAP MODE: fullscreen map + bottom sheet ─── */
        <div className="fixed inset-0 flex flex-col">
          {/* Top bar — floating over map */}
          <div className="relative z-20 flex items-center gap-3 bg-white/70 px-4 pb-2 pt-[max(env(safe-area-inset-top),12px)] shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-2xl">
            <motion.button
              type="button"
              onClick={() => setScreen("role")}
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
          <div className="relative z-20 flex justify-center bg-white/70 pb-2 backdrop-blur-2xl">
            <DiscoverySwitcher
              value={discoveryMode}
              onChange={setDiscoveryMode}
            />
          </div>

          {/* Map + bottom sheet content area */}
          <div ref={mapContentRef} className="relative min-h-0 flex-1">
            {/* Fullscreen map background */}
            <FakeMap
              role={role}
              activeCaregiverId={activeCaregiver.id}
              filteredCaregivers={filteredCaregivers}
              fullscreen
              onMapClick={() => setSheetState("collapsed")}
              onSelectCaregiver={(id) => {
                setDeck((prev) => {
                  const idx = prev.findIndex((p) => p.id === id);
                  if (idx < 0 || idx === prev.length - 1) return prev;
                  const next = [...prev];
                  const [item] = next.splice(idx, 1);
                  next.push(item);
                  return next;
                });
                setSheetState("expanded");
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
              sheetState={sheetState}
              onSheetStateChange={setSheetState}
              contentHeight={mapContentHeight}
              onContact={() => setDialogOpen(true)}
              onSave={() => toggleSave(activeCaregiver.id)}
              isSaved={savedIds.has(activeCaregiver.id)}
              onViewProfile={() => setDrawerOpen(true)}
            />
          </div>

          {/* Bottom navigation */}
          <nav className="relative z-20 grid grid-cols-4 border-t border-black/6 bg-white/70 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-1px_0_rgba(0,0,0,0.04)] backdrop-blur-2xl">
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
        /* ─── PROFILE / SAVED MODE: same shell as map ─── */
        <div className="fixed inset-0 flex flex-col">
          {/* Top bar */}
          <div className="relative z-20 flex items-center gap-3 bg-white/70 px-4 pb-2 pt-[max(env(safe-area-inset-top),12px)] shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-2xl">
            <motion.button
              type="button"
              onClick={() => setScreen("role")}
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
          <div className="relative z-20 flex justify-center bg-white/70 pb-2 backdrop-blur-2xl">
            <DiscoverySwitcher
              value={discoveryMode}
              onChange={setDiscoveryMode}
            />
          </div>

          {/* Scrollable content area */}
          <div className="min-h-0 flex-1 overflow-y-auto bg-[#f2f2f7]">
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
                                    : "bg-[#f2f2f7] text-[#8e8e93]"
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

                          {/* Tags — max 3, lighter */}
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {caregiver.specializations
                              .slice(0, 3)
                              .map((tag) => (
                                <span
                                  key={tag.id}
                                  className="rounded-full bg-[#f2f2f7] px-2.5 py-0.5 text-[12px] font-medium text-[#8e8e93]"
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

                          {/* Tags — max 3, lighter */}
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {caregiver.specializations
                              .slice(0, 3)
                              .map((tag) => (
                                <span
                                  key={tag.id}
                                  className="rounded-full bg-[#f2f2f7] px-2.5 py-0.5 text-[12px] font-medium text-[#8e8e93]"
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
          <nav className="relative z-20 grid grid-cols-4 border-t border-black/6 bg-white/70 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-1px_0_rgba(0,0,0,0.04)] backdrop-blur-2xl">
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
          <div className="rounded-xl bg-[#f2f2f7] p-4 text-sm leading-6 text-[#3c3c43]">
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
          if (!open) setSheetState("collapsed");
        }}
        caregiver={activeCaregiver}
        onContact={() => {
          setDrawerOpen(false);
          setSheetState("collapsed");
          setDialogOpen(true);
        }}
        onSave={() => {
          toggleSave(activeCaregiver.id);
          setDrawerOpen(false);
          setSheetState("collapsed");
        }}
        isSaved={savedIds.has(activeCaregiver.id)}
      />
    </div>
  );
}

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

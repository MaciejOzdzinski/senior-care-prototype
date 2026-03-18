import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Bell,
  Filter,
  Heart,
  House,
  MessageCircleMore,
  RotateCcw,
  UserRound,
  Users,
} from "lucide-react";
import { caregivers, mapCenter, allSpecializations } from "@/data/mock-data";
import { DiscoverySwitcher } from "@/components/features/discovery-switcher";
import { FakeMap } from "@/components/features/fake-map";
import { ProfileCard } from "@/components/features/profile-card";
import { RoleSelector } from "@/components/features/role-selector";
import { SwipeCard } from "@/components/features/swipe-card";
import { SwipeHint } from "@/components/features/swipe-hint";
import { ProfileDrawer } from "@/components/features/profile-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/ui/filter-chip";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassDialog } from "@/components/ui/dialog";
import { SectionTitle } from "@/components/ui/section-title";
import type { DiscoveryMode, RoleMode } from "@/types/domain";

const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

export default function App() {
  const [role, setRole] = useState<RoleMode>("family");
  const [screen, setScreen] = useState<"role" | "discovery">("role");
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>("cards");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [matchAnimation, setMatchAnimation] = useState(false);
  const [lastSwipedName, setLastSwipedName] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

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

  const isFamilyMode = role === "family";

  const handleSwipe = (direction: "left" | "right") => {
    const swiped = deck[deck.length - 1];
    if (!swiped) return;

    if (direction === "right") {
      setLastSwipedName(swiped.name);
      setMatchAnimation(true);
      setTimeout(() => setMatchAnimation(false), 1800);
    }

    setDeck((prev) => prev.slice(0, -1));
  };

  const resetDeck = () => {
    setDeck(filteredCaregivers);
    setLastSwipedName(null);
  };

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
      ) : (
        <div className="mx-auto max-w-md space-y-4 overflow-hidden px-4 pb-20 pt-[max(env(safe-area-inset-top),20px)] md:max-w-6xl md:px-6">
          {/* Apple HIG inline navigation bar */}
          <header className="flex items-center gap-3 px-1">
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
          </header>

          <main className="grid min-w-0 gap-4 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
            <section className="min-w-0 space-y-4">
              <GlassCard className="p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <SectionTitle>
                      {isFamilyMode ? "Mapa dopasowań" : "Mapa zgłoszeń"}
                    </SectionTitle>
                    <p className="mt-1 text-sm text-[#8e8e93]">
                      {isFamilyMode
                        ? "Kliknięcie pinezki synchronizuje aktywną kartę niżej."
                        : "Widzisz przybliżone strefy rodzin i aktywne potrzeby opieki."}
                    </p>
                  </div>
                  <Badge className="shrink-0 self-start">
                    {isFamilyMode ? "3 km" : "2 aktywne zlecenia"}
                  </Badge>
                </div>
                <div className="relative">
                  <FakeMap
                    role={role}
                    activeCaregiverId={activeCaregiver.id}
                    filteredCaregivers={filteredCaregivers}
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
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-2xl bg-linear-to-t from-black/25 to-transparent pt-8 pb-2.5 px-3">
                    <div className="pointer-events-auto flex gap-2 overflow-x-auto scrollbar-none">
                      {allSpecializations.map((tag) => (
                        <FilterChip
                          key={tag.id}
                          label={tag.label}
                          active={activeFilters.has(tag.id)}
                          onClick={() => toggleFilter(tag.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </section>

            <section className="min-w-0 space-y-4">
              <GlassCard className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <SectionTitle>
                    {isFamilyMode ? "Dla Ciebie" : "Zgłoszenia w pobliżu"}
                  </SectionTitle>
                  <DiscoverySwitcher
                    value={discoveryMode}
                    onChange={setDiscoveryMode}
                  />
                </div>
              </GlassCard>

              {discoveryMode === "cards" ? (
                <div className="relative h-[420px]">
                  {deck.length > 0 && <SwipeHint />}

                  {/* Match animation overlay */}
                  {matchAnimation && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xl">
                      <div className="flex flex-col items-center gap-5">
                        <div className="flex size-20 items-center justify-center rounded-full bg-[#34C759] shadow-[0_4px_24px_rgba(52,199,89,0.5)]">
                          <Heart
                            className="size-10 text-white"
                            fill="currentColor"
                          />
                        </div>
                        <div className="text-center">
                          <h2 className="text-[28px] font-bold tracking-tight text-white">
                            Wysłano zapytanie
                          </h2>
                          <p className="mt-1 text-[17px] text-white/70">
                            {lastSwipedName} otrzyma powiadomienie
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {deck.length > 0 ? (
                    deck.slice(-3).map((profile, sliceIndex, arr) => {
                      const isTop = sliceIndex === arr.length - 1;
                      const depth = arr.length - 1 - sliceIndex;
                      const scale = 1 - depth * 0.03;
                      const translateY = depth * 8;

                      return (
                        <SwipeCard
                          key={profile.id}
                          onSwipe={handleSwipe}
                          isTop={isTop}
                          onTap={isTop ? () => setDrawerOpen(true) : undefined}
                          onContact={
                            isTop ? () => setDrawerOpen(true) : undefined
                          }
                          style={
                            isTop
                              ? { zIndex: arr.length }
                              : {
                                  transform: `scale(${scale}) translateY(${translateY}px)`,
                                  zIndex: sliceIndex,
                                }
                          }
                        >
                          <ProfileCard caregiver={profile} />
                        </SwipeCard>
                      );
                    })
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-black/4 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                      <div className="p-8 text-center">
                        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-[#34C759]/10">
                          <Heart className="size-10 text-[#34C759]" />
                        </div>
                        <h3 className="mb-2 text-[20px] font-semibold tracking-tight text-[#1c1c1e]">
                          Brak więcej opiekunek
                        </h3>
                        <p className="mb-6 text-[15px] text-[#8e8e93]">
                          Sprawdź ponownie później
                        </p>
                        <button
                          type="button"
                          onClick={resetDeck}
                          className="inline-flex items-center gap-2 rounded-full bg-[#34C759] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_2px_12px_rgba(52,199,89,0.4)] transition-transform active:scale-95"
                        >
                          <RotateCcw className="size-4" />
                          Zacznij od nowa
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <GlassCard className="space-y-4 p-4 md:p-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    {filteredCaregivers.map((caregiver) => (
                      <motion.button
                        key={caregiver.id}
                        type="button"
                        whileTap={{ scale: 0.97, opacity: 0.7 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        onClick={() =>
                          setDeck((prev) => {
                            const idx = prev.findIndex(
                              (p) => p.id === caregiver.id,
                            );
                            if (idx < 0 || idx === prev.length - 1) return prev;
                            const next = [...prev];
                            const [item] = next.splice(idx, 1);
                            next.push(item);
                            return next;
                          })
                        }
                        className="text-left"
                      >
                        <div className="rounded-2xl border border-black/4 bg-[#f2f2f7] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-[17px] font-semibold tracking-[-0.41px] text-[#1c1c1e]">
                                {caregiver.name}
                              </div>
                              <div className="text-[13px] leading-[18px] text-[#8e8e93]">
                                {caregiver.distanceKm.toFixed(1)} km ·{" "}
                                {caregiver.hourlyRate} zł/h
                              </div>
                            </div>
                            <Badge className="bg-[#007AFF]/12 text-[#007AFF] font-semibold">
                              {caregiver.compatibility}%
                            </Badge>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {caregiver.specializations
                              .slice(0, 3)
                              .map((tag) => (
                                <Badge key={tag.id}>{tag.label}</Badge>
                              ))}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </GlassCard>
              )}
            </section>
          </main>

          <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-black/6 bg-white/70 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-1px_0_rgba(0,0,0,0.04)] backdrop-blur-2xl md:static md:mx-auto md:max-w-md md:rounded-2xl md:border md:border-white/60 md:bg-white/50 md:pb-2 md:shadow-[0_4px_24px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]">
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
        onOpenChange={setDrawerOpen}
        caregiver={activeCaregiver}
        onContact={() => {
          setDrawerOpen(false);
          setDialogOpen(true);
        }}
        onSave={() => setDrawerOpen(false)}
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

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Filter,
  House,
  MessageCircleMore,
  UserRound,
  Users,
} from "lucide-react";
import { caregivers, familyNeeds, mapCenter } from "@/data/mock-data";
import { DiscoverySwitcher } from "@/components/features/discovery-switcher";
import { FakeMap } from "@/components/features/fake-map";
import { ProfileCard } from "@/components/features/profile-card";
import { RoleSelector } from "@/components/features/role-selector";
import { SwipeCard } from "@/components/features/swipe-card";
import { SwipeHint } from "@/components/features/swipe-hint";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassDialog } from "@/components/ui/dialog";
import { SectionTitle } from "@/components/ui/section-title";
import type { DiscoveryMode, RoleMode } from "@/types/domain";

const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

function nextIndex(current: number, length: number): number {
  if (length === 0) return 0;
  return (current + 1) % length;
}

export default function App() {
  const [role, setRole] = useState<RoleMode>("family");
  const [screen, setScreen] = useState<"role" | "discovery">("role");
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>("cards");
  const [activeIndex, setActiveIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeCaregiver = caregivers[activeIndex] ?? caregivers[0];

  const deckPreview = useMemo(
    () =>
      caregivers.filter((item) => item.id !== activeCaregiver.id).slice(0, 2),
    [activeCaregiver.id],
  );

  const isFamilyMode = role === "family";

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
        <div className="mx-auto max-w-md space-y-4 px-4 pb-20 pt-5 md:max-w-6xl md:px-6">
          {/* Apple HIG inline navigation bar */}
          <header className="flex items-center gap-3 px-1">
            <button
              type="button"
              onClick={() => setScreen("role")}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white/80 text-[#007AFF] shadow-[0_1px_4px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all duration-200 active:scale-95 active:bg-white/60"
              aria-label="Wróć do wyboru trybu"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-[17px] font-semibold tracking-[-0.41px] text-[#1c1c1e]">
              {mapCenter.district}
            </h1>
            <div className="flex shrink-0 items-center gap-2">
              <IconBubble icon={Bell} label="Powiadomienia" />
              <IconBubble icon={Filter} label="Filtry" />
            </div>
          </header>

          <main className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
            <section className="space-y-4">
              <GlassCard className="overflow-hidden p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <SectionTitle>
                      {isFamilyMode ? "Mapa dopasowań" : "Mapa zgłoszeń"}
                    </SectionTitle>
                    <p className="mt-1 text-sm text-[#8e8e93]">
                      {isFamilyMode
                        ? "Kliknięcie pinezki synchronizuje aktywną kartę niżej."
                        : "Widzisz przybliżone strefy rodzin i aktywne potrzeby opieki."}
                    </p>
                  </div>
                  <Badge>{isFamilyMode ? "3 km" : "2 aktywne zlecenia"}</Badge>
                </div>
                <FakeMap
                  role={role}
                  activeCaregiverId={activeCaregiver.id}
                  onSelectCaregiver={(id) => {
                    const index = caregivers.findIndex(
                      (profile) => profile.id === id,
                    );
                    if (index >= 0) setActiveIndex(index);
                  }}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>Dziś</Badge>
                  <Badge>Godzinowa</Badge>
                  <Badge>Demencja</Badge>
                </div>
              </GlassCard>
            </section>

            <section className="space-y-4">
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
                <div className="relative">
                  <SwipeHint />
                  {deckPreview.map((item, index) => (
                    <GlassCard
                      key={item.id}
                      className={`absolute inset-x-5 top-4 -z-10 h-[420px] opacity-60 blur-[0.3px] ${index === 0 ? "translate-y-4 scale-[0.97]" : "translate-y-8 scale-[0.94]"}`}
                    />
                  ))}
                  <SwipeCard
                    onSwipeLeft={() =>
                      setActiveIndex((current) =>
                        nextIndex(current, caregivers.length),
                      )
                    }
                    onSwipeRight={() =>
                      setActiveIndex((current) =>
                        nextIndex(current, caregivers.length),
                      )
                    }
                  >
                    <ProfileCard
                      caregiver={activeCaregiver}
                      onSkip={() =>
                        setActiveIndex((current) =>
                          nextIndex(current, caregivers.length),
                        )
                      }
                      onSave={() =>
                        setActiveIndex((current) =>
                          nextIndex(current, caregivers.length),
                        )
                      }
                      onContact={() => setDialogOpen(true)}
                    />
                  </SwipeCard>
                </div>
              ) : (
                <GlassCard className="space-y-4 p-4 md:p-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    {caregivers.map((caregiver) => (
                      <button
                        key={caregiver.id}
                        type="button"
                        onClick={() =>
                          setActiveIndex(
                            caregivers.findIndex(
                              (profile) => profile.id === caregiver.id,
                            ),
                          )
                        }
                        className="text-left"
                      >
                        <div className="rounded-2xl border border-black/4 bg-[#f2f2f7] p-4 transition hover:bg-[#eaeaef]">
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
                      </button>
                    ))}
                  </div>
                </GlassCard>
              )}

              <GlassCard className="grid gap-4 p-4 md:grid-cols-[1fr_320px] md:p-5">
                <div>
                  <SectionTitle>
                    {isFamilyMode
                      ? "Krótka lista potrzeb"
                      : "Twoja okolica dziś"}
                  </SectionTitle>
                  <div className="mt-3 space-y-3">
                    {familyNeeds.map((need) => (
                      <div
                        key={need.id}
                        className="rounded-xl border border-black/4 bg-[#f2f2f7] p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="text-[17px] font-semibold tracking-[-0.41px] text-[#1c1c1e]">
                              {need.title}
                            </div>
                            <div className="mt-1 text-[13px] leading-[18px] text-[#8e8e93]">
                              {need.district} · {need.hours}
                            </div>
                          </div>
                          <Badge>{need.budget}</Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {need.needs.map((tag) => (
                            <Badge key={tag.id}>{tag.label}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 rounded-xl border border-black/4 bg-[#f2f2f7] p-4">
                  <SectionTitle>Pattern intent</SectionTitle>
                  <ul className="space-y-2 text-sm leading-6 text-[#8e8e93]">
                    <li>
                      • Pierwszy ekran: tylko dwie karty-decki z natychmiastowym
                      wejściem.
                    </li>
                    <li>
                      • Drugi ekran: mapa + discovery cards w stylu trust-first
                      Tinder pattern.
                    </li>
                    <li>
                      • W tle nadal premium liquid glass zamiast ciężkiego
                      portalu ogłoszeń.
                    </li>
                  </ul>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setDialogOpen(true)}
                  >
                    Otwórz bottom sheet kontaktu
                  </Button>
                </div>
              </GlassCard>
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
    </div>
  );
}

interface IconBubbleProps {
  icon: typeof Bell;
  label?: string;
}

function IconBubble({ icon: Icon, label }: IconBubbleProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-10 place-items-center rounded-full bg-white/80 shadow-[0_1px_4px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all duration-200 active:scale-95 active:bg-white/60"
    >
      <Icon className="size-5 text-[#1c1c1e]" />
    </button>
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
    <button
      type="button"
      className={`relative inline-flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 text-[10px] transition-all duration-200 active:scale-90 active:opacity-70 ${
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
    </button>
  );
}

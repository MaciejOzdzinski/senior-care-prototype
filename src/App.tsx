import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Compass,
  Filter,
  MessageCircleMore,
  Search,
  UserRound,
} from "lucide-react";
import { caregivers, familyNeeds, mapCenter } from "@/data/mock-data";
import { DiscoverySwitcher } from "@/components/features/discovery-switcher";
import { FakeMap } from "@/components/features/fake-map";
import { ProfileCard } from "@/components/features/profile-card";
import { RoleSelector } from "@/components/features/role-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassDialog } from "@/components/ui/dialog";
import { SectionTitle } from "@/components/ui/section-title";
import type { DiscoveryMode, RoleMode } from "@/types/domain";

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
    <div className="min-h-screen bg-[#f2f2f7] px-4 py-5 text-[#1c1c1e] md:px-6">
      {screen === "role" ? (
        <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-sm items-center justify-center">
          <GlassCard className="w-full rounded-[28px] p-6">
            <div className="mb-6 text-center">
              <div className="text-[11px] uppercase tracking-[0.3em] text-[#8e8e93]">
                CareMatch
              </div>
              <h1 className="mt-2.5 text-[1.65rem] font-semibold tracking-[-0.025em] text-[#1c1c1e]">
                Wybierz swój tryb
              </h1>
              <p className="mx-auto mt-2 max-w-70 text-[0.88rem] leading-normal text-[#8e8e93]">
                Każda ścieżka prowadzi do ekranu discovery z mapą i
                dopasowaniami.
              </p>
            </div>

            <RoleSelector
              value={role}
              onChange={(nextRole) => {
                setRole(nextRole);
                setScreen("discovery");
              }}
            />
          </GlassCard>
        </div>
      ) : (
        <div className="mx-auto max-w-md space-y-4 md:max-w-6xl">
          <header className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setScreen("role")}
                className="grid size-10 place-items-center rounded-xl bg-[#f2f2f7] text-[#8e8e93] transition hover:bg-[#e5e5ea]"
                aria-label="Wróć do wyboru trybu"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#8e8e93]">
                  CareMatch
                </div>
                <div className="mt-0.5 text-base font-semibold text-[#1c1c1e]">
                  {mapCenter.district}
                </div>
                <p className="text-sm text-[#8e8e93]">
                  {isFamilyMode
                    ? "Odkrywaj opiekunów przez karty i mapę"
                    : "Odkrywaj rodziny przez karty i mapę"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconBubble icon={Bell} />
              <IconBubble icon={Filter} />
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
                    <p className="mt-1 text-sm text-white/64">
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
                  <div>
                    <SectionTitle>
                      {isFamilyMode
                        ? "Szybkie dopasowania"
                        : "Szybki przegląd zgłoszeń"}
                    </SectionTitle>
                    <p className="mt-1 text-sm text-[#8e8e93]">
                      Discovery pattern inspirowany deckiem kart. Mapa daje
                      kontekst gdzie, karta pokazuje kto i dlaczego pasuje.
                    </p>
                  </div>
                  <DiscoverySwitcher
                    value={discoveryMode}
                    onChange={setDiscoveryMode}
                  />
                </div>
              </GlassCard>

              {discoveryMode === "cards" ? (
                <div className="relative">
                  {deckPreview.map((item, index) => (
                    <GlassCard
                      key={item.id}
                      className={`absolute inset-x-5 top-4 -z-10 h-[420px] opacity-60 blur-[0.3px] ${index === 0 ? "translate-y-4 scale-[0.97]" : "translate-y-8 scale-[0.94]"}`}
                    />
                  ))}
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
                        <div className="rounded-2xl border border-black/[0.06] bg-[#f9f9fb] p-4 transition hover:bg-[#f2f2f7]">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-lg font-semibold text-[#1c1c1e]">
                                {caregiver.name}
                              </div>
                              <div className="text-sm text-[#8e8e93]">
                                {caregiver.distanceKm.toFixed(1)} km ·{" "}
                                {caregiver.hourlyRate} zł/h
                              </div>
                            </div>
                            <Badge>{caregiver.compatibility}%</Badge>
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
                        className="rounded-xl border border-black/[0.04] bg-[#f9f9fb] p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="text-base font-semibold text-[#1c1c1e]">
                              {need.title}
                            </div>
                            <div className="mt-1 text-sm text-[#8e8e93]">
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

                <div className="space-y-3 rounded-xl border border-black/[0.04] bg-[#f9f9fb] p-4">
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

          <nav className="grid grid-cols-4 gap-1 rounded-2xl bg-white p-1.5 shadow-[0_1px_6px_rgba(0,0,0,0.08)] md:max-w-md">
            <BottomNavItem icon={Compass} label="Start" active />
            <BottomNavItem icon={Search} label="Odkrywaj" />
            <BottomNavItem icon={MessageCircleMore} label="Wiadomości" />
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
}

function IconBubble({ icon: Icon }: IconBubbleProps) {
  return (
    <div className="grid size-10 place-items-center rounded-xl bg-[#f2f2f7]">
      <Icon className="size-5 text-[#8e8e93]" />
    </div>
  );
}

interface BottomNavItemProps {
  icon: typeof Compass;
  label: string;
  active?: boolean;
}

function BottomNavItem({
  icon: Icon,
  label,
  active = false,
}: BottomNavItemProps) {
  return (
    <button
      type="button"
      className={`inline-flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-xs transition ${
        active ? "bg-[#007AFF] text-white" : "text-[#8e8e93] hover:bg-[#f2f2f7]"
      }`}
    >
      <Icon className="size-4.5" />
      <span>{label}</span>
    </button>
  );
}

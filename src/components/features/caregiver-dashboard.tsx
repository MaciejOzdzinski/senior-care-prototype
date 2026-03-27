import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Eye,
  House,
  Inbox,
  MapPin,
  MessageCircleMore,
  Send,
  Settings,
  Star,
  UserRound,
  Wallet,
} from "lucide-react";
import { familyNeeds } from "@/data/mock-data";
import type { CareNeed } from "@/types/domain";
import { BottomNav } from "@/components/ui/bottom-nav";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type DashTab = "home" | "orders" | "messages" | "profile";

interface CaregiverDashboardProps {
  firstName: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────

const mockStats = [
  { icon: Eye, value: "247", label: "wyświetleń", accent: "#007AFF" },
  { icon: Inbox, value: "3", label: "zapytania", accent: "#FF9500" },
  { icon: Star, value: "—", label: "ocena", accent: "#FF9500" },
] as const;

const completenessItems = [
  { label: "Dane podstawowe", done: true },
  { label: "Specjalizacje", done: true },
  { label: "Dostępność", done: true },
  { label: "Stawka i bio", done: true },
  { label: "Zdjęcie profilowe", done: false },
  { label: "Certyfikaty", done: false },
];

const completedCount = completenessItems.filter((i) => i.done).length;
const completenessPercent = Math.round(
  (completedCount / completenessItems.length) * 100,
);

const tabs: {
  id: DashTab;
  icon: React.ElementType;
  label: string;
  badge?: number;
}[] = [
  { id: "home", icon: House, label: "Główna" },
  { id: "orders", icon: Briefcase, label: "Zlecenia" },
  { id: "messages", icon: MessageCircleMore, label: "Wiadomości", badge: 2 },
  { id: "profile", icon: UserRound, label: "Profil" },
];

// ── Sub-components ─────────────────────────────────────────────────────────

const StatTile = ({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  accent: string;
}) => (
  <GlassCard className="flex flex-1 flex-col items-center gap-1 px-2 py-4">
    <div
      className="mb-1 grid size-9 place-items-center rounded-full"
      style={{ backgroundColor: `${accent}1a` }}
    >
      <Icon className="size-[18px]" style={{ color: accent }} />
    </div>
    <span className="text-[20px] font-bold tracking-tight text-[#1c1c1e]">
      {value}
    </span>
    <span className="text-[11px] text-[#8e8e93]">{label}</span>
  </GlassCard>
);

const ActiveStatusCard = () => {
  const [active, setActive] = useState(true);

  return (
    <GlassCard className="px-4 py-3.5">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "size-2.5 shrink-0 rounded-full transition-colors duration-300",
            active ? "bg-[#34C759]" : "bg-[#c7c7cc]",
          )}
        />
        <div className="flex-1">
          <p className="text-[15px] font-semibold text-[#1c1c1e]">
            {active ? "Przyjmujesz zlecenia" : "Wstrzymano zlecenia"}
          </p>
          <p className="text-[13px] text-[#8e8e93]">
            {active ? "Rodziny widzą Twój profil" : "Twój profil jest ukryty"}
          </p>
        </div>
        {/* iOS-style toggle */}
        <button
          type="button"
          onClick={() => setActive((v) => !v)}
          aria-label="Przełącz dostępność"
          className={cn(
            "relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-300",
            active ? "bg-[#34C759]" : "bg-[#e5e5ea]",
          )}
        >
          <motion.span
            animate={{ x: active ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="absolute left-[2px] top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.22)]"
          />
        </button>
      </div>
    </GlassCard>
  );
};

const RequestCard = ({ need }: { need: CareNeed }) => {
  const [applied, setApplied] = useState(false);

  return (
    <GlassCard className="overflow-hidden">
      {/* Title + badge */}
      <div className="flex items-start justify-between px-4 pt-4 pb-2.5">
        <p className="flex-1 pr-2 text-[16px] font-semibold leading-5 tracking-[-0.32px] text-[#1c1c1e]">
          {need.title}
        </p>
        <Badge className="shrink-0 bg-[#FF9500]/12 text-[11px] text-[#FF9500]">
          Nowe
        </Badge>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 pb-3">
        <span className="flex items-center gap-1 text-[13px] text-[#8e8e93]">
          <MapPin className="size-3" />
          {need.district}
        </span>
        <span className="flex items-center gap-1 text-[13px] text-[#8e8e93]">
          <Clock className="size-3" />
          {need.hours}
        </span>
        <span className="flex items-center gap-1 text-[13px] text-[#8e8e93]">
          <Wallet className="size-3" />
          {need.budget}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 px-4 pb-3.5">
        {need.needs.map((tag) => (
          <span
            key={tag.id}
            className="rounded-full border border-black/6 bg-[#f2f2f7] px-2.5 py-0.5 text-[12px] font-medium text-[#3c3c43]"
          >
            {tag.label}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-black/4" />

      {/* CTA */}
      <div className="px-4 py-3">
        {applied ? (
          <div className="flex items-center justify-center gap-2 py-1 text-[14px] font-semibold text-[#34C759]">
            <CheckCircle2 className="size-4" />
            Aplikacja wysłana
          </div>
        ) : (
          <motion.button
            type="button"
            onClick={() => setApplied(true)}
            whileTap={{ scale: 0.97, opacity: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#FF9500] text-[15px] font-semibold text-white shadow-[0_2px_8px_rgba(255,149,0,0.28)]"
          >
            <Send className="size-[15px]" />
            Odpowiedz na zlecenie
          </motion.button>
        )}
      </div>
    </GlassCard>
  );
};

const CompletenessCard = () => (
  <GlassCard className="px-4 py-4">
    <div className="mb-3 flex items-center justify-between">
      <p className="text-[15px] font-semibold text-[#1c1c1e]">
        Kompletność profilu
      </p>
      <span className="text-[15px] font-bold text-[#FF9500]">
        {completenessPercent}%
      </span>
    </div>

    {/* Progress bar */}
    <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[#f2f2f7]">
      <motion.div
        className="h-full rounded-full bg-[#FF9500]"
        initial={{ width: 0 }}
        animate={{ width: `${completenessPercent}%` }}
        transition={{ type: "spring", stiffness: 180, damping: 28, delay: 0.3 }}
      />
    </div>

    <div className="space-y-2.5">
      {completenessItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2.5">
          {item.done ? (
            <CheckCircle2 className="size-4 shrink-0 text-[#34C759]" />
          ) : (
            <Circle className="size-4 shrink-0 text-[#c7c7cc]" />
          )}
          <span
            className={cn(
              "flex-1 text-[14px] tracking-[-0.41px]",
              item.done ? "text-[#1c1c1e]" : "text-[#8e8e93]",
            )}
          >
            {item.label}
          </span>
          {!item.done && (
            <span className="text-[12px] font-semibold text-[#FF9500]">
              Dodaj
            </span>
          )}
        </div>
      ))}
    </div>
  </GlassCard>
);

// ── Tabs ───────────────────────────────────────────────────────────────────

const HomeTab = () => (
  <div className="space-y-4 px-4 pb-6">
    <ActiveStatusCard />

    {/* Stats */}
    <div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.8px] text-[#8e8e93]">
        Twój tydzień
      </p>
      <div className="flex gap-2.5">
        {mockStats.map((s) => (
          <StatTile key={s.label} {...s} />
        ))}
      </div>
    </div>

    {/* New requests */}
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#8e8e93]">
          Nowe zapytania
        </p>
        <button
          type="button"
          className="flex items-center gap-0.5 text-[13px] font-semibold text-[#FF9500]"
        >
          Wszystkie
          <ChevronRight className="size-3.5" />
        </button>
      </div>
      <div className="space-y-3">
        {familyNeeds.map((need) => (
          <RequestCard key={need.id} need={need} />
        ))}
      </div>
    </div>

    <CompletenessCard />
  </div>
);

const OrdersTab = () => (
  <div className="flex flex-col items-center px-6 pt-20 text-center">
    <div className="mb-4 grid size-16 place-items-center rounded-full bg-[#FF9500]/10">
      <Briefcase className="size-7 text-[#FF9500]" />
    </div>
    <p className="text-[17px] font-semibold text-[#1c1c1e]">
      Brak aktywnych zleceń
    </p>
    <p className="mt-2 max-w-[240px] text-[15px] leading-5 text-[#8e8e93]">
      Gdy odpiszesz na zapytanie i rodzina Cię wybierze, zlecenie pojawi się
      tutaj.
    </p>
  </div>
);

const MessagesTab = () => (
  <div className="flex flex-col items-center px-6 pt-20 text-center">
    <div className="mb-4 grid size-16 place-items-center rounded-full bg-[#007AFF]/10">
      <MessageCircleMore className="size-7 text-[#007AFF]" />
    </div>
    <p className="text-[17px] font-semibold text-[#1c1c1e]">Brak wiadomości</p>
    <p className="mt-2 max-w-[240px] text-[15px] leading-5 text-[#8e8e93]">
      Po nawiązaniu kontaktu z rodziną, rozmowa pojawi się w tym miejscu.
    </p>
  </div>
);

const ProfileTab = ({ firstName }: { firstName: string }) => {
  const initial = firstName ? firstName[0].toUpperCase() : "?";

  const profileActions = [
    { label: "Edytuj profil", icon: UserRound },
    { label: "Moje specjalizacje", icon: BadgeCheck },
    { label: "Stawka i dostępność", icon: Clock },
    { label: "Ustawienia konta", icon: Settings },
  ];

  return (
    <div className="space-y-3 px-4 pb-8 pt-6">
      {/* Avatar + name */}
      <GlassCard className="flex items-center gap-4 px-4 py-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-full bg-[#FF9500] text-[22px] font-bold text-white shadow-[0_2px_8px_rgba(255,149,0,0.35)]">
          {initial}
        </div>
        <div className="flex-1">
          <p className="text-[17px] font-semibold text-[#1c1c1e]">
            {firstName || "Twój profil"}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <BadgeCheck className="size-[13px] text-[#007AFF]" />
            <span className="text-[13px] text-[#8e8e93]">Nowe konto</span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Ustawienia"
          className="grid size-9 place-items-center rounded-full bg-[#f2f2f7]"
        >
          <Settings className="size-[18px] text-[#3c3c43]" />
        </button>
      </GlassCard>

      {/* Actions */}
      <div className="overflow-hidden rounded-2xl border border-black/4 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        {profileActions.map(({ label, icon: Icon }, idx) => (
          <div key={label}>
            {idx > 0 && <div className="mx-4 h-px bg-black/4" />}
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors active:bg-[#f2f2f7]"
            >
              <div className="grid size-8 place-items-center rounded-xl bg-[#FF9500]/10">
                <Icon className="size-[16px] text-[#FF9500]" />
              </div>
              <span className="flex-1 text-left text-[15px] font-medium text-[#1c1c1e]">
                {label}
              </span>
              <ChevronRight className="size-[17px] text-[#c7c7cc]" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="w-full py-2 text-center text-[15px] font-medium text-[#FF3B30]"
      >
        Wyloguj się
      </button>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────

export const CaregiverDashboard = ({ firstName }: CaregiverDashboardProps) => {
  const [activeTab, setActiveTab] = useState<DashTab>("home");

  const greeting = firstName ? `Cześć, ${firstName}!` : "Cześć!";
  const initial = firstName ? firstName[0].toUpperCase() : "?";

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f8f4f0]">
      {/* ── Header ──────────────────────────────────────── */}
      <header className="z-10 bg-[#f2ede8]/90 px-5 pb-3.5 pt-[max(env(safe-area-inset-top),16px)] backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold tracking-[-0.26px] text-[#1c1c1e]">
              {greeting}
            </h1>
            <p className="mt-0.5 text-[13px] tracking-[-0.41px] text-[#8e8e93]">
              Gotowa na nowe zlecenia?
            </p>
          </div>
          <motion.div
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="grid size-11 place-items-center rounded-full bg-[#FF9500] text-[17px] font-bold text-white shadow-[0_2px_8px_rgba(255,149,0,0.35)]"
          >
            {initial}
          </motion.div>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overscroll-contain pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            {activeTab === "home" && <HomeTab />}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "messages" && <MessagesTab />}
            {activeTab === "profile" && <ProfileTab firstName={firstName} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Tab Bar ───────────────────────────────── */}
      <BottomNav
        tabs={tabs}
        activeId={activeTab}
        accentClass="text-[#FF9500]"
        className="z-10 bg-white/92"
        onTabChange={(id) => setActiveTab(id as DashTab)}
      />
    </div>
  );
};

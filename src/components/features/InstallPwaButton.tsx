import React, { useEffect, useMemo, useState } from "react";

/**
 * InstallPwaButton
 * ------------------------------------------------------------
 * HIG-oriented install/onboarding component for React PWA:
 * - Android / supported browsers: uses native beforeinstallprompt
 * - iPhone / iOS Safari: shows instructional bottom sheet
 *
 * Assumptions:
 * - Tailwind CSS is available
 * - You may want to persist dismissal state in localStorage
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type InstallPwaButtonProps = {
  appName?: string;
  className?: string;
  onInstalled?: () => void;
  onDismissed?: () => void;
  onOpenInstructions?: () => void;
};

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua);
}

function isSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
}

function isStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;

  const matchDisplayMode =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(display-mode: standalone)").matches;

  const legacyNavigatorStandalone =
    typeof (window.navigator as Navigator & { standalone?: boolean })
      .standalone === "boolean" &&
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true;

  return matchDisplayMode || legacyNavigatorStandalone;
}

function canShowIosManualInstall(): boolean {
  return isIos() && isSafari() && !isStandaloneMode();
}

function supportsNativeInstallPrompt(
  deferredPrompt: BeforeInstallPromptEvent | null,
): boolean {
  return !!deferredPrompt && !isStandaloneMode();
}

function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(isStandaloneMode());

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  return {
    deferredPrompt,
    setDeferredPrompt,
    isInstalled,
  };
}

export function InstallPwaButton({
  appName = "Aplikacja",
  className = "",
  onInstalled,
  onDismissed,
  onOpenInstructions,
}: InstallPwaButtonProps) {
  const { deferredPrompt, setDeferredPrompt, isInstalled } = usePwaInstall();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const mode = useMemo<
    "installed" | "native" | "ios-manual" | "unsupported"
  >(() => {
    if (isInstalled) return "installed";
    if (supportsNativeInstallPrompt(deferredPrompt)) return "native";
    if (canShowIosManualInstall()) return "ios-manual";
    return "unsupported";
  }, [deferredPrompt, isInstalled]);

  const buttonLabel = useMemo(() => {
    switch (mode) {
      case "native":
        return "Zainstaluj aplikację";
      case "ios-manual":
        return "Dodaj do ekranu głównego";
      case "installed":
        return "Aplikacja zainstalowana";
      default:
        return "Instalacja niedostępna";
    }
  }, [mode]);

  const isDisabled =
    mode === "installed" || mode === "unsupported" || isInstalling;

  const closeSheet = () => {
    setIsSheetOpen(false);
    onDismissed?.();
  };

  const handleInstallClick = async () => {
    if (mode === "native" && deferredPrompt) {
      try {
        setIsInstalling(true);
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        if (choice.outcome === "accepted") {
          onInstalled?.();
        } else {
          onDismissed?.();
        }
      } catch {
        // intentionally quiet; UI already remains stable
      } finally {
        setDeferredPrompt(null);
        setIsInstalling(false);
      }
      return;
    }

    if (mode === "ios-manual") {
      setIsSheetOpen(true);
      onOpenInstructions?.();
    }
  };

  if (mode === "installed") {
    return (
      <div
        className={[
          "inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700",
          className,
        ].join(" ")}
        aria-live="polite"
      >
        <InstalledIcon />
        Aplikacja zainstalowana
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        disabled={isDisabled}
        className={[
          "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 py-3 text-[17px] font-semibold transition-all",
          "bg-[#007AFF] text-white shadow-sm",
          "hover:brightness-95 active:scale-[0.99]",
          "focus:outline-none focus:ring-4 focus:ring-blue-200",
          "disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500 disabled:shadow-none",
          className,
        ].join(" ")}
        aria-haspopup={mode === "ios-manual" ? "dialog" : undefined}
        aria-expanded={mode === "ios-manual" ? isSheetOpen : undefined}
      >
        <AddIcon />
        {buttonLabel}
      </button>

      {isSheetOpen && (
        <IosInstallSheet appName={appName} onClose={closeSheet} />
      )}
    </>
  );
}

type IosInstallSheetProps = {
  appName: string;
  onClose: () => void;
};

function IosInstallSheet({ appName, onClose }: IosInstallSheetProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-install-sheet-title"
      aria-describedby="ios-install-sheet-description"
    >
      <button
        type="button"
        aria-label="Zamknij"
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-md rounded-t-[28px] bg-white px-5 pb-8 pt-3 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-zinc-300" />

        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100">
            <PhoneIcon />
          </div>

          <div className="min-w-0">
            <h2
              id="ios-install-sheet-title"
              className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-zinc-950"
            >
              Dodaj „{appName}” do ekranu głównego
            </h2>
            <p
              id="ios-install-sheet-description"
              className="mt-1 text-[15px] leading-6 text-zinc-600"
            >
              Na iPhonie instalacja aplikacji odbywa się z poziomu Safari przez
              menu udostępniania.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-zinc-50 p-4">
          <ol className="space-y-4">
            <InstructionRow
              step="1"
              title="Kliknij przycisk Udostępnij"
              subtitle="Znajdziesz go na dole lub u góry ekranu w Safari."
              accessory={<ShareIcon />}
            />
            <InstructionRow
              step="2"
              title="Wybierz „Dodaj do ekranu głównego”"
              subtitle="Przewiń listę akcji, aż zobaczysz tę opcję."
              accessory={<AddToHomeScreenIcon />}
            />
            <InstructionRow
              step="3"
              title="Otwórz aplikację z nowej ikony"
              subtitle="Po dodaniu uruchamiaj ją z ekranu głównego jak zwykłą aplikację."
              accessory={<InstalledIcon />}
            />
          </ol>
        </div>

        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#007AFF] px-5 py-3 text-[17px] font-semibold text-white shadow-sm transition hover:brightness-95 active:scale-[0.99]"
          >
            Rozumiem
          </button>

          <p className="text-center text-[13px] leading-5 text-zinc-500">
            Gdy uruchomisz aplikację z ekranu głównego, możesz później włączyć
            powiadomienia.
          </p>
        </div>
      </div>
    </div>
  );
}

type InstructionRowProps = {
  step: string;
  title: string;
  subtitle: string;
  accessory?: React.ReactNode;
};

function InstructionRow({
  step,
  title,
  subtitle,
  accessory,
}: InstructionRowProps) {
  return (
    <li className="flex items-start gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#007AFF] text-sm font-semibold text-white">
        {step}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[16px] font-medium leading-6 text-zinc-950">
          {title}
        </div>
        <div className="mt-0.5 text-[14px] leading-5 text-zinc-600">
          {subtitle}
        </div>
      </div>

      {accessory && (
        <div className="mt-0.5 shrink-0 text-zinc-500">{accessory}</div>
      )}
    </li>
  );
}

/* ---------------- Icons ---------------- */

function AddIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function InstalledIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m5 12 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10 5.5h4" strokeLinecap="round" />
      <circle cx="12" cy="18.5" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 16V4" strokeLinecap="round" />
      <path d="m8 8 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5 14v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AddToHomeScreenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="4" y="5" width="16" height="14" rx="3" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  );
}

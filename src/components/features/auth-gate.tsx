import { useState, useEffect, useRef } from "react";
import { Drawer } from "vaul";
import { ArrowLeft, Smartphone } from "lucide-react";
import type { RoleMode } from "@/types/domain";
import { cn } from "@/lib/utils";

interface AuthGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: RoleMode;
  onComplete: () => void;
}

type AuthStep = "methods" | "phone" | "code";

const ACCENT: Record<RoleMode, string> = {
  family: "#007AFF",
  caregiver: "#FF9500",
};

const AppleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="shrink-0"
  >
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

export const AuthGate = ({
  open,
  onOpenChange,
  mode,
  onComplete,
}: AuthGateProps) => {
  const [step, setStep] = useState<AuthStep>("methods");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const color = ACCENT[mode];
  const isFamily = mode === "family";

  // Reset state when drawer closes
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep("methods");
        setPhone("");
        setCode(["", "", "", "", "", ""]);
        setTimer(60);
        setVerifying(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Timer countdown for SMS code
  useEffect(() => {
    if (step !== "code" || timer <= 0) return;
    const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timer]);

  const handleSocialAuth = () => {
    setVerifying(true);
    setTimeout(onComplete, 800);
  };

  const handleCodeChange = (idx: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const next = [...code];
    next[idx] = val;
    setCode(next);
    if (val && idx < 5) codeRefs.current[idx + 1]?.focus();
    if (next.every((d) => d !== "")) {
      setVerifying(true);
      setTimeout(onComplete, 1200);
    }
  };

  const handleCodeKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      codeRefs.current[idx - 1]?.focus();
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px]" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[85dvh] flex-col rounded-t-[20px] bg-white outline-none">
          {/* Grabber */}
          <div className="shrink-0">
            <div className="mx-auto mt-2.5 mb-0 h-[5px] w-9 rounded-full bg-[#c7c7cc]" />
          </div>

          <Drawer.Title className="sr-only">Logowanie</Drawer.Title>
          <Drawer.Description className="sr-only">
            Zaloguj się lub utwórz konto, aby kontynuować
          </Drawer.Description>

          <div className="flex-1 overflow-y-auto overscroll-contain px-6 pt-4 pb-[max(env(safe-area-inset-bottom),24px)]">
            {/* ─── STEP: Auth Methods ─── */}
            {step === "methods" && (
              <>
                {/* Mode badge */}
                <div
                  className={cn(
                    "mb-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5",
                    isFamily ? "bg-[#007AFF]/10" : "bg-[#FF9500]/10",
                  )}
                >
                  <span className="text-[14px]">{isFamily ? "🔍" : "🩺"}</span>
                  <span
                    className={cn(
                      "text-[12px] font-semibold",
                      isFamily ? "text-[#007AFF]" : "text-[#FF9500]",
                    )}
                  >
                    {isFamily ? "Szukam opiekuna" : "Jestem opiekunem"}
                  </span>
                </div>

                <h3 className="text-[22px] font-bold tracking-[-0.26px] text-[#1c1c1e]">
                  {isFamily
                    ? "Zaloguj się, aby kontynuować"
                    : "Zaloguj się, aby zacząć"}
                </h3>
                <p className="mt-1 mb-6 text-[15px] leading-[22px] text-[#8e8e93]">
                  {isFamily
                    ? "Konto pozwala na kontakt z opiekunami i zapisywanie profili."
                    : "Konto potrzebne do stworzenia profilu i otrzymywania zleceń."}
                </p>

                <div className="space-y-2.5">
                  {/* Apple Sign In */}
                  <button
                    type="button"
                    onClick={handleSocialAuth}
                    className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[13px] bg-[#1c1c1e] text-[15px] font-semibold text-white transition-opacity active:opacity-80"
                  >
                    <AppleIcon />
                    Kontynuuj z Apple
                  </button>

                  {/* Google Sign In */}
                  <button
                    type="button"
                    onClick={handleSocialAuth}
                    className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[13px] border border-[#e5e5ea] bg-white text-[15px] font-semibold text-[#3c3c43] transition-opacity active:opacity-80"
                  >
                    <GoogleIcon />
                    Kontynuuj z Google
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 py-1">
                    <div className="h-px flex-1 bg-[#e5e5ea]" />
                    <span className="text-[13px] text-[#c7c7cc]">lub</span>
                    <div className="h-px flex-1 bg-[#e5e5ea]" />
                  </div>

                  {/* Phone */}
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[13px] border border-[#e5e5ea] bg-white text-[15px] font-semibold text-[#3c3c43] transition-opacity active:opacity-80"
                  >
                    <Smartphone className="size-[18px]" />
                    Użyj numeru telefonu
                  </button>
                </div>

                {/* Legal text */}
                <p className="mt-5 text-center text-[11px] leading-[16px] text-[#8e8e93]">
                  Kontynuując, akceptujesz{" "}
                  <span className="font-semibold" style={{ color }}>
                    Regulamin
                  </span>{" "}
                  i{" "}
                  <span className="font-semibold" style={{ color }}>
                    Politykę Prywatności
                  </span>
                </p>
              </>
            )}

            {/* ─── STEP: Phone Number ─── */}
            {step === "phone" && (
              <>
                <button
                  type="button"
                  onClick={() => setStep("methods")}
                  className="mb-3 flex items-center gap-1 text-[15px] font-medium text-[#8e8e93] transition-opacity active:opacity-50"
                >
                  <ArrowLeft className="size-4" />
                  Wróć
                </button>

                <h3 className="text-[22px] font-bold tracking-[-0.26px] text-[#1c1c1e]">
                  Numer telefonu
                </h3>
                <p className="mt-1 mb-6 text-[15px] text-[#8e8e93]">
                  Wyślemy Ci kod SMS do weryfikacji.
                </p>

                <div
                  className="flex h-[52px] items-center gap-2.5 rounded-[13px] border-2 px-4 transition-colors"
                  style={{ borderColor: phone.length > 0 ? color : "#e5e5ea" }}
                >
                  <span className="shrink-0 text-[15px] font-semibold text-[#8e8e93]">
                    🇵🇱 +48
                  </span>
                  <div className="h-5 w-px bg-[#e5e5ea]" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="000 000 000"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))
                    }
                    className="min-w-0 flex-1 bg-transparent text-[17px] font-semibold tracking-[1.5px] text-[#1c1c1e] placeholder:text-[#c7c7cc] focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  disabled={phone.length < 9}
                  onClick={() => {
                    setStep("code");
                    setTimer(60);
                  }}
                  className="mt-5 h-[50px] w-full rounded-[14px] text-[16px] font-bold transition-all active:scale-[0.98] disabled:cursor-default"
                  style={{
                    backgroundColor: phone.length >= 9 ? color : "#f2f2f7",
                    color: phone.length >= 9 ? "#fff" : "#c7c7cc",
                  }}
                >
                  Wyślij kod
                </button>
              </>
            )}

            {/* ─── STEP: SMS Code ─── */}
            {step === "code" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setCode(["", "", "", "", "", ""]);
                    setVerifying(false);
                  }}
                  className="mb-3 flex items-center gap-1 text-[15px] font-medium text-[#8e8e93] transition-opacity active:opacity-50"
                >
                  <ArrowLeft className="size-4" />
                  Wróć
                </button>

                <h3 className="text-[22px] font-bold tracking-[-0.26px] text-[#1c1c1e]">
                  Wpisz kod
                </h3>
                <p className="mt-1 mb-6 text-[15px] text-[#8e8e93]">
                  Wysłaliśmy SMS na{" "}
                  <span className="font-semibold text-[#1c1c1e]">
                    +48 {phone}
                  </span>
                </p>

                <div className="mb-5 flex justify-center gap-2">
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        codeRefs.current[i] = el;
                      }}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      className="size-[46px] rounded-xl border-2 text-center text-[20px] font-bold text-[#1c1c1e] transition-all focus:outline-none"
                      style={{
                        borderColor: digit ? color : "#e5e5ea",
                        backgroundColor: digit ? `${color}14` : "#fff",
                      }}
                    />
                  ))}
                </div>

                {verifying ? (
                  <div className="flex items-center justify-center gap-2 text-[14px] font-semibold text-[#34C759]">
                    <div className="grid size-[18px] place-items-center rounded-full bg-[#34C759] text-[10px] text-white">
                      ✓
                    </div>
                    Weryfikuję...
                  </div>
                ) : (
                  <div className="text-center">
                    {timer > 0 ? (
                      <span className="text-[13px] text-[#8e8e93]">
                        Wyślij ponownie za{" "}
                        <span className="font-bold text-[#3c3c43]">
                          {timer}s
                        </span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setTimer(60)}
                        className="text-[13px] font-semibold underline transition-opacity active:opacity-50"
                        style={{ color }}
                      >
                        Wyślij kod ponownie
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

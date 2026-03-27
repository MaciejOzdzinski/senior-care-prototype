import { useState } from "react";
import { AuthGate } from "@/components/features/auth-gate";
import { CaregiverFlow } from "@/components/features/caregiver-flow";
import { FamilyDiscovery } from "@/components/features/family-discovery";
import { RoleSelector } from "@/components/features/role-selector";
import type { RoleMode } from "@/types/domain";

const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

type Screen = "role" | "family" | "caregiver";

const FAMILY_AUTH_KEY = "carematch_family_auth";

const App = () => {
  const [role, setRole] = useState<RoleMode>("family");
  const [screen, setScreen] = useState<Screen>("role");
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(FAMILY_AUTH_KEY) === "true",
  );
  const [authGateOpen, setAuthGateOpen] = useState(false);

  const handleFamilyAuthComplete = () => {
    localStorage.setItem(FAMILY_AUTH_KEY, "true");
    setIsAuthenticated(true);
    setAuthGateOpen(false);
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
                if (nextRole === "caregiver") {
                  setScreen("caregiver");
                } else {
                  setScreen("family");
                }
              }}
            />
          </div>
        </div>
      ) : screen === "family" ? (
        <FamilyDiscovery
          onBack={() => setScreen("role")}
          isAuthenticated={isAuthenticated}
          onRequireAuth={() => setAuthGateOpen(true)}
        />
      ) : (
        <CaregiverFlow onBack={() => setScreen("role")} />
      )}

      {/* Auth Gate — family mode only */}
      <AuthGate
        open={authGateOpen}
        onOpenChange={setAuthGateOpen}
        mode="family"
        onComplete={handleFamilyAuthComplete}
      />
    </div>
  );
};

export default App;

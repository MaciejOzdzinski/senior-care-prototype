import { InstallPwaButton } from "@/components/features/InstallPwaButton";

export default function MessagesEmptyState() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-zinc-950">
        Nie przegap nowych wiadomości
      </h3>
      <p className="mt-2 text-zinc-600">
        Dodaj aplikację do ekranu głównego, żeby szybciej wracać do rozmów.
      </p>

      <div className="mt-4">
        <InstallPwaButton appName="Opiekun" />
      </div>
    </div>
  );
}

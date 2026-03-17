export function SwipeHint() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center pt-10">
      <div className="rounded-full bg-black/50 px-4 py-1.5 text-[13px] font-medium text-white backdrop-blur-sm">
        ← Przesuń w lewo lub prawo →
      </div>
    </div>
  );
}

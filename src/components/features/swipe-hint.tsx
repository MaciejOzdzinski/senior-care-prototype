import { useEffect, useState } from "react";

export function SwipeHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("carematch-swipe-hint");
    if (!shown) {
      setVisible(true);
      sessionStorage.setItem("carematch-swipe-hint", "1");
      const timer = setTimeout(() => setVisible(false), 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-end justify-center pb-24">
      <div className="animate-swipe-hint rounded-full bg-black/60 px-6 py-3 text-[15px] font-medium text-white backdrop-blur-sm">
        ← Przesuń kartę w lewo lub prawo →
      </div>
    </div>
  );
}

import {
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type PointerEvent,
} from "react";

interface SwipeCardProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: ReactNode;
}

const SWIPE_THRESHOLD = 80;
const ROTATION_FACTOR = 0.12;

export function SwipeCard({
  onSwipeLeft,
  onSwipeRight,
  children,
}: SwipeCardProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (isExiting) return;
      setIsDragging(true);
      startPos.current = { x: e.clientX, y: e.clientY };
      cardRef.current?.setPointerCapture(e.pointerId);
    },
    [isExiting],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!isDragging || isExiting) return;
      setOffset({
        x: e.clientX - startPos.current.x,
        y: (e.clientY - startPos.current.y) * 0.3,
      });
    },
    [isDragging, isExiting],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging || isExiting) return;
    setIsDragging(false);

    if (Math.abs(offset.x) > SWIPE_THRESHOLD) {
      const direction = offset.x > 0 ? 1 : -1;
      setIsExiting(true);
      setOffset((prev) => ({ x: direction * 500, y: prev.y }));
      setTimeout(() => {
        setIsExiting(false);
        setOffset({ x: 0, y: 0 });
        if (direction > 0) onSwipeRight();
        else onSwipeLeft();
      }, 280);
    } else {
      setOffset({ x: 0, y: 0 });
    }
  }, [isDragging, isExiting, offset, onSwipeLeft, onSwipeRight]);

  const rotation = offset.x * ROTATION_FACTOR;
  const indicatorOpacity = Math.min(Math.abs(offset.x) / SWIPE_THRESHOLD, 1);

  return (
    <div className="relative">
      <div
        ref={cardRef}
        className="touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: `translateX(${offset.x}px) translateY(${offset.y}px) rotate(${rotation}deg)`,
          transition: isDragging
            ? "none"
            : "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {/* Swipe right indicator — KONTAKT */}
        <div
          className="pointer-events-none absolute left-5 top-5 z-20 rounded-xl border-[3px] border-[#34C759] px-4 py-2 text-lg font-bold text-[#34C759]"
          style={{
            opacity: offset.x > 10 ? indicatorOpacity : 0,
            transform: "rotate(-12deg)",
            transition: isDragging ? "none" : "opacity 0.2s",
          }}
        >
          KONTAKT ♥
        </div>

        {/* Swipe left indicator — POMIŃ */}
        <div
          className="pointer-events-none absolute right-5 top-5 z-20 rounded-xl border-[3px] border-[#FF3B30] px-4 py-2 text-lg font-bold text-[#FF3B30]"
          style={{
            opacity: offset.x < -10 ? indicatorOpacity : 0,
            transform: "rotate(12deg)",
            transition: isDragging ? "none" : "opacity 0.2s",
          }}
        >
          POMIŃ ✕
        </div>

        {children}
      </div>
    </div>
  );
}

import { type ReactNode, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SwipeCardProps {
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
  style?: React.CSSProperties;
  onTap?: () => void;
  onContact?: () => void;
  onSave?: () => void;
  children: ReactNode;
}

export function SwipeCard({
  onSwipe,
  isTop,
  style,
  onTap,
  onContact,
  onSave,
  children,
}: SwipeCardProps) {
  const [dragState, setDragState] = useState({ x: 0, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null,
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0 });
  const hasMoved = useRef(false);

  const handleStart = (clientX: number) => {
    if (!isTop) return;
    setIsDragging(true);
    hasMoved.current = false;
    startPos.current = { x: clientX };
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !isTop) return;

    const deltaX = clientX - startPos.current.x;
    if (Math.abs(deltaX) > 4) hasMoved.current = true;
    const rotation = deltaX * 0.04;

    setDragState({ x: deltaX, rotation });

    if (deltaX > 50) setSwipeDirection("right");
    else if (deltaX < -50) setSwipeDirection("left");
    else setSwipeDirection(null);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;

    if (dragState.x > threshold) {
      animateOut("right");
    } else if (dragState.x < -threshold) {
      animateOut("left");
    } else {
      if (!hasMoved.current && onTap) onTap();
      setDragState({ x: 0, rotation: 0 });
      setSwipeDirection(null);
    }
  };

  const animateOut = (direction: "left" | "right") => {
    const x = direction === "right" ? 400 : -400;
    const rotation = direction === "right" ? 12 : -12;

    setDragState({ x, rotation });
    setTimeout(() => {
      onSwipe(direction);
      setDragState({ x: 0, rotation: 0 });
      setSwipeDirection(null);
    }, 300);
  };

  const handleButtonSwipe = (direction: "left" | "right") => {
    if (!isTop) return;
    setSwipeDirection(direction);
    animateOut(direction);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute inset-0 rounded-2xl overflow-hidden",
        "border border-black/4 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]",
        isDragging && "cursor-grabbing",
        !isTop && "pointer-events-none",
        isTop && "cursor-grab",
      )}
      style={{
        ...style,
        transform: isTop
          ? `translateX(${dragState.x}px) rotate(${dragState.rotation}deg)`
          : style?.transform,
        transition: isDragging
          ? "none"
          : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={() => isDragging && handleEnd()}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {/* Swipe right indicator — pill */}
      <div
        className={cn(
          "absolute top-5 right-5 z-10 rounded-full px-4 py-2 transition-all duration-200",
          "bg-[#007AFF] shadow-[0_2px_12px_rgba(0,122,255,0.4)]",
          swipeDirection === "right"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90",
        )}
      >
        <span className="text-[15px] font-semibold tracking-tight text-white">
          Zapisano
        </span>
      </div>

      {/* Swipe left indicator — pill */}
      <div
        className={cn(
          "absolute top-5 left-5 z-10 rounded-full px-4 py-2 transition-all duration-200",
          "bg-[#8e8e93] shadow-[0_2px_12px_rgba(142,142,147,0.4)]",
          swipeDirection === "left"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90",
        )}
      >
        <span className="text-[15px] font-semibold tracking-tight text-white">
          Pominięto
        </span>
      </div>

      {/* Card content */}
      <div className="flex h-full flex-col p-4">
        {children}

        {/* Decision buttons — HIG 3-tier hierarchy */}
        {isTop && (
          <div
            className="flex items-center justify-center gap-4 pt-2"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {/* Tertiary — text-only, lowest visual weight */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleButtonSwipe("left");
              }}
              className="px-4 py-2.5 text-[15px] font-medium text-[#8e8e93] transition-opacity active:opacity-50"
            >
              Pomiń
            </button>

            {/* Primary — filled, highest visual weight */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onContact?.();
              }}
              className="rounded-full bg-[#007AFF] px-6 py-2.5 text-[15px] font-semibold text-white shadow-[0_2px_10px_rgba(0,122,255,0.35)] transition-transform active:scale-95"
            >
              Napisz
            </button>

            {/* Secondary — tinted, medium visual weight */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSave?.();
                handleButtonSwipe("right");
              }}
              className="rounded-full bg-[#007AFF]/10 px-5 py-2.5 text-[15px] font-semibold text-[#007AFF] transition-transform active:scale-95"
            >
              Zapisz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

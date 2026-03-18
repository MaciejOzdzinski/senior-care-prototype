import { type ReactNode, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeCardProps {
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
  style?: React.CSSProperties;
  onTap?: () => void;
  children: ReactNode;
}

export function SwipeCard({
  onSwipe,
  isTop,
  style,
  onTap,
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
      {/* Swipe right indicator — iOS pill */}
      <div
        className={cn(
          "absolute top-5 right-5 z-10 rounded-full px-4 py-2 transition-all duration-200",
          "bg-[#34C759] shadow-[0_2px_12px_rgba(52,199,89,0.4)]",
          swipeDirection === "right"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90",
        )}
      >
        <span className="text-[15px] font-semibold tracking-tight text-white">
          Zainteresowany
        </span>
      </div>

      {/* Swipe left indicator — iOS pill */}
      <div
        className={cn(
          "absolute top-5 left-5 z-10 rounded-full px-4 py-2 transition-all duration-200",
          "bg-[#FF3B30] shadow-[0_2px_12px_rgba(255,59,48,0.4)]",
          swipeDirection === "left"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90",
        )}
      >
        <span className="text-[15px] font-semibold tracking-tight text-white">
          Pomijam
        </span>
      </div>

      {/* Card content */}
      <div className="flex h-full flex-col p-5">
        {children}

        {/* Action buttons — round, iOS 44pt touch targets */}
        {isTop && (
          <div className="flex justify-center gap-5 pt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleButtonSwipe("left");
              }}
              className={cn(
                "flex size-[60px] items-center justify-center rounded-full",
                "bg-[#FF3B30]/10 active:bg-[#FF3B30]/20",
                "transition-transform duration-200 active:scale-95",
                "shadow-[0_2px_8px_rgba(255,59,48,0.15)]",
              )}
              aria-label="Pomiń"
            >
              <X className="size-7 text-[#FF3B30]" strokeWidth={2.5} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleButtonSwipe("right");
              }}
              className={cn(
                "flex size-[60px] items-center justify-center rounded-full",
                "bg-[#34C759]/10 active:bg-[#34C759]/20",
                "transition-transform duration-200 active:scale-95",
                "shadow-[0_2px_8px_rgba(52,199,89,0.15)]",
              )}
              aria-label="Zainteresowany"
            >
              <Check className="size-7 text-[#34C759]" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

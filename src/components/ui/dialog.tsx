import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export function GlassDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: GlassDialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
        <BaseDialog.Popup className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl bg-white p-6 text-[#1c1c1e] shadow-[0_25px_60px_rgba(0,0,0,0.18)] md:inset-x-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <BaseDialog.Title className="text-xl font-semibold tracking-tight text-[#1c1c1e]">
                {title}
              </BaseDialog.Title>
              {description ? (
                <BaseDialog.Description className="mt-1 text-sm text-[#8e8e93]">
                  {description}
                </BaseDialog.Description>
              ) : null}
            </div>
            <BaseDialog.Close
              className={cn(
                "rounded-full bg-[#f2f2f7] p-2 text-[#8e8e93] hover:bg-[#e5e5ea]",
              )}
            >
              <X className="size-4" />
            </BaseDialog.Close>
          </div>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

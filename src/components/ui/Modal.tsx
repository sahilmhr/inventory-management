import { X } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Button } from "./Button";

interface ModalProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onClose: () => void;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/45 p-0 backdrop-blur-sm sm:place-items-center sm:p-6">
      <section className="max-h-[92vh] w-full overflow-y-auto rounded-t-xl bg-white p-5 shadow-2xl animate-fade-in dark:bg-slate-950 sm:max-w-2xl sm:rounded-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
          <Button aria-label="Close" variant="ghost" className="h-10 w-10 px-0" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}

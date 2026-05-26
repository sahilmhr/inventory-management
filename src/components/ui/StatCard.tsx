import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  tone?: "teal" | "blue" | "amber" | "rose" | "slate";
}

const tones = {
  teal: "bg-brand-50 text-brand-800 dark:bg-brand-900/35 dark:text-brand-100",
  blue: "bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-100",
  amber: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-100",
  rose: "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-100",
  slate: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
};

export function StatCard({ title, value, detail, icon, tone = "teal" }: StatCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-normal text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 truncate text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
          {detail ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{detail}</p> : null}
        </div>
        {icon ? <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-md", tones[tone])}>{icon}</div> : null}
      </div>
    </article>
  );
}

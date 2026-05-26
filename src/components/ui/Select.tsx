import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, className, children, ...props }, ref) => {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
      {label ? <span>{label}</span> : null}
      <select
        ref={ref}
        className={cn(
          "min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
          error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
});

Select.displayName = "Select";

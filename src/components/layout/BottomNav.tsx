import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import type { Role } from "../../types";
import { navItems } from "./Sidebar";

export function BottomNav({ role }: { role: Role }) {
  const visibleItems = navItems
    .filter((item, index, list) => item.roles.includes(role) && list.findIndex((navItem) => navItem.href === item.href) === index)
    .slice(0, role === "admin" ? 5 : 1);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-flow-col border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
      {visibleItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "grid min-h-14 place-items-center gap-1 rounded-md px-2 text-[11px] font-semibold transition",
                isActive ? "bg-brand-50 text-brand-800 dark:bg-brand-900/40 dark:text-brand-100" : "text-slate-500 dark:text-slate-400"
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

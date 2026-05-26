import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Boxes, FileText, LayoutDashboard, PackageCheck, Share2, ShoppingCart, Users } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Role } from "../../types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["admin"] },
  { label: "Inventory", href: "/inventory", icon: Boxes, roles: ["admin"] },
  { label: "Sales", href: "/sales", icon: ShoppingCart, roles: ["admin"] },
  { label: "Reports", href: "/reports", icon: FileText, roles: ["admin"] },
  { label: "Share Stock", href: "/share", icon: Share2, roles: ["admin"] },
  { label: "Employees", href: "/settings", icon: Users, roles: ["admin"] },
  { label: "Stock", href: "/employee-stock", icon: PackageCheck, roles: ["employee"] },
  { label: "Analytics", href: "/", icon: BarChart3, roles: ["admin"] }
];

export function Sidebar({ role }: { role: Role }) {
  const visibleItems = navItems.filter((item, index, list) => item.roles.includes(role) && list.findIndex((navItem) => navItem.href === item.href) === index);

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950 lg:block">
      <div className="flex items-center gap-3 px-2">
        <img src="/icons/icon.svg" alt="" className="h-11 w-11 rounded-lg" />
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-brand-700 dark:text-brand-400">Retail Pocket</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Offline shop control</p>
        </div>
      </div>
      <nav className="mt-8 grid gap-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-brand-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

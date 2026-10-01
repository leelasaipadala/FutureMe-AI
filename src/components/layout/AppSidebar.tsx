"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitBranch,
  Target,
  Activity,
  Sparkles,
  BarChart2,
  CalendarDays,
  FileText,
  Settings,
  Crown,
  Telescope,
} from "lucide-react";

const navItems = [
  { href: "/dashboard",      label: "Dashboard",         icon: LayoutDashboard },
  { href: "/timeline",       label: "Timeline",           icon: GitBranch },
  { href: "/goals",          label: "Goals",              icon: Target },
  { href: "/habits",         label: "Habits",             icon: Activity },
  { href: "/scenarios/new",  label: "What-If Simulator",  icon: Sparkles },
  { href: "/insights",       label: "Insights",           icon: BarChart2 },
  { href: "/calendar",       label: "Calendar",           icon: CalendarDays },
  { href: "/notes",          label: "Notes",              icon: FileText },
  { href: "/settings",       label: "Settings",           icon: Settings },
];

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(`/${href.split("/")[1]}`);
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-white h-screen sticky top-0 overflow-y-auto z-30">
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm shadow-primary/30">
          <Telescope className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="font-extrabold text-base leading-none text-foreground">FutureMe AI</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Design Your Future</p>
        </div>
      </div>

      {/* ── Nav Items ── */}
      <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href, pathname || "");
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-5 space-y-5">
        {/* Motivational quote */}
        <p className="text-[11px] text-muted-foreground text-center leading-relaxed px-1 italic">
          "Small steps today,<br />Big changes tomorrow."
        </p>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Bell, ChevronDown, User, Settings, FileText, Sparkles, LogOut, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/app/actions/auth";

const mobileNavItems = [
  { href: "/dashboard",     label: "Dashboard" },
  { href: "/goals",         label: "Goals" },
  { href: "/habits",        label: "Habits" },
  { href: "/timeline",      label: "Timeline" },
  { href: "/scenarios/new", label: "Simulator" },
  { href: "/insights",      label: "Insights" },
  { href: "/calendar",      label: "Calendar" },
  { href: "/notes",         label: "Notes" },
  { href: "/settings",      label: "Settings" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "short", year: "numeric",
  });
}

export function AppTopBar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [userEmail, setUserEmail] = useState("guest@example.com");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      if (user) {
        setUserName(user.name);
        setUserEmail(user.email);
      } else {
        router.push("/login");
      }
    }
    loadUser();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const initial = userName.charAt(0).toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-md h-16 flex items-center px-5 gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        
        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-muted/60 transition-colors text-muted-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Greeting – left side */}
        <div className="flex-1 hidden sm:block">
          <p className="text-[15px] font-extrabold text-foreground leading-tight">
            {getGreeting()}, {userName} 👋
          </p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
            {getFormattedDate()}
          </p>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Notification bell */}
          <button className="relative p-2.5 rounded-xl hover:bg-primary/10 transition-colors group">
            <Bell className="w-[18px] h-[18px] text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-border mx-1" />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setMobileOpen(false); }}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center font-extrabold text-white text-sm shadow-sm shadow-primary/30">
                {initial}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold leading-none text-foreground">{userName}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">My Account</p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground hidden sm:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-border bg-white shadow-xl shadow-black/5 py-2 z-50 animate-scale-in">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-border mb-1 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center font-extrabold text-white text-sm shrink-0">
                      {initial}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{userName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[140px]">{userEmail}</p>
                    </div>
                  </div>

                  {/* Menu items */}
                  {[
                    { href: "/profile",  label: "My Profile",   icon: User },
                    { href: "/insights", label: "AI Insights",  icon: Sparkles },
                    { href: "/notes",    label: "Notes",        icon: FileText },
                    { href: "/settings", label: "Settings",     icon: Settings },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href} onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </Link>
                  ))}

                  {/* Logout */}
                  <div className="border-t border-border mt-1 pt-1">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors rounded-b-2xl">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 pt-16">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-white border-r border-border w-64 h-full shadow-xl py-4 px-3 space-y-0.5 overflow-y-auto">
            {/* Greeting in mobile drawer */}
            <div className="px-3 pb-3 mb-2 border-b border-border">
              <p className="text-sm font-bold text-foreground">{getGreeting()}, {userName} 👋</p>
              <p className="text-xs text-muted-foreground mt-0.5">{getFormattedDate()}</p>
            </div>
            {mobileNavItems.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === href || pathname?.startsWith(`/${href.split("/")[1]}`)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}>
                {label}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2">
              <button onClick={handleLogout} className="w-full text-left block px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



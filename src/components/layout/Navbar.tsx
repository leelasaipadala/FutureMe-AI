"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Telescope } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm shadow-primary/30">
            <Telescope className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="font-extrabold text-[15px] leading-none text-foreground">FutureMe AI</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5 hidden sm:block">Design Your Future</p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: "/#how-it-works", label: "How It Works" },
            { href: "/#features",     label: "Features" },
            { href: "/#simulator",    label: "What-If Simulator" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Log in
          </Link>
          <Link href="/signup">
            <Button className="rounded-xl px-5 h-9 text-sm font-bold bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20">
              Get Started →
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DataProvider } from "@/context/DataContext";

const APP_ROUTES = [
  "/dashboard", "/goals", "/habits", "/analytics", "/timeline",
  "/scenarios", "/insights", "/calendar", "/notes", "/settings",
  "/profile",
];

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isApp = APP_ROUTES.some((r) => pathname?.startsWith(r));

  if (isApp) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
          <AppTopBar />
          <main className="flex-1 p-4 md:p-6 max-w-[1400px] w-full mx-auto">
            <DataProvider>
              {children}
            </DataProvider>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

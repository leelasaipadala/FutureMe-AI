import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ClientShell } from "@/components/layout/ClientShell";
import { ChatWidget } from "@/components/ChatWidget";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: { default: "FutureMe AI", template: "%s | FutureMe AI" },
  description: "Design your future by understanding your choices today. Simulate possible future outcomes based on your habits, goals, and decisions.",
  keywords: ["future planning", "AI life coach", "habit tracker", "goal setting", "scenario simulator"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable} data-scroll-behavior="smooth">
      <body className="bg-background text-foreground antialiased font-sans">
        <ClientShell>{children}</ClientShell>
        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            style: { borderRadius: "12px", fontFamily: "var(--font-sans)" },
          }}
        />
        <ChatWidget />
      </body>
    </html>
  );
}

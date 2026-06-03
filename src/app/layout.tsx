import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Potrošnja",
  description:
    "Brza evidencija pića uzetih iz zaliha za kuhinju i konobare.",
  applicationName: "Potrošnja",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Potrošnja",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0f14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // prevent zoom jump on input focus / double-tap
  viewportFit: "cover", // enable env(safe-area-inset-*)
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hr" className="dark h-full">
      <body className="min-h-full">
        <ToastProvider>
          {/* leave room for the fixed bottom nav (64px + safe area) */}
          <main className="mx-auto w-full max-w-2xl px-4 pb-[calc(72px+env(safe-area-inset-bottom))] pt-4">
            {children}
          </main>
          <BottomNav />
        </ToastProvider>
      </body>
    </html>
  );
}

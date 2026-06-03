"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, CupSoda } from "lucide-react";

const TABS = [
  { href: "/", label: "Unos", Icon: CupSoda },
  { href: "/istorija", label: "Istorija", Icon: ClipboardList },
  { href: "/izvjestaji", label: "Izvještaji", Icon: BarChart3 },
] as const;

function isActive(pathname: string, href: string) {
  const p = pathname.replace(/\/+$/, "") || "/";
  return p === href;
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-2xl">
        {TABS.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 select-none flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                active ? "text-accent" : "text-muted"
              }`}
            >
              <Icon size={24} strokeWidth={active ? 2.4 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

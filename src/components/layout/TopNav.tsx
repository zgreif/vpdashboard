"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

// ─── Add new pages here ────────────────────────────────────────────────────
// Each entry becomes a tab in the top nav automatically.
// Icons are from lucide-react. Examples:
//   import { BarChart2 }  from "lucide-react"  →  Margin Bridge
//   import { TrendingUp } from "lucide-react"  →  Forecast
const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  // { label: "Margin Bridge", href: "/margin-bridge", icon: BarChart2   },
  // { label: "Forecast",      href: "/forecast",      icon: TrendingUp  },
  // { label: "Settings",      href: "/settings",      icon: Settings    },
] as const;
// ──────────────────────────────────────────────────────────────────────────

interface TopNavProps {
  /** Buttons rendered in the right section (e.g. Upload Excel, Edit data, LTM toggle) */
  actions?: React.ReactNode;
  /** Tiny subtitle shown near the logo — e.g. "As of Dec 2024 (LTM)" */
  subtitle?: string;
}

export function TopNav({ actions, subtitle }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header className="bg-background border-b sticky top-0 z-30 shrink-0">
      <div className="flex h-14 items-stretch px-6 gap-0">

        {/* ── Logo ── */}
        <div className="flex items-center gap-3 pr-5 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-[15px] text-foreground">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground text-xs font-bold">F</span>
            </div>
            <span className="hidden sm:inline">{APP_NAME}</span>
          </Link>
          {subtitle && (
            <span className="hidden lg:block text-xs text-muted-foreground border-l pl-3">
              {subtitle}
            </span>
          )}
        </div>

        {/* ── Tabs ── full-height links with underline active state */}
        <nav className="flex items-stretch gap-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  // base: full height, padded, with a bottom border slot
                  "flex items-center gap-2 px-4 text-sm font-medium transition-colors border-b-2 -mb-px",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Right-side actions + theme toggle ── */}
        <div className="flex items-center gap-2">
          {actions}
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}

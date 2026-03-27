"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Add new pages here — each entry automatically appears in the sidebar.
 * Example: { label: "Margin Bridge", href: "/margin-bridge", icon: BarChart2 }
 */
const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  // { label: "Margin Bridge", href: "/margin-bridge", icon: BarChart2 },
  // { label: "Forecast",      href: "/forecast",      icon: TrendingUp  },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarLogo() {
  return (
    <div className="flex h-16 items-center px-6 border-b shrink-0">
      <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-lg">
        <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground text-xs font-bold">F</span>
        </div>
        <span>{APP_NAME}</span>
      </Link>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-background h-screen sticky top-0 overflow-y-auto">
        <SidebarLogo />
        <div className="flex-1 py-4">
          <NavLinks />
        </div>
      </aside>

      {/* Mobile: hamburger button + slide-out Sheet */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-3 left-3 z-40 min-h-[44px] min-w-[44px]"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <SheetHeader className="p-0 sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <SidebarLogo />
            <div className="flex-1 py-4">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

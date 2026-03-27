import * as React from "react";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6 bg-background sticky top-0 z-30 shrink-0">
      <div className="pl-10 md:pl-0 min-w-0">
        <h1 className="text-lg font-semibold truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}

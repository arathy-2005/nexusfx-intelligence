"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/market", label: "Market" },
  { href: "/charts", label: "Charts" },
  { href: "/intelligence", label: "AI Desk" },
  { href: "/predictions", label: "Predictions" },
  { href: "/scanner", label: "Scanner" },
  { href: "/dashboard", label: "Desk" },
];

const MORE = [
  { href: "/models", label: "Model performance" },
  { href: "/monitoring", label: "Model monitoring" },
  { href: "/backtesting", label: "Backtesting" },
  { href: "/strategy", label: "Strategy builder" },
  { href: "/patterns", label: "Pattern scanner" },
  { href: "/calendar", label: "Calendar" },
  { href: "/news", label: "News" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/risk", label: "Risk" },
  { href: "/journal", label: "Journal" },
  { href: "/settings", label: "Settings" },
  { href: "/admin", label: "Admin" },
  { href: "/analysis", label: "Classic analysis" },
  { href: "/signals", label: "Signals" },
  { href: "/calculators", label: "Calculators" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b14]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400 text-slate-950">N</span>
          <span>{SITE_NAME}</span>
          <span className="hidden text-xs font-normal text-white/50 sm:inline">Intelligence</span>
        </Link>
        <nav className="hidden items-center gap-1 xl:flex">
          {PRIMARY.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm text-white/70 hover:bg-white/5 hover:text-white",
                pathname === l.href && "bg-white/10 text-white",
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="relative">
            <button type="button" className="rounded-md px-2.5 py-1.5 text-sm text-white/70 hover:bg-white/5" onClick={() => setMore((v) => !v)}>
              More
            </button>
            {more && (
              <div className="absolute right-0 z-50 mt-2 grid w-56 gap-1 rounded-xl border border-white/10 bg-[#0b1220] p-2 shadow-xl">
                {MORE.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setMore(false)} className="rounded-md px-2 py-1.5 text-sm text-white/80 hover:bg-white/5">
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="hidden h-4 w-4 dark:block" />
            <Moon className="h-4 w-4 dark:hidden" />
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="grid max-h-[70vh] gap-1 overflow-auto border-t border-white/10 px-4 py-3 xl:hidden">
          {[...PRIMARY, ...MORE].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-md px-2 py-2 text-sm hover:bg-white/5">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

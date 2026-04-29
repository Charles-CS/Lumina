"use client";

import Link from "next/link";
import { Sun, Moon, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { LuminaLogo } from "./LuminaLogo";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const currentTheme = mounted ? resolvedTheme : "dark";
  const activeTheme = mounted ? theme : "system";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white/80 dark:border-white/[0.06] dark:bg-[#050505]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6 md:px-12 relative">

        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="flex items-center justify-center rounded-lg border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.04] transition-colors group-hover:bg-black/10 dark:group-hover:bg-white/10 p-1">
            <LuminaLogo />
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-[11px] font-medium uppercase tracking-widest">
          <Link href="/" className={`${pathname === '/' ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'} transition-colors`}>Build</Link>
          <Link href="/templates" className={`${pathname === '/templates' ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'} transition-colors`}>Templates</Link>
          <Link href="/components" className={`${pathname === '/components' ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'} transition-colors`}>Components</Link>
          <Link href="/assets" className={`${pathname === '/assets' ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'} transition-colors`}>Assets</Link>
          <Link href="/explore" className={`${pathname === '/explore' ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'} transition-colors`}>Explore</Link>
          <Link href="/pricing" className={`${pathname === '/pricing' ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'} transition-colors`}>Pricing</Link>
          <Link href="/changelog" className={`${pathname === '/changelog' ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'} transition-colors`}>Changelog</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <div className="flex items-center gap-0.5 rounded-full border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.05] dark:bg-white/[0.02] p-0.5 shadow-inner">
            <button
              onClick={() => setTheme("light")}
              aria-label="Light mode"
              className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${activeTheme === "light"
                ? "bg-black/10 dark:bg-white/15 text-black dark:text-white shadow-sm"
                : "text-black/40 dark:text-white/60 hover:text-black dark:hover:text-white/90"
                }`}
            >
              <Sun size={11} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setTheme("system")}
              aria-label="System mode"
              className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${activeTheme === "system"
                ? "bg-black/10 dark:bg-white/15 text-black dark:text-white shadow-sm"
                : "text-black/40 dark:text-white/60 hover:text-black dark:hover:text-white/90"
                }`}
            >
              <Monitor size={11} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setTheme("dark")}
              aria-label="Dark mode"
              className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${activeTheme === "dark"
                ? "bg-black/10 dark:bg-white/15 text-black dark:text-white shadow-sm"
                : "text-black/40 dark:text-white/60 hover:text-black dark:hover:text-white/90"
                }`}
            >
              <Moon size={11} strokeWidth={2.5} />
            </button>
          </div>

          {/* Sign In / Profile */}
          {user ? (
            <Link href="/profile" className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-medium tracking-tight text-black/80 dark:text-white/90 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 cursor-pointer truncate max-w-[250px]">
              {user.email}
            </Link>
          ) : (
            <Link href="/login" className="px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-black dark:text-white/80 rounded-lg border border-transparent transition-all duration-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] hover:border-black/10 dark:hover:border-white/12 hover:text-black dark:hover:text-white cursor-pointer">
              Sign In
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}


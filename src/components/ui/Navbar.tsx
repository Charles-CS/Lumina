"use client";

import Link from "next/link";
import { Sun, Moon, Monitor, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { LuminaLogo } from "./LuminaLogo";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const currentTheme = mounted ? resolvedTheme : "dark";
  const activeTheme = mounted ? theme : "system";

  const navLinks = [
    { name: "Build", path: "/" },
    { name: "Templates", path: "/templates" },
    { name: "Components", path: "/components" },
    { name: "Assets", path: "/assets" },
    { name: "Explore", path: "/explore" },
    { name: "Pricing", path: "/pricing" },
    { name: "Changelog", path: "/changelog" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white/80 dark:border-white/[0.06] dark:bg-[#050505]/80 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6 md:px-12 relative">

        {/* Logo */}
        <Link href="/" className="flex items-center group relative z-50">
          <div className="flex items-center justify-center rounded-lg border border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.04] transition-colors group-hover:bg-black/10 dark:group-hover:bg-white/10 p-1">
            <LuminaLogo />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-[11px] font-medium uppercase tracking-widest">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`${pathname === link.path ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'} transition-colors`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 relative z-50">
          {/* Theme toggle */}
          <div className="hidden sm:flex items-center gap-0.5 rounded-full border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.05] dark:bg-white/[0.02] p-0.5 shadow-inner">
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
            <Link 
              href="/profile" 
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 text-[11px] font-medium text-black/70 dark:text-white/80 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-all duration-300 max-w-[200px] cursor-pointer"
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                <User size={10} className="text-black/60 dark:text-white/60" />
              </div>
              <span className="truncate pr-1">{user.email}</span>
            </Link>
          ) : (
            <Link href="/login" className="hidden sm:flex px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-black dark:text-white/80 rounded-lg border border-transparent transition-all duration-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] hover:border-black/10 dark:hover:border-white/12 hover:text-black dark:hover:text-white cursor-pointer">
              Sign In
            </Link>
          )}

          {/* Hamburger Menu Toggle (Mobile Only) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden items-center justify-center w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={18} strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={18} strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} // smooth spring-like ease
            className="absolute top-full left-0 w-full overflow-hidden border-b border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#050505] shadow-2xl md:hidden z-40"
          >
            <div className="flex flex-col p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <Link
                      href={link.path}
                      className={`text-lg font-medium tracking-wide ${pathname === link.path ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50'}`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="h-px w-full bg-black/5 dark:bg-white/5" />

              <div className="flex flex-col space-y-6">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <span className="text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-widest">Account</span>
                    <Link href="/profile" className="text-base font-medium text-black dark:text-white truncate">
                      {user.email}
                    </Link>
                  </div>
                ) : (
                  <Link href="/login" className="flex items-center justify-center w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                    Sign In to Lumina
                  </Link>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-widest">Theme</span>
                  <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.03] rounded-full p-1 border border-black/[0.08] dark:border-white/[0.05]">
                    <button
                      onClick={() => setTheme("light")}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${activeTheme === 'light' ? 'bg-white dark:bg-black/50 shadow-sm text-black dark:text-white' : 'text-black/40 dark:text-white/40'}`}
                    >
                      <Sun size={14} />
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${activeTheme === 'system' ? 'bg-white dark:bg-black/50 shadow-sm text-black dark:text-white' : 'text-black/40 dark:text-white/40'}`}
                    >
                      <Monitor size={14} />
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${activeTheme === 'dark' ? 'bg-white dark:bg-black/50 shadow-sm text-black dark:text-white' : 'text-black/40 dark:text-white/40'}`}
                    >
                      <Moon size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


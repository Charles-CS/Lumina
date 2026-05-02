"use client";

import Link from "next/link";
import { LuminaLogo } from "./LuminaLogo";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="w-full bg-white dark:bg-[#050505] text-black/70 dark:text-white/70 pt-20 pb-10 px-8 text-sm flex flex-col md:px-12 xl:px-24 border-t border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto w-full relative">
        {/* Back to top Button */}
        {mounted && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="absolute -top-12 right-0 hidden lg:flex items-center justify-center h-8 w-8 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronUp size={16} />
          </button>
        )}

        <div className="flex flex-col lg:flex-row justify-between mb-16 gap-16 lg:gap-8">
          {/* Brand & Description */}
          <div className="flex flex-col max-w-sm gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <LuminaLogo />
            </Link>
            <p className="text-black/50 dark:text-white/50 leading-relaxed text-[15px]">
              Lumina is an AI-powered visual builder that helps you create stunning websites effortlessly. Design, remix, and publish top-tier landing pages in seconds without writing a single line of code.
            </p>
          </div>

          {/* Links Columns */}
          <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-16">
            {/* PRODUCT */}
            <div className="flex flex-col gap-4 text-[13px]">
              <h4 className="text-[11px] font-semibold tracking-wider text-black/30 dark:text-white/30 uppercase mb-1">Product</h4>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Create</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Templates</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Components</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Assets</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Pricing</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Changelog</Link>
            </div>

            {/* RESOURCES */}
            <div className="flex flex-col gap-4 text-[13px]">
              <h4 className="text-[11px] font-semibold tracking-wider text-black/30 dark:text-white/30 uppercase mb-1">Resources</h4>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Pro Tips & Tricks</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Master the Prompt</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Lumina Roadmap</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Support my Vision</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Join the Discord</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Why Lumina? (FAQ)</Link>
            </div>

            {/* WHAT WE USE */}
            <div className="flex flex-col gap-4 text-[13px]">
              <h4 className="text-[11px] font-semibold tracking-wider text-black/30 dark:text-white/30 uppercase mb-1">What we use</h4>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Next.js 14</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Tailwind CSS</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Framer Motion</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Lucide Icons</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Vercel Edge</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Supabase DB</Link>
            </div>

            {/* CONNECT */}
            <div className="flex flex-col gap-4 text-[13px]">
              <h4 className="text-[11px] font-semibold tracking-wider text-black/30 dark:text-white/30 uppercase mb-1">Connect</h4>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Terms</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Support</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Report Issue</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">LinkedIn</Link>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">X</Link>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-black/5 dark:bg-white/5 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-[13px] text-black/40 dark:text-white/40 font-medium">
            <p>© {new Date().getFullYear()} Lumina. All rights reserved.</p>


          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center h-10 w-10 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" height="15" width="15"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </button>
            <button className="flex items-center justify-center h-10 w-10 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" height="15" width="15"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            </button>
            <button className="flex items-center justify-center h-10 w-10 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" height="15" width="15"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

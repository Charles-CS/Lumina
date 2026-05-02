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
              <Link href="/templates" className="hover:text-black dark:hover:text-white transition-colors">Templates</Link>
              <Link href="/components" className="hover:text-black dark:hover:text-white transition-colors">Components</Link>
              <Link href="/assets" className="hover:text-black dark:hover:text-white transition-colors">Assets</Link>
              <Link href="/pricing" className="hover:text-black dark:hover:text-white transition-colors">Pricing</Link>
              <Link href="/changelog" className="hover:text-black dark:hover:text-white transition-colors">Changelog</Link>
            </div>

            {/* RESOURCES */}
            <div className="flex flex-col gap-4 text-[13px]">
              <h4 className="text-[11px] font-semibold tracking-wider text-black/30 dark:text-white/30 uppercase mb-1">Resources</h4>
              <Link href="/docs/pro-tips" className="hover:text-black dark:hover:text-white transition-colors">Pro Tips & Tricks</Link>
              <Link href="/docs/mastering-lumina" className="hover:text-black dark:hover:text-white transition-colors">Master the Prompt</Link>
              <Link href="/roadmap" className="hover:text-black dark:hover:text-white transition-colors">Lumina Roadmap</Link>
              <Link href="/sponsor" className="hover:text-black dark:hover:text-white transition-colors">Support my Vision</Link>
              <a href="https://discord.com/invite/lumina" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">Join the Discord</a>
              <Link href="/faq" className="hover:text-black dark:hover:text-white transition-colors">Why Lumina? (FAQ)</Link>
            </div>

            {/* WHAT WE USE */}
            <div className="flex flex-col gap-4 text-[13px]">
              <h4 className="text-[11px] font-semibold tracking-wider text-black/30 dark:text-white/30 uppercase mb-1">What we use</h4>
              <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">Next.js 14</a>
              <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">Tailwind CSS</a>
              <a href="https://www.framer.com/motion/" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">Framer Motion</a>
              <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">Lucide Icons</a>
              <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">Vercel Edge</a>
              <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">Supabase DB</a>
            </div>

            {/* CONNECT */}
            <div className="flex flex-col gap-4 text-[13px]">
              <h4 className="text-[11px] font-semibold tracking-wider text-black/30 dark:text-white/30 uppercase mb-1">Connect</h4>
              <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-black dark:hover:text-white transition-colors">Support</Link>
              <Link href="/report-issue" className="hover:text-black dark:hover:text-white transition-colors">Report Issue</Link>
              <a href="https://www.linkedin.com/in/platon-charles-7b51a9403/" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
              <a href="https://www.instagram.com/chrls_plnkton/" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">Instagram</a>
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
            <a href="https://www.facebook.com/charles.platon.573221" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-10 w-10 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" height="15" width="15"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
            </a>
            <a href="https://www.instagram.com/chrls_plnkton/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-10 w-10 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" height="15" width="15"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            <a href="https://www.linkedin.com/in/platon-charles-7b51a9403/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-10 w-10 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" height="15" width="15"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

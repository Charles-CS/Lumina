"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { motion, useInView } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeType = "NEW" | "FEATURE" | "FIXES" | "IMPROVEMENT";

interface ChangeItem {
  type: BadgeType;
  title: string;
  description: string;
}

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: ChangeItem[];
  mainImage?: string;
  sideImages?: string[];
  isGenesis?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CHANGELOG: ChangelogEntry[] = [
  {
    version: "v2.0.0",
    date: "April 26, 2026",
    title: "The Lumina Redesign & Dual-Theme Engine",
    description:
      "Welcome to Lumina Engine v2.0. We have completely rewritten the underlying architecture for staggering performance, and introduced the highly anticipated Lumina design system. Everything you build now feels inherently more premium.",
    mainImage: "/images/changelog/landing-page.png",
    sideImages: [
      "/images/changelog/landing-page-right-1.png",
      "/images/changelog/landing-page-right-2.png",
      "/images/changelog/landing-page-right-3.png",
    ],
    changes: [
      {
        type: "NEW",
        title: "Lumina Engine v2.0 — Official Launch",
        description:
          "Lumina Engine v2.0 is officially out of Beta! The new engine brings a 40% performance improvement across all builder operations and a fully redesigned canvas experience.",
      },
      {
        type: "FEATURE",
        title: "Dual-Theme Engine",
        description:
          "Introduced the Dual-Theme Engine allowing seamless transition between dark and light modes using deep CSS variable support with zero flash on load.",
      },
      {
        type: "FEATURE",
        title: "Premium Pricing Page with Infinite Marquees",
        description:
          "New Premium Pricing Page featuring infinite marquees and abstract 3D glassmorphic art, showcasing our enterprise-ready positioning.",
      },
      {
        type: "FEATURE",
        title: "Explore Page with 3-Step Bento Grid",
        description:
          "New Explore Page showcasing a 3-step Bento Grid workflow that guides users from idea to deployed website in seconds.",
      },
      {
        type: "IMPROVEMENT",
        title: "Tailwind v4 & React 19 Native Support",
        description:
          "Upgraded all core components to utilize Tailwind v4 and React 19 natively, eliminating legacy polyfills and reducing bundle size by 18%.",
      },
    ],
  },
  {
    version: "v1.5.0",
    date: "April 22, 2026",
    title: "Launchcontrol & 1-Click Publishing",
    description:
      "Taking your website from the canvas to the live web is now instantaneous. We've introduced a comprehensive Launchcontrol panel for deployment, custom domains, and source code export.",
    mainImage: "/images/changelog/image-2.png",
    changes: [
      {
        type: "NEW",
        title: "Live Web Deployment",
        description:
          "Deploy your site instantly to our high-performance global edge network with a single click.",
      },
      {
        type: "FEATURE",
        title: "Custom Domain Connection",
        description:
          "Easily map and connect your custom domains directly within the platform with automated SSL provisioning.",
      },
      {
        type: "IMPROVEMENT",
        title: "SEO & Identity Preview",
        description:
          "Configure and preview your site's meta description, favicon, and search engine presence in real-time.",
      },
      {
        type: "FEATURE",
        title: "Advanced Code Export",
        description:
          "View raw HTML, CSS, and React/JS source code natively, or export the full project as a ZIP archive for manual deployment.",
      },
    ],
  },
  {
    version: "v1.4.0",
    date: "April 18, 2026",
    title: "The Ultimate Templates Library",
    description:
      "Kickstart your workflow with our massive new library of over 4,000 premium templates. From robust Web Apps to immersive 3D UI, everything is one click away.",
    mainImage: "/images/changelog/image-3.png",
    changes: [
      {
        type: "NEW",
        title: "4,000+ Premium Templates",
        description:
          "Access thousands of professionally crafted starting points, categorized across Web Apps, Mobile Apps, Portfolios, and Dashboards.",
      },
      {
        type: "FEATURE",
        title: "Instant Template Remixing",
        description:
          "Clone any layout instantly into your workspace and start modifying the structure and styles without setting up scaffolding.",
      },
      {
        type: "IMPROVEMENT",
        title: "Smart Taxonomy & Filtering",
        description:
          "Quickly find the perfect layout using robust filtering by category, recency, popularity, and premium status.",
      },
    ],
  },
  {
    version: "v1.3.0",
    date: "April 12, 2026",
    title: "Pro Components Architecture",
    description:
      "Stop rebuilding the wheel. We've launched a comprehensive components ecosystem allowing you to drag-and-drop complex, interactive elements right onto your canvas.",
    mainImage: "/images/changelog/image-4.png",
    changes: [
      {
        type: "NEW",
        title: "Pre-built Component Ecosystem",
        description:
          "Access production-ready Navbars, Pricing Cards, Timelines, and Modals that you can drag straight into your designs.",
      },
      {
        type: "FEATURE",
        title: "Interactive & Animated Elements",
        description:
          "Add dynamic flair to your pages with Glowing Buttons, WebGL Blobs, and animated UV Dial Gauges.",
      },
      {
        type: "IMPROVEMENT",
        title: "Component State Management",
        description:
          "Components now ship with built-in states (hover, active, disabled) and adapt perfectly to dark and light modes.",
      },
    ],
  },
  {
    version: "v1.2.0",
    date: "April 5, 2026",
    title: "Global Assets & Media Library",
    description:
      "We've partnered with top creators to bring nearly 30,000 high-quality assets directly into the editor, eliminating the need to browse external stock sites.",
    mainImage: "/images/changelog/image-5.png",
    changes: [
      {
        type: "NEW",
        title: "30,000+ Integrated Assets",
        description:
          "Browse breathtaking photography, 3D renders, digital illustrations, and vector icons natively within the builder.",
      },
      {
        type: "FEATURE",
        title: "Granular Media Categories",
        description:
          "Find exactly what you need with precise categorization like Sci-Fi & Tech, Modern Architecture, Professional Portraits, and more.",
      },
      {
        type: "IMPROVEMENT",
        title: "Masonry Grid View",
        description:
          "Introduced a beautiful, responsive masonry layout optimized for efficiently scanning and previewing high-resolution visuals.",
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "March 30, 2026",
    title: "Launch of Lumina",
    description:
      "This is our first official launch of Lumina! A completely new era of web design begins, giving you the power to build stunning, production-ready websites in seconds.",
    mainImage: "/images/changelog/landing-page.png",
    changes: [
      {
        type: "NEW",
        title: "Lumina Engine v1.0",
        description:
          "The core visual editor and AI generation engine is officially live and ready for production use.",
      },
      {
        type: "NEW",
        title: "AI-Powered Generation",
        description:
          "Generate complete, responsive sections instantly by describing them in plain text.",
      },
      {
        type: "FEATURE",
        title: "Real-time Canvas Editor",
        description:
          "Interact with a powerful visual canvas built specifically for modern React and Tailwind CSS architectures.",
      },
    ],
  },
];

// ─── Badge ────────────────────────────────────────────────────────────────────

const BADGE_STYLES: Record<BadgeType, string> = {
  NEW: "bg-blue-600 text-white",
  FEATURE: "bg-emerald-700 text-white",
  FIXES: "bg-orange-600 text-white",
  IMPROVEMENT: "bg-indigo-600 text-white",
};

function Badge({ type }: { type: BadgeType }) {
  return (
    <span
      className={`inline-flex items-center shrink-0 px-2 py-[3px] rounded text-[10px] font-bold uppercase tracking-wider ${BADGE_STYLES[type]}`}
    >
      {type}
    </span>
  );
}

// ─── Scroll-triggered fade wrapper ───────────────────────────────────────────

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChangelogPage() {
  const latestVersion = CHANGELOG[0].version;

  return (
    <div className="min-h-screen w-full bg-[var(--page-bg)] bg-grid text-[var(--foreground)] selection:bg-accent-glow/30">
      <Navbar />

      {/* ── Page Header ── */}
      <div className="pt-[72px] border-b border-black/5 dark:border-white/[0.07]">
        <div className="max-w-[1200px] mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-[42px] font-bold tracking-tight leading-[1.1] text-black dark:text-white"
          >
            Lumina&apos;s complete history — every feature, fix, and milestone.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="text-[15px] text-black/60 dark:text-white/45 leading-relaxed pt-1"
          >
            Track our continuous improvement journey with detailed release notes, feature
            additions, bug fixes, and performance enhancements. Stay updated with the latest
            developments and upcoming features.
          </motion.p>
        </div>
      </div>

      {/* ── 3-Column Layout ── */}
      <div className="max-w-[1200px] mx-auto flex relative pb-32">

        {/* Left Sidebar */}
        <aside className="hidden lg:flex w-44 shrink-0 flex-col gap-32 py-12 pr-4">
          {["VERSION\nTRACKING", "VISUAL\nUPDATES", "CATEGORIZED\nCHANGES"].map((label) => (
            <span
              key={label}
              className="text-[9px] font-bold tracking-[0.18em] text-black/30 dark:text-white/20 uppercase text-right whitespace-pre-line leading-tight"
            >
              {label}
            </span>
          ))}
        </aside>

        {/* Center Card */}
        <main className="flex-1 border-x border-black/5 dark:border-white/[0.07] bg-gray-50/50 dark:bg-[#101010] backdrop-blur-sm">

          {/* Card Header */}
          <div className="flex items-start justify-between px-7 py-5 border-b border-black/5 dark:border-white/[0.07]">
            <div>
              <h2 className="text-[15px] font-semibold text-black/90 dark:text-white/90 mb-0.5">Lumina Release History</h2>
              <p className="text-[12px] text-black/50 dark:text-white/35">Complete release history with detailed change tracking</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 inline-block" />
              {latestVersion}
            </span>
          </div>

          {/* Entries Container */}
          <div className="relative">
            {/* The continuous vertical timeline line */}
            <div className="absolute left-[28px] top-0 bottom-0 w-[1px] bg-black/[0.06] dark:bg-white/[0.07] z-0" />

            {/* Entries */}
            {CHANGELOG.map((entry, idx) => (
              <FadeIn key={entry.version} delay={idx * 0.05}>
                <article className="pl-[60px] pr-7 py-8 border-b border-black/[0.04] dark:border-white/[0.06] relative z-10">
                  {/* Timeline Dot */}
                  <div className="absolute left-[24.5px] top-[38px] w-2 h-2 rounded-full bg-blue-500 z-20 ring-[4px] ring-gray-50/50 dark:ring-[#101010]" />

                  {/* Version + Date */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-[13px] font-mono font-semibold text-blue-600 dark:text-blue-400">{entry.version}</span>
                    <span className="text-[13px] text-black/50 dark:text-white/35">{entry.date}</span>
                  </div>

                {/* Title */}
                <h3 className="text-[20px] md:text-[22px] font-bold tracking-tight text-black dark:text-white leading-snug mb-3">
                  {entry.title}
                </h3>

                {/* Description */}
                <p className="text-[13.5px] leading-relaxed text-black/60 dark:text-white/45 mb-5 max-w-2xl">
                  {entry.description}
                </p>

                {/* Images */}
                {entry.mainImage && (
                  <div className="flex gap-2.5 mb-6 rounded-xl overflow-hidden">
                    {/* Main image */}
                    <div
                      className="relative rounded-xl overflow-hidden border border-black/5 dark:border-white/[0.07] shadow-xl shadow-black/10 dark:shadow-black/50 bg-white dark:bg-black"
                      style={{ flex: entry.sideImages ? "0 0 73.5%" : "1", aspectRatio: entry.sideImages ? "16/10.5" : "16/7" }}
                    >
                      <Image
                        src={entry.mainImage}
                        alt={entry.title}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 75vw"
                        priority={idx === 0}
                      />
                    </div>

                    {/* Side images (hero only) */}
                    {entry.sideImages && (
                      <div className="flex-1 flex flex-col gap-2.5">
                        {entry.sideImages.map((src, i) => (
                          <div
                            key={i}
                            className="relative flex-1 rounded-xl overflow-hidden border border-black/5 dark:border-white/[0.07] shadow-lg shadow-black/5 dark:shadow-black/40 bg-white dark:bg-black"
                          >
                            <Image
                              src={src}
                              alt={`${entry.title} screenshot ${i + 1}`}
                              fill
                              className="object-cover object-left-top"
                              sizes="25vw"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Change Items */}
                {entry.changes.length > 0 && (
                  <div className="flex flex-col">
                    {entry.changes.map((change, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-1 py-4 border-t border-black/[0.04] dark:border-white/[0.05] first:border-t-0"
                      >
                        <div className="flex items-center gap-3">
                          <Badge type={change.type} />
                          <span className="text-[13.5px] font-semibold text-black/90 dark:text-white/90">{change.title}</span>
                        </div>
                        <p className="text-[13px] leading-relaxed text-black/50 dark:text-white/40 pl-[68px]">
                          {change.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </FadeIn>
          ))}
          </div>

          {/* Author Footer */}
          <div className="flex items-center justify-between px-7 py-8">
            <div className="flex items-center gap-3.5">
              <Image 
                src="/images/changelog/AI profile.png" 
                alt="Charles Platon" 
                width={40} 
                height={40} 
                className="rounded-full aspect-square object-cover shadow-sm" 
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-semibold text-black/90 dark:text-white/90">Charles Platon</span>
                <span className="text-[13px] text-black/60 dark:text-white/45">Designer of Lumina</span>
              </div>
            </div>
            <span className="text-[13px] text-black/50 dark:text-white/35">Last updated: {CHANGELOG[0].date}</span>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:flex w-44 shrink-0 flex-col gap-32 py-12 pl-4">
          {["RELEASE\nMETADATA", "FEATURE\nSHOWCASE", "DEVELOPER\nATTRIBUTION"].map((label) => (
            <span
              key={label}
              className={`text-[9px] font-bold tracking-[0.18em] text-black/30 dark:text-white/20 uppercase text-left whitespace-pre-line leading-tight ${
                label === "DEVELOPER\nATTRIBUTION" ? "mt-24" : ""
              }`}
            >
              {label}
            </span>
          ))}
        </aside>

      </div>

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, LayoutGrid, Type, Palette, AlignLeft, AlignCenter, AlignRight, MousePointer2, MousePointerClick, Layers } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2, // Small delay so it animates slightly after page load
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, // Elegant smooth spring-like easing
  },
};

const movingPromptTexts = [
  "Turn one idea into a full landing page",
  "Generate components from a plain sentence",
  "Ship websites that breathe in minutes",
  "Build, remix, and publish without friction",
];

export function HeroSection() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const timer = window.setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % movingPromptTexts.length);
    }, 2400);

    return () => {
      window.clearInterval(timer);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(120,119,198,0.18),transparent_40%),radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%),#050505] px-4 pt-32 pb-24 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:52px_52px] opacity-35" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 -mt-[7.5rem] flex w-full max-w-5xl flex-col items-center sm:-mt-[8.5rem]"
      >
        <motion.div
          variants={itemVariants}
          className="mt-2 mb-3 relative flex h-7 w-[260px] sm:w-[300px] items-center justify-center overflow-hidden rounded-full border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.04] px-4 text-[10px] font-medium text-black/80 dark:text-white/80 shadow-[0_6px_14px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          <span className="mr-2 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5">
            <Sparkles size={8} className="text-black/75 dark:text-white/75" />
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={promptIndex}
              initial={{ y: 10, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -10, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
              className="whitespace-nowrap"
            >
              {movingPromptTexts[promptIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.h1 variants={itemVariants} className="mb-8 text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-6xl lg:text-[4.5rem] lg:leading-[1.1]">
          Websites that <span className="text-black dark:bg-gradient-to-r dark:from-indigo-300 dark:via-white/90 dark:to-white/70 dark:bg-clip-text dark:text-transparent">breathe.</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="mb-8 w-full text-sm font-light text-black/60 dark:text-white/60 sm:text-base md:text-lg">
          Build top-tier website pages in seconds. Watch video.
        </motion.p>

        <motion.div variants={itemVariants} className="flex w-full max-w-[700px] justify-center sm:-mb-[80px] md:-mb-[100px]">
          <div className="w-[940px] origin-top scale-[0.75] sm:scale-[0.7] overflow-hidden border border-t-0 border-white/15 bg-[#0a0a0a]/60 shadow-[0_14px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl p-[4px] sm:p-[6px] shrink-0">
            <div className="flex w-full flex-col overflow-hidden border border-white/5 bg-[#121212]">
              {/* Toolbar */}
              <div className="flex w-full items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3.5">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="flex h-7 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.03] px-12 text-[11px] font-medium tracking-wide text-white/40">
                  lumina.build / editor
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden items-center gap-3 sm:flex">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                    <span className="text-[11px] font-medium text-indigo-300">Autosaving...</span>
                  </div>
                  <div className="flex h-7 w-12 cursor-pointer items-center justify-center rounded-[8px] bg-indigo-500/10 text-[11px] font-medium text-indigo-300 hover:bg-indigo-500/20">
                    Publish
                  </div>
                </div>
              </div>

              {/* Main Builder Area */}
              <div className="flex h-[340px] w-full bg-black/40">
                {/* Sidebar */}
                <div className="hidden w-[220px] flex-col overflow-hidden border-r border-white/10 bg-white/[0.02] p-4 sm:flex">
                  <div className="mb-4 flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <Layers size={13} strokeWidth={2.5} /> Elements
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-colors">
                      <div className="flex items-center gap-2.5 text-[13px] font-medium text-white/90">
                        <LayoutGrid size={15} className="text-indigo-400" /> Sections
                      </div>
                    </div>
                    <div className="flex cursor-pointer items-center justify-between rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:bg-white/5">
                      <div className="flex items-center gap-2.5 text-[13px] font-medium text-white/60">
                        <Type size={15} className="text-violet-400 opacity-80" /> Typography
                      </div>
                    </div>
                    <div className="flex cursor-pointer items-center justify-between rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:bg-white/5">
                      <div className="flex items-center gap-2.5 text-[13px] font-medium text-white/60">
                        <Palette size={15} className="text-fuchsia-400 opacity-80" /> Global Styles
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 mt-8 px-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    Navigator
                  </div>
                  <div className="flex flex-col gap-1 text-[12px] font-medium">
                    <div className="flex items-center gap-2 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-indigo-300">
                      <div className="h-1 w-1 rounded-full bg-indigo-400" /> Hero Section
                    </div>
                    <div className="ml-[14px] flex items-center gap-2 rounded-lg border-l border-white/10 px-3 py-1.5 text-white/40">
                      Heading 1
                    </div>
                    <motion.div animate={{ backgroundColor: ["rgba(255,255,255,0)", "rgba(255,255,255,0.05)", "rgba(255,255,255,0)"] }} transition={{ duration: 4, delay: 1, repeat: Infinity }} className="ml-[14px] flex items-center gap-2 rounded-lg border-l border-white/10 px-3 py-1.5 text-white/60">
                      Paragraph
                    </motion.div>
                    <motion.div animate={{ backgroundColor: ["rgba(255,255,255,0)", "rgba(99,102,241,0.1)", "rgba(255,255,255,0)"] }} transition={{ duration: 4, repeat: Infinity }} className="ml-[14px] flex items-center gap-2 rounded-lg border-l border-white/10 px-3 py-1.5 text-indigo-300">
                      Button Group
                    </motion.div>
                  </div>
                </div>

                {/* Canvas */}
                <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-50" />

                  <div className="relative flex w-[85%] max-w-[460px] flex-col items-center justify-center gap-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.03] p-8 opacity-90 shadow-[0_0_80px_rgba(99,102,241,0.07)] backdrop-blur-xl transition hover:border-indigo-500/40">
                    <div className="absolute -inset-[1px] rounded-2xl border-2 border-indigo-500/50 opacity-0 transition-opacity hover:opacity-100" />

                    <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-indigo-300">
                      <Sparkles size={10} /> Intro
                    </div>

                    <motion.div animate={{ width: ["90%", "94%", "90%"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="h-10 rounded-xl bg-gradient-to-r from-white/90 to-white/70 shadow-inner" />
                    <motion.div animate={{ width: ["60%", "65%", "60%"] }} transition={{ duration: 4, delay: 0.5, repeat: Infinity, ease: "easeInOut" }} className="h-10 rounded-xl bg-gradient-to-r from-white/80 to-white/60 shadow-inner" />

                    <div className="mt-2 flex w-[85%] flex-col items-center gap-3">
                      <motion.div animate={{ width: ["100%", "95%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="h-3 rounded-full bg-white/20" />
                      <motion.div animate={{ width: ["70%", "76%", "70%"] }} transition={{ duration: 3, delay: 0.3, repeat: Infinity, ease: "easeInOut" }} className="h-3 rounded-full bg-white/20" />
                    </div>

                    <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "easeInOut" }} className="mt-4 flex justify-center">
                      <Link href={user ? "/dashboard" : "/login"} className="group relative flex h-14 items-center gap-3 overflow-hidden rounded-full bg-indigo-600 px-8 text-[15px] font-bold text-white shadow-[0_0_14px_rgba(99,102,241,0.38)] dark:shadow-[0_0_30px_rgba(99,102,241,0.65)] transition-all hover:bg-indigo-500 hover:shadow-[0_0_22px_rgba(99,102,241,0.55)] dark:hover:shadow-[0_0_40px_rgba(99,102,241,0.85)]">
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                          <div className="relative h-full w-8 bg-white/20" />
                        </div>
                        Start Building <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
                      </Link>
                    </motion.div>

                    <div className="absolute -right-8 -top-8 hidden flex-col gap-3 rounded-[14px] border border-white/10 bg-[#1a1a1a]/95 p-3.5 shadow-2xl backdrop-blur-2xl md:flex">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Layout</div>
                      <div className="flex gap-1.5">
                        <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] bg-white/5 text-white/40 transition hover:bg-white/10">
                          <AlignLeft size={15} />
                        </div>
                        <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] border border-indigo-500/30 bg-indigo-500/20 text-indigo-300 shadow-[inset_0_1px_4px_rgba(255,255,255,0.1)]">
                          <AlignCenter size={15} />
                        </div>
                        <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] bg-white/5 text-white/40 transition hover:bg-white/10">
                          <AlignRight size={15} />
                        </div>
                      </div>
                    </div>

                    <motion.div
                      animate={{
                        x: [260, 220, 160, 80, 0, 0, 180, 260],
                        y: [-108, -92, -60, -18, -2, 6, -78, -108],
                        opacity: [0, 1, 1, 1, 1, 1, 0, 0],
                      }}
                      transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center drop-shadow-lg"
                    >
                      <motion.div className="relative h-6 w-6">
                        <motion.div
                          animate={{ opacity: [0, 1, 1, 1, 0, 0, 0, 0], scale: [0.95, 1, 1, 1, 0.95, 0.95, 0.95, 0.95] }}
                          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0"
                        >
                          <MousePointer2 size={24} strokeWidth={1} className="fill-indigo-400 text-indigo-100 drop-shadow-md" />
                        </motion.div>
                        <motion.div
                          animate={{ opacity: [0, 0, 0, 0, 1, 1, 0, 0], scale: [0.92, 0.92, 0.92, 0.92, 1.18, 1.02, 0.92, 0.92] }}
                          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0"
                        >
                          <MousePointerClick size={24} strokeWidth={1} className="fill-indigo-400 text-indigo-100 drop-shadow-md" />
                        </motion.div>
                        <motion.div
                          animate={{ opacity: [0, 0, 0, 0, 0.9, 0, 0, 0], scale: [0.5, 0.5, 0.5, 0.5, 1.5, 1.9, 0.5, 0.5] }}
                          transition={{ duration: 4.8, repeat: Infinity, ease: "easeOut" }}
                          className="pointer-events-none absolute inset-0 rounded-full border border-indigo-300/80"
                        />
                      </motion.div>
                      <motion.div
                        animate={{ opacity: [0, 0.55, 0.8, 1, 1, 0.8, 0, 0] }}
                        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                        className="mt-1 rounded-md border border-indigo-400/30 bg-indigo-500 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-md"
                      >
                        AI Edit
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

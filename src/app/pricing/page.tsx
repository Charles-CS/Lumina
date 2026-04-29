"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { LuminaLogo } from "@/components/ui/LuminaLogo";

import { Check, Sparkles, ShieldCheck, RefreshCcw, X, ChevronDown, ArrowRight, Users, Globe, Zap, Lock, Plus, Star } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const PRICING_PLANS = {
  starter: {
    name: "Starter",
    description: "Perfect for side projects and learning.",
    price: { monthly: "0", annual: "0" },
    buttonText: "Get Started Free",
    features: [
      "Access to 5 Free Templates",
      "Standard UI Component Library",
      "Community Support via Discord",
      "Export limited to static HTML",
    ],
    highlight: false,
  },
  pro: {
    name: "Pro",
    description: "Everything you need for serious growth.",
    price: { monthly: "19", annual: "15" },
    buttonText: "Upgrade to Pro",
    features: [
      "All 50+ PRO Premium Templates",
      "Advanced Glassmorphic Behaviors",
      "Full React / Next.js Export",
      "Priority Email Support",
      "Dual-Theme Engine Unlock",
      "Interactive Animation Layers"
    ],
    highlight: true,
    tag: "Most Popular",
    gradient: "from-purple-500 to-indigo-500",
    bgGradient: "dark:from-[#181825] dark:to-[#232336] from-purple-100/80 to-indigo-100/60",
    glowColor: "purple"
  },
  teams: {
    name: "Teams",
    description: "For agencies and advanced collaboration.",
    price: { monthly: "59", annual: "49" },
    buttonText: "Contact Sales",
    features: [
      "Up to 10 Team Members",
      "Real-time Collaborative Building",
      "Custom Domain Mapping",
      "Dedicated Account Manager",
      "Custom Template Requests"
    ],
    highlight: false,
  }
};

function FaqItem({ faq, isFirst }: { faq: { category: string, q: string, a: string }, isFirst: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-black/10 dark:border-white/[0.06] py-6 ${isFirst ? 'pt-0' : 'border-t'}`}>
      <p className="text-[10px] font-bold text-black/50 dark:text-[#888888] uppercase tracking-[0.15em] mb-4">{faq.category}</p>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-between w-full text-left focus:outline-none"
      >
        <h3 className="text-[17px] md:text-[19px] font-bold text-black dark:text-white pr-4 leading-tight">{faq.q}</h3>
        <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.04] flex items-center justify-center shrink-0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors">
          {isOpen ? (
            <X className="h-4 w-4 text-black/70 dark:text-white/70" />
          ) : (
            <Plus className="h-4 w-4 text-black/70 dark:text-white/70" />
          )}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 text-black/60 dark:text-[#a1a1a1] leading-relaxed text-sm pr-12">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<null | 'starter' | 'pro' | 'teams'>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const openModal = (plan: 'starter' | 'pro' | 'teams') => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--page-bg)] bg-grid text-[var(--foreground)] selection:bg-accent-glow/30 pb-0 overflow-hidden">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-[80px] px-6 md:px-12 pt-[100px] mb-20 relative z-10">

        {/* Pricing Header */}
        <section className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-black/70 dark:text-white/70 backdrop-blur-md">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Pricing Plans
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black dark:text-white leading-[1.1]">
            Simple, Transparent <span className="text-black dark:bg-gradient-to-r dark:from-indigo-300 dark:via-white/90 dark:to-white/70 dark:bg-clip-text dark:text-transparent">Pricing</span>
          </h1>
          <p className="text-lg md:text-xl text-black/60 dark:text-white/60 font-light">
            Whether you are a solo creator or a large enterprise, we have a plan designed specifically for your aesthetic needs.
          </p>

          {/* Billing Toggle */}
          <div className="mt-4 flex items-center gap-3">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-black/20 dark:bg-white/20 transition-colors focus:outline-none"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-black transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50'}`}>
              Annually <span className="rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 text-[10px] font-bold uppercase">Save 20%</span>
            </span>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-6">
            {/* Starter Plan */}
            <div className="col-span-1 rounded-[32px] border border-black/[0.1] dark:border-white/[0.08] bg-[var(--section-bg)] p-8 shadow-sm dark:shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">
              <h3 className="text-2xl font-semibold mb-2 text-black dark:text-white">{PRICING_PLANS.starter.name}</h3>
              <p className="text-sm text-black/60 dark:text-white/60 mb-6">{PRICING_PLANS.starter.description}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold text-black dark:text-white">${isAnnual ? PRICING_PLANS.starter.price.annual : PRICING_PLANS.starter.price.monthly}</span>
                <span className="text-sm text-black/50 dark:text-white/50 font-medium">/month</span>
              </div>
              <button 
                onClick={() => openModal('starter')}
                className="w-full py-3 px-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black dark:text-white font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors mb-8"
              >
                {PRICING_PLANS.starter.buttonText}
              </button>

              <div className="flex flex-col gap-4 text-left w-full">
                <p className="text-sm font-semibold text-black dark:text-white mb-2 uppercase tracking-wider">Included in Starter:</p>
                {PRICING_PLANS.starter.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-black/40 dark:text-white/40 shrink-0" />
                    <span className="text-sm text-black/70 dark:text-white/70 leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="col-span-1 rounded-[32px] border border-purple-500/30 bg-gradient-to-b from-purple-100/80 to-indigo-100/60 dark:from-[#181825] dark:to-[#232336] p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)] flex flex-col items-center text-center relative overflow-hidden scale-100 lg:scale-[1.03] z-10 transition-transform">
              {/* Glow backing */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-purple-500/20 blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-500/20 blur-[80px] pointer-events-none" />

              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-b-lg shadow-md">
                {PRICING_PLANS.pro.tag}
              </div>

              <h3 className="text-2xl font-semibold mt-4 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">{PRICING_PLANS.pro.name}</h3>
              <p className="text-sm text-black/60 dark:text-white/60 mb-6 relative z-10">{PRICING_PLANS.pro.description}</p>
              <div className="flex items-baseline gap-1 mb-8 relative z-10">
                <span className="text-5xl font-bold text-black dark:text-white">${isAnnual ? PRICING_PLANS.pro.price.annual : PRICING_PLANS.pro.price.monthly}</span>
                <span className="text-sm text-black/50 dark:text-white/50 font-medium">/month</span>
              </div>

              <button
                onClick={() => openModal('pro')}
                className="relative z-10 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(168,85,247,0.4)] mb-8"
              >
                {PRICING_PLANS.pro.buttonText}
              </button>

              <div className="flex flex-col gap-4 text-left w-full relative z-10">
                <p className="text-sm font-semibold text-black dark:text-white mb-2 uppercase tracking-wider">Everything in Starter, plus:</p>
                {PRICING_PLANS.pro.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="rounded-full bg-purple-500/10 p-0.5 shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-black/80 dark:text-white/80 leading-tight font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Teams Plan */}
            <div className="col-span-1 rounded-[32px] border border-black/[0.1] dark:border-white/[0.08] bg-[var(--section-bg)] p-8 shadow-sm dark:shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">
              <h3 className="text-2xl font-semibold mb-2 text-black dark:text-white">{PRICING_PLANS.teams.name}</h3>
              <p className="text-sm text-black/60 dark:text-white/60 mb-6">{PRICING_PLANS.teams.description}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold text-black dark:text-white">${isAnnual ? PRICING_PLANS.teams.price.annual : PRICING_PLANS.teams.price.monthly}</span>
                <span className="text-sm text-black/50 dark:text-white/50 font-medium">/month</span>
              </div>
              <button
                onClick={() => openModal('teams')}
                className="w-full py-3 px-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black dark:text-white font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors mb-8"
              >
                {PRICING_PLANS.teams.buttonText}
              </button>

              <div className="flex flex-col gap-4 text-left w-full">
                <p className="text-sm font-semibold text-black dark:text-white mb-2 uppercase tracking-wider">Everything in Pro, plus:</p>
                {PRICING_PLANS.teams.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-black/40 dark:text-white/40 shrink-0" />
                    <span className="text-sm text-black/70 dark:text-white/70 leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New Integrated Trust Banner under Pricing Cards */}
          <div className="flex justify-center max-w-3xl mx-auto mt-8">
            <div className="inline-flex flex-wrap items-center justify-center gap-6 md:gap-12 rounded-full border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] px-6 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
                <ShieldCheck className="h-4 w-4 text-black/80 dark:text-white/80" />
                <span>14-day money back guarantee</span>
              </div>
              <div className="hidden md:block w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
              <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
                <RefreshCcw className="h-4 w-4 text-black/80 dark:text-white/80" />
                <span>Cancel or switch plans anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Infinite Marquee Social Proof */}
        <section className="w-full max-w-7xl mx-auto my-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both overflow-hidden">
          <p className="text-center text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-[0.2em] mb-10">Trusted by forward-thinking developers</p>
          <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max animate-marquee-ltr items-center gap-16 pr-16 opacity-50 contrast-50 hover:opacity-100 hover:contrast-100 transition-all duration-500">
              {/* 4 copies so the strip is always wider than the viewport — no gaps ever */}
              {[0, 1, 2, 3].map((set) => (
                <React.Fragment key={set}>
                  <div className="text-2xl font-bold tracking-tighter">Vercel</div>
                  <div className="text-2xl font-bold tracking-tight">Supabase</div>
                  <div className="flex items-center gap-2 font-semibold text-xl"><div className="w-5 h-5 rounded-full bg-black dark:bg-white" /> Raycast</div>
                  <div className="text-2xl font-serif font-bold italic">Linear</div>
                  <div className="text-2xl font-bold tracking-widest uppercase">Stripe</div>
                  <div className="text-2xl font-bold flex items-center gap-1"><span className="text-purple-500">&lt;</span>Resend<span className="text-purple-500">/&gt;</span></div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Matrix Redesign */}
        <section className="flex flex-col items-center w-full max-w-5xl mx-auto gap-8 mt-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
          <div className="text-center mb-6">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-black dark:text-white">Compare Plans In-Depth</h2>
            <p className="text-lg text-black/50 dark:text-white/50 mt-3 max-w-xl mx-auto">Get absolute clarity on what you unlock with each tier. Pro guarantees unrestricted access.</p>
          </div>

          <div className="w-full relative overflow-x-auto rounded-[32px] border border-black/[0.1] dark:border-white/[0.08] bg-black/[0.02] dark:bg-[var(--section-bg)] shadow-xl backdrop-blur-xl">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-black/5 dark:bg-black/40">
                <tr>
                  <th className="py-6 px-8 font-medium text-black/60 dark:text-white/60 w-2/5 border-b border-black/10 dark:border-white/10 uppercase text-xs tracking-widest">Core Features</th>
                  <th className="py-6 px-6 font-semibold text-center text-black dark:text-white w-1/5 border-b border-black/10 dark:border-white/10 text-lg">Starter</th>
                  <th className="py-6 px-6 font-bold text-center text-white w-1/5 border-b border-purple-500/20 relative shadow-[0_-20px_40px_rgba(168,85,247,0.1)_inset]">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-purple-500/5 -z-10" />
                    Pro
                  </th>
                  <th className="py-6 px-6 font-semibold text-center text-black dark:text-white w-1/5 border-b border-black/10 dark:border-white/10 text-lg">Teams</th>
                </tr>
              </thead>
              <tbody className="text-[15px]">
                {[
                  { name: "Premium Free Templates", levels: ["5", "Unlimited", "Unlimited"] },
                  { name: "PRO Templates", levels: ["-", "Access All", "Access All"] },
                  { name: "Component Library", levels: ["Basic", "Full Access", "Full Access"] },
                  { name: "React Code Export", levels: ["-", "Yes", "Yes"] },
                  { name: "Dual-Theme Engine", levels: ["-", "Yes", "Yes"] },
                  { name: "Glassmorphic Panels", levels: ["Basic", "Advanced", "Custom"] },
                  { name: "Support Tier", levels: ["Community", "Priority 24/7", "Dedicated Rep"] },
                  { name: "Custom Domain Mapping", levels: ["-", "-", "Unlimited Domains"] },
                  { name: "Team Seats", levels: ["1", "1", "Up to 10 included"] },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-black/[0.05] dark:border-white/[0.04] last:border-0 hover:bg-black/5 dark:hover:bg-white/[0.03] transition-colors group">
                    <td className="py-5 px-8 text-black/80 dark:text-white/80 font-medium group-hover:text-black dark:group-hover:text-white transition-colors">{row.name}</td>

                    <td className="py-5 px-6 text-center text-black/50 dark:text-white/50 relative">
                      {row.levels[0] === "-" ? <span className="opacity-30">—</span> : row.levels[0]}
                    </td>

                    <td className="py-5 px-6 text-center text-black dark:text-white font-semibold relative overflow-hidden">
                      <div className="absolute inset-0 bg-purple-500/[0.03] group-hover:bg-purple-500/10 transition-colors -z-10" />
                      {row.levels[1] === "-" ? <span className="opacity-30">—</span> : row.levels[1] === "Yes" ? <Check className="mx-auto h-5 w-5 text-purple-600 dark:text-purple-400" /> : <span className="text-purple-700 dark:text-purple-300">{row.levels[1]}</span>}
                    </td>

                    <td className="py-5 px-6 text-center text-black/50 dark:text-white/50 relative">
                      {row.levels[2] === "-" ? <span className="opacity-30">—</span> : row.levels[2] === "Yes" ? <Check className="mx-auto h-5 w-5 text-black/40 dark:text-white/40" /> : row.levels[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Interactive Accordion FAQ Section (Exact Aura Style) */}
        <section className="w-full max-w-7xl mx-auto mt-32 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
          <div className="rounded-[32px] border border-black/10 dark:border-white/[0.08] bg-[var(--section-bg)] p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-sm dark:shadow-none">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
              <div className="max-w-xl">
                <p className="text-[10px] font-bold tracking-[0.15em] text-black/50 dark:text-[#a1a1a1] uppercase mb-4">Frequently Asked Questions</p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-black dark:text-white mb-4">
                  Answers to your most common questions
                </h2>
                <p className="text-black/60 dark:text-[#a1a1a1] text-sm md:text-base leading-relaxed max-w-md">
                  Everything you need to know to get started, manage your account, and get support quickly.
                </p>
              </div>
              <Link 
                href="/support"
                className="px-5 py-2.5 rounded-full border border-black/10 dark:border-white/10 bg-black dark:bg-[#111] text-white text-sm font-semibold hover:bg-black/80 dark:hover:bg-white/5 transition-colors whitespace-nowrap shrink-0 flex items-center justify-center"
              >
                Contact support
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 lg:gap-24">
              
              {/* Left Column: FAQ Items */}
              <div className="flex flex-col">
                {[
                  { category: "GENERAL", q: "Is there a free trial for Pro plans?", a: "Yes, we offer a 14-day free trial for our Pro plan so you can experience the advanced glassmorphic templates and code export features before committing." },
                  { category: "GENERAL", q: "Can I upgrade or downgrade my plan?", a: "Absolutely. You can change your plan at any time from your billing dashboard. Prorated charges or credits will be applied automatically." },
                  { category: "PRICING", q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and Apple Pay through our secure Stripe integration." },
                  { category: "PRICING", q: "Do you offer discounts for students or non-profits?", a: "Yes! Reach out to our support team from your educational or organization email to receive a 50% lifetime discount on the Pro plan." },
                  { category: "FEATURES", q: "How do I use Lumina's component library?", a: "In the editor, simply open the Elements sidebar to drag and drop ready-made sections, typography styles, and interactive layers directly into your canvas." },
                  { category: "FEATURES", q: "Can I create multi-page websites with Lumina?", a: "Yes, you can easily manage and link multiple pages within a single project using our built-in navigator and routing system." },
                  { category: "FEATURES", q: "Can I export my site designs out of Lumina?", a: "Yes, Pro and Team users can export clean, production-ready React and Next.js source code." },
                  { category: "FEATURES", q: "Does Lumina handle hosting?", a: "Lumina Teams includes custom domain mapping and optimized global hosting. Starter and Pro users can export their code to host anywhere they choose." }
                ].map((faq, i) => (
                  <FaqItem key={i} faq={faq} isFirst={i === 0} />
                ))}
              </div>

              {/* Right Column: Testimonials */}
              <div className="flex flex-col">
                <div className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-[#222] px-3 py-1 text-[10px] font-semibold text-black/70 dark:text-white/70 mb-6 w-max">
                  <span className="font-bold mr-2 text-black dark:text-white">02</span> <span className="text-black/30 dark:text-white/30 mr-2">|</span> Testimonials
                </div>
                <h3 className="text-3xl font-bold tracking-tight leading-[1.1] mb-3">
                  <span className="text-black dark:text-white">Loved by builders, </span><span className="text-black/40 dark:text-white/40">easy<br/>turnarounds</span>
                </h3>
                <p className="text-sm text-black/60 dark:text-[#a1a1a1] mb-8 leading-relaxed max-w-sm">
                  Real results from real teams — faster reviews, cleaner handoff, and a smoother path from idea to shipped UI.
                </p>

                <div className="flex flex-col gap-4">
                  {/* Testimonial 1 */}
                  <div className="bg-black/[0.02] dark:bg-[#1e1e1e] border border-black/5 dark:border-white/[0.05] rounded-2xl p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black/20 dark:text-white/20">
                        <path d="M10 8C10 5.79086 8.20914 4 6 4C3.79086 4 2 5.79086 2 8V12C2 14.2091 3.79086 16 6 16C7.10457 16 8.10457 15.5523 8.82843 14.8284L7.41421 13.4142C6.83842 13.99 6.07185 14.2965 5.28913 14.2885C4.24647 14.2778 3.51868 13.5233 3.42152 12.4938C4.18049 12.3021 4.88722 11.9168 5.45934 11.3788C6.18241 10.6989 6.56499 9.80554 6.56499 8.8249V8H10ZM18 8C18 5.79086 16.2091 4 14 4C11.7909 4 10 5.79086 10 8V12C10 14.2091 11.7909 16 14 16C15.1046 16 16.1046 15.5523 16.8284 14.8284L15.4142 13.4142C14.8384 13.99 14.0719 14.2965 13.2891 14.2885C12.2465 14.2778 11.5187 13.5233 11.4215 12.4938C12.1805 12.3021 12.8872 11.9168 13.4593 11.3788C14.1824 10.6989 14.565 9.80554 14.565 8.8249V8H18Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      </svg>
                      <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80" alt="Ray" className="w-9 h-9 rounded-md object-cover grayscale opacity-80" />
                    </div>
                    <p className="text-sm font-bold text-black dark:text-white mb-4 leading-snug">
                      Lumina completely transformed how I build landing pages. The drag-and-drop interface is ridiculously smooth!
                    </p>
                    <p className="text-[11px] font-bold text-black dark:text-white mb-0.5">Ray Fernando</p>
                    <p className="text-[10px] text-black/50 dark:text-[#888888]">Junior Developer</p>
                  </div>

                  {/* Testimonial 2 */}
                  <div className="bg-black/[0.02] dark:bg-[#1e1e1e] border border-black/5 dark:border-white/[0.05] rounded-2xl p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black/20 dark:text-white/20">
                        <path d="M10 8C10 5.79086 8.20914 4 6 4C3.79086 4 2 5.79086 2 8V12C2 14.2091 3.79086 16 6 16C7.10457 16 8.10457 15.5523 8.82843 14.8284L7.41421 13.4142C6.83842 13.99 6.07185 14.2965 5.28913 14.2885C4.24647 14.2778 3.51868 13.5233 3.42152 12.4938C4.18049 12.3021 4.88722 11.9168 5.45934 11.3788C6.18241 10.6989 6.56499 9.80554 6.56499 8.8249V8H10ZM18 8C18 5.79086 16.2091 4 14 4C11.7909 4 10 5.79086 10 8V12C10 14.2091 11.7909 16 14 16C15.1046 16 16.1046 15.5523 16.8284 14.8284L15.4142 13.4142C14.8384 13.99 14.0719 14.2965 13.2891 14.2885C12.2465 14.2778 11.5187 13.5233 11.4215 12.4938C12.1805 12.3021 12.8872 11.9168 13.4593 11.3788C14.1824 10.6989 14.565 9.80554 14.565 8.8249V8H18Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      </svg>
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" alt="Greg" className="w-9 h-9 rounded-md object-cover grayscale opacity-80" />
                    </div>
                    <p className="text-sm font-bold text-black dark:text-white mb-4 leading-snug">
                      I've never designed a website before, but Lumina's glassmorphic templates made my project look like it was built by a pro agency.
                    </p>
                    <p className="text-[11px] font-bold text-black dark:text-white mb-0.5">Greg Isenberg</p>
                    <p className="text-[10px] text-black/50 dark:text-[#888888] leading-tight">Aspiring Designer</p>
                  </div>

                  {/* Testimonial 3 */}
                  <div className="bg-black/[0.02] dark:bg-[#1e1e1e] border border-black/5 dark:border-white/[0.05] rounded-2xl p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black/20 dark:text-white/20">
                        <path d="M10 8C10 5.79086 8.20914 4 6 4C3.79086 4 2 5.79086 2 8V12C2 14.2091 3.79086 16 6 16C7.10457 16 8.10457 15.5523 8.82843 14.8284L7.41421 13.4142C6.83842 13.99 6.07185 14.2965 5.28913 14.2885C4.24647 14.2778 3.51868 13.5233 3.42152 12.4938C4.18049 12.3021 4.88722 11.9168 5.45934 11.3788C6.18241 10.6989 6.56499 9.80554 6.56499 8.8249V8H10ZM18 8C18 5.79086 16.2091 4 14 4C11.7909 4 10 5.79086 10 8V12C10 14.2091 11.7909 16 14 16C15.1046 16 16.1046 15.5523 16.8284 14.8284L15.4142 13.4142C14.8384 13.99 14.0719 14.2965 13.2891 14.2885C12.2465 14.2778 11.5187 13.5233 11.4215 12.4938C12.1805 12.3021 12.8872 11.9168 13.4593 11.3788C14.1824 10.6989 14.565 9.80554 14.565 8.8249V8H18Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      </svg>
                      <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150&q=80" alt="Peter" className="w-9 h-9 rounded-md object-cover grayscale opacity-80" />
                    </div>
                    <p className="text-sm font-bold text-black dark:text-white mb-4 leading-snug">
                      Lumina's UI components are breathtaking. I managed to piece together a stunning portfolio site in under an hour without writing a single line of code.
                    </p>
                    <p className="text-[11px] font-bold text-black dark:text-white mb-0.5">Peter Yang</p>
                    <p className="text-[10px] text-black/50 dark:text-[#888888] leading-tight">Junior Dev</p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Enterprise Split Banner Redesign */}
        <section className="w-full max-w-7xl mx-auto mt-24 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-both">
          <div className="rounded-[40px] border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-[#070707] p-0 relative overflow-hidden flex flex-col md:flex-row group">

            {/* Left side text */}
            <div className="flex-1 p-12 md:p-16 z-10 flex flex-col justify-center">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">Need a completely tailored solution?</h2>
              <p className="text-lg text-gray-700 dark:text-white/60 mb-8 max-w-md">
                Strict compliance, custom component generation, SLA guarantees, and hands-on whiteglove onboarding perfectly suited for large-scale operations.
              </p>
              <Link
                href="/business"
                className="w-max px-8 py-4 bg-white text-black rounded-xl font-bold tracking-wide hover:scale-105 hover:bg-gray-100 transition-all shadow-[0_0_30px_rgba(0,0,0,0.06)]"
              >
                Let's Talk Business
              </Link>
            </div>
 
            {/* Right side business-relevant visual - Large Branding Focal Point */}
            <div className="flex-1 relative min-h-[400px] md:min-h-auto flex items-center justify-center p-4 md:p-12 overflow-hidden bg-black/[0.01] dark:bg-black/20 border-t md:border-t-0 md:border-l border-black/10 dark:border-white/10">
              <div className="absolute inset-0 bg-grid opacity-[0.02] dark:opacity-10" />
              
              {/* Massive, impactful Lumina Logo */}
              <div className="relative z-10 flex items-center justify-center w-full h-full opacity-90">
                 <LuminaLogo size={320} />
              </div>
              
              {/* Soft atmospheric glow */}
              <div className="absolute inset-0 -z-10 bg-purple-500/[0.03] dark:bg-white/[0.01] blur-[150px] rounded-full scale-150" />
            </div>

          </div>
        </section>

      </main>

      {/* Pricing Modal Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && selectedPlan && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 pointer-events-none">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-xl pointer-events-auto"
                onClick={() => setIsModalOpen(false)}
              />

              {/* Modal Content - Two Section Layout, Smaller Scale */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-4xl bg-white dark:bg-[#0C0C0C] border border-black/10 dark:border-white/10 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col md:flex-row z-50 pointer-events-auto mt-6"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors z-[60]"
                >
                  <X className="h-5 w-5 text-black/60 dark:text-white/60" />
                </button>

                {/* Left Section: Compact Card Styling */}
                <div className={`w-full md:w-[48%] flex flex-col relative shrink-0 border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5 rounded-t-[40px] md:rounded-t-none md:rounded-l-[40px] ${selectedPlan === 'pro' ? 'bg-[#0F0F1A]' : 'bg-[#0A0A0A]'}`}>
                  <div className={`p-8 md:p-10 flex flex-col h-full ${selectedPlan === 'pro' ? 'bg-gradient-to-b from-purple-500/5 to-transparent' : ''}`}>
                    {selectedPlan === 'pro' && (
                      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
                    )}

                    {/* Badge - Exact 'tab' style from image (flush top, rounded bottom) */}
                    {selectedPlan === 'pro' && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[80]">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white text-[9px] uppercase font-black tracking-[0.2em] px-6 py-2 rounded-b-2xl shadow-xl shadow-purple-500/20 border-x border-b border-white/10">
                          {PRICING_PLANS.pro.tag}
                        </div>
                      </div>
                    )}

                    <div className={`text-center mb-6 ${selectedPlan === 'pro' ? 'mt-8' : 'mt-1'}`}>
                      <h3 className={`text-2xl font-bold mb-1 ${selectedPlan === 'pro' ? 'text-purple-400' : 'text-white'}`}>
                        {PRICING_PLANS[selectedPlan].name}
                      </h3>
                      <p className="text-white/40 text-[11px] font-medium max-w-[180px] mx-auto leading-tight">
                        {PRICING_PLANS[selectedPlan].description}
                      </p>
                    </div>

                    <div className="flex items-baseline justify-center gap-1 mb-8">
                      <span className="text-5xl font-bold text-white tracking-tighter">
                        ${isAnnual ? (PRICING_PLANS[selectedPlan].price as any).annual : (PRICING_PLANS[selectedPlan].price as any).monthly}
                      </span>
                      <span className="text-white/40 text-sm font-medium">/month</span>
                    </div>

                    <button className={`w-full py-3.5 rounded-xl font-bold text-sm mb-8 shadow-xl transition-transform active:scale-95 ${selectedPlan === 'pro' ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' : 'bg-white text-black'}`}>
                      {PRICING_PLANS[selectedPlan].buttonText}
                    </button>

                    <div className="flex flex-col gap-3.5 w-full">
                      <p className="text-[9px] font-black text-white uppercase tracking-[0.15em] mb-1 opacity-80">
                        {selectedPlan === 'pro' ? 'Included features:' : 'Everything in Pro, plus:'}
                      </p>
                      {PRICING_PLANS[selectedPlan].features.slice(0, 5).map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 group">
                          <div className={`rounded-full p-1 mt-0.5 flex items-center justify-center ${selectedPlan === 'pro' ? 'bg-purple-500/20' : 'bg-white/10'}`}>
                            <Check className={`h-2 w-2 shrink-0 ${selectedPlan === 'pro' ? 'text-purple-400' : 'text-white/80'}`} />
                          </div>
                          <span className="text-[12px] text-white/60 font-medium leading-tight group-hover:text-white transition-colors">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Section: Compact Maintenance Info */}
                <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-[#080808] relative rounded-b-[40px] md:rounded-b-none md:rounded-r-[40px]">
                  <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

                  <div className="relative z-10 w-full max-w-[320px] flex flex-col items-center">
                    {selectedPlan === 'starter' ? (
                      <>
                        <div className="w-14 h-14 rounded-[20px] bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                          <Check className="h-7 w-7 text-emerald-500" />
                        </div>
                        
                        <h4 className="text-xl font-bold text-black dark:text-white mb-3 leading-tight">
                          You are subscribed to the Starter plan
                        </h4>
                        
                        <p className="text-sm text-black/50 dark:text-white/50 mb-8 leading-relaxed font-medium">
                          Enjoy access to our core features and start building your stunning projects today.
                        </p>

                        <div className="w-full p-4 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col gap-3 text-left mb-8">
                           <div className="flex items-center gap-2.5 text-[11px] text-black/60 dark:text-white/60 font-medium">
                              <ShieldCheck className="h-4 w-4 text-emerald-500" />
                              <span>Core template access enabled</span>
                           </div>
                           <div className="flex items-center gap-2.5 text-[11px] text-black/60 dark:text-white/60 font-medium">
                              <Sparkles className="h-4 w-4 text-purple-500" />
                              <span>Standard export features active</span>
                           </div>
                        </div>
                        
                        <button 
                          onClick={() => setIsModalOpen(false)}
                          className="w-full py-3.5 px-8 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-xl"
                        >
                          Enjoy Lumina
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-[20px] bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20">
                          <RefreshCcw className="h-7 w-7 text-orange-500 animate-spin-slow" />
                        </div>
                        
                        <h4 className="text-xl font-bold text-black dark:text-white mb-3 leading-tight">
                          We're currently polishing our billing system
                        </h4>
                        
                        <p className="text-sm text-black/50 dark:text-white/50 mb-8 leading-relaxed font-medium">
                          Our subscription engine is undergoing a scheduled upgrade to improve your experience.
                        </p>

                        <div className="w-full p-4 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col gap-3 text-left mb-8">
                           <div className="flex items-center gap-2.5 text-[11px] text-black/60 dark:text-white/60 font-medium">
                              <ShieldCheck className="h-4 w-4 text-emerald-500" />
                              <span>Upgrading payment infrastructure</span>
                           </div>
                           <div className="flex items-center gap-2.5 text-[11px] text-black/60 dark:text-white/60 font-medium">
                              <Sparkles className="h-4 w-4 text-purple-500" />
                              <span>Optimizing secure checkout flows</span>
                           </div>
                        </div>
                        
                        <button 
                          onClick={() => setIsModalOpen(false)}
                          className="w-full py-3.5 px-8 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-xl"
                        >
                          I'll check back later
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <Footer />
    </div>
  );
}

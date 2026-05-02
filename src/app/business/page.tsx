"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ShieldCheck,
  Users,
  Zap,
  Globe,
  ArrowRight,
  Check,
  MessageSquare,
  Mail,
  Phone,
  BarChart3,
  Lock,
  Sun,
  Moon,
  Monitor,
  ChevronRight,
  Sparkles,
  RefreshCcw,
  Plus,
  Minus
} from "lucide-react";
import { LuminaLogo } from "@/components/ui/LuminaLogo";
import { Footer } from "@/components/ui/Footer";
import { useTheme } from "next-themes";

export default function BusinessPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)] selection:bg-purple-500/30 overflow-x-hidden transition-colors duration-300">
      {/* Background Grid - Same as Build Page */}
      <div className={`fixed inset-0 pointer-events-none -z-10 transition-opacity duration-1000 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e0e12] via-[#0a0a0e] to-[#0c0c10]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Light Mode Background */}
      <div className={`fixed inset-0 pointer-events-none -z-10 transition-opacity duration-1000 ${!isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Header - Same as Profile Page */}
      <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] dark:border-white/[0.06] bg-[var(--page-bg)]/80 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6 md:px-12 relative">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.04] transition-colors group-hover:bg-black/10 dark:group-hover:bg-white/10 p-0.5 shadow-inner">
                <LuminaLogo />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-px h-4 bg-black/10 dark:bg-white/10" />
                <span className="text-sm font-bold tracking-tight">Business</span>
              </div>
            </Link>
          </div>

          {/* Right: Theme + Navigation Links */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/pricing" className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">Pricing</Link>
              <Link href="/explore" className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">Explore</Link>
              <Link href="/changelog" className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">Changelog</Link>
            </nav>

            <div className="flex items-center gap-3">
              {mounted && (
                <div className="flex items-center gap-0.5 rounded-full border border-black/[0.05] dark:border-white/[0.05] bg-black/[0.02] dark:bg-white/[0.02] p-0.5 shadow-inner">
                  <button onClick={() => setTheme("light")} className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${theme === "light" ? "bg-black/10 dark:bg-white/15 shadow-sm" : "opacity-40 hover:opacity-90"}`}><Sun size={11} strokeWidth={2.5} /></button>
                  <button onClick={() => setTheme("system")} className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${theme === "system" ? "bg-black/10 dark:bg-white/15 shadow-sm" : "opacity-40 hover:opacity-90"}`}><Monitor size={11} strokeWidth={2.5} /></button>
                  <button onClick={() => setTheme("dark")} className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${theme === "dark" ? "bg-black/10 dark:bg-white/15 shadow-sm" : "opacity-40 hover:opacity-90"}`}><Moon size={11} strokeWidth={2.5} /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* Left Column: Value Proposition */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest opacity-70 w-max backdrop-blur-md">
                Lumina for Enterprise
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
                Scale your vision <br />
                <span className="text-black/90 dark:text-white/90 dark:bg-gradient-to-r dark:from-indigo-300 dark:via-white/90 dark:to-white/70 dark:bg-clip-text dark:text-transparent">without limits.</span>
              </h1>
              <p className="text-xl opacity-60 leading-relaxed max-w-lg">
                Unlock the full power of Lumina with enterprise-grade security, dedicated support, and custom implementation tailored for your team's unique workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <ShieldCheck className="text-emerald-500" />, title: "SSO & Security", desc: "Enterprise-grade SAML SSO and advanced role-based access control." },
                { icon: <Users className="text-blue-500" />, title: "Team Collaboration", desc: "Unlimited team seats and real-time multiplayer editing." },
                { icon: <Zap className="text-orange-500" />, title: "Priority Support", desc: "Dedicated account manager and 24/7 technical support." },
                { icon: <Globe className="text-purple-500" />, title: "Global Hosting", desc: "Optimized global CDN and custom domain management." },
                { icon: <Lock className="text-red-500" />, title: "Compliance", desc: "SOC2 Type II, GDPR, and HIPAA compliant infrastructure." },
                { icon: <BarChart3 className="text-indigo-500" />, title: "Advanced Analytics", desc: "Deep insights into site performance and visitor behavior." }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col gap-3 p-6 rounded-[24px] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-sm opacity-50 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="sticky top-24"
          >
            <div className="rounded-[40px] border border-black/10 dark:border-white/10 bg-white/50 dark:bg-[#0C0C0C] p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

              <div className="relative z-10">
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-3 tracking-tight">Let's talk business.</h2>
                  <p className="opacity-50">Fill out the form below and our sales team will get back to you within 24 hours.</p>
                </div>

                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-1">Full Name</label>
                          <input
                            required
                            type="text"
                            className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                            placeholder="Alex Rivera"
                            value={formState.name}
                            onChange={e => setFormState({ ...formState, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-1">Work Email</label>
                          <input
                            required
                            type="email"
                            className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                            placeholder="alex@company.com"
                            value={formState.email}
                            onChange={e => setFormState({ ...formState, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-1">Company</label>
                          <input
                            required
                            type="text"
                            className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                            placeholder="Acme Inc."
                            value={formState.company}
                            onChange={e => setFormState({ ...formState, company: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-1">Role</label>
                          <select
                            required
                            className="w-full bg-black/[0.03] dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all appearance-none"
                            value={formState.role}
                            onChange={e => setFormState({ ...formState, role: e.target.value })}
                          >
                            <option value="" disabled>Select your role</option>
                            <option value="founder">Founder / CEO</option>
                            <option value="cto">CTO / Engineering Lead</option>
                            <option value="designer">Designer / Design Lead</option>
                            <option value="product">Product Manager</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-1">How can we help?</label>
                        <textarea
                          required
                          rows={4}
                          className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all resize-none"
                          placeholder="Tell us about your team and project goals..."
                          value={formState.message}
                          onChange={e => setFormState({ ...formState, message: e.target.value })}
                        />
                      </div>

                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Contact Sales
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 flex flex-col items-center justify-center text-center gap-6"
                    >
                      <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <Check size={40} className="text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                        <p className="opacity-50 max-w-[280px]">Thanks for reaching out, {formState.name.split(' ')[0]}. Our team will be in touch shortly.</p>
                      </div>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="text-sm font-bold text-purple-500 hover:text-purple-400 transition-colors"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <a href="mailto:sales@lumina.build" className="flex flex-col gap-2 p-6 rounded-[24px] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors">
                <Mail className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-bold">Email Us</span>
                <span className="text-xs opacity-40">sales@lumina.build</span>
              </a>
              <div className="flex flex-col gap-2 p-6 rounded-[24px] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors">
                <Phone className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-bold">Call Us</span>
                <span className="text-xs opacity-40">+1 (888) LUMINA-BUILD</span>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-32 border-t border-black/5 dark:border-white/5 relative z-10">
        <div className="flex flex-col gap-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Frequently asked by enterprise teams</h2>
            <p className="opacity-50 text-lg">Everything you need to know about our security, compliance, and deployment models.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { q: "How do you handle data security?", a: "Lumina employs industry-standard encryption at rest and in transit. We are SOC2 Type II certified and conduct regular third-party security audits." },
              { q: "Can we self-host the generated code?", a: "Absolutely. Enterprise users can export full React/Next.js source code for self-hosting on their own infrastructure (AWS, Vercel, etc.)." },
              { q: "Do you offer custom SLA agreements?", a: "Yes, our Enterprise plan includes custom Service Level Agreements (SLA) with guaranteed uptime and response times." },
              { q: "Can we request custom components?", a: "Our enterprise engineering team can build bespoke component libraries and design systems tailored specifically for your brand." }
            ].map((faq, i) => (
              <BusinessFaqItem key={i} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function BusinessFaqItem({ faq }: { faq: { q: string, a: string } }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xl font-bold flex items-center gap-3 text-left w-full group"
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all shrink-0 ${isOpen ? 'bg-black/10 dark:bg-white/10 border-black/10 dark:border-white/20 opacity-60' : 'bg-black/[0.03] dark:bg-white/5 border-black/5 dark:border-white/5 opacity-40 group-hover:opacity-60'}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
        <span className="opacity-90 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">{faq.q}</span>
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
            <p className="opacity-50 leading-relaxed pl-11 pb-2">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LifeBuoy, 
  BookOpen, 
  MessageCircle, 
  FileText, 
  Search, 
  ArrowRight, 
  Check, 
  Mail, 
  Phone,
  Clock,
  ExternalLink,
  Sun,
  Moon,
  Monitor,
  Plus,
  Minus,
  HelpCircle
} from "lucide-react";
import { LuminaLogo } from "@/components/ui/LuminaLogo";
import { Footer } from "@/components/ui/Footer";
import { useTheme } from "next-themes";

export default function SupportPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
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
                <span className="text-sm font-bold tracking-tight">Support</span>
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
          
          {/* Left Column: Help Resources */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest opacity-70 w-max backdrop-blur-md">
                Customer Support
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
                We're here <br />
                <span className="text-black/90 dark:text-white/90 dark:bg-gradient-to-r dark:from-purple-300 dark:via-white/90 dark:to-white/70 dark:bg-clip-text dark:text-transparent">to help you.</span>
              </h1>
              <p className="text-xl opacity-60 leading-relaxed max-w-lg">
                Have a question or running into an issue? Our team is available 24/7 to ensure your experience with Lumina is seamless.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <BookOpen className="text-emerald-500" />, title: "Documentation", desc: "Browse our comprehensive guides and API references." },
                { icon: <MessageCircle className="text-blue-500" />, title: "Community Forum", desc: "Connect with other builders and share your projects." },
                { icon: <LifeBuoy className="text-orange-500" />, title: "Help Center", desc: "Search our knowledge base for quick answers." },
                { icon: <Clock className="text-purple-500" />, title: "System Status", desc: "Check real-time status of our global infrastructure." }
              ].map((resource, i) => (
                <div key={i} className="flex flex-col gap-3 p-6 rounded-[24px] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5 group-hover:scale-110 transition-transform">
                    {resource.icon}
                  </div>
                  <h3 className="font-bold tracking-tight flex items-center gap-2">
                    {resource.title}
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                  </h3>
                  <p className="text-sm opacity-50 leading-relaxed">{resource.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Support Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="sticky top-24"
          >
            <div className="rounded-[40px] border border-black/10 dark:border-white/10 bg-white/50 dark:bg-[#0C0C0C] p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-3 tracking-tight">Open a Ticket</h2>
                  <p className="opacity-50">Tell us what you're working on and we'll help you get it solved.</p>
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
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-1">Your Name</label>
                          <input 
                            required
                            type="text" 
                            className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                            placeholder="Alex Rivera"
                            value={formState.name}
                            onChange={e => setFormState({...formState, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-1">Work Email</label>
                          <input 
                            required
                            type="email" 
                            className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                            placeholder="alex@company.com"
                            value={formState.email}
                            onChange={e => setFormState({...formState, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-1">Subject</label>
                        <input 
                          required
                          type="text" 
                          className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                          placeholder="How can we help?"
                          value={formState.subject}
                          onChange={e => setFormState({...formState, subject: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-1">Category</label>
                        <select 
                          required
                          className="w-full bg-black/[0.03] dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all appearance-none"
                          value={formState.category}
                          onChange={e => setFormState({...formState, category: e.target.value})}
                        >
                          <option value="" disabled>Select a category</option>
                          <option value="billing">Billing & Subscription</option>
                          <option value="technical">Technical Issue</option>
                          <option value="feature">Feature Request</option>
                          <option value="account">Account Access</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-1">Description</label>
                        <textarea 
                          required
                          rows={4}
                          className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                          placeholder="Describe the issue in detail..."
                          value={formState.message}
                          onChange={e => setFormState({...formState, message: e.target.value})}
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
                            Submit Ticket
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
                        <h3 className="text-2xl font-bold mb-2">Ticket Submitted!</h3>
                        <p className="opacity-50 max-w-[280px]">We've received your request. A support specialist will contact you at {formState.email} shortly.</p>
                      </div>
                      <button 
                        onClick={() => setIsSubmitted(false)}
                        className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors"
                      >
                        Open another ticket
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Unified Contact & Demo Resources Grid (Aligned) */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* Demo Card */}
          <div className="p-6 rounded-[24px] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex items-center gap-6 h-full">
             <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                <HelpCircle className="text-purple-500" size={24} />
             </div>
             <div className="flex flex-col">
                <h4 className="font-bold text-base mb-1">Looking for a demo?</h4>
                <p className="text-sm opacity-60">Schedule a 1-on-1 walkthrough with our product experts.</p>
                <Link href="/business" className="text-sm font-bold text-purple-500 hover:text-purple-400 mt-2 inline-flex items-center gap-1 group">
                  Talk to Sales <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>
          </div>

          {/* Email Support Card */}
          <div className="flex flex-col gap-2 p-6 rounded-[24px] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors h-full">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                <Mail className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm font-bold">Email Support</span>
            </div>
            <p className="text-xs opacity-40 mb-2">Get technical assistance via email within 24 hours.</p>
            <span className="text-sm font-medium mt-auto">support@lumina.build</span>
          </div>

          {/* Live Chat Card */}
          <div className="flex flex-col gap-2 p-6 rounded-[24px] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors h-full">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <MessageCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-sm font-bold">Live Chat</span>
            </div>
            <p className="text-xs opacity-40 mb-2">Chat with our team in real-time during business hours.</p>
            <span className="text-sm font-medium mt-auto">Available 9am - 5pm EST</span>
          </div>
        </div>
      </main>

      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-32 border-t border-black/5 dark:border-white/5 relative z-10">
        <div className="flex flex-col gap-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Frequently asked support questions</h2>
            <p className="opacity-50 text-lg">Quick answers to common technical and billing questions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { q: "How do I reset my password?", a: "You can reset your password by clicking 'Forgot Password' on the login page. We'll send a reset link to your registered email address." },
              { q: "Where can I find my invoices?", a: "Invoices are available in your Account Settings under the 'Billing' tab. You can download them as PDF files for your records." },
              { q: "Do you offer technical onboarding?", a: "Yes, Team and Enterprise plans include dedicated onboarding sessions to help your team set up custom workflows." },
              { q: "How do I report a bug?", a: "The fastest way to report a bug is through the 'Open a Ticket' form on this page. Please include steps to reproduce the issue." }
            ].map((faq, i) => (
              <SupportFaqItem key={i} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SupportFaqItem({ faq }: { faq: { q: string, a: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="flex flex-col gap-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-xl font-bold flex items-center gap-3 text-left w-full group"
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all shrink-0 ${isOpen ? 'bg-black/10 dark:bg-white/10 border-black/10 dark:border-white/20 opacity-60' : 'bg-black/[0.03] dark:bg-white/5 border-black/5 dark:border-white/5 opacity-40 group-hover:opacity-60'}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
        <span className="opacity-90 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">{faq.q}</span>
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

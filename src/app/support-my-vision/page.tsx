"use client";

import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { Heart, Coffee, ShieldCheck } from "lucide-react";

export default function SupportVisionPage() {
  return (
    <div className="min-h-screen bg-page-bg text-foreground transition-colors duration-300">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Support My Vision</h1>
        <p className="text-xl text-center text-black/60 dark:text-white/60 mb-16 max-w-2xl mx-auto">
          Help me build the most powerful, open visual development platform for the next generation of web builders.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
              <Coffee className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold mb-4">One-time Support</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-8">
              Buy me a coffee to keep the development going and support server costs.
            </p>
            <button className="mt-auto w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold">
              Donate Now
            </button>
          </div>

          <div className="p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-4 right-4 px-2 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded uppercase">
              Popular
            </div>
            <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-bold mb-4">Monthly Sponsor</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-8">
              Get your name in the contributors list and early access to experimental features.
            </p>
            <button className="mt-auto w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold">
              Join $5/mo
            </button>
          </div>

          <div className="p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-4">Enterprise Backer</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-8">
              For organizations who want to support Lumina's long-term sustainability.
            </p>
            <button className="mt-auto w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold">
              Contact Us
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

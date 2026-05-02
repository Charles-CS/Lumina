"use client";

import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { Move, Layers, Type, Box } from "lucide-react";

export default function DesignGuidePage() {
  return (
    <div className="min-h-screen bg-page-bg text-foreground transition-colors duration-300">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Lumina Design Guide</h1>
        <p className="text-lg text-black/60 dark:text-white/60 mb-16 max-w-2xl leading-relaxed">
          The ultimate reference for designing stunning Lumina interfaces. Learn about our core design principles and how to use our system effectively.
        </p>

        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center">
                <Type className="w-5 h-5 text-indigo-500" />
              </div>
              <h2 className="text-2xl font-bold">Typography</h2>
            </div>
            <p className="text-black/60 dark:text-white/60 mb-6 leading-relaxed">
              We primarily use **Inter** for its clean, modern feel and excellent legibility across all screen sizes. Headers should be bold and impactful, while body text should maintain a comfortable line-height of 1.6.
            </p>
            <div className="p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4">
              <div className="text-3xl font-bold">Heading XL (36px+)</div>
              <div className="text-xl font-semibold">Heading MD (24px)</div>
              <div className="text-base text-black/60 dark:text-white/60">Body Text (16px) - The quick brown fox jumps over the lazy dog.</div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-indigo-500" />
              </div>
              <h2 className="text-2xl font-bold">Layering & Depth</h2>
            </div>
            <p className="text-black/60 dark:text-white/60 mb-6 leading-relaxed">
              Lumina uses subtle borders and background blurs to create depth. Avoid heavy shadows; instead, use 1px borders with low opacity for a more refined, modern SaaS feel.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

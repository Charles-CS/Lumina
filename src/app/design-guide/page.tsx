"use client";

import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { Move, Layers, Type, Box, Palette, Grid3X3, SunMoon } from "lucide-react";

export default function DesignGuidePage() {
  return (
    <div className="min-h-screen bg-page-bg text-foreground transition-colors duration-300">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Lumina Design Guide</h1>
          <p className="text-xl text-black/60 dark:text-white/60 leading-relaxed">
            The ultimate reference for designing stunning Lumina interfaces. Learn about our core design principles, tokens, and components to build consistent experiences.
          </p>
        </div>

        <div className="space-y-24">
          {/* Typography */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Type className="w-6 h-6 text-indigo-500" />
              </div>
              <h2 className="text-3xl font-bold">Typography</h2>
            </div>
            <p className="text-lg text-black/60 dark:text-white/60 mb-10 leading-relaxed max-w-3xl">
              We primarily use **Inter** (via Google Fonts) for its clean, modern feel and excellent legibility across all screen sizes. Headers should be bold and impactful, while body text should maintain a comfortable line-height of 1.6.
            </p>
            <div className="p-10 rounded-3xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] space-y-8">
              <div className="border-b border-black/5 dark:border-white/5 pb-6">
                <div className="text-[11px] uppercase tracking-widest text-black/40 dark:text-white/40 mb-2 font-bold">Heading Display</div>
                <div className="text-5xl md:text-6xl font-extrabold tracking-tighter">The future of web development.</div>
              </div>
              <div className="border-b border-black/5 dark:border-white/5 pb-6">
                <div className="text-[11px] uppercase tracking-widest text-black/40 dark:text-white/40 mb-2 font-bold">Heading Large</div>
                <div className="text-3xl md:text-4xl font-bold">Build something amazing today.</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-black/40 dark:text-white/40 mb-2 font-bold">Body Default</div>
                <div className="text-base md:text-lg text-black/60 dark:text-white/60 leading-relaxed max-w-2xl">
                  Lumina is an AI-powered visual builder that helps you create stunning websites effortlessly. Design, remix, and publish top-tier landing pages in seconds without writing a single line of code.
                </div>
              </div>
            </div>
          </section>

          {/* Color Palette */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <Palette className="w-6 h-6 text-pink-500" />
              </div>
              <h2 className="text-3xl font-bold">Color System</h2>
            </div>
            <p className="text-lg text-black/60 dark:text-white/60 mb-10 leading-relaxed max-w-3xl">
              Our color system is designed to be harmonious and accessible. We use a range of grays for text and surfaces, with indigo and violet as our primary accent colors.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Brand Indigo", color: "bg-indigo-500", hex: "#6366f1" },
                { name: "Brand Violet", color: "bg-violet-500", hex: "#8b5cf6" },
                { name: "Neutral Black", color: "bg-black", hex: "#000000" },
                { name: "Neutral White", color: "bg-white", hex: "#ffffff" },
                { name: "Dark Surface", color: "bg-[#050505]", hex: "#050505" },
                { name: "Light Surface", color: "bg-white", hex: "#ffffff" },
                { name: "Success Green", color: "bg-green-500", hex: "#22c55e" },
                { name: "Error Red", color: "bg-red-500", hex: "#ef4444" },
              ].map((c, i) => (
                <div key={i} className="space-y-3">
                  <div className={`aspect-video rounded-2xl ${c.color} border border-black/10 dark:border-white/10 shadow-sm`} />
                  <div>
                    <div className="text-sm font-bold">{c.name}</div>
                    <div className="text-[11px] text-black/40 dark:text-white/40 uppercase">{c.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Grid & Spacing */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Grid3X3 className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold">Grid & Spacing</h2>
            </div>
            <p className="text-lg text-black/60 dark:text-white/60 mb-6 leading-relaxed">
              We use a base 4px/8px grid system. Most paddings and margins are multiples of 8 (e.g., 16, 24, 32, 48, 64).
            </p>
            <ul className="list-disc list-inside text-black/60 dark:text-white/60 space-y-2">
              <li>Section Padding: 64px to 128px</li>
              <li>Component Gap: 16px to 32px</li>
              <li>Container Width: Max 1280px (max-w-7xl)</li>
            </ul>
          </section>

          {/* Dark Mode */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <SunMoon className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold">Dark Mode Implementation</h2>
            </div>
            <p className="text-lg text-black/60 dark:text-white/60 mb-10 leading-relaxed max-w-3xl">
              Dark mode isn't just about inverting colors. We use specific shades of black and charcoal to maintain depth and reduce eye strain.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-white text-black border border-black/10">
                <h4 className="font-bold mb-4">Light Mode Surface</h4>
                <div className="h-20 bg-black/5 rounded-xl border border-black/5 flex items-center justify-center text-sm">Background: #FFFFFF</div>
              </div>
              <div className="p-8 rounded-3xl bg-[#050505] text-white border border-white/10">
                <h4 className="font-bold mb-4">Dark Mode Surface</h4>
                <div className="h-20 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-sm">Background: #050505</div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

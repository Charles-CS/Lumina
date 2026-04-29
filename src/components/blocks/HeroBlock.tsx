"use client";

import React from "react";
import { BlockPreviewProps } from "./BlockPrimitives";
import { MoveRight } from "lucide-react";

export function HeroBlock({ title, subtitle, eyebrowText, primaryButtonText, secondaryButtonText, baseColor, typography, visuals }: BlockPreviewProps) {
  const accent = baseColor || "#a78bfa";
  const radius = visuals?.borderRadius !== undefined ? `${visuals?.borderRadius}px` : "24px";

  // Disable pointer events in preview mode
  const { isLivePreview } = require("@/store/useLuminaStore").useLuminaStore();
  return (
    <div
      className="relative w-full flex flex-col items-center justify-center overflow-hidden py-12 @md:py-24 @lg:py-32 px-4 @md:px-8"
      style={{ borderRadius: radius, pointerEvents: isLivePreview ? 'none' : undefined }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] aspect-video rounded-full opacity-20 blur-[100px] pointer-events-none"
        style={{ backgroundColor: accent }}
      />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto gap-4 @md:gap-6">
        <a href="#" className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] @md:text-xs font-medium text-white/70 hover:bg-white/10 transition-colors backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
          {eyebrowText || "Introducing Lumina Pro"}
          <MoveRight size={12} className="ml-1 opacity-50" />
        </a>

        <h1
          className="text-3xl @sm:text-4xl @md:text-6xl @lg:text-7xl font-bold tracking-tighter text-white leading-[1.1] @md:leading-[1.05]"
          style={{ fontSize: typography?.fontSize ? `${typography.fontSize}px` : undefined }}
        >
          {title || "Hero Section"}
        </h1>

        <p className="text-sm @md:text-lg @lg:text-xl text-white/50 max-w-2xl font-light leading-relaxed">
          {subtitle || "Drag and drop 15+ beautifully designed, Vercel-inspired react components to craft the perfect landing page in minutes."}
        </p>

        <div className="flex flex-col @sm:flex-row items-center gap-3 @md:gap-4 mt-6 @md:mt-10 w-full @sm:w-auto px-4 @sm:px-0">
          <button
            className="w-full @sm:w-auto px-8 py-3.5 @md:py-4 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 shadow-[0_0_20px_rgba(167,139,250,0.3)] whitespace-nowrap flex items-center justify-center"
            style={{ backgroundColor: accent }}
          >
            {primaryButtonText || "Start Building Free"}
          </button>

          <button className="w-full @sm:w-auto px-8 py-3.5 @md:py-4 rounded-xl text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors shadow-sm cursor-pointer whitespace-nowrap flex items-center justify-center">
            {secondaryButtonText || "View Components"}
          </button>
        </div>
      </div>
    </div>
  );
}




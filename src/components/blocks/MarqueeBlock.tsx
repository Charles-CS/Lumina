"use client";

import React from "react";
import { BlockPreviewProps } from "./BlockPrimitives";
import { motion } from "framer-motion";

const LOGOS = [
  "Vercel", "Linear", "Notion", "Stripe", "Figma", "Resend", "Supabase", "Raycast", "Loom", "Arc",
];

export function MarqueeBlock({ title, subtitle, baseColor, logos: propLogos }: BlockPreviewProps) {
  const accent = baseColor || "#a78bfa";
  const activeLogos = propLogos || LOGOS;

  return (
    <div className="w-full py-10 @md:py-16 px-0 relative overflow-hidden">
      {/* Fade masks left/right */}
      <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-[#030303] to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-[#030303] to-transparent" />

      <div className="flex flex-col items-center gap-8">
        <p className="text-xs font-bold tracking-widest uppercase text-white/25 px-6">
          {subtitle || "Trusted by teams at"}
        </p>

        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{ width: "max-content" }}
          >
            {[...activeLogos, ...activeLogos].map((name, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center justify-center px-6 py-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <span
                  className="text-sm font-bold tracking-tight text-white/30 hover:text-white/60 transition-colors select-none"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {title && (
          <p className="text-center text-white/40 text-sm font-light px-6">{title}</p>
        )}
      </div>
    </div>
  );
}

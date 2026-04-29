import React from "react";
import { BlockPreviewProps } from "./BlockPrimitives";

export function StatsBlock({ title, subtitle, baseColor, visuals, stats: propStats }: BlockPreviewProps) {
  const accent = baseColor || "#a78bfa";
  const radius = visuals?.borderRadius ? `${visuals?.borderRadius}px` : "24px";
  
  const defaultStats = [
    { value: "100+", label: "Premium Blocks" },
    { value: "0ms", label: "Runtime Overhead" },
    { value: "99%", label: "Lighthouse Score" },
    { value: "24/7", label: "Expert Support" }
  ];

  const stats = propStats && propStats.length > 0 ? propStats : defaultStats;

  return (
    <div className="w-full py-12 @md:py-16 px-4 @md:px-6">
      <div 
        className="max-w-5xl mx-auto flex flex-col gap-10 border border-white/5 p-6 @md:p-12 relative overflow-hidden"
        style={{ 
          borderRadius: radius,
          backgroundColor: (visuals?.cardBackgroundColor === "transparent" ? "transparent" : (visuals?.cardBackgroundColor || "#0a0a0a")) as string
        }}
      >
        {/* Glow orb */}
        <div 
          className="absolute top-0 right-0 w-64 h-64 blur-[80px] opacity-20 pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: accent }}
        />

        <div className="flex flex-col gap-2 relative z-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">{title || "Built for Scale"}</h2>
          <p className="text-white/50 text-sm max-w-sm">{subtitle || "Trusted by thousands of developers worldwide to power next-gen applications."}</p>
        </div>

        <div className="grid grid-cols-2 @lg:grid-cols-4 gap-8 relative z-10 pt-4 border-t border-white/10">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-4xl @md:text-5xl font-mono text-white tracking-tighter" style={{ textShadow: `0 0 20px ${accent}40` }}>
                {stat.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { BlockPreviewProps } from "./BlockPrimitives";
import { Check } from "lucide-react";

export function PricingBlock(props: BlockPreviewProps) {
  const { title, subtitle, badgeLabel, tiers: propTiers, baseColor, visuals } = props;
  const accent = baseColor || "#a78bfa";
  const radius = visuals?.borderRadius ? `${visuals?.borderRadius}px` : "24px";

  const defaultTiers = [
    {
      name: "Hobby",
      price: "$0",
      desc: "Perfect for side projects and learning.",
      features: ["Up to 3 projects", "Basic analytics", "Community support"],
      button: "Start Free",
      isPro: false,
    },
    {
      name: "Pro",
      price: "$29",
      desc: "For professionals and small teams ready to scale.",
      features: ["Unlimited projects", "Advanced analytics", "24/7 priority support", "Custom domains"],
      button: "Go Pro",
      isPro: true,
    },
  ];

  const tiersList = propTiers?.length ? propTiers : defaultTiers;

  return (
    <div className="w-full py-16 @md:py-24 px-4 @md:px-6 relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-12 text-center">
        
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold tracking-widest uppercase" style={{ color: accent }}>
            {subtitle || "Pricing"}
          </span>
          <h2 className="text-3xl @md:text-5xl font-bold tracking-tight text-white mb-4">
            {title || "Simple, transparent pricing"}
          </h2>
        </div>

        <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 w-full">
          {tiersList.map((t, i) => {
            const isPro = t.isPro !== undefined ? t.isPro : defaultTiers[i % defaultTiers.length].isPro;
            const features = Array.isArray(t.features) && t.features.length > 0 ? t.features : defaultTiers[i % defaultTiers.length].features;
            return (
            <div 
              key={i} 
              className={`flex flex-col p-8 text-left transition-all ${isPro ? "border-2 shadow-2xl relative" : "border border-white/5"} `}
              style={{ 
                borderRadius: radius,
                borderColor: isPro ? accent : undefined,
                boxShadow: isPro ? `0 0 40px ${accent}20` : undefined,
                backgroundColor: (isPro 
                  ? "rgba(255, 255, 255, 0.03)" 
                  : (visuals?.cardBackgroundColor === "transparent" ? "transparent" : (visuals?.cardBackgroundColor || "#0a0a0a"))) as string
              }}
            >
              {isPro && (
                <div 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase whitespace-nowrap"
                  style={{ backgroundColor: accent, color: "#000" }}
                >
                  {badgeLabel || "Most Popular"}
                </div>
              )}
              
              <h3 className="text-2xl font-semibold text-white">{t.name || defaultTiers[i % defaultTiers.length].name}</h3>
              <p className="text-white/40 text-sm mt-2 font-medium">{t.desc || defaultTiers[i % defaultTiers.length].desc}</p>
              
              <div className="my-8 flex items-end gap-1">
                <span className="text-5xl tracking-tighter font-bold text-white">{t.price || defaultTiers[i % defaultTiers.length].price}</span>
                <span className="text-white/40 text-sm pb-1">/mo</span>
              </div>
              
              <ul className="flex flex-col gap-4 mb-8 flex-1">
                {features.map((ft: string, j: number) => (
                  <li key={j} className="flex items-center gap-3 text-white/80 text-sm">
                    <Check size={16} style={{ color: accent, flexShrink: 0 }} />
                    {ft}
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3 rounded-lg font-semibold transition-all ${isPro ? "text-black hover:opacity-90" : "bg-white/5 text-white/90 border border-white/10 hover:bg-white/10"}`}
                style={{ backgroundColor: isPro ? accent : undefined }}
              >
                {t.button || defaultTiers[i % defaultTiers.length].button}
              </button>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

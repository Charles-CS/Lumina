import React from "react";
import { BlockPreviewProps } from "./BlockPrimitives";
import { ArrowRight } from "lucide-react";

export function CTABlock(props: BlockPreviewProps) {
  const { title, subtitle, buttonText, baseColor, visuals } = props;
  const accent = baseColor || "#a78bfa";
  const radius = visuals?.borderRadius ? `${visuals?.borderRadius}px` : "24px";

  return (
    <div className="w-full py-12 @md:py-16 px-4 @md:px-6">
      <div 
        className="max-w-4xl mx-auto flex flex-col items-center gap-12 text-center p-8 @md:p-24 relative overflow-hidden border border-white/5 shadow-xl"
        style={{ 
          borderRadius: radius,
          backgroundColor: (visuals?.cardBackgroundColor === "transparent" ? "transparent" : (visuals?.cardBackgroundColor || "rgba(0, 0, 0, 0.8)")) as string
        }}
      >
        <div 
          className="absolute inset-0 opacity-10 blur-3xl rounded-full"
          style={{ backgroundColor: accent }}
        />
        
        <div className="relative z-10 flex flex-col gap-6 items-center">
          <h2 className="text-4xl @md:text-6xl font-black tracking-tight text-white max-w-2xl">
            {title || "Ready to dive in?"}
          </h2>
          <p className="text-lg @md:text-xl text-white/50 max-w-xl font-light">
            {subtitle || "Start building your next application today with Lumina."}
          </p>
          
          <button 
            className="mt-4 w-full @sm:w-auto px-8 py-4 rounded-xl text-lg font-bold text-black transition-all hover:opacity-90 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            style={{ backgroundColor: accent, boxShadow: `0 0 40px ${accent}40` }}
          >
            {buttonText || "Get Started Now"}
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

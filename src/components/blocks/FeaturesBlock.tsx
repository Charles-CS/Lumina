import React from "react";
import { BlockPreviewProps } from "./BlockPrimitives";
import { Zap, Shield, Cpu, Code } from "lucide-react";

export function FeaturesBlock(props: BlockPreviewProps) {
  const { title, subtitle, baseColor, visuals } = props;
  const accent = baseColor || "#a78bfa";
  const radius = visuals?.borderRadius ? `${visuals?.borderRadius}px` : "24px";
  const bWeight = visuals?.borderWeight !== undefined ? `${visuals?.borderWeight}px` : "1px";
  const cardOpacity = visuals?.opacity !== undefined ? Number(visuals.opacity) / 100 : 1;
  const shadowVal = !visuals?.shadow || visuals.shadow === "none" ? "none" : 
    visuals.shadow === "sm" ? "0 4px 6px -1px rgba(0,0,0,0.1)" :
    visuals.shadow === "md" ? "0 10px 15px -3px rgba(0,0,0,0.1)" :
    visuals.shadow === "lg" ? "0 20px 25px -5px rgba(0,0,0,0.1)" :
    visuals.shadow === "glow" ? `0 0 40px ${accent}20` : "none";

  const defaultFeatures = [
    { icon: Zap, title: "Lightning Fast", desc: "Optimized for speed and performance." },
    { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption by default." },
    { icon: Cpu, title: "AI Powered", desc: "Smart contextual components." },
    { icon: Code, title: "Developer First", desc: "Extensible API and webhooks." }
  ];

  const features = props.features && props.features.length > 0
    ? props.features.map((f, i) => ({
        icon: defaultFeatures[i % defaultFeatures.length].icon,
        title: f.title || defaultFeatures[i % defaultFeatures.length].title,
        desc: f.desc || defaultFeatures[i % defaultFeatures.length].desc,
      }))
    : defaultFeatures;

  return (
    <div className="w-full py-16 @md:py-24 px-4 @md:px-6 relative" style={{ borderRadius: radius }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col text-center items-center gap-3">
          <span className="text-xs uppercase tracking-widest font-bold" style={{ color: accent }}>
            {subtitle || "Features"}
          </span>
          <h2 className="text-3xl @md:text-5xl font-bold tracking-tight text-white">
            {title || "Everything you need to scale"}
          </h2>
        </div>

        <div className="grid grid-cols-1 @md:grid-cols-2 gap-6">
          {features.map((ft, i) => (
            <div
              key={i}
              className="group p-8 border-white/5 transition-all hover:bg-white/[0.02]"
              style={{
                borderRadius: radius,
                borderWidth: bWeight,
                borderStyle: "solid",
                opacity: cardOpacity,
                boxShadow: shadowVal,
                backgroundColor: (visuals?.cardBackgroundColor === "transparent" ? "transparent" : (visuals?.cardBackgroundColor || "#0a0a0a")) as string
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-white/10 bg-white/5 group-hover:bg-white/10 transition-colors"
              >
                <ft.icon size={20} style={{ color: accent }} />
              </div>
              <h3 className="text-xl font-semibold text-white/90 mb-2">{ft.title}</h3>
              <p className="text-white/50 leading-relaxed font-light">{ft.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


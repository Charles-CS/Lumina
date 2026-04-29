import React from "react";
import { BlockPreviewProps } from "./BlockPrimitives";

export function StepsBlock({ title, subtitle, baseColor, visuals, steps: propSteps }: BlockPreviewProps) {
  const accent = baseColor || "#a78bfa";
  const radius = visuals?.borderRadius ? `${visuals?.borderRadius}px` : "24px";

  const steps = propSteps || [
    {
      num: "01",
      title: "Connect your repository",
      desc: "Import from GitHub, GitLab, or Bitbucket. Lumina detects your framework automatically.",
    },
    {
      num: "02",
      title: "Configure your build",
      desc: "Set environment variables and build commands — or let Lumina's zero-config defaults handle it.",
    },
    {
      num: "03",
      title: "Deploy to the edge",
      desc: "Your app is live on a global CDN in seconds. Every subsequent push deploys automatically.",
    },
    {
      num: "04",
      title: "Iterate with confidence",
      desc: "Preview deployments, instant rollbacks, and built-in analytics keep you moving fast.",
    },
  ];

  return (
    <div className="w-full py-16 @md:py-24 px-4 @md:px-6 relative">
      <div className="max-w-5xl mx-auto flex flex-col gap-16 items-center">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-sm font-bold tracking-widest uppercase" style={{ color: accent }}>
            {subtitle || "How it Works"}
          </span>
          <h2 className="text-3xl @md:text-5xl font-bold tracking-tight text-white">
            {title || "Ship in four steps."}
          </h2>
        </div>

        <div className="relative w-full">
          {/* Vertical connector line */}
          <div className="absolute left-[31px] top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden @md:block" />

          <div className="flex flex-col gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-6 group"
              >
                {/* Number badge */}
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-mono font-black text-sm border border-white/10 bg-[#0a0a0a] group-hover:border-white/20 transition-all relative z-10"
                  style={{
                    color: accent,
                    boxShadow: `0 0 0 0 ${accent}00`,
                  }}
                >
                  {step.num}
                </div>

                {/* Content */}
                <div
                  className="flex-1 p-6 border border-white/5 group-hover:border-white/10 transition-all"
                  style={{ 
                    borderRadius: radius,
                    backgroundColor: (visuals?.cardBackgroundColor === "transparent" ? "transparent" : (visuals?.cardBackgroundColor || "#0a0a0a")) as string
                  }}
                >
                  <h3 className="text-lg @md:text-xl font-semibold text-white/90 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/50 font-light leading-relaxed text-sm @md:text-base">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

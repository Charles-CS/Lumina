import React from "react";

import { SectionTypography, SectionVisuals } from "@/store/useLuminaStore";

export interface BlockPreviewProps {
  title?: string;
  subtitle?: string;
  eyebrowText?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  buttonText?: string;
  description?: string;
  badgeLabel?: string;
  features?: any[];
  tiers?: any[];
  testimonials?: any[];
  stats?: any[];
  faqs?: any[];
  team?: any[];
  steps?: any[];
  logos?: string[];
  code?: string;
  fileName?: string;
  links?: any;
  contactInfo?: any[];
  dashboardNav?: any[];
  dashboardStats?: any[];
  paddingY?: number;
  layout?: {
    paddingX?: number;
    gap?: number;
    maxWidth?: string;
  };
  baseColor?: string;
  typography?: SectionTypography;
  visuals?: SectionVisuals;
}

interface BlockPreviewShellProps {
  title: string;
  subtitle?: string;
  baseColor?: string;
}

export function BlockPreviewShell({ title, subtitle, baseColor = "#a78bfa" }: BlockPreviewShellProps) {
  return (
    <div className="w-full px-6 py-10 @md:px-10 @md:py-14">
      <div
        className="mx-auto w-full max-w-5xl rounded-3xl border border-white/10 bg-black/70"
        style={{ boxShadow: `0 0 48px ${baseColor}22` }}
      >
        <div className="px-8 py-10 @md:px-12 @md:py-14 text-center">
          <p className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
            Preview Block
          </p>
          <h3 className="mt-5 text-3xl font-semibold tracking-tight text-white @md:text-4xl">{title}</h3>
          {subtitle ? <p className="mx-auto mt-3 max-w-2xl text-white/60">{subtitle}</p> : null}
        </div>
      </div>
    </div>
  );
}

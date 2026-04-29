import React from "react";
import { BlockPreviewProps } from "./BlockPrimitives";
import { Layers, GitBranch, MessageCircle, PlayCircle } from "lucide-react";

export function FooterBlock(props: BlockPreviewProps) {
  const { title, baseColor, visuals, links: propLinks } = props;
  const accent = baseColor || "#a78bfa";
  const radius = visuals?.borderRadius ? `${visuals?.borderRadius}px` : "0px";

  const links = propLinks || [
    { title: "Product", items: ["Features", "Pricing", "Changelog", "Roadmap"] },
    { title: "Company", items: ["About", "Blog", "Careers", "Press Kit"] },
    { title: "Legal", items: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
  ];

  return (
    <div className="w-full border-t border-white/5" style={{ 
      borderRadius: radius
    }}>
      <div className="max-w-5xl mx-auto px-4 @md:px-6 py-12 @md:py-20 flex flex-col gap-12 @md:gap-16">
        {/* Top Row */}
        <div className="flex flex-col @md:flex-row justify-between gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-5 max-w-xs">
            <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
              <Layers size={22} style={{ color: accent }} />
              {title || "Lumina."}
            </div>
            <p className="text-white/40 text-sm leading-relaxed font-light">
              {props.description || "The modern platform for building premium web applications. Fast, beautiful, and developer-first."}
            </p>
            <div className="flex items-center gap-4">
              {[MessageCircle, GitBranch, PlayCircle].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="text-white/30 hover:text-white transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 @md:grid-cols-3 gap-8 @md:gap-16 mt-8 @md:mt-0">
            {links.map((category: any, idx: number) => (
              <div key={idx} className="flex flex-col gap-4">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40">{category.title}</h4>
                <ul className="flex flex-col gap-3">
                  {category.items.map((item: string) => (
                    <li key={item}>
                      <a href="#" className="text-sm text-white/55 hover:text-white transition-colors font-light">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col @md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-xs text-white/25 font-light" suppressHydrationWarning>
            {/* @ts-ignore - bottomText added dynamically */}
            {props.bottomText || `© ${new Date().getFullYear()} Lumina, Inc. All rights reserved.`}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-white/25">Built with</span>
            <span className="text-xs font-semibold" style={{ color: accent }}>Lumina</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { BlockPreviewProps } from "./BlockPrimitives";
import { GitBranch, MessageCircle, Link2 } from "lucide-react";

export function TeamBlock({ title, subtitle, description, baseColor, visuals, team: propTeam }: BlockPreviewProps) {
  const accent = baseColor || "#a78bfa";
  const radius = visuals?.borderRadius ? `${visuals?.borderRadius}px` : "24px";
  
  const defaultTeam = [
    { name: "Guillermo Rauch", role: "CEO", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80" },
    { name: "Lee Robinson", role: "VP of Developer Experience", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" },
    { name: "Delba de Oliveira", role: "Developer Advocate", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80" },
    { name: "Jared Palmer", role: "VP of Engineering", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150&q=80" },
  ];

  const team = propTeam && propTeam.length > 0 ? propTeam : defaultTeam;

  return (
    <div className="w-full py-16 @md:py-24 px-4 @md:px-6 relative">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-16 text-center">
        
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold tracking-widest uppercase" style={{ color: accent }}>
            {subtitle || "THE TEAM"}
          </span>
          <h2 className="text-3xl @md:text-5xl font-bold tracking-tight text-white mb-2">
            {title || "Meet the engineers."}
          </h2>
          <p className="text-lg text-white/50 max-w-2xl font-light">
            {description || "Passionate individuals obsessed with building the best developer experience on the web."}
          </p>
        </div>

        <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-8 w-full">
          {team.map((member, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div 
                className="w-32 h-32 @md:w-40 @md:h-40 border border-white/5 overflow-hidden mb-5 grayscale transition-all group-hover:grayscale-0 group-hover:border-white/20"
                style={{ 
                  borderRadius: radius,
                  backgroundColor: (visuals?.cardBackgroundColor === "transparent" ? "transparent" : (visuals?.cardBackgroundColor || "#0a0a0a")) as string
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.img} alt={member.name} className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500 ease-out" />
              </div>
              <h3 className="text-lg font-semibold text-white/90">{member.name}</h3>
              <p className="text-sm text-white/50 mb-4">{member.role}</p>
              
              <div className="flex items-center gap-3">
                <a href="#" aria-label="Github"><GitBranch size={16} className="text-white/30 hover:text-white transition-colors" /></a>
                <a href="#" aria-label="Twitter"><MessageCircle size={16} className="text-white/30 hover:text-white transition-colors" /></a>
                <a href="#" aria-label="LinkedIn"><Link2 size={16} className="text-white/30 hover:text-white transition-colors" /></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

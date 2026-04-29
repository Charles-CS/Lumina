import React from "react";
import { BlockPreviewProps } from "./BlockPrimitives";
import { Quote } from "lucide-react";

export function TestimonialsBlock({ title, subtitle, testimonials: propTestimonials, baseColor, visuals }: BlockPreviewProps) {
  const accent = baseColor || "#a78bfa";
  const radius = visuals?.borderRadius ? `${visuals?.borderRadius}px` : "24px";
  
  const defaultTestimonials = [
    { name: "Sarah Connor", role: "CTO @ Skynet", desc: "This has completely changed how we build systems. The speed is unbelievable." },
    { name: "John Wick", role: "Freelancer", desc: "Clean, precise, and works exactly when I need it most." },
    { name: "Ellen Ripley", role: "Engineer", desc: "Surviving the modern web ecosystem is tough, but these components make it a breeze." },
  ];

  const testimonialsList = propTestimonials?.length ? propTestimonials : defaultTestimonials;

  return (
    <div className="w-full py-16 @md:py-24 px-4 @md:px-6 relative">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12 text-center">
        
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold tracking-widest uppercase" style={{ color: accent }}>
            {subtitle || "Wall of Love"}
          </span>
          <h2 className="text-3xl @md:text-5xl font-bold tracking-tight text-white mb-4">
            {title || "Don't just take our word for it."}
          </h2>
        </div>

        <div className="grid grid-cols-1 @md:grid-cols-3 gap-6">
          {testimonialsList.map((t, i) => (
            <div 
              key={i} 
              className="group flex flex-col p-8 border border-white/5 hover:border-white/10 transition-colors shadow-sm"
              style={{ 
                borderRadius: radius,
                backgroundColor: (visuals?.cardBackgroundColor === "transparent" ? "transparent" : (visuals?.cardBackgroundColor || "#0a0a0a")) as string
              }}
            >
              <Quote className="mb-4 text-white/10 group-hover:text-white/20 transition-colors" size={28} />
              <p className="text-base text-white/70 font-light leading-relaxed mb-8 flex-1 text-left">
                &quot;{t.desc || defaultTestimonials[i % defaultTestimonials.length].desc}&quot;
              </p>
              
              <div className="flex items-center gap-3 mt-auto">
                <div 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs"
                  style={{ color: accent }}
                >
                  {(t.name || defaultTestimonials[i % defaultTestimonials.length].name)[0]}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-white/90">{t.name || defaultTestimonials[i % defaultTestimonials.length].name}</span>
                  <span className="text-[11px] text-white/40 uppercase tracking-widest">{t.role || defaultTestimonials[i % defaultTestimonials.length].role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

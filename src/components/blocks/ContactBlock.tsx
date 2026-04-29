import React from "react";
import { BlockPreviewProps } from "./BlockPrimitives";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export function ContactBlock(props: BlockPreviewProps) {
  const { title, subtitle, baseColor, visuals, contactInfo: propContactInfo } = props;
  const accent = baseColor || "#a78bfa";
  const radius = visuals?.borderRadius ? `${visuals?.borderRadius}px` : "24px";

  const contactInfo = propContactInfo || [
    { iconName: "Mail", label: "Email", value: "hello@lumina.dev" },
    { iconName: "Phone", label: "Phone", value: "+1 (555) 000-0000" },
    { iconName: "MapPin", label: "Office", value: "San Francisco, CA" },
  ];

  /* Mapping the string iconName to actual lucide icons for dynamic rendering if needed, or stick to static here, but we need icons. If they come from props, we might just use the string. Let's just use a helper or render dynamically. */
  const getIcon = (name: string) => {
    switch (name) {
      case "Mail": return Mail;
      case "Phone": return Phone;
      case "MapPin": return MapPin;
      default: return Mail;
    }
  };

  return (
    <div className="w-full py-16 @md:py-24 px-4 @md:px-6 relative">
      <div className="max-w-5xl mx-auto grid grid-cols-1 @md:grid-cols-2 gap-16 items-start">

        {/* Left: Contact Info */}
        <div className="flex flex-col gap-8">
          <div>
            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: accent }}>
              {subtitle || "Contact Us"}
            </span>
            <h2 className="mt-3 text-3xl @md:text-5xl font-bold tracking-tight text-white">
              {title || "Let's start a conversation."}
            </h2>
            <p className="mt-4 text-white/50 text-lg font-light leading-relaxed">
              {props.description || "Have a project in mind? Our team is ready to help you build something remarkable."}
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {contactInfo.map(({ iconName, label, value }) => {
              const Icon = getIcon(iconName || "Mail");
              return (
              <div key={label} className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg shrink-0"
                  style={{
                    color: accent,
                    backgroundColor: (visuals?.cardBackgroundColor === "transparent" ? "white/[0.03]" : (visuals?.cardBackgroundColor || "#0a0a0c")) as string
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-white/30">{label}</p>
                  <p className="text-sm font-medium text-white/80">{value}</p>
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Right: Form */}
        <div
          className="flex flex-col gap-6 p-8 border border-white/10 shadow-2xl overflow-hidden relative"
          style={{
            borderRadius: radius,
            backgroundColor: (visuals?.cardBackgroundColor === "transparent" ? "transparent" : (visuals?.cardBackgroundColor || "#0a0a0c")) as string
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <div className="grid grid-cols-1 @sm:grid-cols-2 gap-4">
            {["First Name", "Last Name"].map((ph) => (
              <div key={ph} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-white/30">{ph}</label>
                <input
                  type="text"
                  placeholder={ph}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none transition-all focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30"
                />
              </div>
            ))}
          </div>

          {[
            { label: "Email", type: "email", placeholder: "you@example.com" },
            { label: "Subject", type: "text", placeholder: "Project inquiry..." },
          ].map(({ label, type, placeholder }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-white/30">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none transition-all focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30"
              />
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-white/30">Message</label>
            <textarea
              rows={4}
              placeholder="Tell us about your project..."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none transition-all focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 resize-none"
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-black transition-all hover:opacity-90 shadow-lg mt-2"
            style={{ backgroundColor: accent, boxShadow: `0 0 20px ${accent}30` }}
          >
            <Send size={16} />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

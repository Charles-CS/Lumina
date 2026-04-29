"use client";

import React, { useState } from "react";
import { BlockPreviewProps } from "./BlockPrimitives";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FAQBlock({ title, subtitle, baseColor, visuals, faqs: propFaqs }: BlockPreviewProps) {
  const accent = baseColor || "#a78bfa";
  const radius = visuals?.borderRadius ? `${visuals?.borderRadius}px` : "24px";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultFaqs = [
    { q: "How does the pricing work?", a: "We offer a flat monthly rate with no hidden fees or usage caps. Cancel anytime." },
    { q: "Can I host this on my own servers?", a: "Yes, our enterprise plan includes on-premise deployment options and priority support." },
    { q: "What integrations do you support?", a: "We integrate seamlessly with Next.js, Vercel, Stripe, and over 100+ other modern tools and APIs." },
    { q: "Is there a free trial available?", a: "Absolutely. You can start building for free and only upgrade when you go to production." },
  ];

  const faqs = propFaqs && propFaqs.length > 0 ? propFaqs : defaultFaqs;

  return (
    <div className="w-full py-16 @md:py-24 px-4 @md:px-6 relative">
      <div className="max-w-4xl mx-auto flex flex-col items-start gap-12 @lg:flex-row @lg:justify-between">
        
        <div className="flex flex-col gap-3 @lg:w-1/3 sticky top-24">
          <span className="text-sm font-bold tracking-widest uppercase" style={{ color: accent }}>
            {subtitle || "Support"}
          </span>
          <h2 className="text-3xl @md:text-5xl font-bold tracking-tight text-white mb-4">
            {title || "Got questions?"}
          </h2>
          <p className="text-white/40 text-lg font-light leading-relaxed">
            Everything you need to know about the product and billing. Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.
          </p>
        </div>

        <div className="flex flex-col gap-4 @lg:w-2/3 w-full">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`flex flex-col border border-white/5 transition-all overflow-hidden ${isOpen ? "border-white/10" : "hover:border-white/10"}`}
                style={{ 
                  borderRadius: radius,
                  backgroundColor: (isOpen
                    ? "rgba(255, 255, 255, 0.04)"
                    : (visuals?.cardBackgroundColor === "transparent" ? "transparent" : (visuals?.cardBackgroundColor || "transparent"))) as string
                }}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-medium text-white/90">{faq.q}</span>
                  <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center bg-white/5 transition-transform" style={{ color: accent, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                    <Plus size={14} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0 text-base text-white/50 leading-relaxed font-light">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

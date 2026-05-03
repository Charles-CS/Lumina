"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Eye, SquareStack, Box } from "lucide-react";

interface TemplateModalProps {
  template: {
    title: string;
    image: string;
    badge: string;
    views: number;
    description?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateModal({ template, isOpen, onClose }: TemplateModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && template && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col md:flex-row w-full max-w-[1100px] h-full max-h-[700px] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden bg-[#0d0d0d] border border-white/10"
          >
            {/* Left: Image Preview */}
            <div className="flex-1 flex items-center justify-center bg-black/20 p-6 overflow-hidden">
              <img
                src={template.image}
                alt={template.title}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>

            {/* Right: Info Panel */}
            <div className="w-full md:w-[420px] flex-shrink-0 flex flex-col justify-between bg-transparent p-8 md:p-10 text-white border-l border-white/5 relative overflow-hidden">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all z-20"
              >
                <X size={20} />
              </button>

              <div className="flex-1 overflow-y-auto pr-2 mt-4 custom-scrollbar relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
                    Showcase
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight tracking-tight">{template.title}</h2>
                <p className="text-base text-white/60 mb-10 leading-relaxed font-light">
                  {template.description || "Our flagship marketing landing page. Engineered with physics-based motion and premium layout systems to drive conversions through aesthetic excellence."}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-4 mb-10">
                  <button
                    className="flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-white text-black font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Use Template
                    <ArrowRight size={16} />
                  </button>
                  <button
                    className="flex items-center justify-center w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm transition-colors hover:bg-white/10"
                  >
                    Preview Demo
                  </button>
                </div>

                {/* Tech Used */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Technologies Used</span>
                  <div className="flex flex-wrap gap-2">
                    {["Next.js 15", "React 19", "Tailwind 4", "Framer Motion"].map((tech) => (
                      <span key={tech} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-medium text-white/60 hover:bg-white/10 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Metadata */}
              <div className="flex items-center text-[11px] opacity-50 mt-8 pt-6 border-t border-white/10 space-x-6 whitespace-nowrap overflow-x-auto no-scrollbar">
                <span className="flex items-center space-x-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="font-medium">{template.views.toLocaleString()} Views</span>
                </span>
                <span className="flex items-center space-x-2">
                  <SquareStack className="w-3.5 h-3.5" />
                  <span className="font-medium">Responsive Design</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Box className="w-3.5 h-3.5" />
                  <span className="font-medium">v1.2.0</span>
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  id: string;
  targetId: string | null;
  text: string;
  onEnter?: () => void;
  cursorOffset?: { x: number; y: number };
  tooltipPos?: 'right' | 'left' | 'top' | 'bottom' | 'center';
  type?: 'default' | 'large';
}

const STEPS: Step[] = [
  {
    id: "welcome",
    targetId: null,
    text: "Welcome to Lumina Editor!",
    tooltipPos: "center",
    type: "large"
  },
  {
    id: "left-sidebar",
    targetId: "tutorial-left-sidebar",
    text: "This is the Left Sidebar. You can open it to find all components and templates.",
    onEnter: () => {
      window.dispatchEvent(new CustomEvent("tutorial-action", { detail: "open-left-sidebar" }));
    },
    cursorOffset: { x: -120, y: 0 },
    tooltipPos: "right"
  },
  {
    id: "templates",
    targetId: "tutorial-templates",
    text: "Under Templates, you'll find pre-built sections and saved blocks you can drag into your canvas.",
    onEnter: () => {
      window.dispatchEvent(new CustomEvent("tutorial-action", { detail: "open-templates" }));
    },
    tooltipPos: "right"
  },
  {
    id: "components",
    targetId: "tutorial-components",
    text: "Here are atomic components like Buttons and Text that you can freely position.",
    onEnter: () => {
      window.dispatchEvent(new CustomEvent("tutorial-action", { detail: "open-components" }));
    },
    tooltipPos: "right"
  },
  {
    id: "header",
    targetId: "tutorial-header",
    text: "The Top Header holds your viewport toggles, undo/redo, and the Publish button.",
    onEnter: () => {
      window.dispatchEvent(new CustomEvent("tutorial-action", { detail: "close-left-sidebar" }));
    },
    tooltipPos: "bottom"
  },
  {
    id: "inspector-style",
    targetId: "tutorial-tab-style",
    text: "This is the Property Inspector. The Style tab lets you change typography and colors for the selected section.",
    onEnter: () => {
      window.dispatchEvent(new CustomEvent("tutorial-action", { detail: "select-and-open-inspector" }));
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("tutorial-action", { detail: "tab-style" }));
      }, 300);
    },
    tooltipPos: "left"
  },
  {
    id: "inspector-layout",
    targetId: "tutorial-tab-layout",
    text: "The Layout tab configures padding, alignment, gaps, and borders.",
    onEnter: () => {
      window.dispatchEvent(new CustomEvent("tutorial-action", { detail: "tab-layout" }));
    },
    tooltipPos: "left"
  },
  {
    id: "inspector-global",
    targetId: "tutorial-tab-globalStyles",
    text: "The Globals tab manages site-wide settings like font families and the universal canvas background.",
    onEnter: () => {
      window.dispatchEvent(new CustomEvent("tutorial-action", { detail: "tab-globalStyles" }));
    },
    tooltipPos: "left"
  },
  {
    id: "inspector-config",
    targetId: "tutorial-tab-config",
    text: "The Config tab contains section-specific data, like text content, pricing tiers, and toggles.",
    onEnter: () => {
      window.dispatchEvent(new CustomEvent("tutorial-action", { detail: "tab-config" }));
    },
    tooltipPos: "left"
  },
  {
    id: "quick-add",
    targetId: "tutorial-quick-add",
    text: "Finally, use the Quick Add button directly on the canvas to insert templates instantly. You're ready to build!",
    onEnter: () => {
      window.dispatchEvent(new CustomEvent("tutorial-action", { detail: "close-inspector" }));
    },
    tooltipPos: "top"
  },
];

export function AICursorTutorial({ onComplete }: { onComplete: () => void }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);

  const step = STEPS[currentStepIdx];

  const updatePosition = () => {
    if (!step) return;

    let newPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    if (step.targetId) {
      const el = document.getElementById(step.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        newPos = {
          x: step.id === 'header' ? window.innerWidth / 2 : rect.left + rect.width / 2 + (step.cursorOffset?.x || 0),
          y: rect.top + rect.height / 2 + (step.cursorOffset?.y || 0),
        };
      }
    }

    setTargetPos((prev) => {
      if (prev && prev.x === newPos.x && prev.y === newPos.y) return prev;
      return newPos;
    });
  };

  useEffect(() => {
    if (step && step.onEnter) {
      step.onEnter();
    }
    
    // Continuously update position for 1 second to perfectly track elements during layout animations
    let startTime = Date.now();
    let frameId: number;
    
    const animatePos = () => {
      updatePosition();
      if (Date.now() - startTime < 1000) {
        frameId = requestAnimationFrame(animatePos);
      }
    };
    
    frameId = requestAnimationFrame(animatePos);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [currentStepIdx, step]);

  useEffect(() => {
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [step]);

  const handleNext = () => {
    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx((i) => i + 1);
    } else {
      onComplete();
    }
  };

  if (!step || !targetPos) return null;

  const getTooltipPositionStyle = (pos?: 'right' | 'left' | 'top' | 'bottom' | 'center'): React.CSSProperties => {
    switch (pos) {
      case 'right': return { left: '24px', top: '0px', transform: 'translateY(-50%)' };
      case 'left': return { right: '16px', top: '0px', transform: 'translateY(-50%)' };
      case 'top': return { bottom: '24px', left: '0px', transform: 'translateX(-50%)' };
      case 'center': return { top: '0px', left: '0px', transform: 'translate(-50%, -50%)' };
      case 'bottom': 
      default: return { top: '24px', left: '0px', transform: 'translateX(-50%)' };
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] cursor-pointer"
      onClick={handleNext}
      style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
    >
      <motion.div
        className="absolute pointer-events-none"
        initial={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}
        animate={{ x: targetPos.x, y: targetPos.y }}
        transition={{ type: "spring", damping: 20, stiffness: 100, mass: 0.8 }}
        style={{ originX: 0, originY: 0 }}
      >
        {/* Custom AI Cursor (Hidden during large welcome popup) */}
        {step.type !== 'large' && (
          <div className="absolute" style={{ left: '-8px', top: '-8px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg text-violet-500">
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.42c.45 0 .67-.54.35-.85L5.85 2.86a.5.5 0 00-.85.35z" fill="currentColor"/>
            </svg>
            <motion.div
              className="absolute top-4 left-4 w-2 h-2 rounded-full bg-accent-glow"
              animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        )}

        {/* Tooltip Modal */}
        <div className={`absolute pointer-events-none ${step.type === 'large' ? 'z-50' : ''}`} style={getTooltipPositionStyle(step.tooltipPos)}>
          <motion.div
            key={step.id} // Re-animate position when step changes
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`bg-[#09090b]/95 backdrop-blur-xl border border-violet-500/50 shadow-[0_0_40px_rgba(139,92,246,0.3)] rounded-2xl p-4 pointer-events-auto ${step.type === 'large' ? 'w-[540px]' : 'max-w-[280px] w-max pointer-events-none'}`}
          >
            {step.type === 'large' ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  <span className="text-[12px] font-bold uppercase tracking-widest text-violet-300">Lumina AI Guide</span>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2 text-center">{step.text}</h2>
                <p className="text-sm text-white/60 mb-6 text-center">
                  Lumina uses a fully fluid canvas. The sidebars are hidden by default to give you a true WYSIWYG experience.
                </p>

                {/* Stylized Editor Diagram */}
                <div className="relative w-full h-[220px] bg-[#050505] border border-white/10 rounded-xl overflow-hidden mb-6 flex">
                  {/* Left Sidebar (Open) */}
                  <div className="w-[90px] h-full bg-[#111113] border-r border-white/10 p-3 flex flex-col gap-3 relative z-10 shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
                    <div className="w-full h-4 bg-white/10 rounded-sm" />
                    <div className="w-3/4 h-2 bg-white/5 rounded-sm mt-4" />
                    <div className="w-full h-2 bg-white/5 rounded-sm" />
                    <div className="w-5/6 h-2 bg-white/5 rounded-sm" />
                  </div>
                  
                  {/* Canvas */}
                  <div className="flex-1 h-full bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden bg-grid-white/[0.02]">
                    {/* Zoom 80% indicator */}
                    <div className="absolute top-2 right-2 text-[8px] text-white/30 border border-white/10 px-1.5 py-0.5 rounded">80%</div>
                    
                    {/* Mock Hero Block */}
                    <div className="w-[180px] h-[120px] bg-gradient-to-b from-violet-500/10 to-transparent border border-violet-500/20 rounded-lg flex flex-col items-center justify-center gap-3 p-3 shadow-xl">
                        <div className="w-1/2 h-3 bg-white/20 rounded-full" />
                        <div className="w-3/4 h-1.5 bg-white/10 rounded-full" />
                        <div className="w-5/6 h-1.5 bg-white/10 rounded-full" />
                        <div className="w-1/3 h-5 bg-violet-600/80 rounded mt-1" />
                    </div>

                    {/* Left Arrow */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-start gap-1.5 pointer-events-none">
                      <motion.div animate={{ x: [-4, 0, -4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-violet-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                      </motion.div>
                      <span className="text-[9px] font-bold text-violet-300 uppercase tracking-wider bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-md border border-white/10">Hover Left</span>
                    </div>

                    {/* Right Arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1.5 pointer-events-none">
                      <motion.div animate={{ x: [4, 0, 4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-violet-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </motion.div>
                      <span className="text-[9px] font-bold text-violet-300 uppercase tracking-wider bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-md border border-white/10">Hover Right</span>
                    </div>
                  </div>
                  
                  {/* Right Sidebar (Open) */}
                  <div className="w-[90px] h-full bg-[#111113] border-l border-white/10 p-3 flex flex-col gap-3 relative z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.5)]">
                    <div className="w-full flex justify-between gap-1 mb-2">
                        <div className="w-1/3 h-3 bg-white/10 rounded-sm" />
                        <div className="w-1/3 h-3 bg-white/5 rounded-sm" />
                        <div className="w-1/3 h-3 bg-white/5 rounded-sm" />
                    </div>
                    <div className="w-2/3 h-2 bg-white/10 rounded-sm mt-2" />
                    <div className="w-full h-8 bg-white/5 rounded-sm" />
                    <div className="w-2/3 h-2 bg-white/10 rounded-sm mt-2" />
                    <div className="w-full h-8 bg-white/5 rounded-sm" />
                  </div>
                </div>

                <div className="flex justify-center mt-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }} 
                    className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                  >
                    Start Interactive Guide
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-violet-300">Lumina AI Guide</span>
                </div>
                <p className="text-sm text-white/90 font-medium leading-relaxed">
                  {step.text}
                </p>
                <div className="mt-3 text-[10px] text-white/40 flex justify-between items-center">
                  <span>Click anywhere to continue</span>
                  <span className="font-mono">{currentStepIdx + 1} / {STEPS.length}</span>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

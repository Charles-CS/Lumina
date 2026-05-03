"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { LuminaLogo } from "@/components/ui/LuminaLogo";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Layers, Code2, Cpu, Globe, Palette, Monitor, Type, Box, ChevronRight, ArrowUpRight, X, Eye, SquareStack } from "lucide-react";
import { TemplateModal } from "@/components/ui/TemplateModal";

// --- Sub-components to adhere to Rules of Hooks ---

function WorkflowSection() {
  const displaySteps = [
    {
      title: "Select a Base",
      desc: "Start with a blank canvas or pick from our curated collection of industry-standard templates.",
      icon: <Layers className="h-6 w-6 text-black dark:text-white" />,
    },
    {
      title: "Customize Freely",
      desc: "Modify every detail with our real-time visual editor. Instant live feedback for all your creative tweaks.",
      icon: <Palette className="h-6 w-6 text-black dark:text-white" />,
    },
    {
      title: "Deploy Instantly",
      desc: "Export clean React code or deploy directly to the edge. Optimized for speed and SEO out of the box.",
      icon: <Zap className="h-6 w-6 text-black dark:text-white" />,
    }
  ];

  return (
    <section className="flex flex-col gap-16 py-12 relative overflow-hidden">
      <div className="flex flex-col gap-4 md:items-center text-left md:text-center max-w-2xl mx-auto mb-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white"
        >
          Simple. <span className="text-black dark:text-white/40 italic">Fast.</span> Precise.
        </motion.h2>
      </div>

      <div className="w-full relative overflow-hidden py-10">
        {/* Subtle Fade Edges */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[var(--page-bg)] to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[var(--page-bg)] to-transparent z-20 pointer-events-none" />

        <motion.div
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex w-max"
        >
          {/* Three sets for a seamless infinite loop across all screen sizes */}
          {[...displaySteps, ...displaySteps, ...displaySteps].map((step, i) => (
            <React.Fragment key={i}>
              <div className="w-[420px] shrink-0 flex flex-col px-4">
                <div className="h-full rounded-[32px] border border-black/10 dark:border-white/10 bg-white/50 dark:bg-[#121212] backdrop-blur-sm p-8 md:p-12 flex flex-col gap-8 transition-all duration-500 hover:border-black/30 dark:hover:border-white/30 hover:bg-white/80 dark:hover:bg-[#181818] overflow-hidden min-h-[340px]">

                  {/* Icon Container */}
                  <div className="h-14 w-14 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/5 dark:bg-white/5 blur-xl" />
                    <div className="relative z-10">
                      {step.icon}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white tracking-tight leading-tight whitespace-nowrap">
                      {step.title}
                    </h3>
                    <p className="text-base text-black/60 dark:text-white/50 leading-relaxed font-light">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Arrows between cards */}
              <div className="flex items-center justify-center px-6 shrink-0 pointer-events-none">
                <div className="flex items-center -space-x-5">
                  <ChevronRight className="w-8 h-8 text-black/10 dark:text-white/10" strokeWidth={4} />
                  <ChevronRight className="w-10 h-10 text-black/20 dark:text-white/20" strokeWidth={4} />
                  <ChevronRight className="w-12 h-12 text-black/40 dark:text-white/40" strokeWidth={4} />
                </div>
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CoreCapabilitiesCarousel() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const capabilities = [
    {
      title: "Dual-Theme Engine",
      icon: <Monitor className="h-6 w-6" />,
      workflow: [
        { label: "Preference", icon: <Cpu size={14} /> },
        { label: "Token Map", icon: <Palette size={14} /> },
        { label: "Injection", icon: <Zap size={14} /> }
      ],
      howItWorks: [
        "Detects OS preference and persists override instantly.",
        "Maps colors to HSL tokens for visual harmony.",
        "Injects variables with zero layout shift or flicker."
      ]
    },
    {
      title: "UI Grid",
      icon: <Cpu className="h-6 w-6" />,
      workflow: [
        { label: "Definition", icon: <Box size={14} /> },
        { label: "Rhythm", icon: <Type size={14} /> },
        { label: "Alignment", icon: <Layers size={14} /> }
      ],
      howItWorks: [
        "Establishes a strict 8pt base unit across all components.",
        "Analyzes vertical rhythm for typography consistency.",
        "Aligns elements to the global grid automatically."
      ]
    },
    {
      title: "Code Export",
      icon: <Code2 className="h-6 w-6" />,
      workflow: [
        { label: "AST Analysis", icon: <Code2 size={14} /> },
        { label: "Optimization", icon: <Sparkles size={14} /> },
        { label: "React 19", icon: <Zap size={14} /> }
      ],
      howItWorks: [
        "Analyzes structure to build a clean Abstract Syntax Tree.",
        "Optimizes Tailwind classes for minimal bundle size.",
        "Generates production-ready React 19 code instantly."
      ]
    },
    {
      title: "Edge Performance",
      icon: <Globe className="h-6 w-6" />,
      workflow: [
        { label: "Analysis", icon: <Layers size={14} /> },
        { label: "Caching", icon: <Cpu size={14} /> },
        { label: "Delivery", icon: <Globe size={14} /> }
      ],
      howItWorks: [
        "Optimizes static assets for minimal payload weight.",
        "Caches optimized versions across global Edge networks.",
        "Delivers content from the nearest Edge node instantly."
      ]
    }
  ];

  // Navigation is now exclusively handled by user clicks.


  return (
    <section className="flex flex-col gap-12 py-12">
      <div className="flex flex-col gap-4 md:items-center text-left md:text-center max-w-2xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 dark:text-white/40"
        >
          Core Architecture
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white"
        >
          Core Capabilities
        </motion.h2>
      </div>

      <div className="relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch w-full max-w-6xl mx-auto min-h-[540px] lg:h-[540px]">

          {/* Left side: Navigation / Toggles */}
          <div className="flex flex-col gap-4 order-2 lg:order-1 h-full">
            {capabilities.map((cap, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`group flex-1 text-left p-6 rounded-[24px] border transition-all duration-500 flex items-center gap-6 ${activeIndex === i
                      ? "bg-white dark:bg-white/5 border-black/10 dark:border-white/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-transparent"
                      : "bg-transparent border-transparent opacity-40 hover:opacity-100 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    }`}
                >
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-500 ${activeIndex === i ? "bg-black dark:bg-white text-white dark:text-black scale-110 shadow-lg" : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40"
                  }`}>
                  {React.cloneElement(cap.icon as any, { size: 18 })}
                </div>
                <div>
                  <h4 className={`text-xl font-bold transition-colors ${activeIndex === i ? "text-black dark:text-white" : "text-black/60 dark:text-white/40"}`}>
                    {cap.title}
                  </h4>
                </div>
              </button>
            ))}
          </div>

          {/* Right side: Compact Detailed Card */}
          <div className="relative order-1 lg:order-2 h-full w-full min-h-[540px]">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{
                  opacity: activeIndex === i ? 1 : 0,
                  scale: activeIndex === i ? 1 : 0.98,
                  zIndex: activeIndex === i ? 10 : 0,
                  pointerEvents: activeIndex === i ? "auto" : "none"
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 h-full w-full"
              >
                <div className="h-full w-full rounded-[32px] border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#0c0c0c] p-10 shadow-2xl relative flex flex-col gap-8 items-center justify-center text-center overflow-hidden">
                  <div className="absolute inset-0 bg-grid opacity-[0.03] dark:opacity-10" />

                  {/* Header: Icon + Title */}
                  <div className="relative z-10 flex flex-col items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white shadow-sm">
                      {React.cloneElement(cap.icon as any, { size: 22 })}
                    </div>
                    <h3 className="text-3xl font-bold text-black dark:text-white tracking-tight">{cap.title}</h3>
                  </div>

                  {/* Workflow */}
                  <div className="relative z-10 w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30">Process Workflow</span>
                    </div>
                    <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-6">
                      <div className="flex items-center justify-between relative z-10">
                        {cap.workflow.map((step, idx) => (
                          <React.Fragment key={idx}>
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-9 w-9 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-black/50 flex items-center justify-center text-black dark:text-white shadow-sm">
                                {React.cloneElement(step.icon as any, { size: 14 })}
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 leading-tight">
                                {step.label}
                              </span>
                            </div>
                            {idx < cap.workflow.length - 1 && (
                              <div className="flex-1 h-[1px] bg-black/5 dark:bg-white/5 mx-2" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* How It Works */}
                  <div className="relative z-10 w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30">System Integration</span>
                    </div>
                    <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-6 text-left space-y-4">
                      {cap.howItWorks.map((point, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="h-6 w-6 shrink-0 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[10px] font-bold text-black/40 dark:text-white/40">
                            {idx + 1}
                          </div>
                          <p className="text-[13px] text-black/50 dark:text-white/50 leading-relaxed font-medium">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function UnderTheHoodSection() {
  const techStack = [
    { name: "Next.js 15", desc: "App Router & React 19", color: "bg-black dark:bg-white" },
    { name: "Tailwind v4", desc: "Engineered for speed", color: "bg-black/40 dark:bg-white/40" },
    { name: "Zustand", desc: "Atomic state management", color: "bg-black/20 dark:bg-white/20" },
    { name: "Framer Motion", desc: "Physics-based motion", color: "bg-black/60 dark:bg-white/60" }
  ];

  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="rounded-[40px] border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#0c0c0c] p-8 md:p-16 relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-grid opacity-[0.03] dark:opacity-[0.1]" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            {/* Left Side: Content */}
            <div className="flex flex-col gap-8 text-left">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 dark:text-white/40"
                >
                  The Lumina Engine
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1]"
                >
                  Precision in <br />
                  <span className="text-black dark:text-white/30">every layer.</span>
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-xl text-black/50 dark:text-white/50 max-w-lg font-light leading-relaxed"
                >
                  Lumina isn't just a builder—it's a high-performance creative runtime. Built on a bleeding-edge stack for developers who demand perfection.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {techStack.map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="group p-5 rounded-3xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all duration-500"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-1.5 h-10 rounded-full ${tech.color}`} />
                      <div>
                        <h4 className="text-sm font-bold text-black dark:text-white">{tech.name}</h4>
                        <p className="text-[11px] text-black/40 dark:text-white/40 uppercase tracking-wider font-bold mt-0.5">{tech.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Side: 3D Layered Architecture Visualization */}
            <div className="relative h-[500px] flex items-center justify-center perspective-[1500px]">
              <div className="relative w-full h-full preserve-3d">
                {/* Layers */}
                {[
                  { name: "Interaction Layer", icon: <Zap size={24} />, color: "border-black/10 dark:border-white/10", offset: "-translate-y-28" },
                  { name: "Styling System", icon: <Palette size={24} />, color: "border-black/10 dark:border-white/10", offset: "-translate-y-10" },
                  { name: "Core Engine", icon: <Cpu size={24} />, color: "border-black/10 dark:border-white/10", offset: "translate-y-8" },
                  { name: "Global Delivery", icon: <Globe size={24} />, color: "border-black/10 dark:border-white/10", offset: "translate-y-24" }
                ].map((layer, i) => (
                  <motion.div
                    key={layer.name}
                    initial={{ opacity: 0, rotateX: 45, rotateZ: -15, y: 100 }}
                    whileInView={{ opacity: 1, rotateX: 55, rotateZ: -25, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[200px] rounded-[32px] border bg-white/60 dark:bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4 ${layer.color} shadow-sm group hover:scale-105 transition-transform duration-700 ${layer.offset}`}
                    style={{ zIndex: 40 - i * 10 }}
                  >
                    <div className="absolute inset-0 bg-grid opacity-[0.03] dark:opacity-[0.05] rounded-[32px]" />
                    <div className="relative z-10 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-black dark:text-white">
                      {layer.icon}
                    </div>
                    <div className="relative z-10 text-center">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black/30 dark:text-white/30 block mb-1">Layer 0{4 - i}</span>
                      <h4 className="text-lg font-bold text-black dark:text-white">{layer.name}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Status Floating Chip */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="absolute top-10 right-0 p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md shadow-sm z-50 flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
                <div className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest">Runtime: Optimized</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InteractionMotionSection() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const features = [
    { 
      title: "Lumina Kinetics", 
      desc: "Physics-based animation core", 
      details: ["Real-time momentum tracking", "Spring-physics interpolation", "Damping & mass resistance"] 
    },
    { 
      title: "Context Transitions", 
      desc: "Aware of every element's state", 
      details: ["Shared element transitions", "Intelligent layout reordering", "State-preserving motion"] 
    },
    { 
      title: "Viewport Dynamics", 
      desc: "Interactions tied to user focus", 
      details: ["Scroll-velocity awareness", "Viewport entrance triggers", "Smooth parallax orchestration"] 
    }
  ];

  return (
    <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600 fill-mode-both py-12">
      <div className="rounded-[40px] border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#0c0c0c] p-8 md:p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.03] dark:opacity-10" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-16">
          {/* Left side: Selection */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/40 mb-6 w-max">
              Motion Engine
            </div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6">Orchestrated Motion</h3>
            <p className="text-lg text-black/50 dark:text-white/50 mb-10 max-w-lg font-light leading-relaxed">
              Every element in Lumina is motion-aware. We've built a physics-based animation engine that ensures transitions feel natural, fluid, and intentional.
            </p>

            <div className="flex flex-col gap-4">
              {features.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`group w-full text-left p-6 rounded-2xl border transition-all flex items-center justify-between ${activeIndex === i
                    ? "bg-black/5 dark:bg-white/5 border-black/20 dark:border-white/20 shadow-sm"
                    : "bg-transparent border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                >
                  <div>
                    <h4 className={`text-lg font-bold ${activeIndex === i ? "text-black dark:text-white" : "text-black/60 dark:text-white/40"}`}>{f.title}</h4>
                    <p className="text-sm text-black/40 dark:text-white/30">{f.desc}</p>
                  </div>
                  <div className={`h-8 w-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center transition-all ${activeIndex === i ? "bg-black dark:bg-white text-white dark:text-black shadow-lg" : "text-black/30 dark:text-white/30 group-hover:scale-110"}`}>
                    <ArrowRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right side: Detailed Focus Card */}
          <div className="flex-1">
            <div className="rounded-[32px] border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#121212] p-8 md:p-12 relative h-full flex flex-col shadow-inner">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h4 className="text-3xl font-bold text-black dark:text-white mb-2">{features[activeIndex].title}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-black dark:text-white tracking-tighter">Fluid</span>
                    <span className="text-sm text-black/40 dark:text-white/40 font-bold uppercase tracking-widest">Dynamics</span>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 mb-8 flex-1 shadow-sm">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30 mb-6">Core Capabilities:</h5>
                <ul className="space-y-4">
                  {features[activeIndex].details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-black/70 dark:text-white/70 font-medium">
                      <div className="h-1.5 w-1.5 rounded-full bg-black/40 dark:bg-white/40" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-black/40 dark:text-white/30 font-medium">
                <div className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-[9px] font-bold italic">i</div>
                <span>Physics-first architecture. Performance optimized for Lumina v1.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LuminaDiscoverySection() {
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

  const templates = [
    { title: "Horizon Dashboard", tag: "Productivity", image: "/images/templates/TemplatePage1.png", desc: "A high-performance analytics dashboard designed for complex data visualization. Features include real-time metrics, interactive charts, and a glassmorphic sidebar layout.", author: { name: "Sarah M.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80" } },
    { title: "Arc Portfolio", tag: "Creative", image: "/images/templates/minimal_mockup_1_new.png", desc: "A minimalist creative portfolio focusing on high-impact typography and smooth scroll transitions. Ideal for photographers, designers, and digital artists.", author: { name: "Alex K.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80" } },
    { title: "Lumina Marketing", tag: "Showcase", image: "/images/templates/featured_v1.png", desc: "Our flagship marketing landing page. Engineered with physics-based motion and premium layout systems to drive conversions through aesthetic excellence.", author: { name: "Sarah M.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80" } },
    { title: "Vault Docs", tag: "Technical", image: "/images/templates/TemplatePage3.png", desc: "A technical documentation template that balances readability with technical sophistication. Includes a multi-level sidebar and search-first navigation.", author: { name: "Vannarot R.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" } },
    { title: "Nova UI Kit", tag: "Interface", image: "/images/templates/pro_2.png", desc: "A comprehensive UI component library showcase. Designed with atomic design principles to ensure consistency across every visual element.", author: { name: "Alex K.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80" } }
  ];

  const closeModal = () => setSelectedTemplate(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/40 w-max"
          >
            Infinite Exploration
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black dark:text-white">
            Discover the <span className="text-black dark:text-white/30">Lumina Gallery.</span>
          </h2>
          <p className="text-lg text-black/50 dark:text-white/50 max-w-2xl font-light">
            Browse through hundreds of high-fidelity templates designed to push the boundaries of what's possible on the modern web.
          </p>
        </div>

        {/* Scrolling Discovery Cards */}
        <div className="flex gap-6 overflow-hidden relative group">
          <div className="flex gap-6 animate-marquee whitespace-nowrap">
            {[...templates, ...templates].map((t, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedTemplate(t)}
                className="w-[340px] h-[420px] rounded-[32px] border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#0c0c0c] p-6 flex flex-col gap-6 group/card hover:bg-black dark:hover:bg-white transition-all duration-500 cursor-pointer shadow-sm"
              >
                <div className="flex flex-col gap-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/30 dark:text-white/30 group-hover/card:text-white/40 dark:group-hover/card:text-black/40 transition-colors">
                         {t.tag}
                      </span>
                      <div className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover/card:border-white/20 dark:group-hover/card:border-black/20">
                         <ArrowUpRight size={14} className="text-black/40 dark:text-white/40 group-hover/card:text-white dark:group-hover/card:text-black transition-colors" />
                      </div>
                   </div>
                   <h4 className="text-2xl font-bold text-black dark:text-white group-hover/card:text-white dark:group-hover/card:text-black transition-colors leading-tight">
                      {t.title}
                   </h4>
                </div>
                
                <div className="flex-1 w-full rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 overflow-hidden relative group-hover/card:border-white/10 dark:group-hover/card:border-black/10 transition-colors">
                   <img 
                      src={t.image} 
                      alt={t.title} 
                      className="w-full h-full object-contain p-2 grayscale opacity-50 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-700 group-hover/card:scale-105"
                   />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TemplateModal 
        template={selectedTemplate ? {
          ...selectedTemplate,
          badge: selectedTemplate.tag,
          views: 1240, // Static for now as in the explore data
        } : null}
        isOpen={!!selectedTemplate}
        onClose={closeModal}
      />
    </section>
  );
}

function DesignSystemSection() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const systems = [
    { title: "Fluid Typography", desc: "Mathematical type scaling", details: ["Clamp-based responsive sizing", "Perfect modular scales", "Type-safe definitions"] },
    { title: "Palette Engine", desc: "Dynamic HSL color system", details: ["Semantic token mapping", "Automated dark-mode parity", "Contrast-aware generators"] },
    { title: "Atomic Tokens", desc: "Single source of truth", details: ["Zero-config variable injection", "Global state synchronization", "Design-to-code alignment"] }
  ];

  return (
    <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-both py-12">
      <div className="rounded-[40px] border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#0c0c0c] p-8 md:p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.03] dark:opacity-10" />

        <div className="relative z-10 flex flex-col lg:flex-row-reverse gap-16">
          {/* Right side (visually Left due to row-reverse): Selection */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/40 mb-6 w-max">
              Design System
            </div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6">Atomic Consistency</h3>
            <p className="text-lg text-black/50 dark:text-white/50 mb-10 max-w-lg font-light leading-relaxed">
              Lumina operates on a unified design token system. Watch as your entire digital identity adapts flawlessly across every platform and viewport.
            </p>

            <div className="flex flex-col gap-4">
              {systems.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`group w-full text-left p-6 rounded-2xl border transition-all flex items-center justify-between ${activeIndex === i
                    ? "bg-black/5 dark:bg-white/5 border-black/20 dark:border-white/20 shadow-sm"
                    : "bg-transparent border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className={`text-lg font-bold ${activeIndex === i ? "text-black dark:text-white" : "text-black/60 dark:text-white/40"}`}>{s.title}</h4>
                      <p className="text-sm text-black/40 dark:text-white/30">{s.desc}</p>
                    </div>
                  </div>
                  <div className={`h-8 w-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center transition-all ${activeIndex === i ? "bg-black dark:bg-white text-white dark:text-black shadow-lg" : "text-black/30 dark:text-white/30 group-hover:scale-110"}`}>
                    <ArrowRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Left side (visually Right): Detailed Focus Card */}
          <div className="flex-1">
            <div className="rounded-[32px] border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#121212] p-8 md:p-12 relative h-full flex flex-col shadow-inner">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h4 className="text-3xl font-bold text-black dark:text-white mb-2">{systems[activeIndex].title}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-black dark:text-white tracking-tighter">System</span>
                    <span className="text-sm text-black/40 dark:text-white/40 font-bold uppercase tracking-widest">Architecture</span>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 mb-8 flex-1 shadow-sm">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30 mb-6">Capabilities:</h5>
                <ul className="space-y-4">
                  {systems[activeIndex].details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-black/70 dark:text-white/70 font-medium">
                      <div className="h-1.5 w-1.5 rounded-full bg-black/40 dark:bg-white/40" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-black/40 dark:text-white/30 font-medium">
                <div className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-[9px] font-bold italic">i</div>
                <span>Token-first approach. Engineered for Lumina Design Language.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Main Page Component ---

export default function ExplorePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--page-bg)] bg-grid text-[var(--foreground)] selection:bg-accent-glow/30 pb-0 overflow-hidden">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-[100px] px-6 md:px-12 pt-[100px] mb-20 relative z-10">

        {/* Explore Hero */}
        <section className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-black/70 dark:text-white/70 backdrop-blur-md">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Discover Lumina
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black dark:text-white leading-[1.1]">
            How It <span className="text-black dark:bg-gradient-to-r dark:from-indigo-300 dark:via-white/90 dark:to-white/70 dark:bg-clip-text dark:text-transparent">Works</span>
          </h1>
          <p className="text-lg md:text-xl text-black/60 dark:text-white/60 max-w-2xl font-light">
            Lumina is the world's most advanced aesthetic website builder.
            We combine glassmorphism, precise animations, and intelligent
            design systems to help you create websites that breathe.
          </p>
        </section>

        {/* The Workflow */}
        <WorkflowSection />

        {/* Core Capabilities */}
        <CoreCapabilitiesCarousel />

        {/* Under the Hood */}
        <UnderTheHoodSection />

        {/* Cinematic Transition */}
        <section className="py-32 flex flex-col items-center text-center relative overflow-hidden">
          <div className="max-w-3xl z-10">
            <motion.h2
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl font-bold tracking-tighter text-black dark:text-white mb-6 leading-tight"
            >
              From Logic to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-gray-200 to-gray-400">Life.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-xl text-black/50 dark:text-white/40 font-light leading-relaxed"
            >
              Underneath every beautiful transition lies a robust foundation of modern engineering.
              Lumina translates complex state changes into fluid visual poetry, bridging the gap
              between raw performance and high-fidelity design.
            </motion.p>
          </div>

          {/* Decorative animated elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.1, 0.05],
                rotate: [0, 90, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 rounded-full blur-[120px]"
            />
          </div>
        </section>

        {/* Interaction & Motion */}
        <InteractionMotionSection />

        {/* Discovery & Gallery */}
        <LuminaDiscoverySection />

        {/* Global Design System */}
        <DesignSystemSection />

        {/* Cinematic Final CTA Transition */}
        <section className="relative py-48 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto px-6 relative z-10 text-center"
          >
            <div className="flex flex-col items-center gap-10">
              {/* Massive Central Focal Point */}
              <div className="relative mb-8">
                <div className="absolute inset-0 blur-[100px] bg-black/5 dark:bg-white/5 rounded-full scale-150" />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10"
                >
                  <LuminaLogo size={180} />
                </motion.div>
              </div>

              <div className="space-y-6 max-w-3xl">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold tracking-tighter text-black dark:text-white leading-[0.95]"
                >
                  Ready to build <br />
                  <span className="text-black dark:text-white/20">the next generation?</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-black/50 dark:text-white/50 font-light max-w-xl mx-auto leading-relaxed"
                >
                  Join a community of designers and developers building the most aesthetic web experiences. No more boilerplate, just pure creativity.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center gap-6 mt-8"
              >
                <Link 
                  href="/dashboard"
                  className="px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-sm uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl active:scale-95"
                >
                  Start Building
                </Link>
                <Link 
                  href="/pricing"
                  className="px-10 py-5 bg-transparent border border-black/10 dark:border-white/10 text-black dark:text-white rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  View Plans
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Large background decorative logo with Scroll-Driven Animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1.2, opacity: 0.03 }}
              transition={{ 
                duration: 2.5, 
                ease: "easeOut",
                opacity: { duration: 2 }
              }}
              viewport={{ margin: "-100px" }}
            >
              <LuminaLogo size={1200} />
            </motion.div>
          </div>
          
          {/* Subtle bottom fade transition to footer */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[var(--page-bg)] to-transparent pointer-events-none z-20" />
          
          <div className="absolute inset-0 bg-grid opacity-[0.03] dark:opacity-[0.05] -z-20" />
        </section>

      </main>

      <Footer />
    </div>
  );
}

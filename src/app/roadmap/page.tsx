"use client";

import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { CheckCircle2, Circle, Clock, Rocket, Zap } from "lucide-react";

const roadmapItems = [
  {
    status: "completed",
    title: "Lumina Core Engine V1",
    description: "Successfully launched the initial release of our high-performance visual builder core. Features include drag-and-drop support, theme switching, and real-time preview.",
    date: "Q4 2026",
    details: ["Canvas rendering engine", "Basic layout components", "Global styling tokens", "Next.js 14 Integration"]
  },
  {
    status: "in-progress",
    title: "AI Component Generator",
    description: "Harness the power of AI to build your entire UI. Just describe what you want, and Lumina will generate production-ready code with Tailwind styling.",
    date: "Q1 2027",
    details: ["Text-to-UI component generation", "AI-driven design suggestions", "Natural language styling adjustments"]
  },
  {
    status: "upcoming",
    title: "Advanced Animation Studio",
    description: "Create complex Framer Motion animations through a simple visual timeline interface. No more manually calculating spring values.",
    date: "Q2 2027",
    details: ["Timeline-based animation editor", "Scroll-linked trigger library", "Custom ease-function presets"]
  },
  {
    status: "upcoming",
    title: "Team Collaboration & CMS",
    description: "Launch of Lumina Cloud for Teams. Real-time multiplayer editing, version control, and a built-in headless CMS for dynamic content.",
    date: "Q3 2027",
    details: ["Real-time collaborative editing", "Built-in Lumina CMS", "Enterprise-grade versioning", "Asset Library management"]
  },
  {
    status: "upcoming",
    title: "The Marketplace",
    description: "A community-driven marketplace for templates, custom components, and design assets built by Lumina creators.",
    date: "Q4 2027",
    details: ["Template selling/sharing", "Component community library", "One-click asset importing"]
  },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-page-bg text-foreground transition-colors duration-300">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Lumina Roadmap</h1>
          <p className="text-xl text-black/60 dark:text-white/60 leading-relaxed">
            We're building the future of visual web development. See our past milestones and our exciting plans for the year ahead.
          </p>
        </div>

        <div className="space-y-16">
          {roadmapItems.map((item, index) => (
            <div key={index} className="flex gap-8 md:gap-12 relative group">
              {index !== roadmapItems.length - 1 && (
                <div className="absolute left-6 md:left-7 top-16 bottom-0 w-px bg-black/10 dark:bg-white/10 group-hover:bg-indigo-500/30 transition-colors duration-500" />
              )}
              
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-center relative z-10 group-hover:scale-110 group-hover:border-indigo-500/50 transition-all duration-300">
                {item.status === "completed" ? (
                  <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-green-500" />
                ) : item.status === "in-progress" ? (
                  <Clock className="w-6 h-6 md:w-7 md:h-7 text-indigo-500" />
                ) : (
                  <Rocket className="w-6 h-6 md:w-7 md:h-7 text-black/30 dark:text-white/30" />
                )}
              </div>

              <div className="pb-16 flex-grow">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
                      {item.date}
                    </span>
                    {item.status === "in-progress" && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed mb-6 max-w-3xl">
                  {item.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.details.map((detail, dIndex) => (
                    <div key={dIndex} className="flex items-center gap-3 text-sm text-black/50 dark:text-white/50">
                      <div className="w-1.5 h-1.5 bg-black/20 dark:bg-white/20 rounded-full" />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Section */}
        <div className="mt-32 p-12 rounded-[2.5rem] bg-indigo-500 text-white flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative group">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Help us shape the future.</h2>
            <p className="text-indigo-100 text-lg leading-relaxed">
              Our roadmap is heavily influenced by our community. Join our Discord to vote on upcoming features and discuss the future of Lumina.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <a href="https://discord.gg/PaZVdZav" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white text-indigo-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl">
              <Zap className="w-5 h-5 fill-indigo-500" />
              Join Discord
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

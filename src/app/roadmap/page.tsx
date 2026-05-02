"use client";

import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const roadmapItems = [
  {
    status: "completed",
    title: "V1 Launch",
    description: "Initial release of the Lumina visual builder core engine.",
    date: "Q4 2025",
  },
  {
    status: "in-progress",
    title: "AI Component Generation",
    description: "Generate entire UI components from simple text prompts using our custom LLM.",
    date: "Q1 2026",
  },
  {
    status: "upcoming",
    title: "Collaboration Features",
    description: "Real-time multiplayer editing for teams to build together.",
    date: "Q2 2026",
  },
  {
    status: "upcoming",
    title: "Custom Plugin API",
    description: "Extend Lumina with your own custom React components and logic.",
    date: "Q3 2026",
  },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-page-bg text-foreground transition-colors duration-300">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Lumina Roadmap</h1>
        <p className="text-lg text-black/60 dark:text-white/60 mb-12 max-w-2xl">
          See where we've been and where we're going. We're building the future of visual web development.
        </p>

        <div className="space-y-12">
          {roadmapItems.map((item, index) => (
            <div key={index} className="flex gap-6 relative">
              {index !== roadmapItems.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-px bg-black/10 dark:bg-white/10" />
              )}
              <div className="flex-shrink-0 w-12 h-12 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-center relative z-10">
                {item.status === "completed" ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : item.status === "in-progress" ? (
                  <Clock className="w-6 h-6 text-indigo-500" />
                ) : (
                  <Circle className="w-6 h-6 text-black/30 dark:text-white/30" />
                )}
              </div>
              <div className="pb-8">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <span className="px-2 py-1 bg-black/5 dark:bg-white/5 rounded text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
                    {item.date}
                  </span>
                </div>
                <p className="text-black/60 dark:text-white/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

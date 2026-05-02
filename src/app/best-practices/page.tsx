"use client";

import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { Layout, Palette, Zap, Shield } from "lucide-react";

export default function BestPracticesPage() {
  const sections = [
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Clean Layouts",
      description: "Keep your designs breathable with ample whitespace and consistent padding.",
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Color Harmony",
      description: "Use balanced color palettes that maintain readability in both light and dark modes.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Performance First",
      description: "Optimize assets and use system fonts to ensure your landing pages load instantly.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Accessibility",
      description: "Ensure high contrast and proper ARIA labels for an inclusive user experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-page-bg text-foreground transition-colors duration-300">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Lumina Best Practices</h1>
        <p className="text-lg text-black/60 dark:text-white/60 mb-16 max-w-2xl leading-relaxed">
          Master the art of building top-tier landing pages with Lumina. Follow these guidelines to ensure your projects are professional, performant, and beautiful.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {sections.map((section, index) => (
            <div key={index} className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-indigo-500">
                {section.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                <p className="text-black/60 dark:text-white/60 leading-relaxed">
                  {section.description}
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

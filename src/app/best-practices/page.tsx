"use client";

import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { Layout, Palette, Zap, Shield, Smartphone, MousePointer2, Search, Image as ImageIcon } from "lucide-react";

export default function BestPracticesPage() {
  const sections = [
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Clean Layouts",
      description: "Keep your designs breathable with ample whitespace and consistent padding. Use a grid-based approach to ensure elements align perfectly across different sections.",
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Color Harmony",
      description: "Use balanced color palettes that maintain readability in both light and dark modes. Avoid over-saturated colors for large backgrounds and stick to a primary accent color.",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Responsiveness",
      description: "Always design with a mobile-first mindset. Ensure buttons are touch-friendly (at least 44x44px) and text remains legible on smaller screens without horizontal scrolling.",
    },
    {
      icon: <MousePointer2 className="w-6 h-6" />,
      title: "CTA Optimization",
      description: "Your Call to Action buttons should stand out. Use high-contrast colors and clear, action-oriented text like 'Get Started' or 'Join Now' to drive conversions.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Performance First",
      description: "Optimize assets and use system fonts to ensure your landing pages load instantly. Minimize the use of heavy scripts and large uncompressed images.",
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "SEO & Meta Tags",
      description: "Structure your content with proper H1-H6 tags. Add descriptive alt text to images and ensure your meta titles and descriptions are optimized for search engines.",
    },
    {
      icon: <ImageIcon className="w-6 h-6" />,
      title: "Image Optimization",
      description: "Use modern formats like WebP or Avif. Serve responsive images based on the user's device resolution to save bandwidth and improve load times.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Accessibility (a11y)",
      description: "Ensure high contrast for text and provide proper ARIA labels. Your site should be fully navigable via keyboard to ensure an inclusive experience for all users.",
    },
  ];

  return (
    <div className="min-h-screen bg-page-bg text-foreground transition-colors duration-300">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Lumina Best Practices</h1>
          <p className="text-xl text-black/60 dark:text-white/60 leading-relaxed">
            Master the art of building top-tier landing pages with Lumina. Follow these industry-standard guidelines to ensure your projects are professional, performant, and beautiful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {sections.map((section, index) => (
            <div key={index} className="flex gap-6 group">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                {section.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">{section.title}</h3>
                <p className="text-black/60 dark:text-white/60 leading-relaxed">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-32 p-12 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
          <h2 className="text-3xl font-bold mb-6">Pro Tip: Testing your Design</h2>
          <p className="text-lg text-black/60 dark:text-white/60 mb-8 leading-relaxed">
            Before publishing, always view your site in "Incognito" mode and on at least three different devices. This helps you spot caching issues and layout shifts that might not be visible in your primary development environment.
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="px-4 py-2 rounded-full bg-white dark:bg-black border border-black/5 dark:border-white/5 text-sm font-medium">Check Lighthouse Score</span>
            <span className="px-4 py-2 rounded-full bg-white dark:bg-black border border-black/5 dark:border-white/5 text-sm font-medium">Verify Contrast Ratios</span>
            <span className="px-4 py-2 rounded-full bg-white dark:bg-black border border-black/5 dark:border-white/5 text-sm font-medium">Test Load Speeds</span>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

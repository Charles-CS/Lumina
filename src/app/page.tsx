"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { HeroSection } from "@/components/ui/HeroSection";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useState } from "react";
import { TemplateModal } from "@/components/ui/TemplateModal";

// DUMMY DATA SETUP
const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80",
];

const FEATURED_DATA = [
  { id: "f1", title: "Lumina Marketing", image: "/images/templates/featured_v1.png", badge: "PRO" as const, author: { name: "Sarah M.", avatar: AVATARS[2] }, views: 760, imagePosition: "center 17.5%", description: "Our flagship marketing landing page. Engineered with physics-based motion and premium layout systems to drive conversions through aesthetic excellence." },
  { id: "f2", title: "Horizon Dashboard", image: "/images/templates/featured_v2.png", badge: "FREE" as const, author: { name: "Vannarot R.", avatar: AVATARS[0] }, views: 642, description: "A high-performance analytics dashboard designed for complex data visualization. Features include real-time metrics, interactive charts, and a glassmorphic sidebar layout." },
  { id: "f3", title: "Noir Fresh Aesthetic", image: "/images/templates/noir_fresh_v3.png", badge: "PRO" as const, author: { name: "Alex K.", avatar: AVATARS[1] }, views: 512, imageScale: 1.02, imagePosition: "center 5%", description: "A bold, dark-themed creative experience. Engineered with physics-based motion and premium layout systems to drive conversions through aesthetic excellence." },
];

const FREE_TEMPLATES = [
  { id: "free1", title: "Product Designer", image: "/images/templates/minimal_mockup_1_new.png", badge: "FREE" as const, author: { name: "Alex K.", avatar: AVATARS[1] }, views: 430, description: "A minimalist creative portfolio focusing on high-impact typography and smooth scroll transitions. Ideal for photographers, designers, and digital artists." },
  { id: "free2", title: "Arkiytek Platform", image: "/images/templates/minimal_mockup_2_arkiytek.png", badge: "FREE" as const, author: { name: "Sarah M.", avatar: AVATARS[2] }, views: 395, imagePosition: "center", description: "A professional platform for architectural visualization and project management. Built for performance and clarity." },
  { id: "free3", title: "Agency Contact", image: "/images/templates/minimal_mockup_3_new.png", badge: "FREE" as const, author: { name: "Vannarot R.", avatar: AVATARS[0] }, views: 312, imagePosition: "center 47%", description: "Convert leads effectively with this high-converting contact page. Includes interactive forms and sleek animations." },
];

const PRO_TEMPLATES = [
  { id: "pro1", title: "SaaS Landing", image: "/images/templates/pro_1.png", badge: "PRO" as const, author: { name: "Vannarot R.", avatar: AVATARS[0] }, views: 890, description: "A complete SaaS landing page with feature grids, pricing tables, and testimonials. Optimized for conversion and SEO." },
  { id: "pro2", title: "Nova UI Kit", image: "/images/templates/pro_2.png", badge: "PRO" as const, author: { name: "Alex K.", avatar: AVATARS[1] }, views: 745, description: "A comprehensive UI component library showcase. Designed with atomic design principles to ensure consistency across every visual element." },
  { id: "pro3", title: "Creative Studio", image: "/images/templates/pro_3.png", badge: "PRO" as const, author: { name: "Sarah M.", avatar: AVATARS[2] }, views: 654, description: "Tell your agency's story with this visually stunning template. Features smooth transitions and high-impact imagery." },
];

export default function LandingPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const allTemplates = [...FEATURED_DATA, ...FREE_TEMPLATES, ...PRO_TEMPLATES];

  const handleCardClick = (id: string) => {
    const template = allTemplates.find(t => t.id === id);
    if (template) setSelectedTemplate(template);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--page-bg)] bg-grid text-[var(--foreground)] selection:bg-accent-glow/30 pb-0">
      <Navbar />
      <HeroSection />

      <main className="relative z-20 mx-auto flex w-full max-w-7xl flex-col gap-[24px] px-10 pt-0 -mt-32">

        {/* Recently Featured Section */}
        <section className="flex flex-col gap-4 rounded-none border border-black/[0.05] dark:border-white/[0.04] bg-[var(--section-bg)] px-5 pb-5 pt-3 shadow-sm dark:shadow-2xl dark:shadow-black/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Recently Featured</h2>
            <Link href="/templates" className="flex items-center gap-1.5 rounded-lg border border-black/15 dark:border-white/15 px-2.5 py-1 text-xs font-medium text-black/70 dark:text-white/80 transition-all hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/30 dark:hover:border-white/30 hover:text-black dark:hover:text-white">
              <span>Browse Featured</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {FEATURED_DATA.map((project) => (
              <ProjectCard key={project.id} {...project} onClick={handleCardClick} />
            ))}
          </div>
        </section>

        {/* Free Templates */}
        <section className="flex flex-col gap-4 rounded-none border border-black/[0.05] dark:border-white/[0.04] bg-[var(--section-bg)] px-5 pb-5 pt-3 shadow-sm dark:shadow-2xl dark:shadow-black/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Free Templates</h2>
            <Link href="/templates" className="flex items-center gap-1.5 rounded-lg border border-black/15 dark:border-white/15 px-2.5 py-1 text-xs font-medium text-black/70 dark:text-white/80 transition-all hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/30 dark:hover:border-white/30 hover:text-black dark:hover:text-white">
              <span>Browse Free Template</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {FREE_TEMPLATES.map((project) => (
              <ProjectCard key={project.id} {...project} onClick={handleCardClick} />
            ))}
          </div>
        </section>

        {/* Pro Templates */}
        <section className="flex flex-col gap-4 rounded-none border border-black/[0.05] dark:border-white/[0.04] bg-[var(--section-bg)] px-5 pb-5 pt-3 shadow-sm dark:shadow-2xl dark:shadow-black/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Pro Templates</h2>
            <Link href="/templates" className="flex items-center gap-1.5 rounded-lg border border-black/15 dark:border-white/15 px-2.5 py-1 text-xs font-medium text-black/70 dark:text-white/80 transition-all hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/30 dark:hover:border-white/30 hover:text-black dark:hover:text-white">
              <span>Browse Pro Template</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PRO_TEMPLATES.map((project) => (
              <ProjectCard key={project.id} {...project} onClick={handleCardClick} />
            ))}
          </div>
        </section>
      </main>
      <div className="pb-32 bg-[var(--page-bg)] dark:bg-[#050505]"></div>
      <Footer />
      
      <TemplateModal 
        template={selectedTemplate} 
        isOpen={!!selectedTemplate} 
        onClose={() => setSelectedTemplate(null)} 
      />
    </div>
  );
}

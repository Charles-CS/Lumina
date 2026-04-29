import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { HeroSection } from "@/components/ui/HeroSection";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

// DUMMY DATA SETUP
const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80",
];

const FEATURED_DATA = [
  { id: "f1", title: "Quantum Analytics", image: "/images/templates/featured_v1.png", badge: "PRO" as const, author: { name: "Sarah M.", avatar: AVATARS[2] }, views: 760, imagePosition: "center 17.5%" },
  { id: "f2", title: "Vapor Portfolio", image: "/images/templates/featured_v2.png", badge: "FREE" as const, author: { name: "Vannarot R.", avatar: AVATARS[0] }, views: 642 },
  { id: "f3", title: "Noir Commerce", image: "/images/templates/noir_fresh_v3.png", badge: "PRO" as const, author: { name: "Alex K.", avatar: AVATARS[1] }, views: 512, imageScale: 1.02, imagePosition: "center 5%" },
];

const FREE_TEMPLATES = [
  { id: "free1", title: "Product Designer Portfolio", image: "/images/templates/minimal_mockup_1_new.png", badge: "FREE" as const, author: { name: "Alex K.", avatar: AVATARS[1] }, views: 430 },
  { id: "free2", title: "Arkiytek Platform", image: "/images/templates/minimal_mockup_2_arkiytek.png", badge: "FREE" as const, author: { name: "Sarah M.", avatar: AVATARS[2] }, views: 395, imagePosition: "center" },
  { id: "free3", title: "Agency Contact Page", image: "/images/templates/minimal_mockup_3_new.png", badge: "FREE" as const, author: { name: "Vannarot R.", avatar: AVATARS[0] }, views: 312, imagePosition: "center 47%" },
];

const PRO_TEMPLATES = [
  { id: "pro1", title: "SaaS Landing Page", image: "/images/templates/pro_1.png", badge: "PRO" as const, author: { name: "Vannarot R.", avatar: AVATARS[0] }, views: 890 },
  { id: "pro2", title: "E-commerce Dashboard", image: "/images/templates/pro_2.png", badge: "PRO" as const, author: { name: "Alex K.", avatar: AVATARS[1] }, views: 745 },
  { id: "pro3", title: "Creative Agency", image: "/images/templates/pro_3.png", badge: "PRO" as const, author: { name: "Sarah M.", avatar: AVATARS[2] }, views: 654 },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--page-bg)] bg-grid text-[var(--foreground)] selection:bg-accent-glow/30 pb-0">
      <Navbar />
      <HeroSection />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-[24px] px-10 pt-0 -mt-32">

        {/* Recently Featured Section */}
        <section className="flex flex-col gap-4 rounded-none border border-black/[0.05] dark:border-white/[0.04] bg-[var(--section-bg)] px-5 pb-5 pt-3 shadow-sm dark:shadow-2xl dark:shadow-black/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Recently Featured</h2>
            <Link href="/dashboard" className="flex items-center gap-1.5 rounded-lg border border-black/15 dark:border-white/15 px-2.5 py-1 text-xs font-medium text-black/70 dark:text-white/80 transition-all hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/30 dark:hover:border-white/30 hover:text-black dark:hover:text-white">
              <span>Browse Featured</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {FEATURED_DATA.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </section>

        {/* Free Templates */}
        <section className="flex flex-col gap-4 rounded-none border border-black/[0.05] dark:border-white/[0.04] bg-[var(--section-bg)] px-5 pb-5 pt-3 shadow-sm dark:shadow-2xl dark:shadow-black/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Free Templates</h2>
            <Link href="/dashboard" className="flex items-center gap-1.5 rounded-lg border border-black/15 dark:border-white/15 px-2.5 py-1 text-xs font-medium text-black/70 dark:text-white/80 transition-all hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/30 dark:hover:border-white/30 hover:text-black dark:hover:text-white">
              <span>Browse Free Template</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {FREE_TEMPLATES.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </section>

        {/* Pro Templates */}
        <section className="flex flex-col gap-4 rounded-none border border-black/[0.05] dark:border-white/[0.04] bg-[var(--section-bg)] px-5 pb-5 pt-3 shadow-sm dark:shadow-2xl dark:shadow-black/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Pro Templates</h2>
            <Link href="/dashboard" className="flex items-center gap-1.5 rounded-lg border border-black/15 dark:border-white/15 px-2.5 py-1 text-xs font-medium text-black/70 dark:text-white/80 transition-all hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/30 dark:hover:border-white/30 hover:text-black dark:hover:text-white">
              <span>Browse Pro Template</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PRO_TEMPLATES.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </section>
      </main>
      <div className="pb-32 bg-[var(--page-bg)] dark:bg-[#050505]"></div>
      <Footer />
    </div>
  );
}

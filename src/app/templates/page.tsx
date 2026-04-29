"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { Search, ListFilter, Calendar, LayoutGrid, ChevronDown, Sparkles } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ReactIndicator } from "@/components/ui/ReactIndicator";

const CATEGORIES = [
  "All",
  "Web Apps",
  "Mobile Apps",
  "Animated UI",
  "Login Screens",
  "Sidebars",
  "Onboarding",
  "Grid Layouts",
  "Payment Pages",
  "3D UI",
];

const DROPDOWN_OPTIONS = [
  "All types",
  "Free",
  "Pro",
  "Featured Creators",
  "Upcoming"
];

const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80",
];

const TEMPLATE_IMAGES = [
  { path: "/images/templates/TemplatePage1.png", title: "Modern SaaS Dashboard", badge: "PRO" as const },
  { path: "/images/templates/TemplatePage2.png", title: "Creative Agency Portfolio", badge: "FREE" as const },
  { path: "/images/templates/TemplatePage3.png", title: "Minimalist E-commerce", badge: "PRO" as const },
  { path: "/images/templates/TemplatePage4.png", title: "AI Analytics Platform", badge: "PRO" as const },
  { path: "/images/templates/TemplatePage5.png", title: "Digital Product Landing", badge: "FREE" as const },
  { path: "/images/templates/TemplatePage6.png", title: "Dark Mode Mobile App", badge: "PRO" as const },
  { path: "/images/templates/TemplatePage7.png", title: "Web3 NFT Marketplace", badge: "PRO" as const },
  { path: "/images/templates/TemplatePage8.png", title: "Professional Service Site", badge: "FREE" as const },
  { path: "/images/templates/TemplatePage9.png", title: "SaaS Marketing Page", badge: "PRO" as const },
  { path: "/images/templates/TemplatePage10.png", title: "Enterprise Solution", badge: "PRO" as const },
  { path: "/images/templates/featured_v1.png", title: "Premium Featured Design", badge: "PRO" as const },
  { path: "/images/templates/featured_v2.png", title: "Curated Showcase", badge: "PRO" as const },
  { path: "/images/templates/free_1.png", title: "Basic Starter Template", badge: "FREE" as const },
  { path: "/images/templates/minimal_mockup_1_new.png", title: "Clean Minimal Layout", badge: "FREE" as const },
  { path: "/images/templates/minimal_mockup_2_arkiytek.png", title: "Architectural Portfolio", badge: "PRO" as const },
  { path: "/images/templates/minimal_mockup_3_new.png", title: "Artistic Studio View", badge: "FREE" as const },
  { path: "/images/templates/noir_fresh_v3.png", title: "Noir Fresh Aesthetic", badge: "PRO" as const },
  { path: "/images/templates/pro_1.png", title: "Pro Dashboard UI", badge: "PRO" as const },
  { path: "/images/templates/pro_2.png", title: "Advanced Analytics UI", badge: "PRO" as const },
  { path: "/images/templates/pro_3.png", title: "Ultimate Business Suite", badge: "PRO" as const },
];

const AUTHORS = [
  { name: "Aksonvady Phomn", avatar: AVATARS[0] },
  { name: "Meng To", avatar: AVATARS[1] },
  { name: "Vannarot Roeung", avatar: AVATARS[2] },
  { name: "Sarah Connor", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64&q=80" },
  { name: "Jack Dorsey", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=64&h=64&q=80" },
];

const TEMPLATES_LIST = TEMPLATE_IMAGES.map((img, i) => ({
  id: `template-${i}`,
  title: img.title,
  image: img.path,
  badge: img.badge,
  author: AUTHORS[i % AUTHORS.length],
  views: 124 + (i * 47) % 350,
  imagePosition: "center" as const,
}));

import { AnimatedGrid } from "@/components/ui/AnimatedGrid";

export default function TemplatesPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSort, setActiveSort] = useState<'Popular' | 'Recent'>('Popular');
  const [activeDropdown, setActiveDropdown] = useState(DROPDOWN_OPTIONS[0]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Modal close handler
  const closeModal = () => setSelectedTemplate(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedTemplate) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedTemplate]);

  // Close modal on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Category mapping for accurate filtering
  const categoryMap: Record<string, (t: typeof TEMPLATES_LIST[number]) => boolean> = {
    "Web Apps": t => /web|saas|service|marketing|solution|nft|marketplace/i.test(t.title),
    "Mobile Apps": t => /mobile|app/i.test(t.title),
    "Animated UI": t => /animated|artistic|noir|fresh/i.test(t.title),
    "Login Screens": t => /login|starter/i.test(t.title),
    "Sidebars": t => /dashboard|sidebar|suite/i.test(t.title),
    "Onboarding": t => /onboarding|starter|studio|analytics/i.test(t.title),
    "Grid Layouts": t => /grid|layout|portfolio|minimal/i.test(t.title),
    "Payment Pages": t => /payment|e-commerce|digital|product/i.test(t.title),
    "3D UI": t => /3d|ai|analytics|studio/i.test(t.title),
    "Paid Templates": t => t.badge === "PRO",
  };
  let filteredTemplates = TEMPLATES_LIST;
  if (search.trim()) {
    // If searching, ignore all filters and show all matches
    filteredTemplates = TEMPLATES_LIST.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.author.name.toLowerCase().includes(search.toLowerCase())
    );
  } else if (activeCategory === "All") {
    filteredTemplates = TEMPLATES_LIST;
  } else if (activeCategory in categoryMap) {
    filteredTemplates = TEMPLATES_LIST.filter(categoryMap[activeCategory]);
  }
  // Types dropdown
  if (activeDropdown === "Free") {
    filteredTemplates = filteredTemplates.filter(t => t.badge === "FREE");
  } else if (activeDropdown === "Pro") {
    filteredTemplates = filteredTemplates.filter(t => t.badge === "PRO");
  }
  // Sorting
  if (activeSort === "Popular") {
    filteredTemplates = [...filteredTemplates].sort((a, b) => b.views - a.views);
  } else if (activeSort === "Recent") {
    filteredTemplates = [...filteredTemplates].slice(0, 7);
  }
  // Sorting
  if (activeSort === "Popular") {
    filteredTemplates = [...filteredTemplates].sort((a, b) => b.views - a.views);
  } else if (activeSort === "Recent") {
    filteredTemplates = [...filteredTemplates].slice(0, 7);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--page-bg)] bg-grid text-[var(--foreground)] selection:bg-accent-glow/30 pb-0">
      <Navbar />

      <main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6 px-4 sm:px-6 md:px-12 pt-[30px] md:pt-[45px] pb-32">
        {/* Main Content Wrapper */}
        <div className="flex flex-col gap-6 rounded-3xl border border-black/5 dark:border-white/[0.04] bg-white/50 dark:bg-[#0a0a0a]/80 p-5 sm:p-6 shadow-sm backdrop-blur-md">
          {/* Top Navigation Area */}
          <div className="flex flex-col gap-4">
            {/* Search Bar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/40 dark:text-white/30" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search 4003 templates..."
                  className="w-full h-9 pl-9 pr-10 rounded-xl bg-transparent border border-black/10 dark:border-white/[0.08] text-xs outline-none focus:border-accent-glow/50 focus:ring-1 focus:ring-accent-glow/30 transition-all font-medium text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/30"
                />
                {search && (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 h-6 flex items-center justify-center rounded bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-xs font-medium transition-colors"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-1.5 h-9 px-3.5 rounded-xl border text-xs font-medium transition-all whitespace-nowrap ${activeSort === 'Popular' ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white border-black/10 dark:border-white/20' : 'bg-transparent border-black/10 dark:border-white/[0.08] text-black/80 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
                  onClick={() => setActiveSort('Popular')}
                >
                  <ListFilter className="w-3.5 h-3.5 opacity-70" />
                  <span>Popular</span>
                </button>
                <button
                  className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-1.5 h-9 px-3.5 rounded-xl border text-xs font-medium transition-all whitespace-nowrap ${activeSort === 'Recent' ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white border-black/10 dark:border-white/20' : 'bg-transparent border-black/10 dark:border-white/[0.08] text-black/80 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
                  onClick={() => setActiveSort('Recent')}
                >
                  <Calendar className="w-3.5 h-3.5 opacity-70" />
                  <span>Recent</span>
                </button>
              </div>
            </div>

            {/* Categories & Filters Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Tags */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide w-full md:w-auto">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      if (activeSort === 'Recent') {
                        setActiveSort('Popular');
                      }
                    }}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-medium transition-all ${activeCategory === cat
                        ? "bg-black/5 dark:bg-white/10 text-black dark:text-white border border-transparent"
                        : "bg-transparent border border-black/10 dark:border-white/[0.06] text-black/60 dark:text-white/50 hover:text-black/90 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                  >
                    {cat}
                  </button>
                ))}

                {/* Special Paid Category */}
                <button
                  onClick={() => {
                    setActiveCategory("Paid Templates");
                    if (activeSort === 'Recent') {
                      setActiveSort('Popular');
                    }
                  }}
                  className={`whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-medium transition-all ${activeCategory === "Paid Templates"
                      ? "border border-[#3b82f6]/60 text-[#3b82f6] bg-[#3b82f6]/10"
                      : "border border-[#3b82f6]/40 text-[#3b82f6]/80 bg-transparent hover:bg-[#3b82f6]/10 hover:text-[#3b82f6]"
                    }`}
                >
                  Paid Templates
                </button>
              </div>

              {/* All Types Dropdown */}
              <div className="relative shrink-0 flex items-center gap-2 z-50 md:ml-auto self-end md:self-auto">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 h-7 px-3 rounded-full border border-black/10 dark:border-white/[0.08] bg-transparent text-[11px] font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all text-black/80 dark:text-white/70"
                >
                  <LayoutGrid className="w-3 h-3 opacity-70" />
                  <span>{activeDropdown}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>

                {dropdownOpen && (
                  <div className="absolute z-50 top-full right-0 mt-2 w-48 rounded-xl border border-black/10 dark:border-white/[0.08] bg-white dark:bg-[#1c1c1c] backdrop-blur-xl shadow-xl dark:shadow-2xl dark:shadow-black/60 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    {DROPDOWN_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setActiveDropdown(option);
                          setDropdownOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-[11px] font-medium text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Spacer Line */}
          <div className="w-full h-px bg-black/5 dark:bg-white/[0.03]" />

          {/* Templates Grid with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + activeSort + activeDropdown + search}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5"
            >
              {filteredTemplates.length === 0 ? (
                <div className="col-span-full text-center text-sm text-black/60 dark:text-white/60 py-10">No templates found.</div>
              ) : (
                filteredTemplates.map((template) => (
                  <ProjectCard
                    key={template.id}
                    {...template}
                    compact
                    singleLineAuthor
                    onClick={() => setSelectedTemplate(template)}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
      {/* Modal for template info and centered image */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center px-4"
              style={{ zIndex: 99999, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden"
                style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
                  style={{ zIndex: 10, background: "rgba(0,0,0,0.5)" }}
                >
                  <X size={15} />
                </button>
                {/* Preview image */}
                <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: '16/9', minHeight: 320, maxHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    src={selectedTemplate.image}
                    alt={selectedTemplate.title}
                    fill
                    className="object-contain"
                    style={{ objectFit: 'contain' }}
                    quality={100}
                    sizes="90vw"
                  />
                </div>
                {/* Info row */}
                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded px-2 py-0.5 text-[9px] font-bold tracking-wider" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                        {selectedTemplate.badge}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className="relative h-4 w-4 overflow-hidden rounded-full" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
                          <Image src={selectedTemplate.author.avatar} alt={selectedTemplate.author.name} fill sizes="16px" className="object-cover" />
                        </div>
                        <span className="text-[11px] font-medium truncate" style={{ color: "rgba(255,255,255,0.45)" }}>{selectedTemplate.author.name}</span>
                      </div>
                    </div>
                    <h2 className="text-base font-bold leading-snug line-clamp-1 text-white">{selectedTemplate.title}</h2>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {selectedTemplate.views} views
                    </p>
                  </div>
                  {/* Use template button as image with React indicator */}
                  <div className="flex flex-col items-end justify-end flex-1">
                    {selectedTemplate.badge === 'PRO' ? (
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#18181b] border border-white/10 text-white text-xs font-semibold mt-2 cursor-not-allowed select-none"
                        style={{ pointerEvents: 'none' }}
                        tabIndex={-1}
                      >
                        Use Template
                        <span className="ml-2 px-2 py-0.5 rounded bg-[#3b82f6] text-white text-[10px] font-bold">Pro</span>
                      </button>
                    ) : (
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#18181b] border border-white/10 text-white text-xs font-semibold mt-2 cursor-not-allowed select-none"
                        style={{ pointerEvents: 'none' }}
                        tabIndex={-1}
                      >
                        Use Template
                        <span className="ml-2 px-2 py-0.5 rounded bg-gray-500 text-white text-[10px] font-bold">Not Available</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        , document.body
      )}
    </div>
  );
}

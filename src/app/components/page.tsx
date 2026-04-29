"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, ListFilter, Calendar, LayoutGrid, ChevronDown, Sparkles, X, Plus, Check } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const CATEGORIES = [
  "All",
  "Navbar",
  "Card",
  "Button",
  "Menu",
  "Timeline",
  "Gauge",
  "Widget",
  "Background",
  "Badge",
  "Modal",
  "Toast",
  "Avatar",
  "Search",
  "Audio"
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

const TEMPLATES_LIST = [
  { id: "comp-1", title: "Navbar Component", image: "/images/components/NavbarImage.png", badge: "PRO" as const, author: { name: "Vannarot Roeung", avatar: AVATARS[2] }, views: 125, dragType: "Navbar" },
  { id: "comp-2", title: "Pricing Card", image: "/images/components/PricingCardImage.jpg", badge: "PRO" as const, author: { name: "Meng To", avatar: AVATARS[1] }, views: 98, dragType: "PricingCard" },
  { id: "comp-3", title: "Glowing Button", image: "/images/components/GlowingButtonImage.png", badge: "FREE" as const, author: { name: "Aksonvady", avatar: AVATARS[0] }, views: 342, dragType: "GlowingButton" },
  { id: "comp-4", title: "Menu Component", image: "/images/components/MenuComponentImage.png", badge: "PRO" as const, author: { name: "Vannarot Roeung", avatar: AVATARS[2] }, views: 87, dragType: "Menu" },
  { id: "comp-5", title: "Timeline Component", image: "/images/components/TimelineImage.png", badge: "PRO" as const, author: { name: "Meng To", avatar: AVATARS[1] }, views: 56, dragType: "Timeline" },
  { id: "comp-6", title: "UV Dial Gauge", image: "/images/components/UVDialGaugeImage.png", badge: "PRO" as const, author: { name: "Lumina UI", avatar: AVATARS[0] }, views: 112, dragType: "DialGauge" },
  { id: "comp-7", title: "Weather Widget", image: "/images/components/WeatherWidgetImage.png", badge: "PRO" as const, author: { name: "Lumina UI", avatar: AVATARS[1] }, views: 201, dragType: "WeatherWidget" },
  { id: "comp-8", title: "WebGL Blob", image: "/images/components/WebGLBlobImage.png", badge: "PRO" as const, author: { name: "Lumina UI", avatar: AVATARS[2] }, views: 189, dragType: "WebGLBackground" },
  { id: "comp-9", title: "Bokeh Effect", image: "/images/components/BokehEffectImage.png", badge: "FREE" as const, author: { name: "Vannarot", avatar: AVATARS[2] }, views: 334, dragType: "BokehGradient" },
  { id: "comp-10", title: "Catalog Menu", image: "/images/components/CatalogImage.png", badge: "PRO" as const, author: { name: "Meng To", avatar: AVATARS[1] }, views: 145, dragType: "CatalogMenu" },
  { id: "comp-11", title: "Neural Defense Card", image: "/images/components/NeuralDefenseImage.png", badge: "PRO" as const, author: { name: "Lumina UI", avatar: AVATARS[0] }, views: 89, dragType: "NeuralCard" },
  { id: "comp-12", title: "Initialize Badge", image: "/images/components/InitializedCardImage.png", badge: "PRO" as const, author: { name: "Aksonvady", avatar: AVATARS[0] }, views: 211, dragType: "InitializeBadge" },
  { id: "comp-13", title: "Cloud Resource Card", image: "/images/components/CloudResourceCardImage.png", badge: "PRO" as const, author: { name: "Meng To", avatar: AVATARS[1] }, views: 167, dragType: "CloudCard" },
  { id: "comp-14", title: "Legacy Stat Card", image: "/images/components/LegacyStatCardImage.png", badge: "PRO" as const, author: { name: "Vannarot", avatar: AVATARS[2] }, views: 121, dragType: "StatCard" },
  { id: "comp-15", title: "Code Snippet Modal", image: "/images/components/CodeSnippetImage.png", badge: "PRO" as const, author: { name: "Lumina UI", avatar: AVATARS[0] }, views: 256, dragType: "CodeSnippet" },
  { id: "comp-16", title: "Testimonial Card", image: "/images/components/TestimonialCardImage.png", badge: "FREE" as const, author: { name: "Meng To", avatar: AVATARS[1] }, views: 405, dragType: "TestimonialCard" },
  { id: "comp-17", title: "Notification Toast", image: "/images/components/NotificationToastImage.png", badge: "PRO" as const, author: { name: "Aksonvady", avatar: AVATARS[0] }, views: 178, dragType: "NotificationToast" },
  { id: "comp-18", title: "Avatar Group Stack", image: "/images/components/AvatarGroupStackImage.jpg", badge: "FREE" as const, author: { name: "Vannarot", avatar: AVATARS[2] }, views: 290, dragType: "AvatarGroup" },
  { id: "comp-19", title: "Command Search", image: "/images/components/CommandSearch.png", badge: "PRO" as const, author: { name: "Lumina UI", avatar: AVATARS[1] }, views: 301, dragType: "CommandPalette" },
  { id: "comp-20", title: "Audio Player", image: "/images/components/AudioPlayerImage.png", badge: "PRO" as const, author: { name: "Meng To", avatar: AVATARS[1] }, views: 111, dragType: "AudioPlayer" }
];

export default function ComponentsPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDropdownText, setActiveDropdownText] = useState("All types");
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [addedTemplates, setAddedTemplates] = useState<string[]>([]);

  const handleOpenModal = (templateId: string) => {
    const template = TEMPLATES_LIST.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      // Check if already added
      const existing = localStorage.getItem("lumina-added-components");
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          const isAdded = parsed.some((item: any) => item.id === template.id);
          if (isAdded) {
            setAddedTemplates((prev) => [...prev, template.id]);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const handleAddToDashboard = () => {
    if (!selectedTemplate) return;
    
    // Add to Local Storage
    const existing = localStorage.getItem("lumina-added-components");
    let currentSaved = [];
    try {
      currentSaved = existing ? JSON.parse(existing) : [];
    } catch {}
    
    // Only add if not exists
    if (!currentSaved.some((item: any) => item.id === selectedTemplate.id)) {
      const newItem = {
        id: selectedTemplate.id,
        label: selectedTemplate.title,
        type: selectedTemplate.dragType,
        props: {
          src: selectedTemplate.image,
        }
      };
      const updatedSaved = [...currentSaved, newItem];
      localStorage.setItem("lumina-added-components", JSON.stringify(updatedSaved));
      setAddedTemplates((prev) => [...prev, selectedTemplate.id]);
    }
  };

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

  // Filtering logic
  let filteredTemplates = TEMPLATES_LIST;
  if (search.trim()) {
    // If searching, ignore all filters and show all matches
    filteredTemplates = TEMPLATES_LIST.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.author && t.author.name.toLowerCase().includes(search.toLowerCase()))
    );
  } else {
    if (activeCategory && activeCategory !== "All") {
      filteredTemplates = filteredTemplates.filter(t => {
        const cat = activeCategory.toLowerCase();
        return (
          (t.dragType && t.dragType.toLowerCase().includes(cat)) ||
          (t.title && t.title.toLowerCase().includes(cat))
        );
      });
    }
    // Dropdown filter
    if (activeDropdownText === "Free") {
      filteredTemplates = filteredTemplates.filter(t => t.badge === "FREE");
    } else if (activeDropdownText === "Pro") {
      filteredTemplates = filteredTemplates.filter(t => t.badge === "PRO");
    } else if (activeDropdownText === "Featured Creators") {
      filteredTemplates = TEMPLATES_LIST;
    } else if (activeDropdownText === "Upcoming") {
      filteredTemplates = [];
    }
  }

  return (
    <>
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
                  placeholder="Search components..."
                  className="w-full h-9 pl-9 pr-3 rounded-xl bg-transparent border border-black/10 dark:border-white/[0.08] text-xs outline-none focus:border-accent-glow/50 focus:ring-1 focus:ring-accent-glow/30 transition-all font-medium text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/30"
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
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl border text-xs font-semibold whitespace-nowrap ${activeCategory === 'All' && activeDropdownText === 'All types' ? 'bg-[#f4f4f5] border-[#e4e4e7] text-black' : 'bg-transparent border-black/10 dark:border-white/[0.08] text-black/80 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
                  onClick={() => {
                    setActiveCategory('All');
                    setActiveDropdownText('All types');
                  }}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Popular</span>
                </button>
                <button
                  className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-1.5 h-9 px-3.5 rounded-xl bg-transparent border border-black/10 dark:border-white/[0.08] text-xs font-medium text-black/80 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all whitespace-nowrap"
                  onClick={() => window.location.href = '/explore'}
                >
                  <Sparkles className="w-3.5 h-3.5 opacity-70" />
                  <span>Explore</span>
                </button>
                <button
                  className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-1.5 h-9 px-3.5 rounded-xl bg-transparent border border-black/10 dark:border-white/[0.08] text-xs font-medium text-black/80 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all whitespace-nowrap"
                  onClick={() => setActiveDropdownText('Recent')}
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
                      if (activeDropdownText === 'Recent') {
                        setActiveDropdownText('All types');
                      }
                      if (cat === 'All') {
                        setActiveDropdownText('All types');
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
              </div>

              {/* All Types Dropdown */}
              <div className="relative shrink-0 flex items-center gap-2 z-50 md:ml-auto self-end md:self-auto">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 h-7 px-3 rounded-full border border-black/10 dark:border-white/[0.08] bg-transparent text-[11px] font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all text-black/80 dark:text-white/70"
                >
                  <LayoutGrid className="w-3 h-3 opacity-70" />
                  <span>All Types</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>

                {dropdownOpen && (
                  <div className="absolute z-50 top-full right-0 mt-2 w-48 rounded-xl border border-black/10 dark:border-white/[0.08] bg-white dark:bg-[#1c1c1c] backdrop-blur-xl shadow-xl dark:shadow-2xl dark:shadow-black/60 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    {DROPDOWN_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setDropdownOpen(false);
                          setActiveDropdownText(option);
                        }}
                        className={`w-full px-4 py-2 text-left text-[11px] font-medium ${activeDropdownText === option ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white' : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white'} transition-colors`}
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
              key={activeCategory + search + activeDropdownText}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5"
            >
              {(() => {
                if (activeDropdownText === 'Recent') {
                  const recent = [...TEMPLATES_LIST].slice(-6).reverse();
                  return recent.map((template) => (
                    <ProjectCard
                      key={template.id}
                      {...template}
                      compact
                      onClick={handleOpenModal}
                      imageSectionBg="#111113"
                    />
                  ));
                }
                if (filteredTemplates.length === 0) {
                  return <div className="col-span-full text-center text-sm text-black/60 dark:text-white/60 py-10">No components found.</div>;
                }
                return filteredTemplates.map((template) => (
                  <ProjectCard
                    key={template.id}
                    {...template}
                    compact
                    onClick={handleOpenModal}
                    imageSectionBg="#111113"
                  />
                ));
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>

    {/* Component Detail Modal — portal renders at document.body to avoid stacking context issues */}
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
              onClick={(e) => e.stopPropagation()}
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
                    Drag into any section on your dashboard canvas.
                  </p>
                </div>

                <div className="flex shrink-0">
                  <button
                    onClick={handleAddToDashboard}
                    disabled={addedTemplates.includes(selectedTemplate.id)}
                    className="flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-lg transition-all"
                    style={{
                      background: addedTemplates.includes(selectedTemplate.id) ? "rgba(124,58,237,0.5)" : "#7c3aed",
                      cursor: addedTemplates.includes(selectedTemplate.id) ? "not-allowed" : "pointer",
                    }}
                  >
                    {addedTemplates.includes(selectedTemplate.id) ? (
                      <><Check size={16} /><span>Added</span></>
                    ) : (
                      <><Plus size={16} /><span>Add Component</span></>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
  </>
  );
}


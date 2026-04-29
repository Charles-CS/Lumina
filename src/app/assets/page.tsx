"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Search, ListFilter, Calendar, LayoutGrid, ChevronDown, Sparkles, Eye, Box, SquareStack, Loader2 } from "lucide-react";
import Image from "next/image";

import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { AnimatedGrid } from "@/components/ui/AnimatedGrid";

const CATEGORIES = [
  "All", // Special button to show all assets
  "Professional Portraits",
  "Nature & Landscapes",
  "Modern Architecture",
  "Sci-Fi & Tech",
  "Brand Logos",
  "Device Mockups",
  "Digital Illustrations",
  "App & UI Icons",
  "3D Renders",
  "Headshots",
  "Business Scenes",
  "Natural Wonders",
  "Makeup & Beauty",
  "Finance & Charts",
  "Food & Cuisine",
  "Fashion & Style",
  "Fitness & Sports",
  "Motorcycles & Vehicles"
];

const DROPDOWN_OPTIONS = [
  "All Ratios",
  "16:9",
  "1:1",
  "4:3",
  "9:16",
];

// Add a tags property to each asset for filtering
const ASSETS_LIST = [
  // ── AI-Generated PNGs ──────────────────────────────────────────────────────
  { src: "/images/assets/asset_futuristic_workspace.png", alt: "Futuristic holographic workspace", aspectClass: "aspect-video", tags: ["3d render", "business", "technology"] },
  { src: "/images/assets/asset_iridescent_spheres.png", alt: "Abstract iridescent glass spheres", aspectClass: "aspect-square", tags: ["3d render", "abstract"] },
  { src: "/images/assets/asset_volcanic_island.png", alt: "Cinematic volcanic island landscape", aspectClass: "aspect-[16/9]", tags: ["landscape", "nature"] },
  { src: "/images/assets/asset_tech_portrait.png", alt: "Sleek tech executive portrait", aspectClass: "aspect-square", tags: ["portrait", "headshot"] },
  { src: "/images/assets/asset_forest_architecture.png", alt: "Modern glass pavilion in redwood forest", aspectClass: "aspect-[4/3]", tags: ["architecture", "nature"] },
  { src: "/images/assets/asset_cyberpunk_fashion.png", alt: "High-fashion cyberpunk model", aspectClass: "aspect-[3/4]", tags: ["fashion", "sci-fi"] },
  { src: "/images/assets/asset_portrait_1_1774805266622.png", alt: "Professional studio portrait", aspectClass: "aspect-[4/5]", tags: ["portrait", "headshot"] },
  { src: "/images/assets/asset_abstract_waves_1774805283075.png", alt: "Abstract blue flowing waves", aspectClass: "aspect-[4/3]", tags: ["abstract", "nature"] },
  { src: "/images/assets/asset_drone_sea_1774805300659.png", alt: "Drone aerial view of ocean waves", aspectClass: "aspect-[9/16]", tags: ["landscape", "nature"] },
  { src: "/images/assets/asset_vr_neon_1774805319261.png", alt: "Neon VR headset futuristic concept", aspectClass: "aspect-[3/4]", tags: ["sci-fi", "technology"] },
  { src: "/images/assets/asset_phone_mockup_1774805337673.png", alt: "Smartphone minimal UI mockup", aspectClass: "aspect-[3/4]", tags: ["mockup", "technology"] },
  { src: "/images/assets/asset_portrait_golden_1774805358313.png", alt: "Golden hour portrait photography", aspectClass: "aspect-[4/5]", tags: ["portrait", "fashion"] },
  { src: "/images/assets/asset_glass_chart_1774805376753.png", alt: "3D glass analytics dashboard chart", aspectClass: "aspect-[16/9]", tags: ["3d render", "finance", "business"] },
  { src: "/images/assets/asset_cube_house_1774805394908.png", alt: "Futuristic minimal cube architecture", aspectClass: "aspect-[4/3]", tags: ["architecture", "3d render"] },
  { src: "/images/assets/asset_creative_desk_1774805412471.png", alt: "Creative designer flat lay desk", aspectClass: "aspect-square", tags: ["business", "mockup"] },
  { src: "/images/assets/asset_minimal_peaks_1774805430792.png", alt: "Minimal mountain peaks silhouette", aspectClass: "aspect-[4/3]", tags: ["landscape", "nature"] },
  { src: "/images/assets/asset_gold_strands_1774805447715.png", alt: "Abstract glowing gold light strands", aspectClass: "aspect-[3/4]", tags: ["abstract", "fashion"] },
  { src: "/images/assets/asset_3d_icon_1774805464974.png", alt: "Cloud server 3D icon render", aspectClass: "aspect-square", tags: ["icon", "3d render"] },
  { src: "/images/assets/asset_abstract_sphere_1774804521995.png", alt: "Abstract neon glowing sphere", aspectClass: "aspect-square", tags: ["abstract", "illustration"] },
  { src: "/images/assets/asset_laptop_ui_1774804558705.png", alt: "Laptop with clean UI dashboard", aspectClass: "aspect-[16/9]", tags: ["mockup", "business"] },
  { src: "/images/assets/asset_motorcycle_1774804541473.png", alt: "Vintage motorcycle at golden sunset", aspectClass: "aspect-[4/5]", tags: ["landscape", "sports"] },
  { src: "/images/assets/asset_red_ribbons_1774804574588.png", alt: "Silky glowing red ribbons", aspectClass: "aspect-[9/16]", tags: ["abstract", "fashion"] },
  { src: "/images/assets/asset_snowy_mountains_1774804593969.png", alt: "Majestic snow-capped mountain range", aspectClass: "aspect-[4/3]", tags: ["landscape", "nature"] },

  // ── Unsplash & Upscaled Photography ────────────────────────────────────────
  { src: "/images/assets/aivars-vilks-iM6hGLIKksQ-unsplash.jpg", alt: "Dramatic rocky ocean coastline at dusk", aspectClass: "aspect-[16/9]", tags: ["landscape", "nature"] },
  { src: "/images/assets/alex-robertson-8SUF4_U1V0U-unsplash.jpg", alt: "Moody forest path with misty light rays", aspectClass: "aspect-[3/4]", tags: ["landscape", "nature"] },
  { src: "/images/assets/anna-blake-bi3Qr60z3gg-unsplash.jpg", alt: "Bright floral arrangement editorial style", aspectClass: "aspect-square", tags: ["fashion", "portrait"] },
  { src: "/images/assets/clay-banks-YruTk_dHKzk-unsplash.jpg", alt: "Warm-toned lifestyle portrait outdoors", aspectClass: "aspect-[4/5]", tags: ["portrait", "headshot"] },
  { src: "/images/assets/declan-sun-VHXaQmHxeMA-unsplash.jpg", alt: "Aerial landscape of sweeping mountain valleys", aspectClass: "aspect-[16/9]", tags: ["landscape", "nature"] },
  { src: "/images/assets/deep-doshi-PXAIdRZ4MWY-unsplash.jpg", alt: "Abstract geometric architectural detail", aspectClass: "aspect-square", tags: ["architecture", "abstract"] },
  { src: "/images/assets/dmytro-yarish-mBmH6VXf86M-unsplash.jpg", alt: "Athlete in motion during outdoor workout", aspectClass: "aspect-[4/5]", tags: ["fitness", "sports"] },
  { src: "/images/assets/dzo-rXCSu_BKfRE-unsplash.jpg", alt: "Minimal flat lay with coffee and notebook", aspectClass: "aspect-square", tags: ["business", "mockup"] },
  { src: "/images/assets/jess-bailey-ROOapgvoT9M-unsplash.jpg", alt: "Colorful art supplies flat lay design", aspectClass: "aspect-[4/3]", tags: ["business", "illustration"] },
  { src: "/images/assets/jess-bailey-jnzbRcYUdd0-unsplash.jpg", alt: "Pastel stationery and paper craft arrangement", aspectClass: "aspect-[4/3]", tags: ["business", "illustration"] },
  { src: "/images/assets/krzhck-CO2bK3y3NAM-unsplash.jpg", alt: "Cinematic wide landscape at golden hour", aspectClass: "aspect-[16/9]", tags: ["landscape", "nature"] },
  { src: "/images/assets/leftfield-corn-3BjagSP2-4s-unsplash.jpg", alt: "Rustic autumn farmland aerial view", aspectClass: "aspect-[16/9]", tags: ["landscape", "nature"] },
  { src: "/images/assets/leftfield-corn-GrgOfrOFko8-unsplash.jpg", alt: "Rolling countryside hills in soft light", aspectClass: "aspect-[4/3]", tags: ["landscape", "nature"] },
  { src: "/images/assets/leftfield-corn-H8AAjYrq2JA-unsplash.jpg", alt: "Open field with dramatic cloudscape", aspectClass: "aspect-[16/9]", tags: ["landscape", "nature"] },
  { src: "/images/assets/leftfield-corn-aJuBw8aaO6E-unsplash.jpg", alt: "Misty meadow at sunrise with soft fog", aspectClass: "aspect-[4/3]", tags: ["landscape", "nature"] },
  { src: "/images/assets/leftfield-corn-bGniaFu--Nk-unsplash.jpg", alt: "Warm harvest season farmland at dusk", aspectClass: "aspect-[16/9]", tags: ["landscape", "nature"] },
  { src: "/images/assets/leftfield-corn-nUX8VAFdbEk-unsplash.jpg", alt: "Green pastoral countryside with trees", aspectClass: "aspect-[4/3]", tags: ["landscape", "nature"] },
  { src: "/images/assets/leftfield-corn-r7ByDF1e46M-unsplash.jpg", alt: "Scenic rural path through open fields", aspectClass: "aspect-[3/4]", tags: ["landscape", "nature"] },
  { src: "/images/assets/leftfield-corn-yjv6ZHd8Ghg-unsplash.jpg", alt: "Sweeping aerial view of countryside meadow", aspectClass: "aspect-[16/9]", tags: ["landscape", "nature"] },
  { src: "/images/assets/luke-hales-uiCYv_b3dO4-unsplash.jpg", alt: "Urban street scene with cinematic lighting", aspectClass: "aspect-[4/5]", tags: ["architecture", "portrait"] },
  { src: "/images/assets/marco-grosso-zj_WL_5KUMY-unsplash.jpg", alt: "Dramatic storm clouds over open sea", aspectClass: "aspect-[16/9]", tags: ["landscape", "nature"] },
  { src: "/images/assets/marek-piwnicki-UvibuOZKKc4-unsplash.jpg", alt: "Surreal dark forest with ethereal fog", aspectClass: "aspect-[4/3]", tags: ["landscape", "nature"] },
  { src: "/images/assets/martin-katler-6xzZ0DvTtK8-unsplash.jpg", alt: "High-fashion model editorial close-up", aspectClass: "aspect-[3/4]", tags: ["fashion", "portrait"] },
  { src: "/images/assets/matthias-cooper-tfEAXoEJCYU-unsplash.jpg", alt: "Mountain peak at sunrise with pink skies", aspectClass: "aspect-[16/9]", tags: ["landscape", "nature"] },
  { src: "/images/assets/pavlo-talpa-agO_N6RPW0U-unsplash.jpg", alt: "Modern minimalist interior design space", aspectClass: "aspect-[4/3]", tags: ["architecture", "business"] },
  { src: "/images/assets/pawel-czerwinski-UIsNdetPKfE-unsplash.jpg", alt: "Bold colorful abstract paint texture", aspectClass: "aspect-square", tags: ["abstract", "illustration"] },
  { src: "/images/assets/rishi-lzpLNhy5WYw-unsplash.jpg", alt: "Vibrant city skyline at night with lights", aspectClass: "aspect-[16/9]", tags: ["architecture", "landscape"] },
  { src: "/images/assets/rod-long-liGPSuWK4ek-unsplash.jpg", alt: "Calm zen garden with soft natural light", aspectClass: "aspect-[4/3]", tags: ["landscape", "nature"] },
  { src: "/images/assets/ryan-klaus-f7UKvuJZcDI-unsplash.jpg", alt: "Dynamic sport action shot in motion", aspectClass: "aspect-[4/5]", tags: ["fitness", "sports"] },
  { src: "/images/assets/ryan-klaus-kteeOS2UcrQ-unsplash.jpg", alt: "Athlete training at high performance", aspectClass: "aspect-[4/3]", tags: ["fitness", "sports"] },
  { src: "/images/assets/sarmat-batagov-t1WmHgOynnU-unsplash.jpg", alt: "Epic mountain range panoramic view", aspectClass: "aspect-[16/9]", tags: ["landscape", "nature"] },
  { src: "/images/assets/shubham-dhage-xwroH2gD8uw-unsplash.jpg", alt: "3D abstract crystal geometric shape", aspectClass: "aspect-square", tags: ["3d render", "abstract"] },
  { src: "/images/assets/simon-2moDfzogTUc-unsplash.jpg", alt: "Luxury modern kitchen interior design", aspectClass: "aspect-[4/3]", tags: ["architecture", "business"] },
  { src: "/images/assets/slava-auchynnikau-MP9rJePn9GA-unsplash.jpg", alt: "Abstract liquid ink swirl in dark water", aspectClass: "aspect-square", tags: ["abstract", "illustration"] },
  { src: "/images/assets/steve-busch-Cm5eamr_vmo-unsplash.jpg", alt: "Coastal cliffside with ocean waves below", aspectClass: "aspect-[16/9]", tags: ["landscape", "nature"] },
  { src: "/images/assets/tanya-barrow-IgEVymvSSh0-unsplash.jpg", alt: "Elegant beauty portrait with soft makeup", aspectClass: "aspect-[4/5]", tags: ["portrait", "headshot"] },
  { src: "/images/assets/tobias-reich-BG3PSRcTOik-unsplash.jpg", alt: "Surreal long exposure light painting art", aspectClass: "aspect-[4/3]", tags: ["abstract", "landscape"] },
  { src: "/images/assets/viktor-forgacs-click-00vf9MdXbqE-unsplash.jpg", alt: "Cinematic building facade architectural detail", aspectClass: "aspect-[3/4]", tags: ["architecture"] },
].map((item, index) => ({
  ...item,
  id: `asset-${index}`
}));

/** Generate a human-friendly description from an asset's alt + tags */
function generateDescription(alt: string, tags: string[]): string {
  const tagStr = tags.slice(0, 3).join(", ");
  const useCases: Record<string, string> = {
    "landscape": "ideal for website heroes, travel blogs, and editorial backdrops",
    "nature": "perfect for environmental campaigns, wellness brands, and backgrounds",
    "portrait": "great for profile sections, editorial layouts, and testimonials",
    "headshot": "suited for team pages, bios, and professional profiles",
    "fashion": "crafted for editorial spreads, lookbooks, and brand campaigns",
    "abstract": "versatile for modern UI backgrounds, motion graphics, and art projects",
    "3d render": "ideal for tech presentations, product showcases, and digital art",
    "business": "perfect for corporate decks, landing pages, and marketing materials",
    "mockup": "great for app previews, product demos, and client presentations",
    "sci-fi": "suited for gaming, futuristic branding, and concept art",
    "technology": "ideal for SaaS products, tech blogs, and innovation campaigns",
    "architecture": "perfect for real estate, design portfolios, and editorial use",
    "fitness": "crafted for sports brands, wellness apps, and gym content",
    "finance": "suited for fintech dashboards, business reports, and infographics",
    "illustration": "versatile for creative projects, children's content, and branding",
    "icon": "perfect for app UI, icon packs, and interface design",
  };
  const primaryTag = tags.find(t => useCases[t]) ?? tags[0] ?? "design";
  const useCase = useCases[primaryTag] ?? "well-suited for a wide variety of creative projects";
  return `${alt}. A high-quality image tagged with ${tagStr} — ${useCase}.`;
}

/** Map aspectClass to a human-readable ratio */
function getAspectLabel(aspectClass: string): string {
  const map: Record<string, string> = {
    "aspect-video": "16:9",
    "aspect-square": "1:1",
    "aspect-[16/9]": "16:9",
    "aspect-[4/3]": "4:3",
    "aspect-[3/4]": "3:4",
    "aspect-[4/5]": "4:5",
    "aspect-[9/16]": "9:16",
  };
  return map[aspectClass] ?? aspectClass;
}

export default function AssetsPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDropdownText, setActiveDropdownText] = useState("All Ratios");
  const [selectedAsset, setSelectedAsset] = useState<typeof ASSETS_LIST[number] | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Modal close handler
  const closeModal = () => setSelectedAsset(null);

  // Lock body scroll when modal is open
  // Reset body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Modal scroll lock
  useEffect(() => {
    if (selectedAsset) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "var(--scrollbar-width, 0px)";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "0px";
    }
  }, [selectedAsset]);

  // Close modal on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, search, activeDropdownText]);

  const filteredAssets = ASSETS_LIST.filter(asset => {
    const categoryMap: Record<string, string[]> = {
      "All": [],
      "Professional Portraits": ["portrait", "headshot"],
      "Nature & Landscapes": ["landscape", "nature"],
      "Modern Architecture": ["architecture"],
      "Sci-Fi & Tech": ["sci-fi", "technology"],
      "Brand Logos": ["logo"],
      "Device Mockups": ["mockup", "technology"],
      "Digital Illustrations": ["illustration"],
      "App & UI Icons": ["icon"],
      "3D Renders": ["3d render"],
      "Headshots": ["headshot"],
      "Business Scenes": ["business"],
      "Natural Wonders": ["nature"],
      "Makeup & Beauty": ["makeup"],
      "Finance & Charts": ["finance"],
      "Food & Cuisine": ["food"],
      "Fashion & Style": ["fashion"],
      "Fitness & Sports": ["fitness", "sports"],
      "Motorcycles & Vehicles": ["sports", "motorcycle"]
    };
    const matchesCategory = activeCategory === "All" || (asset.tags && categoryMap[activeCategory]?.some(tag => asset.tags.includes(tag)));
    const matchesSearch = search.trim() === "" || asset.alt.toLowerCase().includes(search.toLowerCase()) || (asset.tags && asset.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())));
    const matchesRatio = activeDropdownText === "All Ratios" || getAspectLabel(asset.aspectClass) === activeDropdownText;
    return matchesCategory && matchesSearch && matchesRatio;
  });

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const visibleAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--page-bg)] bg-grid text-[var(--foreground)] selection:bg-accent-glow/30 overflow-y-visible">
      <Navbar />

      <main className="flex-1 mx-auto flex w-full max-w-screen-2xl flex-col gap-6 px-4 sm:px-6 md:px-12 pt-[30px] md:pt-[45px] pb-32 overflow-visible">
        {/* Main Content Wrapper */}
        <div className="flex flex-col gap-6 rounded-3xl border border-black/5 dark:border-white/[0.04] bg-white/50 dark:bg-[#0a0a0a]/80 p-5 sm:p-6 shadow-sm overflow-visible">
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
                  placeholder="Search 29993 assets..."
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
                <button className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-1.5 h-9 px-3.5 rounded-xl bg-transparent border border-black/10 dark:border-white/[0.08] text-xs font-medium text-black/80 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all whitespace-nowrap">
                  <ListFilter className="w-3.5 h-3.5 opacity-70" />
                  <span>Popular</span>
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-1.5 h-9 px-3.5 rounded-xl bg-transparent border border-black/10 dark:border-white/[0.08] text-xs font-medium text-black/80 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5 opacity-70" />
                  <span>Explore</span>
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-1.5 h-9 px-3.5 rounded-xl bg-transparent border border-black/10 dark:border-white/[0.08] text-xs font-medium text-black/80 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5 opacity-70" />
                  <span>Recent</span>
                </button>
              </div>
            </div>

            {/* Categories & Filters Row */}
            <div className="flex items-start justify-between gap-3 relative">
              {/* Tags (Wrapping) */}
              <div className="flex flex-wrap items-center gap-2 flex-1 pr-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-medium transition-all ${activeCategory === cat
                        ? "bg-black/5 dark:bg-white/10 text-black dark:text-white border border-transparent"
                        : "bg-transparent border border-black/10 dark:border-white/[0.06] text-black/60 dark:text-white/50 hover:text-black/90 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* All Ratios Dropdown */}
              <div className="relative shrink-0 flex items-center gap-2 z-50">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 h-7 px-3 rounded-full border border-black/10 dark:border-white/[0.08] bg-transparent text-[11px] font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all text-black/80 dark:text-white/70"
                >
                  <span>{activeDropdownText}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-32 rounded-xl border border-black/10 dark:border-white/[0.08] bg-white dark:bg-[#1c1c1c] backdrop-blur-xl shadow-xl dark:shadow-2xl dark:shadow-black/60 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    {DROPDOWN_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setDropdownOpen(false);
                          setActiveDropdownText(option);
                        }}
                        className="w-full px-4 py-2 text-left text-[11px] font-medium text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors"
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

          {/* Masonry Columns Layout for Assets with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + activeDropdownText + search + currentPage}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4"
            >
              {visibleAssets.map((asset) => (
                <div
                  key={asset.id}
                  className={`break-inside-avoid relative group rounded-3xl overflow-hidden cursor-pointer dark:bg-white/5 mb-4 ${asset.aspectClass} transform-gpu transition-all duration-300 hover:scale-[1.01]`}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <Image
                    src={asset.src}
                    alt={asset.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Glow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 py-12 border-t border-black/5 dark:border-white/5 mt-8">
              <p className="text-[11px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30">
                Showing <span className="text-black dark:text-white">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredAssets.length)}</span> of <span className="text-black dark:text-white">{filteredAssets.length}</span> assets
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => prev - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 h-9 rounded-xl border border-black/10 dark:border-white/10 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${currentPage === page
                          ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                          : "hover:bg-black/5 dark:hover:bg-white/5 text-black/40 dark:text-white/40"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 h-9 rounded-xl border border-black/10 dark:border-white/10 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      {/* Modal for asset info and preview, styled like the reference image */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedAsset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-xl"
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 12 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onClick={e => e.stopPropagation()}
                className="relative flex w-max max-w-[95vw] h-max max-h-[90vh] rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden bg-[#0d0d0d] border border-white/10"
              >
                {/* Left: Image Preview */}
                <div className="flex shrink items-center justify-center min-w-0 bg-black/20">
                  <img
                    src={selectedAsset?.src}
                    alt={selectedAsset?.alt}
                    className="object-contain block"
                    style={{
                      maxWidth: "calc(95vw - 420px)",
                      maxHeight: "90vh"
                    }}
                  />
                </div>
                {/* Right: Info Panel */}
                <div className="w-[420px] max-w-full flex-shrink-0 flex flex-col justify-between bg-transparent p-8 text-white custom-scrollbar border-l border-white/5">
                  <button
                    onClick={closeModal}
                    className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors z-10"
                  >
                    <X size={20} />
                  </button>
                  <div className="flex-1 overflow-y-auto pr-2 mt-2 custom-scrollbar">
                    <h2 className="text-3xl font-bold mb-4 leading-tight">{selectedAsset?.alt}</h2>
                    <p className="text-base text-white/80 mb-8 leading-relaxed">
                      {selectedAsset ? generateDescription(selectedAsset.alt, selectedAsset.tags) : ''}
                    </p>
                    {/* Download/Action Buttons with PRO badge and description */}
                    <div className="flex flex-col gap-4 mb-6">
                      {/* Download 4K */}
                      <div className="flex w-full items-center">
                        <div
                          className="flex items-center w-40 px-3 py-2 rounded-lg bg-white/10 transition-colors text-white font-semibold text-sm justify-between select-none cursor-not-allowed hover:bg-red-700/30"
                          style={{ cursor: 'not-allowed' }}
                        >
                          <span>Download 4K</span>
                          <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-bold tracking-wider">PRO</span>
                        </div>
                        <div className="flex flex-col text-xs text-white/60 ml-4 text-left leading-tight">
                          <span>Commercial use</span>
                          <span>for PRO users</span>
                        </div>
                      </div>
                      {/* Remix Image */}
                      <div className="flex w-full items-center">
                        <div
                          className="flex items-center w-40 px-3 py-2 rounded-lg bg-white/10 transition-colors text-white font-semibold text-sm justify-between select-none cursor-not-allowed hover:bg-red-700/30"
                          style={{ cursor: 'not-allowed' }}
                        >
                          <span>Remix Image</span>
                          <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-bold tracking-wider">PRO</span>
                        </div>
                        <div className="flex flex-col text-xs text-white/60 ml-4 text-left leading-tight">
                          <span>GPT Image 1.5, Flux 2 Pro or</span>
                          <span>Nano Banana</span>
                        </div>
                      </div>
                      {/* Remove BG */}
                      <div className="flex w-full items-center">
                        <div
                          className="flex items-center w-40 px-3 py-2 rounded-lg bg-white/10 transition-colors text-white font-semibold text-sm justify-between select-none cursor-not-allowed hover:bg-red-700/30"
                          style={{ cursor: 'not-allowed' }}
                        >
                          <span>Remove BG</span>
                          <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-bold tracking-wider">PRO</span>
                        </div>
                        <div className="flex flex-col text-xs text-white/60 ml-4 text-left leading-tight">
                          <span>Replicate Background</span>
                          <span>Remover</span>
                        </div>
                      </div>
                    </div>
                    {/* Tags */}
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2 mt-2 mb-8">
                        {selectedAsset?.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-sm font-medium capitalize opacity-80">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm opacity-70 mt-6 pt-4 border-t border-white/10 space-x-4 whitespace-nowrap overflow-hidden">
                    {/* Author as underlined link */}
                    <a href="#" className="underline underline-offset-2 text-white/80 hover:text-white transition">by Sam</a>
                    <span className="flex items-center space-x-1.5">
                      <Eye className="w-4 h-4 inline-block opacity-70" />
                      <span>48</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Box className="w-4 h-4 inline-block opacity-70" />
                      <span>8</span>
                    </span>
                    <span className="flex items-center space-x-1.5 text-ellipsis overflow-hidden">
                      <SquareStack className="w-4 h-4 inline-block opacity-70" />
                      <span>4:3 · 3712 × 4608</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

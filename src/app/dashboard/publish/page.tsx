"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Rocket, FileCode2, Copy, Download, ChevronLeft, Globe,
  ArrowRight, CheckCircle2, Zap, Eye, ImagePlus, Check,
  Loader2, ExternalLink, Sparkles, AlertCircle, Link2,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { LuminaLogo } from "@/components/ui/LuminaLogo";
import { useLuminaStore } from "@/store/useLuminaStore";
import {
  generateHTML,
  generateCSS,
  generateReact,
  generateReadme,
} from "@/lib/compiler";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type CodeTab = "html" | "css" | "react";

// ─────────────────────────────────────────────────────────────────────────────
// Confetti particle component
// ─────────────────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  "#a78bfa", "#818cf8", "#34d399", "#f472b6",
  "#fb923c", "#facc15", "#38bdf8", "#e879f9",
];

function ConfettiParticle({ index }: { index: number }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const size = 6 + Math.random() * 8;
  const x = (Math.random() - 0.5) * 600;
  const y = -(150 + Math.random() * 350);
  const rotate = Math.random() * 720 - 360;

  return (
    <motion.div
      className="absolute pointer-events-none rounded-sm"
      style={{
        width: size,
        height: size * (Math.random() > 0.5 ? 1 : 2.5),
        backgroundColor: color,
        top: "50%",
        left: "50%",
        originX: 0.5,
        originY: 0.5,
      }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
      animate={{
        x,
        y,
        rotate,
        opacity: 0,
        scale: Math.random() * 0.5 + 0.5,
      }}
      transition={{
        duration: 1.2 + Math.random() * 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.random() * 0.15,
      }}
    />
  );
}

function Confetti({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50 flex items-center justify-center">
          {Array.from({ length: 48 }).map((_, i) => (
            <ConfettiParticle key={i} index={i} />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Syntax-highlighted code block
// ─────────────────────────────────────────────────────────────────────────────

function syntaxHighlight(code: string, lang: CodeTab): React.ReactNode[] {
  const lines = code.split("\n");

  const escapeHTML = (str: string) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return lines.map((line, i) => {
    let colored = escapeHTML(line);

    if (lang === "html") {
      colored = colored
        .replace(/(&lt;!--.*?--&gt;)/g, '<span style="color:#6b7280">$1</span>')
        .replace(/(&lt;\/?[\w-]+|&lt;\/?[\w-]+)/g, '<span style="color:#60a5fa">$1</span>')
        .replace(/([\w-]+)=/g, '<span style="color:#4ade80">$1</span>=')
        .replace(/(&quot;.*?&quot;|".*?")/g, '<span style="color:#fb923c">$1</span>');
    } else if (lang === "css") {
      colored = colored
        .replace(/(\/\*.*?\*\/)/g, '<span style="color:#6b7280">$1</span>')
        .replace(/([.#][\w-]+\s*\{)/g, '<span style="color:#f472b6">$1</span>')
        .replace(/(--[\w-]+)/g, '<span style="color:#93c5fd">$1</span>')
        .replace(/:\s*(#[0-9a-fA-F]+|[\d.]+px|[^;\{\n]+)/g, ': <span style="color:#fb923c">$1</span>');
    } else { // react / JS
      colored = colored
        .replace(/(\/\/.*$)/g, '<span style="color:#6b7280">$1</span>')
        .replace(/\b(import|export|default|function|return|const|let|from|async|await)\b/g, '<span style="color:#60a5fa">$1</span>')
        .replace(/(&lt;\/?[A-Z][\w.]*\s?\/??)/g, '<span style="color:#4ade80">$1</span>')
        .replace(/(&lt;\/?[a-z][\w-]*[\s&gt;?\/??])/g, '<span style="color:#93c5fd">$1</span>')
        .replace(/(&quot;.*?&quot;|".*?"|'.*?'|`.*?`)/g, '<span style="color:#fb923c">$1</span>');
    }

    return (
      <span key={i}>
        <span dangerouslySetInnerHTML={{ __html: colored }} />
        {"\n"}
      </span>
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────────────────────

function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-violet-500/40 shadow-[0_0_30px_rgba(139,92,246,0.25)] text-sm font-semibold text-violet-300"
        >
          <Check size={14} className="text-emerald-400" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function PublishPage() {
  const {
    sections,
    globalStyles,
    projectName,
    siteMeta,
    publishStatus,
    deployedSlug,
    setProjectName,
    setSiteMeta,
    publishProject,
  } = useLuminaStore();

  // ── Local UI state ────────────────────────────────────────────────────────
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>("react");
  const [copiedToast, setCopiedToast] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const projectNameInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Track previous publishStatus to fire confetti on transition
  const prevStatusRef = useRef(publishStatus);

  useEffect(() => {
    if (prevStatusRef.current === "Draft" && publishStatus === "Live") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    prevStatusRef.current = publishStatus;
  }, [publishStatus]);

  // ── Computed code strings ─────────────────────────────────────────────────
  const generatedCode = useMemo(
    () => ({
      html: generateHTML(sections, siteMeta),
      css: generateCSS(sections, globalStyles),
      react: generateReact(sections, siteMeta),
    }),
    [sections, siteMeta, globalStyles]
  );

  const activeCode = generatedCode[activeCodeTab];

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleDeploy = async () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeployError(null);
    try {
      await publishProject();
    } catch (err) {
      setDeployError(err instanceof Error ? err.message : "Deploy failed.");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(activeCode).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2200);
    });
  }, [activeCode]);

  const handleZip = useCallback(async () => {
    const zip = new JSZip();
    zip.file("index.html", generatedCode.html);
    zip.file("styles.css", generatedCode.css);
    zip.file("app.jsx", generatedCode.react);
    zip.file("README.md", generateReadme(siteMeta, sections));
    const blob = await zip.generateAsync({ type: "blob" });
    const safeName = (projectName || "lumina-site").toLowerCase().replace(/\s+/g, "-");
    saveAs(blob, `${safeName}-export.zip`);
  }, [generatedCode, siteMeta, sections, projectName]);

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSiteMeta({ faviconUrl: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleProjectNameBlur = () => {
    setIsEditingProjectName(false);
    if (!projectName.trim()) setProjectName("Untitled Project");
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const isLive = publishStatus === "Live";
  const hasDomain = customDomain.trim().length > 0;
  const liveUrl = deployedSlug ? `http://localhost:3000/v/${deployedSlug}` : null;
  const displaySlug = deployedSlug
    ? `${(projectName || "untitled").toLowerCase().replace(/\s+/g, "-")}-${deployedSlug}.lumina.app`
    : null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-[#050505] text-white overflow-hidden relative flex flex-col font-sans select-none">
      {/* ── Background ────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-1/4 w-[600px] h-[500px] bg-cyan-600/8 rounded-full blur-[140px] pointer-events-none" />

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      <Toast message="Copied to clipboard!" show={copiedToast} />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="relative z-50 flex items-center justify-between px-6 h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <ChevronLeft size={18} />
          </Link>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] p-1">
            <LuminaLogo invert />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-white/40 font-medium">Lumina</span>
            <span className="text-white/20">/</span>
            <span className="text-white/80 font-semibold">Launch</span>
          </div>
        </div>

        {/* Live status pill (header) */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-widest transition-all duration-500 ${
          isLive
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
            : "border-white/10 bg-white/[0.03] text-white/30"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`} />
          {isLive ? "Live" : "Draft"}
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-stretch justify-center p-6 relative z-10 gap-6 max-w-[1440px] mx-auto w-full overflow-hidden">

        {/* ════════════════════════════════════════════════════════════════
            LEFT PANEL — Site Summary
        ════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="w-[260px] flex-shrink-0 rounded-[24px] border border-white/[0.07] bg-[#0a0a0a]/70 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.04)] flex flex-col p-6 gap-6"
        >
          {/* Section header */}
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-violet-500 rounded-full" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Site Summary</h3>
          </div>

          {/* Project Name — inline editable */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">Project Name</span>
            {isEditingProjectName ? (
              <input
                ref={projectNameInputRef}
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={handleProjectNameBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") {
                    handleProjectNameBlur();
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                className="w-full bg-transparent border-b border-violet-500 text-white/95 font-semibold text-sm pb-0.5 focus:outline-none caret-violet-400 placeholder:text-white/20"
                autoFocus
              />
            ) : (
              <button
                onClick={() => {
                  setIsEditingProjectName(true);
                  setTimeout(() => projectNameInputRef.current?.focus(), 0);
                }}
                className="w-full text-left text-white font-semibold text-sm truncate transition-colors border-b border-white/20 hover:border-violet-500/50 pb-0.5 group"
              >
                <span className="group-hover:text-violet-300 transition-colors">
                  {projectName || "Untitled Project"}
                </span>
              </button>
            )}
          </div>

          {/* Status & Stats */}
          <div className="space-y-3 text-[13px]">
            {/* Status */}
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-white/40 font-medium">Status</span>
              {isLive ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold px-2.5 py-1 rounded-md bg-emerald-400/10 border border-emerald-400/20 text-[11px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-400 font-bold px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/20 text-[11px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Draft
                </div>
              )}
            </div>

            {/* Pages */}
            <div className="flex items-center justify-between">
              <span className="text-white/40 font-medium">Pages</span>
              <span className="text-white/80 font-semibold tabular-nums">1</span>
            </div>

            {/* Sections */}
            <div className="flex items-center justify-between">
              <span className="text-white/40 font-medium">Sections</span>
              <motion.span
                key={sections.length}
                initial={{ scale: 1.3, color: "#a78bfa" }}
                animate={{ scale: 1, color: "#ffffffcc" }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="font-semibold tabular-nums"
              >
                {sections.length}
              </motion.span>
            </div>

            {/* Components */}
            <div className="flex items-center justify-between">
              <span className="text-white/40 font-medium">Components</span>
              <span className="text-white/80 font-semibold tabular-nums">
                {sections.reduce((acc, s) => acc + (s.props.components?.length ?? 0), 0)}
              </span>
            </div>
          </div>

          {/* Deployed URL (if live) */}
          <AnimatePresence>
            {isLive && displaySlug && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 overflow-hidden"
              >
                <p className="text-[9px] uppercase tracking-widest text-emerald-400/70 mb-1 font-bold">Live URL</p>
                <p className="text-[11px] font-mono text-emerald-300/80 truncate">{displaySlug}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Live Preview */}
          <motion.div className="mt-auto" whileTap={isLive ? { scale: 0.97 } : {}}>
            {isLive && liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 font-semibold text-[13px] hover:bg-violet-500/20 hover:border-violet-500/50 hover:text-white transition-all shadow-[0_0_20px_rgba(139,92,246,0.1)]"
              >
                <Eye size={15} />
                View Live Preview
                <ExternalLink size={12} className="opacity-60 group-hover:opacity-100" />
              </a>
            ) : (
              <div className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/20 font-semibold text-[13px] cursor-not-allowed">
                <Eye size={15} />
                View Live Preview
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════
            MIDDLE + RIGHT — Launch Control Center
        ════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex rounded-[28px] border border-violet-500/15 bg-[#060608]/85 backdrop-blur-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.7),0_0_60px_rgba(139,92,246,0.1),inset_0_1px_1px_rgba(255,255,255,0.07)] overflow-hidden relative"
        >
          {/* Inner halos */}
          <div className="absolute top-0 left-1/3 w-[300px] h-[300px] bg-cyan-500/[0.04] rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/[0.08] rounded-full blur-[90px] pointer-events-none" />

          {/* ── CENTER: Identity & Code Engine ─────────────────────────── */}
          <div className="w-[55%] flex flex-col border-r border-white/[0.05] relative z-10 overflow-y-auto thin-scrollbar">

            {/* Checklist Header */}
            <div className={`px-8 py-3 border-b flex items-center gap-3 transition-all duration-500 flex-shrink-0 ${
              siteMeta.title ? "border-emerald-500/25 bg-emerald-500/[0.04]" : "border-white/5 bg-white/[0.01]"
            }`}>
              {siteMeta.title ? (
                <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center text-[8px] font-bold text-white/40 flex-shrink-0">!</div>
              )}
              <div className="flex items-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60 leading-none">LaunchControl Checklist</span>
              </div>
            </div>

            {/* Identity Section */}
            <div className="p-8 pb-4 flex-shrink-0">
              <h2 className="text-xl font-bold tracking-tight text-white/90 mb-4">Website Identity &amp; Profile</h2>

              <div className="space-y-5">
                {/* Website Name */}
                <div className="relative group">
                  <input
                    type="text"
                    id="websiteName"
                    value={siteMeta.title}
                    onChange={(e) => setSiteMeta({ title: e.target.value })}
                    className="peer w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 pt-7 text-white text-sm focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/25 transition-all placeholder-transparent shadow-inner"
                    placeholder="Website Name"
                  />
                  <label
                    htmlFor="websiteName"
                    className="absolute left-4 top-2 text-[9px] uppercase tracking-widest text-white/35 peer-focus:text-violet-400 transition-colors font-semibold"
                  >
                    Website Name (browser tab)
                  </label>
                </div>

                {/* Favicon + SEO row */}
                <div className="flex gap-5">
                  {/* Favicon mock */}
                  <div className="w-[100px] flex-shrink-0 relative group">
                    <input
                      type="file"
                      ref={faviconInputRef}
                      onChange={handleFaviconChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => faviconInputRef.current?.click()}
                      className={`w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-xs font-medium overflow-hidden pt-6 ${
                        siteMeta.faviconUrl
                          ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                          : "border-white/10 bg-black/30 text-white/25 hover:border-white/20 hover:text-white/50"
                      }`}
                    >
                      {siteMeta.faviconUrl ? (
                        <div className="relative w-full h-full flex flex-col items-center justify-center gap-1">
                          <img 
                            src={siteMeta.faviconUrl} 
                            alt="Favicon" 
                            className="w-8 h-8 object-contain rounded-md"
                          />
                          <span className="text-[9px]">Change</span>
                        </div>
                      ) : (
                        <>
                          <ImagePlus size={20} strokeWidth={1.5} />
                          <span>Upload</span>
                        </>
                      )}
                    </motion.button>
                    <span className="absolute left-3.5 top-2 text-[9px] uppercase tracking-widest text-white/35 font-semibold pointer-events-none">
                      Favicon
                    </span>
                  </div>

                  {/* SEO meta */}
                  <div className="flex-1 relative">
                    <textarea
                      id="seoDesc"
                      value={siteMeta.description}
                      onChange={(e) => setSiteMeta({ description: e.target.value })}
                      rows={3}
                      className="peer w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pt-7 text-white text-sm focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/25 transition-all placeholder-transparent shadow-inner resize-none thin-scrollbar"
                      placeholder="Meta Description"
                    />
                    <label
                      htmlFor="seoDesc"
                      className="absolute left-4 top-2 text-[9px] uppercase tracking-widest text-white/35 peer-focus:text-violet-400 transition-colors font-semibold"
                    >
                      Meta Description
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Engine */}
            <div className="px-8 pb-8 flex flex-col flex-1 min-h-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  <FileCode2 size={13} className="text-white/50" />
                </div>
                <h3 className="text-sm font-semibold text-white/70 tracking-wide">Advanced: Code Viewer &amp; Export</h3>
              </div>

              {/* Code window */}
              <div className="flex-1 rounded-2xl border border-white/[0.07] bg-[#040406] flex flex-col overflow-hidden shadow-inner min-h-[220px]">
                {/* Tabs */}
                <div className="flex px-2 pt-2 gap-0.5 border-b border-white/5 bg-black/30 flex-shrink-0">
                  {(["html", "css", "react"] as const).map((tab) => (
                    <motion.button
                      key={tab}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveCodeTab(tab)}
                      className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-t-lg transition-all ${
                        activeCodeTab === tab
                          ? "bg-[#040406] text-violet-300 border-x border-t border-white/[0.06] shadow-[0_-4px_10px_rgba(0,0,0,0.3)]"
                          : "text-white/25 hover:text-white/50 hover:bg-white/[0.02]"
                      }`}
                    >
                      {tab === "react" ? "React/JS" : tab.toUpperCase()}
                    </motion.button>
                  ))}
                  <div className="ml-auto flex items-center pr-2 pb-1 gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                    <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                    <div className="w-2 h-2 rounded-full bg-[#27C93F]" />
                  </div>
                </div>

                {/* Code area */}
                <div className="flex-1 p-4 font-mono text-[11px] leading-relaxed text-white/55 overflow-y-auto thin-scrollbar">
                  <AnimatePresence mode="wait">
                    <motion.pre
                      key={activeCodeTab}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-pre-wrap break-words"
                    >
                      {syntaxHighlight(activeCode, activeCodeTab)}
                    </motion.pre>
                  </AnimatePresence>
                </div>
              </div>

              {/* Export buttons */}
              <div className="flex gap-2 mt-3 flex-shrink-0">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 font-bold text-[11px] uppercase tracking-wider text-white/60 hover:bg-white/[0.08] hover:border-white/20 hover:text-white transition-all"
                >
                  <Copy size={13} />
                  Copy Full Source
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleZip}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-violet-600/10 border border-violet-500/30 font-bold text-[11px] uppercase tracking-wider text-violet-300 hover:bg-violet-500/20 hover:border-violet-400/50 hover:text-white transition-all shadow-[0_0_15px_rgba(139,92,246,0.08)] group"
                >
                  <Download size={13} className="group-hover:-translate-y-0.5 transition-transform" />
                  ZIP
                </motion.button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Deploy & Hosting ─────────────────────────────────── */}
          <div className="w-[45%] flex flex-col relative z-10 p-8 overflow-y-auto thin-scrollbar">

            {/* Header */}
            <div className="flex items-center gap-5 mb-10 flex-shrink-0">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-violet-500/25 blur-xl rounded-full animate-pulse" />
                <div className="w-14 h-14 rounded-[18px] bg-[#0c0c0f] border border-violet-500/30 flex items-center justify-center relative z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
                  <Rocket className="text-violet-400 drop-shadow-[0_0_12px_rgba(139,92,246,0.7)]" size={26} strokeWidth={1.2} />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white/95">Launch to the Web</h2>
                <p className="text-[10px] font-bold text-white/35 uppercase tracking-[0.15em] mt-1">Live Hosting Control</p>
              </div>
            </div>

            {/* Deploy button area */}
            <div className="relative mb-10 flex-shrink-0">
              <Confetti show={showConfetti} />

              <AnimatePresence mode="wait">
                {!isLive ? (
                  <motion.div key="pre-deploy" exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col gap-3">
                    {/* Main deploy button */}
                    <motion.button
                      whileTap={!isDeploying && !!siteMeta.title ? { scale: 0.97 } : {}}
                      onClick={handleDeploy}
                      disabled={!siteMeta.title || isDeploying}
                      className={`relative group w-full py-5 rounded-2xl overflow-hidden transition-all font-bold text-lg ${
                        siteMeta.title && !isDeploying
                          ? "bg-violet-600 hover:bg-violet-500 shadow-[0_0_40px_rgba(139,92,246,0.4)] text-white cursor-pointer"
                          : "bg-white/[0.04] border border-white/10 text-white/25 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {/* Shimmer */}
                      {siteMeta.title && !isDeploying && (
                        <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.18)_50%,transparent_60%)] opacity-0 group-hover:opacity-100 bg-[length:200%] group-hover:animate-[shimmer_1.2s_ease_infinite] transition-opacity" />
                      )}
                      {/* Progress bar when deploying */}
                      {isDeploying && (
                        <motion.div
                          className="absolute inset-x-0 bottom-0 h-0.5 bg-violet-300"
                          initial={{ scaleX: 0, originX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 3, ease: "easeInOut" }}
                        />
                      )}
                      <div className="relative flex items-center justify-center gap-3">
                        {isDeploying ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Compiling Assets…</span>
                          </>
                        ) : (
                          <>
                            <Globe size={20} />
                            <span>Deploy Site</span>
                          </>
                        )}
                      </div>
                    </motion.button>

                    {/* Error */}
                    <AnimatePresence>
                      {deployError && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 text-red-400 text-[12px] bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5"
                        >
                          <AlertCircle size={13} />
                          {deployError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!siteMeta.title && (
                      <p className="text-center text-[11px] text-white/25 font-medium tracking-wide">
                        ✦ Complete the identity checklist first
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="post-deploy"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    className="flex flex-col gap-5"
                  >
                    {/* Success banner */}
                    <div className="flex items-center gap-3 text-emerald-400 font-bold bg-emerald-500/10 py-4 px-5 rounded-2xl border border-emerald-500/20">
                      <CheckCircle2 size={20} className="drop-shadow-[0_0_8px_rgba(52,211,153,0.6)] flex-shrink-0" />
                      <div>
                        <p className="text-sm">Deployment Successful</p>
                        <p className="text-[11px] text-emerald-400/60 font-medium mt-0.5">Your site is live on the web</p>
                      </div>
                    </div>

                    {/* Live URL card */}
                    <div className="relative rounded-2xl border border-white/10 bg-black/50 px-5 py-4 group hover:border-violet-500/40 transition-colors shadow-inner">
                      <span className="absolute -top-[10px] left-4 text-[9px] font-bold uppercase tracking-[0.15em] text-white/40 bg-[#060608] px-2 border border-white/10 rounded-full">
                        Live URL
                      </span>
                      <div className="flex items-center justify-between mt-1 gap-3">
                        <span className="text-white/80 font-mono text-[13px] truncate">{displaySlug}</span>
                        <div className="flex gap-1 flex-shrink-0">
                          {liveUrl && (
                            <a
                              href={liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-emerald-400 hover:bg-white/5 transition-all"
                            >
                              <ExternalLink size={15} />
                            </a>
                          )}
                          <button
                            onClick={() => {
                              if (displaySlug) navigator.clipboard.writeText(displaySlug);
                              setCopiedToast(true);
                              setTimeout(() => setCopiedToast(false), 2200);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-violet-400 hover:bg-white/5 transition-all"
                          >
                            <Copy size={15} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Re-deploy option */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleDeploy}
                      disabled={isDeploying}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white/50 text-sm font-semibold hover:bg-white/[0.07] hover:text-white hover:border-white/20 transition-all"
                    >
                      {isDeploying ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                      {isDeploying ? "Redeploying…" : "Redeploy"}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Custom Domain ──────────────────────────────────────────── */}
            <div className="border-t border-white/[0.05] pt-7 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Connect Custom Domain</h3>

                {/* DNS badge — only shows when a domain is typed */}
                <AnimatePresence>
                  {hasDomain && (
                    <motion.div
                      initial={{ opacity: 0, x: 8, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 8, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25 shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Managed DNS – Connected
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  {hasDomain && (
                    <Link2 size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                  )}
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="e.g. mysite.com"
                    className={`w-full rounded-xl border bg-black/30 px-4 ${hasDomain ? "pl-9" : ""} py-2.5 text-sm text-white focus:outline-none focus:ring-1 transition-all placeholder:text-white/20 font-mono shadow-inner ${
                      hasDomain
                        ? "border-emerald-500/40 focus:border-emerald-500/60 focus:ring-emerald-500/20 shadow-[0_0_12px_rgba(52,211,153,0.08)]"
                        : "border-white/10 focus:border-violet-500/50 focus:ring-violet-500/20"
                    }`}
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${
                    hasDomain
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                      : "bg-white/[0.04] border-white/10 text-white/60 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {hasDomain ? "Update" : "Connect"}
                </motion.button>
              </div>

              {hasDomain && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-[11px] text-emerald-400/60 font-medium pl-0.5"
                >
                  Point your DNS A record to 76.76.21.21 to complete setup.
                </motion.p>
              )}
            </div>

            {/* ── Custom SEO note ────────────────────────────────────────── */}
            <div className="border-t border-white/[0.05] pt-6 mt-6 flex-shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mb-3">SEO Preview</h3>
              <div className="rounded-xl border border-white/[0.06] bg-black/30 p-4 space-y-1.5">
                <p className="text-[13px] text-blue-400 font-medium truncate">
                  {siteMeta.title || "Untitled Site"} — {customDomain || "lumina.app"}
                </p>
                <p className="text-[11px] text-emerald-600 font-mono truncate">
                  https://{customDomain || "lumina.app"}/
                </p>
                <p className="text-[11px] text-white/35 line-clamp-2 leading-relaxed">
                  {siteMeta.description || "No meta description set. Add one in the Identity panel above."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, LayoutDashboard, Settings2, MousePointerClick, ChevronRight, ChevronLeft, ChevronDown, Trash2, Globe } from "lucide-react";
import { LuminaSection, useLuminaStore } from "@/store/useLuminaStore";

// ─────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
      {children}
    </span>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-[10px] font-mono text-white/50 bg-black/40 px-1.5 py-0.5 rounded border border-white/8">
          {value}
          {unit ?? ""}
        </span>
      </div>
      <div className="relative h-4 flex items-center">
        <div className="absolute w-full h-0.5 rounded-full bg-white/10" />
        <motion.div
          className="absolute h-0.5 rounded-full bg-accent-glow"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-4 opacity-0 cursor-pointer"
        />
        {/* Thumb visual */}
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-white border-2 shadow-[0_0_6px_rgba(167,139,250,0.6)] pointer-events-none"
          style={{
            left: `calc(${((value - min) / (max - min)) * 100}% - 6px)`,
            borderColor: "#a78bfa",
          }}
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </div>
    </div>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm text-white/80 outline-none focus:border-accent-glow focus:ring-1 focus:ring-accent-glow transition-all appearance-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#0a0a0a]">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
        />
      </div>
    </div>
  );
}

function InputRow({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const base =
    "w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent-glow focus:ring-1 focus:ring-accent-glow transition-all placeholder:text-white/20 text-white/80";
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${base} resize-none min-h-[80px]`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-white/5" />;
}

// ─────────────────────────────────────────────
// Tab definitions
// ─────────────────────────────────────────────

type Tab = "style" | "layout" | "globalStyles" | "config";

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "style", label: "Style", Icon: Palette },
  { id: "layout", label: "Layout", Icon: LayoutDashboard },
  { id: "globalStyles", label: "Globals", Icon: Globe },
  { id: "config", label: "Config", Icon: Settings2 },
];

// ─────────────────────────────────────────────
// Tab content panels
// ─────────────────────────────────────────────

function StyleTab({ section }: { section: LuminaSection }) {
  const updateSection = useLuminaStore((state) => state.updateSection);
  const sections = useLuminaStore((state) => state.sections);
  const { id, props } = section;
  // Removed updateCanvasBackgroundForAllSections, moved to GlobalStylesTab

  const fontFam = String(props.typography?.fontFamily ?? "sans");
  const fontWeight = String(props.typography?.fontWeight ?? "normal");
  const textAlign = String(props.typography?.textAlign ?? "left");
  const fontSize = Number(props.typography?.fontSize ?? 16);
  const lineHeight = Number(props.typography?.lineHeight ?? 1.5);
  const letterSpacing = Number(props.typography?.letterSpacing ?? 0);
  const textColor = String(props.typography?.color ?? "#ffffff");

  const baseColor = String(props.baseColor ?? "#a78bfa");
  const sectionBgColor = String(props.visuals?.backgroundColor ?? "transparent");
  const contentBgColor = String(props.visuals?.cardBackgroundColor ?? "transparent");
  const bgType = String(props.visuals?.backgroundType ?? "solid");
  const blockType = String(props.components?.[0]?.type ?? section.type);
  const isHero = blockType === "HeroBlock";
  const isBlank = blockType === "BlankPageBlock";
  const defaultPaddingY = 100;
  const paddingY = Number(props.paddingY ?? defaultPaddingY);
  const paddingX = Number(props.layout?.paddingX ?? 32);
  const gap = Number(props.layout?.gap ?? 24);

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-5">
        <h4 className="text-white/80 text-[13px] font-bold tracking-wide mt-2">Typography</h4>

        <SelectRow
          label="text font"
          value={fontFam}
          options={[
            { label: "Sans Serif", value: "sans" },
            { label: "Serif", value: "serif" },
            { label: "Monospace", value: "mono" },
          ]}
          onChange={(v) => updateSection(id, { typography: { fontFamily: v } })}
        />

        <SelectRow
          label="text weight"
          value={fontWeight}
          options={[
            { label: "Normal", value: "normal" },
            { label: "Medium", value: "500" },
            { label: "Semibold", value: "600" },
            { label: "Bold", value: "bold" },
          ]}
          onChange={(v) => updateSection(id, { typography: { fontWeight: v } })}
        />

        <SelectRow
          label="text alignment"
          value={textAlign}
          options={[
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ]}
          onChange={(v) => updateSection(id, { typography: { textAlign: v } })}
        />

        <Divider />

        <SliderRow
          label="font size"
          value={fontSize}
          min={12}
          max={120}
          step={1}
          unit="px"
          onChange={(v) => updateSection(id, { typography: { fontSize: v } })}
        />

        <SliderRow
          label="line height"
          value={lineHeight}
          min={1}
          max={3}
          step={0.1}
          unit="x"
          onChange={(v) => updateSection(id, { typography: { lineHeight: v } })}
        />

        <SliderRow
          label="letter spacing"
          value={letterSpacing}
          min={-5}
          max={20}
          step={0.5}
          unit="px"
          onChange={(v) => updateSection(id, { typography: { letterSpacing: v } })}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>text color</Label>
          </div>
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-1.5 transition-colors focus-within:border-accent-glow focus-within:ring-1 focus-within:ring-accent-glow">
            <div className="relative shrink-0 w-8 h-8 rounded-lg overflow-hidden shadow-inner ring-1 ring-white/20 ring-inset">
              <input
                type="color"
                value={textColor}
                onChange={(e) => updateSection(id, { typography: { color: e.target.value } })}
                className="w-full h-full p-0 cursor-pointer bg-transparent border-0 outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                title="Color picker"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: `0 0 12px ${textColor}60` }}
              />
            </div>
            <input
              type="text"
              value={textColor.toUpperCase()}
              onChange={(e) => updateSection(id, { typography: { color: e.target.value } })}
              className="w-full bg-transparent border-0 px-2 py-1 flex-1 text-xs font-mono uppercase outline-none text-white/80 focus:text-white"
            />
            <button
              type="button"
              onClick={() => updateSection(id, { typography: { color: "#ffffff" } })}
              className="mr-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 mt-2 border-t border-white/5 pt-6">
        <h4 className="text-white/80 text-[13px] font-bold tracking-wide">Backgrounds & Colors</h4>

        {/* Removed "Background for all section" block */}

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>section background</Label>
          </div>
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-1.5 transition-colors focus-within:border-accent-glow focus-within:ring-1 focus-within:ring-accent-glow">
            <div className="relative shrink-0 w-8 h-8 rounded-lg overflow-hidden shadow-inner ring-1 ring-white/20 ring-inset">
              <input
                type="color"
                value={sectionBgColor === "transparent" ? "#000000" : sectionBgColor}
                onChange={(e) => updateSection(id, { visuals: { backgroundColor: e.target.value } })}
                className="w-full h-full p-0 cursor-pointer bg-transparent border-0 outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                title="Color picker"
              />
              <div className="absolute inset-0 pointer-events-none" />
            </div>
            <input
              type="text"
              value={sectionBgColor.toUpperCase()}
              onChange={(e) => updateSection(id, { visuals: { backgroundColor: e.target.value } })}
              className="w-full bg-transparent border-0 px-2 py-1 flex-1 text-xs font-mono uppercase outline-none text-white/80 focus:text-white"
              placeholder="transparent"
            />
            <button
              type="button"
              onClick={() =>
                updateSection(id, {
                  visuals: {
                    backgroundColor: "transparent",
                    backgroundType: "solid",
                  },
                })
              }
              className="mr-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Accent Color</Label>
          </div>
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-1.5 transition-colors focus-within:border-accent-glow focus-within:ring-1 focus-within:ring-accent-glow">
            <div className="relative shrink-0 w-8 h-8 rounded-lg overflow-hidden shadow-inner ring-1 ring-white/20 ring-inset">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => updateSection(id, { baseColor: e.target.value })}
                className="w-full h-full p-0 cursor-pointer bg-transparent border-0 outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                title="Color picker"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: `0 0 12px ${baseColor}60` }}
              />
            </div>
            <input
              type="text"
              value={baseColor.toUpperCase()}
              onChange={(e) => updateSection(id, { baseColor: e.target.value })}
              className="w-full bg-transparent border-0 px-2 py-1 flex-1 text-xs font-mono uppercase outline-none text-white/80 focus:text-white"
            />
            <button
              type="button"
              onClick={() => updateSection(id, { baseColor: "#a78bfa" })}
              className="mr-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>content background</Label>
          </div>
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-1.5 transition-colors focus-within:border-accent-glow focus-within:ring-1 focus-within:ring-accent-glow">
            <div className="relative shrink-0 w-8 h-8 rounded-lg overflow-hidden shadow-inner ring-1 ring-white/20 ring-inset">
              <input
                type="color"
                value={contentBgColor === "transparent" ? "#000000" : contentBgColor}
                onChange={(e) => updateSection(id, { visuals: { cardBackgroundColor: e.target.value } })}
                className="w-full h-full p-0 cursor-pointer bg-transparent border-0 outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                title="Color picker"
              />
              <div className="absolute inset-0 pointer-events-none" />
            </div>
            <input
              type="text"
              value={contentBgColor.toUpperCase()}
              onChange={(e) => updateSection(id, { visuals: { cardBackgroundColor: e.target.value } })}
              className="w-full bg-transparent border-0 px-2 py-1 flex-1 text-xs font-mono uppercase outline-none text-white/80 focus:text-white"
              placeholder="transparent"
            />
            <button
              type="button"
              onClick={() => updateSection(id, { visuals: { cardBackgroundColor: "transparent" } })}
              className="mr-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <SelectRow
          label="background type"
          value={bgType}
          options={[
            { label: "Solid Color", value: "solid" },
            { label: "Subtle Gradient", value: "gradient" },
            { label: "Dot Pattern", value: "pattern" },
          ]}
          onChange={(v) => updateSection(id, { visuals: { backgroundType: v } })}
        />

        {/* Spacer at the bottom of Style tab */}
        <div className="h-20" />
      </div>
    </div>
  );
}


function LayoutTab({ section }: { section: LuminaSection }) {
  const { updateSection } = useLuminaStore();
  const viewMode = useLuminaStore((s) => s.viewMode);
  const { id, props } = section;

  // ── Breakpoint state — auto-follows editor viewMode ──────────────────────
  const [activeBreakpoint, setActiveBreakpoint] = React.useState<"desktop" | "tablet" | "mobile">(viewMode);
  React.useEffect(() => { setActiveBreakpoint(viewMode); }, [viewMode]);

  // Base (desktop) values from flat props
  const defaultPaddingY = 100;
  const basePaddingY = Number(props.paddingY ?? defaultPaddingY);
  const basePaddingX = Number(props.layout?.paddingX ?? 32);
  const baseGap = Number(props.layout?.gap ?? 24);

  // Per-breakpoint overrides
  const responsiveProps = (props.responsive ?? {}) as Record<string, { paddingY?: number; paddingX?: number; gap?: number } | undefined>;
  const bpOverrides = responsiveProps[activeBreakpoint] ?? {};

  // Resolved display values (override takes precedence; desktop falls back to flat props)
  const paddingY = activeBreakpoint === "desktop" ? basePaddingY : (bpOverrides.paddingY ?? basePaddingY);
  const paddingX = activeBreakpoint === "desktop" ? basePaddingX : (bpOverrides.paddingX ?? basePaddingX);
  const gap = activeBreakpoint === "desktop" ? baseGap : (bpOverrides.gap ?? baseGap);

  const isOverridden = (key: "paddingY" | "paddingX" | "gap") =>
    activeBreakpoint !== "desktop" && bpOverrides[key] !== undefined;

  // Write helpers
  const writePaddingY = (v: number) => {
    if (activeBreakpoint === "desktop") {
      updateSection(id, { paddingY: v });
    } else {
      updateSection(id, { responsive: { ...responsiveProps, [activeBreakpoint]: { ...bpOverrides, paddingY: v } } });
    }
  };
  const writePaddingX = (v: number) => {
    if (activeBreakpoint === "desktop") {
      updateSection(id, { layout: { paddingX: v } });
    } else {
      updateSection(id, { responsive: { ...responsiveProps, [activeBreakpoint]: { ...bpOverrides, paddingX: v } } });
    }
  };
  const writeGap = (v: number) => {
    if (activeBreakpoint === "desktop") {
      updateSection(id, { layout: { gap: v } });
    } else {
      updateSection(id, { responsive: { ...responsiveProps, [activeBreakpoint]: { ...bpOverrides, gap: v } } });
    }
  };
  const clearOverride = (key: "paddingY" | "paddingX" | "gap") => {
    const next = { ...bpOverrides };
    delete next[key];
    updateSection(id, { responsive: { ...responsiveProps, [activeBreakpoint]: next } });
  };

  const borderRadius = Number(props.visuals?.borderRadius ?? 24);
  const borderWeight = Number(props.visuals?.borderWeight ?? 1);
  const opacity = Number(props.visuals?.opacity ?? 100);
  const shadow = String(props.visuals?.shadow ?? "none");

  const BREAKPOINTS: { key: "mobile" | "tablet" | "desktop"; icon: string }[] = [
    { key: "mobile", icon: "📱" },
    { key: "tablet", icon: "⬜" },
    { key: "desktop", icon: "🖥" },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">

      {/* ── Breakpoint Switcher ── */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center justify-between">
          <Label>Breakpoint</Label>
          {activeBreakpoint !== "desktop" && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
              Editing {activeBreakpoint}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {BREAKPOINTS.map(({ key, icon }) => {
            const bpRes = responsiveProps[key] ?? {};
            const hasOverrides = key !== "desktop" && Object.keys(bpRes).length > 0;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveBreakpoint(key)}
                className={`relative flex flex-col items-center gap-1 py-2.5 rounded-xl border text-[10px] font-semibold capitalize transition-all
                  ${activeBreakpoint === key
                    ? "border-violet-500/60 bg-violet-500/15 text-white shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                    : "border-white/8 bg-black/20 text-white/40 hover:text-white/70 hover:border-white/20"
                  }`}
              >
                <span className="text-base leading-none">{icon}</span>
                <span>{key}</span>
                {hasOverrides && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-400" title="Has overrides" />
                )}
              </button>
            );
          })}
        </div>
        {activeBreakpoint !== "desktop" && (
          <p className="text-[10px] text-white/30 leading-snug mt-0.5">
            Values here override desktop defaults for{" "}
            <span className="text-white/50">{activeBreakpoint}</span> devices.
          </p>
        )}
      </div>

      <Divider />

      {/* ── Spacing sliders ── */}
      <div className="flex flex-col gap-4">
        <h4 className="text-white/80 text-[13px] font-bold tracking-wide">Paddings</h4>

        {/* Vertical Padding */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
              Vertical Padding
              {isOverridden("paddingY") && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </span>
            {isOverridden("paddingY") && (
              <button type="button" onClick={() => clearOverride("paddingY")} className="text-[9px] text-white/30 hover:text-violet-400 transition-colors">↩ reset</button>
            )}
          </div>
          <SliderRow label="" value={paddingY} min={1} max={100} step={1} unit="vh" onChange={writePaddingY} />
        </div>

        {/* Horizontal Padding */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
              Horizontal Padding
              {isOverridden("paddingX") && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </span>
            {isOverridden("paddingX") && (
              <button type="button" onClick={() => clearOverride("paddingX")} className="text-[9px] text-white/30 hover:text-violet-400 transition-colors">↩ reset</button>
            )}
          </div>
          <SliderRow label="" value={paddingX} min={0} max={128} step={8} unit="px" onChange={writePaddingX} />
        </div>

        {/* Gap */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
              Elemental Gaps
              {isOverridden("gap") && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </span>
            {isOverridden("gap") && (
              <button type="button" onClick={() => clearOverride("gap")} className="text-[9px] text-white/30 hover:text-violet-400 transition-colors">↩ reset</button>
            )}
          </div>
          <SliderRow label="" value={gap} min={0} max={64} step={4} unit="px" onChange={writeGap} />
        </div>
      </div>

      <>
        <Divider />
        <div className="flex flex-col gap-5">
          <h4 className="text-white/80 text-[13px] font-bold tracking-wide">Advanced Layout</h4>
          <SelectRow
            label="Position"
            value={String(props.layout?.position ?? "relative")}
            options={[{ label: "Relative", value: "relative" }, { label: "Absolute", value: "absolute" }, { label: "Fixed", value: "fixed" }, { label: "Static", value: "static" }]}
            onChange={(v) => updateSection(id, { layout: { ...props.layout, position: v as any } })}
          />
          <SelectRow
            label="Direction"
            value={String(props.layout?.flexDirection ?? "column")}
            options={[{ label: "Row", value: "row" }, { label: "Row Reverse", value: "row-reverse" }, { label: "Column", value: "column" }, { label: "Column Reverse", value: "column-reverse" }]}
            onChange={(v) => updateSection(id, { layout: { ...props.layout, flexDirection: v as any } })}
          />
          <SelectRow
            label="Justify Content"
            value={String(props.layout?.justifyContent ?? "center")}
            options={[{ label: "Start", value: "flex-start" }, { label: "Center", value: "center" }, { label: "End", value: "flex-end" }, { label: "Space Between", value: "space-between" }, { label: "Space Around", value: "space-around" }]}
            onChange={(v) => updateSection(id, { layout: { ...props.layout, justifyContent: v } })}
          />
          <SelectRow
            label="Align Items"
            value={String(props.layout?.alignItems ?? "center")}
            options={[{ label: "Start", value: "flex-start" }, { label: "Center", value: "center" }, { label: "End", value: "flex-end" }, { label: "Stretch", value: "stretch" }]}
            onChange={(v) => updateSection(id, { layout: { ...props.layout, alignItems: v } })}
          />
        </div>
      </>

      <>
        <Divider />
        <div className="flex flex-col gap-5">
          <h4 className="text-white/80 text-[13px] font-bold tracking-wide">Borders</h4>
          <SliderRow label="Border Radius" value={borderRadius} min={0} max={48} step={2} unit="px" onChange={(v) => updateSection(id, { visuals: { borderRadius: v } })} />
          <SliderRow label="Border Weight" value={borderWeight} min={0} max={12} step={1} unit="px" onChange={(v) => updateSection(id, { visuals: { borderWeight: v } })} />
          <SliderRow label="Opacity" value={opacity} min={0} max={100} step={5} unit="%" onChange={(v) => updateSection(id, { visuals: { opacity: v } })} />
          <SelectRow
            label="Box Shadow"
            value={shadow}
            options={[
              { label: "None", value: "none" },
              { label: "Small", value: "sm" },
              { label: "Medium", value: "md" },
              { label: "Large", value: "lg" },
              { label: "Glow", value: "glow" },
            ]}
            onChange={(v) => updateSection(id, { visuals: { shadow: v } })}
          />
        </div>
      </>
    </div>
  );
}

function ConfigTab({ section }: { section: LuminaSection }) {
  const { updateSection } = useLuminaStore();
  const { id, type, props } = section;
  const blockType = String(props.components?.[0]?.type ?? type);
  const isBlank = blockType === "BlankPageBlock";

  const getTextProp = (key: string, fallback = "") => {
    const top = props[key];
    if (typeof top === "string") return top;
    return fallback;
  };

  const updateTextProp = (key: string, value: string) => {
    updateSection(id, { [key]: value });
  };

  const getArrayProp = <T,>(key: string, fallback: T[]): T[] => {
    const value = props[key];
    return Array.isArray(value) ? (value as T[]) : fallback;
  };

  const updateArrayItem = (
    key: string,
    index: number,
    patch: Record<string, unknown>,
    fallbackItems: Record<string, unknown>[]
  ) => {
    const current = getArrayProp<Record<string, unknown>>(key, fallbackItems);
    const next = current.map((item) => ({ ...item }));
    if (!next[index]) {
      next[index] = { ...(fallbackItems[index] || {}) };
    }
    next[index] = { ...(next[index] || {}), ...patch };
    updateSection(id, { [key]: next });
  };

  const updateStringArrayFromLines = (key: string, value: string) => {
    const lines = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    updateSection(id, { [key]: lines });
  };

  const defaultFeatures = [
    { title: "Lightning Fast", desc: "Optimized for speed and performance." },
    { title: "Enterprise Security", desc: "Bank-grade encryption by default." },
    { title: "AI Powered", desc: "Smart contextual components." },
    { title: "Developer First", desc: "Extensible API and webhooks." },
  ];

  const defaultTiers = [
    {
      name: "Hobby",
      price: "$0",
      desc: "Perfect for side projects and learning.",
      button: "Start Free",
      features: ["Up to 3 projects", "Basic analytics", "Community support"],
    },
    {
      name: "Pro",
      price: "$29",
      desc: "For professionals and small teams ready to scale.",
      button: "Go Pro",
      features: ["Unlimited projects", "Advanced analytics", "24/7 priority support", "Custom domains"],
    },
  ];

  const defaultTestimonials = [
    { name: "Sarah Connor", role: "CTO @ Skynet", desc: "This has completely changed how we build systems. The speed is unbelievable." },
    { name: "John Wick", role: "Freelancer", desc: "Clean, precise, and works exactly when I need it most." },
    { name: "Ellen Ripley", role: "Engineer", desc: "Surviving the modern web ecosystem is tough, but these components make it a breeze." },
  ];

  const defaultStats = [
    { value: "100+", label: "Premium Blocks" },
    { value: "0ms", label: "Runtime Overhead" },
    { value: "99%", label: "Lighthouse Score" },
    { value: "24/7", label: "Expert Support" },
  ];

  const defaultFaqs = [
    { q: "How does the pricing work?", a: "We offer a flat monthly rate with no hidden fees or usage caps. Cancel anytime." },
    { q: "Can I host this on my own servers?", a: "Yes, our enterprise plan includes on-premise deployment options and priority support." },
    { q: "What integrations do you support?", a: "We integrate seamlessly with Next.js, Vercel, Stripe, and over 100+ other modern tools and APIs." },
    { q: "Is there a free trial available?", a: "Absolutely. You can start building for free and only upgrade when you go to production." },
  ];

  const defaultTeam = [
    { name: "Guillermo Rauch", role: "CEO" },
    { name: "Lee Robinson", role: "VP of Developer Experience" },
    { name: "Delba de Oliveira", role: "Developer Advocate" },
    { name: "Jared Palmer", role: "VP of Engineering" },
  ];

  const defaultSteps = [
    { num: "01", title: "Connect your repository", desc: "Import from GitHub, GitLab, or Bitbucket." },
    { num: "02", title: "Configure your build", desc: "Set environment variables and build commands." },
    { num: "03", title: "Deploy to the edge", desc: "Your app is live on a global CDN in seconds." },
    { num: "04", title: "Iterate with confidence", desc: "Preview deployments, instant rollbacks, and analytics." },
  ];

  const defaultLinks = [
    { title: "Product", items: ["Features", "Pricing", "Changelog", "Roadmap"] },
    { title: "Company", items: ["About", "Blog", "Careers", "Press Kit"] },
    { title: "Legal", items: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
  ];

  const defaultContactInfo = [
    { label: "Email", value: "hello@lumina.dev" },
    { label: "Phone", value: "+1 (555) 000-0000" },
    { label: "Office", value: "San Francisco, CA" },
  ];

  const defaultDashboardNav = [
    { label: "Overview" },
    { label: "Customers" },
    { label: "Inbox" },
    { label: "Settings" },
  ];

  const defaultDashboardStats = [
    { label: "Total Revenue", value: "$128,430", change: "+12.4%" },
    { label: "Active Users", value: "24,801", change: "+5.1%" },
    { label: "Churn Rate", value: "1.8%", change: "-0.3%" },
  ];

  // Block-specific fields map
  const blockSpecificFields: Record<string, React.ReactNode> = {
    HeroBlock: (
      <>
        <InputRow
          label="Eyebrow Text"
          value={getTextProp("eyebrowText", "Introducing Lumina Pro")}
          onChange={(v) => updateTextProp("eyebrowText", v)}
          placeholder="Top badge text..."
        />
        <InputRow
          label="Primary Button"
          value={getTextProp("primaryButtonText", "Start Building Free")}
          onChange={(v) => updateTextProp("primaryButtonText", v)}
          placeholder="Primary CTA label..."
        />
        <InputRow
          label="Secondary Button"
          value={getTextProp("secondaryButtonText", "View Components")}
          onChange={(v) => updateTextProp("secondaryButtonText", v)}
          placeholder="Secondary CTA label..."
        />
      </>
    ),
    FeaturesBlock: (
      <>
        {defaultFeatures.map((feature, i) => {
          const features = getArrayProp<Record<string, unknown>>("features", defaultFeatures);
          const current = features[i] || feature;
          return (
            <div key={`feature-${i}`} className="flex flex-col gap-2">
              <Label>{`Feature ${i + 1}`}</Label>
              <InputRow
                label="Title"
                value={String(current.title ?? feature.title)}
                onChange={(v) => updateArrayItem("features", i, { title: v }, defaultFeatures)}
                placeholder="Feature title..."
              />
              <InputRow
                label="Description"
                value={String(current.desc ?? feature.desc)}
                onChange={(v) => updateArrayItem("features", i, { desc: v }, defaultFeatures)}
                placeholder="Feature description..."
                multiline
              />
            </div>
          );
        })}
      </>
    ),
    CTABlock: (
      <InputRow
        label="Button Text"
        value={(props.buttonText as string) ?? "Start Building Free"}
        onChange={(v) => updateSection(id, { buttonText: v })}
        placeholder="CTA button label..."
      />
    ),
    PricingBlock: (
      <>
        <InputRow
          label="Badge Label"
          value={(props.badgeLabel as string) ?? "Most Popular"}
          onChange={(v) => updateSection(id, { badgeLabel: v })}
          placeholder="Badge text..."
        />
        {defaultTiers.map((tier, i) => {
          const tiers = getArrayProp<Record<string, unknown>>("tiers", defaultTiers);
          const current = tiers[i] || tier;
          const features = Array.isArray(current.features) ? (current.features as string[]) : tier.features;
          return (
            <div key={`tier-${i}`} className="flex flex-col gap-2">
              <Label>{`Tier ${i + 1}`}</Label>
              <InputRow
                label="Name"
                value={String(current.name ?? tier.name)}
                onChange={(v) => updateArrayItem("tiers", i, { name: v }, defaultTiers)}
                placeholder="Plan name..."
              />
              <InputRow
                label="Price"
                value={String(current.price ?? tier.price)}
                onChange={(v) => updateArrayItem("tiers", i, { price: v }, defaultTiers)}
                placeholder="Plan price..."
              />
              <InputRow
                label="Description"
                value={String(current.desc ?? tier.desc)}
                onChange={(v) => updateArrayItem("tiers", i, { desc: v }, defaultTiers)}
                placeholder="Plan description..."
                multiline
              />
              <InputRow
                label="Button"
                value={String(current.button ?? tier.button)}
                onChange={(v) => updateArrayItem("tiers", i, { button: v }, defaultTiers)}
                placeholder="Button label..."
              />
              <InputRow
                label="Features (one per line)"
                value={features.join("\n")}
                onChange={(v) => updateArrayItem("tiers", i, { features: v.split("\n").map((line) => line.trim()).filter(Boolean) }, defaultTiers)}
                placeholder="Feature list..."
                multiline
              />
            </div>
          );
        })}
      </>
    ),
    TestimonialsBlock: (
      <>
        {defaultTestimonials.map((testimonial, i) => {
          const testimonials = getArrayProp<Record<string, unknown>>("testimonials", defaultTestimonials);
          const current = testimonials[i] || testimonial;
          return (
            <div key={`testimonial-${i}`} className="flex flex-col gap-2">
              <Label>{`Testimonial ${i + 1}`}</Label>
              <InputRow
                label="Name"
                value={String(current.name ?? testimonial.name)}
                onChange={(v) => updateArrayItem("testimonials", i, { name: v }, defaultTestimonials)}
                placeholder="Person name..."
              />
              <InputRow
                label="Role"
                value={String(current.role ?? testimonial.role)}
                onChange={(v) => updateArrayItem("testimonials", i, { role: v }, defaultTestimonials)}
                placeholder="Person role..."
              />
              <InputRow
                label="Quote"
                value={String(current.desc ?? testimonial.desc)}
                onChange={(v) => updateArrayItem("testimonials", i, { desc: v }, defaultTestimonials)}
                placeholder="Customer quote..."
                multiline
              />
            </div>
          );
        })}
      </>
    ),
    StatsBlock: (
      <>
        {defaultStats.map((stat, i) => {
          const stats = getArrayProp<Record<string, unknown>>("stats", defaultStats);
          const current = stats[i] || stat;
          return (
            <div key={`stat-${i}`} className="flex flex-col gap-2">
              <Label>{`Stat ${i + 1}`}</Label>
              <InputRow
                label="Value"
                value={String(current.value ?? stat.value)}
                onChange={(v) => updateArrayItem("stats", i, { value: v }, defaultStats)}
                placeholder="Stat value..."
              />
              <InputRow
                label="Label"
                value={String(current.label ?? stat.label)}
                onChange={(v) => updateArrayItem("stats", i, { label: v }, defaultStats)}
                placeholder="Stat label..."
              />
            </div>
          );
        })}
      </>
    ),
    FAQBlock: (
      <>
        <InputRow
          label="Description"
          value={getTextProp("description", "Everything you need to know about the product and billing.")}
          onChange={(v) => updateTextProp("description", v)}
          placeholder="FAQ description..."
          multiline
        />
        {defaultFaqs.map((faq, i) => {
          const faqs = getArrayProp<Record<string, unknown>>("faqs", defaultFaqs);
          const current = faqs[i] || faq;
          return (
            <div key={`faq-${i}`} className="flex flex-col gap-2">
              <Label>{`FAQ ${i + 1}`}</Label>
              <InputRow
                label="Question"
                value={String(current.q ?? faq.q)}
                onChange={(v) => updateArrayItem("faqs", i, { q: v }, defaultFaqs)}
                placeholder="Question..."
              />
              <InputRow
                label="Answer"
                value={String(current.a ?? faq.a)}
                onChange={(v) => updateArrayItem("faqs", i, { a: v }, defaultFaqs)}
                placeholder="Answer..."
                multiline
              />
            </div>
          );
        })}
      </>
    ),
    TeamBlock: (
      <>
        <InputRow
          label="Description"
          value={getTextProp("description", "Passionate individuals obsessed with building the best developer experience.")}
          onChange={(v) => updateTextProp("description", v)}
          placeholder="Team section description..."
          multiline
        />
        {defaultTeam.map((member, i) => {
          const team = getArrayProp<Record<string, unknown>>("team", defaultTeam);
          const current = team[i] || member;
          return (
            <div key={`member-${i}`} className="flex flex-col gap-2">
              <Label>{`Member ${i + 1}`}</Label>
              <InputRow
                label="Name"
                value={String(current.name ?? member.name)}
                onChange={(v) => updateArrayItem("team", i, { name: v }, defaultTeam)}
                placeholder="Name..."
              />
              <InputRow
                label="Role"
                value={String(current.role ?? member.role)}
                onChange={(v) => updateArrayItem("team", i, { role: v }, defaultTeam)}
                placeholder="Role..."
              />
            </div>
          );
        })}
      </>
    ),
    ContactBlock: (
      <>
        <InputRow
          label="Description"
          value={getTextProp("description", "Have a project in mind? Our team is ready to help.")}
          onChange={(v) => updateTextProp("description", v)}
          placeholder="Contact description..."
          multiline
        />
        {defaultContactInfo.map((entry, i) => {
          const contactInfo = getArrayProp<Record<string, unknown>>("contactInfo", defaultContactInfo);
          const current = contactInfo[i] || entry;
          return (
            <div key={`contact-${i}`} className="flex flex-col gap-2">
              <Label>{`Contact Row ${i + 1}`}</Label>
              <InputRow
                label="Label"
                value={String(current.label ?? entry.label)}
                onChange={(v) => updateArrayItem("contactInfo", i, { label: v }, defaultContactInfo)}
                placeholder="Label..."
              />
              <InputRow
                label="Value"
                value={String(current.value ?? entry.value)}
                onChange={(v) => updateArrayItem("contactInfo", i, { value: v }, defaultContactInfo)}
                placeholder="Value..."
              />
            </div>
          );
        })}
      </>
    ),
    FooterBlock: (
      <>
        <InputRow
          label="Description"
          value={getTextProp("description", "The modern platform for building premium web applications.")}
          onChange={(v) => updateTextProp("description", v)}
          placeholder="Footer description..."
          multiline
        />
        <InputRow
          label="Bottom Text"
          value={getTextProp("bottomText", "")}
          onChange={(v) => updateTextProp("bottomText", v)}
          placeholder="Copyright line..."
        />
        {defaultLinks.map((group, i) => {
          const links = getArrayProp<Record<string, unknown>>("links", defaultLinks);
          const current = links[i] || group;
          const items = Array.isArray(current.items) ? (current.items as string[]) : group.items;
          return (
            <div key={`footer-link-group-${i}`} className="flex flex-col gap-2">
              <Label>{`Link Group ${i + 1}`}</Label>
              <InputRow
                label="Group Title"
                value={String(current.title ?? group.title)}
                onChange={(v) => updateArrayItem("links", i, { title: v }, defaultLinks)}
                placeholder="Group title..."
              />
              <InputRow
                label="Items (one per line)"
                value={items.join("\n")}
                onChange={(v) => updateArrayItem("links", i, { items: v.split("\n").map((line) => line.trim()).filter(Boolean) }, defaultLinks)}
                placeholder="Link items..."
                multiline
              />
            </div>
          );
        })}
      </>
    ),
    MarqueeBlock: (
      <InputRow
        label="Logos (one per line)"
        value={getArrayProp<string>("logos", ["Vercel", "Linear", "Notion", "Stripe"]).join("\n")}
        onChange={(v) => updateStringArrayFromLines("logos", v)}
        placeholder="Logo names..."
        multiline
      />
    ),
    CodeTerminalBlock: (
      <>
        <InputRow
          label="File Name"
          value={getTextProp("fileName", "server.ts - Lumina")}
          onChange={(v) => updateTextProp("fileName", v)}
          placeholder="Editor file name..."
        />
        <InputRow
          label="Code"
          value={getTextProp("code", "")}
          onChange={(v) => updateTextProp("code", v)}
          placeholder="Code snippet..."
          multiline
        />
      </>
    ),
    DashboardMockupBlock: (
      <>
        {defaultDashboardNav.map((item, i) => {
          const nav = getArrayProp<Record<string, unknown>>("dashboardNav", defaultDashboardNav);
          const current = nav[i] || item;
          return (
            <InputRow
              key={`dashboard-nav-${i}`}
              label={`Nav ${i + 1}`}
              value={String(current.label ?? item.label)}
              onChange={(v) => updateArrayItem("dashboardNav", i, { label: v }, defaultDashboardNav)}
              placeholder="Navigation label..."
            />
          );
        })}
        {defaultDashboardStats.map((stat, i) => {
          const stats = getArrayProp<Record<string, unknown>>("dashboardStats", defaultDashboardStats);
          const current = stats[i] || stat;
          return (
            <div key={`dashboard-stat-${i}`} className="flex flex-col gap-2">
              <Label>{`Dashboard Stat ${i + 1}`}</Label>
              <InputRow
                label="Label"
                value={String(current.label ?? stat.label)}
                onChange={(v) => updateArrayItem("dashboardStats", i, { label: v }, defaultDashboardStats)}
                placeholder="Stat label..."
              />
              <InputRow
                label="Value"
                value={String(current.value ?? stat.value)}
                onChange={(v) => updateArrayItem("dashboardStats", i, { value: v }, defaultDashboardStats)}
                placeholder="Stat value..."
              />
              <InputRow
                label="Change"
                value={String(current.change ?? stat.change)}
                onChange={(v) => updateArrayItem("dashboardStats", i, { change: v }, defaultDashboardStats)}
                placeholder="Change label..."
              />
            </div>
          );
        })}
      </>
    ),
    StepsBlock: (
      <>
        {defaultSteps.map((step, i) => {
          const steps = getArrayProp<Record<string, unknown>>("steps", defaultSteps);
          const current = steps[i] || step;
          return (
            <div key={`step-${i}`} className="flex flex-col gap-2">
              <Label>{`Step ${i + 1}`}</Label>
              <InputRow
                label="Number"
                value={String(current.num ?? step.num)}
                onChange={(v) => updateArrayItem("steps", i, { num: v }, defaultSteps)}
                placeholder="Step number..."
              />
              <InputRow
                label="Title"
                value={String(current.title ?? step.title)}
                onChange={(v) => updateArrayItem("steps", i, { title: v }, defaultSteps)}
                placeholder="Step title..."
              />
              <InputRow
                label="Description"
                value={String(current.desc ?? step.desc)}
                onChange={(v) => updateArrayItem("steps", i, { desc: v }, defaultSteps)}
                placeholder="Step description..."
                multiline
              />
            </div>
          );
        })}
      </>
    ),
  };

  return (
    <div className="flex flex-col gap-5">
      <InputRow
        label="Title"
        value={getTextProp("title", "")}
        onChange={(v) => updateTextProp("title", v)}
        placeholder="Section title..."
      />

      {!isBlank && (
        <InputRow
          label="Subtitle"
          value={getTextProp("subtitle", "")}
          onChange={(v) => updateTextProp("subtitle", v)}
          placeholder="Section subtitle..."
          multiline
        />
      )}

      {/* Block-type specific */}
      {blockSpecificFields[blockType] && (
        <>
          <Divider />
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-accent-glow/70">
                {blockType}-specific
              </span>
              <div className="flex-1 h-px bg-accent-glow/10" />
            </div>
            {blockSpecificFields[blockType]}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main PropertyInspector
// ─────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    x: dir * 20,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    x: dir * -20,
    opacity: 0,
    filter: "blur(4px)",
  }),
};

function FreeformComponentConfig({ element, updateProp, updateFreeformElement, sectionId }: any) {
  const getArrayProp = (key: string, defaultArray: any[]) => {
    return Array.isArray(element.props[key]) ? element.props[key] : defaultArray;
  };
  const updateArrayItem = (key: string, index: number, updates: any, defaultArray: any[]) => {
    const arr = getArrayProp(key, defaultArray);
    const newArr = [...arr];
    newArr[index] = { ...newArr[index], ...updates };
    updateProp(key, newArr);
  };
  const addArrayItem = (key: string, newItem: any, defaultArray: any[]) => {
    const arr = [...getArrayProp(key, defaultArray), newItem];
    updateProp(key, arr);
  };
  const removeArrayItem = (key: string, index: number, defaultArray: any[]) => {
    const arr = [...getArrayProp(key, defaultArray)];
    arr.splice(index, 1);
    updateProp(key, arr);
  };

  switch (element.type) {
    case "Navbar": {
      const defaultLinks = ["Home", "Features", "Pricing"];
      const links = getArrayProp("links", defaultLinks);
      return (
        <div className="flex flex-col gap-3">
          <InputRow label="Brand Name" value={element.props.brand || "Brand"} onChange={(v) => updateProp("brand", v)} />
          <InputRow label="Button Text" value={element.props.buttonText || "Get Started"} onChange={(v) => updateProp("buttonText", v)} />
          <div className="flex flex-col gap-2">
            <Label>Navigation Links</Label>
            {links.map((link: string, i: number) => (
              <div key={i} className="flex gap-2">
                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg px-2 text-xs text-white" value={link} onChange={(e) => {
                  const newLinks = [...links];
                  newLinks[i] = e.target.value;
                  updateProp("links", newLinks);
                }} />
                <button type="button" onClick={() => removeArrayItem("links", i, defaultLinks)} className="text-red-400 font-bold px-2">X</button>
              </div>
            ))}
            <button type="button" onClick={() => {
              const newLinks = [...links, "New Link"];
              updateProp("links", newLinks);
            }} className="py-2 mt-1 text-xs font-semibold bg-white/10 text-white rounded-lg hover:bg-white/20">Add Link</button>
          </div>
        </div>
      );
    }
    case "PricingCard":
      return (
        <div className="flex flex-col gap-3">
          <InputRow label="Badge" value={element.props.badge || "Pro Plan"} onChange={(v) => updateProp("badge", v)} />
          <InputRow label="Price" value={element.props.price || "$29"} onChange={(v) => updateProp("price", v)} />
          <InputRow label="Period" value={element.props.period || "/mo"} onChange={(v) => updateProp("period", v)} />
          <InputRow label="Description" value={element.props.description || "Everything you need to launch your next big idea."} onChange={(v) => updateProp("description", v)} multiline />
          <InputRow label="Button Text" value={element.props.buttonText || "Upgrade Now"} onChange={(v) => updateProp("buttonText", v)} />
        </div>
      );
    case "Timeline": {
      const defaultTimeline = [{ title: "Project Initiated", date: "Q1 2024" }, { title: "Beta Launch", date: "Q2 2024" }];
      const items = getArrayProp("timelineItems", defaultTimeline);
      return (
        <div className="flex flex-col gap-3">
          {items.map((item: any, i: number) => (
            <div key={i} className="flex flex-col gap-2 p-2 border border-white/10 rounded-lg">
              <div className="flex justify-between items-center"><Label>Event {i + 1}</Label><button type="button" onClick={() => removeArrayItem("timelineItems", i, defaultTimeline)} className="text-red-400 text-xs">Remove</button></div>
              <InputRow label="Title" value={item.title} onChange={(v) => updateArrayItem("timelineItems", i, { title: v }, defaultTimeline)} />
              <InputRow label="Date" value={item.date} onChange={(v) => updateArrayItem("timelineItems", i, { date: v }, defaultTimeline)} />
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("timelineItems", { title: "New Event", date: "TBD" }, defaultTimeline)} className="py-2 mt-2 w-full text-xs font-semibold bg-white/10 text-white rounded-lg hover:bg-white/20 transition">Add Timeline Event</button>
        </div>
      );
    }
    case "WeatherWidget": return <div className="flex flex-col gap-3"><InputRow label="Heading" value={element.props.heading || "Today"} onChange={(v) => updateProp("heading", v)} /><InputRow label="Temperature" value={element.props.temp || "72°"} onChange={(v) => updateProp("temp", v)} /></div>;
    case "DialGauge": return <div className="flex flex-col gap-3"><InputRow label="Label" value={element.props.label || "UV Level"} onChange={(v) => updateProp("label", v)} /><InputRow label="Value" value={element.props.value || "4"} onChange={(v) => updateProp("value", v)} /></div>;
    case "NeuralCard":
    case "CloudCard":
      return <div className="flex flex-col gap-3"><InputRow label="Title" value={element.props.title || (element.type === "NeuralCard" ? "Defense Matrix" : "Cloud Edge")} onChange={(v) => updateProp("title", v)} /><InputRow label="Description" value={element.props.description || (element.type === "NeuralCard" ? "Autonomous real-time threat neutralization and mitigation protocols." : "Orchestrate resources without complexity.")} onChange={(v) => updateProp("description", v)} multiline /></div>;
    case "TestimonialCard": return <div className="flex flex-col gap-3"><InputRow label="Quote" value={element.props.quote || "The best tool we've used for scaling our platform design."} onChange={(v) => updateProp("quote", v)} multiline /><InputRow label="Author" value={element.props.author || "Sarah Jenkins"} onChange={(v) => updateProp("author", v)} /><InputRow label="Role" value={element.props.role || "VP of Engineering, Stripe"} onChange={(v) => updateProp("role", v)} /></div>;
    case "StatCard": return <div className="flex flex-col gap-3"><InputRow label="Label" value={element.props.label || "Total Revenue"} onChange={(v) => updateProp("label", v)} /><InputRow label="Value" value={element.props.value || "$124.5k"} onChange={(v) => updateProp("value", v)} /><InputRow label="Percent" value={element.props.percent || "12.5%"} onChange={(v) => updateProp("percent", v)} /></div>;
    case "NotificationToast": return <div className="flex flex-col gap-3"><InputRow label="Title" value={element.props.title || "Update Available"} onChange={(v) => updateProp("title", v)} /><InputRow label="Description" value={element.props.description || "Version 2.4.1 brings new features and performance improvements."} onChange={(v) => updateProp("description", v)} multiline /></div>;
    case "AudioPlayer": return <div className="flex flex-col gap-3"><InputRow label="Title" value={element.props.title || "Lumina Podcast"} onChange={(v) => updateProp("title", v)} /><InputRow label="Time" value={element.props.time || "1:24 / 45:00"} onChange={(v) => updateProp("time", v)} /></div>;
    case "CodeSnippet": return <div className="flex flex-col gap-3"><InputRow label="Code" value={element.props.code || "import { useState } from \"react\";\n\nexport default function App() {\n  return <Lumina />;\n}"} onChange={(v) => updateProp("code", v)} multiline /></div>;
    case "CatalogMenu":
      return <div className="flex flex-col gap-3"><InputRow label="Title" value={element.props.title || "Summer Collection"} onChange={(v) => updateProp("title", v)} /><InputRow label="Image URL" value={element.props.image || ""} onChange={(v) => updateProp("image", v)} /></div>;
    case "AvatarGroup":
      return <div className="flex flex-col gap-3"><InputRow label="Addition Text" value={element.props.addition || "+4"} onChange={(v) => updateProp("addition", v)} /></div>;
    case "InitializeBadge":
      return <div className="flex flex-col gap-3"><InputRow label="Text" value={element.props.text || "System Initialized"} onChange={(v) => updateProp("text", v)} /></div>;
    case "CommandPalette": {
      const defaultItems = [{ title: "Introduction", meta: "↵" }, { title: "Getting Started", meta: "" }];
      const items = getArrayProp("items", defaultItems);
      return (
        <div className="flex flex-col gap-3">
          <InputRow label="Placeholder" value={element.props.placeholder || "Search documents..."} onChange={(v) => updateProp("placeholder", v)} />
          {items.map((item: any, i: number) => (
            <div key={i} className="flex gap-2">
              <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg px-2 text-xs text-white" value={item.title} onChange={(e) => updateArrayItem("items", i, { title: e.target.value }, defaultItems)} />
              <input type="text" className="w-16 bg-black/40 border border-white/10 rounded-lg px-2 text-xs text-white" value={item.meta} onChange={(e) => updateArrayItem("items", i, { meta: e.target.value }, defaultItems)} />
              <button type="button" onClick={() => removeArrayItem("items", i, defaultItems)} className="text-red-400 font-bold px-2">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("items", { title: "New Item", meta: "" }, defaultItems)} className="py-2 text-xs font-semibold bg-white/10 text-white rounded-lg hover:bg-white/20">Add Search Item</button>
        </div>
      );
    }
    case "Menu": {
      const defaultItems = [{ label: "Profile", shortcut: "⇧⌘P" }, { label: "Settings", shortcut: "⌘S" }];
      const items = getArrayProp("menuItems", defaultItems);
      return (
        <div className="flex flex-col gap-3">
          {items.map((item: any, i: number) => (
            <div key={i} className="flex gap-2">
              <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg px-2 text-xs text-white" value={item.label} onChange={(e) => updateArrayItem("menuItems", i, { label: e.target.value }, defaultItems)} />
              <input type="text" className="w-16 bg-black/40 border border-white/10 rounded-lg px-2 text-xs text-white" value={item.shortcut} onChange={(e) => updateArrayItem("menuItems", i, { shortcut: e.target.value }, defaultItems)} />
              <button type="button" onClick={() => removeArrayItem("menuItems", i, defaultItems)} className="text-red-400 font-bold px-2">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("menuItems", { label: "New Item", shortcut: "" }, defaultItems)} className="py-2 text-xs font-semibold bg-white/10 text-white rounded-lg hover:bg-white/20">Add Menu Item</button>
        </div>
      );
    }
    default: return null;
  }
}

export function FreeformTab({ sectionId, element }: { sectionId: string, element: any }) {
  const { updateFreeformElement, removeFreeformElement, setSelectedId } = useLuminaStore();
  const supportsBackgroundColor = ["Button", "Avatar", "Badge", "Icon", "Input", "Textarea", "Select", "Image", "Navbar", "PricingCard", "GlowingButton", "Menu", "Timeline", "DialGauge", "WeatherWidget", "WebGLBackground", "BokehGradient", "CatalogMenu", "NeuralCard", "InitializeBadge", "CloudCard", "StatCard", "CodeSnippet", "TestimonialCard", "NotificationToast", "AvatarGroup", "CommandPalette", "AudioPlayer"].includes(element.type);
  const currentBackgroundColor = String(element.props.backgroundColor || "transparent");

  const updateProp = (key: string, value: string | number) => {
    updateFreeformElement(sectionId, element.id, { ...element, props: { ...element.props, [key]: value } });
  };

  const handleDelete = () => {
    removeFreeformElement(sectionId, element.id);
    setSelectedId(null);
  };

  return (
    <div className="flex flex-col gap-5 pb-12">
      <div className="flex justify-between items-center mt-2">
        <h4 className="text-white/80 text-[13px] font-bold tracking-wide">Props</h4>
        <button
          onClick={handleDelete}
          className="flex items-center justify-center w-7 h-7 rounded-md text-white/50 hover:text-red-400 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 transition-all bg-white/5"
          title="Delete element"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <Divider />
      <h4 className="text-white/80 text-[13px] font-bold tracking-wide">Layout & Dimensions</h4>
      <SliderRow
        label="Width"
        value={Number(element.props.width ?? element.props.size ?? 200)}
        min={24} max={800} step={1} unit="px"
        onChange={(v) => updateProp("width", v)}
      />
      <SliderRow
        label="Height"
        value={Number(element.props.height ?? element.props.size ?? 80)}
        min={24} max={800} step={1} unit="px"
        onChange={(v) => updateProp("height", v)}
      />

      <SliderRow
        label="Border Radius"
        value={Number(element.props.borderRadius ?? 16)}
        min={0} max={100} step={1} unit="px"
        onChange={(v) => updateProp("borderRadius", v)}
      />

      <div className="flex flex-col gap-2">
        <Label>Accent Color</Label>
        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-1.5 transition-colors focus-within:border-accent-glow focus-within:ring-1">
          <div className="relative shrink-0 w-8 h-8 rounded-lg overflow-hidden shadow-inner ring-1 ring-white/20 ring-inset">
            <input
              type="color"
              value={String(element.props.accentColor || "#8b5cf6")}
              onChange={(e) => updateProp("accentColor", e.target.value)}
              className="w-full h-full p-0 cursor-pointer bg-transparent border-0 outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
            />
          </div>
          <input
            type="text"
            value={String(element.props.accentColor || "#8b5cf6").toUpperCase()}
            onChange={(e) => updateProp("accentColor", e.target.value)}
            className="w-full bg-transparent border-0 px-2 py-1 flex-1 text-xs font-mono uppercase outline-none text-white/80 focus:text-white"
          />
        </div>
      </div>

      {["Navbar", "Timeline", "Menu", "CatalogMenu", "CommandPalette"].includes(element.type) && (
        <SliderRow
          label="Inner Gap"
          value={Number(element.props.gap ?? 16)}
          min={0} max={120} step={1} unit="px"
          onChange={(v) => updateProp("gap", v)}
        />
      )}

      {["Navbar", "PricingCard", "Timeline", "WeatherWidget", "DialGauge", "NeuralCard", "CloudCard", "TestimonialCard", "StatCard", "NotificationToast", "AudioPlayer", "CodeSnippet", "Menu", "CommandPalette", "CatalogMenu", "AvatarGroup", "InitializeBadge"].includes(element.type) && (
        <>
          <Divider />
          <h4 className="text-white/80 text-[13px] font-bold tracking-wide">Configuration</h4>
          <FreeformComponentConfig element={element} updateProp={updateProp} updateFreeformElement={updateFreeformElement} sectionId={sectionId} />
        </>
      )}

      {["Text", "Button", "Avatar", "Badge", "Checkbox"].includes(element.type) && (
        <InputRow
          label={["Button", "Checkbox"].includes(element.type) ? "Label" : "Text"}
          value={element.props.text || element.props.label || ""}
          onChange={(v) => updateProp(["Button", "Checkbox"].includes(element.type) ? "label" : "text", v)}
          placeholder="Enter text..."
        />
      )}

      {["Input", "Textarea", "Select"].includes(element.type) && (
        <InputRow
          label="Placeholder"
          value={element.props.placeholder || ""}
          onChange={(v) => updateProp("placeholder", v)}
          placeholder="Placeholder text..."
        />
      )}

      {element.type === "Image" && (
        <div className="flex flex-col gap-5">
          <InputRow
            label="Source URL"
            value={element.props.src || ""}
            onChange={(v) => updateProp("src", v)}
            placeholder="https://..."
          />

          <SliderRow
            label="Image Size"
            value={Number(element.props.size || 128)}
            min={48}
            max={512}
            step={8}
            unit="px"
            onChange={(v) => updateFreeformElement(sectionId, element.id, {
              ...element,
              props: {
                ...element.props,
                size: v,
                width: undefined,
                height: undefined,
              },
            })}
          />

          <SliderRow
            label="Opacity"
            value={Number(element.props.opacity ?? 100)}
            min={0}
            max={100}
            step={1}
            unit="%"
            onChange={(v) => updateProp("opacity", v)}
          />

          <SliderRow
            label="Border Weight"
            value={Number(element.props.borderWeight ?? 0)}
            min={0}
            max={24}
            step={1}
            unit="px"
            onChange={(v) => updateProp("borderWeight", v)}
          />

          <SelectRow
            label="Border Design"
            value={String(element.props.borderStyle || "solid")}
            options={[
              { label: "Solid", value: "solid" },
              { label: "Dashed", value: "dashed" },
              { label: "Dotted", value: "dotted" },
              { label: "Double", value: "double" },
              { label: "None", value: "none" },
            ]}
            onChange={(v) => updateProp("borderStyle", v)}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Border Color</Label>
            </div>
            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-1.5 transition-colors focus-within:border-accent-glow focus-within:ring-1 focus-within:ring-accent-glow">
              <div className="relative shrink-0 w-8 h-8 rounded-lg overflow-hidden shadow-inner ring-1 ring-white/20 ring-inset">
                <input
                  type="color"
                  value={String(element.props.borderColor || "#ffffff")}
                  onChange={(e) => updateProp("borderColor", e.target.value)}
                  className="w-full h-full p-0 cursor-pointer bg-transparent border-0 outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  title="Border color picker"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ boxShadow: `0 0 12px ${String(element.props.borderColor || "#ffffff")}60` }}
                />
              </div>
              <input
                type="text"
                value={String(element.props.borderColor || "#ffffff").toUpperCase()}
                onChange={(e) => updateProp("borderColor", e.target.value)}
                className="w-full bg-transparent border-0 px-2 py-1 flex-1 text-xs font-mono uppercase outline-none text-white/80 focus:text-white"
              />
              <button
                type="button"
                onClick={() => updateProp("borderColor", "")}
                className="mr-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <SelectRow
            label="Box Shadow"
            value={String(element.props.shadow || "md")}
            options={[
              { label: "None", value: "none" },
              { label: "Small", value: "sm" },
              { label: "Medium", value: "md" },
              { label: "Large", value: "lg" },
              { label: "Glow", value: "glow" },
            ]}
            onChange={(v) => updateProp("shadow", v)}
          />

          <div className="flex flex-col gap-1.5">
            <Label>Layer</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateProp("layer", "back")}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${(element.props.layer || "front") === "back"
                  ? "border-accent-glow/50 bg-accent-glow/15 text-white"
                  : "border-white/10 bg-black/30 text-white/60 hover:text-white/80 hover:border-white/20"
                  }`}
              >
                Behind
              </button>
              <button
                type="button"
                onClick={() => updateProp("layer", "front")}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${(element.props.layer || "front") === "front"
                  ? "border-accent-glow/50 bg-accent-glow/15 text-white"
                  : "border-white/10 bg-black/30 text-white/60 hover:text-white/80 hover:border-white/20"
                  }`}
              >
                In Front
              </button>
            </div>
          </div>
        </div>
      )}

      {element.type === "Icon" && (
        <InputRow
          label="Icon Emoji/Text"
          value={element.props.icon || ""}
          onChange={(v) => updateProp("icon", v)}
          placeholder="★"
        />
      )}

      {supportsBackgroundColor && (
        <>
          <Divider />
          <h4 className="text-white/80 text-[13px] font-bold tracking-wide">Surface Style</h4>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Background Color</Label>
            </div>
            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-1.5 transition-colors focus-within:border-accent-glow focus-within:ring-1 focus-within:ring-accent-glow">
              <div className="relative shrink-0 w-8 h-8 rounded-lg overflow-hidden shadow-inner ring-1 ring-white/20 ring-inset">
                <input
                  type="color"
                  value={currentBackgroundColor === "transparent" ? "#000000" : currentBackgroundColor}
                  onChange={(e) => updateProp("backgroundColor", e.target.value)}
                  className="w-full h-full p-0 cursor-pointer bg-transparent border-0 outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  title="Background color picker"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ boxShadow: `0 0 12px ${currentBackgroundColor === "transparent" ? "#000000" : currentBackgroundColor}60` }}
                />
              </div>
              <input
                type="text"
                value={currentBackgroundColor.toUpperCase()}
                onChange={(e) => updateProp("backgroundColor", e.target.value)}
                className="w-full bg-transparent border-0 px-2 py-1 flex-1 text-xs font-mono uppercase outline-none text-white/80 focus:text-white"
                placeholder="transparent"
              />
              <button
                type="button"
                onClick={() => updateProp("backgroundColor", "")}
                className="mr-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </>
      )}

      {["Text", "Button", "Badge", "Icon", "Checkbox", "Navbar", "PricingCard", "GlowingButton", "Menu", "StatCard", "CodeSnippet", "TestimonialCard", "NotificationToast", "CommandPalette"].includes(element.type) && (
        <>
          <Divider />
          <h4 className="text-white/80 text-[13px] font-bold tracking-wide">Text Style</h4>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Text Color</Label>
            </div>
            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-1.5 transition-colors focus-within:border-accent-glow focus-within:ring-1 focus-within:ring-accent-glow">
              <div className="relative shrink-0 w-8 h-8 rounded-lg overflow-hidden shadow-inner ring-1 ring-white/20 ring-inset">
                <input
                  type="color"
                  value={element.props.color || "#ffffff"}
                  onChange={(e) => updateProp("color", e.target.value)}
                  className="w-full h-full p-0 cursor-pointer bg-transparent border-0 outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  title="Color picker"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ boxShadow: `0 0 12px ${element.props.color || "#ffffff"}60` }}
                />
              </div>
              <input
                type="text"
                value={(element.props.color || "#ffffff").toUpperCase()}
                onChange={(e) => updateProp("color", e.target.value)}
                className="w-full bg-transparent border-0 px-2 py-1 flex-1 text-xs font-mono uppercase outline-none text-white/80 focus:text-white"
              />
              <button
                type="button"
                onClick={() => updateProp("color", "")}
                className="mr-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <SelectRow
            label="Font Family"
            value={element.props.fontFamily || "sans"}
            options={[
              { label: "Sans Serif", value: "sans" },
              { label: "Serif", value: "serif" },
              { label: "Monospace", value: "mono" },
            ]}
            onChange={(v) => updateProp("fontFamily", v)}
          />

          <SelectRow
            label="Font Weight"
            value={element.props.fontWeight || "normal"}
            options={[
              { label: "Light", value: "300" },
              { label: "Normal", value: "400" },
              { label: "Medium", value: "500" },
              { label: "Semibold", value: "600" },
              { label: "Bold", value: "700" },
              { label: "Extra Bold", value: "800" },
            ]}
            onChange={(v) => updateProp("fontWeight", v)}
          />

          <SliderRow
            label="Font Size"
            value={element.props.fontSize || 16}
            min={8}
            max={72}
            step={1}
            unit="px"
            onChange={(v) => updateProp("fontSize", v.toString())}
          />

          <SliderRow
            label="Letter Spacing"
            value={element.props.letterSpacing || 0}
            min={-5}
            max={20}
            step={0.5}
            unit="px"
            onChange={(v) => updateProp("letterSpacing", v.toString())}
          />
        </>
      )}
    </div>
  );
}

function GlobalStylesTab() {
  const { globalStyles, setGlobalStyles, sections, updateSection, globalCanvasBackgroundColor, setGlobalCanvasBackgroundColor } = useLuminaStore();

  const hasGlobalCanvasBackgroundColor =
    typeof globalCanvasBackgroundColor === "string" &&
    globalCanvasBackgroundColor.length > 0 &&
    globalCanvasBackgroundColor !== "transparent";

  const derivedAllSectionCanvasBackgroundColor =
    hasGlobalCanvasBackgroundColor
      ? globalCanvasBackgroundColor
      :
      (sections.find((s) => {
        const color = (s.props.visuals?.canvasBackgroundColor as string | undefined) ?? "transparent";
        return color !== "transparent";
      })?.props.visuals?.canvasBackgroundColor as string | undefined) ?? "transparent";

  const canvasBgColor = String(derivedAllSectionCanvasBackgroundColor ?? "transparent");

  const updateCanvasBackgroundForAllSections = (color: string) => {
    try {
      if (typeof setGlobalCanvasBackgroundColor === "function") {
        setGlobalCanvasBackgroundColor(color);
      }
    } catch {
      // Ignore transient HMR store-shape errors and continue with section-level updates.
    }

    if (Array.isArray(sections)) {
      sections.forEach((s) =>
        updateSection(s.id, {
          visuals: {
            canvasBackgroundColor: color,
            backgroundColor: "transparent",
          },
        })
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-5">
        <h4 className="text-white/80 text-[13px] font-bold tracking-wide mt-2">Typography</h4>
        <SelectRow
          label="Font Family"
          value={globalStyles.typography.fontFamily}
          options={[
            { label: "Inter (Sans)", value: "sans" },
            { label: "Geist (Sans)", value: "'Geist', sans-serif" },
            { label: "Roboto (Sans)", value: "'Roboto', sans-serif" },
            { label: "Outfit (Sans)", value: "'Outfit', sans-serif" },
            { label: "JetBrains Mono", value: "mono" },
          ]}
          onChange={(v) => setGlobalStyles({ typography: { ...globalStyles.typography, fontFamily: v } })}
        />
        <SliderRow
          label="H1 Size"
          value={globalStyles.typography.h1Size}
          min={24} max={96} step={2} unit="px"
          onChange={(v) => setGlobalStyles({ typography: { ...globalStyles.typography, h1Size: v } })}
        />
        <SliderRow
          label="H2 Size"
          value={globalStyles.typography.h2Size}
          min={18} max={72} step={2} unit="px"
          onChange={(v) => setGlobalStyles({ typography: { ...globalStyles.typography, h2Size: v } })}
        />
        <SliderRow
          label="H3 Size"
          value={globalStyles.typography.h3Size}
          min={16} max={56} step={2} unit="px"
          onChange={(v) => setGlobalStyles({ typography: { ...globalStyles.typography, h3Size: v } })}
        />
        <SliderRow
          label="Paragraph Size"
          value={globalStyles.typography.pSize}
          min={12} max={32} step={1} unit="px"
          onChange={(v) => setGlobalStyles({ typography: { ...globalStyles.typography, pSize: v } })}
        />
      </div>

      <Divider />
      <div className="flex flex-col gap-5">
        <h4 className="text-white/80 text-[13px] font-bold tracking-wide">Backgrounds & Colors</h4>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Background for all section</Label>
          </div>
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-1.5 transition-colors focus-within:border-accent-glow focus-within:ring-1 focus-within:ring-accent-glow">
            <div className="relative shrink-0 w-8 h-8 rounded-lg overflow-hidden shadow-inner ring-1 ring-white/20 ring-inset">
              <input
                type="color"
                value={canvasBgColor === "transparent" ? "#000000" : canvasBgColor}
                onChange={(e) => updateCanvasBackgroundForAllSections(e.target.value)}
                className="w-full h-full p-0 cursor-pointer bg-transparent border-0 outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                title="Color picker"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: `0 0 12px ${canvasBgColor === "transparent" ? "#000000" : canvasBgColor}60` }}
              />
            </div>
            <input
              type="text"
              value={canvasBgColor.toUpperCase()}
              onChange={(e) => updateCanvasBackgroundForAllSections(e.target.value)}
              className="w-full bg-transparent border-0 px-2 py-1 flex-1 text-xs font-mono uppercase outline-none text-white/80 focus:text-white"
              placeholder="transparent"
            />
            <button
              type="button"
              onClick={() => updateCanvasBackgroundForAllSections("transparent")}
              className="mr-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <h4 className="text-white/80 text-[13px] font-bold tracking-wide mt-2">Brand Colors</h4>

        <div className="flex flex-col gap-2">
          <Label>Primary</Label>
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-1.5 transition-colors focus-within:border-accent-glow focus-within:ring-1">
            <div className="relative shrink-0 w-8 h-8 rounded-lg overflow-hidden shadow-inner ring-1 ring-white/20 ring-inset">
              <input type="color" value={globalStyles.brandColors.primary} onChange={(e) => setGlobalStyles({ brandColors: { ...globalStyles.brandColors, primary: e.target.value } })} className="w-full h-full p-0 cursor-pointer bg-transparent border-0 outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
            </div>
            <input type="text" value={globalStyles.brandColors.primary.toUpperCase()} onChange={(e) => setGlobalStyles({ brandColors: { ...globalStyles.brandColors, primary: e.target.value } })} className="w-full bg-transparent border-0 px-2 py-1 flex-1 text-xs font-mono uppercase outline-none text-white/80 focus:text-white" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Secondary</Label>
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-1.5 transition-colors focus-within:border-accent-glow focus-within:ring-1">
            <div className="relative shrink-0 w-8 h-8 rounded-lg overflow-hidden shadow-inner ring-1 ring-white/20 ring-inset">
              <input type="color" value={globalStyles.brandColors.secondary} onChange={(e) => setGlobalStyles({ brandColors: { ...globalStyles.brandColors, secondary: e.target.value } })} className="w-full h-full p-0 cursor-pointer bg-transparent border-0 outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
            </div>
            <input type="text" value={globalStyles.brandColors.secondary.toUpperCase()} onChange={(e) => setGlobalStyles({ brandColors: { ...globalStyles.brandColors, secondary: e.target.value } })} className="w-full bg-transparent border-0 px-2 py-1 flex-1 text-xs font-mono uppercase outline-none text-white/80 focus:text-white" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Accent</Label>
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-1.5 transition-colors focus-within:border-accent-glow focus-within:ring-1">
            <div className="relative shrink-0 w-8 h-8 rounded-lg overflow-hidden shadow-inner ring-1 ring-white/20 ring-inset">
              <input type="color" value={globalStyles.brandColors.accent} onChange={(e) => setGlobalStyles({ brandColors: { ...globalStyles.brandColors, accent: e.target.value } })} className="w-full h-full p-0 cursor-pointer bg-transparent border-0 outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
            </div>
            <input type="text" value={globalStyles.brandColors.accent.toUpperCase()} onChange={(e) => setGlobalStyles({ brandColors: { ...globalStyles.brandColors, accent: e.target.value } })} className="w-full bg-transparent border-0 px-2 py-1 flex-1 text-xs font-mono uppercase outline-none text-white/80 focus:text-white" />
          </div>
        </div>
      </div>

      <Divider />
      <div className="flex flex-col gap-5">
        <h4 className="text-white/80 text-[13px] font-bold tracking-wide">Border Radii</h4>
        <SliderRow
          label="Root Base"
          value={globalStyles.borderRadii.root}
          min={0} max={64} step={2} unit="px"
          onChange={(v) => setGlobalStyles({ borderRadii: { ...globalStyles.borderRadii, root: v } })}
        />
        <SliderRow
          label="Components Base"
          value={globalStyles.borderRadii.components}
          min={0} max={32} step={1} unit="px"
          onChange={(v) => setGlobalStyles({ borderRadii: { ...globalStyles.borderRadii, components: v } })}
        />
      </div>
    </div>
  );
}

export function PropertyInspector() {
  const { sections, selectedId, isLivePreview } = useLuminaStore();
  const selectedSection = sections.find((s) => s.id === selectedId);
  const getSectionElements = (section: LuminaSection) =>
    ((section as any).elements || (section.props as any).elements || []) as any[];
  const parentSectionOfFreeform = sections.find((s) => getSectionElements(s).some((e: any) => e.id === selectedId));
  const selectedFreeformElement = parentSectionOfFreeform
    ? getSectionElements(parentSectionOfFreeform).find((e: any) => e.id === selectedId)
    : undefined;

  const [activeTab, setActiveTab] = useState<Tab>("style");
  const [prevTabIdx, setPrevTabIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const hoverTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const effectivelyOpen = isOpen || isHoverOpen;

  useEffect(() => {
    if (effectivelyOpen) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Don't trigger if hovering over interactive section controls
      if ((e.target as Element).closest?.('.no-sidebar-trigger')) {
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
        }
        return;
      }

      if (e.clientX >= window.innerWidth - 48) {
        if (!hoverTimerRef.current) {
          hoverTimerRef.current = setTimeout(() => setIsHoverOpen(true), 200);
        }
      } else {
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
    };
  }, [effectivelyOpen]);

  useEffect(() => {
    const handleTutorialAction = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      switch (detail) {
        case 'tab-style':
          setIsOpen(true);
          setActiveTab("style");
          break;
        case 'tab-layout':
          setActiveTab("layout");
          break;
        case 'tab-globalStyles':
          setActiveTab("globalStyles");
          break;
        case 'tab-config':
          setActiveTab("config");
          break;
        case 'select-and-open-inspector':
          setIsOpen(true);
          break;
        case 'close-inspector':
          setIsOpen(false);
          break;
      }
    };
    window.addEventListener('tutorial-action', handleTutorialAction);
    return () => window.removeEventListener('tutorial-action', handleTutorialAction);
  }, []);

  const handlePanelMouseLeave = () => {
    if (!isOpen) setIsHoverOpen(false);
  };

  useEffect(() => {
    if (isLivePreview) {
      setIsOpen(false);
    }
  }, [isLivePreview]);

  useEffect(() => {
    const handleClose = () => { setIsOpen(false); setIsHoverOpen(false); };
    window.addEventListener('close-sidebars', handleClose);
    return () => window.removeEventListener('close-sidebars', handleClose);
  }, []);

  useEffect(() => {
    if (isLivePreview) return;
    if (selectedSection || selectedFreeformElement) {
      setIsOpen(true);
    }
  }, [isLivePreview, selectedSection, selectedFreeformElement]);

  const handleTabChange = (tabId: Tab) => {
    const curIdx = TABS.findIndex((t) => t.id === activeTab);
    const newIdx = TABS.findIndex((t) => t.id === tabId);
    setPrevTabIdx(newIdx > curIdx ? 1 : -1);
    setActiveTab(tabId);
  };

  const TabContent = activeTab === "style"
    ? StyleTab
    : activeTab === "layout"
      ? LayoutTab
      : activeTab === "globalStyles"
        ? GlobalStylesTab
        : ConfigTab;

  return (
    <div
      className="fixed right-0 z-[60] flex"
      style={{ top: '56px', bottom: 0 }}
      onMouseLeave={handlePanelMouseLeave}
    >

      {/* Toggle button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setIsHoverOpen(false); }}
        className="self-center w-5 h-10 opacity-30 hover:opacity-100 bg-[#1a0f35]/80 hover:bg-violet-500/40 border border-white/10 border-r-0 rounded-l-md flex items-center justify-center cursor-pointer backdrop-blur-md transition-all group shadow-[0_0_10px_rgba(0,0,0,0.5)] z-50 flex-shrink-0"
        title={effectivelyOpen ? "Collapse Inspector" : "Expand Inspector"}
      >
        {effectivelyOpen ? (
          <ChevronRight size={12} className="text-white/50 group-hover:text-white" />
        ) : (
          <ChevronLeft size={12} className="text-white/50 group-hover:text-white" />
        )}
      </button>

      <motion.aside
        initial={false}
        animate={{ width: effectivelyOpen ? 300 : 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 35 }}
        className="flex flex-col border-l border-white/5 bg-[#0a0a0c]/90 backdrop-blur-xl glass-panel border-y-0 border-r-0 rounded-none flex-shrink-0 overflow-hidden h-full shadow-[-8px_0_32px_rgba(0,0,0,0.5)]"
      >
        <div className="w-[300px] h-full flex flex-col">
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <Settings2 size={15} className="text-white/40" />
              <h2 className="text-sm font-bold tracking-tight text-white/80">Inspector</h2>
            </div>
            {selectedSection && (
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                  style={{
                    color: "#a78bfa",
                    borderColor: "#a78bfa40",
                    backgroundColor: "#a78bfa12",
                  }}
                >
                  {selectedSection.type}
                </span>
                <span className="text-[10px] text-white/20 font-mono truncate">
                  {selectedSection.id.slice(-8)}
                </span>
              </div>
            )}        {selectedFreeformElement && (
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                  style={{
                    color: "#3b82f6",
                    borderColor: "#3b82f640",
                    backgroundColor: "#3b82f612",
                  }}
                >
                  {selectedFreeformElement.type} Element
                </span>
                <span className="text-[10px] text-white/20 font-mono truncate">
                  {selectedFreeformElement.id.slice(-8)}
                </span>
              </div>
            )}      </div>

          {selectedSection ? (
            <>
              {/* Tab bar */}
              <div className="flex border-b border-white/5 flex-shrink-0 px-2 pt-2">
                {TABS.map((tab) => {
                  const isActive = tab.id === activeTab;
                  const Icon = tab.Icon;
                  return (
                    <button
                      key={tab.id}
                      id={`tutorial-tab-${tab.id}`}
                      onClick={() => handleTabChange(tab.id)}
                      className={`relative flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 text-[11px] font-semibold transition-colors rounded-t-lg ${isActive
                        ? "text-white"
                        : "text-white/30 hover:text-white/60"
                        }`}
                    >
                      <Icon size={12} />
                      {tab.label}
                      {isActive && (
                        <motion.div
                          layoutId="tab-indicator"
                          className="absolute bottom-0 left-1 right-1 h-0.5 rounded-full"
                          style={{ backgroundColor: "#a78bfa" }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab content with slide animation */}
              <div className="flex-1 overflow-y-auto relative">
                <AnimatePresence mode="wait" custom={prevTabIdx}>
                  <motion.div
                    key={activeTab}
                    custom={prevTabIdx}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.18,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="absolute inset-0 p-5 overflow-y-auto"
                  >
                    <TabContent section={selectedSection} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          ) : selectedFreeformElement && parentSectionOfFreeform ? (
            <div className="flex-1 overflow-y-auto p-5">
              <FreeformTab sectionId={parentSectionOfFreeform.id} element={selectedFreeformElement} />
            </div>
          ) : (
            /* Empty state */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-1">
                <MousePointerClick size={20} className="text-white/20" />
              </div>
              <p className="text-sm font-medium text-white/40">No layer selected</p>
              <p className="text-[11px] text-white/20 leading-relaxed">
                Click a section on the canvas
                <br />
                to inspect its properties
              </p>
            </motion.div>
          )}
        </div>
      </motion.aside>
    </div>
  );
}

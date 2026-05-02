"use client";

import React, { useMemo, useState, useRef, useEffect, type ChangeEvent, Fragment } from "react";
import Link from "next/link";
import { useLuminaStore } from "@/store/useLuminaStore";
import {
  Search, Eye, EyeOff, LayoutTemplate, Component as ComponentIcon, Globe, ChevronLeft,
  GripVertical, Plus, Minus, Maximize2, ChevronRight, ChevronDown, Trash2,
  Monitor, Smartphone, Tablet, Undo2, Redo2, ZoomIn, Play, X,
  Sparkles, CreditCard, MessageSquareHeart, Megaphone, MessageCircleQuestion, BarChart3, Users, Mail
} from "lucide-react";
import { LuminaLogo } from "@/components/ui/LuminaLogo";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
  pointerWithin,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CanvasViewport } from "@/components/CanvasViewport";
import { PropertyInspector } from "@/components/PropertyInspector";
import { SectionRenderer } from "@/components/SectionRenderer";
import { LayerTreePanel } from "@/components/LayerTreePanel";
import { AICursorTutorial } from "@/components/AICursorTutorial";

// ─────────────────────────────────────────────────────────────────────────────
// Libraries & Types
// ─────────────────────────────────────────────────────────────────────────────

type LibraryItem = { id: string; label: string; type: string; props?: Record<string, unknown> };
type LocalImageItem = LibraryItem & { src: string };
type DragPreview = { sectionId: string; type: string; x: number; y: number };

const LOCAL_IMAGE_STORAGE_KEY = "lumina-local-images";

function getGhostSize(type: string) {
  switch (type) {
    case "Text":
      return { width: 120, height: 28 };
    case "Button":
      return { width: 112, height: 40 };
    case "Image":
      return { width: 128, height: 128 };
    case "Input":
      return { width: 192, height: 40 };
    case "Textarea":
      return { width: 192, height: 96 };
    case "Select":
      return { width: 192, height: 40 };
    case "Checkbox":
      return { width: 110, height: 24 };
    case "Avatar":
      return { width: 48, height: 48 };
    case "Badge":
      return { width: 84, height: 28 };
    case "Icon":
      return { width: 40, height: 40 };
    default:
      return { width: 96, height: 32 };
  }
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function getDropPreviewFromEvent(
  overId: string,
  overRect: { left: number; top: number; width: number; height: number } | null,
  translatedRect: { left: number; top: number; width: number; height: number } | null,
  type: string,
  pointer: { x: number; y: number } | null,
): DragPreview | null {
  if (!overId.startsWith("section-zone-") || !overRect || !translatedRect) return null;

  const sectionId = overId.replace("section-zone-", "");
  const size = getGhostSize(type);

  // Get current active scale
  const scale = (window as any).__lumina_canvas_scale || 1;

  const pointerX = pointer ? pointer.x : translatedRect.left + translatedRect.width / 2;
  const pointerY = pointer ? pointer.y : translatedRect.top + translatedRect.height / 2;

  // Convert distance from screen pixels into CSS pixels of the scaled container
  const rawX = (pointerX - overRect.left) / scale;
  const rawY = (pointerY - overRect.top) / scale;
  const unscaledWidth = overRect.width / scale;
  const unscaledHeight = overRect.height / scale;

  const x = clamp(Math.round(rawX - size.width / 2), 0, Math.max(0, Math.round(unscaledWidth - size.width)));
  const y = clamp(Math.round(rawY - size.height / 2), 0, Math.max(0, Math.round(unscaledHeight - size.height)));

  return { sectionId, type, x, y };
}

function getPointerY(
  pointer: { x: number; y: number } | null,
  translatedRect: { top: number; height: number } | null,
) {
  if (pointer) return pointer.y;
  if (translatedRect) return translatedRect.top + translatedRect.height / 2;
  return null;
}

const SECTION_LIBRARY: LibraryItem[] = [
  { id: "pric-sec", label: "Pricing", type: "PricingBlock" },
  { id: "cta-sec", label: "CTA Banner", type: "CTABlock" },
  { id: "test-sec", label: "Testimonials", type: "TestimonialsBlock" },
  { id: "stat-sec", label: "Stats", type: "StatsBlock" },
  { id: "faq-sec", label: "FAQ", type: "FAQBlock" },
  { id: "team-sec", label: "Team", type: "TeamBlock" },
  { id: "marq-sec", label: "Sponsor Marquee", type: "MarqueeBlock" },
  { id: "term-sec", label: "Code Terminal", type: "CodeTerminalBlock" },
  { id: "dash-sec", label: "App Mockup", type: "DashboardMockupBlock" },
  { id: "step-sec", label: "How It Works", type: "StepsBlock" },
];

const GLOBAL_LIBRARY: LibraryItem[] = [
  { id: "wf-blank", label: "Blank Page", type: "BlankPageBlock" },
  { id: "hero-sec", label: "Hero Section", type: "HeroBlock" },
  { id: "feat-sec", label: "Features", type: "FeaturesBlock" },
  { id: "cont-sec", label: "Contact Form", type: "ContactBlock" },
  { id: "foot-sec", label: "Footer", type: "FooterBlock" },
];

const COMPONENT_LIBRARY: LibraryItem[] = [
  { id: "comp-text", label: "Text", type: "Text" },
  { id: "comp-btn", label: "Button", type: "Button" },
  { id: "comp-img", label: "Image", type: "Image" },
  { id: "comp-inp", label: "Input Field", type: "Input" },
  { id: "comp-txta", label: "Text Area", type: "Textarea" },
  { id: "comp-sel", label: "Select Box", type: "Select" },
  { id: "comp-chk", label: "Checkbox", type: "Checkbox" },
  { id: "comp-avt", label: "Avatar", type: "Avatar" },
  { id: "comp-bdg", label: "Badge", type: "Badge" },
  { id: "comp-icn", label: "Icon", type: "Icon" },
];

const SECTION_INSERT_TYPES = new Set([
  ...SECTION_LIBRARY,
  ...GLOBAL_LIBRARY,
].map((item) => item.type));

const COMPONENT_TYPES = new Set(COMPONENT_LIBRARY.map((item) => item.type));

// Block types that can also be used as freeform/component elements
const BLOCK_COMPONENT_TYPES = new Set([
  "PricingBlock",
  "DashboardMockupBlock",
  "CodeTerminalBlock",
  "FeaturesBlock",
  "HeroBlock",
  "CTABlock",
  "TestimonialsBlock",
  "StatsBlock",
  "FAQBlock",
  "TeamBlock",
  "MarqueeBlock",
  "StepsBlock",
]);

// The 9 most-used sections for the quick-add popover
const QUICK_ADD_SECTIONS = [
  { label: "Hero Section", type: "HeroBlock", icon: LayoutTemplate },
  { label: "Features", type: "FeaturesBlock", icon: Sparkles },
  { label: "Pricing", type: "PricingBlock", icon: CreditCard },
  { label: "Testimonials", type: "TestimonialsBlock", icon: MessageSquareHeart },
  { label: "CTA Banner", type: "CTABlock", icon: Megaphone },
  { label: "FAQ", type: "FAQBlock", icon: MessageCircleQuestion },
  { label: "Stats", type: "StatsBlock", icon: BarChart3 },
  { label: "Team", type: "TeamBlock", icon: Users },
  { label: "Contact", type: "ContactBlock", icon: Mail },
];

// ─────────────────────────────────────────────────────────────────────────────
// Quick-Add Popover
// ─────────────────────────────────────────────────────────────────────────────

function QuickAddPopover({
  onAdd,
  onClose,
}: {
  onAdd: (type: string, label: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-full left-1/2 -translate-x-1/2 z-50 mb-3 w-[340px] rounded-[24px] border border-white/10 bg-[#09090b]/80 shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-3xl overflow-hidden origin-bottom"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none" />

      <div className="relative px-5 pt-5 pb-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-md bg-accent-glow/20 flex items-center justify-center border border-accent-glow/30">
            <LayoutTemplate size={10} className="text-accent-glow" />
          </div>
          <p className="text-xs font-bold text-white/90">Quick Add Section</p>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {QUICK_ADD_SECTIONS.map((s) => (
            <button
              key={s.type}
              onClick={() => { onAdd(s.type, s.label); onClose(); }}
              className="relative flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:bg-white/[0.06] hover:border-violet-500/40 hover:shadow-[0_8px_20px_rgba(139,92,246,0.15)] group"
            >
              <div className="absolute inset-0 rounded-2xl transition-opacity opacity-0 group-hover:opacity-100 bg-gradient-to-b from-violet-500/10 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="absolute inset-1 blur-md bg-white/20 group-hover:bg-violet-400/50 transition-colors opacity-0 group-hover:opacity-100 rounded-full" />
                <s.icon
                  size={20}
                  strokeWidth={1.5}
                  className="relative text-zinc-400 group-hover:text-violet-400 group-hover:drop-shadow-[0_0_12px_rgba(139,92,246,0.8)] group-hover:scale-105 transition-all duration-300"
                />
              </div>
              <span className="text-[10px] font-semibold text-white/50 group-hover:text-white/90 transition-colors tracking-tight text-center leading-tight">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative px-5 py-3.5 bg-black/40 border-t border-white/5 flex items-center justify-between group cursor-pointer transition-colors hover:bg-black/60">
        <span className="text-[10px] font-medium tracking-wide text-white/30 group-hover:text-white/50 transition-colors">Or drag from sidebar</span>
        <ChevronRight size={14} className="text-white/20 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Insert Between Button  ─── ⊕ ───
// ─────────────────────────────────────────────────────────────────────────────

function InsertBetweenButton({
  onAdd,
  insertAt,
}: {
  onAdd: (type: string, label: string) => void;
  insertAt: number;
}) {
  const [showPopover, setShowPopover] = useState(false);

  // Each gap zone is its own DnD droppable
  const { setNodeRef, isOver } = useDroppable({ id: `insert-zone-${insertAt}` });

  return (
    <div
      ref={setNodeRef}
      id={`insert-zone-${insertAt}`}
      className={`relative z-20 flex items-center justify-center py-4 group/insert transition-all ${isOver ? "py-8" : ""}`}
    >
      {/* Horizontal guide line */}
      <div className="absolute inset-x-0 h-px bg-white/[0.03] group-hover/insert:bg-violet-500/30 transition-colors" />

      {/* ⊕ circle */}
      <button
        onClick={(e) => { e.stopPropagation(); setShowPopover((v) => !v); }}
        className={`relative z-10 mx-2 flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300
          opacity-100 shadow-[0_0_15px_rgba(0,0,0,0.5)]
          ${showPopover
            ? "bg-violet-500 border-violet-400 text-white shadow-[0_0_20px_rgba(139,92,246,0.8)] scale-110"
            : "bg-[#1a0f35] border-violet-500/60 text-violet-300 hover:bg-violet-500 hover:border-violet-400 hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.7)] hover:scale-110"
          }
          ${isOver ? "bg-violet-500 border-violet-400 text-white scale-110 shadow-[0_0_25px_rgba(139,92,246,0.8)]" : ""}
        `}
      >
        <Plus size={18} strokeWidth={3} />
      </button>

      {/* Drop target label */}
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold text-violet-300 tracking-widest uppercase bg-violet-500/20 px-3 py-1 rounded-full border border-violet-500/30">
            Drop here
          </span>
        </div>
      )}

      <AnimatePresence>
        {showPopover && (
          <QuickAddPopover
            onAdd={onAdd}
            onClose={() => setShowPopover(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Draggable Sidebar Item
// ─────────────────────────────────────────────────────────────────────────────

function DraggableSidebarItem({ item, variant = "list" }: { item: LibraryItem, variant?: "list" | "grid" }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: { type: item.type, label: item.label, props: item.props ?? {} },
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  if (variant === "grid") {
    return (
      <motion.button
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        animate={{ scale: isDragging ? 0.95 : 1, zIndex: isDragging ? 50 : 1 }}
        className={`relative aspect-square rounded-xl border flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing group
          ${isDragging
            ? "border-violet-500 bg-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.3)] z-50"
            : "border-[rgba(255,255,255,0.1)] bg-[#09090b] hover:border-violet-500/50 hover:bg-white/5"
          }
        `}
      >
        {item.props?.src && item.type === "Image" ? (
          <img src={item.props.src as string} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        ) : (
          <ComponentIcon size={24} className="text-white/20 group-hover:text-violet-400 transition-colors" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
          <span className="text-[10px] font-medium text-white truncate w-full text-left">{item.label}</span>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      animate={{ scale: isDragging ? 0.95 : 1, zIndex: isDragging ? 50 : 1 }}
      className={`
        w-full group flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-xs transition-colors cursor-grab active:cursor-grabbing
        ${isDragging
          ? "border-violet-500/50 bg-violet-500/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]"
          : "border-white/10 bg-[#0a0a0a] hover:border-violet-500/30 hover:bg-white/[0.04] text-white/70 hover:text-white"
        }
      `}
    >
      <span className="inline-flex min-w-0 items-center gap-2">
        {item.props?.src && item.type === "Image" ? (
          <span className="h-5 w-5 overflow-hidden rounded-md border border-white/10 bg-white/5 flex-shrink-0">
            <img src={item.props.src as string} alt="" className="h-full w-full object-cover" />
          </span>
        ) : item.type.includes("Block") ? (
          <LayoutTemplate size={12} className="text-white/40 group-hover:text-violet-400" />
        ) : (
          <ComponentIcon size={12} className="text-white/40 group-hover:text-violet-400" />
        )}
        <span className="font-medium tracking-tight truncate">{item.label}</span>
      </span>
      <GripVertical size={12} className="text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}

function DraggingComponentGhost({ type }: { type: string }) {
  if (type === "Text") {
    return <span className="text-white text-base font-medium">Your Text Here</span>;
  }
  if (type === "Button") {
    return <button className="px-5 py-2.5 bg-violet-600 text-sm font-medium text-white rounded-lg">Click Me</button>;
  }
  if (type === "Image") {
    return <div className="w-32 h-32 rounded-xl border border-white/10 bg-neutral-800 flex items-center justify-center text-white/40 text-xs">Image</div>;
  }
  if (type === "Input") {
    return <div className="px-4 py-2 w-48 bg-neutral-900 border border-white/20 rounded-lg text-sm text-white/60">Input Field</div>;
  }
  if (type === "Textarea") {
    return <div className="px-4 py-2 w-48 h-24 bg-neutral-900 border border-white/20 rounded-lg text-sm text-white/60">Text Area</div>;
  }
  if (type === "Select") {
    return <div className="px-4 py-2 w-48 bg-neutral-900 border border-white/20 rounded-lg text-sm text-white/60">Select Box</div>;
  }
  if (type === "Checkbox") {
    return <div className="flex items-center gap-2 text-sm text-white"><div className="w-4 h-4 rounded border border-white/40" />Checkbox</div>;
  }
  if (type === "Avatar") {
    return <div className="w-12 h-12 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center">AB</div>;
  }
  if (type === "Badge") {
    return <span className="px-2.5 py-1 bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-bold rounded-full uppercase tracking-wider">Badge</span>;
  }
  if (type === "Icon") {
    return <div className="w-10 h-10 rounded-lg border border-white/10 bg-neutral-800 text-white/60 flex items-center justify-center">★</div>;
  }

  return <div className="px-3 py-2 rounded-lg border border-white/10 bg-neutral-900 text-white/60 text-xs">{type}</div>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Card — header bar + premium bg + trash  (sortable)
// ─────────────────────────────────────────────────────────────────────────────

function SectionCard({
  section,
  isSelected,
  isLivePreview,
  dragPreview,
  onSelect,
  onRemove,
  isDragOverlay,
}: {
  section: ReturnType<typeof useLuminaStore.getState>["sections"][number];
  isSelected: boolean;
  isLivePreview: boolean;
  dragPreview: DragPreview | null;
  onSelect: () => void;
  onRemove: () => void;
  isDragOverlay?: boolean;
}) {
  const allSections = useLuminaStore((state) => state.sections);
  const globalCanvasBackgroundColor = useLuminaStore((state) => state.globalCanvasBackgroundColor);
  const blockType = (section.props.components?.[0]?.type as string) || section.type;
  const sectionLabel = (section.props.title as string) || (blockType === "HeroBlock" ? "Hero Section" : blockType);

  // Sortable — only active when not inside a DragOverlay
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, disabled: isLivePreview || !!isDragOverlay });

  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: `section-zone-${section.id}` });

  const visuals = section.props.visuals as any;
  const canvasBackgroundColor = visuals?.canvasBackgroundColor || "transparent";
  const derivedSharedCanvasBackgroundColor =
    typeof globalCanvasBackgroundColor === "string" && globalCanvasBackgroundColor !== "transparent"
      ? globalCanvasBackgroundColor
      :
      allSections.find((s) => {
        const color = (s.props.visuals as any)?.canvasBackgroundColor;
        return typeof color === "string" && color !== "transparent";
      })?.props.visuals?.canvasBackgroundColor || "transparent";
  const hasGlobalCanvasBackground =
    typeof globalCanvasBackgroundColor === "string" &&
    globalCanvasBackgroundColor.length > 0 &&
    globalCanvasBackgroundColor !== "transparent";
  const effectiveCanvasBackgroundColor =
    derivedSharedCanvasBackgroundColor !== "transparent"
      ? derivedSharedCanvasBackgroundColor
      : canvasBackgroundColor;
  const backgroundType = visuals?.backgroundType || "solid";

  const sortableStyle = !isDragOverlay ? {
    transform: CSS.Transform.toString(transform),
    transition,
  } : {};

  return (
    <div
      ref={setSortableRef}
      data-section-card="true"
      style={{
        ...sortableStyle,
        opacity: isDragging ? 0.35 : 1,
      }}
      className={`relative w-full flex flex-col group ${isLivePreview ? "" : "mb-8"}`}
    >
      {/* ── Section header bar (Now floating outside the section) ── */}
      {!isLivePreview && (
        <div
          className="flex items-center justify-between px-4 py-2 border-t border-x border-white/5 bg-[#0a0a0a] rounded-t-[12px] z-40 pointer-events-auto transition-opacity shadow-xl"
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
        >
          <div className="flex items-center gap-2">
            {/* ── Drag handle ── */}
            <button
              {...listeners}
              {...attributes}
              className="flex items-center justify-center w-5 h-5 rounded text-white/25 hover:text-white/70 hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing"
              title="Drag to reorder"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={13} />
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#FF5F56] border border-black/10" />
              <div className="w-2 h-2 rounded-full bg-[#FFBD2E] border border-black/10" />
              <div className="w-2 h-2 rounded-full bg-[#27C93F] border border-black/10" />
            </div>
            <span className="text-[11px] font-semibold text-white/50 tracking-wide select-none">
              {sectionLabel}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="flex items-center justify-center w-7 h-7 rounded-md text-white/50 hover:text-red-400 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 transition-all bg-white/5"
            title="Remove section"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* ── Section content wrapper ── */}
      <div
        onClick={isLivePreview ? undefined : (e) => { e.stopPropagation(); onSelect(); }}
        style={{
          backgroundColor:
            effectiveCanvasBackgroundColor !== 'transparent'
              ? effectiveCanvasBackgroundColor
              : undefined,
          backgroundImage:
            !hasGlobalCanvasBackground && backgroundType === 'gradient' && effectiveCanvasBackgroundColor !== 'transparent'
              ? `linear-gradient(135deg, ${effectiveCanvasBackgroundColor} 0%, #000 100%)`
              : undefined,
        }}
        className={`relative w-full text-left overflow-hidden
          ${isLivePreview ? "rounded-none cursor-default" : "rounded-b-[12px] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)] bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer"}
          ${isSelected && !isLivePreview
            ? "ring-1 ring-accent-glow border-accent-glow shadow-[0_0_20px_rgba(167,139,250,0.1)]"
            : ""
          }
          ${isOver ? "border-dashed border-accent-glow ring-1 ring-accent-glow bg-accent-glow/5" : ""}
          ${isDragOverlay ? "shadow-[0_24px_64px_rgba(0,0,0,0.7)] ring-1 ring-accent-glow/40" : ""}
        `}
      >
        <div ref={setDropRef} className="relative z-10">
          <SectionRenderer section={section} readOnly={isLivePreview} />
          {dragPreview && dragPreview.sectionId === section.id && (
            <div
              className="absolute pointer-events-none z-30"
              style={{ left: dragPreview.x, top: dragPreview.y }}
            >
              <div className="opacity-80 rounded-md ring-2 ring-violet-400/60 ring-offset-1 ring-offset-[#090909]">
                <DraggingComponentGhost type={dragPreview.type} />
              </div>
            </div>
          )}
        </div>

        {/* ── Selection violet border overlay ── */}
        {isSelected && !isLivePreview && (
          <div className="absolute inset-0 border border-violet-500/30 rounded-b-[12px] pointer-events-none" />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const {
    isLivePreview,
    setLivePreview,
    sections,
    globalCanvasBackgroundColor,
    selectedId,
    setSelectedId,
    addSection,
    insertSectionAt,
    removeSection,
    reorderSections,
    addFreeformElement,
    viewMode,
    setViewMode,
    zoomLevel,
    setZoom,
    undo,
    redo,
    past,
    future,
  } = useLuminaStore();

  // Track whether the active drag is a canvas section reorder
  const [activeSectionDrag, setActiveSectionDrag] = useState<ReturnType<typeof useLuminaStore.getState>["sections"][number] | null>(null);
  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);

  const [showTutorial, setShowTutorial] = useState(false);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('tutorial') === 'true') {
      setShowTutorial(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"sections" | "components" | "layers">("sections");

  const breadcrumbRoute = useMemo(() => {
    if (!selectedId) return null;
    const sectionMatch = sections.find((s) => s.id === selectedId);
    if (sectionMatch) {
      return [sectionMatch.props.title || sectionMatch.type];
    }
    for (const section of sections) {
      const compMatch = section.props.components?.find((c) => c.id === selectedId);
      if (compMatch) {
        return [section.props.title || section.type, compMatch.type];
      }
    }
    return null;
  }, [selectedId, sections]);
  const [isComponentsOpen, setIsComponentsOpen] = useState(false);
  const [activeDragType, setActiveDragType] = useState<string | null>(null);
  const [activeDragLabel, setActiveDragLabel] = useState<string | null>(null);
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);
  const [isGlobalsOpen, setIsGlobalsOpen] = useState(false);

  // Left Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarHoverOpen, setIsSidebarHoverOpen] = useState(false);
  const sidebarHoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const effectivelySidebarOpen = isSidebarOpen || isSidebarHoverOpen;

  useEffect(() => {
    if (effectivelySidebarOpen) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Don't trigger if hovering over interactive section controls
      if ((e.target as Element).closest?.('.no-sidebar-trigger')) {
        if (sidebarHoverTimerRef.current) {
          clearTimeout(sidebarHoverTimerRef.current);
          sidebarHoverTimerRef.current = null;
        }
        return;
      }

      if (e.clientX <= 48) {
        if (!sidebarHoverTimerRef.current) {
          sidebarHoverTimerRef.current = setTimeout(() => setIsSidebarHoverOpen(true), 200);
        }
      } else {
        if (sidebarHoverTimerRef.current) {
          clearTimeout(sidebarHoverTimerRef.current);
          sidebarHoverTimerRef.current = null;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (sidebarHoverTimerRef.current) {
        clearTimeout(sidebarHoverTimerRef.current);
        sidebarHoverTimerRef.current = null;
      }
    };
  }, [effectivelySidebarOpen]);
  const handleSidebarPanelMouseLeave = () => {
    if (!isSidebarOpen) setIsSidebarHoverOpen(false);
  };

  useEffect(() => {
    const handleCloseSidebars = () => {
      setIsSidebarOpen(false);
      setIsSidebarHoverOpen(false);
    };
    window.addEventListener('close-sidebars', handleCloseSidebars);
    return () => window.removeEventListener('close-sidebars', handleCloseSidebars);
  }, []);

  useEffect(() => {
    const handleTutorialAction = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      switch (detail) {
        case 'open-left-sidebar':
          setIsSidebarOpen(true);
          break;
        case 'open-templates':
          setActiveTab("components");
          setIsSavedTemplatesOpen(true);
          break;
        case 'open-components':
          setActiveTab("components");
          setIsComponentsOpen(true);
          break;
        case 'close-left-sidebar':
          setIsSidebarOpen(false);
          setIsSavedTemplatesOpen(false);
          setIsComponentsOpen(false);
          break;
        case 'select-and-open-inspector':
          if (useLuminaStore.getState().sections.length === 0) {
            useLuminaStore.getState().addSection("HeroBlock" as any);
          }
          setTimeout(() => {
            const currentSections = useLuminaStore.getState().sections;
            if (currentSections.length > 0) {
              setSelectedId(currentSections[0].id);
            }
          }, 0);
          break;
        case 'close-inspector':
          setSelectedId(null);
          break;
      }
    };
    window.addEventListener('tutorial-action', handleTutorialAction);
    return () => window.removeEventListener('tutorial-action', handleTutorialAction);
  }, []);

  const [isSavedTemplatesOpen, setIsSavedTemplatesOpen] = useState(false);
  const [localImages, setLocalImages] = useState<LocalImageItem[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<LibraryItem[]>([]);
  const pointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const dragTrackingRef = useRef(false);
  const localImageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LOCAL_IMAGE_STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as LocalImageItem[];
      if (Array.isArray(parsed)) {
        setLocalImages(parsed.filter((item) => typeof item?.src === "string" && typeof item?.label === "string"));
      }
    } catch {
      setLocalImages([]);
    }

    try {
      const storedTemplates = window.localStorage.getItem("lumina-added-components");
      if (storedTemplates) {
        const parsed = JSON.parse(storedTemplates) as LibraryItem[];
        if (Array.isArray(parsed)) {
          setSavedTemplates(parsed);
          // They are freeform components, no need to add to SECTION_INSERT_TYPES
        }
      }
    } catch {
      setSavedTemplates([]);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_IMAGE_STORAGE_KEY, JSON.stringify(localImages));
    } catch {
      // Ignore storage quota or private mode errors.
    }
  }, [localImages]);

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTION_LIBRARY;
    return SECTION_LIBRARY.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  const filteredSavedTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return savedTemplates;
    return savedTemplates.filter((item) => item.label.toLowerCase().includes(q));
  }, [savedTemplates, query]);

  const filteredGlobals = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GLOBAL_LIBRARY;
    return GLOBAL_LIBRARY.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);



  const filteredComponents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMPONENT_LIBRARY;
    return COMPONENT_LIBRARY.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  const filteredLocalImages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return localImages;
    return localImages.filter((item) => item.label.toLowerCase().includes(q));
  }, [localImages, query]);

  const handleLocalImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const src = typeof reader.result === "string" ? reader.result : "";
        if (!src) return;

        setLocalImages((current) => [
          {
            id: `local-image-${crypto.randomUUID()}`,
            label: file.name.replace(/\.[^.]+$/, ""),
            type: "Image",
            src,
            props: { src, size: 160 },
          },
          ...current,
        ]);
      };
      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  // Quick-add at a specific index (default: end)
  const handleInsertAt = (type: string, label: string, at?: number) => {
    if (!SECTION_INSERT_TYPES.has(type)) return;

    const currentAllSectionCanvasColor =
      typeof globalCanvasBackgroundColor === "string" && globalCanvasBackgroundColor !== "transparent"
        ? globalCanvasBackgroundColor
        :
        (sections.find((s) => {
          const color = (s.props.visuals as any)?.canvasBackgroundColor;
          return typeof color === "string" && color !== "transparent";
        })?.props.visuals?.canvasBackgroundColor as string | undefined) ??
        "transparent";

    const payload = {
      title: label,
      components: [{ type, props: {} }],
      visuals: {
        canvasBackgroundColor: currentAllSectionCanvasColor,
      },
    } as any;

    if (at !== undefined) {
      insertSectionAt(type as Parameters<typeof addSection>[0], at, payload);
    } else {
      addSection(type as Parameters<typeof addSection>[0], payload);
    }
  };

  const updateDragPreview = (event: DragMoveEvent | DragOverEvent) => {
    // Keep preview anchored to actual cursor movement; snapped deltas can drift.
    if (!pointerPosRef.current && startPosRef.current && event.delta) {
      const fallbackPos = { x: startPosRef.current.x + event.delta.x, y: startPosRef.current.y + event.delta.y };
      pointerPosRef.current = fallbackPos;
      setPointerPos(fallbackPos);
    }
    const type = event.active.data.current?.type;
    if (typeof type !== "string" || (!COMPONENT_LIBRARY.some((comp) => comp.type === type) && !BLOCK_COMPONENT_TYPES.has(type) && !savedTemplates.some((comp) => comp.type === type))) {
      setDragPreview(null);
      return;
    }

    let overId = event.over ? String(event.over.id) : "";

    // Fallback: If `dnd-kit` detects the sortable region instead of the inner drop zone,
    // explicitly alias it to the section-zone.
    if (!overId.startsWith("section-zone-") && !overId.startsWith("insert-zone-") && sections.some((s) => s.id === overId)) {
      overId = `section-zone-${overId}`;
    }

    if (!overId.startsWith("section-zone-")) {
      setDragPreview(null);
      return;
    }

    const overRect = event.over?.rect
      ? {
        left: event.over.rect.left,
        top: event.over.rect.top,
        width: event.over.rect.width,
        height: event.over.rect.height,
      }
      : null;

    const translatedRect = event.active.rect.current.translated
      ? {
        left: event.active.rect.current.translated.left,
        top: event.active.rect.current.translated.top,
        width: event.active.rect.current.translated.width,
        height: event.active.rect.current.translated.height,
      }
      : null;

    setDragPreview(getDropPreviewFromEvent(overId, overRect, translatedRect, type, pointerPosRef.current));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id);

    // Check if we're dragging a canvas section (reorder)
    const draggedSection = sections.find((s) => s.id === activeId);
    if (draggedSection) {
      setActiveSectionDrag(draggedSection);
      return; // no sidebar drag state needed
    }

    const type = event.active.data.current?.type;
    const label = event.active.data.current?.label;
    setActiveDragType(typeof type === "string" ? type : null);
    setActiveDragLabel(typeof label === "string" ? label : null);
    setDragPreview(null);

    const activator = event.activatorEvent as MouseEvent | PointerEvent | undefined;
    if (activator && typeof activator.clientX === "number" && typeof activator.clientY === "number") {
      const startPos = { x: activator.clientX, y: activator.clientY };
      startPosRef.current = startPos;
      pointerPosRef.current = startPos;
      setPointerPos(startPos);
    }

    if (!dragTrackingRef.current) {
      window.addEventListener("pointermove", handlePointerMove);
      dragTrackingRef.current = true;
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    const nextPos = { x: e.clientX, y: e.clientY };
    pointerPosRef.current = nextPos;
    setPointerPos(nextPos);
  };

  const resetDragState = () => {
    setActiveDragType(null);
    setActiveDragLabel(null);
    setDragPreview(null);
    setActiveSectionDrag(null);
    pointerPosRef.current = null;
    startPosRef.current = null;
    setPointerPos(null);
    if (dragTrackingRef.current) {
      window.removeEventListener("pointermove", handlePointerMove);
      dragTrackingRef.current = false;
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    updateDragPreview(event);
  };

  const handleDragOver = (event: DragOverEvent) => {
    updateDragPreview(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // ── Section reorder ──────────────────────────────────────────────
    if (activeSectionDrag) {
      if (over && active.id !== over.id) {
        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          reorderSections(oldIndex, newIndex);
        }
      }
      resetDragState();
      return;
    }

    // ── Sidebar → canvas drop ─────────────────────────────────────────
    if (!over) {
      resetDragState();
      return;
    }

    const type = active.data.current?.type;
    const label = active.data.current?.label;
    if (typeof type !== "string" || typeof label !== "string") {
      resetDragState();
      return;
    }

    let overId = String(over.id);

    // Fallback: If `dnd-kit` detects the sortable region instead of the inner drop zone,
    // explicitly alias it to the section-zone.
    if (!overId.startsWith("section-zone-") && !overId.startsWith("insert-zone-") && sections.some((s) => s.id === overId)) {
      overId = `section-zone-${overId}`;
    }

    // A type that belongs to the section library is always a new section insert —
    // never a freeform component — even if it also appears in BLOCK_COMPONENT_TYPES.
    const isSectionInsert = SECTION_INSERT_TYPES.has(type);
    const isComponent = !isSectionInsert && (
      COMPONENT_LIBRARY.some((comp) => comp.type === type) ||
      savedTemplates.some((comp) => comp.type === type)
    );
    const isBlockComponent = !isSectionInsert && BLOCK_COMPONENT_TYPES.has(type);
    const isAnyComponent = isComponent || isBlockComponent;

    // Pure freeform components are only valid inside a section drop zone.
    if (isAnyComponent && !overId.startsWith("section-zone-")) {
      resetDragState();
      return;
    }

    if (overId.startsWith("insert-zone-")) {
      // Drop into a specific gap
      const atIndex = parseInt(overId.replace("insert-zone-", ""), 10);
      handleInsertAt(type, label, atIndex);
    } else if (overId.startsWith("section-zone-")) {
      // Drop squarely onto a section
      const sectionId = overId.replace("section-zone-", "");
      if (isAnyComponent) {
        const dragProps = (active.data.current?.props as Record<string, unknown> | undefined) || {};
        const preview = dragPreview && dragPreview.sectionId === sectionId
          ? dragPreview
          : getDropPreviewFromEvent(
            overId,
            over.rect
              ? {
                left: over.rect.left,
                top: over.rect.top,
                width: over.rect.width,
                height: over.rect.height,
              }
              : null,
            active.rect.current.translated
              ? {
                left: active.rect.current.translated.left,
                top: active.rect.current.translated.top,
                width: active.rect.current.translated.width,
                height: active.rect.current.translated.height,
              }
              : null,
            type,
            pointerPosRef.current,
          );

        addFreeformElement(sectionId, {
          type: type as any,
          x: preview?.x ?? 50,
          y: preview?.y ?? 50,
          props:
            type === "Text"
              ? { text: "Text" }
              : type === "Button"
                ? { label: "Button" }
                : dragProps,
        });
      } else {
        const targetIndex = sections.findIndex((s) => s.id === sectionId);
        if (targetIndex >= 0) {
          const pointerY = getPointerY(
            pointerPosRef.current,
            active.rect.current.translated
              ? {
                top: active.rect.current.translated.top,
                height: active.rect.current.translated.height,
              }
              : null,
          );

          const insertAfter =
            typeof pointerY === "number" && over.rect
              ? pointerY > over.rect.top + over.rect.height / 2
              : true;

          handleInsertAt(type, label, targetIndex + (insertAfter ? 1 : 0));
        } else {
          handleInsertAt(type, label);
        }
      }
    } else {
      handleInsertAt(type, label);
    }

    resetDragState();
  };

  const handleDragCancel = () => {
    resetDragState();
  };

  useEffect(() => {
    const invalidSectionIds = sections
      .filter((section) => {
        const blockType = (section.props.components?.[0]?.type as string) || section.type;
        const invalidAsComponent = COMPONENT_TYPES.has(section.type) || COMPONENT_TYPES.has(blockType);
        const invalidAsUnknown =
          !SECTION_INSERT_TYPES.has(section.type) &&
          !SECTION_INSERT_TYPES.has(blockType) &&
          !BLOCK_COMPONENT_TYPES.has(section.type) &&
          !BLOCK_COMPONENT_TYPES.has(blockType);
        return invalidAsComponent || invalidAsUnknown;
      })
      .map((section) => section.id);

    if (invalidSectionIds.length === 0) return;
    invalidSectionIds.forEach((id) => removeSection(id));
  }, [sections, removeSection]);

  const isSectionDrag =
    !!activeDragType &&
    !COMPONENT_LIBRARY.some((item) => item.type === activeDragType) &&
    !BLOCK_COMPONENT_TYPES.has(activeDragType) &&
    !savedTemplates.some((item) => item.type === activeDragType) &&
    (SECTION_LIBRARY.some((item) => item.type === activeDragType) || GLOBAL_LIBRARY.some((item) => item.type === activeDragType));
  const isComponentDrag =
    !!activeDragType &&
    (COMPONENT_LIBRARY.some((item) => item.type === activeDragType) ||
      BLOCK_COMPONENT_TYPES.has(activeDragType) ||
      savedTemplates.some((item) => item.type === activeDragType));
  const shouldShowDragLabel =
    isSectionDrag || (isComponentDrag && !dragPreview);

  return (
    <>
      {showTutorial && (
        <AICursorTutorial
          onComplete={() => {
            setShowTutorial(false);
            localStorage.setItem('lumina-tutorial-done', 'true');
          }}
        />
      )}
      {/* Top bar with Preview/Edit toggle removed */}
      <DndContext
        id="lumina-dnd-context"
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        modifiers={activeSectionDrag ? [restrictToVerticalAxis] : []}
        collisionDetection={(args) => {
          // Fallback: If DND kit's measuring is broken by CSS scale, natively inspect the DOM.
          // It guarantees we pick up the droppable containers where the pointer literally is.
          if (pointerPosRef.current) {
            const elements = document.elementsFromPoint(pointerPosRef.current.x, pointerPosRef.current.y);
            for (const el of elements) {
              const id = el.id;
              if (id && id.startsWith("section-")) {
                const matchedContainer = args.droppableContainers.find(c => String(c.id) === id || String(c.id) === `section-zone-${id.replace("section-", "")}`);
                if (matchedContainer) return [{ id: matchedContainer.id, data: matchedContainer.data }];
              }
              // Can also match insert zones if needed
              if (id && id.startsWith("insert-zone-")) {
                const matchedContainer = args.droppableContainers.find(c => String(c.id) === id);
                if (matchedContainer) return [{ id: matchedContainer.id, data: matchedContainer.data }];
              }
            }
          }
          return pointerWithin(args);
        }}
      >
        {/* Ghost overlay while dragging */}
        <DragOverlay dropAnimation={null}>
          {activeSectionDrag ? (
            <SectionCard
              section={activeSectionDrag}
              isSelected={false}
              isLivePreview={false}
              dragPreview={null}
              onSelect={() => { }}
              onRemove={() => { }}
              isDragOverlay
            />
          ) : isComponentDrag && activeDragType && !dragPreview ? (
            <div className="opacity-80 scale-105 rounded-md ring-2 ring-violet-400/60 ring-offset-1 ring-offset-[#090909] pointer-events-none shadow-2xl">
              <DraggingComponentGhost type={activeDragType} />
            </div>
          ) : null}
        </DragOverlay>
        <div className="flex flex-col h-screen w-full bg-[#09090b] overflow-hidden text-foreground selection:bg-accent-glow/30">

          {/* ── Top Header ── */}
          {!isLivePreview && (
            <header
              id="tutorial-header"
              className="shrink-0 h-14 border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between px-4 z-50 bg-[#0a0a0c]/80 backdrop-blur-md"
              onClick={() => {
                setSelectedId(null);
                window.dispatchEvent(new CustomEvent('close-sidebars'));
              }}
            >
              <div className="flex items-center gap-4 group">
                <Link href="/" className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all p-1.5" title="Back to Landing Page">
                  <ChevronLeft size={16} />
                </Link>
                <div className="w-px h-5 bg-white/10" />
                <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] p-1">
                  <LuminaLogo invert />
                </div>
                <span className="text-sm font-bold tracking-tight text-white/90">Lumina Editor</span>
              </div>

              {/* Viewport Pill */}
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
                {/* Viewport mode toggles */}
                <button onClick={() => setViewMode("desktop")} className={`p-1.5 rounded-full transition-colors ${viewMode === "desktop" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/80"}`}><Monitor size={14} /></button>
                <button onClick={() => setViewMode("tablet")} className={`p-1.5 rounded-full transition-colors ${viewMode === "tablet" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/80"}`}><Tablet size={14} /></button>
                <button onClick={() => setViewMode("mobile")} className={`p-1.5 rounded-full transition-colors ${viewMode === "mobile" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/80"}`}><Smartphone size={14} /></button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <div className="flex items-center gap-1.5 px-2">
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoomLevel - 0.1))}
                    className="text-white/40 hover:text-white transition-colors"
                    title="Zoom Out"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-[11px] font-mono font-medium text-white/60 w-8 text-center cursor-pointer hover:text-white transition-colors" onClick={() => setZoom(1)}>
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(1.5, zoomLevel + 0.1))}
                    className="text-white/40 hover:text-white transition-colors"
                    title="Zoom In"
                  >
                    <Plus size={14} />
                  </button>
                  <div className="w-px h-3 bg-white/10 mx-1" />
                  <button
                    onClick={() => setZoom(1)}
                    className="text-white/40 hover:text-white transition-colors"
                    title="Reset Zoom"
                  >
                    <Maximize2 size={12} />
                  </button>
                </div>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button
                  onClick={() => undo()}
                  disabled={!past || past.length === 0}
                  className={`p-1.5 transition-colors ${!past || past.length === 0 ? "text-white/20 cursor-not-allowed" : "text-white/40 hover:text-white/80 cursor-pointer"}`}
                >
                  <Undo2 size={14} />
                </button>
                <button
                  onClick={() => redo()}
                  disabled={!future || future.length === 0}
                  className={`p-1.5 transition-colors ${!future || future.length === 0 ? "text-white/20 cursor-not-allowed" : "text-white/40 hover:text-white/80 cursor-pointer"}`}
                >
                  <Redo2 size={14} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLivePreview(!isLivePreview)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors duration-200 cursor-pointer ${isLivePreview
                    ? "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/50"
                    : "text-white/60 hover:text-white/90 bg-white/5 hover:bg-white/10 border border-white/10"
                    }`}
                >
                  {isLivePreview ? <Eye size={13} /> : <EyeOff size={13} />}
                  {isLivePreview ? "Exit Preview" : "Preview"}
                </button>
                <Link href="/dashboard/publish" className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-bold text-[#09090b] bg-accent-glow hover:bg-accent-glow/90 shadow-[0_0_15px_rgba(167,139,250,0.4)] transition-all">
                  <Globe size={13} />
                  Publish
                </Link>
              </div>
            </header>
          )}

          {/* Floating Exit Preview Button */}
          {isLivePreview && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => setLivePreview(false)}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0c]/90 backdrop-blur-md hover:bg-white/10 border border-white/20 hover:border-violet-500/50 rounded-full text-sm font-semibold text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all"
            >
              <EyeOff size={16} className="text-violet-400" />
              Exit Preview
            </motion.button>
          )}

          <div className="flex flex-1 overflow-hidden relative">

            {/* ── Left Sidebar ── */}
            {!isLivePreview && (
              <div
                className="fixed left-0 z-[60] flex"
                style={{ top: '56px', bottom: 0 }}
                onMouseLeave={handleSidebarPanelMouseLeave}
              >


                <motion.aside
                  initial={false}
                  animate={{ width: effectivelySidebarOpen ? 300 : 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                  onClick={() => setSelectedId(null)}
                  className="flex flex-col border-r border-white/10 bg-[#0a0a0c] z-50 flex-shrink-0 overflow-hidden h-full"
                >
                  <div className="w-[300px] h-full flex flex-col">
                    <div className="p-4 pb-0">
                      <div className="relative group mt-2">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 group-focus-within:text-violet-400 transition-colors" />
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search assets..."
                          className="w-full rounded-xl border border-white/10 bg-black/40 pl-9 pr-8 py-2 text-xs text-white/80 outline-none transition-all focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 placeholder:text-white/30"
                        />
                        <AnimatePresence>
                          {query && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.15 }}
                              onClick={() => setQuery("")}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
                            >
                              <X size={10} strokeWidth={2.5} />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Section / Components Toggle */}
                      <div className="mt-4 flex p-1 bg-black/40 rounded-lg border border-white/10 relative">
                        <motion.div
                          className="absolute inset-y-1 rounded-md bg-white/5 border border-white/10"
                          initial={false}
                          animate={{
                            left: activeTab === "sections" ? "4px" : "calc(50% + 2px)",
                            width: "calc(50% - 6px)"
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                        <button
                          onClick={() => setActiveTab("sections")}
                          className={`relative z-10 flex-1 py-1.5 text-[11px] font-semibold transition-colors ${activeTab === "sections" ? "text-white" : "text-white/40 hover:text-white/70"}`}
                        >
                          Sections
                        </button>
                        <button
                          onClick={() => setActiveTab("components")}
                          className={`relative z-10 flex-1 py-1.5 text-[11px] font-semibold transition-colors ${activeTab === "components" ? "text-white" : "text-white/40 hover:text-white/70"}`}
                        >
                          Components
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto thin-scrollbar mt-2">
                      <div className="p-4 pt-2">
                        {activeTab === "sections" ? (
                          <>
                            <button
                              onClick={() => {
                                const willOpen = !isGlobalsOpen;
                                setIsGlobalsOpen(willOpen);
                                if (willOpen) setIsSectionsOpen(false);
                              }}
                              className={`mb-3 px-1 w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest transition-colors ${isGlobalsOpen ? "text-white/75" : "text-white/30 hover:text-white/60"
                                }`}
                            >
                              Global Layout
                              <ChevronRight size={12} className={`transition-transform duration-200 ${isGlobalsOpen ? "rotate-90" : ""}`} />
                            </button>
                            <div className="mb-6">
                              <AnimatePresence initial={false}>
                                {isGlobalsOpen && (
                                  <motion.div
                                    key="globals-panel"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.22, ease: [0.2, 0.65, 0.3, 1] }}
                                    className="overflow-hidden"
                                  >
                                    <div className="space-y-2">
                                      {filteredGlobals.length > 0 ? (
                                        filteredGlobals.map((item) => (
                                          <DraggableSidebarItem key={item.id} item={item} />
                                        ))
                                      ) : (
                                        <div className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-center text-xs text-white/30">
                                          No global layouts found.
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>



                            <button
                              onClick={() => {
                                const willOpen = !isSectionsOpen;
                                setIsSectionsOpen(willOpen);
                                if (willOpen) setIsGlobalsOpen(false);
                              }}
                              className={`mb-3 px-1 w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest transition-colors ${isSectionsOpen ? "text-white/75" : "text-white/30 hover:text-white/60"
                                }`}
                            >
                              Built-in Layouts
                              <ChevronRight size={12} className={`transition-transform duration-200 ${isSectionsOpen ? "rotate-90" : ""}`} />
                            </button>
                            <div>
                              <AnimatePresence initial={false}>
                                {isSectionsOpen && (
                                  <motion.div
                                    key="sections-panel"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.22, ease: [0.2, 0.65, 0.3, 1] }}
                                    className="overflow-hidden"
                                  >
                                    <div className="space-y-2">
                                      {filteredSections.length > 0 ? (
                                        filteredSections.map((item) => (
                                          <DraggableSidebarItem key={item.id} item={item} />
                                        ))
                                      ) : (
                                        <div className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-center text-xs text-white/30">
                                          No sections found.
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Saved Components (Renamed and made Dropdown) */}
                            <button
                              id="tutorial-templates"
                              type="button"
                              onClick={() => {
                                const willOpen = !isSavedTemplatesOpen;
                                setIsSavedTemplatesOpen(willOpen);
                                if (willOpen) setIsComponentsOpen(false);
                              }}
                              className="mb-3 px-1 w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
                            >
                              Saved Components
                              <ChevronDown
                                size={12}
                                className={`transition-transform duration-200 ${isSavedTemplatesOpen ? "rotate-0" : "-rotate-90"}`}
                              />
                            </button>
                            <div className="mb-6">
                              <AnimatePresence initial={false}>
                                {isSavedTemplatesOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="space-y-4 overflow-hidden px-1 pb-3"
                                  >
                                    {/* Local / Add Image Area */}
                                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-3 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                                      <div className="flex items-center justify-between gap-3">
                                        <div>
                                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Local Images</p>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => localImageInputRef.current?.click()}
                                          className="shrink-0 rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-violet-200 transition-colors hover:bg-violet-500/20 hover:border-violet-500/50"
                                        >
                                          Add Image
                                        </button>
                                      </div>
                                      <input
                                        ref={localImageInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleLocalImageUpload}
                                      />
                                      <div className="mt-3 grid grid-cols-2 gap-2">
                                        {filteredLocalImages.length > 0 ? (
                                          filteredLocalImages.map((item) => (
                                            <DraggableSidebarItem key={item.id} item={item} variant="grid" />
                                          ))
                                        ) : (
                                          <div className="col-span-2 rounded-xl border border-dashed border-white/10 px-3 py-4 text-center text-xs text-white/30">
                                            No local images yet.
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Components Area */}
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between px-2">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Templates</p>
                                        {savedTemplates.length > 0 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              window.localStorage.removeItem("lumina-added-components");
                                              setSavedTemplates([]);
                                            }}
                                            className="text-[9px] font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                                          >
                                            Clear All
                                          </button>
                                        )}
                                      </div>
                                      {filteredSavedTemplates.length > 0 ? (
                                        filteredSavedTemplates.map((item) => (
                                          <DraggableSidebarItem key={item.id} item={item} />
                                        ))
                                      ) : (
                                        <div className="rounded-xl border border-dashed border-white/10 px-3 py-3 text-center text-[10px] text-white/30">
                                          No saved components yet. Visit the Components page.
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Base Components Dropdown */}
                            <button
                              id="tutorial-components"
                              type="button"
                              onClick={() => {
                                const willOpen = !isComponentsOpen;
                                setIsComponentsOpen(willOpen);
                                if (willOpen) setIsSavedTemplatesOpen(false);
                              }}
                              className="mb-3 px-1 w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
                            >
                              Components
                              <ChevronDown
                                size={12}
                                className={`transition-transform duration-200 ${isComponentsOpen ? "rotate-0" : "-rotate-90"}`}
                              />
                            </button>
                            <div className="space-y-2">
                              <AnimatePresence initial={false}>
                                {isComponentsOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="space-y-2 overflow-hidden px-3 pb-3"
                                  >
                                    {filteredComponents.length > 0 ? (
                                      filteredComponents.map((item) => (
                                        <DraggableSidebarItem key={item.id} item={item} />
                                      ))
                                    ) : (
                                      <div className="rounded-xl border border-dashed border-white/10 px-3 py-8 text-center text-xs text-white/30">
                                        No matching components.
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </>
                        )}
                        {activeTab === "layers" && (
                          <div className="pt-2">
                            <LayerTreePanel />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.aside>

                {/* Toggle button */}
                <button
                  id="tutorial-left-sidebar"
                  onClick={() => { setIsSidebarOpen(!isSidebarOpen); setIsSidebarHoverOpen(false); }}
                  className="self-center w-5 h-10 opacity-30 hover:opacity-100 bg-[#1a0f35] hover:bg-violet-500/40 border border-white/10 border-l-0 rounded-r-md flex items-center justify-center cursor-pointer transition-all group z-50 flex-shrink-0"
                  title={effectivelySidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                  {effectivelySidebarOpen ? (
                    <ChevronLeft size={12} className="text-white/50 group-hover:text-white" />
                  ) : (
                    <ChevronRight size={12} className="text-white/50 group-hover:text-white" />
                  )}
                </button>
              </div>
            )}

            {/* ── Canvas ── */}
            <div className="relative w-full h-full flex-1 flex flex-col min-w-0 min-h-0">
              {/* Global DnD canvas droppable (fallback) */}
              <CanvasDropZone>
                <CanvasViewport onCanvasClick={() => setSelectedId(null)}>
                  {sections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-28 rounded-3xl bg-white/[0.01] h-[500px]">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 shadow-lg">
                        <LayoutTemplate size={24} className="text-white/40" />
                      </div>
                      <p className="text-sm font-semibold text-white/60">Your canvas is blank</p>
                      <p className="text-xs text-white/30 mt-1 max-w-[200px] leading-relaxed mb-6">
                        Drag sections from the left panel, or click below to quick-add.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 max-w-sm" id="tutorial-quick-add">
                        {QUICK_ADD_SECTIONS.map((s) => (
                          <button
                            key={s.type}
                            onClick={(e) => { e.stopPropagation(); handleInsertAt(s.type, s.label); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-xs text-white/50 hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-violet-200 transition-all"
                          >
                            <s.icon size={12} />
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
                      <div className={`flex flex-col transition-all duration-500 gap-0`}>
                        {sections.map((section, idx) => (
                          <div key={section.id} className="contents">
                            {/* Insert zone BETWEEN sections */}
                            {!isLivePreview && idx !== 0 && !activeSectionDrag && (
                              <InsertBetweenButton
                                insertAt={idx}
                                onAdd={(type, label) => handleInsertAt(type, label, idx)}
                              />
                            )}

                            <SectionCard
                              section={section}
                              isSelected={selectedId === section.id}
                              isLivePreview={isLivePreview}
                              dragPreview={activeDragType && dragPreview?.sectionId === section.id ? dragPreview : null}
                              onSelect={() => setSelectedId(section.id)}
                              onRemove={() => removeSection(section.id)}
                            />
                          </div>
                        ))}

                        {/* Final insert zone after all sections */}
                        {!isLivePreview && !activeSectionDrag && (
                          <div id="tutorial-quick-add">
                            <InsertBetweenButton
                              insertAt={sections.length}
                              onAdd={(type, label) => handleInsertAt(type, label, sections.length)}
                            />
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  )}
                </CanvasViewport>
              </CanvasDropZone>

              {/* Component Breadcrumbs */}
              {!isLivePreview && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-8 bg-[#0a0a0c]/80 backdrop-blur-md flex items-center px-4 z-40 cursor-default"
                  onClick={() => setSelectedId(null)}
                >
                  {breadcrumbRoute ? (
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                      {breadcrumbRoute.map((item, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && <ChevronRight size={10} className="text-white/20" />}
                          <span className={index === breadcrumbRoute.length - 1 ? "text-accent-glow" : "text-white/40 cursor-pointer hover:text-white/60 transition-colors"}>
                            {item as string}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">No selection</span>
                  )}
                </div>
              )}
            </div>

            {/* ── Right Inspector ── */}
            {!isLivePreview && <PropertyInspector />}

          </div>
        </div>

        {shouldShowDragLabel && activeDragLabel && pointerPos && (
          <div
            className="fixed z-[120] pointer-events-none"
            style={{ left: pointerPos.x, top: pointerPos.y, transform: "translate(-50%, -50%)" }}
          >
            <div className="px-3 py-1.5 rounded-full border border-violet-400/50 bg-[#1a0f35]/90 text-violet-100 text-xs font-semibold tracking-wide shadow-[0_0_20px_rgba(139,92,246,0.35)] whitespace-nowrap">
              {activeDragLabel}
            </div>
          </div>
        )}
      </DndContext>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas Drop Zone (fallback)
// ─────────────────────────────────────────────────────────────────────────────

function CanvasDropZone({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-drop-zone" });

  return (
    <div
      ref={setNodeRef}
      className={`relative w-full h-full flex-1 flex flex-col transition-colors ${isOver ? "bg-violet-500/[0.03]" : ""
        }`}
    >
      {children}
      {isOver && (
        <div className="absolute inset-0 z-50 pointer-events-none border-2 border-dashed border-violet-500/30 rounded-none" />
      )}
    </div>
  );
}

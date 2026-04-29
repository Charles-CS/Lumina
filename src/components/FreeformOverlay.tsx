"use client";

import React, { useState, useEffect } from "react";
import { FreeformElement, useLuminaStore } from "@/store/useLuminaStore";
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, Search } from "lucide-react";

const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80",
];

type SectionTypography = {
  fontSize?: number | string;
  lineHeight?: number | string;
  color?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  letterSpacing?: number | string;
  textAlign?: string;
};

interface FreeformOverlayProps {
  sectionId: string;
  elements: FreeformElement[];
  layer?: "front" | "back";
  captureContextMenu?: boolean;
  sectionTypography?: SectionTypography;
  sectionLayout?: {
    paddingX?: number;
    gap?: number;
    maxWidth?: string;
  };
  sectionPaddingY?: number;
  defaultPaddingY?: number;
  className?: string;
  readOnly?: boolean;
}

type FreeformClipboardItem = {
  type: string;
  props: Record<string, any>;
  x: number;
  y: number;
};

type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

function getImageShadowPreset(shadow: string) {
  switch (shadow) {
    case "none":
      return "none";
    case "sm":
      return "0 6px 18px rgba(0, 0, 0, 0.18)";
    case "lg":
      return "0 20px 45px rgba(0, 0, 0, 0.35)";
    case "glow":
      return "0 0 18px rgba(167, 139, 250, 0.35), 0 20px 45px rgba(0, 0, 0, 0.28)";
    case "md":
    default:
      return "0 12px 30px rgba(0, 0, 0, 0.28)";
  }
}

let freeformClipboard: FreeformClipboardItem | null = null;

export function FreeformOverlay({
  sectionId,
  elements,
  layer = "front",
  captureContextMenu = true,
  sectionTypography,
  sectionLayout,
  sectionPaddingY,
  defaultPaddingY,
  className,
  readOnly = false,
}: FreeformOverlayProps) {
  const { selectedId, setSelectedId, updateFreeformElement, addFreeformElement, removeFreeformElement, isLivePreview, viewMode } = useLuminaStore();
  const effectiveReadOnly = readOnly || isLivePreview;
  const [mobileMenuOpenId, setMobileMenuOpenId] = React.useState<string | null>(null);
  const [dragState, setDragState] = useState<{ id: string; startX: number; startY: number; initialX: number; initialY: number; width: number; height: number } | null>(null);
  const [resizeState, setResizeState] = useState<{
    id: string;
    edge: ResizeEdge;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    initialWidth: number;
    initialHeight: number;
    initialProps: Record<string, any>;
  } | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    mode: "section" | "element";
    elementId?: string;
    pasteX?: number;
    pasteY?: number;
  } | null>(null);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);

  const getElementLayer = (element: FreeformElement) => {
    if (element.type === "Image" && (element.props?.layer || "front") === "back") {
      return "back";
    }
    return "front";
  };

  const visibleElements = elements.filter((element) => getElementLayer(element) === layer);
  const backLayerElements = layer === "front"
    ? elements.filter((element) => getElementLayer(element) === "back" && element.type === "Image")
    : [];
  const frameOffsetX = (sectionLayout?.paddingX ?? 32) - 32;
  const frameOffsetY = (sectionPaddingY ?? defaultPaddingY ?? 80) - (defaultPaddingY ?? 80);

  const isInputFocused = () => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    return tag === "input" || tag === "textarea" || el.isContentEditable;
  };

  const cloneProps = (props: Record<string, any>) => {
    try {
      return JSON.parse(JSON.stringify(props)) as Record<string, any>;
    } catch {
      return { ...props };
    }
  };

  const copyElement = (element: FreeformElement) => {
    freeformClipboard = {
      type: element.type,
      props: cloneProps(element.props || {}),
      x: element.x,
      y: element.y,
    };
  };

  const pasteElement = (anchorElement?: FreeformElement | null, position?: { x: number; y: number }) => {
    if (!freeformClipboard) return;
    const baseX = position?.x ?? (anchorElement ? anchorElement.x + frameOffsetX : freeformClipboard.x + frameOffsetX);
    const baseY = position?.y ?? (anchorElement ? anchorElement.y + frameOffsetY : freeformClipboard.y + frameOffsetY);
    addFreeformElement(sectionId, {
      type: freeformClipboard.type as "Text" | "Button" | "Image",
      props: cloneProps(freeformClipboard.props),
      x: baseX + 24 - frameOffsetX,
      y: baseY + 24 - frameOffsetY,
    });
  };

  const cutElement = (element: FreeformElement) => {
    copyElement(element);
    removeFreeformElement(sectionId, element.id);
    if (selectedId === element.id) {
      setSelectedId(null);
    }
  };

  const getElementSize = (elementId: string) => {
    const overlayEl = overlayRef.current;
    if (!overlayEl) return null;
    const target = overlayEl.querySelector(`[data-freeform-id="${elementId}"]`) as HTMLDivElement | null;
    if (!target) return null;
    const content = target.querySelector('[data-freeform-content="true"]') as HTMLDivElement | null;
    const width = Math.round(content?.offsetWidth ?? target.offsetWidth);
    const height = Math.round(content?.offsetHeight ?? target.offsetHeight);
    return { width, height };
  };

  const clampToOverlay = (elementId: string, x: number, y: number, measured?: { width: number; height: number }) => {
    const overlayEl = overlayRef.current;
    if (!overlayEl) return { x, y };

    const size = measured ?? getElementSize(elementId);
    if (!size) return { x, y };

    const maxX = Math.max(0, overlayEl.clientWidth - size.width);
    const maxY = Math.max(0, overlayEl.clientHeight - size.height);

    return {
      x: Math.min(Math.max(x, 0), maxX),
      y: Math.min(Math.max(y, 0), maxY),
    };
  };

  const nudgeElement = (elementId: string, dx: number, dy: number) => {
    const element = visibleElements.find((el) => el.id === elementId);
    if (!element) return;
    const next = clampToOverlay(elementId, element.x + frameOffsetX + dx, element.y + frameOffsetY + dy);
    updateFreeformElement(sectionId, elementId, { x: next.x - frameOffsetX, y: next.y - frameOffsetY });
  };

  const handleNudge = (e: React.MouseEvent, elementId: string, dx: number, dy: number) => {
    e.stopPropagation();
    nudgeElement(elementId, dx, dy);
  };

  const handlePointerDown = (e: React.PointerEvent, element: FreeformElement) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    if (resizeState) return;
    setContextMenu(null);
    setSelectedId(element.id);
    const host = e.currentTarget as HTMLDivElement;
    const content = host.querySelector('[data-freeform-content="true"]') as HTMLDivElement | null;
    const width = Math.round(content?.offsetWidth ?? host.offsetWidth);
    const height = Math.round(content?.offsetHeight ?? host.offsetHeight);
    setDragState({
      id: element.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: element.x + frameOffsetX,
      initialY: element.y + frameOffsetY,
      width,
      height,
    });
  };

  const handleOverlayContextMenu = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest("[data-freeform-id]")) return;

    e.preventDefault();
    e.stopPropagation();

    const overlayRect = overlayRef.current?.getBoundingClientRect();
    if (!overlayRect) return;

    const pasteX = e.clientX - overlayRect.left;
    const pasteY = e.clientY - overlayRect.top;
    const menuWidth = 140;
    const menuHeight = freeformClipboard ? 110 : 56;
    const nextX = Math.min(Math.max(pasteX + 8, 8), overlayRect.width - menuWidth - 8);
    const nextY = Math.min(Math.max(pasteY + 8, 8), overlayRect.height - menuHeight - 8);

    setContextMenu({
      x: nextX,
      y: nextY,
      mode: "section",
      pasteX,
      pasteY,
    });
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!dragState) return;
      const scale = (window as any).__lumina_canvas_scale || 1;
      const dx = (e.clientX - dragState.startX) / scale;
      const dy = (e.clientY - dragState.startY) / scale;
      const next = clampToOverlay(
        dragState.id,
        dragState.initialX + dx,
        dragState.initialY + dy,
        { width: dragState.width, height: dragState.height }
      );
      updateFreeformElement(sectionId, dragState.id, {
        x: next.x - frameOffsetX,
        y: next.y - frameOffsetY,
      });
    };

    const handlePointerUp = () => setDragState(null);

    if (dragState) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragState, frameOffsetX, frameOffsetY, sectionId, updateFreeformElement]);

  useEffect(() => {
    const handleResizeMove = (e: PointerEvent) => {
      if (!resizeState) return;

      const overlayEl = overlayRef.current;
      if (!overlayEl) return;

      const scale = (window as any).__lumina_canvas_scale || 1;
      const dx = (e.clientX - resizeState.startX) / scale;
      const dy = (e.clientY - resizeState.startY) / scale;

      let nextX = resizeState.initialX;
      let nextY = resizeState.initialY;
      let nextWidth = resizeState.initialWidth;
      let nextHeight = resizeState.initialHeight;

      if (resizeState.edge.includes("e")) nextWidth = resizeState.initialWidth + dx;
      if (resizeState.edge.includes("s")) nextHeight = resizeState.initialHeight + dy;
      if (resizeState.edge.includes("w")) {
        nextWidth = resizeState.initialWidth - dx;
        nextX = resizeState.initialX + dx;
      }
      if (resizeState.edge.includes("n")) {
        nextHeight = resizeState.initialHeight - dy;
        nextY = resizeState.initialY + dy;
      }

      const minSize = 24;

      if (nextWidth < minSize) {
        if (resizeState.edge.includes("w")) {
          nextX = resizeState.initialX + (resizeState.initialWidth - minSize);
        }
        nextWidth = minSize;
      }

      if (nextHeight < minSize) {
        if (resizeState.edge.includes("n")) {
          nextY = resizeState.initialY + (resizeState.initialHeight - minSize);
        }
        nextHeight = minSize;
      }

      if (nextX < 0) {
        if (resizeState.edge.includes("w")) {
          nextWidth += nextX;
        }
        nextX = 0;
      }

      if (nextY < 0) {
        if (resizeState.edge.includes("n")) {
          nextHeight += nextY;
        }
        nextY = 0;
      }

      if (nextX + nextWidth > overlayEl.clientWidth) {
        if (resizeState.edge.includes("e")) {
          nextWidth = overlayEl.clientWidth - nextX;
        } else {
          nextX = overlayEl.clientWidth - nextWidth;
        }
      }

      if (nextY + nextHeight > overlayEl.clientHeight) {
        if (resizeState.edge.includes("s")) {
          nextHeight = overlayEl.clientHeight - nextY;
        } else {
          nextY = overlayEl.clientHeight - nextHeight;
        }
      }

      nextWidth = Math.max(minSize, nextWidth);
      nextHeight = Math.max(minSize, nextHeight);

      updateFreeformElement(sectionId, resizeState.id, {
        x: Math.round(nextX - frameOffsetX),
        y: Math.round(nextY - frameOffsetY),
        props: {
          ...resizeState.initialProps,
          width: Math.round(nextWidth),
          height: Math.round(nextHeight),
        },
      });
    };

    const handleResizeEnd = () => setResizeState(null);

    if (resizeState) {
      window.addEventListener("pointermove", handleResizeMove);
      window.addEventListener("pointerup", handleResizeEnd);
    }

    return () => {
      window.removeEventListener("pointermove", handleResizeMove);
      window.removeEventListener("pointerup", handleResizeEnd);
    };
  }, [frameOffsetX, frameOffsetY, resizeState, sectionId, updateFreeformElement]);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContextMenu(null);
    };

    window.addEventListener("pointerdown", closeMenu);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("pointerdown", closeMenu);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    const selected = visibleElements.find((el) => el.id === selectedId);
    if (!selected) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (isInputFocused()) return;

      const key = e.key.toLowerCase();
      if (key === "c") {
        e.preventDefault();
        copyElement(selected);
        return;
      }
      if (key === "v") {
        e.preventDefault();
        pasteElement(selected);
        return;
      }
      if (key === "x") {
        e.preventDefault();
        cutElement(selected);
      }
    };

    const onActionKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      if (isInputFocused()) return;

      const key = e.key.toLowerCase();
      if (key === "delete" || key === "backspace") {
        e.preventDefault();
        const store = useLuminaStore.getState();
        store.removeFreeformElement(sectionId, selected.id);
        store.setSelectedId(null);
        return;
      }

      if (key === "arrowup") {
        e.preventDefault();
        nudgeElement(selected.id, 0, -1);
        return;
      }
      if (key === "arrowdown") {
        e.preventDefault();
        nudgeElement(selected.id, 0, 1);
        return;
      }
      if (key === "arrowleft") {
        e.preventDefault();
        nudgeElement(selected.id, -1, 0);
        return;
      }
      if (key === "arrowright") {
        e.preventDefault();
        nudgeElement(selected.id, 1, 0);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keydown", onActionKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keydown", onActionKeyDown);
    };
  }, [visibleElements, selectedId]);

  const renderComponent = (element: FreeformElement) => {
    const p = element.props;
    const bgColor = typeof p.backgroundColor === "string" && p.backgroundColor.length > 0 ? p.backgroundColor : undefined;
    const inheritedFontFamily = sectionTypography?.fontFamily;
    const inheritedFontSize = sectionTypography?.fontSize !== undefined
      ? `${Number(sectionTypography.fontSize)}px`
      : undefined;
    const inheritedLetterSpacing = sectionTypography?.letterSpacing !== undefined
      ? `${Number(sectionTypography.letterSpacing)}px`
      : undefined;
    const inheritedLineHeight = sectionTypography?.lineHeight !== undefined
      ? Number(sectionTypography.lineHeight)
      : undefined;
    const fontFamily = p.fontFamily || inheritedFontFamily;
    const resolvedFontFamily = fontFamily === "serif"
      ? 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
      : fontFamily === "mono"
        ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
        : fontFamily === "sans"
          ? 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
          : undefined;

    const style: React.CSSProperties = {
      color: p.color || sectionTypography?.color || undefined,
      fontSize: p.fontSize ? `${p.fontSize}px` : inheritedFontSize,
      fontWeight: p.fontWeight || sectionTypography?.fontWeight || undefined,
      fontFamily: resolvedFontFamily,
      letterSpacing: p.letterSpacing !== undefined ? `${p.letterSpacing}px` : inheritedLetterSpacing,
      lineHeight: p.lineHeight !== undefined ? Number(p.lineHeight) : inheritedLineHeight,
      textAlign: p.textAlign || sectionTypography?.textAlign || undefined,
    };

    // Determine optional cascading styles manually removed from tailwind
    const r = p.borderRadius !== undefined ? `${p.borderRadius}px` : "16px";
    const accent = p.accentColor || "#8b5cf6"; // default violet-500

    switch (element.type as string) {
      case "Text": return <span style={style} className={"font-medium drop-shadow-sm"}>{p.text || "Your Text Here"}</span>;
      case "Button": return <button style={{ ...style, backgroundColor: accent, borderRadius: r }} className={"px-5 py-2.5 transition font-medium shadow-md w-full h-full"}>{p.label || "Click Me"}</button>;
      case "Image": {
        const isMobileSmartFit = viewMode === "mobile" && !p.width;
        const imageWidth = isMobileSmartFit ? "100%" : Math.max(24, Number(p.width ?? p.size ?? 128));
        const imageHeight = isMobileSmartFit ? "auto" : Math.max(24, Number(p.height ?? p.size ?? 128));
        const imageOpacity = Math.min(Math.max(Number(p.opacity ?? 100), 0), 100) / 100;
        const borderWeight = Math.max(0, Number(p.borderWeight ?? 0));
        const borderStyle = String(p.borderStyle || "solid");
        const borderColor = String(p.borderColor || "rgba(255,255,255,0.16)");
        const shadow = String(p.shadow || "md");
        return (
          <div
            className={"bg-neutral-800 flex items-center justify-center overflow-hidden"}
            style={{
              width: isMobileSmartFit ? "100%" : `${imageWidth}px`,
              height: isMobileSmartFit ? "auto" : `${imageHeight}px`,
              minHeight: isMobileSmartFit ? "80px" : undefined,
              aspectRatio: isMobileSmartFit ? "16 / 9" : undefined,
              backgroundColor: bgColor,
              opacity: imageOpacity,
              borderWidth: borderWeight,
              borderStyle: borderWeight > 0 && borderStyle !== "none" ? borderStyle as React.CSSProperties["borderStyle"] : "solid",
              borderColor: borderWeight > 0 ? borderColor : "transparent",
              boxShadow: getImageShadowPreset(shadow),
              borderRadius: r,
            }}
          >
            {p.src ? <img src={p.src} alt={""} className={"w-full h-full object-cover"} /> : <span style={{ ...style, opacity: 0.3 }}>Image Area</span>}
          </div>
        );
      }
      case "Input": return <input style={{ ...style, backgroundColor: bgColor, borderRadius: r, borderColor: p.borderColor || "rgba(255,255,255,0.2)" }} type={"text"} placeholder={p.placeholder || "Enter text..."} className={"px-4 py-2 border w-full h-full"} readOnly />;
      case "Textarea": return <textarea style={{ ...style, backgroundColor: bgColor, borderRadius: r, borderColor: p.borderColor || "rgba(255,255,255,0.2)" }} placeholder={p.placeholder || "Type your message..."} className={"px-4 py-2 border resize-none w-full h-full"} readOnly />;
      case "Select": return <select style={{ ...style, backgroundColor: bgColor, borderRadius: r, borderColor: p.borderColor || "rgba(255,255,255,0.2)" }} className={"px-4 py-2 border appearance-none w-full h-full"} disabled><option>{p.placeholder || "Select an option..."}</option></select>;
      case "Checkbox": return <label className={"flex items-center gap-2 cursor-pointer pointer-events-none"}><input type={"checkbox"} className={"w-4 h-4 rounded border-gray-300 focus:ring-violet-600"} style={{ color: accent }} disabled /><span style={style} className={"font-medium"}>{p.label || p.text || "Accept terms"}</span></label>;
      case "Avatar": return <div style={{ ...style, backgroundColor: accent, borderRadius: r }} className={"flex items-center justify-center font-bold shadow-sm w-full h-full"}>{p.text || "AB"}</div>;
      case "Badge": return <span style={{ ...style, backgroundColor: `${accent}33`, borderColor: `${accent}4D`, color: accent, borderRadius: r }} className={"px-2.5 py-1 border font-bold uppercase tracking-wider shadow-sm"}>{p.text || "Premium"}</span>;
      case "Icon": return <div style={{ ...style, backgroundColor: bgColor, borderRadius: r }} className={"flex items-center justify-center border border-white/10 opacity-50 shadow-sm w-full h-full"}>{p.icon || "?"}</div>;
      case "Navbar": {
        const isMobileView = viewMode === "mobile";
        const isMenuOpen = mobileMenuOpenId === element.id;
        const navLinks: string[] = p.links || ["Home", "Features", "Pricing"];
        const hamburgerColor = p.color || "rgba(255,255,255,0.8)";
        return (
          <div
            style={{ ...style, backgroundColor: bgColor || "#0a0a0a", borderRadius: r, position: "relative" }}
            className="w-full h-full border border-white/10 flex items-center justify-between px-6 shadow-2xl backdrop-blur-md overflow-visible"
          >
            {/* Brand */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span style={{ color: p.color, fontSize: p.fontSize }} className="font-bold whitespace-nowrap">
                {p.brand || "Brand"}
              </span>
            </div>

            {/* Desktop links */}
            {!isMobileView && (
              <div className="flex items-center" style={{ gap: p.gap || 16 }}>
                {navLinks.map((link: string, i: number) => (
                  <span key={i} style={{ color: p.color || "rgba(255,255,255,0.6)" }} className="whitespace-nowrap text-sm">
                    {link}
                  </span>
                ))}
              </div>
            )}

            {/* Right side: hamburger on mobile, CTA button on desktop */}
            <div className="flex items-center gap-3">
              {isMobileView ? (
                /* Hamburger button */
                <button
                  onClick={() => setMobileMenuOpenId(isMenuOpen ? null : element.id)}
                  className="flex flex-col justify-center items-center gap-[5px] w-8 h-8 pointer-events-auto"
                  style={{ color: hamburgerColor }}
                  title="Toggle menu"
                >
                  <span
                    className="block w-5 h-[1.5px] transition-all duration-200 origin-center"
                    style={{
                      backgroundColor: hamburgerColor,
                      transform: isMenuOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
                    }}
                  />
                  <span
                    className="block w-5 h-[1.5px] transition-all duration-200"
                    style={{ backgroundColor: hamburgerColor, opacity: isMenuOpen ? 0 : 1 }}
                  />
                  <span
                    className="block w-5 h-[1.5px] transition-all duration-200 origin-center"
                    style={{
                      backgroundColor: hamburgerColor,
                      transform: isMenuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none",
                    }}
                  />
                </button>
              ) : (
                <button
                  style={{
                    backgroundColor: p.accentColor || accent,
                    color: p.color || "#fff",
                    borderRadius: p.borderRadius ? `${Math.max(4, Number(p.borderRadius) - 4)}px` : "8px",
                  }}
                  className="px-3 py-1.5 border border-white/10 whitespace-nowrap text-sm"
                >
                  {p.buttonText || "Get Started"}
                </button>
              )}
            </div>

            {/* Mobile dropdown (only when open) */}
            {isMobileView && isMenuOpen && (
              <div
                className="absolute top-full left-0 right-0 border border-white/10 border-t-0 shadow-2xl z-50 pointer-events-auto"
                style={{ backgroundColor: bgColor || "#0a0a0a", borderRadius: `0 0 ${r} ${r}` }}
              >
                {navLinks.map((link: string, i: number) => (
                  <div
                    key={i}
                    className="px-6 py-3 border-b border-white/5 last:border-b-0 text-sm hover:bg-white/5 transition-colors"
                    style={{ color: p.color || "rgba(255,255,255,0.7)" }}
                  >
                    {link}
                  </div>
                ))}
                <div className="px-6 py-3">
                  <button
                    style={{
                      backgroundColor: p.accentColor || accent,
                      color: p.color || "#fff",
                      borderRadius: p.borderRadius ? `${Math.max(4, Number(p.borderRadius) - 4)}px` : "8px",
                    }}
                    className="w-full px-4 py-2 text-sm font-semibold"
                  >
                    {p.buttonText || "Get Started"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }
      case "PricingCard": return <div style={{ ...style, backgroundColor: bgColor || "#0a0a0a", borderRadius: r }} className="w-full h-full border border-white/10 p-6 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.5)]"><div className="space-y-4"><span style={{ backgroundColor: `${accent}33`, borderColor: `${accent}4D`, color: accent }} className="px-2.5 py-1 font-bold rounded-full uppercase tracking-widest border">{p.badge || "Pro Plan"}</span><br /><div style={{ color: p.color || "#fff" }} className="text-3xl font-black mt-2">{p.price || "$29"}<span className="text-sm font-medium opacity-40">{p.period || "/mo"}</span></div><p style={{ color: p.color || "rgba(255,255,255,0.5)" }} className="leading-relaxed">{p.description || "Everything you need to launch your next big idea."}</p></div><button style={{ backgroundColor: p.color || "#fff", color: bgColor || "#000", borderRadius: p.borderRadius ? `${Math.max(4, Number(p.borderRadius) - 4)}px` : "8px" }} className="w-full py-2.5 font-semibold hover:opacity-90">{p.buttonText || "Upgrade Now"}</button></div>;
      case "GlowingButton": return <button style={{ ...style, backgroundColor: accent, borderRadius: r, boxShadow: `0 0 20px ${accent}80` }} className="w-full h-full flex items-center justify-center font-bold border border-white/20 transition-all">{p.text || "Click to Start"}</button>;
      case "Menu": return <div style={{ ...style, backgroundColor: bgColor || "#0a0a0a", gap: p.gap || 4, borderRadius: r }} className="w-full h-full border border-white/10 p-2 flex flex-col shadow-2xl overflow-hidden">{(p.menuItems || [{ label: "Profile", shortcut: "⇧⌘P" }, { label: "Settings", shortcut: "⌘S" }]).map((m: any, i: number) => <div key={i} className="px-3 py-2 hover:bg-white/5 rounded-lg opacity-80 flex justify-between tracking-wide"><span style={style}>{m.label}</span><span style={{ ...style, opacity: 0.3 }}>{m.shortcut}</span></div>)}<div className="h-px w-full bg-white/5 my-1" /><div className="px-3 py-2 hover:bg-red-500/10 text-red-400 rounded-lg tracking-wide">Log out</div></div>;
      case "Timeline": return <div style={{ ...style, backgroundColor: bgColor || "transparent", gap: p.gap || 16 }} className="w-full h-full flex flex-col overflow-hidden">{(p.timelineItems || [{ title: "Project Initiated", date: "Q1 2024" }, { title: "Beta Launch", date: "Q2 2024" }]).map((m: any, i: number) => <div key={i} className="flex gap-3"><div className="flex flex-col items-center"><div style={{ backgroundColor: accent, borderColor: bgColor || "#000", boxShadow: `0 0 0 1px ${accent}80` }} className="w-3 h-3 rounded-full border-[3px]" />{i !== (p.timelineItems?.length || 2) - 1 && <div className="w-px h-full bg-white/10 mt-1" />}</div><div className="pb-4"><p style={style} className="font-bold mb-1">{m.title}</p><p style={{ ...style, opacity: 0.4 }}>{m.date}</p></div></div>)}</div>;
      case "DialGauge": return <div style={{ ...style, backgroundColor: bgColor || "#0a0a0a", borderRadius: r }} className="w-full h-full border border-white/10 flex flex-col items-center justify-center p-4 relative overflow-hidden"><div className="w-32 h-32 rounded-full border-[12px] border-white/5 relative flex items-center justify-center"><div style={{ borderTopColor: accent, borderRightColor: `${accent}80` }} className="absolute w-full h-full rounded-full border-[12px] border-transparent rotate-45" /><div style={style} className="text-3xl font-black">{p.value || "4"}<span className="font-medium opacity-30 block text-center -mt-1">{p.label || "UV Level"}</span></div></div></div>;
      case "WeatherWidget": return <div style={{ ...style, backgroundColor: bgColor || "#121212", borderRadius: r }} className="w-full h-full shadow-[5px_5px_15px_rgba(0,0,0,0.5),-5px_-5px_15px_rgba(255,255,255,0.02)] border border-white/5 p-5 flex flex-col justify-between"><div className="flex justify-between items-start"><div style={{ color: p.color || "rgba(255,255,255,0.6)" }} className="font-medium uppercase tracking-widest">{p.heading || "Today"}</div><div style={{ backgroundColor: `${accent}33` }} className="w-8 h-8 rounded-full blur-sm relative"><div style={{ backgroundColor: accent }} className="absolute inset-2 rounded-full blur-[2px]" /></div></div><div style={style} className="text-5xl font-light tracking-tighter">{p.temp || "72°"}</div></div>;
      case "WebGLBackground": return <div style={{ ...style, backgroundColor: bgColor || "#000", borderRadius: r }} className="w-full h-full border border-white/10 overflow-hidden relative shadow-2xl"><style>{`@keyframes webgl-blob-1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(15%,10%) scale(1.15)}66%{transform:translate(-10%,15%) scale(0.9)}}@keyframes webgl-blob-2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-20%,-10%) scale(1.1)}66%{transform:translate(10%,-15%) scale(0.95)}}@keyframes webgl-blob-3{0%,100%{transform:translate(0,0) scale(0.9)}50%{transform:translate(5%,-20%) scale(1.1)}}`}</style><div className="absolute inset-0 opacity-50 mix-blend-screen" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${accent} 0%, transparent 55%)`, filter: "blur(50px)", animation: "webgl-blob-1 8s ease-in-out infinite" }} /><div className="absolute inset-0 opacity-35 mix-blend-screen" style={{ backgroundImage: `radial-gradient(circle at 30% 70%, #ec4899 0%, transparent 50%)`, filter: "blur(45px)", animation: "webgl-blob-2 10s ease-in-out infinite" }} /><div className="absolute inset-0 opacity-25 mix-blend-screen" style={{ backgroundImage: `radial-gradient(circle at 70% 30%, #06b6d4 0%, transparent 50%)`, filter: "blur(40px)", animation: "webgl-blob-3 12s ease-in-out infinite" }} /><div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:16px_16px]" /></div>;
      case "BokehGradient": return <div style={{ ...style, backgroundColor: bgColor || "#050510", borderRadius: r }} className="w-full h-full overflow-hidden relative border border-white/5 shadow-2xl"><style>{`@keyframes bokeh-float-1{0%,100%{transform:translate(0,0) scale(1);opacity:0.5}50%{transform:translate(20px,-15px) scale(1.15);opacity:0.7}}@keyframes bokeh-float-2{0%,100%{transform:translate(0,0) scale(1);opacity:0.4}50%{transform:translate(-15px,20px) scale(1.1);opacity:0.6}}@keyframes bokeh-float-3{0%,100%{transform:translate(0,0) scale(0.9);opacity:0.3}50%{transform:translate(10px,10px) scale(1.05);opacity:0.5}}@keyframes bokeh-float-4{0%,100%{transform:translate(0,0) scale(1);opacity:0.25}50%{transform:translate(-10px,-10px) scale(1.2);opacity:0.45}}`}</style><div style={{ background: `radial-gradient(circle at center, ${accent}88 0, transparent 70%)`, animation: "bokeh-float-1 7s ease-in-out infinite" }} className="w-[60%] h-[60%] absolute top-[10%] left-[15%] rounded-full blur-2xl" /><div style={{ background: "radial-gradient(circle at center, rgba(236,72,153,0.5) 0, transparent 70%)", animation: "bokeh-float-2 9s ease-in-out infinite" }} className="w-[45%] h-[45%] absolute top-[40%] right-[10%] rounded-full blur-2xl" /><div style={{ background: "radial-gradient(circle at center, rgba(6,182,212,0.4) 0, transparent 70%)", animation: "bokeh-float-3 11s ease-in-out infinite" }} className="w-[35%] h-[35%] absolute bottom-[15%] left-[5%] rounded-full blur-xl" /><div style={{ background: `radial-gradient(circle at center, ${accent}44 0, transparent 70%)`, animation: "bokeh-float-4 8s ease-in-out infinite" }} className="w-[50%] h-[50%] absolute top-[5%] right-[20%] rounded-full blur-2xl" /></div>;
      case "CatalogMenu": return <div style={{ ...style, backgroundColor: bgColor || "#0a0a0a", gap: p.gap || 16, borderRadius: r }} className="w-full h-full border border-white/10 p-4 shadow-2xl flex"><div className="w-1/3 flex flex-col gap-2"><div className="h-8 rounded overflow-hidden relative"><div className="absolute inset-0 bg-white/10 blur-sm" /><img src={p.image || "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=120&h=40&fit=crop"} className="w-full h-full object-cover opacity-80" alt="" /></div><div style={{ color: p.color || "rgba(255,255,255,0.5)" }} className="px-1 font-medium">{p.title || "Summer Collection"}</div></div><div className="w-2/3 border-l border-white/10 pl-4 py-1 flex flex-col gap-2"><div style={{ backgroundColor: `${accent}33` }} className="h-2 w-1/2 rounded-full" /><div style={{ backgroundColor: `${accent}19` }} className="h-2 w-3/4 rounded-full" /></div></div>;
      case "NeuralCard": return <div style={{ ...style, backgroundColor: bgColor || "#030303", borderRadius: r }} className="w-full h-full border border-white/10 p-5 overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.8)]"><div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" /><div style={{ backgroundColor: `${accent}19`, borderColor: `${accent}4D` }} className="h-8 w-8 rounded-lg border flex items-center justify-center mb-4"><div style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }} className="w-3 h-3 rounded-sm" /></div><h3 style={style} className="font-medium mb-1">{p.title || "Defense Matrix"}</h3><p style={{ color: p.color || "rgba(255,255,255,0.4)" }} className="leading-relaxed">{p.description || "Autonomous real-time threat neutralization and mitigation protocols."}</p></div>;
      case "InitializeBadge": return <div style={{ ...style, backgroundColor: bgColor || "rgba(255,255,255,0.03)", borderRadius: r }} className="w-full h-full border border-white/10 px-4 py-2 flex items-center gap-3 backdrop-blur-md shadow-lg"><div style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }} className="w-2 h-2 rounded-full animate-pulse" /><span style={style} className="font-mono opacity-70 tracking-widest uppercase">{p.text || "System Initialized"}</span></div>;
      case "CloudCard": return <div style={{ ...style, backgroundColor: bgColor || "#0a0a0c", borderRadius: r }} className="w-full h-full border border-white/10 relative overflow-hidden group shadow-2xl"><div className="absolute inset-0 bg-gradient-to-br from-transparent to-purple-900/20 opacity-100 transition-opacity" /><div className="p-6 h-full flex flex-col justify-end relative z-10"><h2 style={style} className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 mb-2">{p.title || "Cloud Edge"}</h2><p style={{ color: p.color || "rgba(255,255,255,0.4)" }}>{p.description || "Orchestrate resources without complexity."}</p></div></div>;
      case "StatCard": return <div style={{ ...style, backgroundColor: bgColor || "#0a0a0a", borderRadius: r }} className="w-full h-full border border-white/10 p-5 flex flex-col justify-between shadow-lg"><div style={{ color: p.color || "rgba(255,255,255,0.4)" }} className="font-semibold uppercase tracking-wider">{p.label || "Total Revenue"}</div><div className="flex items-end gap-3"><div style={style} className="text-3xl font-bold">{p.value || "$124.5k"}</div><div style={{ color: accent }} className="font-medium mb-1 flex items-center gap-1"><ArrowUp size={10} /> {p.percent || "12.5%"}</div></div></div>;
      case "CodeSnippet": return <div style={{ ...style, backgroundColor: bgColor || "#0d0d0d", borderRadius: r }} className="w-full h-full border border-white/10 overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)]"><div className="h-7 bg-white/5 flex items-center px-3 gap-1.5 border-b border-white/5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/80" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" /><div className="w-2.5 h-2.5 rounded-full bg-green-500/80" /></div><div style={{ color: p.color || "rgba(255,255,255,0.6)" }} className="p-4 font-mono leading-relaxed whitespace-pre-wrap">{p.code || "import { useState } from \"react\";\n\nexport default function App() {\n  return <Lumina />;\n}"}</div></div>;
      case "TestimonialCard": return <div style={{ ...style, backgroundColor: bgColor || "#0a0a0a", borderRadius: r }} className="w-full h-full border border-white/10 p-5 relative overflow-hidden shadow-xl"><div style={{ color: `${accent}33` }} className="text-4xl absolute top-2 right-4 font-serif">"</div><p style={{ color: p.color || "rgba(255,255,255,0.8)" }} className="italic leading-relaxed mb-4">"{p.quote || "The best tool we've used for scaling our platform design."}"</p><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full overflow-hidden bg-white/10"><img src={p.avatar || AVATARS[0]} className="w-full h-full object-cover" alt="User" /></div><div><div style={style} className="font-bold">{p.author || "Sarah Jenkins"}</div><div style={{ color: p.color || "rgba(255,255,255,0.4)" }}>{p.role || "VP of Engineering, Stripe"}</div></div></div></div>;
      case "NotificationToast": return <div style={{ ...style, backgroundColor: bgColor || "#18181b", borderRadius: r }} className="w-full h-full border border-white/10 p-3 flex items-start gap-3 shadow-[0_15px_35px_rgba(0,0,0,0.5)]"><div style={{ backgroundColor: `${accent}33`, color: accent }} className="w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center mt-0.5">ℹ</div><div className="flex-1"><h4 style={style} className="font-bold mb-0.5">{p.title || "Update Available"}</h4><p style={{ color: p.color || "rgba(255,255,255,0.5)" }} className="leading-tight">{p.description || "Version 2.4.1 brings new features and performance improvements."}</p></div></div>;
      case "AvatarGroup": return <div style={{ ...style, backgroundColor: bgColor || "transparent", borderRadius: r }} className="w-full h-full flex items-center"><div className="flex -space-x-3">{AVATARS.map((src, i) => <img key={i} src={src} className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] object-cover relative" style={{ zIndex: 10 - i }} alt="" />)}<div style={{ color: p.color || "#fff", zIndex: 0 }} className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-white/10 flex items-center justify-center font-bold relative">{p.addition || "+4"}</div></div></div>;
      case "CommandPalette": return <div style={{ ...style, backgroundColor: bgColor || "#0a0a0a", borderRadius: r }} className="w-full h-full border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col"><div className="px-4 py-3 border-b border-white/5 flex items-center gap-3"><Search style={{ color: p.color || "rgba(255,255,255,0.3)" }} size={14} /><span style={{ color: p.color || "rgba(255,255,255,0.4)" }}>{p.placeholder || "Search documents..."}</span></div><div className="p-2 flex flex-col" style={{ gap: p.gap || 4 }}>{(p.items || [{ title: "Introduction", meta: "↵" }, { title: "Getting Started", meta: "" }]).map((m: any, i: number) => <div key={i} className={`px-3 py-2 rounded-lg tracking-wide flex justify-between ${i === 0 ? "bg-white/5 font-medium" : "opacity-50"}`} style={style}>{m.title}{m.meta && <span style={{ backgroundColor: `${accent}33`, color: accent }} className="px-1.5 py-0.5 rounded">{m.meta}</span>}</div>)}</div></div>;
      case "AudioPlayer": return <div style={{ ...style, backgroundColor: bgColor || "#0a0a0a", borderRadius: r }} className="w-full h-full border border-white/10 p-3 flex items-center gap-4 shadow-xl"><div style={{ background: `linear-gradient(to bottom right, ${accent}, #a855f7)` }} className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"><div className="w-0 h-0 border-t-4 border-b-4 border-t-transparent border-b-transparent border-l-[6px] border-l-white ml-1" /></div><div className="flex-1"><div className="flex justify-between items-center mb-1"><h4 style={style} className="font-bold tracking-wide">{p.title || "Lumina Podcast"}</h4><span style={{ color: p.color || "rgba(255,255,255,0.4)" }}>{p.time || "1:24 / 45:00"}</span></div><div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div style={{ backgroundColor: accent }} className="w-1/3 h-full rounded-full" /></div></div></div>;
      default: return <span style={style} className={"text-white"}>{p.text || "Component"}</span>;
    }
  };

  const getRenderableSize = (element: FreeformElement) => {
    const p = element.props || {};

    if (typeof p.width === "number" || typeof p.height === "number") {
      return {
        width: Math.max(24, Number(p.width ?? p.size ?? 120)),
        height: Math.max(24, Number(p.height ?? p.size ?? 40)),
      };
    }

    switch (element.type) {
      case "Image": {
        const size = Math.max(48, Number(p.size || 128));
        return { width: size, height: size };
      }
      case "Input":
      case "Select":
        return { width: 192, height: 40 };
      case "Textarea":
        return { width: 192, height: 96 };
      case "Avatar":
        return { width: 48, height: 48 };
      case "Icon":
        return { width: 40, height: 40 };
      case "Button":
        return { width: 112, height: 40 };
      case "Text":
        return { width: 120, height: 28 };
      case "Navbar": return { width: Number(element.props.width ?? 500), height: Number(element.props.height ?? 64) };
      case "PricingCard": return { width: 300, height: 380 };
      case "GlowingButton": return { width: 140, height: 44 };
      case "Menu": return { width: 220, height: 160 };
      case "Timeline": return { width: 240, height: 120 };
      case "DialGauge": return { width: 200, height: 200 };
      case "WeatherWidget": return { width: 220, height: 220 };
      case "WebGLBackground": return { width: 400, height: 300 };
      case "BokehGradient": return { width: 400, height: 300 };
      case "CatalogMenu": return { width: 340, height: 160 };
      case "NeuralCard": return { width: 260, height: 160 };
      case "InitializeBadge": return { width: 200, height: 40 };
      case "CloudCard": return { width: 320, height: 240 };
      case "StatCard": return { width: 220, height: 120 };
      case "CodeSnippet": return { width: 340, height: 200 };
      case "TestimonialCard": return { width: 300, height: 160 };
      case "NotificationToast": return { width: 300, height: 72 };
      case "AvatarGroup": return { width: 140, height: 40 };
      case "CommandPalette": return { width: 340, height: 240 };
      case "AudioPlayer": return { width: 300, height: 72 };
      default: return { width: 120, height: 40 };
    }
  };

  const resizeHandles: { edge: ResizeEdge; cursor: string; className: string }[] = [
    { edge: "n", cursor: "ns-resize", className: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" },
    { edge: "s", cursor: "ns-resize", className: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" },
    { edge: "e", cursor: "ew-resize", className: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2" },
    { edge: "w", cursor: "ew-resize", className: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2" },
    { edge: "ne", cursor: "nesw-resize", className: "right-0 top-0 translate-x-1/2 -translate-y-1/2" },
    { edge: "nw", cursor: "nwse-resize", className: "left-0 top-0 -translate-x-1/2 -translate-y-1/2" },
    { edge: "se", cursor: "nwse-resize", className: "right-0 bottom-0 translate-x-1/2 translate-y-1/2" },
    { edge: "sw", cursor: "nesw-resize", className: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2" },
  ];

  // ── Mobile / Tablet: flow layout — elements stack centered below block content ──
  if (viewMode !== "desktop" && layer !== "back") {
    // Sort by y so vertical order is preserved from the desktop layout
    const sorted = [...visibleElements].sort((a, b) => a.y - b.y);
    if (sorted.length === 0) return null;

    return (
      <div
        ref={overlayRef}
        className={`freeform-overlay relative w-full pointer-events-none ${className || ""}`}
      >
        <div className="flex flex-col items-center gap-4 py-4 px-4 w-full">
          {sorted.map((element) => {
            const isSelected = !effectiveReadOnly && selectedId === element.id;
            const isNavbar = element.type === "Navbar";
            const p = element.props || {};

            const contentStyle: React.CSSProperties = (() => {
              if (isNavbar) {
                // Explicit height so h-full inside the Navbar div works;
                // position:relative + overflow:visible let the hamburger dropdown escape
                const h = Number(p.height ?? 64);
                return { width: "100%", height: h, minHeight: 48, maxWidth: "100%", position: "relative", overflow: "visible" } as React.CSSProperties;
              }
              if (element.type === "Image" && !p.width) return { width: "100%", aspectRatio: "16/9", height: "auto" } as React.CSSProperties;
              const INTRINSIC = new Set(["Text", "Badge", "Checkbox"]);
              if (!INTRINSIC.has(element.type)) {
                const { width, height } = getRenderableSize(element);
                // Shrink wide components to fit the narrow canvas
                const maxW = viewMode === "mobile" ? 340 : 600;
                const w = typeof width === "number" ? Math.min(width, maxW) : width;
                return { width: w, minHeight: height, height: "auto", maxWidth: "100%" } as React.CSSProperties;
              }
              return { maxWidth: "100%" } as React.CSSProperties;
            })();

            return (
              <div
                key={element.id}
                data-freeform-id={element.id}
                className={`pointer-events-auto w-full flex ${isNavbar ? "" : "justify-center"
                  } ${!effectiveReadOnly && isSelected ? "ring-2 ring-violet-500/80 rounded-sm" : ""
                  }`}
                onPointerDown={effectiveReadOnly ? undefined : (e) => {
                  e.stopPropagation();
                  setSelectedId(element.id);
                }}
                onClick={effectiveReadOnly ? undefined : (e) => e.stopPropagation()}
              >
                <div data-freeform-content="true" className="select-none" style={contentStyle}>
                  {renderComponent(element)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  // Mobile/tablet back-layer: skip (decorative only)
  if (viewMode !== "desktop" && layer === "back") return null;

  return (
    <div
      ref={overlayRef}
      className={`freeform-overlay absolute inset-0 pointer-events-none overflow-hidden ${className || ""}`}
      style={{ overflow: layer === "back" ? "hidden" : "visible" }}
    >
      {captureContextMenu && !effectiveReadOnly && (
        <div
          className="absolute inset-0 pointer-events-auto"
          onContextMenu={handleOverlayContextMenu}
        />
      )}

      {backLayerElements.map((element) => {
        const isSelected = !effectiveReadOnly && selectedId === element.id;
        const { width, height } = getRenderableSize(element);
        return (
          <div
            key={`back-hitbox-${element.id}`}
            className={`absolute ${effectiveReadOnly ? "pointer-events-none" : "pointer-events-auto"} ${effectiveReadOnly ? "" : (isSelected ? "ring-1 ring-violet-500/70 rounded-sm" : "hover:ring-1 hover:ring-violet-400/40 rounded-sm")}`}
            style={element.type === "Navbar" ? {
              left: 0,
              right: 0,
              top: element.y + frameOffsetY,
              width: "100%",
              height,
              maxHeight: "100%",
              cursor: effectiveReadOnly ? "default" : (dragState?.id === element.id ? "grabbing" : "grab"),
            } : {
              // Desktop: original free placement
              left: `max(16px, min(${element.x + frameOffsetX}px, calc(100% - ${width}px - 16px)))`,
              top: element.y + frameOffsetY,
              width, height,
              maxWidth: "calc(100% - 32px)",
              maxHeight: "100%",
              cursor: effectiveReadOnly ? "default" : (dragState?.id === element.id ? "grabbing" : "grab"),
            }}
            onPointerDown={effectiveReadOnly ? undefined : (e) => handlePointerDown(e, element)}
            onClick={effectiveReadOnly ? undefined : (e) => e.stopPropagation()}
            onContextMenu={effectiveReadOnly ? undefined : (e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedId(element.id);
              const hostRect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const overlayRect = overlayRef.current?.getBoundingClientRect();
              const menuWidth = 140;
              const menuHeight = 110;
              if (!overlayRect) return;
              const spaceRight = overlayRect.right - hostRect.right;
              const spaceLeft = hostRect.left - overlayRect.left;
              const placeRight = spaceRight >= menuWidth + 16 || spaceRight >= spaceLeft;
              const nextX = placeRight
                ? hostRect.right - overlayRect.left + 8
                : hostRect.left - overlayRect.left - menuWidth - 8;
              const nextY = Math.min(
                Math.max(hostRect.top - overlayRect.top, 8),
                Math.max(8, overlayRect.height - menuHeight - 8)
              );
              setContextMenu({
                x: Math.max(8, Math.min(nextX, overlayRect.width - menuWidth - 8)),
                y: nextY,
                mode: "element",
                elementId: element.id,
              });
            }}
          >
            <div data-freeform-content="true" style={{ width, height }} />
            {/* No resize handles or controls in preview mode */}
            {!effectiveReadOnly && isSelected && (
              <>
                {resizeHandles.map((handle) => (
                  <button
                    key={`back-${element.id}-${handle.edge}`}
                    type="button"
                    className={`absolute h-3 w-3 rounded-full border border-white/70 bg-accent-glow shadow-[0_0_8px_rgba(167,139,250,0.55)] pointer-events-auto ${handle.className}`}
                    style={{ cursor: handle.cursor }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const measured = getElementSize(element.id);
                      const currentSize = getRenderableSize(element);
                      setResizeState({
                        id: element.id,
                        edge: handle.edge,
                        startX: e.clientX,
                        startY: e.clientY,
                        initialX: element.x + frameOffsetX,
                        initialY: element.y + frameOffsetY,
                        initialWidth: measured?.width ?? currentSize.width,
                        initialHeight: measured?.height ?? currentSize.height,
                        initialProps: { ...(element.props || {}) },
                      });
                    }}
                    aria-label={`Resize ${handle.edge}`}
                  />
                ))}
              </>
            )}
          </div>
        );
      })}

      {visibleElements.map((element) => {
        const isSelected = !effectiveReadOnly && selectedId === element.id;
        return (
          <div
            key={element.id}
            data-freeform-id={element.id}
            onPointerDown={effectiveReadOnly ? undefined : (e) => handlePointerDown(e, element)}
            onClick={effectiveReadOnly ? undefined : (e) => e.stopPropagation()}
            onContextMenu={effectiveReadOnly ? undefined : (e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedId(element.id);
              const hostRect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const overlayRect = overlayRef.current?.getBoundingClientRect();
              const menuWidth = 140;
              const menuHeight = 110;
              if (!overlayRect) return;
              const spaceRight = overlayRect.right - hostRect.right;
              const spaceLeft = hostRect.left - overlayRect.left;
              const placeRight = spaceRight >= menuWidth + 16 || spaceRight >= spaceLeft;
              const nextX = placeRight
                ? hostRect.right - overlayRect.left + 8
                : hostRect.left - overlayRect.left - menuWidth - 8;
              const nextY = Math.min(
                Math.max(hostRect.top - overlayRect.top, 8),
                Math.max(8, overlayRect.height - menuHeight - 8)
              );
              setContextMenu({
                x: Math.max(8, Math.min(nextX, overlayRect.width - menuWidth - 8)),
                y: nextY,
                mode: "element",
                elementId: element.id,
              });
            }}
            className={`absolute ${effectiveReadOnly ? "pointer-events-none" : "pointer-events-auto transition-transform"} ${effectiveReadOnly ? "" : (isSelected ? "ring-2 ring-violet-500/80 rounded-sm" : "hover:ring-1 hover:ring-violet-400/30 rounded-sm")}`}
            style={element.type === "Navbar" ? {
              left: 0,
              right: 0,
              top: element.y + frameOffsetY,
              width: "100%",
              cursor: effectiveReadOnly ? "default" : (dragState?.id === element.id ? "grabbing" : "grab"),
            } : {
              // Desktop: original free placement
              left: `max(16px, min(${element.x + frameOffsetX}px, calc(100% - ${getRenderableSize(element).width}px - 16px)))`,
              top: element.y + frameOffsetY,
              maxWidth: "calc(100% - 32px)",
              cursor: effectiveReadOnly ? "default" : (dragState?.id === element.id ? "grabbing" : "grab"),
            }}
          >
            <div
              data-freeform-content="true"
              className={`select-none transition-opacity duration-150 ${dragState?.id === element.id ? "opacity-70" : "opacity-100"}`}
              style={(() => {
                const p = element.props || {};
                // Navbar is always full-width
                if (element.type === "Navbar") {
                  return { width: "100%", height: "auto", minHeight: 64, maxWidth: "100%" } as React.CSSProperties;
                }
                // Smart Fit: full-width images on mobile when no explicit width set
                if (element.type === "Image" && viewMode === "mobile" && !p.width) {
                  return { width: "100%", height: "auto", maxWidth: "100%" } as React.CSSProperties;
                }
                // Inline-ish elements that size themselves don't need explicit container dimensions
                const INTRINSIC_TYPES = new Set(["Text", "Badge", "Checkbox"]);
                if (!INTRINSIC_TYPES.has(element.type) || typeof p.width === "number" || typeof p.height === "number") {
                  const { width, height } = getRenderableSize(element);
                  return { width, minHeight: height, height: p.height ? height : "auto", maxWidth: "100%" } as React.CSSProperties;
                }
                return { maxWidth: "100%" } as React.CSSProperties;
              })()}
            >
              {renderComponent(element)}
            </div>
            {/* No nudge or resize controls in preview mode */}
            {!effectiveReadOnly && isSelected && (
              <div className={"absolute inset-0 -m-8 pointer-events-none flex items-center justify-center"}>
                <button className={"absolute top-0 pointer-events-auto bg-violet-500 text-white p-1 rounded-full shadow-lg hover:bg-violet-600 z-30"} onClick={(e) => handleNudge(e, element.id, 0, -1)}><ArrowUp size={12} /></button>
                <button className={"absolute right-0 pointer-events-auto bg-violet-500 text-white p-1 rounded-full shadow-lg hover:bg-violet-600 z-30"} onClick={(e) => handleNudge(e, element.id, 1, 0)}><ArrowRight size={12} /></button>
                <button className={"absolute bottom-0 pointer-events-auto bg-violet-500 text-white p-1 rounded-full shadow-lg hover:bg-violet-600 z-30"} onClick={(e) => handleNudge(e, element.id, 0, 1)}><ArrowDown size={12} /></button>
                <button className={"absolute left-0 pointer-events-auto bg-violet-500 text-white p-1 rounded-full shadow-lg hover:bg-violet-600 z-30"} onClick={(e) => handleNudge(e, element.id, -1, 0)}><ArrowLeft size={12} /></button>
              </div>
            )}
            {!effectiveReadOnly && isSelected && (
              <>
                {resizeHandles.map((handle) => (
                  <button
                    key={`${element.id}-${handle.edge}`}
                    type="button"
                    className={`absolute h-3 w-3 rounded-full border border-white/70 bg-accent-glow shadow-[0_0_8px_rgba(167,139,250,0.55)] pointer-events-auto ${handle.className}`}
                    style={{ cursor: handle.cursor }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const measured = getElementSize(element.id);
                      const width = measured?.width ?? getRenderableSize(element).width;
                      const height = measured?.height ?? getRenderableSize(element).height;
                      setResizeState({
                        id: element.id,
                        edge: handle.edge,
                        startX: e.clientX,
                        startY: e.clientY,
                        initialX: element.x + frameOffsetX,
                        initialY: element.y + frameOffsetY,
                        initialWidth: width,
                        initialHeight: height,
                        initialProps: { ...(element.props || {}) },
                      });
                    }}
                    aria-label={`Resize ${handle.edge}`}
                  />
                ))}
              </>
            )}
          </div>
        );
      })}

      {contextMenu && (
        <div
          className="absolute z-[140] min-w-[130px] rounded-lg border border-white/10 bg-[#0b0b0b]/95 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-sm p-1 pointer-events-auto"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {contextMenu.mode === "element" ? (
            <>
              <button
                className="w-full text-left px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/10 rounded-md"
                onClick={() => {
                  const target = visibleElements.find((el) => el.id === contextMenu.elementId);
                  if (target) copyElement(target);
                  setContextMenu(null);
                }}
              >
                Copy
              </button>
              <button
                className="w-full text-left px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/10 rounded-md"
                onClick={() => {
                  const target = visibleElements.find((el) => el.id === contextMenu.elementId) || null;
                  pasteElement(target);
                  setContextMenu(null);
                }}
              >
                Paste
              </button>
              <button
                className="w-full text-left px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-500/15 rounded-md"
                onClick={() => {
                  const target = visibleElements.find((el) => el.id === contextMenu.elementId);
                  if (target) cutElement(target);
                  setContextMenu(null);
                }}
              >
                Cut
              </button>
            </>
          ) : (
            <button
              className="w-full text-left px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/10 rounded-md disabled:opacity-40"
              disabled={!freeformClipboard}
              onClick={() => {
                if (!freeformClipboard) return;
                pasteElement(null, { x: contextMenu.pasteX ?? 24, y: contextMenu.pasteY ?? 24 });
                setContextMenu(null);
              }}
            >
              Paste Here
            </button>
          )}
        </div>
      )}
    </div>
  );
}

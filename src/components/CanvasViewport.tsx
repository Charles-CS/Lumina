"use client";

import React, { useRef, useEffect, useState, useCallback, ReactNode } from "react";
import { useLuminaStore } from "@/store/useLuminaStore";


interface CanvasViewportProps {
  children: ReactNode;
  onCanvasClick?: () => void;
}

export function CanvasViewport({ children, onCanvasClick }: CanvasViewportProps) {
  const { isLivePreview, zoomLevel, viewMode, sections } = useLuminaStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1200);

  // Custom width from dragging the resize handle
  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTooltip, setDragTooltip] = useState<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(0);
  const dragStartScaleRef = useRef(1);

  // Reset custom width when viewMode changes
  useEffect(() => {
    setCustomWidth(null);
  }, [viewMode]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const baseDesiredWidth = viewMode === "mobile" ? 375 : viewMode === "tablet" ? 768 : windowWidth;
  const desiredCanvasWidth = customWidth ?? baseDesiredWidth;

  const baseScale = containerWidth && containerWidth < desiredCanvasWidth
    ? containerWidth / desiredCanvasWidth
    : 1;

  const activeScale = !isLivePreview ? baseScale * zoomLevel : 1;

  useEffect(() => {
    (window as any).__lumina_canvas_scale = activeScale;
  }, [activeScale]);

  // Drag handle logic
  const handleResizePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = desiredCanvasWidth;
    dragStartScaleRef.current = activeScale || 1;
    setIsDragging(true);
    setDragTooltip(desiredCanvasWidth);

    const handleMove = (ev: PointerEvent) => {
      const dx = ev.clientX - dragStartXRef.current;
      // Divide by scale so the handle tracks the visual edge correctly
      const newWidth = Math.round(Math.max(320, Math.min(dragStartWidthRef.current + dx / dragStartScaleRef.current, containerWidth || 1920)));
      setCustomWidth(newWidth);
      setDragTooltip(newWidth);
    };

    const handleUp = () => {
      setIsDragging(false);
      setDragTooltip(null);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }, [desiredCanvasWidth, activeScale, containerWidth]);

  // Track sections container height and top offset
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [sectionsHeight, setSectionsHeight] = useState(0);
  const [sectionsTopOffset, setSectionsTopOffset] = useState(0);

  useEffect(() => {
    if (!sectionsRef.current) return;

    const updateDimensions = () => {
      if (!sectionsRef.current) return;
      const cards = sectionsRef.current.querySelectorAll('[data-section-card="true"]');
      let totalHeight = 0;
      let firstTop = 0;

      cards.forEach((card, idx) => {
        totalHeight += (card as HTMLElement).offsetHeight;
        if (idx === 0) {
          firstTop = (card as HTMLElement).offsetTop;
        }
      });

      setSectionsHeight(totalHeight);
      setSectionsTopOffset(firstTop);
    };

    const obs = new ResizeObserver(updateDimensions);
    obs.observe(sectionsRef.current);

    const mut = new MutationObserver(updateDimensions);
    mut.observe(sectionsRef.current, { childList: true, subtree: true });

    updateDimensions();

    return () => {
      obs.disconnect();
      mut.disconnect();
    };
  }, []);

  // Visual right edge of the canvas accounting for scale + centering
  const canvasVisualHalfWidth = (desiredCanvasWidth * activeScale) / 2;
  const scaledSectionsHeight = sectionsHeight * activeScale;
  const scaledTopOffset = sectionsTopOffset * activeScale;

  return (
    <div className="flex-1 relative overflow-hidden isolate w-full h-full">
      <main
        ref={containerRef}
        className={`w-full h-full relative overflow-y-auto overflow-x-hidden ${isLivePreview ? "select-none" : ""}`}
        onClick={isLivePreview ? undefined : onCanvasClick}
        style={{ cursor: isLivePreview ? "default" : "pointer" }}
      >
        {/* Global premium background grid */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#0e0e12] via-[#0a0a0e] to-[#0c0c10] pointer-events-none -z-10" />
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

        {/* True-width Stage Container */}
        <div
          className="relative min-h-full w-full"
          style={{ "--canvas-scale": activeScale } as React.CSSProperties}
        >
          {/* Canvas Stage */}
          <div
            ref={sectionsRef}
            className={`flex flex-col transition-all duration-0 origin-top pb-8
              ${(!sections || sections.length === 0 || sections.length === 1) ? "min-h-[calc(100vh-100px)] justify-center w-full" : ""}
            `}
            style={{
              marginLeft: `calc(50% - ${desiredCanvasWidth / 2}px)`,
              transform: `scale(${activeScale})`,
              width: `${desiredCanvasWidth}px`,
              maxWidth: "none",
              boxShadow: "none",
              marginTop: "0",
              background: "transparent",
              overflow: "hidden",
            }}
          >
            {children}
          </div>

          {/* ── Right-edge Resize Handle ── */}
          {!isLivePreview && (
            <div
              className="absolute pointer-events-none"
              style={{
                top: `${scaledTopOffset}px`,
                left: `calc(50% + ${canvasVisualHalfWidth}px)`,
                width: "24px",
                height: `${scaledSectionsHeight}px`,
                transform: "translateX(-50%)",
                zIndex: 50,
              }}
            >
              {/* Drag zone / Edge strip */}
              <div
                className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[12px] pointer-events-auto cursor-ew-resize transition-colors
                  ${isDragging ? "bg-white/15" : "hover:bg-white/10"}
                `}
                onPointerDown={handleResizePointerDown}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Minimalist Edge Indicators (The two lines) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-[3px]">
                  <div className={`w-[1.5px] h-6 transition-colors ${isDragging ? "bg-white" : "bg-white/40"}`} />
                  <div className={`w-[1.5px] h-6 transition-colors ${isDragging ? "bg-white" : "bg-white/40"}`} />
                </div>
              </div>

              {/* Live width tooltip */}
              {dragTooltip !== null && (
                <div
                  className="absolute top-1/2 left-full ml-4 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-black/90 border border-white/10 text-[11px] font-mono font-bold text-white whitespace-nowrap shadow-2xl backdrop-blur-sm"
                >
                  {dragTooltip}px
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

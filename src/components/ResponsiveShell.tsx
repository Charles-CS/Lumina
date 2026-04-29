"use client";

/**
 * ResponsiveShell
 * ──────────────────────────────────────────────────────────────────
 * A thin HOC wrapper placed around every rendered section.
 *
 * What it does:
 *  • Reads `viewMode` ("desktop" | "tablet" | "mobile") from the
 *    Zustand store.
 *  • Injects `data-lumina-view` on the wrapper div so blocks can
 *    use CSS attribute selectors for view-specific overrides.
 *  • Exposes `--lumina-view-is-mobile` / `--lumina-view-is-tablet`
 *    CSS custom properties (0 or 1) for calc()-based responsive
 *    values in block stylesheets.
 *  • For the Navbar freeform element, the canvas-width measurement
 *    is also available via the shared `__lumina_canvas_scale` global.
 *
 * NOTE: The canvas already uses CSS container queries (@container)
 * driven by the actual rendered width of the canvas div, so most
 * block-level responsiveness is already handled.  This shell gives
 * blocks an *intent* signal ("the user chose mobile mode") so they
 * can make layout decisions even before the container width changes.
 */

import React, { ReactNode } from "react";
import { useLuminaStore } from "@/store/useLuminaStore";

interface ResponsiveShellProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveShell({ children, className }: ResponsiveShellProps) {
  const viewMode = useLuminaStore((s) => s.viewMode);

  const isMobile = viewMode === "mobile" ? 1 : 0;
  const isTablet = viewMode === "tablet" ? 1 : 0;
  const isDesktop = viewMode === "desktop" ? 1 : 0;

  return (
    <div
      data-lumina-view={viewMode}
      className={className}
      style={
        {
          "--lumina-view-is-mobile": isMobile,
          "--lumina-view-is-tablet": isTablet,
          "--lumina-view-is-desktop": isDesktop,
          // Fluid font size multiplier: 1 on desktop, 0.7 on mobile
          "--lumina-responsive-scale": viewMode === "mobile" ? 0.7 : viewMode === "tablet" ? 0.85 : 1,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

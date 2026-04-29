"use client";

import { LuminaSection } from "@/store/useLuminaStore";
import { FreeformOverlay } from "./FreeformOverlay";
import { useSectionRenderer } from "@/hooks/useSectionRenderer";
import { ResponsiveShell } from "./ResponsiveShell";

export function SectionRenderer({ section, customGlobalStyles, readOnly = false }: { section: LuminaSection; customGlobalStyles?: any; readOnly?: boolean }) {
  const { blockNode, stylesNode, overlayBack, overlayFront, backgroundNoiseNode, containerProps } = useSectionRenderer({ section, customGlobalStyles, readOnly });

  const inner = (
    <div {...containerProps}>
      {backgroundNoiseNode}
      {stylesNode}
      {overlayBack}
      {blockNode}
      {overlayFront}
    </div>
  );

  // In the published site (readOnly) we skip the store subscription entirely.
  // Responsive behaviour is driven by @media rules injected into the styleString.
  if (readOnly) return inner;

  return <ResponsiveShell>{inner}</ResponsiveShell>;
}




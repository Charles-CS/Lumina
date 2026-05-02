import React from "react";
import { LuminaSection, ResponsiveBreakpointOverrides, useLuminaStore } from "@/store/useLuminaStore";
import { LayoutTemplate } from "lucide-react";
import { FreeformOverlay } from "@/components/FreeformOverlay";

// Import all blocks
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { FeaturesBlock } from "@/components/blocks/FeaturesBlock";
import { PricingBlock } from "@/components/blocks/PricingBlock";
import { CTABlock } from "@/components/blocks/CTABlock";
import { TestimonialsBlock } from "@/components/blocks/TestimonialsBlock";
import { StatsBlock } from "@/components/blocks/StatsBlock";
import { FAQBlock } from "@/components/blocks/FAQBlock";
import { TeamBlock } from "@/components/blocks/TeamBlock";
import { ContactBlock } from "@/components/blocks/ContactBlock";
import { FooterBlock } from "@/components/blocks/FooterBlock";
import { MarqueeBlock } from "@/components/blocks/MarqueeBlock";
import { CodeTerminalBlock } from "@/components/blocks/CodeTerminalBlock";
import { DashboardMockupBlock } from "@/components/blocks/DashboardMockupBlock";
import { StepsBlock } from "@/components/blocks/StepsBlock";
import { BlankPageBlock } from "@/components/blocks/BlankPageBlock";

interface UseSectionRendererProps {
  section: LuminaSection;
  customGlobalStyles?: any;
  readOnly?: boolean;
}

export function useSectionRenderer({ section, customGlobalStyles, readOnly = false }: UseSectionRendererProps) {
  const storeGlobalStyles = useLuminaStore((state) => state.globalStyles);
  const viewMode = useLuminaStore((state) => state.viewMode);
  const globalStyles = customGlobalStyles || storeGlobalStyles;

  // ── Resolve per-breakpoint layout overrides ──────────────────────────────
  // In the editor we use the active viewMode; in the published site (readOnly)
  // all three sets of overrides are emitted as @media rules so real devices
  // pick up the right values automatically (see styleString below).
  const responsiveProps = section.props.responsive as Record<string, ResponsiveBreakpointOverrides> | undefined;
  const bpOverrides: ResponsiveBreakpointOverrides = (readOnly ? {} : (responsiveProps?.[viewMode] ?? {}));
  // ─────────────────────────────────────────────────────────────────────────

  const blockType = section.props.components?.[0]?.type || section.type;

  const title = section.props.title as string | undefined;
  const subtitle = section.props.subtitle as string | undefined;
  const eyebrowText = section.props.eyebrowText as string | undefined;
  const description = section.props.description as string | undefined;
  const primaryButtonText = section.props.primaryButtonText as string | undefined;
  const secondaryButtonText = section.props.secondaryButtonText as string | undefined;
  const buttonText = section.props.buttonText as string | undefined;
  const badgeLabel = section.props.badgeLabel as string | undefined;
  const features = section.props.features as any[] | undefined;
  const tiers = section.props.tiers as any[] | undefined;
  const testimonials = section.props.testimonials as any[] | undefined;
  const stats = section.props.stats as any[] | undefined;
  const faqs = section.props.faqs as any[] | undefined;
  const team = section.props.team as any[] | undefined;
  const steps = section.props.steps as any[] | undefined;
  const logos = section.props.logos as string[] | undefined;
  const code = section.props.code as string | undefined;
  const fileName = section.props.fileName as string | undefined;
  const links = section.props.links as any | undefined;
  const dashboardStats = section.props.dashboardStats as any[] | undefined;
  const dashboardNav = section.props.dashboardNav as any[] | undefined;
  const baseColor = (section.props.baseColor as string) || globalStyles.brandColors.primary;
  const bottomText = section.props.bottomText as string | undefined;
  const contactInfo = section.props.contactInfo as any[] | undefined;
  const typography = section.props.typography;
  const visuals = section.props.visuals;
  const isHero = String(blockType) === "HeroBlock";
  const isBlank = String(blockType) === "BlankPageBlock";
  const defaultPaddingY = 100;

  const paddingY = bpOverrides.paddingY ?? (section.props.paddingY as number | undefined);
  const layout = {
    paddingX: (bpOverrides.paddingX !== undefined ? bpOverrides.paddingX : section.props.layout?.paddingX !== undefined ? Number(section.props.layout.paddingX) : undefined),
    gap: (bpOverrides.gap !== undefined ? bpOverrides.gap : section.props.layout?.gap !== undefined ? Number(section.props.layout.gap) : undefined),
    maxWidth: section.props.layout?.maxWidth as string | undefined,
    position: section.props.layout?.position as string | undefined,
    flexDirection: section.props.layout?.flexDirection as string | undefined,
    justifyContent: section.props.layout?.justifyContent as string | undefined,
    alignItems: section.props.layout?.alignItems as string | undefined,
  };

  const backgroundColor = (visuals?.backgroundColor as string) || "transparent";
  const backgroundType = String(visuals?.backgroundType ?? "solid");
  const backdropBlur = Number(visuals?.backdropBlur ?? 0);
  const cardBackgroundColor = String(visuals?.cardBackgroundColor ?? "transparent");

  const fontWeight = String(typography?.fontWeight ?? "400");
  const lineHeight = Number(typography?.lineHeight ?? 1.5);
  const textAlign = String(typography?.textAlign ?? "left");
  const letterSpacing = Number(typography?.letterSpacing ?? 0);
  const textColor = String(typography?.color ?? "#ffffff");
  const fontFamily = typography?.fontFamily ?? globalStyles.typography.fontFamily;

  const fontScale = typography?.fontSize ? Number(typography.fontSize) / 16 : 1;

  const blockProps = {
    title, subtitle, description, eyebrowText, primaryButtonText, secondaryButtonText, buttonText,
    badgeLabel, features, tiers, testimonials, stats, faqs, team, steps, logos, code, fileName,
    links, dashboardStats, dashboardNav, bottomText, contactInfo, baseColor, typography, visuals,
    paddingY, layout,
  };
  const freeformElements = ((section as any).elements || (section as any).props.elements || []) as any[];

  const renderBlock = () => {
    switch (String(blockType)) {
      case "HeroBlock": return <HeroBlock {...blockProps} />;
      case "FeaturesBlock": return <FeaturesBlock {...blockProps} />;
      case "PricingBlock": return <PricingBlock {...blockProps} />;
      case "CTABlock": return <CTABlock {...blockProps} />;
      case "TestimonialsBlock": return <TestimonialsBlock {...blockProps} />;
      case "StatsBlock": return <StatsBlock {...blockProps} />;
      case "FAQBlock": return <FAQBlock {...blockProps} />;
      case "TeamBlock": return <TeamBlock {...blockProps} />;
      case "ContactBlock": return <ContactBlock {...blockProps} />;
      case "FooterBlock": return <FooterBlock {...blockProps} />;
      case "MarqueeBlock": return <MarqueeBlock {...blockProps} />;
      case "CodeTerminalBlock": return <CodeTerminalBlock {...blockProps} />;
      case "DashboardMockupBlock": return <DashboardMockupBlock {...blockProps} />;
      case "StepsBlock": return <StepsBlock {...blockProps} />;
      case "BlankPageBlock": return <BlankPageBlock {...blockProps} />;
      default:
        return (
          <div className="w-full bg-[#0a0a0a] min-h-[160px] flex items-center justify-center p-8">
            <div className="flex flex-col items-center text-center gap-2">
              <LayoutTemplate size={28} className="text-violet-500/40" />
              <h3 className="text-lg font-bold text-white tracking-tight">{title || blockType}</h3>
              <p className="text-[11px] uppercase tracking-widest text-violet-400 font-semibold bg-violet-500/10 px-2 py-1 rounded border border-violet-500/20">
                {String(blockType)} Pending Component
              </p>
            </div>
          </div>
        );
    }
  };

  const resolvedPaddingY = paddingY !== undefined ? paddingY : defaultPaddingY;
  const resolvedPaddingX = layout?.paddingX !== undefined ? layout.paddingX : 32;

  const styleString = `
        ${backdropBlur && backdropBlur > 0 ? `
        #section-${section.id} [class*="bg-white/"],
        #section-${section.id} [class*="bg-black/"] {
          backdrop-filter: blur(${backdropBlur}px) !important;
          -webkit-backdrop-filter: blur(${backdropBlur}px) !important;
        }
        ` : ''}

        #section-${section.id} > div:not(.freeform-overlay) {
          min-height: ${paddingY !== undefined ? paddingY : defaultPaddingY}vh !important;
          ${layout?.paddingX !== undefined ? `padding-left: ${layout.paddingX}px !important; padding-right: ${layout.paddingX}px !important;` : ''}
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          ${layout?.position && layout.position !== 'relative' ? `position: ${layout.position} !important;` : ''}
        }
        
        #section-${section.id} > div:not(.freeform-overlay) > div[class*="max-w-"] {
          ${layout?.maxWidth ? `max-width: ${layout.maxWidth === "full" ? "100%" : `${layout.maxWidth}px`} !important;` : ''}
          ${layout?.gap !== undefined ? `gap: ${layout.gap}px !important;` : ''}
          ${layout?.flexDirection || layout?.justifyContent || layout?.alignItems ? 'display: flex !important;' : ''}
          ${layout?.flexDirection ? `flex-direction: ${layout.flexDirection} !important;` : ''}
          ${layout?.justifyContent ? `justify-content: ${layout.justifyContent} !important;` : ''}
          ${layout?.alignItems ? `align-items: ${layout.alignItems} !important;` : ''}
        }
        
        #section-${section.id} > div:not(.freeform-overlay) > div[class*="max-w-"] > div.grid {
          ${layout?.gap !== undefined ? `gap: ${layout.gap}px !important;` : ''}
        }

        ${globalStyles.typography.h1Size ? `
          #section-${section.id} h1 { font-size: calc(${globalStyles.typography.h1Size}px * var(--lumina-responsive-scale, 1)) !important; }
        ` : ''}
        ${globalStyles.typography.h2Size ? `
          #section-${section.id} h2 { font-size: calc(${globalStyles.typography.h2Size}px * var(--lumina-responsive-scale, 1)) !important; }
        ` : ''}
        ${globalStyles.typography.h3Size ? `
          #section-${section.id} h3 { font-size: calc(${globalStyles.typography.h3Size}px * var(--lumina-responsive-scale, 1)) !important; }
        ` : ''}
        ${globalStyles.typography.pSize ? `
          #section-${section.id} p { font-size: calc(${globalStyles.typography.pSize}px * var(--lumina-responsive-scale, 1)) !important; }
        ` : ''}

        ${fontScale !== 1 ? `
          #section-${section.id} > :not(.freeform-overlay) .text-xs { font-size: calc(0.75rem * var(--font-scale)) !important; line-height: 1rem !important; }
          #section-${section.id} > :not(.freeform-overlay) .text-sm { font-size: calc(0.875rem * var(--font-scale)) !important; line-height: 1.25rem !important; }
          #section-${section.id} > :not(.freeform-overlay) .text-base { font-size: calc(1rem * var(--font-scale)) !important; line-height: 1.5rem !important; }
          #section-${section.id} > :not(.freeform-overlay) .text-lg { font-size: calc(1.125rem * var(--font-scale)) !important; line-height: 1.75rem !important; }
          #section-${section.id} > :not(.freeform-overlay) .text-xl { font-size: calc(1.25rem * var(--font-scale)) !important; line-height: 1.75rem !important; }
          #section-${section.id} > :not(.freeform-overlay) .text-2xl { font-size: calc(1.5rem * var(--font-scale)) !important; line-height: 2rem !important; }
          #section-${section.id} > :not(.freeform-overlay) .text-3xl { font-size: calc(1.875rem * var(--font-scale)) !important; line-height: 2.25rem !important; }
          #section-${section.id} > :not(.freeform-overlay) .text-4xl { font-size: calc(2.25rem * var(--font-scale)) !important; line-height: 2.5rem !important; }
          #section-${section.id} > :not(.freeform-overlay) .text-5xl { font-size: calc(3rem * var(--font-scale)) !important; line-height: 1 !important; }
          #section-${section.id} > :not(.freeform-overlay) .text-6xl { font-size: calc(3.75rem * var(--font-scale)) !important; line-height: 1 !important; }
          #section-${section.id} > :not(.freeform-overlay) .text-7xl { font-size: calc(4.5rem * var(--font-scale)) !important; line-height: 1 !important; }
          #section-${section.id} > :not(.freeform-overlay) .text-8xl { font-size: calc(6rem * var(--font-scale)) !important; line-height: 1 !important; }
          #section-${section.id} > :not(.freeform-overlay) .text-9xl { font-size: calc(8rem * var(--font-scale)) !important; line-height: 1 !important; }
          @container (min-width: 640px) { ... } /* Omitted full breakpoints string length for saving space... let's actually just keep it if needed. Actually I will use the exact string */
          /* Let's copy exactly to avoid breakpoint issues */
          @container (min-width: 640px) {
            #section-${section.id} > :not(.freeform-overlay) .sm\\:text-xs { font-size: calc(0.75rem * var(--font-scale)) !important; line-height: 1rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .sm\\:text-sm { font-size: calc(0.875rem * var(--font-scale)) !important; line-height: 1.25rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .sm\\:text-base { font-size: calc(1rem * var(--font-scale)) !important; line-height: 1.5rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .sm\\:text-lg { font-size: calc(1.125rem * var(--font-scale)) !important; line-height: 1.75rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .sm\\:text-xl { font-size: calc(1.25rem * var(--font-scale)) !important; line-height: 1.75rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .sm\\:text-2xl { font-size: calc(1.5rem * var(--font-scale)) !important; line-height: 2rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .sm\\:text-3xl { font-size: calc(1.875rem * var(--font-scale)) !important; line-height: 2.25rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .sm\\:text-4xl { font-size: calc(2.25rem * var(--font-scale)) !important; line-height: 2.5rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .sm\\:text-5xl { font-size: calc(3rem * var(--font-scale)) !important; line-height: 1 !important; }
            #section-${section.id} > :not(.freeform-overlay) .sm\\:text-6xl { font-size: calc(3.75rem * var(--font-scale)) !important; line-height: 1 !important; }
            #section-${section.id} > :not(.freeform-overlay) .sm\\:text-7xl { font-size: calc(4.5rem * var(--font-scale)) !important; line-height: 1 !important; }
            #section-${section.id} > :not(.freeform-overlay) .sm\\:text-8xl { font-size: calc(6rem * var(--font-scale)) !important; line-height: 1 !important; }
            #section-${section.id} > :not(.freeform-overlay) .sm\\:text-9xl { font-size: calc(8rem * var(--font-scale)) !important; line-height: 1 !important; }
          }
          @container (min-width: 768px) {
            #section-${section.id} > :not(.freeform-overlay) .md\\:text-xs { font-size: calc(0.75rem * var(--font-scale)) !important; line-height: 1rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .md\\:text-sm { font-size: calc(0.875rem * var(--font-scale)) !important; line-height: 1.25rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .md\\:text-base { font-size: calc(1rem * var(--font-scale)) !important; line-height: 1.5rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .md\\:text-lg { font-size: calc(1.125rem * var(--font-scale)) !important; line-height: 1.75rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .md\\:text-xl { font-size: calc(1.25rem * var(--font-scale)) !important; line-height: 1.75rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .md\\:text-2xl { font-size: calc(1.5rem * var(--font-scale)) !important; line-height: 2rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .md\\:text-3xl { font-size: calc(1.875rem * var(--font-scale)) !important; line-height: 2.25rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .md\\:text-4xl { font-size: calc(2.25rem * var(--font-scale)) !important; line-height: 2.5rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .md\\:text-5xl { font-size: calc(3rem * var(--font-scale)) !important; line-height: 1 !important; }
            #section-${section.id} > :not(.freeform-overlay) .md\\:text-6xl { font-size: calc(3.75rem * var(--font-scale)) !important; line-height: 1 !important; }
            #section-${section.id} > :not(.freeform-overlay) .md\\:text-7xl { font-size: calc(4.5rem * var(--font-scale)) !important; line-height: 1 !important; }
            #section-${section.id} > :not(.freeform-overlay) .md\\:text-8xl { font-size: calc(6rem * var(--font-scale)) !important; line-height: 1 !important; }
            #section-${section.id} > :not(.freeform-overlay) .md\\:text-9xl { font-size: calc(8rem * var(--font-scale)) !important; line-height: 1 !important; }
          }
          @container (min-width: 1024px) {
            #section-${section.id} > :not(.freeform-overlay) .lg\\:text-xs { font-size: calc(0.75rem * var(--font-scale)) !important; line-height: 1rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .lg\\:text-sm { font-size: calc(0.875rem * var(--font-scale)) !important; line-height: 1.25rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .lg\\:text-base { font-size: calc(1rem * var(--font-scale)) !important; line-height: 1.5rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .lg\\:text-lg { font-size: calc(1.125rem * var(--font-scale)) !important; line-height: 1.75rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .lg\\:text-xl { font-size: calc(1.25rem * var(--font-scale)) !important; line-height: 1.75rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .lg\\:text-2xl { font-size: calc(1.5rem * var(--font-scale)) !important; line-height: 2rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .lg\\:text-3xl { font-size: calc(1.875rem * var(--font-scale)) !important; line-height: 2.25rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .lg\\:text-4xl { font-size: calc(2.25rem * var(--font-scale)) !important; line-height: 2.5rem !important; }
            #section-${section.id} > :not(.freeform-overlay) .lg\\:text-5xl { font-size: calc(3rem * var(--font-scale)) !important; line-height: 1 !important; }
            #section-${section.id} > :not(.freeform-overlay) .lg\\:text-6xl { font-size: calc(3.75rem * var(--font-scale)) !important; line-height: 1 !important; }
            #section-${section.id} > :not(.freeform-overlay) .lg\\:text-7xl { font-size: calc(4.5rem * var(--font-scale)) !important; line-height: 1 !important; }
            #section-${section.id} > :not(.freeform-overlay) .lg\\:text-8xl { font-size: calc(6rem * var(--font-scale)) !important; line-height: 1 !important; }
            #section-${section.id} > :not(.freeform-overlay) .lg\\:text-9xl { font-size: calc(8rem * var(--font-scale)) !important; line-height: 1 !important; }
          }
        ` : ''}

        /* Enforce user layout configuration strongly, but don't destroy opacities or explicit inline colors */
        div#section-${section.id}[id] > :not(.freeform-overlay) {
          color: ${textColor};
          ${fontFamily && fontFamily !== 'sans' ? `font-family: ${fontFamily};` : ''}
          ${lineHeight && lineHeight !== 1.5 ? `line-height: ${lineHeight};` : ''}
          ${letterSpacing && letterSpacing !== 0 ? `letter-spacing: ${letterSpacing}px;` : ''}
          ${fontWeight && fontWeight !== "400" ? `font-weight: ${fontWeight};` : ''}
          ${textAlign && textAlign !== 'left' ? `text-align: ${textAlign} !important;` : ''}
        }

        /* If users want to override text color, let it cascade. But text-white classes might block it, 
           so we allow specific typography overrides only when explicitly asked or handled softly */
        div#section-${section.id}[id] h1, 
        div#section-${section.id}[id] h2, 
        div#section-${section.id}[id] h3, 
        div#section-${section.id}[id] p,
        div#section-${section.id}[id] span {
          ${fontFamily && fontFamily !== 'sans' ? `font-family: ${fontFamily} !important;` : ''}
          ${textAlign && textAlign !== 'left' ? `text-align: ${textAlign} !important;` : ''}
        }

        ${readOnly && responsiveProps ? `
          /* ── Published-site responsive overrides via real @media rules ──────── */
          ${responsiveProps.mobile ? `
          @media (max-width: 639px) {
            #section-${section.id} > div:not(.freeform-overlay) {
              ${responsiveProps.mobile.paddingY !== undefined ? `min-height: ${responsiveProps.mobile.paddingY}vh !important;` : ''}
              ${responsiveProps.mobile.paddingX !== undefined ? `padding-left: ${responsiveProps.mobile.paddingX}px !important; padding-right: ${responsiveProps.mobile.paddingX}px !important;` : ''}
            }
            #section-${section.id} > div:not(.freeform-overlay) > div[class*="max-w-"] {
              ${responsiveProps.mobile.gap !== undefined ? `gap: ${responsiveProps.mobile.gap}px !important;` : ''}
            }
            #section-${section.id} h1 { font-size: calc(${globalStyles.typography.h1Size}px * 0.7) !important; }
            #section-${section.id} h2 { font-size: calc(${globalStyles.typography.h2Size}px * 0.7) !important; }
            #section-${section.id} h3 { font-size: calc(${globalStyles.typography.h3Size}px * 0.8) !important; }
            #section-${section.id} p  { font-size: calc(${globalStyles.typography.pSize}px  * 0.9) !important; }
          }
          ` : ''}
          ${responsiveProps.tablet ? `
          @media (min-width: 640px) and (max-width: 1023px) {
            #section-${section.id} > div:not(.freeform-overlay) {
              ${responsiveProps.tablet.paddingY !== undefined ? `min-height: ${responsiveProps.tablet.paddingY}vh !important;` : ''}
              ${responsiveProps.tablet.paddingX !== undefined ? `padding-left: ${responsiveProps.tablet.paddingX}px !important; padding-right: ${responsiveProps.tablet.paddingX}px !important;` : ''}
            }
            #section-${section.id} > div:not(.freeform-overlay) > div[class*="max-w-"] {
              ${responsiveProps.tablet.gap !== undefined ? `gap: ${responsiveProps.tablet.gap}px !important;` : ''}
            }
            #section-${section.id} h1 { font-size: calc(${globalStyles.typography.h1Size}px * 0.85) !important; }
            #section-${section.id} h2 { font-size: calc(${globalStyles.typography.h2Size}px * 0.85) !important; }
          }
          ` : ''}
        ` : ''}
  `;

  const containerStyle: React.CSSProperties = {
    backgroundColor: backgroundType === 'solid' ? backgroundColor : backgroundType === 'gradient' ? 'transparent' : backgroundColor,
    backgroundImage: backgroundType === 'gradient' ? `linear-gradient(135deg, ${backgroundColor} 0%, #000 100%)` : undefined,
    "--font-scale": fontScale,
  } as React.CSSProperties;

  const overlayBack = (
    <FreeformOverlay
      sectionId={section.id}
      elements={freeformElements}
      layer="back"
      captureContextMenu={!readOnly}
      sectionTypography={typography}
      sectionLayout={layout}
      sectionPaddingY={paddingY !== undefined ? paddingY : defaultPaddingY}
      defaultPaddingY={defaultPaddingY}
      className="z-[5]"
      readOnly={readOnly}
    />
  );

  const overlayFrontAbove = (
    <FreeformOverlay
      sectionId={section.id}
      elements={freeformElements}
      layer="front"
      splitFlow="above"
      captureContextMenu={!readOnly}
      sectionTypography={typography}
      sectionLayout={layout}
      sectionPaddingY={paddingY !== undefined ? paddingY : defaultPaddingY}
      defaultPaddingY={defaultPaddingY}
      className="z-20 w-full"
      readOnly={readOnly}
    />
  );

  const overlayFrontBelow = (
    <FreeformOverlay
      sectionId={section.id}
      elements={freeformElements}
      layer="front"
      splitFlow="below"
      captureContextMenu={!readOnly}
      sectionTypography={typography}
      sectionLayout={layout}
      sectionPaddingY={paddingY !== undefined ? paddingY : defaultPaddingY}
      defaultPaddingY={defaultPaddingY}
      className="z-20 w-full"
      readOnly={readOnly}
    />
  );

  const backgroundNoiseNode = backgroundType === "noise" ? (
    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay z-0" />
  ) : null;

  return {
    blockNode: renderBlock(),
    stylesNode: <style>{styleString}</style>,
    overlayBack,
    overlayFrontAbove,
    overlayFrontBelow,
    backgroundNoiseNode,
    containerProps: {
      id: `section-${section.id}`,
      className: "@container relative w-full transition-colors duration-300",
      style: containerStyle,
    }
  };
}

/**
 * compiler.ts
 * Pure, side-effect-free functions that compile Lumina store state into
 * exportable code strings (HTML, CSS, React/JSX).
 */

import type { LuminaSection, GlobalStyles, SiteMeta } from '@/store/useLuminaStore';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function pascal(str: string): string {
  return str.replace(/(^\w|Block$)/g, (m) => (m === 'Block' ? 'Section' : m.toUpperCase()));
}

function sectionComponentName(type: string): string {
  // e.g. "HeroBlock" → "HeroSection", "FooterBlock" → "FooterSection"
  return type.endsWith('Block') ? type.replace('Block', 'Section') : type;
}

function indent(str: string, spaces = 2): string {
  return str
    .split('\n')
    .map((l) => ' '.repeat(spaces) + l)
    .join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML Generator
// ─────────────────────────────────────────────────────────────────────────────

export function generateHTML(sections: LuminaSection[], siteMeta: SiteMeta): string {
  const title = siteMeta.title || 'Lumina Site';
  const description = siteMeta.description || 'Built with Lumina';
  const faviconTag = siteMeta.faviconUrl
    ? `\n  <link rel="icon" href="${siteMeta.faviconUrl}" />`
    : '';

  const sectionBlocks = sections
    .map((s) => {
      const name = sectionComponentName(s.type);
      const titleAttr = s.props.title ? ` data-title="${s.props.title}"` : '';
      return `  <!-- [Lumina${name}] -->\n  <section id="${s.id}" class="lumina-section lumina-${s.type.toLowerCase()}"${titleAttr}>\n    <!-- ${name} content renders here -->\n  </section>`;
    })
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />${faviconTag}
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="stylesheet" href="styles.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body class="lumina-root">

  <header class="lumina-nav">
    <!-- [LuminaNavbar] -->
    <nav><!-- Navigation --></nav>
  </header>

  <main class="lumina-main">

${sectionBlocks || '    <!-- No sections added yet -->'}

  </main>

  <footer class="lumina-footer">
    <!-- [LuminaFooter] -->
    <p>&copy; ${new Date().getFullYear()} ${title}. All rights reserved.</p>
  </footer>

</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS Generator
// ─────────────────────────────────────────────────────────────────────────────

export function generateCSS(sections: LuminaSection[], globalStyles: GlobalStyles): string {
  const { typography, brandColors, borderRadii } = globalStyles;

  const sectionRules = sections
    .map((s) => {
      const bg = (s.props.visuals as Record<string, string> | undefined)?.canvasBackgroundColor;
      const pad = s.props.layout?.padding ?? 56;
      return `.lumina-${s.type.toLowerCase()} {\n  padding: ${pad}px 0;${bg && bg !== 'transparent' ? `\n  background-color: ${bg};` : ''}\n}`;
    })
    .join('\n\n');

  return `/* ═══════════════════════════════════════════════════════════
   Lumina Export — styles.css
   Generated: ${new Date().toISOString()}
═══════════════════════════════════════════════════════════ */

/* ── CSS Custom Properties ─────────────────────────────── */
:root {
  --lumina-bg:          #050505;
  --lumina-surface:     #0a0a0a;
  --lumina-primary:     ${brandColors.primary};
  --lumina-secondary:   ${brandColors.secondary};
  --lumina-accent:      ${brandColors.accent};
  --lumina-text:        #ffffff;
  --lumina-text-muted:  rgba(255,255,255,0.6);
  --lumina-radius-root: ${borderRadii.root}px;
  --lumina-radius-comp: ${borderRadii.components}px;
  --lumina-font:        '${typography.fontFamily === 'sans' ? 'Inter' : typography.fontFamily}', sans-serif;
  --lumina-h1:          ${typography.h1Size}px;
  --lumina-h2:          ${typography.h2Size}px;
  --lumina-h3:          ${typography.h3Size}px;
  --lumina-p:           ${typography.pSize}px;
}

/* ── Reset & Base ──────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.lumina-root {
  font-family: var(--lumina-font);
  background-color: var(--lumina-bg);
  color: var(--lumina-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* ── Layout ────────────────────────────────────────────── */
.lumina-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(20px);
  background-color: rgba(5, 5, 5, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
}

  min-height: 100ch;
}

  width: 100%;
  overflow: hidden;
  min-height: 100ch;
}

.lumina-footer {
  padding: 3rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
  color: var(--lumina-text-muted);
  font-size: 0.875rem;
}

/* ── Typography ────────────────────────────────────────── */
h1 { font-size: var(--lumina-h1); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; }
h2 { font-size: var(--lumina-h2); font-weight: 700; line-height: 1.2; letter-spacing: -0.01em; }
h3 { font-size: var(--lumina-h3); font-weight: 600; line-height: 1.3; }
p  { font-size: var(--lumina-p);  line-height: 1.7; color: var(--lumina-text-muted); }

/* ── Buttons ───────────────────────────────────────────── */
.lumina-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--lumina-radius-comp);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  border: none;
}

.lumina-btn-primary {
  background-color: var(--lumina-primary);
  color: #ffffff;
}

.lumina-btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* ── Per-Section Overrides ─────────────────────────────── */
${sectionRules || '/* No custom section styles */'}
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// React / JSX Generator
// ─────────────────────────────────────────────────────────────────────────────

export function generateReact(sections: LuminaSection[], siteMeta: SiteMeta): string {
  const title = siteMeta.title || 'Lumina Site';

  const imports = [
    `import React from 'react';`,
    `import Head from 'next/head';`,
    `import './styles.css';`,
    ``,
    `// Auto-generated component imports`,
    ...sections.map((s) => {
      const name = sectionComponentName(s.type);
      return `import { ${name} } from './components/${name}';`;
    }),
  ].join('\n');

  const sectionJSX = sections
    .map((s) => {
      const name = sectionComponentName(s.type);
      const props = Object.entries(s.props)
        .filter(([k]) => ['title', 'subtitle'].includes(k) && s.props[k])
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');
      return `      <${name}${props ? ' ' + props : ''} />`;
    })
    .join('\n');

  const year = new Date().getFullYear();

  return `${imports}

/**
 * LuminaSite — Auto-generated by Lumina Builder
 * Generated: ${new Date().toISOString()}
 * Sections: ${sections.length}
 */
export default function LuminaSite() {
  return (
    <>
      <Head>
        <title>${title}</title>
        <meta name="description" content="${siteMeta.description || ''}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="lumina-root">
        <LuminaNavbar />

        <main className="lumina-main">
${sectionJSX || '          {/* No sections added yet */}'}
        </main>

        <LuminaFooter copyright="${year} ${title}" />
      </div>
    </>
  );
}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// README Generator (for ZIP)
// ─────────────────────────────────────────────────────────────────────────────

export function generateReadme(siteMeta: SiteMeta, sections: LuminaSection[]): string {
  return `# ${siteMeta.title || 'Lumina Site'}

> Exported from **Lumina Builder** on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.

## Contents

| File | Description |
|---|---|
| \`index.html\` | Main HTML entry point with semantic structure |
| \`styles.css\` | All custom properties, resets, and section styles |
| \`app.jsx\` | React component tree (requires React + bundler) |

## Sections (${sections.length})

${sections.map((s, i) => `${i + 1}. **${s.props.title || s.type}** — \`${s.type}\``).join('\n')}

## Getting Started

### Static HTML
Simply open \`index.html\` in a browser. Add your own JavaScript and imagery.

### React / Next.js
\`\`\`bash
npm install react react-dom next
npx next dev
\`\`\`
Import \`LuminaSite\` from \`app.jsx\` into your page.

---
*Built with [Lumina](https://lumina.app) — the visual website builder.*
`;
}

const fs = require('fs');
let content = fs.readFileSync('src/components/FreeformOverlay.tsx', 'utf8');

// 1. clampToOverlay
content = content.replace(
  /const maxX = Math\.max\(0, overlayEl\.clientWidth - size\.width\);/,
  'const maxX = Math.max(0, 1440 - size.width);'
);

// 2. handleOverlayContextMenu
content = content.replace(
  /const pasteX = e\.clientX - overlayRect\.left;\s*const pasteY = e\.clientY - overlayRect\.top;/g,
  `const ffScale = viewMode === "mobile" ? 0.3 : viewMode === "tablet" ? 0.6 : 1;
    const screenOffsetX = e.clientX - (overlayRect.left + overlayRect.width / 2);
    const pasteX = 720 + (screenOffsetX / ffScale);
    const pasteY = e.clientY - overlayRect.top;`
);

// 3. handlePointerMove
content = content.replace(
  /const scale = \(window as any\)\.__lumina_canvas_scale \|\| 1;\s*const dx = \(e\.clientX - dragState\.startX\) \/ scale;\s*const dy = \(e\.clientY - dragState\.startY\) \/ scale;/g,
  `const scale = (window as any).__lumina_canvas_scale || 1;
      const ffScale = viewMode === "mobile" ? 0.3 : viewMode === "tablet" ? 0.6 : 1;
      const dx = (e.clientX - dragState.startX) / (scale * ffScale);
      const dy = (e.clientY - dragState.startY) / scale;`
);

// 4. handleResizeMove
content = content.replace(
  /const scale = \(window as any\)\.__lumina_canvas_scale \|\| 1;\s*const dx = \(e\.clientX - resizeState\.startX\) \/ scale;\s*const dy = \(e\.clientY - resizeState\.startY\) \/ scale;/g,
  `const scale = (window as any).__lumina_canvas_scale || 1;
      const ffScale = viewMode === "mobile" ? 0.3 : viewMode === "tablet" ? 0.6 : 1;
      const dx = (e.clientX - resizeState.startX) / (scale * ffScale);
      const dy = (e.clientY - resizeState.startY) / (scale * ffScale);`
);

content = content.replace(
  /if \(nextX \+ nextWidth > overlayEl\.clientWidth\) \{/g,
  `if (nextX + nextWidth > 1440) {`
);
content = content.replace(
  /nextWidth = overlayEl\.clientWidth - nextX;/g,
  `nextWidth = 1440 - nextX;`
);
content = content.replace(
  /nextX = overlayEl\.clientWidth - nextWidth;/g,
  `nextX = 1440 - nextWidth;`
);

// 5. Remove Mobile Flow Layout
content = content.replace(
  /\/\/ ── Mobile \/ Tablet: flow layout — elements stack centered below block content ──[\s\S]*?\/\/ Mobile\/tablet back-layer: skip \(decorative only\)\s*if \(viewMode !== "desktop" && layer === "back"\) return null;/g,
  ''
);

// 6. Update Render Logic
// Back layer left positioning
content = content.replace(
  /left: \`max\(16px, min\(\\\$\{element\.x \+ frameOffsetX\}px, calc\(100% - \\\$\{width\}px - 16px\)\)\)\`,/g,
  `left: \`calc(50% + calc(\\\${element.x + frameOffsetX - 720}px * var(--ff-scale, \\\${viewMode === "mobile" ? 0.3 : viewMode === "tablet" ? 0.6 : 1})))\`,`
);

// Front layer left positioning
content = content.replace(
  /left: \`max\(16px, min\(\\\$\{element\.x \+ frameOffsetX\}px, calc\(100% - \\\$\{getRenderableSize\(element\)\.width\}px - 16px\)\)\)\`,/g,
  `left: \`calc(50% + calc(\\\${element.x + frameOffsetX - 720}px * var(--ff-scale, \\\${viewMode === "mobile" ? 0.3 : viewMode === "tablet" ? 0.6 : 1})))\`,`
);

// Scale content wrapper (back layer)
content = content.replace(
  /<div data-freeform-content="true" style=\{\{ width, height \}\} \/>/g,
  `<div data-freeform-content="true" style={{ width, height, transform: \`scale(var(--ff-scale, \${viewMode === "mobile" ? 0.3 : viewMode === "tablet" ? 0.6 : 1}))\`, transformOrigin: 'top left' }} />`
);

// Scale content wrapper (front layer)
content = content.replace(
  /<div\s*data-freeform-content="true"\s*className=\{\`select-none transition-opacity duration-150 \$\{[^}]+\}\`\}\s*style=\{\(\(\) => \{/g,
  `<div
              data-freeform-content="true"
              className={\`select-none transition-opacity duration-150 \${dragState?.id === element.id ? "opacity-70" : "opacity-100"}\`}
              style={(() => {
                const baseScale = \`scale(var(--ff-scale, \${viewMode === "mobile" ? 0.3 : viewMode === "tablet" ? 0.6 : 1}))\`;
`
);

content = content.replace(
  /return \{ width: "100%", height: "auto", minHeight: 64, maxWidth: "100%" \} as React\.CSSProperties;/g,
  `return { width: "100%", height: "auto", minHeight: 64, maxWidth: "100%", transform: baseScale, transformOrigin: 'top left' } as React.CSSProperties;`
);

content = content.replace(
  /return \{ width: "100%", height: "auto", maxWidth: "100%" \} as React\.CSSProperties;/g,
  `return { width: "100%", height: "auto", maxWidth: "100%", transform: baseScale, transformOrigin: 'top left' } as React.CSSProperties;`
);

content = content.replace(
  /return \{ width, minHeight: height, height: p\.height \? height : "auto", maxWidth: "100%" \} as React\.CSSProperties;/g,
  `return { width, minHeight: height, height: p.height ? height : "auto", maxWidth: "100%", transform: baseScale, transformOrigin: 'top left' } as React.CSSProperties;`
);

content = content.replace(
  /return \{ maxWidth: "100%" \} as React\.CSSProperties;/g,
  `return { maxWidth: "100%", transform: baseScale, transformOrigin: 'top left' } as React.CSSProperties;`
);

fs.writeFileSync('src/components/FreeformOverlay.tsx', content);
console.log('Overlay updated successfully.');

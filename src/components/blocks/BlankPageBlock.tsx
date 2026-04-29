"use client";

import { BlockPreviewProps } from "./BlockPrimitives";

export function BlankPageBlock({
  layout,
  visuals,
  typography,
}: BlockPreviewProps) {
  const alignClass =
    typography?.textAlign === "center"
      ? "text-center"
      : typography?.textAlign === "right"
      ? "text-right"
      : "text-left";
      
  const cardBackgroundColor = String(visuals?.cardBackgroundColor ?? "transparent");
  const rawMaxWidth = layout?.maxWidth;
  const normalizedMaxWidth = rawMaxWidth
    ? rawMaxWidth === "full"
      ? "100%"
      : /^\d+$/.test(String(rawMaxWidth))
      ? `${rawMaxWidth}px`
      : String(rawMaxWidth)
    : "1024px";

  return (
    <div
      className={`relative w-full overflow-hidden flex flex-col items-center justify-center min-h-[120px] py-16`}
    >
      <div
        className={`relative z-10 w-full max-w-6xl px-4 @sm:px-6 @lg:px-8 mx-auto ${alignClass}`}
        style={{
          maxWidth: normalizedMaxWidth,
        }}
      >
        <div
          className="relative min-h-[120px]"
          style={{
            backgroundColor: cardBackgroundColor === "transparent" ? "transparent" : cardBackgroundColor,
          }}
        />
      </div>
    </div>
  );
}

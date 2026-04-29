export function LuminaLogo({ size = 28, invert = false }: { size?: number; invert?: boolean }) {
  const L_PIXELS = [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: `${size * 0.09}px`,
        width: size,
        height: size,
        padding: `${size * 0.1}px`,
      }}
    >
      {L_PIXELS.flat().map((on, i) => (
        <span
          key={i}
          className={`rounded-[1px] w-full h-full transition-colors duration-300 ${
            invert
              ? on
                ? "bg-white/95"
                : "bg-white/10"
              : on
              ? "bg-black dark:bg-white/95"
              : "bg-black/[0.08] dark:bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

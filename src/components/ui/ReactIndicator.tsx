import React from "react";

export function ReactIndicator() {
  return (
    <span
      className="absolute -top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#23272F] text-white text-xs font-bold shadow"
      style={{ zIndex: 2 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width={18}
        height={18}
        fill="none"
        className="mr-1"
      >
        <circle cx="16" cy="16" r="2.5" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="2" fill="none">
          <ellipse rx="10" ry="4.5" cx="16" cy="16" />
          <ellipse rx="10" ry="4.5" cx="16" cy="16" transform="rotate(60 16 16)" />
          <ellipse rx="10" ry="4.5" cx="16" cy="16" transform="rotate(120 16 16)" />
        </g>
      </svg>
      React
    </span>
  );
}

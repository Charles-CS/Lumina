"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Sparkles
} from "lucide-react";
import { SectionType, useLuminaStore } from "@/store/useLuminaStore";
import { useDndContext, useDroppable } from "@dnd-kit/core";

const QUICK_ADD_ITEMS: { type: SectionType; label: string; icon: React.ElementType }[] = [
];

interface ConnectorProps {
  insertIndex: number;
}

export function Connector({ insertIndex }: ConnectorProps) {
  const { insertSectionAt, isLivePreview, zoomLevel } = useLuminaStore();
  const { active } = useDndContext();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { isOver, setNodeRef } = useDroppable({
    id: `connector-${insertIndex}`,
  });

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleInsert = (type: SectionType) => {
    insertSectionAt(type, insertIndex);
    setOpen(false);
  };

  if (isLivePreview) return null;

  const isSectionLibraryDrag = active?.data.current?.type === "library-item" && active?.data.current?.assetKind === "section";
  const isActive = hovered || open || (isOver && isSectionLibraryDrag);

  // Scale inverses the canvas zoom so the connector button maintains visual size
  const adaptiveScale = 1 / zoomLevel;

  return (
    <motion.div
      layout
      ref={setNodeRef}
      className="relative w-full flex items-center justify-center -my-2"
      style={{ height: 56, zIndex: isActive ? 40 : 10 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => e.stopPropagation()}
    >
      <div ref={wrapperRef} className="absolute inset-x-0 inset-y-0 flex items-center justify-center">
        {/* ── Left arm of the line ── */}
        <div
          className="absolute left-0 right-1/2 flex justify-end items-center"
          style={{ paddingRight: 20 * adaptiveScale }}
        >
          <motion.div
            animate={{ opacity: isActive ? 1 : 0.25 }}
            transition={{ duration: 0.2 }}
            className="h-[2px] w-full"
            style={{
              background: isActive
                ? "linear-gradient(to left, #a78bfa88, transparent)"
                : "linear-gradient(to left, rgba(255,255,255,0.15), transparent)",
            }}
          />
        </div>

        {/* ── Right arm ── */}
        <div
          className="absolute left-1/2 right-0 flex justify-start items-center"
          style={{ paddingLeft: 20 * adaptiveScale }}
        >
          <motion.div
            animate={{ opacity: isActive ? 1 : 0.25 }}
            transition={{ duration: 0.2 }}
            className="h-[2px] w-full"
            style={{
              background: isActive
                ? "linear-gradient(to right, #a78bfa88, transparent)"
                : "linear-gradient(to right, rgba(255,255,255,0.15), transparent)",
            }}
          />
        </div>

        {/* ── Center + button ── */}
        <div 
          className="relative z-10 flex flex-col items-center"
          style={{ transform: `scale(${adaptiveScale})` }}
        >
          <motion.button
            onClick={() => setOpen((v) => !v)}
            animate={{
              scale: open ? 1.1 : isActive ? 1.05 : 1,
              backgroundColor: open ? "#a78bfa" : isActive ? "#2d1b69" : "#111111",
              borderColor: open ? "#a78bfa" : isActive ? "#a78bfa" : "#333333",
              boxShadow: open
                ? "0 0 20px rgba(167,139,250,0.6), 0 0 40px rgba(167,139,250,0.2)"
                : isActive
                ? "0 0 12px rgba(167,139,250,0.8)"
                : "none",
            }}
            transition={{ duration: 0.18 }}
            className="w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg cursor-pointer"
            title={`Insert block at position ${insertIndex}`}
            style={{ color: open ? "#000" : isActive ? "#fff" : "#555" }}
          >
            <motion.div
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              <Plus size={16} strokeWidth={3} />
            </motion.div>
          </motion.button>

          {/* ── Quick Add Popover ── */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -8 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                className="absolute top-10 left-1/2 -translate-x-1/2 z-50 w-[240px]"
              >
                <div className="relative rounded-2xl border border-white/15 shadow-[0_24px_64px_rgba(0,0,0,0.8)] overflow-hidden"
                  style={{ background: "rgba(12,12,12,0.95)", backdropFilter: "blur(24px)" }}>

                  {/* Top violet accent line */}
                  <div className="absolute inset-x-0 top-0 h-px"
                    style={{ background: "linear-gradient(to right, transparent, #a78bfa80, transparent)" }} />

                  {/* Arrow */}
                  <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 border-t border-l border-white/15"
                    style={{ background: "rgba(12,12,12,0.95)" }} />

                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3 px-0.5"
                      style={{ color: "#a78bfa99" }}>
                      Quick Insert Block
                    </p>
                    {QUICK_ADD_ITEMS.length > 0 ? (
                      <div className="grid grid-cols-3 gap-1">
                        {QUICK_ADD_ITEMS.map((item) => {
                          const Icon = item.icon;
                          return (
                            <motion.button
                              key={item.type}
                              onClick={() => handleInsert(item.type)}
                              whileHover={{ scale: 1.05, backgroundColor: "rgba(167,139,250,0.12)" }}
                              whileTap={{ scale: 0.95 }}
                              className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl cursor-pointer transition-colors"
                              style={{ color: "rgba(255,255,255,0.6)" }}
                            >
                              <Icon size={16} />
                              <span className="text-[10px] font-semibold leading-none tracking-wide text-center">
                                {item.label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-3 py-6 text-center">
                        <Sparkles size={16} className="mx-auto mb-2 text-white/35" />
                        <p className="text-xs font-medium text-white/70">No blocks yet</p>
                        <p className="mt-1 text-[10px] text-white/40">Add your new assets later.</p>
                      </div>
                    )}
                  </div>

                  <div className="px-3 py-2 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[9px] text-white/30">
                      Drop from sidebar here
                    </p>
                    <p className="text-[9px] font-mono text-white/20">
                      Pos {insertIndex}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Large invisible hover target that covers the whole connector zone */}
      <div className="absolute inset-x-0 top-1 bottom-1 cursor-pointer" style={{ zIndex: 0 }} />
    </motion.div>
  );
}

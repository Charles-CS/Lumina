"use client";

import React, { useState } from "react";
import { useLuminaStore } from "@/store/useLuminaStore";
import { ChevronRight, Eye, EyeOff, LayoutTemplate, Component as ComponentIcon, Lock, Unlock, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function LayerTreeNode({
  label,
  id,
  type,
  isSelected,
  onSelect,
  childrenNodes,
  level = 0,
  dragListeners,
  dragAttributes,
}: {
  label: string;
  id: string;
  type: "section" | "component";
  isSelected: boolean;
  onSelect: () => void;
  childrenNodes?: React.ReactNode;
  level?: number;
  dragListeners?: Record<string, any>;
  dragAttributes?: Record<string, any>;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  return (
    <div className="flex flex-col w-full relative group/tree">
      <div
        className={`group flex items-center justify-between px-2 py-2 rounded-xl border border-transparent transition-all duration-300 relative overflow-hidden backdrop-blur-2xl ${
          isSelected
            ? "bg-violet-500/10 text-violet-200 border-t-white/10 shadow-[inner_0_1px_1px_rgba(255,255,255,0.1),0_0_20px_rgba(139,92,246,0.15)]"
            : "hover:bg-white/5 text-zinc-400 hover:text-white"
        }`}
        style={{ paddingLeft: `${0.5 + level * 1.25}rem` }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {isSelected && (
           <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent pointer-events-none" />
        )}
        
        <div className="flex items-center gap-2 overflow-hidden flex-1 relative z-10">
          {childrenNodes ? (
            <motion.button
              className="w-4 h-4 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <ChevronRight size={12} strokeWidth={2.5} />
            </motion.button>
          ) : (
            <div className="w-4 h-4" />
          )}

          {dragListeners && (
             <div
               {...dragListeners}
               {...dragAttributes}
               className="cursor-pointer text-white/10 hover:text-white/50 opacity-0 group-hover:opacity-100 transition-opacity"
               onClick={(e) => e.stopPropagation()}
             >
               <GripVertical size={11} strokeWidth={2} />
             </div>
          )}

          {type === "section" ? (
            <LayoutTemplate size={12} strokeWidth={2} className={`shrink-0 ${isSelected ? 'text-violet-400' : 'opacity-50'}`} />
          ) : (
            <ComponentIcon size={12} strokeWidth={2} className={`shrink-0 ${isSelected ? 'text-violet-400' : 'opacity-50'}`} />
          )}

          <span className={`text-[11px] truncate select-none ${isSelected ? 'font-bold' : 'font-medium'}`}>{label}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover/tree:opacity-100 transition-opacity z-10 w-fit shrink-0 pl-2">
          <button
            className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${
              isVisible
                ? "text-white/30 hover:text-white/70"
                : "text-white hover:text-white/70"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(!isVisible);
            }}
          >
            {isVisible ? <Eye size={12} strokeWidth={2} /> : <EyeOff size={12} strokeWidth={2} className="text-white/50" />}
          </button>
          
          <button
            className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${
              isLocked
                ? "text-white hover:text-white/70"
                : "text-white/30 hover:text-white/70"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsLocked(!isLocked);
            }}
          >
            {isLocked ? <Lock size={11} strokeWidth={2.5} className="text-white/50" /> : <Unlock size={11} strokeWidth={2} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && childrenNodes && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden relative"
          >
            <div className="absolute left-[1.125rem] top-0 bottom-1 w-px bg-white/10" />
            {childrenNodes}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SortableSectionNode({ section }: { section: any }) {
  const { selectedId, setSelectedId } = useLuminaStore();
  const sortableId = `tree-${section.id}`;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sortableId });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <LayerTreeNode
        id={section.id}
        type="section"
        label={(section.props.title as string) || section.type}
        isSelected={selectedId === section.id}
        onSelect={() => setSelectedId(section.id)}
        dragListeners={listeners}
        dragAttributes={attributes}
        childrenNodes={
          section.props.components && section.props.components.length > 0 ? (
            <div className="flex flex-col mt-1 space-y-0.5 relative pt-1">
              {section.props.components.map((comp: any) => (
                <LayerTreeNode
                  key={comp.id}
                  id={comp.id}
                  type="component"
                  label={comp.type}
                  isSelected={selectedId === comp.id}
                  onSelect={() => setSelectedId(comp.id)}
                  level={1}
                />
              ))}
            </div>
          ) : null
        }
      />
    </div>
  );
}

export function LayerTreePanel() {
  const { sections, reorderSections } = useLuminaStore();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  if (sections.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-[11px] font-medium text-white/30 border border-white/5 rounded-xl bg-white/[0.02]">
        Canvas is empty
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
       const oldIndex = sections.findIndex(s => `tree-${s.id}` === active.id);
       const newIndex = sections.findIndex(s => `tree-${s.id}` === over.id);
       if (oldIndex !== -1 && newIndex !== -1) {
         reorderSections(oldIndex, newIndex);
       }
    }
  };

  const itemIds = sections.map(s => `tree-${s.id}`);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
       <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1 px-2 pb-4">
            {sections.map(s => <SortableSectionNode key={s.id} section={s} />)}
          </div>
       </SortableContext>
    </DndContext>
  );
}

"use client";

import { Eye, Wand2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";

export interface ProjectCardProps {
  id: string;
  title: string;
  image: string;
  badge: "PRO" | "FREE";
  author: {
    name: string;
    avatar: string;
  };
  views: number;
  imagePosition?: string;
  imageScale?: number;
  priority?: boolean;
  compact?: boolean;
  onClick?: (id: string) => void;
  singleLineAuthor?: boolean;
  imageSectionBg?: string;
}

export function ProjectCard({
  id,
  title,
  image,
  badge,
  author,
  views,
  imagePosition = "top",
  imageScale = 1,
  priority = false,
  compact = false,
  onClick,
  singleLineAuthor = false,
  imageSectionBg,
}: ProjectCardProps) {
  const router = useRouter();

  const handleRemix = () => {
    if (onClick) {
      onClick(id);
    } else {
      router.push(`/dashboard?templateId=${id}`);
    }
  };

  return (
    <div
      onClick={handleRemix}
      className="group relative flex flex-col gap-3 rounded-2xl p-2 border border-black/[0.07] dark:border-white/10 bg-black/[0.02] dark:bg-white/5 backdrop-blur-xl hover:bg-black/[0.05] dark:hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:shadow-[0_0_30px_rgba(167,139,250,0.15)] dark:hover:border-accent-glow/50"
    >
      {/* Image Container */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-xl"
        style={imageSectionBg ? { background: imageSectionBg } : {}}
      >
        <Image
          src={image}
          alt={title}
          fill
          priority={priority}
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={
            title === "Noir Fresh Aesthetic"
              ? "object-contain object-center scale-[1.25] translate-y-4 transition-transform duration-500 group-hover:scale-[1.3]"
              : title === "Noir Commerce"
                ? "object-contain object-center scale-[1.25] translate-y-4 transition-transform duration-500 group-hover:scale-[1.3]"
                : title.toLowerCase().includes("agency contact")
                  ? "object-contain object-center scale-[1.6] transition-transform duration-500 group-hover:scale-[1.7]"
                  : title.toLowerCase().includes("arkiytek platform")
                    ? "object-contain object-center scale-[1.25] transition-transform duration-500 group-hover:scale-[1.3]"
                    : "object-contain object-center scale-110 transition-transform duration-500 group-hover:scale-[1.15]"
          }
          style={{ objectPosition: "center" } as CSSProperties}
        />
        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 px-3 pb-2 pt-2 rounded-xl bg-black/[0.04] dark:bg-[#111111]">
        <div className="flex items-start justify-between gap-3">
          <h3 className={`${compact ? 'text-xs' : 'text-sm'} font-semibold text-black/90 dark:text-white/90 line-clamp-1`}>{title}</h3>
          <div className={`shrink-0 rounded bg-black/10 dark:bg-white/10 px-1.5 py-0.5 ${compact ? 'text-[8px]' : 'text-[9px]'} font-bold tracking-wider text-black/50 dark:text-white/60`}>
            {badge}
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="relative h-5 w-5 overflow-hidden rounded-full border border-black/10 dark:border-white/10">
              <Image src={author.avatar} alt={author.name} fill sizes="20px" className="object-cover" />
            </div>
            <span
              className={
                `text-[11px] font-medium text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white/80 transition-colors${singleLineAuthor ? ' truncate max-w-[80px] block overflow-hidden whitespace-nowrap' : ''}`
              }
              title={author.name}
            >
              {author.name}
            </span>
          </div>

          {/* Stats & Actions */}
          <div className={`flex items-center gap-3 ${compact ? 'text-[10px]' : 'text-[11px]'} font-medium text-black/40 dark:text-white/40`}>
            <div className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
              <Wand2 size={compact ? 10 : 12} />
              <span>Remix</span>
            </div>
            <div className="h-0.5 w-0.5 rounded-full bg-black/20 dark:bg-white/20" />
            <div className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">
              <Eye size={compact ? 10 : 12} />
              <span>{views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

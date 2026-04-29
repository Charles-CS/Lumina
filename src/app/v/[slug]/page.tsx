import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { SectionRenderer } from "@/components/SectionRenderer";

// ─────────────────────────────────────────────────────────────────────────────
// Supabase (server-side — same anon key, public read)
// ─────────────────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface SiteMeta {
  title: string;
  description: string;
  faviconUrl: string | null;
}

interface Section {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

interface ProjectContent {
  sections: Section[];
  siteMeta: SiteMeta;
  globalStyles?: Record<string, unknown>;
}

interface Project {
  id: string;
  name: string;
  slug: string;
  content: ProjectContent;
}

// ─────────────────────────────────────────────────────────────────────────────
// generateMetadata
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { data } = await supabase
    .from("projects")
    .select("name, content")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Preview" };

  const project = data as { name: string; content: ProjectContent };
  const meta = project.content?.siteMeta;

  return {
    title: meta?.title || project.name || "Lumina Preview",
    description: meta?.description || "Live preview powered by Lumina.",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function LivePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  const project = data as Project;
  const { sections = [], siteMeta } = project.content;

  const siteTitle = siteMeta?.title || project.name || "Lumina Site";
  const siteDesc = siteMeta?.description || "";

  return (
    <div className="lumina-preview-root">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          html, body {
            margin: 0;
            padding: 0;
            min-height: 100%;
            height: auto;
            overflow-x: hidden;
            overflow-y: auto !important;
          }
          body {
            font-family: 'Inter', sans-serif;
            background-color: #0c0c10;
            background-image: 
              linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
              linear-gradient(to bottom right, #0e0e12, #0a0a0e, #0c0c10);
            background-size: 32px 32px, 32px 32px, 100% 100%;
            background-attachment: fixed;
            color: #ffffff;
            -webkit-font-smoothing: antialiased;
          }
          .lumina-preview-root { 
            min-height: 100vh;
            width: 100%;
            overflow-y: visible;
          }
          .lumina-preview-main { 
            min-height: 100vh; 
            display: flex; 
            flex-direction: column; 
            width: 100%;
            overflow-y: visible;
          }
          .lumina-empty-state {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; min-height: 100vh; gap: 1rem;
            text-align: center; padding: 4rem 2rem;
          }
          .lumina-empty-icon {
            width: 64px; height: 64px; border-radius: 20px;
            background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.2);
            display: flex; align-items: center; justify-content: center;
            font-size: 28px; margin-bottom: 0.5rem;
          }
          .lumina-empty-title {
            font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em;
            background: linear-gradient(135deg, #a78bfa, #818cf8);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          }
          .lumina-empty-desc { font-size: 0.875rem; color: rgba(255,255,255,0.35); max-width: 400px; }
        `}</style>

      <main className="lumina-preview-main" style={{ justifyContent: sections.length === 1 ? 'center' : undefined }}>
        {sections.length === 0 ? (
          <div className="lumina-empty-state">
            <div className="lumina-empty-icon">🚀</div>
            <h1 className="lumina-empty-title">Site is Live!</h1>
            <p className="lumina-empty-desc">
              No sections have been added yet. Head back to the editor and
              add some content to see it here.
            </p>
          </div>
        ) : (
          sections.map((section: any) => (
            <div className="relative w-full" key={section.id}>
              {/* Explicit section wrapper mimicking Editor's rendering context */}
              <SectionRenderer
                section={section}
                customGlobalStyles={project.content.globalStyles}
                readOnly={true}
              />
            </div>
          ))
        )}
      </main>
    </div>
  );
}

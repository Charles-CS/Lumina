import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

export type SectionType =
  | 'GlobalSection'
  | 'HomePageSection'
  | 'AboutPageSection'
  | 'ServicesProductsSection'
  | 'BlogPageSection'
  | 'SingleBlogPostSection'
  | 'ContactPageSection'
  | 'AuthPagesSection'
  | 'DashboardSection';

export type AtomicComponentType =
  | 'Navbar'
  | 'MainContentArea'
  | 'FooterBlock'
  | 'HeroBlock'
  | 'FeaturesOverview'
  | 'AboutPreview'
  | 'StatsCounters'
  | 'TestimonialsBlock'
  | 'CTABlock'
  | 'BlogPreview'
  | 'PartnersLogos'
  | 'IntroBanner'
  | 'CompanyStory'
  | 'MissionVision'
  | 'TeamSection'
  | 'TimelineHistory'
  | 'AchievementsAwards'
  | 'PageHeaderBanner'
  | 'ServicesGrid'
  | 'ServiceDetails'
  | 'PricingTableBlock'
  | 'ComparisonTable'
  | 'FAQsBlock'
  | 'BlogHeader'
  | 'PostListGrid'
  | 'CategoriesTags'
  | 'SearchBarBlock'
  | 'FeaturedPosts'
  | 'PaginationBlock'
  | 'PostTitleMetadata'
  | 'FeaturedImageBlock'
  | 'ContentBodyBlock'
  | 'AuthorInfo'
  | 'CommentsSection'
  | 'RelatedPosts'
  | 'ContactFormBlock'
  | 'ContactInformation'
  | 'MapLocation'
  | 'SocialLinks'
  | 'LoginForm'
  | 'RegisterForm'
  | 'ForgotPassword'
  | 'ResetPassword'
  | 'SidebarNavigation'
  | 'Topbar'
  | 'OverviewAnalytics'
  | 'TablesDataLists'
  | 'ChartsGraphs'
  | 'SettingsPanel'
  | 'Button'
  | 'Icon'
  | 'Badge'
  | 'Input'
  | 'Textarea'
  | 'Select'
  | 'Checkbox'
  | 'Alert'
  | 'ProgressBar'
  | 'Spinner'
  | 'ImageGallery'
  | 'VideoPlayer'
  | 'Accordion'
  | 'Tabs'
  | 'Tooltip';

export interface AtomicComponentPayload {
  type: AtomicComponentType;
  props: Record<string, unknown>;
  layout?: Partial<ComponentLayout>;
}

export interface ComponentLayout {
  x: number;
  y: number;
}

export interface LuminaComponent {
  id: string;
  type: AtomicComponentType;
  props: Record<string, unknown>;
  layout: ComponentLayout;
}

export interface SectionPayload {
  mode: 'readOnlyTemplate' | 'flexContainer';
  title?: string;
  subtitle?: string;
  components?: AtomicComponentPayload[];
  layout?: SectionLayout;
  visuals?: SectionVisuals;
  typography?: SectionTypography;
  [key: string]: unknown;
}

export interface FreeformElement {
  id: string;
  type: string;
  x: number;
  y: number;
  props: Record<string, any>;
}

export interface SectionTypography {
  fontSize?: number | string;
  lineHeight?: number | string;
  color?: string;
  [key: string]: unknown;
}

export interface SectionLayout {
  padding?: string | number;
  paddingX?: string | number;
  gap?: string | number;
  alignment?: string;
  position?: 'relative' | 'absolute' | 'fixed' | 'static';
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent?: string;
  alignItems?: string;
  [key: string]: unknown;
}

/** Per-breakpoint layout overrides stored alongside section props. */
export interface ResponsiveBreakpointOverrides {
  paddingY?: number;
  paddingX?: number;
  gap?: number;
}

export interface ResponsiveProps {
  mobile?: ResponsiveBreakpointOverrides;
  tablet?: ResponsiveBreakpointOverrides;
  desktop?: ResponsiveBreakpointOverrides;
}

export interface SectionVisuals {
  borderRadius?: string | number;
  borderWeight?: string | number;
  shadow?: string;
  [key: string]: unknown;
}

export interface LuminaSection {
  id: string;
  type: SectionType;
  props: {
    mode: 'readOnlyTemplate' | 'flexContainer';
    components: LuminaComponent[];
    typography?: SectionTypography;
    layout?: SectionLayout;
    visuals?: SectionVisuals;
    texts?: Record<string, string>;
    elements?: FreeformElement[];
    /** Breakpoint-specific overrides for layout properties. */
    responsive?: ResponsiveProps;
    [key: string]: unknown;
  };
}

export interface GlobalStyles {
  typography: {
    fontFamily: string;
    h1Size: number;
    h2Size: number;
    h3Size: number;
    pSize: number;
  };
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  borderRadii: {
    root: number;
    components: number;
  };
}

export interface SiteMeta {
  title: string;
  description: string;
  faviconUrl: string | null;
}

export type PublishStatus = 'Draft' | 'Live';

interface LuminaState {
  sections: LuminaSection[];
  selectedId: string | null;
  selectedTextPath: { sectionId: string; textKey: string } | null;
  zoomLevel: number;
  isLivePreview: boolean;
  viewMode: "desktop" | "tablet" | "mobile";
  globalStyles: GlobalStyles;
  globalCanvasBackgroundColor: string;
  // ── Publish / project state ──────────────────────────────────────────────
  projectName: string;
  siteMeta: SiteMeta;
  publishStatus: PublishStatus;
  deployedSlug: string | null;
  // ── Actions ──────────────────────────────────────────────────────────────
  setGlobalCanvasBackgroundColor: (color: string) => void;
  setZoom: (level: number) => void;
  setViewMode: (mode: "desktop" | "tablet" | "mobile") => void;
  setGlobalStyles: (styles: Partial<GlobalStyles>) => void;
  undo: () => void;
  redo: () => void;
  setLivePreview: (v: boolean) => void;
  setProjectName: (name: string) => void;
  setSiteMeta: (meta: Partial<SiteMeta>) => void;
  publishProject: () => Promise<{ slug: string }>;
  addSection: (type: SectionType, payload?: Partial<SectionPayload>) => void;
  duplicateSection: (id: string) => void;
  insertSectionAt: (type: SectionType, index: number, payload?: Partial<SectionPayload>) => void;
  addComponentToSection: (sectionId: string, component: AtomicComponentPayload, layout?: Partial<ComponentLayout>) => void;
  moveComponentInSection: (sectionId: string, componentId: string, layout: ComponentLayout) => void;
  updateComponentProps: (sectionId: string, componentId: string, props: Record<string, unknown>) => void;
  removeSection: (id: string) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  updateSection: (id: string, newProps: Partial<LuminaSection["props"]>) => void;
  setSelectedId: (id: string | null) => void;
  setSelectedTextPath: (path: { sectionId: string; textKey: string } | null) => void;
  selectedFreeformElementId: string | null;
  setSelectedFreeformElementId: (id: string | null) => void;
  addFreeformElement: (sectionId: string, element: Omit<FreeformElement, "id">) => void;
  updateFreeformElement: (sectionId: string, elementId: string, updates: Partial<Omit<FreeformElement, "id">>) => void;
  removeFreeformElement: (sectionId: string, elementId: string) => void;
}

function createSection(type: SectionType, payload?: Partial<SectionPayload>): LuminaSection {
  const mode = 'readOnlyTemplate';
  const sectionPayload = payload || {};
  const nestedComponents = sectionPayload.components || [];

  return {
    id: `${type.toLowerCase()}-${crypto.randomUUID()}`,
    type,
    props: {
      mode: sectionPayload.mode || mode,
      title: sectionPayload.title || type,
      subtitle: sectionPayload.subtitle || '',
      paddingY: 100,
      baseColor: '#a78bfa',
      typography: sectionPayload.typography,
      layout: sectionPayload.layout,
      visuals: sectionPayload.visuals,
      components: nestedComponents.map((component) => ({
        id: `${component.type.toLowerCase()}-${crypto.randomUUID()}`,
        type: component.type,
        props: component.props,
        layout: {
          x: typeof component.layout?.x === 'number' ? component.layout.x : 32,
          y: typeof component.layout?.y === 'number' ? component.layout.y : 32,
        },
      })),
    },
  };
}

// Helper for deep merging plain objects
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const output: Record<string, unknown> = { ...target };

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      !Array.isArray(sourceValue) &&
      typeof targetValue === 'object' &&
      targetValue !== null &&
      !Array.isArray(targetValue)
    ) {
      output[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      );
    } else {
      output[key] = sourceValue;
    }
  });

  return output;
}

interface StoreHistory {
  sections: LuminaSection[];
  globalStyles: GlobalStyles;
  globalCanvasBackgroundColor: string;
}

export const useLuminaStore = create<LuminaState & { past: StoreHistory[], future: StoreHistory[] }>((_set, get) => {
  const set: typeof _set = (partial, replace) => {
    const prevState = get();
    const nextState = typeof partial === 'function' ? (partial as any)(prevState) : partial;

    const modifiesHistory = nextState.sections || nextState.globalStyles || nextState.globalCanvasBackgroundColor;

    if (modifiesHistory && !nextState.past && !nextState.future) {
      const snapshot = {
        sections: JSON.parse(JSON.stringify(prevState.sections)),
        globalStyles: JSON.parse(JSON.stringify(prevState.globalStyles)),
        globalCanvasBackgroundColor: prevState.globalCanvasBackgroundColor,
      };
      _set({
        past: [...(prevState.past || []), snapshot],
        future: [],
        ...nextState
      } as any, replace as any);
    } else {
      _set(nextState as any, replace as any);
    }
  };

  return {
    past: [],
    future: [],
    sections: [],
    selectedId: null,
    selectedTextPath: null,
    zoomLevel: 0.8,
    isLivePreview: false,
    viewMode: "desktop",
    setViewMode: (mode) => set({ viewMode: mode }),
    // ── Publish state defaults ────────────────────────────────────────────
    projectName: 'Untitled Project',
    siteMeta: { title: '', description: '', faviconUrl: null },
    publishStatus: 'Draft',
    deployedSlug: null,
    setProjectName: (name) => _set({ projectName: name }),
    setSiteMeta: (meta) => _set((state) => ({ siteMeta: { ...state.siteMeta, ...meta } })),
    publishProject: async () => {
      const state = get();
      const slug = crypto.randomUUID().replace(/-/g, '').slice(0, 6);
      const content = {
        sections: state.sections,
        siteMeta: state.siteMeta,
        globalStyles: state.globalStyles,
      };

      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("You must be logged in to deploy a site.");

      const { error } = await supabase
        .from('projects')
        .upsert(
          {
            user_id: user.id,
            name: state.projectName || 'Untitled Project',
            slug,
            content,
          },
          { onConflict: 'slug' }
        );
      if (error) throw new Error(error.message);
      _set({ publishStatus: 'Live', deployedSlug: slug });
      return { slug };
    },
    // ─────────────────────────────────────────────────────────────────────
    globalStyles: {
      typography: { fontFamily: "sans", h1Size: 48, h2Size: 36, h3Size: 24, pSize: 16 },
      brandColors: { primary: "#a78bfa", secondary: "#4ade80", accent: "#f472b6" },
      borderRadii: { root: 24, components: 12 },
    },
    setGlobalStyles: (styles) => set((state) => ({ globalStyles: { ...state.globalStyles, ...styles } })),
    undo: () => {
      const state = get();
      if (!state.past || state.past.length === 0) return;
      const newPast = [...state.past];
      const previous = newPast.pop()!;
      const currentSnapshot: StoreHistory = {
        sections: state.sections,
        globalStyles: state.globalStyles,
        globalCanvasBackgroundColor: state.globalCanvasBackgroundColor,
      };
      _set({
        past: newPast,
        future: [currentSnapshot, ...(state.future || [])],
        sections: previous.sections,
        globalStyles: previous.globalStyles,
        globalCanvasBackgroundColor: previous.globalCanvasBackgroundColor,
      } as any);
    },
    redo: () => {
      const state = get();
      if (!state.future || state.future.length === 0) return;
      const newFuture = [...state.future];
      const next = newFuture.shift()!;
      const currentSnapshot: StoreHistory = {
        sections: state.sections,
        globalStyles: state.globalStyles,
        globalCanvasBackgroundColor: state.globalCanvasBackgroundColor,
      };
      _set({
        past: [...(state.past || []), currentSnapshot],
        future: newFuture,
        sections: next.sections,
        globalStyles: next.globalStyles,
        globalCanvasBackgroundColor: next.globalCanvasBackgroundColor,
      } as any);
    },
    globalCanvasBackgroundColor: "transparent",
    setGlobalCanvasBackgroundColor: (color) => set({ globalCanvasBackgroundColor: color }),

    selectedFreeformElementId: null,
    setSelectedFreeformElementId: (id) => set({ selectedFreeformElementId: id }),

    addFreeformElement: (sectionId, element) =>
      set((state) => {
        return {
          sections: state.sections.map((section) => {
            if (section.id !== sectionId) return section;
            const newElements = section.props.elements || [];
            return {
              ...section,
              props: {
                ...section.props,
                elements: [
                  ...newElements,
                  { ...element, id: `freeform-${crypto.randomUUID()}` },
                ],
              },
            };
          }),
        };
      }),

    updateFreeformElement: (sectionId, elementId, updates) =>
      set((state) => {
        return {
          sections: state.sections.map((section) => {
            if (section.id !== sectionId) return section;
            const existingElements = section.props.elements || [];
            return {
              ...section,
              props: {
                ...section.props,
                elements: existingElements.map((el) =>
                  el.id === elementId ? { ...el, ...updates } : el
                ),
              },
            };
          }),
        };
      }),

    removeFreeformElement: (sectionId, elementId) =>
      set((state) => {
        return {
          sections: state.sections.map((section) => {
            if (section.id !== sectionId) return section;
            const existingElements = section.props.elements || [];
            return {
              ...section,
              props: {
                ...section.props,
                elements: existingElements.filter((el) => el.id !== elementId),
              },
            };
          }),
        };
      }),

    setZoom: (level) => set({ zoomLevel: level }),
    setLivePreview: (v) => set({ isLivePreview: v }),

    addSection: (type, payload) =>
      set((state) => ({
        sections: [
          ...state.sections,
          createSection(type, payload),
        ],
      })),

    duplicateSection: (id) =>
      set((state) => {
        const sectionToDuplicate = state.sections.find((s) => s.id === id);
        if (!sectionToDuplicate) return state;

        const newSection: LuminaSection = {
          ...sectionToDuplicate,
          id: `${sectionToDuplicate.type.toLowerCase()}-${crypto.randomUUID()}`,
          // Deep copy props to avoid reference sharing
          props: JSON.parse(JSON.stringify(sectionToDuplicate.props)) as LuminaSection['props'],
        };

        const insertIndex = state.sections.findIndex((s) => s.id === id) + 1;
        const newSections = [...state.sections];
        newSections.splice(insertIndex, 0, newSection);

        return { sections: newSections };
      }),

    insertSectionAt: (type, index, payload) =>
      set((state) => {
        const newSection = createSection(type, payload);

        const newSections = [...state.sections];
        newSections.splice(index, 0, newSection);

        return { sections: newSections };
      }),

    addComponentToSection: (sectionId, component, layout) =>
      set((state) => ({
        sections: state.sections.map((section) => {
          if (section.id !== sectionId) return section;

          return {
            ...section,
            props: {
              ...section.props,
              components: [
                ...(section.props.components || []),
                {
                  id: `${component.type.toLowerCase()}-${crypto.randomUUID()}`,
                  type: component.type,
                  props: component.props,
                  layout: {
                    x: typeof layout?.x === 'number' ? layout.x : 32,
                    y: typeof layout?.y === 'number' ? layout.y : 32,
                  },
                },
              ],
            },
          };
        }),
      })),

    moveComponentInSection: (sectionId, componentId, layout) =>
      set((state) => ({
        sections: state.sections.map((section) => {
          if (section.id !== sectionId) return section;

          return {
            ...section,
            props: {
              ...section.props,
              components: section.props.components.map((component) =>
                component.id === componentId
                  ? {
                    ...component,
                    layout,
                  }
                  : component
              ),
            },
          };
        }),
      })),

    updateComponentProps: (sectionId, componentId, props) =>
      set((state) => ({
        sections: state.sections.map((section) => {
          if (section.id !== sectionId) return section;

          return {
            ...section,
            props: {
              ...section.props,
              components: section.props.components.map((component) =>
                component.id === componentId
                  ? {
                    ...component,
                    props: {
                      ...component.props,
                      ...props,
                    },
                  }
                  : component
              ),
            },
          };
        }),
      })),

    removeSection: (id) =>
      set((state) => ({
        sections: state.sections.filter((section) => section.id !== id),
        selectedId: state.selectedId === id ? null : state.selectedId,
      })),

    reorderSections: (startIndex, endIndex) =>
      set((state) => {
        const result = Array.from(state.sections);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { sections: result };
      }),

    updateSection: (id, newProps) =>
      set((state) => ({
        sections: state.sections.map((section) =>
          section.id === id
            ? {
              ...section,
              props: deepMerge(
                section.props as Record<string, unknown>,
                newProps as Record<string, unknown>
              ) as LuminaSection['props'],
            }
            : section
        ),
      })),

    setSelectedId: (id) => set({ selectedId: id, selectedTextPath: null }),
    setSelectedTextPath: (path) => set({ selectedTextPath: path }),
  };
});



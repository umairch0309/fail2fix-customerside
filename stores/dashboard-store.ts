import { create } from "zustand";

type Breadcrumb = {
  label: string;
  href?: string;
};

type HeaderButton = {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  icon?: React.ReactNode;
};

export type DashboardState = {
  // Header
  pageTitle: string;
  pageDescription: string;
  breadcrumbs: Breadcrumb[];
  showBreadcrumbs: boolean;
  headerButton: HeaderButton | null;
  showHeaderButton: boolean;

  // Sidebar
  sidebarOpen: boolean;
  notifications: number;
};

export type DashboardActions = {
  // Header actions
  setPageTitle: (title: string) => void;
  setPageDescription: (description: string) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  setShowBreadcrumbs: (show: boolean) => void;
  setHeaderButton: (button: HeaderButton | null) => void;
  setShowHeaderButton: (show: boolean) => void;
  setHeader: (config: {
    title?: string;
    description?: string;
    breadcrumbs?: Breadcrumb[];
    showBreadcrumbs?: boolean;
    button?: HeaderButton | null;
    showButton?: boolean;
  }) => void;
  resetHeader: () => void;

  // Sidebar actions
  setSidebarOpen: (open: boolean) => void;
  setNotifications: (count: number) => void;
};

export type DashboardStore = DashboardState & DashboardActions;

const defaultHeaderState = {
  pageTitle: "",
  pageDescription: "",
  breadcrumbs: [],
  showBreadcrumbs: true,
  headerButton: null,
  showHeaderButton: false,
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  // Initial state
  ...defaultHeaderState,
  sidebarOpen: true,
  notifications: 0,

  // Header actions
  setPageTitle: (title) => set({ pageTitle: title }),
  setPageDescription: (description) => set({ pageDescription: description }),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  setShowBreadcrumbs: (show) => set({ showBreadcrumbs: show }),
  setHeaderButton: (button) => set({ headerButton: button }),
  setShowHeaderButton: (show) => set({ showHeaderButton: show }),
  setHeader: (config) =>
    set((state) => ({
      pageTitle: config.title ?? state.pageTitle,
      pageDescription: config.description ?? state.pageDescription,
      breadcrumbs: config.breadcrumbs ?? state.breadcrumbs,
      showBreadcrumbs: config.showBreadcrumbs ?? state.showBreadcrumbs,
      headerButton: config.button !== undefined ? config.button : state.headerButton,
      showHeaderButton: config.showButton ?? state.showHeaderButton,
    })),
  resetHeader: () => set(defaultHeaderState),

  // Sidebar actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setNotifications: (count) => set({ notifications: count }),
}));

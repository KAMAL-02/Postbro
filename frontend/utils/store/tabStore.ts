import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { useRequestStore } from "./requestStore";
import { useResponseStore } from "./responseStore";

export interface Tab {
  id: string;
  title: string;
  method: string;
}

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
  loadingFromHistory: boolean;

  addTab: () => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabTitle: (id: string, title: string) => void;
  updateTabMethod: (id: string, method: string) => void;
  addTabFromHistory: (history: any) => void;
  setLoadingFromHistory: (loading: boolean) => void;
}

export const useTabStore = create<TabState>((set) => ({
  tabs: [],
  activeTabId: null,

  addTab: () =>
    set((state) => {
      const newTabId = uuidv4();
      const newTab = {
        id: newTabId,
        title: "Untitled",
        method: "GET",
      };

      const updatedTabs = [...state.tabs, newTab];

      setTimeout(() => {
        useRequestStore.getState().initRequest(newTabId);
        useResponseStore.getState().initResponse(newTabId);
      }, 0);

      return {
        tabs: updatedTabs,
        activeTabId: newTabId,
      };
    }),

  removeTab: (id) =>
    set((state) => {
      const updatedTabs = state.tabs.filter((tab) => tab.id !== id);

      let activeTabId = state.activeTabId;
      // If we're removing the active tab, switch to another tab
      if (activeTabId === id) {
        const index = state.tabs.findIndex((tab) => tab.id === id);
        // Try to select the tab to the right, or if that doesn't exist, the tab to the left
        const newIndex = Math.min(index, updatedTabs.length - 1);
        activeTabId =
          updatedTabs.length > 0 ? updatedTabs[newIndex]?.id || null : null;
      }

      return {
        tabs: updatedTabs,
        activeTabId,
      };
    }),

  setActiveTab: (id) => set({ activeTabId: id }),

  updateTabTitle: (id, title) =>
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, title } : tab)),
    })),

  updateTabMethod: (id, method) =>
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, method } : tab)),
    })),

  loadingFromHistory: false,
  setLoadingFromHistory: (loading) => set({ loadingFromHistory: loading }),

  addTabFromHistory: (history) => {
    set({ loadingFromHistory: true });
  
    set((state) => {
      const newTabId = uuidv4();
      const newTab = {
        id: newTabId,
        title: history.request.title,
        method: history.request.method,
      };
  
      const updatedTabs = [...state.tabs, newTab];
  
      // Delay hydration to avoid flicker, and update loading state after hydration
      setTimeout(() => {
        useRequestStore.getState().initHistoryRequest(newTabId, history);
        useResponseStore.getState().initHistoryResponse(newTabId, history);
        set({ loadingFromHistory: false });
      }, 300);
  
      return {
        tabs: updatedTabs,
        activeTabId: newTabId,
      };
    });
  },
  
}));

import { create } from "zustand";

type RequestItem = {
  id: string;
  method: string;
  url: string;
  timestamp: string;
  request: any;
};

type HistoryState = {
  history: RequestItem[];
  setHistory: (history: RequestItem[]) => void;
  addToHistory: (item: RequestItem) => void;
  removeFromHistory: (id: string) => void;
};

export const useHistoryStore = create<HistoryState>((set) => ({
  history: [],
  setHistory: (history) => {
    set({ history })
  },
  addToHistory: (item) =>
    set((state) => ({
      history: [item, ...state.history],
    })),
  removeFromHistory: (id) =>
    set((state) => ({
      history: state.history.filter((h) => h.id !== id),
    })),
}));

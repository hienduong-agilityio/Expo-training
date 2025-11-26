import { create } from 'zustand';

interface SearchState {
  categoryId: string | null;
  categoryName: string | null;
  searchQuery: string | null;
  setCategory: (categoryId: string | null, categoryName: string | null) => void;
  setSearchQuery: (query: string | null) => void;
  clearCategory: () => void;
  clearSearch: () => void;
  clearAll: () => void;
}

export const searchStore = create<SearchState>(set => ({
  categoryId: null,
  categoryName: null,
  searchQuery: null,
  setCategory: (categoryId, categoryName) => set({ categoryId, categoryName }),
  setSearchQuery: query => set({ searchQuery: query }),
  clearCategory: () => set({ categoryId: null, categoryName: null }),
  clearSearch: () => set({ searchQuery: null }),
  clearAll: () =>
    set({ categoryId: null, categoryName: null, searchQuery: null }),
}));

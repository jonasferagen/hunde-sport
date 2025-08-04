import { Category } from '@/models/Category';
import { create } from 'zustand';

interface CategoryState {
    categories: Category[];
    isLoading: boolean;
    setCategories: (categories: Category[]) => void;
    setIsLoading: (isLoading: boolean) => void;
    getCategoryById: (id: number) => Category | undefined;
    getSubCategories: (parentId: number) => Category[];
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    isLoading: true, // Start with loading true

    setCategories: (categories: Category[]) => set({ categories }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),

    getCategoryById: (id: number) => {
        return get().categories.find(c => c.id === id);
    },

    getSubCategories: (parentId: number) => {
        return get().categories.filter(c => c.parent === parentId && c.shouldDisplay());
    },
}));

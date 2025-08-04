import { ProductCategory } from '@/models/Category';
import { create } from 'zustand';

interface CategoryState {
    categories: ProductCategory[];
    setCategories: (categories: ProductCategory[]) => void;
    getCategoryById: (id: number) => ProductCategory | undefined;
    getSubCategories: (parentId: number) => ProductCategory[];
    getBreadcrumbTrail: (categoryId: number) => ProductCategory[];
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],

    setCategories: (categories: ProductCategory[]) => set({ categories }),

    getCategoryById: (id: number) => {
        return get().categories.find(c => c.id === id);
    },

    getSubCategories: (parentId: number) => {
        return get().categories.filter(c => c.parent === parentId && c.shouldDisplay());
    },

    getBreadcrumbTrail: (categoryId: number) => {
        const breadcrumbTrail: ProductCategory[] = [];
        let currentCategory = get().getCategoryById(categoryId);

        while (currentCategory && currentCategory.id !== 0) {
            breadcrumbTrail.unshift(currentCategory);
            currentCategory = get().getCategoryById(currentCategory.parent);
        }

        return breadcrumbTrail;
    },
}));

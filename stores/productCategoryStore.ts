import { ProductCategory } from '@/models/ProductCategory';
import { create } from 'zustand';

interface ProductCategoryState {
    productCategories: ProductCategory[];
    setProductCategories: (productCategories: ProductCategory[]) => void;
    getProductCategoryById: (id: number) => ProductCategory | undefined;
    getSubProductCategories: (parentId: number) => ProductCategory[];
    getBreadcrumbTrail: (productCategoryId: number) => ProductCategory[];
}

export const useProductCategoryStore = create<ProductCategoryState>((set, get) => ({
    productCategories: [],

    setProductCategories: (productCategories: ProductCategory[]) => set({ productCategories }),

    getProductCategoryById: (id: number) => {
        return get().productCategories.find(c => c.id === id);
    },

    getSubProductCategories: (parentId: number) => {
        return get().productCategories.filter(c => c.parent === parentId && c.shouldDisplay());
    },

    getBreadcrumbTrail: (productCategoryId: number) => {
        const breadcrumbTrail: ProductCategory[] = [];
        let currentProductCategory = get().getProductCategoryById(productCategoryId);

        while (currentProductCategory && currentProductCategory.id !== 0) {
            breadcrumbTrail.unshift(currentProductCategory);
            currentProductCategory = get().getProductCategoryById(currentProductCategory.parent);
        }

        return breadcrumbTrail;
    },
}));

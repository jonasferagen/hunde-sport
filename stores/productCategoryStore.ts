import { ProductCategory } from '@/domain/ProductCategory';
import { create } from 'zustand';

interface ProductCategoryState {
    productCategories: ProductCategory[];
    setProductCategories: (productCategories: ProductCategory[]) => void;
    getProductCategoryById: (id: number) => ProductCategory | undefined;
}

export const useProductCategoryStore = create<ProductCategoryState>((set, get) => ({
    productCategories: [],

    setProductCategories: (productCategories: ProductCategory[]) => set({ productCategories }),

    getProductCategoryById: (id: number) => {
        return get().productCategories.find(c => c.id === id);
    },

}));

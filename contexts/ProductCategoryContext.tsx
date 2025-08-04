import { ProductCategory } from '@/models/Category';
import { useCategoryStore } from '@/stores/CategoryStore';
import React, { createContext, useContext } from 'react';

export interface ProductCategoryContextType {
    productCategory?: ProductCategory;
    productCategories: ProductCategory[];
}

const ProductCategoryContext = createContext<ProductCategoryContextType | undefined>(undefined);

export const useProductCategoryContext = () => {
    const context = useContext(ProductCategoryContext);
    if (!context) {
        throw new Error('useProductCategoryContext must be used within a ProductCategoryProvider');
    }
    return context;
};

interface ProductCategoryProviderProps {
    productCategoryId?: number;
    productCategories?: ProductCategory[];
    children: React.ReactNode;
}

export const ProductCategoryProvider: React.FC<ProductCategoryProviderProps> = ({
    productCategoryId,
    productCategories,
    children,
}) => {
    const {
        getCategoryById: getProductCategoryById,
        getSubCategories,
    } = useCategoryStore();

    // If categoryId is provided, it takes precedence and fetches from the store.
    const productCategory = getProductCategoryById(productCategoryId ?? 0);
    // Use passed-in categories if available, otherwise derive from parent category.
    const value: ProductCategoryContextType = {
        productCategory: productCategory,
        productCategories: productCategories ?? getSubCategories(productCategory?.id ?? 0),
    };

    return <ProductCategoryContext.Provider value={value}>{children}</ProductCategoryContext.Provider>;
};

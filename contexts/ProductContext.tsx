import { useProductVariants } from '@/hooks/useProductVariants';
import { Product } from '@/models/Product';
import { ProductAttribute } from '@/models/ProductAttribute';
import React, { createContext, useContext, useMemo } from 'react';

interface ProductContextType {
    product: Product;
    productVariants: Product[];
    displayProduct: Product | null;
    priceRange: { min: number; max: number } | null;
    handleOptionSelect: (attributeId: number, option: string) => void;
    availableOptions: Map<number, Map<string, Product[]>>;
    selectedOptions: Record<number, string>;
    variationAttributes: ProductAttribute[];
    isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ product: Product; children: React.ReactNode }> = ({
    product,
    children,
}) => {
    const {
        productVariant,
        productVariants,
        handleOptionSelect,
        availableOptions,
        selectedOptions,
        variationAttributes,
        isLoading,
    } = useProductVariants(product);

    const priceRange = useMemo(() => {
        if (!productVariants) {
            return null;
        }

        if (productVariants.length === 0) {
            return null;
        }

        const prices = productVariants.map((v: Product) => v.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        if (min === max) {
            return null;
        }

        return { min, max };
    }, [productVariants]);

    const displayProduct = productVariant || product;

    const value = {
        product,
        displayProduct,
        productVariants,
        priceRange,
        handleOptionSelect,
        availableOptions,
        selectedOptions,
        variationAttributes,
        isLoading,
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};
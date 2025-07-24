import { useProductVariations } from '@/hooks/data/Product';
import { Product } from '@/models/Product';
import { ProductAttribute } from '@/models/ProductAttribute';
import React, { createContext, useContext, useMemo, useState } from 'react';

export const calculatePriceRange = (productVariations: Product[] | undefined | null): { min: number; max: number } | null => {
    if (!productVariations || productVariations.length === 0) {
        return null;
    }

    const prices = productVariations.map((p) => p.price).filter((p) => p > 0);

    if (prices.length === 0) {
        return null;
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max };
};

interface ProductContextType {
    product: Product;
    productVariant?: Product | null;
    productVariants: Product[];
    priceRange: { min: number; max: number } | null;
    handleOptionSelect: (attributeId: number, option: string) => void;
    availableOptions: Map<number, Map<string, Product[]>>;
    selectedOptions: Record<number, string>;
    variationAttributes: ProductAttribute[];
    isLoading: boolean;
    isProductVariantsLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ product: Product; children: React.ReactNode }> = ({ product, children }) => {
    const isVariable = product.type === 'variable';

    const { items: productVariants, isLoading, isFetchingNextPage, hasNextPage } = useProductVariations(product.id, { enabled: isVariable, autoload: true });

    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});

    const variationAttributes = useMemo(() => {
        if (!isVariable) return [];
        return product.getVariationAttributes();
    }, [product, isVariable]);

    const productVariant = useMemo(() => {
        if (!isVariable || !productVariants || Object.keys(selectedOptions).length < variationAttributes.length) {
            return null;
        }
        return product.findVariant(productVariants, selectedOptions) || null;
    }, [selectedOptions, productVariants, product, isVariable, variationAttributes]);

    const handleOptionSelect = (attributeId: number, optionName: string) => {
        setSelectedOptions(prev => {
            const newOptions = { ...prev };
            const currentOption = newOptions[attributeId];

            // Deselect if the same option is clicked again
            if (currentOption === optionName) {
                delete newOptions[attributeId];
            } else {
                newOptions[attributeId] = optionName;
            }

            // Filter out attributes that are no longer valid
            const validAttributes = product.getAvailableOptions(productVariants || [], newOptions);
            const finalOptions: Record<number, string> = {};
            for (const id in newOptions) {
                if (validAttributes.has(Number(id))) {
                    finalOptions[id] = newOptions[id];
                }
            }

            return finalOptions;
        });
    };

    const availableOptions = useMemo(() => {
        if (!isVariable || !productVariants) return new Map();
        return product.getAvailableOptions(productVariants, selectedOptions);
    }, [product, productVariants, selectedOptions, isVariable]);

    const priceRange = useMemo(() => calculatePriceRange(productVariants), [productVariants]);

    const value = {
        product,
        productVariant,
        productVariants: productVariants || [],
        priceRange,
        handleOptionSelect,
        availableOptions,
        selectedOptions,
        variationAttributes,
        isLoading,
        isProductVariantsLoading: isFetchingNextPage || hasNextPage,
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
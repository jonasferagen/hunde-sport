import { useProductVariations } from '@/hooks/data/Product';
import { Product } from '@/models/Product';
import { ProductAttribute } from '@/models/ProductAttribute';
import { ProductVariation } from '@/models/ProductVariation';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

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
    productVariation?: ProductVariation | null;
    productVariations: ProductVariation[];
    priceRange: { min: number; max: number } | null;
    handleOptionSelect: (attributeId: number, option: string) => void;
    availableOptions: Map<number, Map<string, ProductVariation[]>>;
    selectedOptions: Record<number, string>;
    variationAttributes: ProductAttribute[];
    isLoading: boolean;
    isProductVariationsLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const getOptionsFromVariation = (variation: ProductVariation | null | undefined) => {
    if (!variation || !variation.attributes) return {};
    return variation.attributes.reduce(
        (acc, attr) => {
            if (attr.id && attr.option) {
                acc[attr.id] = attr.option;
            }
            return acc;
        },
        {} as Record<number, string>
    );
};

export const ProductProvider: React.FC<{ product: Product; productVariation?: ProductVariation | null; children: React.ReactNode }> = ({
    product,
    productVariation: initialProductVariant,
    children,
}) => {
    const isVariable = product.type === 'variable';

    const { items: productVariations, isLoading, isFetchingNextPage, hasNextPage } = useProductVariations(product.id, { enabled: isVariable, autoload: true });

    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>(() => getOptionsFromVariation(initialProductVariant));

    useEffect(() => {
        setSelectedOptions(getOptionsFromVariation(initialProductVariant));
    }, [initialProductVariant]);

    const variationAttributes = useMemo(() => {
        if (!isVariable) return [];
        return product.getVariationAttributes();
    }, [product, isVariable]);

    const productVariation = useMemo(() => {
        if (!isVariable || !productVariations || Object.keys(selectedOptions).length < variationAttributes.length) {
            return null;
        }
        return product.findVariant(productVariations, selectedOptions) || null;
    }, [selectedOptions, productVariations, product, isVariable, variationAttributes]);

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
            const validAttributes = product.getAvailableOptions(productVariations || [], newOptions);
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
        if (!isVariable || !productVariations) return new Map();
        return product.getAvailableOptions(productVariations, selectedOptions);
    }, [product, productVariations, selectedOptions, isVariable]);

    const priceRange = useMemo(() => calculatePriceRange(productVariations), [productVariations]);

    const value = {
        product,
        productVariation,
        productVariations: productVariations || [],
        priceRange,
        handleOptionSelect,
        availableOptions,
        selectedOptions,
        variationAttributes,
        isLoading,
        isProductVariationsLoading: isFetchingNextPage || hasNextPage,
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
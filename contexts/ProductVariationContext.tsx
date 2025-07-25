import { Product } from '@/models/Product';
import { ProductAttribute } from '@/models/ProductAttribute';
import { ProductVariation } from '@/models/ProductVariation';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useProductStateContext } from './ProductStateContext';

interface ProductVariationContextType {
    handleOptionSelect: (attributeId: number, option: string) => void;
    availableOptions: Map<number, Map<string, ProductVariation[]>>;
    selectedOptions: Record<number, string>;
    productVariationAttributes: ProductAttribute[];
}

const ProductVariationContext = createContext<ProductVariationContextType | undefined>(undefined);

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

export const ProductVariationProvider: React.FC<{ 
    product: Product;
    productVariations: ProductVariation[];
    initialProductVariation?: ProductVariation | null;
    children: React.ReactNode 
}> = ({ product, productVariations, initialProductVariation, children }) => {
    const { setProductVariation } = useProductStateContext();
    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>(() => getOptionsFromVariation(initialProductVariation));

    const productVariationAttributes = useMemo(() => {
        return product.getVariationAttributes();
    }, [product]);

    const productVariation = useMemo(() => {
        if (Object.keys(selectedOptions).length < productVariationAttributes.length) {
            return null;
        }
        return product.findVariant(productVariations, selectedOptions) || null;
    }, [selectedOptions, productVariations, product, productVariationAttributes]);

    useEffect(() => {
        setProductVariation(productVariation);
    }, [productVariation, setProductVariation]);

    const handleOptionSelect = (attributeId: number, optionName: string) => {
        setSelectedOptions(prev => {
            const newOptions = { ...prev };
            const currentOption = newOptions[attributeId];

            if (currentOption === optionName) {
                delete newOptions[attributeId];
            } else {
                newOptions[attributeId] = optionName;
            }

            const validAttributes = product.getAvailableOptions(productVariations, newOptions);
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
        return product.getAvailableOptions(productVariations, selectedOptions);
    }, [product, productVariations, selectedOptions]);

    const value = {
        handleOptionSelect,
        availableOptions,
        selectedOptions,
        productVariationAttributes,
    };

    return <ProductVariationContext.Provider value={value}>{children}</ProductVariationContext.Provider>;
};

export const useProductVariationContext = () => {
    const context = useContext(ProductVariationContext);
    if (context === undefined) {
        throw new Error('useProductVariationContext must be used within a ProductVariationProvider');
    }
    return context;
};

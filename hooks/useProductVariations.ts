import { useProducts } from '@/hooks/Product';
import { Product } from '@/models/Product';
import { useEffect, useMemo, useState } from 'react';

export const useProductVariations = (product: Product) => {
    // --- Optimization: Early exit for non-variable products ---
    if (product.type !== 'variable') {
        return {
            productVariant: null,
            productVariations: [],
            handleOptionSelect: () => { },
            availableOptions: new Map<number, Map<string, Product>>(),
            selectedOptions: {},
            variationAttributes: [],
        };
    }

    const { products: productVariations } = useProducts(product.variations);
    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
    const [initializedForProductId, setInitializedForProductId] = useState<number | null>(null);

    useEffect(() => {
        // Guard to ensure this runs only once per product when data is ready.
        if (productVariations && product.id !== initializedForProductId) {
            const initialOptions: Record<number, string> = {};

            // First, try to use the defined default attributes.
            if (product.default_attributes.length > 0) {
                product.default_attributes.forEach(attr => {
                    if (attr.id && attr.option) {
                        initialOptions[attr.id] = attr.option;
                    }
                });
            }
            // If no defaults, fall back to the first available option for each attribute.
            else if (product.attributes.length > 0) {
                product.attributes.forEach(attribute => {
                    if (attribute.variation && attribute.options.length > 0) {
                        initialOptions[attribute.id] = attribute.options[0].name;
                    }
                });
            }

            // If we found any options to set, update the state.
            if (Object.keys(initialOptions).length > 0) {
                setSelectedOptions(initialOptions);
                setInitializedForProductId(product.id);
            }
        }
    }, [productVariations, product, initializedForProductId]);

    const productVariant = useMemo(() => {
        if (!productVariations || Object.keys(selectedOptions).length === 0) return null;
        return product.findVariant(productVariations, selectedOptions) || null;
    }, [selectedOptions, productVariations, product]);

    const handleOptionSelect = (attributeId: number, option: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [attributeId]: option,
        }));
    };

    const availableOptions = useMemo(() => {
        if (!productVariations) return new Map();
        return product.getAvailableOptions(productVariations, selectedOptions);
    }, [product, productVariations, selectedOptions]);

    const variationAttributes = product.getVariationAttributes();

    return {
        productVariant,
        productVariations: productVariations || [],
        handleOptionSelect,
        availableOptions,
        selectedOptions,
        variationAttributes,
    };
};

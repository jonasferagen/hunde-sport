import { useProductVariations } from '@/hooks/Product';
import { Product } from '@/models/Product';
import { ProductAttribute } from '@/models/ProductAttribute';
import { useEffect, useMemo, useState } from 'react';

interface UseProductVariantsReturn {
    productVariant: Product | null;
    productVariants: Product[];
    handleOptionSelect: (attributeId: number, option: string) => void;
    availableOptions: Map<number, Map<string, Product>>;
    selectedOptions: Record<number, string>;
    variationAttributes: ProductAttribute[];
    isLoading: boolean;
}

export const useProductVariants = (product: Product): UseProductVariantsReturn => {



    // --- Optimization: Early exit for non-variable products ---
    if (product.type !== 'variable') {
        console.log("Product is not variable : " + product.type)
        return {
            productVariant: null,
            productVariants: [],
            handleOptionSelect: () => { },
            availableOptions: new Map<number, Map<string, Product>>(),
            selectedOptions: {},
            variationAttributes: [],
            isLoading: false,
        };
    }

    const { productVariations: productVariants, isLoading: isInitialLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useProductVariations(product.id);
    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
    const [initializedForProductId, setInitializedForProductId] = useState<number | null>(null);
    const [isFetchingAll, setIsFetchingAll] = useState(true);

    useEffect(() => {

        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        } else if (!hasNextPage) {
            setIsFetchingAll(false);
        }

        // Guard to ensure this runs only once per product when data is ready.
        if (productVariants && product.id !== initializedForProductId) {
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
    }, [productVariants, product, initializedForProductId, hasNextPage, isFetchingNextPage]);

    const productVariant = useMemo(() => {
        if (!productVariants || Object.keys(selectedOptions).length === 0) return null;
        return product.findVariant(productVariants, selectedOptions) || null;
    }, [selectedOptions, productVariants, product]);

    const handleOptionSelect = (attributeId: number, option: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [attributeId]: option,
        }));
    };

    const availableOptions = useMemo(() => {
        if (!productVariants) return new Map();
        return product.getAvailableOptions(productVariants, selectedOptions);
    }, [product, productVariants, selectedOptions]);

    const variationAttributes = product.getVariationAttributes();

    return {
        productVariant,
        productVariants: productVariants || [],
        handleOptionSelect,
        availableOptions,
        selectedOptions,
        variationAttributes: variationAttributes,
        isLoading: isInitialLoading || hasNextPage || isFetchingAll,
    };
};

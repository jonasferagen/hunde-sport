import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { VariationSelection } from '@/domain/Product/helpers/VariationSelection';
import { ProductVariation } from '@/domain/Product/ProductVariation';
import { VariableProduct } from '@/domain/Product/VariableProduct';

interface UseProductVariationSelectorProps {
    product: VariableProduct;
    productVariations: ProductVariation[];
    onProductVariationSelected: (variation: ProductVariation | undefined) => void;

}
// useProductVariationSelector.ts

export const useProductVariationSelector = ({
    product,
    productVariations,
    onProductVariationSelected,
}: UseProductVariationSelectorProps) => {
    const [selections, setSelections] = useState<Record<string, string>>({});


    const baseSelectionManager = useMemo(
        () => VariationSelection.create(product, productVariations),
        [product, productVariations]
    );

    const unavailableOptions = useMemo(() => {
        const result: Record<string, string[]> = {};
        (product.attributes ?? []).forEach((attribute) => {
            const unavailable = baseSelectionManager
                .getAvailableOptions(attribute.name)
                .filter((o) => !o.isAvailable)
                .map((o) => o.name);
            if (unavailable.length) result[attribute.name] = unavailable;
        });
        return result;
    }, [baseSelectionManager, product.attributes]);

    const selectionManager = useMemo(() => {
        return Object.entries(selections).reduce(
            (mgr, [attrName, name]) => mgr.select(attrName, name),
            baseSelectionManager
        );
    }, [baseSelectionManager, selections]);

    const selectedVariation = useMemo(
        () => selectionManager.getSelectedVariation(),
        [selectionManager]
    );
    const selectedId = selectedVariation?.id ?? undefined;

    const lastSentIdRef = useRef<number | undefined>(undefined);
    useEffect(() => {
        if (selectedId === lastSentIdRef.current) return;
        lastSentIdRef.current = selectedId;
        onProductVariationSelected(selectedVariation);
    }, [selectedId, selectedVariation, onProductVariationSelected]);

    const handleSelectOption = useCallback((attributeName: string, name: string | null) => {
        setSelections((prev) => {
            if (name && prev[attributeName] === name) return prev; // no-op
            const next = { ...prev };
            if (name) next[attributeName] = name;
            else delete next[attributeName];
            return next;
        });
    }, []);

    const attributes = useMemo(
        () => product.getAttributesForVariationSelection?.() ?? [],
        [product]
    );

    return { selectionManager, attributes, handleSelectOption, unavailableOptions };
};
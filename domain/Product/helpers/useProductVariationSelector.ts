import { VariableProduct } from '@/domain/Product/Product';
import { VariationSelection } from '@/domain/Product/helpers/VariationSelection';
import { ProductVariation } from '@/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { normName, normValue } from '@/domain/Product/Product';

interface UseProductVariationSelectorProps {
    product: VariableProduct;
    productVariations: ProductVariation[];
    onProductVariationSelected: (variation: ProductVariation | undefined) => void;

}

export const useProductVariationSelector = ({
    product,
    productVariations, // still in BaseProduct for prices flags; not needed now if already in product.variations
    onProductVariationSelected,
}: UseProductVariationSelectorProps) => {
    const [selection, setSelection] = useState<Record<string, string>>({}); // { [attrKey]: termSlug }

    // compute availability per attribute for UI
    const unavailableOptions = useMemo(() => {
        const result: Record<string, string[]> = {};
        for (const key of product.getRequiredAttributeKeys()) {
            const options = product.getOptionsFor(key, selection);
            const unavailable = options.filter(o => !o.isAvailable).map(o => o.label);
            if (unavailable.length) result[key] = unavailable;
        }
        return result;
    }, [product, selection]);

    // selected variation (if unique)
    const selectedVariation = useMemo(
        () => product.resolveVariation(selection),
        [product, selection]
    );

    useEffect(() => {
        if (!onProductVariationSelected) return;
        // You may want to map VariationEntry -> ProductVariation shape here
        // For now, pass undefined or a minimal object
        onProductVariationSelected(selectedVariation as any);
    }, [selectedVariation, onProductVariationSelected]);

    const select = useCallback((attrKey: string, termSlugOrLabel: string | null) => {
        const key = normName(attrKey);
        setSelection((prev) => {
            const next = { ...prev };
            if (termSlugOrLabel) next[key] = normValue(termSlugOrLabel);
            else delete next[key];
            return next;
        });
    }, []);

    return {
        selection,                 // normalized { key: slug }
        select,                    // update selection
        unavailableOptions,        // for greying out chips
        optionsIndex: product.getOptionsIndex(), // { key: [{slug,label,id}] }
        selectedVariation,
    };
};

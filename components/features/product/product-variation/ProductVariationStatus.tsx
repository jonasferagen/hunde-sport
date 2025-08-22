import { ThemedText, ThemedXStack } from '@/components/ui';
import { ProductVariation, PurchasableProduct } from '@/types';
import React from 'react';
import { ProductVariationLabel } from './ProductVariationLabel';

export type ProductVariationStatusProps = {
    product: PurchasableProduct;
    productVariation?: ProductVariation;
    currentSelection?: Record<string, string>;
    hint?: string; // optional precomputed hint from parent if available
};

export const ProductVariationStatus: React.FC<ProductVariationStatusProps> = ({
    product,
    productVariation,
    currentSelection,
    hint,
}) => {
    // Derive required attribute names from the (variable) product without coupling to the selector
    const requiredAttrNames = React.useMemo(() => {
        const p: any = product as any;
        return typeof p?.getAttributesForVariationSelection === 'function'
            ? p.getAttributesForVariationSelection().map((a: any) => a.name)
            : [];
    }, [product]);

    const missingAttrs = React.useMemo(
        () => requiredAttrNames.filter((name: string) => !currentSelection?.[name]),
        [requiredAttrNames, currentSelection]
    );

    // Hint only when a single attribute is missing for a valid selection
    const selectionHint = React.useMemo(
        () => hint ?? (missingAttrs.length === 1 ? `Velg ${missingAttrs[0]}` : undefined),
        [hint, missingAttrs]
    );

    return (
        <ThemedXStack split>
            <ProductVariationLabel
                currentSelection={currentSelection}
                productVariation={productVariation}
            />
            {selectionHint ? <ThemedText fos="$3">{selectionHint}</ThemedText> : null}
        </ThemedXStack>
    );
};

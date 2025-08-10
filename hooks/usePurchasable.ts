import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { useProductVariationContext } from '@/contexts/ProductVariationContext';

/**
 * Gets the current purchasable object from the most relevant context.
 * - If inside a ProductVariationProvider, uses its purchasable (variation-aware).
 * - Otherwise falls back to the BaseProductProvider's purchasable (simple product).
 */
export const usePurchasable = () => {
    let variationCtx;
    try {
        variationCtx = useProductVariationContext();
    } catch {
        variationCtx = null;
    }

    if (variationCtx) {
        return variationCtx.purchasable;
    }

    const baseCtx = useBaseProductContext();
    return baseCtx.purchasable;
};

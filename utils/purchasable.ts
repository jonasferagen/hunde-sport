import { Purchasable } from '@/types';

/**
 * Gets the correct price for a purchasable item.
 * It returns the variation price if it exists, otherwise the product price.
 */
export const getPurchasablePrice = (purchasable: Purchasable): number => {
    const activeProduct = purchasable.productVariation || purchasable.product;
    return activeProduct.price ?? 0;
};

export const getPurchasableKey = (purchasable: Purchasable): string => {
    return purchasable.productVariation
        ? `${purchasable.product.id}-${purchasable.productVariation.id}`
        : `${purchasable.product.id}-simple`;
};

export const getPurchasableTitle = (purchasable: Purchasable): string => {
    return purchasable.productVariation
        ? `${purchasable.product.name} - ${purchasable.productVariation.name}`
        : purchasable.product.name;
};
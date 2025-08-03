import { Purchasable } from '@/types';

export const getPurchasableReason = (purchasable: Purchasable) => {
    const product = purchasable.product;
    if (product.is_in_stock === false) {
        return "Ikke på lager";
    }
    if (!product.prices.price || product.prices.price === "") {
        return "Pris ikke tilgjengelig";
    }
    if (product.type === "variable" && !purchasable.productVariation) {
        return "Velg en variant først";
    }

    return "Ikke tilgjengelig for kjøp";
}

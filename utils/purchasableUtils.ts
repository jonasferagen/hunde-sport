import { Purchasable, VariableProduct } from '@/types';

export interface ValidationResult {
    isValid: boolean;
    reason?: 'VARIATION_REQUIRED' | 'OUT_OF_STOCK' | 'INVALID_PRODUCT';
    message: string;
}

/**
 * Validates if a purchasable item is ready to be added to the cart.
 * @param purchasable The item to validate.
 * @returns A ValidationResult object.
 */
export const validatePurchasable = (purchasable: Purchasable): ValidationResult => {
    if (!purchasable || !purchasable.product) {
        return { isValid: false, reason: 'INVALID_PRODUCT', message: 'Produkt ikke tilgjengelig' };
    }

    const { product, productVariation } = purchasable;

    // Rule 1: Variable products must have a variation selected.
    if (product instanceof VariableProduct && !productVariation) {
        return { isValid: false, reason: 'VARIATION_REQUIRED', message: 'Vennligst velg en variant' };
    }

    const productToCheck = productVariation || product;

    // Rule 2: The product must be in stock.
    if (!productToCheck.isInStock) {
        return { isValid: false, reason: 'OUT_OF_STOCK', message: 'Utsolgt' };
    }

    // All checks passed.
    return { isValid: true, message: 'Legg til i handlekurv' };
};

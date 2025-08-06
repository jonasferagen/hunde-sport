import { Product, ProductVariation, PurchasableProduct, SimpleProduct, VariableProduct } from '@/types';

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
const validatePurchasable = ({ product, productVariation }: { product: PurchasableProduct, productVariation?: ProductVariation }): ValidationResult => {
    if (!product || !productVariation) {
        return { isValid: false, reason: 'INVALID_PRODUCT', message: 'Produkt ikke tilgjengelig' };
    }

    if (product instanceof SimpleProduct && productVariation) {
        throw new Error('Simple product cannot have a product variation');
    }

    // Rule 1: Variable products must have a variation selected.
    if (product instanceof VariableProduct && !productVariation) {
        return { isValid: false, reason: 'VARIATION_REQUIRED', message: 'Vennligst velg en variant' };
    }

    const productToCheck = productVariation || product;

    // Rule 2: The product must be in stock.
    if (!productToCheck.is_in_stock) {
        return { isValid: false, reason: 'OUT_OF_STOCK', message: 'Utsolgt' };
    }

    // All checks passed.
    return { isValid: true, message: 'Legg til i handlekurv' };
};


export interface ValidatedPurchasable extends ValidationResult {
    product: SimpleProduct | VariableProduct;
    productVariation?: ProductVariation;
    displayProduct: Product;
}

export const createValidatedPurchasable = ({ product, productVariation }: { product: PurchasableProduct, productVariation?: ProductVariation }): ValidatedPurchasable => {


    const validationResult = validatePurchasable({ product, productVariation });

    const displayProduct = productVariation || product;

    return {
        product,
        productVariation: productVariation,
        displayProduct,
        ...validationResult,
    };
};
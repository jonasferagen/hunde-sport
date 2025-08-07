import { Product, ProductImage, ProductVariation, PurchasableProduct, SimpleProduct, VariableProduct } from '@/types';
import { ProductPrices } from './ProductPrices';

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
const validate = ({ product, productVariation }: { product: PurchasableProduct, productVariation?: ProductVariation }): ValidationResult => {
    if (!product) {
        return { isValid: false, reason: 'INVALID_PRODUCT', message: 'Produkt utilgjengelig' };
    }

    if (product instanceof SimpleProduct && productVariation) {
        throw new Error('SimpleProduct cannot have a product variation');
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


export interface Purchasable extends ValidationResult {
    product: SimpleProduct | VariableProduct;
    productVariation?: ProductVariation;
    displayProduct: Product;
    title: string;
    full_title: string;
    short_description: string;
    description: string;
    image: ProductImage;
    prices: ProductPrices;
    is_in_stock: boolean;
}

export const createPurchasable = ({ product, productVariation }: { product: PurchasableProduct, productVariation?: ProductVariation }): Purchasable => {

    const validationResult = validate({ product, productVariation });
    const displayProduct = productVariation || product;

    const image = displayProduct.featuredImage;
    const prices = displayProduct.prices;
    const title = productVariation ? productVariation.variation : displayProduct.name;
    const full_title = productVariation ? `${product.name} - ${productVariation.variation}` : product.name;
    const is_in_stock = displayProduct.is_in_stock;

    return {
        product,
        productVariation: productVariation,
        displayProduct,
        image,
        prices,
        description: product.description,
        short_description: product.short_description,
        title,
        full_title,
        is_in_stock,
        ...validationResult,
    };
};
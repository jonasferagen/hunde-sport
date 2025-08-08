import { StoreImage } from '@/models/StoreImage';
import { Product, ProductVariation, PurchasableProduct, SimpleProduct, VariableProduct } from '@/types';
import { ProductPrices } from './ProductPrices';


export type ValidationStatus = 'OK' | 'ACTION_NEEDED' | 'INVALID';

export interface ValidationResult {
    isValid: boolean;
    reason?: 'VARIATION_REQUIRED' | 'OUT_OF_STOCK' | 'INVALID_PRODUCT';
    status?: ValidationStatus
    message: string;
}

/**
 * Validates if a purchasable item is ready to be added to the cart.
 * @param purchasable The item to validate.
 * @returns A ValidationResult object.
 */
const validate = ({ product, productVariation }: { product: PurchasableProduct, productVariation?: ProductVariation }): ValidationResult => {
    if (!product) {
        return {
            isValid: false,
            status: 'INVALID',
            reason: 'INVALID_PRODUCT',
            message: 'Produkt utilgjengelig'
        };
    }

    if (product instanceof SimpleProduct && productVariation) {
        throw new Error('SimpleProduct cannot have a product variation');
    }

    // Rule 1: Variable products must have a variation selected.
    if (product instanceof VariableProduct && !productVariation) {
        return {
            isValid: false,
            status: 'ACTION_NEEDED',
            reason: 'VARIATION_REQUIRED',
            message: 'Vennligst velg en variant'
        };
    }

    const productToCheck = productVariation || product;

    // Rule 2: The product must be in stock.
    if (!productToCheck.is_in_stock) {
        return {
            isValid: false,
            status: 'INVALID',
            reason: 'OUT_OF_STOCK',
            message: 'Utsolgt'
        };
    }

    // All checks passed.
    return {
        isValid: true,
        status: 'OK',
        message: 'Legg til i handlekurv'
    };
};

export interface Availability {
    isInStock: boolean;
    isPurchasable: boolean;
    isOnBackOrder: boolean;
    isOnSale: boolean;
}


export interface Purchasable extends ValidationResult {
    product: SimpleProduct | VariableProduct;
    productVariation?: ProductVariation;
    activeProduct: Product;
    titles: { product: string; variation: string, full: string; };
    image: StoreImage;
    prices: ProductPrices;
    availability: Availability;
}

export const createPurchasable = ({ product, productVariation }: { product: PurchasableProduct, productVariation?: ProductVariation }): Purchasable => {

    const validationResult = validate({ product, productVariation });
    const activeProduct = productVariation || product;

    const image = activeProduct.featuredImage;
    const prices = activeProduct.prices;
    const titles = {
        product: product.name,
        variation: productVariation ? productVariation.getLabel() : '',
        full: product.name + (productVariation ? ` - ${productVariation.getLabel()}` : ''),
    }

    const availability: Availability = {
        isInStock: activeProduct.is_in_stock,
        isPurchasable: activeProduct.is_purchasable,
        isOnBackOrder: activeProduct.is_on_backorder,
        isOnSale: activeProduct.prices.sale_price < activeProduct.prices.regular_price,
    };

    return {
        product,
        productVariation: productVariation,
        activeProduct,
        image,
        prices,
        titles,
        availability,
        ...validationResult,
    };
};
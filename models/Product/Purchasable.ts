import { ProductVariation, SimpleProduct, VariableProduct } from '@/models/Product/Product';
import { StoreImage } from '@/models/StoreImage';
import { Product, ProductAvailability, PurchasableProduct } from '@/types';
import { ProductPrices } from './ProductPrices';


export type ValidationStatus = 'OK' | 'VARIATION_REQUIRED' | 'OUT_OF_STOCK' | 'INVALID_PRODUCT';

export interface ValidationResult {
    isValid: boolean;
    status: ValidationStatus
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
            status: 'INVALID_PRODUCT',
            message: 'Produkt utilgjengelig'
        };
    }



    if (product instanceof SimpleProduct && productVariation) {
        throw new Error('SimpleProduct cannot have a product variation');
    }

    // If the main product is out of stock - no variations are assumed to be in stock
    const productToCheck = productVariation || product;

    // The product must be in stock.
    if (!productToCheck.is_in_stock) {
        return {
            isValid: false,
            status: 'OUT_OF_STOCK',
            message: 'Utsolgt'
        };
    }


    // Rule 2: Variable products must have a variation selected.
    if (product instanceof VariableProduct && !productVariation) {
        return {
            isValid: false,
            status: 'VARIATION_REQUIRED',
            message: 'Velg variant'
        };
    }

    // All checks passed.
    return {
        isValid: true,
        status: 'OK',
        message: 'Kjøp'
    };
};



export interface Purchasable extends ValidationResult {
    product: SimpleProduct | VariableProduct;
    productVariation?: ProductVariation;
    activeProduct: Product;
    image: StoreImage;
    prices: ProductPrices;
    availability: ProductAvailability;
}

export const createPurchasable = ({
    product,
    productVariation }: {
        product: PurchasableProduct,
        productVariation?: ProductVariation
    }): Purchasable => {

    const validationResult = validate({ product, productVariation });
    const activeProduct = productVariation || product;

    const image = activeProduct.featuredImage;
    const prices = activeProduct.prices;
    const availability = activeProduct.availability;


    return {
        product,
        productVariation: productVariation,
        activeProduct,
        image,
        prices,
        availability,
        ...validationResult,
    };
};
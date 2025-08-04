import { ProductData } from './Product';
import { SimpleProduct } from './SimpleProduct';
import { VariableProduct } from './VariableProduct';

/**
 * Factory function to create a product instance from raw data.
 * This ensures that we are working with class instances with methods,
 * not just plain data objects.
 * @param data The raw product data from the API.
 * @returns An instance of SimpleProduct or VariableProduct.
 */
export const createProduct = (data: ProductData) => {
    if (data.type === 'variable') {
        return new VariableProduct(data);
    }
    if (data.type === 'simple') {
        return new SimpleProduct(data);
    }
    // Fallback for other types if necessary, or throw an error.
    // For now, we'll default to SimpleProduct for any other case.
    return new SimpleProduct(data);
};

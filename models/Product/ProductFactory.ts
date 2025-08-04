import { SimpleProduct, SimpleProductData } from './SimpleProduct';
import { VariableProduct, VariableProductData } from './VariableProduct';

/**
 * Factory function to create a product instance from raw data.
 * This ensures that we are working with class instances with methods,
 * not just plain data objects.
 * @param data The raw product data from the API.
 * @returns An instance of SimpleProduct or VariableProduct.
 */
export const createProduct = (data: SimpleProductData | VariableProductData) => {
    if (data.type === 'variable') {
        return new VariableProduct(data as VariableProductData);
    }
    // All other types are treated as SimpleProduct
    return new SimpleProduct(data as SimpleProductData);
};

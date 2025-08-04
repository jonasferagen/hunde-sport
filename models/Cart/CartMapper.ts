import { CartData, CartItemData } from '@/models/Cart/Cart';
import { createProduct } from '@/models/Product/ProductFactory';

/**
 * Maps raw cart data from the API to the application's CartData model.
 * It uses the ProductFactory to ensure that product data within the cart
 * is correctly instantiated into SimpleProduct or VariableProduct objects.
 *
 * @param {any} rawData - The raw cart data object from the API.
 * @returns {CartData} The structured and validated CartData object.
 */
export const mapCartData = (rawData: any): CartData => {
    const mappedItems = rawData.items.map((item: any): CartItemData => {


        return {
            ...item,
            product: createProduct(item),
        };
    });

    return {
        ...rawData,
        items: mappedItems,
        lastUpdated: Date.now(),
    };
};

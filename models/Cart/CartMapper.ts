import { ProductFactory } from '@/models/Product/ProductFactory';
import { CartData, CartItemData } from './Cart';

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
            product: ProductFactory.create(item.product),
        };
    });

    return {
        ...rawData,
        items: mappedItems,
        lastUpdated: Date.now(),
    };
};

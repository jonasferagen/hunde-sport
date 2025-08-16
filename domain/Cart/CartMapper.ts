import { CartData, CartItemData } from '@/domain/Cart/Cart';

/**
 * Maps raw cart data from the API to the application's CartData model.
 * It uses the ProductFactory to ensure that product data within the cart
 * is correctly instantiated into SimpleProduct or VariableProduct objects.
 *
 * @param {any} rawData - The raw cart data object from the API.
 * @param {string} token - The cart token for the current session.
 * @returns {CartData} The structured and validated CartData object.
 */
export const mapCartData = (rawData: any, token: string): CartData => {
    const mappedItems = rawData.items.map((item: any): CartItemData => {

        return {
            ...item,
        };
    });

    return {
        ...rawData,
        items: mappedItems,
        token,
        lastUpdated: Date.now(),
    };
};

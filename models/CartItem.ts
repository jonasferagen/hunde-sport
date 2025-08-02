import { Product } from '@/models/Product/Product';
import { mapToProduct } from '@/models/Product/ProductMapper';
import { Cart, UpdateItemMutation } from './Cart';

export interface CartItemData {
    key: string;
    product: Product;
    id: number;
    type: string;
    name: string;
    variations: any[];
    prices: any;
    totals: any;
    quantity: number;
}

export class CartItem implements CartItemData {
    key: string;
    product: Product;
    id: number;
    type: string;
    name: string;
    variations: any[];
    prices: any;
    totals: any;
    quantity: number;


    private _updateItem?: UpdateItemMutation;

    constructor(data: CartItemData, cart: Cart) {
        this.key = data.key;
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.variations = data.variations;
        this.prices = data.prices;
        this.totals = data.totals;
        this.quantity = data.quantity;
        this.product = mapToProduct(data);

    }

    attachUpdater(updateFn: UpdateItemMutation) {
        this._updateItem = updateFn;
    }

    updateQuantity(newQuantity: number) {
        const prev = this.quantity;
        this.quantity = newQuantity;

        if (this._updateItem) {
            this._updateItem({
                key: this.key,
                quantity: newQuantity,
            });
        } else {
            console.warn('CartItem updater not attached.');
        }

        return prev; // Optional: return old quantity for potential rollback
    }


}


/**
 * Maps a raw data object to a CartItem instance.
 * @param {any} item - The raw cart item data from the API.
 * @param {Cart} cart - The parent Cart instance.
 * @returns {CartItem} A new CartItem instance.
 */
export const mapToCartItem = (item: any, cart: Cart): CartItem => {

    const product = mapToProduct(item);

    return new CartItem({
        key: item.key,
        id: item.id,
        product,
        quantity: item.quantity,
        type: item.type,
        name: item.name,
        variations: item.variations,
        prices: item.prices,
        totals: item.totals,
    }, cart);
};

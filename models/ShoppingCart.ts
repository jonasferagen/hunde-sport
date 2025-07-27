import { Purchasable } from '@/types';
import { getPurchasableKey, getPurchasablePrice } from '@/utils/purchasable';

export class ShoppingCartItem {
    readonly purchasable: Purchasable;
    readonly quantity: number;
    readonly key: string;
    readonly price: number;

    constructor(purchasable: Purchasable, quantity: number) {
        this.purchasable = purchasable;
        this.quantity = quantity;
        this.key = getPurchasableKey(purchasable);
        this.price = getPurchasablePrice(purchasable);
    }
}

export type ShoppingCart = ShoppingCartItem[];

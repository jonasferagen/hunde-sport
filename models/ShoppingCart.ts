import { Purchasable } from '@/types';
import { getPurchasableKey, getPurchasablePrice } from '@/utils/purchasable';
import { RefObject } from 'react';

export class ShoppingCartItem {
    readonly purchasable: Purchasable;
    readonly quantity: number;
    readonly key: string;
    readonly price: number;
    readonly triggerRef?: RefObject<any>;

    constructor(purchasable: Purchasable, quantity: number, triggerRef?: RefObject<any>) {
        this.purchasable = purchasable;
        this.quantity = quantity;
        this.key = getPurchasableKey(purchasable);
        this.price = getPurchasablePrice(purchasable);
        this.triggerRef = triggerRef;
    }
}

export type ShoppingCart = ShoppingCartItem[];

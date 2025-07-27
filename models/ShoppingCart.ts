import { Purchasable } from '@/types';

export class ShoppingCartItem {
    readonly key: string;
    readonly purchasable: Purchasable;
    readonly quantity: number;

    constructor(purchasable: Purchasable, quantity: number) {
        this.purchasable = purchasable;
        this.quantity = quantity;
        this.key = purchasable.productVariation
            ? `${purchasable.product.id}-${purchasable.productVariation.id}`
            : `${purchasable.product.id}-simple`;
    }
}

export type ShoppingCart = ShoppingCartItem[];

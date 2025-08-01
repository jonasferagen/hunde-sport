import { mapToCartItem } from '@/hooks/data/Cart/mapper';
import { Product } from '@/models/Product';
import { Purchasable } from '@/types';

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

    constructor(data: CartItemData) {
        this.key = data.key;

        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.variations = data.variations;
        this.prices = data.prices;
        this.totals = data.totals;
        this.quantity = data.quantity;

        this.product = data.product;
    }
}

export interface CartData {
    items: CartItem[];
    cart_token: string;
    items_count: number;
    items_weight: number;
    totals: any;
    has_calculated_shipping: boolean;
    shipping_rates: any;
}

export type AddItemMutationFn = (variables: {
    cartToken: string;
    id: number;
    quantity: number;
    variation: any[];
}) => void;



export class Cart {
    items: CartItem[];
    public readonly cart_token: string;
    public readonly items_count: number;
    public readonly items_weight: number;
    public readonly totals: any;
    public readonly has_calculated_shipping: boolean;
    public readonly shipping_rates: any;

    constructor(data: CartData, cartToken: string) {
        this.items = data.items.map(mapToCartItem);
        this.cart_token = cartToken;
        this.items_count = data.items_count;
        this.items_weight = data.items_weight;
        this.totals = data.totals;
        this.has_calculated_shipping = data.has_calculated_shipping;
        this.shipping_rates = data.shipping_rates;
    }

    addItem(purchasable: Purchasable, quantity: number, variation: any[], mutationFn: AddItemMutationFn) {
        mutationFn({
            cartToken: this.cart_token,
            id: purchasable.product.id,
            quantity,
            variation,
        });
    }

    debug(from: string) {
        console.log(from, 'Cart token', this.cart_token);
        console.log(from, 'Cart items', this.items.map(item => item));
    }
}

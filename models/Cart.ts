import { CartItem, mapToCartItem } from '@/models/CartItem';

export interface CartData {
    items: CartItem[];
    cart_token: string;
    items_count: number;
    items_weight: number;
    totals: any;
    has_calculated_shipping: boolean;
    shipping_rates: any;
}



export class Cart {
    private readonly cartToken: string;

    public readonly items: CartItem[];
    public readonly items_count: number;
    public readonly items_weight: number;
    public readonly totals: any;
    public readonly has_calculated_shipping: boolean;
    public readonly shipping_rates: any;

    constructor(data: CartData, cartToken: string) {
        this.items = data.items.map(mapToCartItem);
        this.items_count = data.items_count;
        this.items_weight = data.items_weight;
        this.totals = data.totals;
        this.has_calculated_shipping = data.has_calculated_shipping;
        this.shipping_rates = data.shipping_rates;
        this.cartToken = cartToken;
    }

    getItem(key: string) {
        return this.items.find(i => i.key === key);
    }

    getToken(): string {
        if (!this.cartToken) {
            throw new Error('Cart token not found!');
        }
        return this.cartToken;
    }
}

export const mapToCart = (data: any, cartToken: string): Cart => {
    return new Cart(data, cartToken);
};

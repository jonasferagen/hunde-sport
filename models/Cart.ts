import { mapToCartItem } from '@/hooks/data/Cart/mapper';
import { Product } from '@/models/Product';

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

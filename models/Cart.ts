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

export class Cart {
    items: CartItem[];
    cart_token: string;
    items_count: number;

    public readonly items_weight: number;
    public readonly totals: any;
    public readonly has_calculated_shipping: boolean;
    public readonly shipping_rates: any;

    private _addItem?: (vars: { cartToken: string; id: number; quantity: number; variation: { attribute: string; value: string }[] }) => void;
    private _updateItem?: (vars: { cartToken: string; key: string; quantity: number }) => void;
    private _removeItem?: (vars: { cartToken: string; key: string }) => void;



    constructor(data: CartData, cartToken: string) {
        this.items = data.items.map(mapToCartItem);
        this.cart_token = cartToken;
        this.items_count = data.items_count;
        this.items_weight = data.items_weight;
        this.totals = data.totals;
        this.has_calculated_shipping = data.has_calculated_shipping;
        this.shipping_rates = data.shipping_rates;
    }

    public setMutations(mutations: {
        addItem: (vars: any) => void;
        updateItem: (vars: any) => void;
        removeItem: (vars: any) => void;
    }) {
        this._addItem = mutations.addItem;
        this._updateItem = mutations.updateItem;
        this._removeItem = mutations.removeItem;
    }

    addItem(purchasable: Purchasable) {
        if (!this._addItem) {
            console.error('addItem mutation is not available.');
            return;
        }

        const product = purchasable.product;
        const productVariation = purchasable.productVariation;
        const variation = (productVariation?.variation_attributes?.map((attr) => ({ attribute: attr.name, value: attr.value }))) ?? [];
        const id = product.id;

        this._addItem({ cartToken: this.cart_token, id, quantity: 1, variation });
    }

    updateItem(key: string, quantity: number) {

        this.items = this.items.map(item => item.key === key ? { ...item, quantity } : item);

        if (!this._updateItem) {
            console.error('updateItem mutation is not available.');
            return;
        }
        this._updateItem({ cartToken: this.cart_token, key, quantity });
    }

    removeItem(key: string) {
        this.items = this.items.filter(item => item.key !== key);
        if (!this._removeItem) {
            console.error('removeItem mutation is not available.');
            return;
        }
        this._removeItem({ cartToken: this.cart_token, key });
    }

    debug(from: string) {
        console.log(from, 'Cart token', this.cart_token);
        console.log(from, 'Cart items', this.items.map(item => item));
    }
}

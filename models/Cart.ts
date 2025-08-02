import { CartItem, CartItemData } from '@/models/CartItem';

export type AddItemMutation = (vars: { id: number; quantity: number; variation: { attribute: string; value: string }[] }) => void;
export type UpdateItemMutation = (vars: { key: string; quantity: number }) => void;
export type RemoveItemMutation = (vars: { key: string }) => void;

export interface CartData {
    items: CartItemData[];
    cart_token: string;
    items_count: number;
    items_weight: number;
    totals: any;
    has_calculated_shipping: boolean;
    shipping_rates: any;
}

export class Cart {
    private readonly cartToken: string;

    public items: CartItem[];
    public readonly items_count: number;
    public readonly items_weight: number;
    public readonly totals: any;
    public readonly has_calculated_shipping: boolean;
    public readonly shipping_rates: any;

    public addItem!: AddItemMutation;
    public updateItem!: UpdateItemMutation;
    public removeItem!: RemoveItemMutation;

    constructor(data: CartData, cartToken: string) {
        this.items = data.items.map(itemData => new CartItem(itemData, this));
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

    getCartToken(): string {
        if (!this.cartToken) {
            throw new Error('Cart token not found!');
        }
        return this.cartToken;
    }

    remove(key: string) {
        const itemToRemove = this.getItem(key);
        if (!itemToRemove) return;
        // Optimistic update
        this.items = this.items.filter(i => i.key !== key);

        // Call the actual mutation
        this.removeItem({ key });
    }

    setMutations(addItem: AddItemMutation, updateItem: UpdateItemMutation, removeItem: RemoveItemMutation) {
        this.addItem = addItem;
        this.updateItem = updateItem;
        this.removeItem = removeItem;

        this.items.forEach(item => {
            item.attachUpdater(updateItem);
        });
    }
}

export const mapToCart = (data: any, cartToken: string): Cart => {
    return new Cart(data, cartToken);
};

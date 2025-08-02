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
    private cartToken?: string;

    public items: CartItem[] = [];
    public items_count: number = 0;
    public items_weight: number = 0;
    public totals: any = {};
    public has_calculated_shipping: boolean = false;
    public shipping_rates: any = [];

    public addItem!: AddItemMutation;
    public updateItem!: UpdateItemMutation;
    public removeItem!: RemoveItemMutation;

    constructor() { }

    public setData(data: CartData) {
        this.items = data.items.map(itemData => new CartItem(itemData, this));
        this.items_count = data.items_count;
        this.items_weight = data.items_weight;
        this.totals = data.totals;
        this.has_calculated_shipping = data.has_calculated_shipping;
        this.shipping_rates = data.shipping_rates;

        this.items.forEach(item => {
            if (this.updateItem) {
                item.attachUpdater(this.updateItem);
            }
        });
    }

    public setCartToken(token: string) {
        this.cartToken = token;
    }

    getItem(key: string) {
        return this.items.find(i => i.key === key);
    }

    getCartToken(): string | undefined {
        return this.cartToken;
    }

    updateItemQuantity(key: string, newQuantity: number) {
        const item = this.getItem(key);
        if (!item) {
            return;
        }

        const oldQuantity = item.quantity;
        this.items_count = this.items_count - oldQuantity + newQuantity;

        // Delegate to the item to update its own quantity and call the mutation
        item.updateQuantity(newQuantity);
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

export const cart = new Cart();

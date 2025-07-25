export interface OrderLineItem {
    product_id: number;
    quantity: number;
    variation_id?: number;
}

export interface Address {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
}

export interface BillingAddress extends Address {
    email: string;
    phone: string;
}

export type PaymentMethod = 'svea_checkout';

export class Order {
    billing?: BillingAddress;
    shipping?: Address;
    line_items: OrderLineItem[] = [];
    payment_method?: PaymentMethod;

    constructor(data?: Partial<Order>) {
        if (data) {
            Object.assign(this, data);
        }
    }

    isValid(): this is { billing: BillingAddress; shipping: Address; payment_method: PaymentMethod; line_items: OrderLineItem[] } {
        return !!(
            this.billing &&
            this.shipping &&
            this.payment_method &&
            this.line_items &&
            this.line_items.length > 0
        );
    }
}

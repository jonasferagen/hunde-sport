export interface OrderLineItem {
    product_id: number;
    quantity: number;
    variation_id: number;
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

export interface Order {
    billing: BillingAddress;
    shipping: Address;
    line_items: OrderLineItem[];
    payment_method: string;
}

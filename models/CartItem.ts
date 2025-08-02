import { Product } from '@/models/Product/Product';

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

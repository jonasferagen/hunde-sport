import { Category, Product } from '@/types';
import { Href } from 'expo-router';

const paths = {
    home: '/',
    shoppingCart: '/shopping-cart',
    search: '/search',
    category: '/category',
    product: '/product',
    checkout: '/checkout',
    billing: '/billing',
    payment: '/payment',
    orderStatus: '/order-status',
} as const;



export const routes = {
    home: () => {
        return paths.home;
    },
    shoppingCart: () => {
        return paths.shoppingCart;
    },
    search: (query?: string) => {
        return { pathname: paths.search, params: { query } };
    },
    category: (category: Category) => {
        return { pathname: paths.category, params: { id: category.id.toString(), name: category.name } };
    },
    product: (product: Product, categoryId?: number) => {
        const params: { id: string; name: string; categoryId?: string } = {
            id: product.id.toString(),
            name: product.name,
        };
        if (categoryId) {
            params.categoryId = categoryId.toString();
        }
        return { pathname: paths.product, params };
    },
    checkout: () => {
        return paths.checkout;
    },
    billing: () => {
        return paths.billing;
    },
    payment: () => {
        return paths.payment;
    },
    orderStatus: () => {
        return paths.orderStatus;
    },
};


export interface CheckoutStep {
    name: string;
    title: string;
    route: Href;
}

export const checkoutFlow: CheckoutStep[] = [
    { name: 'checkout', title: 'Kasse', route: routes.checkout() },
    { name: 'billing', title: 'Fakturering', route: routes.billing() },
    { name: 'payment', title: 'Betaling', route: routes.payment() },
    { name: 'order-status', title: 'Bekreftelse', route: routes.orderStatus() },
];

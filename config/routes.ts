import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { Href } from 'expo-router';

const paths = {
    home: '/',
    shoppingCart: '/shopping-cart',
    search: '/search',
    category: '/category',
    product: '/product',
    shipping: '/shipping',
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

    shipping: () => {
        return paths.shipping;
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
    { name: 'shopping-cart', title: 'Handlekurv', route: routes.shoppingCart() },
    { name: 'shipping', title: 'Levering', route: routes.shipping() },
    { name: 'payment', title: 'Betaling', route: routes.payment() },
    { name: 'order-status', title: 'Bekreftelse', route: routes.orderStatus() },
];

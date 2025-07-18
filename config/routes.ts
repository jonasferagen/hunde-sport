import { Category, Product } from '@/types';

const paths = {
    home: '/',
    shoppingCart: '/shoppingCart',
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
        //breadcrumbHelper.buildTrail(category.id);
        return { pathname: paths.category, params: { id: category.id.toString(), name: category.name } };
    },
    product: (product: Product) => {
        if (product.categories.length === 0) {
            throw new Error('Product has no categories');
        }
        return { pathname: paths.product, params: { id: product.id.toString(), name: product.name } };
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

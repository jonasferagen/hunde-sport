import { router } from 'expo-router';

export const paths = {
    home: '/',
    shoppingCart: '/shoppingCart',
    search: '/search',
    category: '/category',
    product: '/product',
} as const;

export const routes = {
    home: () => {
        router.push(paths.home);
    },
    shoppingCart: () => {
        router.push(paths.shoppingCart);
    },
    search: (query: string) => {
        router.push({ pathname: paths.search, params: { q: query } });
    },
    category: (id: string | number, name: string) => {
        router.push({ pathname: paths.category, params: { id, name } });
    },
    product: (id: string | number, name: string) => {
        router.push({ pathname: paths.product, params: { id, name } });
    },
    productSimple: (id: string | number) => {
        router.push({ pathname: paths.product, params: { id: id.toString() } });
    },
};

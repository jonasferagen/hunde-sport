import { router } from 'expo-router';

export const paths = {
    home: '/(drawer)',
    shoppingCart: '/(drawer)/shoppingCart',
    search: '/(drawer)/search',
    category: '/(drawer)/category',
    product: '/(drawer)/product',
} as const;

export const routes = {
    home: () => {
        router.push(paths.home);
    },
    shoppingCart: () => {
        router.push(paths.shoppingCart);
    },
    search: (query: string) => {
        router.push(`${paths.search}?q=${query}`);
    },
    category: (id: string | number, name: string) => {
        router.push(`${paths.category}?id=${id}&name=${name}`);
    },
    product: (id: string | number, name: string) => {
        router.push(`${paths.product}?id=${id}&name=${name}`);
    },
    productSimple: (id: string | number) => {
        router.push({ pathname: paths.product, params: { id: id.toString() } });
    },
};

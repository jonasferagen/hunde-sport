import { Category, Product } from '@/types';
import { router } from 'expo-router';

export const paths = {
    home: '/',
    shoppingCart: '/shoppingCart',
    search: '/search',
    category: '/category',
    product: '/product',
    checkout: '/checkout',
} as const;


export const routes = {
    home: () => {
        router.push(paths.home);
    },
    shoppingCart: () => {
        router.push(paths.shoppingCart);
    },
    search: (query?: string) => {
        router.push(query ? `/search?query=${query}` : '/search');
    },
    category: (category: Category) => {
        //breadcrumbHelper.buildTrail(category.id);
        router.push({ pathname: paths.category, params: { id: category.id.toString(), name: category.name } });
    },
    product: (product: Product) => {
        if (product.categories.length === 0) {
            throw new Error('Product has no categories');
        }
        router.push({ pathname: paths.product, params: { id: product.id.toString(), name: product.name } });
    },
    checkout: () => {
        router.push(paths.checkout);
    }
};


export const _routes = {
    home: () => {
        return paths.home;
    },
    shoppingCart: () => {
        return paths.shoppingCart;
    },
    search: (query?: string) => {
        return query ? `/search?query=${query}` : '/search';
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
    }
};


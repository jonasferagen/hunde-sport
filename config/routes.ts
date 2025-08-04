import { ProductCategory } from '@/models/Category';
import { SimpleProduct, VariableProduct } from '@/types';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { HrefObject, useSegments } from 'expo-router';
import { ThemeName } from 'tamagui';

export interface Route {
    name: string;
    label: string;
    icon: React.FC<any>;
    theme: ThemeName;
    path: (...args: any[]) => HrefObject;
    showInDrawer?: boolean;
}

/**
 * URLs for all pages in the app.
 *
 * Note: The paths should match the route names in the `routes` object.
 *
 * @constant
 * @type {Record<string, string>}
 */
const paths = {
    home: '/',
    search: '/search',
    category: '/category',
    product: '/product',
    shoppingCart: '/shopping-cart',
} as const;

export const routes: Record<string, Route> = {
    index: {
        name: 'index',
        label: 'Hjem',
        icon: Home,
        theme: 'primary',
        path: () => ({ pathname: paths.home }),
        showInDrawer: true,
    },
    'shopping-cart': {
        name: 'shopping-cart',
        label: 'Handlekurv',
        icon: ShoppingCart,
        theme: 'secondary',
        path: () => ({ pathname: paths.shoppingCart }),
        showInDrawer: true,
    },
    search: {
        name: 'search',
        label: 'Produktsøk',
        icon: Search,
        theme: 'tertiary',
        path: (query?: string) => ({ pathname: paths.search, params: { query } }),
        showInDrawer: true,
    },
    category: {
        name: 'category',
        label: 'Kategori',
        icon: () => null, // No icon for category in drawer
        theme: 'secondary',
        path: (category: ProductCategory) => ({ pathname: paths.category, params: { id: category.id.toString(), name: category.name } }),
    },
    product: {
        name: 'product',
        label: 'Produkt',
        icon: () => null, // No icon for product in drawer
        theme: 'primary',
        path: (product: SimpleProduct | VariableProduct, categoryId?: number) => {
            const params: { id: string; name: string; categoryId?: string } = {
                id: product.id.toString(),
                name: product.name,
            };
            if (categoryId) {
                params.categoryId = categoryId.toString();
            }
            return { pathname: paths.product, params };
        },
    },
};

export const resolveTheme = (routeName?: string): ThemeName => {
    // If a routeName is passed directly, use it. It's more reliable.
    if (routeName && routes[routeName]) {
        return routes[routeName].theme;
    }
    // Fallback to using segments if no routeName is provided.
    const segments = useSegments();
    let lastSegment = segments[segments.length - 1] || 'index';

    // Handle the edge case where the root of the group is active
    if (lastSegment === '(app)') {
        lastSegment = 'index';
    }

    console.log(lastSegment);

    return routes[lastSegment]?.theme || 'light';
};

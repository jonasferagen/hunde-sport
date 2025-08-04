import { ProductCategory } from '@/models/ProductCategory';
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
    productCategory: '/product-category',
    product: '/product',
    cart: '/cart',
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
    cart: {
        name: 'cart',
        label: 'Handlekurv',
        icon: ShoppingCart,
        theme: 'secondary',
        path: () => ({ pathname: paths.cart }),
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
    "product-category": {
        name: 'product-category',
        label: 'Kategori',
        icon: () => null, // No icon for category in drawer
        theme: 'secondary',
        path: (productCategory: ProductCategory) => ({ pathname: paths.productCategory, params: { id: productCategory.id.toString(), name: productCategory.name } }),
    },
    product: {
        name: 'product',
        label: 'Produkt',
        icon: () => null, // No icon for product in drawer
        theme: 'primary',
        path: (product: SimpleProduct | VariableProduct, productCategoryId?: number) => {
            const params: { id: string; name: string; productCategoryId?: string } = {
                id: product.id.toString(),
                name: product.name,
            };
            if (productCategoryId) {
                params.productCategoryId = productCategoryId.toString();
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

    return routes[lastSegment]?.theme || 'light';
};

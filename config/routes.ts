import { ProductCategory } from '@/models/ProductCategory';
import { SimpleProduct, VariableProduct } from '@/types';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { HrefObject } from 'expo-router';

export interface Route {
    name: string;
    label: string;
    icon: React.FC<any>;
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
    checkout: '/checkout',
} as const;

export const routes: Record<string, Route> = {
    index: {
        name: 'index',
        label: 'Hjem',
        icon: Home,

        path: () => ({ pathname: paths.home }),
        showInDrawer: true,
    },
    cart: {
        name: 'cart',
        label: 'Handlekurv',
        icon: ShoppingCart,

        path: () => ({ pathname: paths.cart }),
        showInDrawer: true,

    },
    search: {
        name: 'search',
        label: 'Produktsøk',
        icon: Search,

        path: (query?: string) => ({ pathname: paths.search, params: { query } }),
        showInDrawer: true,

    },
    "product-category": {
        name: 'product-category',
        label: 'Kategori',
        icon: () => null, // No icon for category in drawer

        path: (productCategory: ProductCategory) => ({ pathname: paths.productCategory, params: { id: productCategory.id.toString(), name: productCategory.name } }),

    },
    product: {
        name: 'product',
        label: 'Produkt',
        icon: () => null, // No icon for product in drawer

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
    checkout: {
        name: 'checkout',
        label: 'Kassen',
        icon: () => null, // No icon for checkout in drawer

        path: () => ({ pathname: paths.checkout }),

    },
};

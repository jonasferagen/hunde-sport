import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { Href } from 'expo-router';
import { ThemeName } from 'tamagui';

export interface Route {
    name: string;
    label: string;
    icon: React.FC<any>;
    theme: ThemeName;
    path: (...args: any[]) => Href;
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
    shipping: '/shipping',
    payment: '/payment',
    orderStatus: '/order-status',
} as const;

export const routes: Record<string, Route> = {
    index: {
        name: 'index',
        label: 'Hjem',
        icon: Home,
        theme: 'primary',
        path: () => paths.home,
        showInDrawer: true,
    },
    'shopping-cart': {
        name: 'shopping-cart',
        label: 'Handlekurv',
        icon: ShoppingCart,
        theme: 'secondary',
        path: () => paths.shoppingCart,
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
        theme: 'primary',
        path: (category: Category) => ({ pathname: paths.category, params: { id: category.id.toString(), name: category.name } }),
    },
    product: {
        name: 'product',
        label: 'Produkt',
        icon: () => null, // No icon for product in drawer
        theme: 'primary',
        path: (product: Product, categoryId?: number) => {
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
    shipping: {
        name: 'shipping',
        label: 'Levering',
        icon: () => null,
        theme: 'primary',
        path: () => paths.shipping,
    },
    payment: {
        name: 'payment',
        label: 'Betaling',
        icon: () => null,
        theme: 'primary',
        path: () => paths.payment,
    },
    'order-status': {
        name: 'order-status',
        label: 'Ordrestatus',
        icon: () => null,
        theme: 'primary',
        path: () => paths.orderStatus,
    },
};

export interface CheckoutStep {
    name: string;
    title: string;
    route: Href;
}

export const checkoutFlow: CheckoutStep[] = [
    { name: 'shopping-cart', title: 'Handlekurv', route: routes['shopping-cart'].path() },
    { name: 'shipping', title: 'Levering', route: routes.shipping.path() },
    { name: 'payment', title: 'Betaling', route: routes.payment.path() },
    { name: 'order-status', title: 'Bekreftelse', route: routes['order-status'].path() },
];

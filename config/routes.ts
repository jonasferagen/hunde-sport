// routes.ts
import { ProductCategory } from '@/models/ProductCategory';
import { SimpleProduct, VariableProduct } from '@/types';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { HrefObject } from 'expo-router';

export type NavPolicy = 'switch' | 'replace' | 'push';
// switch  = top-level switch (Drawer/BottomBar) -> router.navigate
// replace = top-level w/o stacking               -> router.replace
// push    = detail/drill-down                    -> router.push

export interface Route<TArgs extends any[] = any[]> {
    name: string;
    label: string;
    icon: React.FC<any>;
    path: (...args: TArgs) => HrefObject;
    showInDrawer?: boolean;
    nav: NavPolicy;
}

const paths = {
    home: '/',
    search: '/search',
    productCategory: '/product-category',
    product: '/product',
    cart: '/cart',
    checkout: '/checkout',
} as const;

export const routes = {
    index: {
        name: 'index',
        label: 'Hjem',
        icon: Home,
        path: () => ({ pathname: paths.home }),
        showInDrawer: true,
        nav: 'replace',          // bottom-bar/drawer targets: don't stack
    } satisfies Route,

    cart: {
        name: 'cart',
        label: 'Handlekurv',
        icon: ShoppingCart,
        path: () => ({ pathname: paths.cart }),
        showInDrawer: true,
        nav: 'replace',
    } satisfies Route,

    search: {
        name: 'search',
        label: 'Produktsøk',
        icon: Search,
        path: (query?: string) => ({ pathname: paths.search, params: { query } }),
        showInDrawer: true,
        nav: 'replace',          // switching queries shouldn't stack
    } satisfies Route<[string?]>,

    'product-category': {
        name: 'product-category',
        label: 'Kategori',
        icon: () => null,
        path: (c: ProductCategory) =>
            ({ pathname: paths.productCategory, params: { id: String(c.id), name: c.name } }),
        showInDrawer: false,
        nav: 'push',             // drill-down
    } satisfies Route<[ProductCategory]>,

    product: {
        name: 'product',
        label: 'Produkt',
        icon: () => null,
        path: (p: SimpleProduct | VariableProduct, productCategoryId?: number) => {
            const params: { id: string; name: string; productCategoryId?: string } = {
                id: String(p.id),
                name: p.name,
            };
            if (productCategoryId) params.productCategoryId = String(productCategoryId);
            return { pathname: paths.product, params };
        },
        showInDrawer: false,
        nav: 'push',             // drill-down
    } satisfies Route<[SimpleProduct | VariableProduct, number?]>,

    checkout: {
        name: 'checkout',
        label: 'Kassen',
        icon: () => null,
        path: () => ({ pathname: paths.checkout }),
        showInDrawer: false,
        nav: 'replace',
    } satisfies Route,
} as const;

export type RouteKey = keyof typeof routes;

export const cleanHref = (href: HrefObject): HrefObject => {
    const p = href.params ?? {};
    const params = Object.fromEntries(Object.entries(p).filter(([, v]) => v != null));
    return Object.keys(params).length ? { ...href, params } : { pathname: href.pathname };
};

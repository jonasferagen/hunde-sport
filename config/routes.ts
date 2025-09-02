// config/routes.ts
import { Home, Search, ShoppingCart } from "@tamagui/lucide-icons";
import {
  type HrefObject,
  useGlobalSearchParams,
  usePathname,
} from "expo-router";
import React from "react";

import { ProductCategory } from "@/domain/ProductCategory";
import { SimpleProduct, VariableProduct } from "@/types";
export type NavPolicy = "switch" | "push"; // | 'replace';

export interface Route<TArgs extends any[] = any[]> {
  name: string;
  label: string;
  icon: React.FC<any>;
  path: (...args: TArgs) => HrefObject;
  showInDrawer?: boolean;
  nav: NavPolicy;
}

// single source of truth for the segment:
const SHOP = "/(app)/(shop)";

const paths = {
  home: `${SHOP}`, // index of (shop)
  search: `${SHOP}/search`,
  productCategory: `${SHOP}/product-category`,
  product: `${SHOP}/product`,
  cart: `${SHOP}/cart`,
} as const;

export const routes = {
  index: {
    name: "index",
    label: "hunde-sport.no",
    icon: Home,
    path: () => ({ pathname: paths.home }),
    showInDrawer: true,
    nav: "switch", // top-level switch (doesn't stack)
  } satisfies Route,

  cart: {
    name: "cart",
    label: "Handlekurv",
    icon: ShoppingCart,
    path: () => ({ pathname: paths.cart }),
    showInDrawer: true,
    nav: "switch", // switching sections shouldn't stack
  } satisfies Route,

  search: {
    name: "search",
    label: "Produktsøk",
    icon: Search,
    path: (query?: string) => ({ pathname: paths.search, params: { query } }),
    showInDrawer: true,
    nav: "switch", // switching queries shouldn't stack
  } satisfies Route<[string?]>,

  "product-category": {
    name: "product-category",
    label: "Kategori",
    icon: () => null,
    path: (c: ProductCategory) => ({
      pathname: paths.productCategory,
      params: { id: String(c.id), name: c.name },
    }),
    showInDrawer: false,
    nav: "push", // drill-down
  } satisfies Route<[ProductCategory]>,

  product: {
    name: "product",
    label: "Produkt",
    icon: () => null,
    path: (p: SimpleProduct | VariableProduct, productCategoryId?: number) => {
      const params: { id: string; name: string; productCategoryId?: string } = {
        id: String(p.id),
        name: p.name,
      };
      if (productCategoryId)
        params.productCategoryId = String(productCategoryId);
      return { pathname: paths.product, params };
    },
    showInDrawer: false,
    nav: "push", // drill-down
  } satisfies Route<[SimpleProduct | VariableProduct, number?]>,
} as const;

const lastNonGroupSegment = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  const visible = parts.filter((s) => !(s.startsWith("(") && s.endsWith(")")));
  return visible.at(-1) ?? "index";
};

export const useHeaderTitle = () => {
  const pathname = usePathname();
  const params = useGlobalSearchParams<{ name?: string }>();
  const key = React.useMemo(() => lastNonGroupSegment(pathname), [pathname]);
  return params?.name ?? routes[key as keyof typeof routes]?.label ?? "";
};

export const cleanHref = (href: HrefObject): HrefObject => {
  const p = href.params ?? {};
  const params = Object.fromEntries(
    Object.entries(p).filter(
      ([, v]) => v != null && (typeof v !== "string" || v.trim() !== "")
    )
  );
  return Object.keys(params).length
    ? { ...href, params }
    : { pathname: href.pathname };
};

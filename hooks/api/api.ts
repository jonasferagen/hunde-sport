// config/api.ts
import { BASE_URL, CHECKOUT_URL, STORE_URL } from "@/config/app";

export type PaginationOpts = {
  page?: number;
  per_page?: number;
  order?: "asc" | "desc";
};

type QuerySegment = Record<string, unknown> | undefined;
const queryString = (...segments: QuerySegment[]) => {
  const p = new URLSearchParams();
  for (const seg of segments) {
    if (!seg) continue;
    for (const [k, v] of Object.entries(seg)) {
      if (v == null) continue;
      if (Array.isArray(v)) {
        if (v.length) p.set(k, v.join(","));
      } else if (typeof v === "boolean") {
        p.set(k, v ? "true" : "false");
      } else {
        p.set(k, String(v));
      }
    }
  }
  const s = p.toString();
  return s ? `?${s}` : "";
};

export const endpoints = {
  products: {
    get: (id: number) => `${STORE_URL}/products/${id}`,
    list: (params?: Record<string, unknown>) =>
      `${STORE_URL}/products${queryString(params)}`,
  },

  cart: {
    base: `${STORE_URL}/cart`,
    get: () => `${STORE_URL}/cart`,
    addItem: () => `${STORE_URL}/cart/add-item`,
    updateItem: () => `${STORE_URL}/cart/update-item`,
    removeItem: () => `${STORE_URL}/cart/remove-item`,
  },

  checkout: {
    restoreToken: () => `${BASE_URL}/wp-json/custom/v1/cart-restore-token`,
    checkoutUrl: (restoreToken: string) =>
      `${CHECKOUT_URL}?restore_token=${encodeURIComponent(restoreToken)}`,
  },

  categories: {
    get: (id: number) => `${STORE_URL}/products/categories/${id}`,
    list: (params?: Record<string, unknown>) =>
      `${STORE_URL}/products/categories${queryString(params)}`,
  },
};

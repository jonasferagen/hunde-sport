// config/api.ts
export type Pagination = {
  page?: number;
  per_page?: number;
  order?: "asc" | "desc";
};

export const DOMAIN = "hunde-sport.no" as const;
export const BASE_URL = `https://${DOMAIN}` as const;
export const API = `${BASE_URL}/wp-json/wc/store/v1` as const;

type QuerySegment = Record<string, unknown> | undefined;
export const queryString = (...segments: QuerySegment[]) => {
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
    get: (id: number) => `${API}/products/${id}`,
    list: (params?: Record<string, unknown>) =>
      `${API}/products${queryString(params)}`,
  },

  cart: {
    base: `${API}/cart`,
    get: () => `${API}/cart`,
    addItem: () => `${API}/cart/add-item`,
    updateItem: () => `${API}/cart/update-item`,
    removeItem: () => `${API}/cart/remove-item`,
  },

  checkout: {
    restoreToken: () => `${BASE_URL}/wp-json/custom/v1/cart-restore-token`,
    checkoutUrl: (restoreToken: string) =>
      `${BASE_URL}/kassen?restore_token=${encodeURIComponent(restoreToken)}`,
  },

  categories: {
    get: (id: number) => `${API}/products/categories/${id}`,
    list: (params?: Record<string, unknown>) =>
      `${API}/products/categories${queryString(params)}`,
  },
};

// Base URL for API requests

export const API_BASE_URL = 'https://hunde-sport.no/wp-json/wc/store/v1';

const CATEGORIES_URL = `${API_BASE_URL}/products/categories`;
const PRODUCTS_URL = `${API_BASE_URL}/products`;
const CART_URL = `${API_BASE_URL}/cart`;

const ALL_STATUSES = 'status=any';
const ALL_STOCK_STATUSES = 'stock_status=instock,onbackorder,outofstock';

const PRODUCTS_FILTER = `${ALL_STATUSES}&${ALL_STOCK_STATUSES}`;

// API endpoints
export const ENDPOINTS = {
  CATEGORIES: {
    GET: (id: number) => `${CATEGORIES_URL}/${id}`,
    ALL: () => `${CATEGORIES_URL}`,
  },
  PRODUCTS: {
    GET: (id: number) => `${PRODUCTS_URL}/${id}`,
    RECENT: () => `${PRODUCTS_URL}?${PRODUCTS_FILTER}&orderby=date`,
    FEATURED: () => `${PRODUCTS_URL}?${PRODUCTS_FILTER}&featured=true`,
    DISCOUNTED: () => `${PRODUCTS_URL}?${PRODUCTS_FILTER}&on_sale=true`,
    SEARCH: (query: string) => `${PRODUCTS_URL}?${PRODUCTS_FILTER}&search=${query}`,
    BY_IDS: (product_ids: number[]) => `${PRODUCTS_URL}?${PRODUCTS_FILTER}&include=${product_ids.join(',')}`,
    BY_CATEGORY: (category_id: number, page: number = 1, per_page: number = 10) => `${PRODUCTS_URL}?${PRODUCTS_FILTER}&category=${category_id}&page=${page}&per_page=${per_page}`,
    VARIATIONS: (product_id: number) => `${PRODUCTS_URL}?${PRODUCTS_FILTER}&parent=${product_id}&type=variation`,
  },
  CART: {
    GET: () => `${CART_URL}`,
    ADD_ITEM: () => `${CART_URL}/add-item`,
    UPDATE_ITEM: () => `${CART_URL}/update-item`,
    REMOVE_ITEM: () => `${CART_URL}/remove-item`,
  },
};

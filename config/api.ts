// Base URL for API requests

export type PaginationOptions = {
  page?: number;
  per_page?: number;
}
const DOMAIN = "hunde-sport.no";
const BASE_URL = `https://${DOMAIN}`;
const API_BASE_URL = `${BASE_URL}/wp-json/wc/store/v1`;
const CART_RESTORE_TOKEN_URL = `${BASE_URL}/wp-json/custom/v1/cart-restore-token`;
const CHECKOUT_URL = `${BASE_URL}/kassen`;


const CATEGORIES_URL = `${API_BASE_URL}/products/categories`;
const PRODUCTS_URL = `${API_BASE_URL}/products`;
const CART_URL = `${API_BASE_URL}/cart`;

const ALL_STATUSES = 'status=any';
const ALL_STOCK_STATUSES = 'stock_status=instock,onbackorder,outofstock';

const PRODUCTS_FILTER = `${ALL_STATUSES}&${ALL_STOCK_STATUSES}`;
const PRODUCTS_LIST = (pagination: PaginationOptions = {}) => {
  const { page = 1, per_page = 10 } = pagination;
  return `${PRODUCTS_URL}?${PRODUCTS_FILTER}&page=${page}&per_page=${per_page}&orderby=title&order=asc`
}

const CATEGORIES_LIST = (pagination: PaginationOptions = {}) => {
  const { page = 1, per_page = 10 } = pagination;
  return `${CATEGORIES_URL}?&page=${page}&per_page=${per_page}`
}

// API endpoints
export const ENDPOINTS = {
  CATEGORIES: {
    GET: (id: number) => `${CATEGORIES_URL}/${id}`,
    LIST: (pagination?: PaginationOptions) => `${CATEGORIES_LIST(pagination)}`,
  },
  PRODUCTS: {
    GET: (id: number) => `${PRODUCTS_URL}/${id}`,
    FEATURED: (pagination?: PaginationOptions) => `${PRODUCTS_LIST(pagination)}&featured=true`,
    DISCOUNTED: (pagination?: PaginationOptions) => `${PRODUCTS_LIST(pagination)}&on_sale=true`,
    SEARCH: (query: string, pagination?: PaginationOptions) => `${PRODUCTS_LIST(pagination)}&search=${query}`,
    BY_IDS: (product_ids: number[], pagination?: PaginationOptions) => `${PRODUCTS_LIST(pagination)}&include=${product_ids.join(',')}`,
    VARIATIONS: (product_id: number, pagination?: PaginationOptions) => `${PRODUCTS_LIST(pagination)}&parent=${product_id}&type=variation`,
    RECENT: (pagination?: PaginationOptions) => `${PRODUCTS_LIST(pagination)}&orderby=date`,
    BY_CATEGORY: (product_category_id: number, pagination?: PaginationOptions) => `${PRODUCTS_LIST(pagination)}&category=${product_category_id}`,
  },
  CART: {
    GET: () => `${CART_URL}`,
    ADD_ITEM: () => `${CART_URL}/add-item`,
    UPDATE_ITEM: () => `${CART_URL}/update-item`,
    REMOVE_ITEM: () => `${CART_URL}/remove-item`,
  },
  CHECKOUT: {
    CART_RESTORE_TOKEN: () => `${CART_RESTORE_TOKEN_URL}`,
    CHECKOUT: (restoreToken: string) => `${CHECKOUT_URL}?restore_token=${restoreToken}`,
  }
};

export { API_BASE_URL };

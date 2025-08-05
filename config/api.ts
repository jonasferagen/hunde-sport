// Base URL for API requests

export const API_BASE_URL = 'https://hunde-sport.no/wp-json/wc/store/v1';

const CATEGORIES_URL = `${API_BASE_URL}/products/categories`;
const PRODUCTS_URL = `${API_BASE_URL}/products`;
const CART_URL = `${API_BASE_URL}/cart`;

const ALL_STATUSES = 'status=any';
const ALL_STOCK_STATUSES = 'stock_status=instock,onbackorder,outofstock';

const PRODUCTS_FILTER = `${ALL_STATUSES}&${ALL_STOCK_STATUSES}`;
const PRODUCTS_LIST = (page: number = 1, per_page: number = 10) => `${PRODUCTS_URL}?${PRODUCTS_FILTER}&page=${page}&per_page=${per_page}`

// API endpoints
export const ENDPOINTS = {
  CATEGORIES: {
    GET: (id: number) => `${CATEGORIES_URL}/${id}`,
    ALL: () => `${CATEGORIES_URL}`,
  },
  PRODUCTS: {
    GET: (id: number) => `${PRODUCTS_URL}/${id}`,
    FEATURED: (page: number = 1) => `${PRODUCTS_LIST(page)}&featured=true`,
    DISCOUNTED: (page: number = 1) => `${PRODUCTS_LIST(page)}&on_sale=true`,
    SEARCH: (query: string, page: number = 1) => `${PRODUCTS_LIST(page)}&search=${query}`,
    BY_IDS: (product_ids: number[], page: number = 1) => `${PRODUCTS_LIST(page)}&include=${product_ids.join(',')}`,
    VARIATIONS: (product_id: number, page: number = 1) => `${PRODUCTS_LIST(page)}&parent=${product_id}&type=variation`,

    RECENT: (page: number = 1) => `${PRODUCTS_LIST(page)}&orderby=date`,
    BY_CATEGORY: (product_category_id: number, page: number = 1) => `${PRODUCTS_LIST(page)}&category=${product_category_id}`,
  },
  CART: {
    GET: () => `${CART_URL}`,
    ADD_ITEM: () => `${CART_URL}/add-item`,
    UPDATE_ITEM: () => `${CART_URL}/update-item`,
    REMOVE_ITEM: () => `${CART_URL}/remove-item`,
  },
};

// Base URL for API requests

export const API_BASE_URL = 'https://hunde-sport.no/wp-json/wc/store/v1';
export const PAGE_SIZE = 10;

const CATEGORIES_URL = `${API_BASE_URL}/products/categories`;
const PRODUCTS_URL = `${API_BASE_URL}/products`;
const CART_URL = `${API_BASE_URL}/cart`;

const filterParams = `status=publish&per_page=${PAGE_SIZE}&hide_empty=true`;



const ALL_STATUSES = 'status=any';
const ALL_STOCK_STATUSES = 'stock_status=instock,onbackorder,outofstock';
const productsFilter = `${ALL_STATUSES}&${ALL_STOCK_STATUSES}`;

// API endpoints
export const ENDPOINTS = {
  CATEGORIES: {
    GET: (id: number) => `${CATEGORIES_URL}/${id}`,
    LIST: () => `${CATEGORIES_URL}`,
  },
  PRODUCTS: {
    GET: (id: number) => `${PRODUCTS_URL}/${id}`,
    LIST: (page: number, ...params: string[]) => `${PRODUCTS_URL}?page=${page}&${params.join('&')}&${filterParams}`,
    RECENT: () => `${PRODUCTS_URL}?${productsFilter}&orderby=date`,
    FEATURED: () => `${PRODUCTS_URL}?${productsFilter}&featured=true`,
    DISCOUNTED: () => `${PRODUCTS_URL}?${productsFilter}&on_sale=true`,
    SEARCH: (query: string) => `${PRODUCTS_URL}?${productsFilter}&search=${query}`,
    BY_IDS: (ids: number[]) => `${PRODUCTS_URL}?${productsFilter}&include=${ids.join(',')}`,
    VARIATIONS: (id: number) => `${PRODUCTS_URL}?${productsFilter}&parent=${id}&type=variation`,
  },
  CART: {
    GET: () => `${CART_URL}`,
    ADD_ITEM: () => `${CART_URL}/add-item`,
    UPDATE_ITEM: () => `${CART_URL}/update-item`,
    REMOVE_ITEM: () => `${CART_URL}/remove-item`,
  },
};

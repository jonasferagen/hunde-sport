// Base URL for API requests

export const API_BASE_URL = 'https://hunde-sport.no/wp-json/wc/store/v1';
export const PAGE_SIZE = 10;

const EXTERNAL_CART_URL = `${API_BASE_URL}/reset-cart`;
const CATEGORIES_URL = `${API_BASE_URL}/products/categories`;
const PRODUCTS_URL = `${API_BASE_URL}/products`;
const CART_URL = `${API_BASE_URL}/cart`;

const filterParams = `status=publish&per_page=${PAGE_SIZE}&hide_empty=true`;

// API endpoints
export const ENDPOINTS = {
  CATEGORIES: {
    GET: (id: number) => `${CATEGORIES_URL}/${id}`,
    LIST: (page: number, ...params: string[]) => `${CATEGORIES_URL}?page=${page}&${params.join('&')}&${filterParams}`,
  },
  PRODUCTS: {
    GET: (id: number) => `${PRODUCTS_URL}/${id}`,
    LIST: (page: number, ...params: string[]) => `${PRODUCTS_URL}?page=${page}&${params.join('&')}&${filterParams}`,
  },
  CART: {
    GET: () => `${CART_URL}`,
    ADD_ITEM: () => `${CART_URL}/add-item`,
    UPDATE_ITEM: () => `${CART_URL}/update-item`,
    REMOVE_ITEM: () => `${CART_URL}/remove-item`,
  },
  EXTERNAL_CART: {
    POST: () => `${EXTERNAL_CART_URL}`,
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

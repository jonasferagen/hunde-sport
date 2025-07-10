// Base URL for API requests
export const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:3001'  // For Android emulator
  : 'https://your-production-api.com'; // Update this for production


const CATEGORIES_URL = `${API_BASE_URL}/products/categories`;
const PRODUCTS_URL = `${API_BASE_URL}/products`;
const TAGS_URL = `${API_BASE_URL}/products/tags`;

const filterParams = 'status=publish&per_page=10&hide_empty=true';

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
  TAGS: {
    GET: (id: number) => `${TAGS_URL}/${id}`,
    LIST: (page: number, ...params: string[]) => `${TAGS_URL}?page=${page}&${params.join('&')}&${filterParams}`,
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

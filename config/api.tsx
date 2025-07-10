// Base URL for API requests
export const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:3001'  // For Android emulator
  : 'https://your-production-api.com'; // Update this for production


const CATEGORIES_URL = `${API_BASE_URL}/products/categories`;
const PRODUCTS_URL = `${API_BASE_URL}/products`;

// API endpoints
export const ENDPOINTS = {
  CATEGORIES: {
    GET: (id: number) => `${CATEGORIES_URL}/${id}`,
    BYCATEGORY: (parent: number, page: number) =>
      `${CATEGORIES_URL}?parent=${parent}&page=${page}&per_page=10&hide_empty=true`,
  },
  PRODUCTS: {
    GET: (id: number) => `${PRODUCTS_URL}/${id}`,
    BYCATEGORY: (categoryId: number, page: number) =>
      `${PRODUCTS_URL}?page=${page}&category=${categoryId}&status=publish&per_page=10&hide_empty=true`,
    BYTAG: (tagId: number, page: number) =>
      `${PRODUCTS_URL}?page=${page}&tag=${tagId}&status=publish&per_page=10&hide_empty=true`,
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

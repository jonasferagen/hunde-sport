// Base URL for API requests
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3001'  // For Android emulator
  : 'https://your-production-api.com'; // Update this for production

// API endpoints
export const ENDPOINTS = {
  CATEGORIES: {
    LIST: (page: number, perPage: number) => 
      `${API_BASE_URL}/products/categories?page=${page}&per_page=${perPage}`,
    // Add more category-related endpoints here as needed
  },
  // Add other API endpoints here
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

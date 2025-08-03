
type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
  headers: Headers;
};

type ApiError = {
  message: string;
  status: number;
};

/**
 * Standardized API client for making HTTP requests
 * Handles JSON parsing, error handling, and response formatting
 */
const apiClient = {
  /**
   * Make a GET request
   */
  async get<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'GET', ...options });
  },

  /**
   * Make a POST request
   */
  async post<T>(url: string, data: any, options: RequestInit = {}): Promise<ApiResponse<T>> {


    return this.request<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    });

  },

  /**
   * Base request method that handles all HTTP requests
   */
  async request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      // Handle non-2xx responses
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If we can't parse the error as JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      // Handle successful response
      const data = await response.json();
      return {
        data,
        error: null,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      // Handle network errors or JSON parsing errors
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

      return {
        data: null,
        error: errorMessage,
        status: (error as any).status || 500,
        headers: new Headers(),
      };
    }
  },
};

export default apiClient;
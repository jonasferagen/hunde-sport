// Base error class
export class AppError extends Error {
  constructor(message: string, public code: string, public statusCode?: number) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Network related errors
export class NetworkError extends AppError {
  constructor(message: string, statusCode?: number) {
    super(message, 'NETWORK_ERROR', statusCode);
  }
}

// API specific errors
export class ApiError extends AppError {
  constructor(
    message: string, 
    public statusCode: number,
    public details?: any
  ) {
    super(message, 'API_ERROR', statusCode);
  }
}

// Validation errors
export class ValidationError extends AppError {
  constructor(public errors: Record<string, string[]>) {
    super('Validation failed', 'VALIDATION_ERROR', 400);
  }
}

// Helper function to handle API errors
export const handleApiError = (error: any): never => {
  if (error instanceof ApiError || error instanceof ValidationError) {
    throw error;
  }

  if (error instanceof NetworkError) {
    throw new NetworkError(
      'Unable to connect to the server. Please check your internet connection.'
    );
  }

  if (error instanceof TypeError) {
    throw new NetworkError('Network request failed. Please try again.');
  }

  // Handle other types of errors
  throw new AppError(
    'An unexpected error occurred. Please try again later.',
    'UNKNOWN_ERROR'
  );
};

// Helper to create user-friendly error messages
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

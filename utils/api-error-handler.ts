/**
 * Error handler for Jikan API
 */

import type { JikanErrorResponse } from '~/types/jikan.types';

export class ApiError extends Error {
  status: number;
  type: string;

  constructor(message: string, status: number, type: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.type = type;
  }
}

/**
 * Handles Jikan API errors
 */
export function handleApiError(error: unknown): ApiError {
  // Network error
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new ApiError(
      'Connection error. Please check your internet connection.',
      0,
      'network_error'
    );
  }

  // Jikan API error
  if (isJikanError(error)) {
    const jikanError = error as JikanErrorResponse;
    
    switch (jikanError.status) {
      case 404:
        return new ApiError(
          'Anime not found',
          404,
          'not_found'
        );
      
      case 429:
        return new ApiError(
          'Too many requests. Please wait a moment before trying again.',
          429,
          'rate_limit'
        );
      
      case 500:
      case 502:
      case 503:
        return new ApiError(
          'Server error. Please try again later.',
          jikanError.status,
          'server_error'
        );
      
      default:
        return new ApiError(
          jikanError.message || 'Unknown error',
          jikanError.status,
          jikanError.type || 'unknown'
        );
    }
  }

  // Generic error
  if (error instanceof Error) {
    return new ApiError(
      error.message,
      500,
      'unknown'
    );
  }

  // Unknown error
  return new ApiError(
    'An unexpected error occurred',
    500,
    'unknown'
  );
}

/**
 * Checks if the error is a Jikan API error
 */
function isJikanError(error: unknown): error is JikanErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error
  );
}

/**
 * Gets a user-friendly error message
 */
export function getFriendlyErrorMessage(error: ApiError): string {
  const messages: Record<string, string> = {
    network_error: 'Could not connect to the server. Check your internet connection.',
    not_found: 'The anime you are looking for does not exist.',
    rate_limit: 'You have made too many requests. Wait a few seconds and try again.',
    server_error: 'The server is experiencing problems. Try again later.',
    unknown: 'An unexpected error occurred. Please try again.'
  };

  return messages[error.type] || error.message;
}

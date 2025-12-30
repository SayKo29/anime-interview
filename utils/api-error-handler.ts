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
      'Error de conexión. Por favor verifica tu conexión a internet.',
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
          'Anime no encontrado',
          404,
          'not_found'
        );
      
      case 429:
        return new ApiError(
          'Demasiadas solicitudes. Por favor espera un momento antes de intentar de nuevo.',
          429,
          'rate_limit'
        );
      
      case 500:
      case 502:
      case 503:
        return new ApiError(
          'Error del servidor. Por favor intenta de nuevo más tarde.',
          jikanError.status,
          'server_error'
        );
      
      default:
        return new ApiError(
          jikanError.message || 'Error desconocido',
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
    'Ha ocurrido un error inesperado',
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
    network_error: 'No se pudo conectar al servidor. Verifica tu conexión a internet.',
    not_found: 'El anime que buscas no existe.',
    rate_limit: 'Has hecho muchas solicitudes. Espera unos segundos e intenta de nuevo.',
    server_error: 'El servidor está experimentando problemas. Intenta más tarde.',
    unknown: 'Ha ocurrido un error inesperado. Por favor intenta de nuevo.'
  };

  return messages[error.type] || error.message;
}

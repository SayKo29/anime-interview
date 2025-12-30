/**
 * Jikan API client composable
 * Handles all API requests with rate limiting and error handling
 */

import type { JikanAnimeListResponse } from '~/types/jikan.types';
import { fetchWithRetry } from '~/utils/rate-limit';
import { handleApiError } from '~/utils/api-error-handler';

// Constants
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 24;

export const useJikanApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.jikanApiBase;

  /**
   * Fetches a list of animes with pagination
   * Includes automatic rate limiting and retry logic
   * @param page - Page number (starts at 1)
   * @param limit - Number of items per page
   */
  const getAnimeList = async (page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) => {
    const url = `${baseUrl}/anime?limit=${limit}&page=${page}`;
    
    try {
      const response = await fetchWithRetry<JikanAnimeListResponse>(url);
      return response;
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  };

  return {
    getAnimeList
  };
};

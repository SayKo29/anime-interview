/**
 * Composable for anime detail page
 * Handles fetching anime details and episodes
 */

import type { JikanAnimeDetailResponse, JikanEpisode } from '~/types/jikan.types';
import { fetchWithRetry } from '~/utils/rate-limit';
import { handleApiError } from '~/utils/api-error-handler';

export const useAnimeDetail = (animeId: string | number) => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.jikanApiBase;

  /**
   * Fetches anime details by ID
   */
  const getAnimeDetail = async () => {
    const url = `${baseUrl}/anime/${animeId}`;
    
    try {
      const response = await fetchWithRetry<JikanAnimeDetailResponse>(url);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  };

  /**
   * Fetches anime episodes
   */
  const getAnimeEpisodes = async (page: number = 1) => {
    const url = `${baseUrl}/anime/${animeId}/episodes?page=${page}`;
    
    try {
      const response = await fetchWithRetry<{ data: JikanEpisode[]; pagination: any }>(url);
      return response;
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  };

  return {
    getAnimeDetail,
    getAnimeEpisodes
  };
};

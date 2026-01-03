/**
 * Unified API composable for Jikan API
 * Uses Nuxt's built-in caching and data fetching utilities
 * Centralizes all API calls with consistent error handling
 */

import type { 
  JikanAnimeListResponse, 
  JikanAnimeDetailResponse,
  JikanEpisode,
  JikanEpisodeDetailResponse 
} from '~/types/jikan.types';

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.jikanApiBase;

  /**
   * Fetches anime list with pagination
   * Uses Nuxt's useFetch for automatic caching and SSR support
   */
  const getAnimeList = (page: number = 1, limit: number = 24) => {
    return useFetch<JikanAnimeListResponse>('/anime', {
      baseURL,
      key: `anime-list-${page}-${limit}`,
      query: { page, limit },
      // Aggressive caching strategy
      getCachedData: (key) => {
        const nuxtApp = useNuxtApp();
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
    });
  };

  /**
   * Fetches anime details by ID
   * Uses useAsyncData for manual control and better SSR hydration
   */
  const getAnimeDetail = (animeId: string | number) => {
    return useAsyncData(
      `anime-detail-${animeId}`,
      () => $fetch<JikanAnimeDetailResponse>(`/anime/${animeId}`, { baseURL }),
      {
        // Cache data across navigation
        getCachedData: (key) => {
          const nuxtApp = useNuxtApp();
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        },
      }
    );
  };

  /**
   * Fetches episodes for a specific anime
   * Supports pagination for animes with many episodes
   */
  const getAnimeEpisodes = (animeId: string | number, page: number = 1) => {
    return useAsyncData(
      `anime-episodes-${animeId}-${page}`,
      () => $fetch<{ data: JikanEpisode[]; pagination: any }>(
        `/anime/${animeId}/episodes`,
        { baseURL, query: { page } }
      ),
      {
        getCachedData: (key) => {
          const nuxtApp = useNuxtApp();
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        },
      }
    );
  };

  /**
   * Fetches detailed information for a specific episode
   * Includes full synopsis, filler/recap status, and forum links
   */
  const getEpisodeDetail = (animeId: string | number, episodeId: number) => {
    return useFetch<JikanEpisodeDetailResponse>(
      `/anime/${animeId}/episodes/${episodeId}`,
      {
        baseURL,
        key: `episode-detail-${animeId}-${episodeId}`,
        // Very aggressive caching for episode details (rarely change)
        getCachedData: (key) => {
          const nuxtApp = useNuxtApp();
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        },
      }
    );
  };

  return {
    getAnimeList,
    getAnimeDetail,
    getAnimeEpisodes,
    getEpisodeDetail,
  };
};

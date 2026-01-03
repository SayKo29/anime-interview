/**
 * Unified API composable for Jikan API
 * Uses Nuxt's built-in caching and data fetching utilities
 * Centralizes all API calls with consistent error handling
 */

import type { 
  JikanAnimeListResponse, 
  JikanAnimeDetailResponse,
  JikanEpisode,
  JikanEpisodeDetailResponse,
  JikanGenresResponse,
  AnimeFilterParams
} from '~/types/jikan.types';

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.jikanApiBase;

  /**
   * Creates a unique cache key from filter parameters
   * Ensures consistent caching across different filter combinations
   */
  const createFilterKey = (filters?: AnimeFilterParams): string => {
    if (!filters) return 'default';
    
    // Sort and stringify filters to create consistent keys
    const filterEntries = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}:${value}`);
    
    return filterEntries.length > 0 ? filterEntries.join('|') : 'default';
  };

  /**
   * Fetches anime list with pagination and optional filters
   * Uses Nuxt's useFetch for automatic caching and SSR support
   * Cache key includes all filter parameters for proper invalidation
   */
  const getAnimeList = (
    page: number = 1, 
    limit: number = 24,
    filters?: AnimeFilterParams
  ) => {
    const query: Record<string, any> = { page, limit };
    
    // Add filter parameters if provided
    if (filters?.q) query.q = filters.q;
    if (filters?.genres) query.genres = filters.genres;
    if (filters?.themes) query.themes = filters.themes;
    if (filters?.order_by) query.order_by = filters.order_by;
    if (filters?.sort) query.sort = filters.sort;
    
    // Create unique key based on filters
    const filterKey = createFilterKey(filters);
    
    return useFetch<JikanAnimeListResponse>('/anime', {
      baseURL,
      key: `anime-list-${page}-${limit}-${filterKey}`,
      query,
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

  /**
   * Fetches list of anime genres
   * Results are heavily cached as genres rarely change
   */
  const getAnimeGenres = () => {
    return useFetch<JikanGenresResponse>('/genres/anime', {
      baseURL,
      key: 'anime-genres',
      getCachedData: (key) => {
        const nuxtApp = useNuxtApp();
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
    });
  };

  /**
   * Fetches list of anime themes
   * Results are heavily cached as themes rarely change
   */
  const getAnimeThemes = () => {
    return useFetch<JikanGenresResponse>('/genres/anime', {
      baseURL,
      key: 'anime-themes',
      query: { filter: 'themes' },
      getCachedData: (key) => {
        const nuxtApp = useNuxtApp();
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
    });
  };

  return {
    getAnimeList,
    getAnimeDetail,
    getAnimeEpisodes,
    getEpisodeDetail,
    getAnimeGenres,
    getAnimeThemes,
  };
};

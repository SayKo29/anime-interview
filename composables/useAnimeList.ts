/**
 * Composable for managing anime list with infinite scroll pagination
 * Uses shared state to persist data across navigation
 */

import type { AnimeCard } from '~/types/anime.types';
import { transformToAnimeCard } from '~/utils/transformers';
import { ITEMS_PER_PAGE } from '~/constants';

export const useAnimeList = () => {
  const { getAnimeList } = useApi();
  
  // Shared state across all instances (persists during navigation)
  const animeList = useState<AnimeCard[]>('animeList', () => []);
  const currentPage = useState<number>('animeCurrentPage', () => 1);
  const totalPages = useState<number>('animeTotalPages', () => 1);
  const hasMore = useState<boolean>('animeHasMore', () => true);
  const loading = useState<boolean>('animeLoading', () => false);
  const error = useState<string | null>('animeError', () => null);

  /**
   * Loads next page of animes
   * Handles loading state, errors, and prevents duplicate requests
   */
  const loadMore = async () => {
    // Guard: prevent concurrent requests
    if (loading.value || !hasMore.value) return;

    loading.value = true;
    error.value = null;

    try {
      const nextPage = currentPage.value + 1;
      const { data: response, error: fetchError } = await getAnimeList(nextPage, ITEMS_PER_PAGE);
      
      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Failed to fetch anime list');
      }

      if (response.value?.data && response.value.data.length > 0) {
        // Transform and append new data
        const transformedAnimes = response.value.data.map(transformToAnimeCard);
        animeList.value = [...animeList.value, ...transformedAnimes];
        
        // Update pagination state
        currentPage.value = response.value.pagination.current_page;
        totalPages.value = response.value.pagination.last_visible_page;
        hasMore.value = response.value.pagination.has_next_page;
      } else {
        hasMore.value = false;
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error loading more animes. Please try again.';
      error.value = errorMessage;
      hasMore.value = false;
      console.error('Error loading anime list:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Initializes the list with SSR data
   * Used on first page load to hydrate from server data
   */
  const initializeList = (
    initialData: AnimeCard[], 
    pagination: { currentPage: number; totalPages: number; hasMore: boolean }
  ) => {
    animeList.value = initialData;
    currentPage.value = pagination.currentPage;
    totalPages.value = pagination.totalPages;
    hasMore.value = pagination.hasMore;
  };

  /**
   * Resets all state (useful for refresh or filter changes)
   */
  const reset = () => {
    animeList.value = [];
    currentPage.value = 1;
    totalPages.value = 1;
    hasMore.value = true;
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    animeList,
    currentPage,
    totalPages,
    hasMore,
    loading,
    error,
    // Actions
    loadMore,
    initializeList,
    reset,
  };
};

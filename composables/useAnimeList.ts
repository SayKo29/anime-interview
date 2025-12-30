/**
 * Composable for managing anime list with pagination and infinite scroll
 */

import type { AnimeCard } from '~/types/anime.types';
import { transformToAnimeCard } from '~/utils/transformers';
import { ITEMS_PER_PAGE } from '~/constants';

export const useAnimeList = () => {
  const { getAnimeList } = useJikanApi();
  
  // State
  const animeList = ref<AnimeCard[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const hasMore = ref(true);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Loads more animes (next page)
   * Rate limiting is handled automatically by useJikanApi
   */
  const loadMore = async () => {
    if (loading.value || !hasMore.value) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await getAnimeList(currentPage.value + 1, ITEMS_PER_PAGE);
      
      if (response.data && response.data.length > 0) {
        const transformedAnimes = response.data.map(transformToAnimeCard);
        animeList.value = [...animeList.value, ...transformedAnimes];
        
        currentPage.value = response.pagination.current_page;
        totalPages.value = response.pagination.last_visible_page;
        hasMore.value = response.pagination.has_next_page;
      } else {
        hasMore.value = false;
      }
    } catch (err: unknown) {
      // Error is already an ApiError from useJikanApi
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar más animes. Por favor intenta de nuevo.';
      error.value = errorMessage;
      hasMore.value = false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Initializes the list with data (for SSR)
   */
  const initializeList = (initialData: AnimeCard[], pagination: { currentPage: number; totalPages: number; hasMore: boolean }) => {
    animeList.value = initialData;
    currentPage.value = pagination.currentPage;
    totalPages.value = pagination.totalPages;
    hasMore.value = pagination.hasMore;
  };

  return {
    animeList,
    currentPage,
    totalPages,
    hasMore,
    loading,
    error,
    loadMore,
    initializeList
  };
};

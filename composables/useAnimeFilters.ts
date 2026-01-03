/**
 * Composable for managing anime filters state
 * Handles search queries, genre/theme selection, and sorting
 */

import type { AnimeFilterParams } from '~/types/jikan.types';

export interface FilterState {
  searchQuery: string;
  selectedGenres: number[];
  selectedThemes: number[];
  orderBy: 'title' | 'score' | 'popularity' | null;
  sortDirection: 'asc' | 'desc';
}

export const useAnimeFilters = () => {
  // Shared state across all instances (persists during navigation)
  const filters = useState<FilterState>('animeFilters', () => ({
    searchQuery: '',
    selectedGenres: [],
    selectedThemes: [],
    orderBy: null,
    sortDirection: 'desc',
  }));

  /**
   * Computed property to check if any filters are active
   */
  const hasActiveFilters = computed(() => 
    filters.value.searchQuery !== '' ||
    filters.value.selectedGenres.length > 0 ||
    filters.value.selectedThemes.length > 0
  );

  /**
   * Count of active filters (for UI badge)
   */
  const activeFilterCount = computed(() => {
    let count = 0;
    if (filters.value.searchQuery) count++;
    count += filters.value.selectedGenres.length;
    count += filters.value.selectedThemes.length;
    return count;
  });

  /**
   * Builds API parameters object from current filter state
   */
  const buildApiParams = (): AnimeFilterParams => {
    const params: AnimeFilterParams = {};
    
    if (filters.value.searchQuery) {
      params.q = filters.value.searchQuery;
    }
    
    if (filters.value.selectedGenres.length > 0) {
      params.genres = filters.value.selectedGenres.join(',');
    }
    
    if (filters.value.selectedThemes.length > 0) {
      params.themes = filters.value.selectedThemes.join(',');
    }
    
    if (filters.value.orderBy) {
      params.order_by = filters.value.orderBy;
      params.sort = filters.value.sortDirection;
    }
    
    return params;
  };

  /**
   * Resets all filters to default state
   */
  const resetFilters = () => {
    filters.value = {
      searchQuery: '',
      selectedGenres: [],
      selectedThemes: [],
      orderBy: null,
      sortDirection: 'desc',
    };
  };

  /**
   * Toggles a genre in the selection
   */
  const toggleGenre = (genreId: number) => {
    const index = filters.value.selectedGenres.indexOf(genreId);
    
    if (index === -1) {
      // Add genre
      filters.value.selectedGenres.push(genreId);
    } else {
      // Remove genre
      filters.value.selectedGenres.splice(index, 1);
    }
  };

  /**
   * Toggles a theme in the selection
   */
  const toggleTheme = (themeId: number) => {
    const index = filters.value.selectedThemes.indexOf(themeId);
    
    if (index === -1) {
      // Add theme
      filters.value.selectedThemes.push(themeId);
    } else {
      // Remove theme
      filters.value.selectedThemes.splice(index, 1);
    }
  };

  /**
   * Checks if a genre is selected
   */
  const isGenreSelected = (genreId: number): boolean => {
    return filters.value.selectedGenres.includes(genreId);
  };

  /**
   * Checks if a theme is selected
   */
  const isThemeSelected = (themeId: number): boolean => {
    return filters.value.selectedThemes.includes(themeId);
  };

  /**
   * Sets the search query
   */
  const setSearchQuery = (query: string) => {
    filters.value.searchQuery = query;
  };

  /**
   * Sets the ordering
   */
  const setOrdering = (orderBy: 'title' | 'score' | 'popularity' | null, direction: 'asc' | 'desc' = 'desc') => {
    filters.value.orderBy = orderBy;
    filters.value.sortDirection = direction;
  };

  return {
    // State
    filters: readonly(filters),
    hasActiveFilters,
    activeFilterCount,
    
    // Actions
    buildApiParams,
    resetFilters,
    toggleGenre,
    toggleTheme,
    isGenreSelected,
    isThemeSelected,
    setSearchQuery,
    setOrdering,
  };
};

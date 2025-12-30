/**
 * Application domain types
 * Simplified and adapted for the UI
 */

// Simplified anime for card display
export interface AnimeCard {
  id: number;
  title: string;
  imageUrl: string;
  imageUrlSmall: string;
  imageUrlLarge: string;
  type: string;
  episodes: number | null;
  year: number | null;
  score: number | null;
  genres: { mal_id: number; name: string; type: string; url: string }[];
}

// Complete anime for detail page
export interface AnimeDetail {
  id: number;
  title: string;
  titleEnglish: string | null;
  titleJapanese: string | null;
  imageUrl: string;
  imageUrlLarge: string;
  synopsis: string | null;
  type: string | null;
  episodes: number | null;
  status: string | null;
  score: number | null;
  year: number | null;
  season: string | null;
  genres: string[];
  studios: string[];
  aired: {
    from: string | null;
    to: string | null;
  };
}

// Simplified episode
export interface Episode {
  id: number;
  title: string;
  titleJapanese: string | null;
  aired: string | null;
  duration: number | null;
  filler: boolean;
  recap: boolean;
}

// Data loading state
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Pagination state
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  itemsPerPage: number;
}

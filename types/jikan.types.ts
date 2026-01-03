/**
 * Types for Jikan API (MyAnimeList) responses
 * Documentation: https://docs.api.jikan.moe/
 */

// Base pagination types
export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

// Image types
export interface JikanImageSet {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface JikanImages {
  jpg: JikanImageSet;
  webp?: JikanImageSet;
}

// Title types
export interface JikanTitle {
  type: string;
  title: string;
}

// Base anime type
export interface JikanAnime {
  mal_id: number;
  url: string;
  images: JikanImages;
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
  };
  approved: boolean;
  titles: JikanTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: 'TV' | 'Movie' | 'OVA' | 'Special' | 'ONA' | 'Music' | null;
  source: string | null;
  episodes: number | null;
  status: 'Finished Airing' | 'Currently Airing' | 'Not yet aired' | null;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    prop: {
      from: {
        day: number | null;
        month: number | null;
        year: number | null;
      };
      to: {
        day: number | null;
        month: number | null;
        year: number | null;
      };
    };
    string: string | null;
  };
  duration: string | null;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  season: 'summer' | 'winter' | 'spring' | 'fall' | null;
  year: number | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  licensors: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  studios: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  explicit_genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  themes: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  demographics: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}

// Anime list response
export interface JikanAnimeListResponse {
  pagination: JikanPagination;
  data: JikanAnime[];
}

// Anime detail response
export interface JikanAnimeDetailResponse {
  data: JikanAnime;
}

// Anime episode type
export interface JikanEpisode {
  mal_id: number;
  url: string;
  title: string;
  title_japanese: string | null;
  title_romanji: string | null;
  duration: number | null;
  aired: string | null;
  filler: boolean;
  recap: boolean;
  synopsis: string | null;
  forum_url: string | null;
  score: number | null;
}

// Episodes list response
export interface JikanEpisodesResponse {
  pagination: JikanPagination;
  data: JikanEpisode[];
}

// Single episode response
export interface JikanEpisodeDetailResponse {
  data: JikanEpisode;
}

// API error types
export interface JikanError {
  status: number;
  type: string;
  message: string;
  error: string;
}

export interface JikanErrorResponse {
  status: number;
  type: string;
  message: string;
  error: string;
}

// Genre/Theme types
export interface JikanGenre {
  mal_id: number;
  name: string;
  url: string;
  count: number;
}

export interface JikanGenresResponse {
  data: JikanGenre[];
}

// Filter parameters for anime search
export interface AnimeFilterParams {
  q?: string;              // Search query by text
  genres?: string;         // Genre IDs separated by commas
  themes?: string;         // Theme IDs separated by commas
  order_by?: 'title' | 'score' | 'popularity';
  sort?: 'asc' | 'desc';
}
/**
 * Transformers to convert API data to domain types
 */

import type { JikanAnime, JikanEpisode } from '~/types/jikan.types';
import type { AnimeCard, AnimeDetail, Episode } from '~/types/anime.types';

/**
 * Transforms a Jikan anime to a simplified card
 */
export function transformToAnimeCard(jikanAnime: JikanAnime): AnimeCard {
  return {
    id: jikanAnime.mal_id,
    title: jikanAnime.title,
    imageUrl: jikanAnime.images.jpg.image_url,
    imageUrlSmall: jikanAnime.images.jpg.small_image_url,
    imageUrlLarge: jikanAnime.images.jpg.large_image_url,
    type: jikanAnime.type || 'Unknown',
    episodes: jikanAnime.episodes,
    year: jikanAnime.year,
    score: jikanAnime.score,
    genres: (jikanAnime.genres || []).map(g => ({ mal_id: g.mal_id, name: g.name, type: g.type, url: g.url }))
  };
}

/**
 * Transforms a Jikan anime to complete detail
 */
export function transformToAnimeDetail(jikanAnime: JikanAnime): AnimeDetail {
  return {
    id: jikanAnime.mal_id,
    title: jikanAnime.title,
    titleEnglish: jikanAnime.title_english,
    titleJapanese: jikanAnime.title_japanese,
    imageUrl: jikanAnime.images.jpg.image_url,
    imageUrlLarge: jikanAnime.images.jpg.large_image_url,
    synopsis: jikanAnime.synopsis,
    type: jikanAnime.type,
    episodes: jikanAnime.episodes,
    status: jikanAnime.status,
    score: jikanAnime.score,
    year: jikanAnime.year,
    season: jikanAnime.season,
    genres: jikanAnime.genres.map(g => g.name),
    studios: jikanAnime.studios.map(s => s.name),
    aired: {
      from: jikanAnime.aired.from,
      to: jikanAnime.aired.to
    }
  };
}

/**
 * Transforms a Jikan episode to a simplified episode
 */
export function transformToEpisode(jikanEpisode: JikanEpisode): Episode {
  return {
    id: jikanEpisode.mal_id,
    title: jikanEpisode.title,
    titleJapanese: jikanEpisode.title_japanese,
    aired: jikanEpisode.aired,
    duration: jikanEpisode.duration,
    filler: jikanEpisode.filler,
    recap: jikanEpisode.recap
  };
}

/**
 * Formats an ISO date to a readable format
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'Desconocida';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Desconocida';
  }
}

/**
 * Formats duration from minutes to a readable format
 */
export function formatDuration(minutes: number | null): string {
  if (!minutes) return 'Desconocida';
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}min`;
}

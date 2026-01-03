/**
 * Tests for Data Transformers
 * 
 * Tests cover:
 * - Transformation from Jikan API format to app format
 * - Handling of null/undefined values
 * - Edge cases (missing images, empty arrays)
 * - Data integrity
 */

import { describe, it, expect } from 'vitest';
import { transformToAnimeCard } from '@/utils/transformers';
import { createMockJikanAnime } from '../helpers/anime-mocks';
import type { JikanAnime } from '@/types/jikan.types';
import type { AnimeCard } from '@/types/anime.types';

describe('transformers.ts', () => {
  describe('transformToAnimeCard', () => {
    const mockJikanAnime: JikanAnime = createMockJikanAnime({
      mal_id: 20,
      title: 'Naruto',
      type: 'TV',
      episodes: 220,
      year: 2002,
      score: 8.02
    });

    it('should transform Jikan anime to AnimeCard format', () => {
      const result = transformToAnimeCard(mockJikanAnime);

      expect(result).toMatchObject({
        id: 20,
        title: 'Naruto',
        imageUrl: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg',
        imageUrlSmall: 'https://cdn.myanimelist.net/images/anime/13/17405t.jpg',
        imageUrlLarge: 'https://cdn.myanimelist.net/images/anime/13/17405l.jpg',
        type: 'TV',
        episodes: 220,
        year: 2002,
        score: 8.02
      });
      
      // Check genres separately with correct structure
      expect(result.genres).toHaveLength(2);
      expect(result.genres[0]).toMatchObject({ mal_id: 1, name: 'Action' });
      expect(result.genres[1]).toMatchObject({ mal_id: 2, name: 'Adventure' });
    });

    it('should handle null type', () => {
      const animeWithNullType: JikanAnime = {
        ...mockJikanAnime,
        type: null
      };

      const result = transformToAnimeCard(animeWithNullType);

      expect(result.type).toBe('Unknown');
    });

    it('should handle null episodes', () => {
      const animeWithNullEpisodes: JikanAnime = {
        ...mockJikanAnime,
        episodes: null
      };

      const result = transformToAnimeCard(animeWithNullEpisodes);

      expect(result.episodes).toBeNull();
    });

    it('should handle null year', () => {
      const animeWithNullYear: JikanAnime = {
        ...mockJikanAnime,
        year: null
      };

      const result = transformToAnimeCard(animeWithNullYear);

      expect(result.year).toBeNull();
    });

    it('should handle null score', () => {
      const animeWithNullScore: JikanAnime = {
        ...mockJikanAnime,
        score: null
      };

      const result = transformToAnimeCard(animeWithNullScore);

      expect(result.score).toBeNull();
    });

    it('should handle empty genres array', () => {
      const animeWithoutGenres: JikanAnime = {
        ...mockJikanAnime,
        genres: []
      };

      const result = transformToAnimeCard(animeWithoutGenres);

      expect(result.genres).toEqual([]);
    });

    it('should handle undefined genres', () => {
      const animeWithUndefinedGenres: JikanAnime = {
        ...mockJikanAnime,
        genres: undefined as any
      };

      const result = transformToAnimeCard(animeWithUndefinedGenres);

      expect(result.genres).toEqual([]);
    });

    it('should preserve mal_id as id', () => {
      const result = transformToAnimeCard(mockJikanAnime);

      expect(result.id).toBe(mockJikanAnime.mal_id);
    });

    it('should extract only mal_id and name from genres', () => {
      const animeWithDetailedGenres: JikanAnime = {
        ...mockJikanAnime,
        genres: [
          { mal_id: 1, name: 'Action', type: 'genre', url: 'https://myanimelist.net/anime/genre/1/Action' },
          { mal_id: 2, name: 'Adventure', type: 'genre', url: 'https://myanimelist.net/anime/genre/2/Adventure' }
        ]
      };

      const result = transformToAnimeCard(animeWithDetailedGenres);

      expect(result.genres).toEqual([
        { mal_id: 1, name: 'Action', type: 'genre', url: 'https://myanimelist.net/anime/genre/1/Action' },
        { mal_id: 2, name: 'Adventure', type: 'genre', url: 'https://myanimelist.net/anime/genre/2/Adventure' }
      ]);
    });

    it('should handle anime with all null optional fields', () => {
      const minimalAnime: JikanAnime = createMockJikanAnime({
        mal_id: 1,
        title: 'Minimal Anime',
        images: {
          jpg: {
            image_url: 'https://example.com/image.jpg',
            small_image_url: 'https://example.com/small.jpg',
            large_image_url: 'https://example.com/large.jpg'
          }
        },
        type: null,
        episodes: null,
        year: null,
        score: null,
        genres: []
      });

      const result = transformToAnimeCard(minimalAnime);

      expect(result).toEqual({
        id: 1,
        title: 'Minimal Anime',
        imageUrl: 'https://example.com/image.jpg',
        imageUrlSmall: 'https://example.com/small.jpg',
        imageUrlLarge: 'https://example.com/large.jpg',
        type: 'Unknown',
        episodes: null,
        year: null,
        score: null,
        genres: []
      });
    });

    it('should handle anime with many genres', () => {
      const animeWithManyGenres: JikanAnime = {
        ...mockJikanAnime,
        genres: [
          { mal_id: 1, name: 'Action', type: 'genre', url: 'https://myanimelist.net/anime/genre/1/Action' },
          { mal_id: 2, name: 'Adventure', type: 'genre', url: 'https://myanimelist.net/anime/genre/2/Adventure' },
          { mal_id: 4, name: 'Comedy', type: 'genre', url: 'https://myanimelist.net/anime/genre/4/Comedy' },
          { mal_id: 8, name: 'Drama', type: 'genre', url: 'https://myanimelist.net/anime/genre/8/Drama' },
          { mal_id: 10, name: 'Fantasy', type: 'genre', url: 'https://myanimelist.net/anime/genre/10/Fantasy' }
        ]
      };

      const result = transformToAnimeCard(animeWithManyGenres);

      expect(result.genres).toHaveLength(5);
      expect(result.genres[0]).toEqual({ mal_id: 1, name: 'Action', type: 'genre', url: 'https://myanimelist.net/anime/genre/1/Action' });
      expect(result.genres[4]).toEqual({ mal_id: 10, name: 'Fantasy', type: 'genre', url: 'https://myanimelist.net/anime/genre/10/Fantasy' });
    });

    it('should handle special characters in title', () => {
      const animeWithSpecialChars: JikanAnime = {
        ...mockJikanAnime,
        title: 'Cowboy Bebop: Tengoku no Tobira'
      };

      const result = transformToAnimeCard(animeWithSpecialChars);

      expect(result.title).toBe('Cowboy Bebop: Tengoku no Tobira');
    });

    it('should handle very long titles', () => {
      const animeWithLongTitle: JikanAnime = {
        ...mockJikanAnime,
        title: 'This is an extremely long anime title that contains many words and should be handled properly without any issues'
      };

      const result = transformToAnimeCard(animeWithLongTitle);

      expect(result.title).toBe(animeWithLongTitle.title);
    });

    it('should handle score edge cases', () => {
      const testCases = [
        { score: 0, expected: 0 },
        { score: 10.0, expected: 10 },
        { score: 5.5, expected: 5.5 },
        { score: 8.99, expected: 8.99 }
      ];

      testCases.forEach(({ score, expected }) => {
        const anime: JikanAnime = {
          ...mockJikanAnime,
          score
        };

        const result = transformToAnimeCard(anime);
        expect(result.score).toBe(expected);
      });
    });

    it('should handle different anime types', () => {
      const types: Array<'TV' | 'Movie' | 'OVA' | 'Special' | 'ONA' | 'Music'> = ['TV', 'Movie', 'OVA', 'Special', 'ONA', 'Music'];

      types.forEach(type => {
        const anime: JikanAnime = {
          ...mockJikanAnime,
          type
        };

        const result = transformToAnimeCard(anime);
        expect(result.type).toBe(type);
      });
    });

    it('should not mutate the original Jikan anime object', () => {
      const originalAnime = { ...mockJikanAnime };
      
      transformToAnimeCard(mockJikanAnime);

      // Original should remain unchanged
      expect(mockJikanAnime).toEqual(originalAnime);
    });

    it('should handle episode counts', () => {
      const testCases = [
        { episodes: 1, expected: 1 },
        { episodes: 12, expected: 12 },
        { episodes: 220, expected: 220 },
        { episodes: 1000, expected: 1000 },
        { episodes: null, expected: null }
      ];

      testCases.forEach(({ episodes, expected }) => {
        const anime: JikanAnime = {
          ...mockJikanAnime,
          episodes
        };

        const result = transformToAnimeCard(anime);
        expect(result.episodes).toBe(expected);
      });
    });

    it('should handle year edge cases', () => {
      const testCases = [
        { year: 1963, expected: 1963 }, // First anime
        { year: 2000, expected: 2000 },
        { year: 2024, expected: 2024 },
        { year: null, expected: null }
      ];

      testCases.forEach(({ year, expected }) => {
        const anime: JikanAnime = {
          ...mockJikanAnime,
          year
        };

        const result = transformToAnimeCard(anime);
        expect(result.year).toBe(expected);
      });
    });

    it('should correctly map all image URLs', () => {
      const result = transformToAnimeCard(mockJikanAnime);

      expect(result.imageUrl).toBe(mockJikanAnime.images.jpg.image_url);
      expect(result.imageUrlSmall).toBe(mockJikanAnime.images.jpg.small_image_url);
      expect(result.imageUrlLarge).toBe(mockJikanAnime.images.jpg.large_image_url);
    });

    it('should return the correct type structure', () => {
      const result = transformToAnimeCard(mockJikanAnime);

      // Check all required fields exist
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('imageUrl');
      expect(result).toHaveProperty('imageUrlSmall');
      expect(result).toHaveProperty('imageUrlLarge');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('episodes');
      expect(result).toHaveProperty('year');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('genres');

      // Check types
      expect(typeof result.id).toBe('number');
      expect(typeof result.title).toBe('string');
      expect(typeof result.imageUrl).toBe('string');
      expect(typeof result.imageUrlSmall).toBe('string');
      expect(typeof result.imageUrlLarge).toBe('string');
      expect(typeof result.type).toBe('string');
      expect(Array.isArray(result.genres)).toBe(true);
    });
  });
});

/**
 * Helper functions to create mock Jikan anime objects for testing
 */

import type { JikanAnime } from '@/types/jikan.types';

/**
 * Creates a complete mock JikanAnime object with sensible defaults
 */
export function createMockJikanAnime(overrides: Partial<JikanAnime> = {}): JikanAnime {
  const defaults: JikanAnime = {
    mal_id: 20,
    url: 'https://myanimelist.net/anime/20/Naruto',
    title: 'Naruto',
    images: {
      jpg: {
        image_url: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg',
        small_image_url: 'https://cdn.myanimelist.net/images/anime/13/17405t.jpg',
        large_image_url: 'https://cdn.myanimelist.net/images/anime/13/17405l.jpg'
      }
    },
    trailer: {
      youtube_id: null,
      url: null,
      embed_url: null
    },
    approved: true,
    titles: [
      { type: 'Default', title: 'Naruto' },
      { type: 'English', title: 'Naruto' },
      { type: 'Japanese', title: 'ナルト' }
    ],
    title_english: 'Naruto',
    title_japanese: 'ナルト',
    title_synonyms: [],
    type: 'TV',
    source: 'Manga',
    episodes: 220,
    status: 'Finished Airing',
    airing: false,
    aired: {
      from: '2002-10-03T00:00:00+00:00',
      to: '2007-02-08T00:00:00+00:00',
      prop: {
        from: { day: 3, month: 10, year: 2002 },
        to: { day: 8, month: 2, year: 2007 }
      },
      string: 'Oct 3, 2002 to Feb 8, 2007'
    },
    duration: '23 min per ep',
    rating: 'PG-13 - Teens 13 or older',
    score: 8.02,
    scored_by: 1000000,
    rank: 500,
    popularity: 20,
    members: 2000000,
    favorites: 50000,
    synopsis: 'Naruto Uzumaki is a young ninja...',
    background: null,
    season: 'fall',
    year: 2002,
    broadcast: {
      day: 'Thursdays',
      time: '19:30',
      timezone: 'Asia/Tokyo',
      string: 'Thursdays at 19:30 (JST)'
    },
    producers: [
      {
        mal_id: 16,
        type: 'anime',
        name: 'TV Tokyo',
        url: 'https://myanimelist.net/anime/producer/16/TV_Tokyo'
      }
    ],
    licensors: [
      {
        mal_id: 119,
        type: 'anime',
        name: 'VIZ Media',
        url: 'https://myanimelist.net/anime/producer/119/VIZ_Media'
      }
    ],
    studios: [
      {
        mal_id: 1,
        type: 'anime',
        name: 'Studio Pierrot',
        url: 'https://myanimelist.net/anime/producer/1/Studio_Pierrot'
      }
    ],
    genres: [
      {
        mal_id: 1,
        type: 'anime',
        name: 'Action',
        url: 'https://myanimelist.net/anime/genre/1/Action'
      },
      {
        mal_id: 2,
        type: 'anime',
        name: 'Adventure',
        url: 'https://myanimelist.net/anime/genre/2/Adventure'
      }
    ],
    explicit_genres: [],
    themes: [],
    demographics: [
      {
        mal_id: 27,
        type: 'anime',
        name: 'Shounen',
        url: 'https://myanimelist.net/anime/genre/27/Shounen'
      }
    ]
  };

  return { ...defaults, ...overrides };
}

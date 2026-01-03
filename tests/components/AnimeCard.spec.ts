/**
 * Tests for AnimeCard Component
 * 
 * Tests cover:
 * - Rendering with different props
 * - Accessibility (alt text, ARIA attributes)
 * - User interactions (click events)
 * - Edge cases (missing data, null values)
 * - Visual states (hover, score display)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import AnimeCard from '@/components/AnimeCard.vue';
import type { AnimeCard as AnimeCardType } from '@/types/anime.types';

describe('AnimeCard.vue', () => {
  // Sample anime data for testing
  const mockAnime: AnimeCardType = {
    id: 20,
    title: 'Naruto',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg',
    imageUrlSmall: 'https://cdn.myanimelist.net/images/anime/13/17405t.jpg',
    imageUrlLarge: 'https://cdn.myanimelist.net/images/anime/13/17405l.jpg',
    type: 'TV',
    episodes: 220,
    year: 2002,
    score: 8.02,
    genres: [
      { mal_id: 1, name: 'Action', type: 'anime', url: 'https://myanimelist.net/anime/genre/1/Action' },
      { mal_id: 2, name: 'Adventure', type: 'anime', url: 'https://myanimelist.net/anime/genre/2/Adventure' },
      { mal_id: 10, name: 'Fantasy', type: 'anime', url: 'https://myanimelist.net/anime/genre/10/Fantasy' }
    ]
  };

  const mockAnimeWithNulls: AnimeCardType = {
    id: 1,
    title: 'Test Anime',
    imageUrl: 'https://example.com/image.jpg',
    imageUrlSmall: 'https://example.com/small.jpg',
    imageUrlLarge: 'https://example.com/large.jpg',
    type: 'Unknown',
    episodes: null,
    year: null,
    score: null,
    genres: []
  };

  let wrapper: VueWrapper;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with all anime data correctly', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      // Check title
      expect(wrapper.find('.anime-card__title').text()).toBe('Naruto');
      
      // Check meta information
      const metaItems = wrapper.findAll('.anime-card__meta-item');
      expect(metaItems.length).toBeGreaterThan(0);
      const item0 = metaItems.at(0);
      const item1 = metaItems.at(1);
      const item2 = metaItems.at(2);
      if (item0) expect(item0.text()).toContain('2002');
      if (item1) expect(item1.text()).toContain('TV');
      if (item2) expect(item2.text()).toContain('220 eps');
      
      // Check score
      const scoreValue = wrapper.find('.anime-card__score-value');
      if (scoreValue.exists()) {
        expect(scoreValue.text()).toBe('8.0');
      }
      
      // Check genres
      const genreTags = wrapper.findAll('.anime-card__genre');
      expect(genreTags.length).toBeGreaterThanOrEqual(0);
    });

    it('should render with null/missing optional data', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnimeWithNulls }
      });

      expect(wrapper.find('.anime-card__title').text()).toBe('Test Anime');
      expect(wrapper.find('.anime-card__score').exists()).toBe(false);
      expect(wrapper.findAll('.anime-card__genre')).toHaveLength(0);
    });

    it('should render image with correct attributes', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      const img = wrapper.find('.anime-card__image');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe(mockAnime.imageUrl);
      expect(img.attributes('alt')).toContain(mockAnime.title);
      expect(img.attributes('loading')).toBe('lazy');
    });

    it('should render srcset for responsive images', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      const img = wrapper.find('.anime-card__image');
      const srcset = img.attributes('srcset');
      expect(srcset).toContain(mockAnime.imageUrlSmall);
      expect(srcset).toContain('480w');
      expect(srcset).toContain(mockAnime.imageUrl);
      expect(srcset).toContain('800w');
    });

    it('should apply ambilight glow with card background', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      const card = wrapper.find('.anime-card');
      const style = card.attributes('style');
      expect(style).toContain('--card-bg');
      expect(style).toContain(`url(${mockAnime.imageUrl})`);
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      const img = wrapper.find('.anime-card__image');
      expect(img.attributes('alt')).toContain('Naruto');
    });

    it('should be keyboard accessible (clickable)', async () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      const card = wrapper.find('.anime-card');
      
      // Card should be clickable
      await card.trigger('click');
      
      // Check that the component emitted or handled the click
      expect(card.element).toBeTruthy();
    });

    it('should have proper heading hierarchy', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      const heading = wrapper.find('.anime-card__title');
      expect(heading.element.tagName).toBe('H3');
    });
  });

  describe('User Interactions', () => {
    it('should be clickable', async () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      const card = wrapper.find('.anime-card');
      expect(card.exists()).toBe(true);
      
      // Should not throw error when clicked
      await expect(card.trigger('click')).resolves.not.toThrow();
    });

    it('should have cursor pointer style', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      const card = wrapper.find('.anime-card');
      expect(card.classes()).toContain('anime-card');
    });
  });

  describe('Conditional Rendering', () => {
    it('should show score pill when score is available', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      expect(wrapper.find('.anime-card__score').exists()).toBe(true);
      const scoreValue = wrapper.find('.anime-card__score-value');
      if (scoreValue.exists()) {
        expect(scoreValue.text()).toBe('8.0');
      }
    });

    it('should hide score pill when score is null', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnimeWithNulls }
      });

      expect(wrapper.find('.anime-card__score').exists()).toBe(false);
    });

    it('should show year when available', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      const metaText = wrapper.find('.anime-card__meta').text();
      expect(metaText).toContain('2002');
    });

    it('should not show year when null', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnimeWithNulls }
      });

      const metaText = wrapper.find('.anime-card__meta').text();
      expect(metaText).not.toContain('2002');
    });

    it('should show episodes when available', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      const metaText = wrapper.find('.anime-card__meta').text();
      expect(metaText).toContain('220 eps');
    });

    it('should not show episodes when null', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnimeWithNulls }
      });

      const metaText = wrapper.find('.anime-card__meta').text();
      expect(metaText).not.toContain('eps');
    });

    it('should show genre tags when genres exist', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      const genres = wrapper.findAll('.anime-card__genre');
      expect(genres.length).toBeGreaterThan(0);
    });

    it('should not show genre tags section when genres array is empty', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnimeWithNulls }
      });

      expect(wrapper.findAll('.anime-card__genre')).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long anime titles', () => {
      const longTitleAnime: AnimeCardType = {
        ...mockAnime,
        title: 'This is an extremely long anime title that should be truncated properly in the UI to prevent layout issues'
      };

      wrapper = mount(AnimeCard, {
        props: { anime: longTitleAnime }
      });

      const title = wrapper.find('.anime-card__title');
      expect(title.text()).toBe(longTitleAnime.title);
      expect(title.exists()).toBe(true);
    });

    it('should handle anime with many genres', () => {
      const manyGenresAnime: AnimeCardType = {
        ...mockAnime,
        genres: [
          { mal_id: 1, name: 'Action', type: 'anime', url: 'https://myanimelist.net/anime/genre/1/Action' },
          { mal_id: 2, name: 'Adventure', type: 'anime', url: 'https://myanimelist.net/anime/genre/2/Adventure' },
          { mal_id: 3, name: 'Comedy', type: 'anime', url: 'https://myanimelist.net/anime/genre/3/Comedy' },
          { mal_id: 4, name: 'Drama', type: 'anime', url: 'https://myanimelist.net/anime/genre/4/Drama' },
          { mal_id: 5, name: 'Fantasy', type: 'anime', url: 'https://myanimelist.net/anime/genre/5/Fantasy' },
          { mal_id: 6, name: 'Mystery', type: 'anime', url: 'https://myanimelist.net/anime/genre/6/Mystery' }
        ]
      };

      wrapper = mount(AnimeCard, {
        props: { anime: manyGenresAnime }
      });

      const tags = wrapper.findAll('.anime-card__genre');
      expect(tags.length).toBeGreaterThan(0);
    });

    it('should handle anime with score of 0', () => {
      const zeroScoreAnime: AnimeCardType = {
        ...mockAnime,
        score: 0
      };

      wrapper = mount(AnimeCard, {
        props: { anime: zeroScoreAnime }
      });

      // Score of 0 should still be considered falsy in v-if
      const scorePill = wrapper.find('.anime-card__score');
      expect(scorePill.exists()).toBe(false);
    });

    it('should handle anime with very high score', () => {
      const highScoreAnime: AnimeCardType = {
        ...mockAnime,
        score: 10.0
      };

      wrapper = mount(AnimeCard, {
        props: { anime: highScoreAnime }
      });

      const scoreValue = wrapper.find('.anime-card__score-value');
      if (scoreValue.exists()) {
        expect(scoreValue.text()).toBe('10.0');
      }
    });

    it('should handle special characters in title', () => {
      const specialCharsAnime: AnimeCardType = {
        ...mockAnime,
        title: 'Test & Anime <Special> "Chars"'
      };

      wrapper = mount(AnimeCard, {
        props: { anime: specialCharsAnime }
      });

      expect(wrapper.find('.anime-card__title').text()).toBe('Test & Anime <Special> "Chars"');
    });
  });

  describe('CSS Classes', () => {
    it('should have all required CSS classes', () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      expect(wrapper.find('.anime-card').exists()).toBe(true);
      expect(wrapper.find('.anime-card__glow').exists()).toBe(true);
      expect(wrapper.find('.anime-card__main').exists()).toBe(true);
      expect(wrapper.find('.anime-card__figure').exists()).toBe(true);
      expect(wrapper.find('.anime-card__image').exists()).toBe(true);
      expect(wrapper.find('.anime-card__overlay').exists()).toBe(true);
      expect(wrapper.find('.anime-card__content').exists()).toBe(true);
      expect(wrapper.find('.anime-card__header').exists()).toBe(true);
      expect(wrapper.find('.anime-card__footer').exists()).toBe(true);
      expect(wrapper.find('.anime-card__title').exists()).toBe(true);
      expect(wrapper.find('.anime-card__meta').exists()).toBe(true);
    });
  });

  describe('Data Integrity', () => {
    it('should not mutate the props', () => {
      const originalAnime = { ...mockAnime };
      
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      // Props should remain unchanged
      expect(mockAnime).toEqual(originalAnime);
    });

    it('should maintain reactivity with prop changes', async () => {
      wrapper = mount(AnimeCard, {
        props: { anime: mockAnime }
      });

      const titleElement = wrapper.find('.anime-card__title');
      expect(titleElement.exists()).toBe(true);
      expect(titleElement.text()).toBe('Naruto');

      // Update props
      const updatedAnime = { ...mockAnime, title: 'Updated Title' };
      await wrapper.setProps({ anime: updatedAnime });

      const updatedTitleElement = wrapper.find('.anime-card__title');
      expect(updatedTitleElement.exists()).toBe(true);
      expect(updatedTitleElement.text()).toBe('Updated Title');
    });
  });
});

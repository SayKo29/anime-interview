/**
 * Tests for useJikanApi Composable
 * 
 * Tests cover:
 * - Successful API calls
 * - Error handling
 * - Rate limiting integration
 * - Response transformation
 * - Network failures
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useJikanApi } from '@/composables/useJikanApi';
import { createMockJikanAnime } from '../helpers/anime-mocks';
import type { JikanAnimeListResponse } from '@/types/jikan.types';

// Define useRuntimeConfig as a global mock
(globalThis as any).useRuntimeConfig = vi.fn(() => ({
  public: {
    jikanApiBase: 'https://api.jikan.moe/v4'
  }
}));

// Mock dependencies BEFORE importing the composable
vi.mock('@/utils/rate-limit', () => ({
  fetchWithRetry: vi.fn(),
  waitForRateLimit: vi.fn(),
  MIN_REQUEST_DELAY: 500,
  RATE_LIMIT_DELAY: 2000,
  MAX_RETRIES: 3
}));

vi.mock('@/utils/api-error-handler', () => ({
  handleApiError: vi.fn((error) => error)
}));

describe('useJikanApi', () => {
  const mockSuccessResponse: JikanAnimeListResponse = {
    data: [
      createMockJikanAnime({
        mal_id: 20,
        title: 'Naruto',
        type: 'TV',
        episodes: 220,
        year: 2002,
        score: 8.02
      })
    ],
    pagination: {
      last_visible_page: 10,
      has_next_page: true,
      current_page: 1,
      items: {
        count: 24,
        total: 240,
        per_page: 24
      }
    }
  };

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAnimeList', () => {
    it('should fetch anime list successfully', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      vi.mocked(fetchWithRetry).mockResolvedValueOnce(mockSuccessResponse);

      const { getAnimeList } = useJikanApi();
      const result = await getAnimeList(1, 24);

      expect(fetchWithRetry).toHaveBeenCalledWith(
        'https://api.jikan.moe/v4/anime?limit=24&page=1'
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it('should handle different page numbers', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      vi.mocked(fetchWithRetry).mockResolvedValueOnce(mockSuccessResponse);

      const { getAnimeList } = useJikanApi();
      await getAnimeList(5, 24);

      expect(fetchWithRetry).toHaveBeenCalledWith(
        'https://api.jikan.moe/v4/anime?limit=24&page=5'
      );
    });

    it('should handle different limit values', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      vi.mocked(fetchWithRetry).mockResolvedValueOnce(mockSuccessResponse);

      const { getAnimeList } = useJikanApi();
      await getAnimeList(1, 12);

      expect(fetchWithRetry).toHaveBeenCalledWith(
        'https://api.jikan.moe/v4/anime?limit=12&page=1'
      );
    });

    it('should use default page value of 1', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      vi.mocked(fetchWithRetry).mockResolvedValueOnce(mockSuccessResponse);

      const { getAnimeList } = useJikanApi();
      await getAnimeList();

      expect(fetchWithRetry).toHaveBeenCalledWith(
        expect.stringContaining('page=1')
      );
    });

    it('should use default limit value of 24', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      vi.mocked(fetchWithRetry).mockResolvedValueOnce(mockSuccessResponse);

      const { getAnimeList } = useJikanApi();
      await getAnimeList(1);

      expect(fetchWithRetry).toHaveBeenCalledWith(
        expect.stringContaining('limit=24')
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      const networkError = new Error('Network error');
      vi.mocked(fetchWithRetry).mockRejectedValueOnce(networkError);

      const { getAnimeList } = useJikanApi();

      await expect(getAnimeList(1, 24)).rejects.toThrow('Network error');
    });

    it('should handle 404 errors', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      const notFoundError = new Error('404 Not Found');
      vi.mocked(fetchWithRetry).mockRejectedValueOnce(notFoundError);

      const { getAnimeList } = useJikanApi();

      await expect(getAnimeList(999, 24)).rejects.toThrow('404 Not Found');
    });

    it('should handle 429 rate limit errors', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      const rateLimitError = new Error('429 Too Many Requests');
      vi.mocked(fetchWithRetry).mockRejectedValueOnce(rateLimitError);

      const { getAnimeList } = useJikanApi();

      await expect(getAnimeList(1, 24)).rejects.toThrow('429 Too Many Requests');
    });

    it('should handle 500 server errors', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      const serverError = new Error('500 Internal Server Error');
      vi.mocked(fetchWithRetry).mockRejectedValueOnce(serverError);

      const { getAnimeList } = useJikanApi();

      await expect(getAnimeList(1, 24)).rejects.toThrow('500 Internal Server Error');
    });
  });

  describe('Response Validation', () => {
    it('should return response with data array', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      vi.mocked(fetchWithRetry).mockResolvedValueOnce(mockSuccessResponse);

      const { getAnimeList } = useJikanApi();
      const result = await getAnimeList(1, 24);

      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should return response with pagination info', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      vi.mocked(fetchWithRetry).mockResolvedValueOnce(mockSuccessResponse);

      const { getAnimeList } = useJikanApi();
      const result = await getAnimeList(1, 24);

      expect(result.pagination).toBeDefined();
      expect(result.pagination.current_page).toBe(1);
      expect(result.pagination.has_next_page).toBe(true);
      expect(result.pagination.last_visible_page).toBe(10);
    });

    it('should handle empty data array', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      const emptyResponse: JikanAnimeListResponse = {
        data: [],
        pagination: {
          last_visible_page: 1,
          has_next_page: false,
          current_page: 1,
          items: {
            count: 0,
            total: 0,
            per_page: 24
          }
        }
      };
      vi.mocked(fetchWithRetry).mockResolvedValueOnce(emptyResponse);

      const { getAnimeList } = useJikanApi();
      const result = await getAnimeList(999, 24);

      expect(result.data).toEqual([]);
      expect(result.pagination.has_next_page).toBe(false);
    });
  });

  describe('URL Construction', () => {
    it('should construct correct API URL', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      vi.mocked(fetchWithRetry).mockResolvedValueOnce(mockSuccessResponse);

      const { getAnimeList } = useJikanApi();
      await getAnimeList(3, 12);

      const expectedUrl = 'https://api.jikan.moe/v4/anime?limit=12&page=3';
      expect(fetchWithRetry).toHaveBeenCalledWith(expectedUrl);
    });

    it('should use runtime config for base URL', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      vi.mocked(fetchWithRetry).mockResolvedValueOnce(mockSuccessResponse);

      const { getAnimeList } = useJikanApi();
      await getAnimeList(1, 24);

      expect(fetchWithRetry).toHaveBeenCalledWith(
        expect.stringContaining('https://api.jikan.moe/v4')
      );
    });
  });

  describe('Integration with Rate Limiting', () => {
    it('should call fetchWithRetry which handles rate limiting', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      vi.mocked(fetchWithRetry).mockResolvedValueOnce(mockSuccessResponse);

      const { getAnimeList } = useJikanApi();
      await getAnimeList(1, 24);

      expect(fetchWithRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle multiple concurrent requests', async () => {
      const { fetchWithRetry } = await import('@/utils/rate-limit');
      vi.mocked(fetchWithRetry).mockResolvedValue(mockSuccessResponse);

      const { getAnimeList } = useJikanApi();
      
      const requests = [
        getAnimeList(1, 24),
        getAnimeList(2, 24),
        getAnimeList(3, 24)
      ];

      const results = await Promise.all(requests);

      expect(results).toHaveLength(3);
      expect(fetchWithRetry).toHaveBeenCalledTimes(3);
    });
  });
});

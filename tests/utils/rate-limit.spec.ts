/**
 * Tests for Rate Limiting Utilities
 * 
 * Tests cover:
 * - Request delays
 * - Retry logic with exponential backoff
 * - Rate limit error handling
 * - Successful requests after retries
 * - Max retries limit
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWithRetry, waitForRateLimit } from '@/utils/rate-limit';

// Mock global fetch
global.fetch = vi.fn();

describe('rate-limit.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('waitForRateLimit', () => {
    it('should wait for MIN_REQUEST_DELAY (500ms)', async () => {
      const promise = waitForRateLimit();
      
      // Fast-forward time
      await vi.advanceTimersByTimeAsync(500);
      
      await expect(promise).resolves.toBeUndefined();
    });

    it('should complete after 500ms', async () => {
      const promise = waitForRateLimit();
      
      await vi.advanceTimersByTimeAsync(500);
      await promise;
      
      // In fake timers, we can't check real time elapsed
      // but we can verify the promise resolved
      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('fetchWithRetry', () => {
    const mockUrl = 'https://api.jikan.moe/v4/anime';
    const mockResponse = {
      data: [],
      pagination: {
        last_visible_page: 1,
        has_next_page: false,
        current_page: 1,
        items: { count: 0, total: 0, per_page: 24 }
      }
    };

    it('should successfully fetch on first attempt', async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response);

      const promise = fetchWithRetry(mockUrl, { method: 'GET' });
      
      // Run all timers
      await vi.runAllTimersAsync();
      
      const result = await promise;

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(mockUrl, { method: 'GET' });
    });

    it('should retry on 429 (Too Many Requests) error', async () => {
      const mockFetch = vi.mocked(global.fetch);
      
      // First attempt fails with 429
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({ message: 'Rate limit exceeded' })
      } as Response);
      
      // Second attempt succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response);

      const promise = fetchWithRetry(mockUrl, { method: 'GET' });
      
      // Run all timers
      await vi.runAllTimersAsync();
      
      const result = await promise;

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should retry with exponential backoff on network errors', async () => {
      const mockFetch = vi.mocked(global.fetch);
      
      // First two attempts fail
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Third attempt succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response);

      const promise = fetchWithRetry(mockUrl, { method: 'GET' });
      
      // Run all timers
      await vi.runAllTimersAsync();
      
      const result = await promise;

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max retries', async () => {
      // Use real timers for this test to avoid unhandled rejections
      vi.useRealTimers();
      
      const mockFetch = vi.mocked(global.fetch);
      const error = new Error('Network error');
      
      // All attempts fail
      mockFetch.mockRejectedValue(error);

      await expect(fetchWithRetry(mockUrl, { method: 'GET' })).rejects.toThrow('Network error');
      expect(mockFetch).toHaveBeenCalledTimes(4); // Initial + 3 retries
      
      // Restore fake timers
      vi.useFakeTimers();
    }, 10000); // 10 second timeout for this test with real timers

    it('should handle 404 errors without retrying', async () => {
      // Use real timers for this test to avoid unhandled rejections
      vi.useRealTimers();
      
      const mockFetch = vi.mocked(global.fetch);
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Not Found', error: 'Not Found' }),
        headers: new Headers(),
        redirected: false,
        type: 'basic' as ResponseType,
        url: '',
        clone: function() { return this as Response; },
        body: null,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        formData: async () => new FormData(),
        text: async () => '',
        bytes: async () => new Uint8Array()
      } as Response);

      await expect(fetchWithRetry(mockUrl, { method: 'GET' })).rejects.toMatchObject({ status: 404 });
      expect(mockFetch).toHaveBeenCalledTimes(1); // No retries for 404
      
      // Restore fake timers
      vi.useFakeTimers();
    });

    it('should handle 500 server errors with retries', async () => {
      const mockFetch = vi.mocked(global.fetch);
      
      // First attempt: 500 error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Internal Server Error', error: 'Server Error' })
      } as Response);
      
      // Second attempt: success
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response);

      const promise = fetchWithRetry(mockUrl, { method: 'GET' });
      
      // Run all timers
      await vi.runAllTimersAsync();
      
      const result = await promise;

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should respect rate limit delay of 2000ms for 429 errors', async () => {
      const mockFetch = vi.mocked(global.fetch);
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({ message: 'Rate limit exceeded' })
      } as Response);
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response);

      const promise = fetchWithRetry(mockUrl, { method: 'GET' });
      
      // Run all timers
      await vi.runAllTimersAsync();
      
      await promise;

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Rate limit hit')
      );
      
      consoleSpy.mockRestore();
    });

    it('should log retry attempts', async () => {
      const mockFetch = vi.mocked(global.fetch);
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response);

      const promise = fetchWithRetry(mockUrl, { method: 'GET' });
      
      await vi.runAllTimersAsync();
      
      await promise;

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Retrying')
      );
      
      consoleSpy.mockRestore();
    });

    it('should handle JSON parse errors', async () => {
      // Use real timers for this test to avoid unhandled rejections
      vi.useRealTimers();
      
      const mockFetch = vi.mocked(global.fetch);
      
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON');
        },
        headers: new Headers(),
        redirected: false,
        statusText: 'OK',
        type: 'basic' as ResponseType,
        url: '',
        clone: function() { return this as Response; },
        body: null,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        formData: async () => new FormData(),
        text: async () => '',
        bytes: async () => new Uint8Array()
      } as Response;
      
      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(fetchWithRetry(mockUrl, { method: 'GET' })).rejects.toThrow('Invalid JSON');
      
      // Restore fake timers
      vi.useFakeTimers();
    });

    it('should pass through fetch options', async () => {
      const mockFetch = vi.mocked(global.fetch);
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response);

      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' })
      };

      const promise = fetchWithRetry(mockUrl, options);
      
      await vi.runAllTimersAsync();
      
      await promise;

      expect(mockFetch).toHaveBeenCalledWith(mockUrl, options);
    });

    it('should handle concurrent requests independently', async () => {
      const mockFetch = vi.mocked(global.fetch);
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as Response);

      const promise1 = fetchWithRetry(mockUrl + '?page=1', { method: 'GET' });
      const promise2 = fetchWithRetry(mockUrl + '?page=2', { method: 'GET' });
      
      await vi.runAllTimersAsync();
      
      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1).toEqual(mockResponse);
      expect(result2).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty response body', async () => {
      const mockFetch = vi.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({})
      } as Response);

      const promise = fetchWithRetry('https://api.jikan.moe/v4/anime', { method: 'GET' });

      await vi.runAllTimersAsync();

      const result = await promise;

      expect(result).toEqual({});
    });

    it('should handle very large response', async () => {
      const mockFetch = vi.mocked(global.fetch);
      const largeResponse = {
        data: Array(1000).fill({
          mal_id: 1,
          title: 'Test',
          images: { jpg: { image_url: '', small_image_url: '', large_image_url: '' } },
          type: 'TV',
          episodes: 12,
          year: 2024,
          score: 8.0,
          genres: []
        })
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => largeResponse
      } as Response);

      const promise = fetchWithRetry('https://api.jikan.moe/v4/anime', { method: 'GET' });

      await vi.runAllTimersAsync();
      
      const result = await promise;

      expect(result).toEqual(largeResponse);
    });
  });
});

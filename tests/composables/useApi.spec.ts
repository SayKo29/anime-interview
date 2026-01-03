/**
 * Tests for useApi composable
 * Tests the unified API client for Jikan API
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApi } from '~/composables/useApi';

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      jikanApiBase: 'https://api.jikan.moe/v4'
    }
  }),
  useFetch: vi.fn(),
  useAsyncData: vi.fn(),
  useNuxtApp: () => ({
    payload: { data: {} },
    static: { data: {} }
  }),
  $fetch: vi.fn(),
}));

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide all API methods', () => {
    const api = useApi();
    
    expect(api.getAnimeList).toBeDefined();
    expect(api.getAnimeDetail).toBeDefined();
    expect(api.getAnimeEpisodes).toBeDefined();
    expect(api.getEpisodeDetail).toBeDefined();
  });

  it('should return functions', () => {
    const api = useApi();
    
    expect(typeof api.getAnimeList).toBe('function');
    expect(typeof api.getAnimeDetail).toBe('function');
    expect(typeof api.getAnimeEpisodes).toBe('function');
    expect(typeof api.getEpisodeDetail).toBe('function');
  });
});

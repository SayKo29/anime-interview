/**
 * Global configuration for Vitest tests
 */

import { vi } from 'vitest';

// Mock Nuxt composables that are not available in test environment
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      jikanApiBase: 'https://api.jikan.moe/v4'
    }
  }),
  useState: (key: string, init: () => unknown) => {
    const state = init();
    return {
      value: state
    };
  },
  navigateTo: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn()
  }),
  useRoute: () => ({
    params: {},
    query: {},
    path: '/'
  })
}));

// Mock useViewTransition composable
vi.mock('@/composables/useViewTransition', () => ({
  useViewTransition: () => ({
    navigate: vi.fn(),
    supportsViewTransitions: () => false
  })
}));

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// Mock IntersectionObserver for infinite scroll
(globalThis as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

/**
 * Global constants for the application
 */

// Pagination
export const ITEMS_PER_PAGE = 24;
export const INITIAL_PAGE = 1;

// Infinite Scroll
export const SCROLL_ROOT_MARGIN = '100px';
export const SCROLL_THRESHOLD = 0.1;

// Loading States
export const SKELETON_CARDS_COUNT = 24;

// Animations
export const PAGE_TRANSITION_DURATION = 300;
export const HOVER_TRANSITION_DURATION = 400;

// Rate Limiting (for display purposes - actual rate limiting is in utils/rate-limit.ts)
export const MIN_REQUEST_DELAY_MS = 500;
export const RATE_LIMIT_DELAY_MS = 2000;
export const MAX_API_RETRIES = 3;

// Breakpoints (should match CSS)
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
  largeDesktop: 1440
} as const;

// Anime Card Sizes
export const CARD_ASPECT_RATIO = 2 / 3;
export const CARD_MIN_HEIGHT = 380;

// Hero Section
export const HERO_HEIGHT_VH = 70;
export const HERO_MIN_HEIGHT = 550;

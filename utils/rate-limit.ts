/**
 * Utility for handling Jikan API rate limiting
 * Jikan API has strict request limits
 */

// Minimum time between requests (in ms)
const MIN_REQUEST_DELAY = 500;

// Wait time after receiving a 429 (in ms)
const RATE_LIMIT_DELAY = 2000;

// Maximum number of retries
const MAX_RETRIES = 3;

// Last time a request was made
let lastRequestTime = 0;

/**
 * Waits the necessary time to respect rate limiting
 */
export async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_DELAY) {
    const delay = MIN_REQUEST_DELAY - timeSinceLastRequest;
    await sleep(delay);
  }
  
  lastRequestTime = Date.now();
}

/**
 * Performs a fetch with automatic retries in case of rate limit
 */
export async function fetchWithRetry<T>(
  url: string,
  options?: RequestInit,
  retries = MAX_RETRIES
): Promise<T> {
  await waitForRateLimit();
  
  try {
    const response = await fetch(url, options);
    
    // If rate limited, wait and retry
    if (response.status === 429 && retries > 0) {
      await sleep(RATE_LIMIT_DELAY);
      return fetchWithRetry<T>(url, options, retries - 1);
    }
    
    // If another error, throw
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.message || response.statusText,
        type: errorData.type || 'api_error',
        error: errorData.error || response.statusText
      };
    }
    
    return await response.json();
  } catch (error) {
    // If it was a 429 error and retries remain
    if (isRateLimitError(error) && retries > 0) {
      await sleep(RATE_LIMIT_DELAY);
      return fetchWithRetry<T>(url, options, retries - 1);
    }
    
    throw error;
  }
}

/**
 * Helper function to sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Checks if the error is a rate limit error
 */
function isRateLimitError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status: number }).status === 429
  );
}

/**
 * Resets the rate limit timer (useful for testing)
 */
export function resetRateLimitTimer(): void {
  lastRequestTime = 0;
}

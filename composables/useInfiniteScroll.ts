/**
 * Composable for infinite scroll using Intersection Observer API
 * Provides a clean, reusable way to implement infinite scrolling
 */

import { ref, onMounted, onUnmounted, nextTick, type Ref } from 'vue';
import { SCROLL_ROOT_MARGIN, SCROLL_THRESHOLD } from '~/constants';

export const useInfiniteScroll = (
  callback: () => void,
  targetRef?: Ref<HTMLElement | null>
) => {
  const observer = ref<IntersectionObserver | null>(null);
  const target = targetRef || ref<HTMLElement | null>(null);

  /**
   * Initializes the Intersection Observer
   * Uses IntersectionObserver for better performance than scroll events
   */
  const observe = () => {
    // Skip on server-side
    if (import.meta.server) return;
    if (!target.value) return;

    observer.value = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          callback();
        }
      },
      {
        rootMargin: SCROLL_ROOT_MARGIN,
        threshold: SCROLL_THRESHOLD
      }
    );

    observer.value.observe(target.value);
  };

  /**
   * Disconnects and cleans up the observer
   */
  const disconnect = () => {
    if (observer.value) {
      observer.value.disconnect();
      observer.value = null;
    }
  };

  // Initialize observer after DOM is ready
  onMounted(async () => {
    await nextTick();
    observe();
  });

  // Cleanup on component unmount
  onUnmounted(disconnect);

  return {
    target,
    disconnect,
  };
};

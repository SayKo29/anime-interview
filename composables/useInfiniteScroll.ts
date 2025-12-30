/**
 * Composable for infinite scroll using Intersection Observer API
 */

import type { Ref } from 'vue';
import { SCROLL_ROOT_MARGIN, SCROLL_THRESHOLD } from '~/constants';

export const useInfiniteScroll = (
  callback: () => void,
  targetRef?: Ref<HTMLElement | null>
) => {
  const observer = ref<IntersectionObserver | null>(null);
  const target = targetRef || ref<HTMLElement | null>(null);

  /**
   * Initializes the Intersection Observer
   */
  const observe = () => {
    if (import.meta.server) return;
    if (!target.value) return;

    observer.value = new IntersectionObserver(
      (entries) => {
        // When the target element is visible, trigger the callback
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
   * Disconnects the observer
   */
  const disconnect = () => {
    if (observer.value) {
      observer.value.disconnect();
      observer.value = null;
    }
  };

  // Setup observer on mount and cleanup on unmount
  onMounted(() => {
    // Small delay to ensure DOM is ready
    setTimeout(observe, 100);
  });

  onUnmounted(disconnect);

  return {
    target
  };
};

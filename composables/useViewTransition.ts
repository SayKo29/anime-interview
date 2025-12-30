/**
 * Composable for View Transitions API
 * Provides smooth animations between page navigations
 */

export const useViewTransition = () => {
  /**
   * Checks if the browser supports View Transitions API
   */
  const supportsViewTransitions = (): boolean => {
    if (import.meta.server) return false;
    return 'startViewTransition' in document;
  };

  /**
   * Navigates to a route with view transition if supported
   * @param to - Target route path
   */
  const navigate = async (to: string) => {
    if (!supportsViewTransitions()) {
      await navigateTo(to);
      return;
    }

    // @ts-ignore - View Transitions API is not yet in TypeScript types
    document.startViewTransition(async () => {
      await navigateTo(to);
    });
  };

  return {
    navigate,
    supportsViewTransitions
  };
};

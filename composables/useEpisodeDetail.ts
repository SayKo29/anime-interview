/**
 * Composable for fetching full episode details
 */
import type { JikanEpisodeDetailResponse } from '~/types/jikan.types';

export const useEpisodeDetail = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.jikanApiBase;

  const getEpisodeDetail = async (animeId: string | number, episodeId: number) => {
    const { data, error } = await useFetch<JikanEpisodeDetailResponse>(
      `/anime/${animeId}/episodes/${episodeId}`,
      {
        baseURL,
        key: `episode-${animeId}-${episodeId}`,
        getCachedData: (key) => {
          const nuxtApp = useNuxtApp();
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        }
      }
    );

    if (error.value) {
      throw new Error(error.value.message || 'Error fetching episode detail');
    }

    return data.value?.data || null;
  };

  return {
    getEpisodeDetail
  };
};

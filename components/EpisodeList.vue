<template lang="pug">
section.episode-list
  .episode-list__header
    h2.episode-list__title
      svg.episode-list__icon(
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      )
        path(
          d="M7 4V20M17 4V20M3 8H7M17 8H21M3 12H21M3 16H7M17 16H21M7 20H17"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        )
      | Episodes
      span.episode-list__count(v-if="episodes.length") {{ episodes.length }}
  
  .episode-list__content(v-if="!loading && episodes.length")
    TransitionGroup(
      name="episode"
      tag="div"
      class="episode-list__grid"
    )
      EpisodeItem(
        v-for="episode in episodes"
        :key="episode.mal_id"
        :episode="episode"
        @click="handleEpisodeClick"
      )
  
  .episode-list__loading(v-if="loading")
    .episode-list__spinner
    p Loading episodes...
  
  .episode-list__empty(v-if="!loading && !episodes.length")
    svg.episode-list__empty-icon(
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    )
      circle(
        cx="32"
        cy="32"
        r="30"
        stroke="currentColor"
        stroke-width="2"
        opacity="0.2"
      )
      path(
        d="M32 20V32L40 40"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        opacity="0.5"
      )
    p.episode-list__empty-text No episodes available
</template>

<script setup lang="ts">
import type { JikanEpisode } from '~/types/jikan.types';
import EpisodeItem from './EpisodeItem.vue';

interface Props {
  episodes: JikanEpisode[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<{
  episodeClick: [episode: JikanEpisode];
}>();

const handleEpisodeClick = (episode: JikanEpisode) => {
  emit('episodeClick', episode);
};
</script>

<style lang="scss" scoped>
.episode-list {
  width: 100%;
  
  @include element(header) {
    margin-bottom: $spacing-2xl;
  }
  
  @include element(title) {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    font-size: $font-size-2xl;
    font-weight: $font-weight-black;
    color: $color-text-primary;
    margin: 0;
    
    background: linear-gradient(135deg, $color-text-primary, $color-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @include element(icon) {
    color: $color-primary;
    animation: pulse 2s ease-in-out infinite;
  }
  
  @include element(count) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 32px;
    padding: 0 $spacing-md;
    background: rgba($color-primary, 0.1);
    border-radius: $radius-full;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-primary;
  }
  
  @include element(content) {
    width: 100%;
  }
  
  @include element(grid) {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }
  
  @include element(loading) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-4xl;
    gap: $spacing-lg;
    color: $color-text-secondary;
  }
  
  @include element(spinner) {
    width: 48px;
    height: 48px;
    border: 4px solid rgba($color-primary, 0.1);
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @include element(empty) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-4xl;
    gap: $spacing-xl;
    color: $color-text-secondary;
  }
  
  @include element(empty-icon) {
    opacity: 0.3;
  }
  
  @include element(empty-text) {
    font-size: $font-size-lg;
    margin: 0;
  }
  
  @include mobile {
    @include element(title) {
      font-size: $font-size-xl;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.episode-enter-active,
.episode-leave-active {
  transition: all 0.3s ease;
}

.episode-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.episode-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.episode-move {
  transition: transform 0.3s ease;
}
</style>

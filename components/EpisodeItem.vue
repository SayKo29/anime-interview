<template lang="pug">
article.episode-item(
  :class="{ 'episode-item--filler': episode.filler }"
  @click="handleClick"
)
  .episode-item__number
    span.episode-item__number-label EP
    span.episode-item__number-value {{ episode.mal_id }}
  
  .episode-item__content
    h3.episode-item__title {{ episode.title || `Episode ${episode.mal_id}` }}
    
    .episode-item__meta
      time.episode-item__date(
        v-if="episode.aired"
        :datetime="episode.aired"
      ) {{ formatDate(episode.aired) }}
      
      span.episode-item__badge(v-if="episode.filler") Filler
      span.episode-item__badge(v-if="episode.recap") Recap
  
  .episode-item__action
    svg(
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    )
      circle(
        cx="10"
        cy="10"
        r="8"
        stroke="currentColor"
        stroke-width="1.5"
      )
      path(
        d="M10 7V10M10 13H10.01"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      )
</template>

<script setup lang="ts">
import type { JikanEpisode } from '~/types/jikan.types';

interface Props {
  episode: JikanEpisode;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  click: [episode: JikanEpisode];
}>();

const handleClick = () => {
  emit('click', props.episode);
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};
</script>

<style lang="scss" scoped>
.episode-item {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  padding: $spacing-lg $spacing-xl;
  background: $color-bg-secondary;
  border: 1px solid rgba($color-primary, 0.1);
  border-radius: $radius-lg;
  cursor: pointer;
  transition: all $transition-medium;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(180deg, $color-primary, $color-secondary);
    opacity: 0;
    transition: opacity $transition-medium;
  }
  
  &:hover {
    transform: translateX(8px);
    border-color: rgba($color-primary, 0.3);
    background: rgba($color-primary, 0.05);
    box-shadow: $shadow-md, 0 0 30px rgba($color-primary, 0.1);
    
    &::before {
      opacity: 1;
    }
    
    .episode-item__action {
      transform: scale(1.1);
      color: $color-primary;
    }
  }
  
  &--filler {
    opacity: 0.7;
    
    .episode-item__number {
      background: rgba($color-text-secondary, 0.1);
    }
  }
  
  @include element(number) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 60px;
    height: 60px;
    background: rgba($color-primary, 0.1);
    border-radius: $radius-md;
    gap: $spacing-xxs;
    flex-shrink: 0;
  }
    
  @include element(number-label) {
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    color: $color-text-secondary;
    letter-spacing: 1px;
  }
    
  @include element(number-value) {
    font-size: $font-size-xl;
    font-weight: $font-weight-black;
    color: $color-primary;
    line-height: 1;
  }
  
  @include element(content) {
    flex: 1;
    min-width: 0;
  }
  
  @include element(title) {
    font-size: $font-size-md;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    margin: 0 0 $spacing-xs;
    @include truncate-text(1);
  }
  
  @include element(meta) {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    flex-wrap: wrap;
  }
  
  @include element(date) {
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }
  
  @include element(badge) {
    padding: $spacing-xxs $spacing-sm;
    background: rgba($color-accent, 0.2);
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    color: $color-accent;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  @include element(action) {
    color: $color-text-secondary;
    transition: all $transition-medium;
    flex-shrink: 0;
  }
  
  @include mobile {
    padding: $spacing-md;
    gap: $spacing-md;
    
    @include element(number) {
      min-width: 50px;
      height: 50px;
    }
      
    @include element(number-value) {
      font-size: $font-size-lg;
    }
    
    @include element(title) {
      font-size: $font-size-sm;
    }
  }
}
</style>

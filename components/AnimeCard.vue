<template lang="pug">
article.anime-card(
  @click="handleClick"
  :style="{ '--card-bg': `url(${anime.imageUrl})` }"
  role="button"
  tabindex="0"
  @keydown.enter="handleClick"
  @keydown.space.prevent="handleClick"
)
  .anime-card__glow(aria-hidden="true")
  .anime-card__main
    figure.anime-card__figure
      img.anime-card__image(
        :src="anime.imageUrl"
        :srcset="`${anime.imageUrlSmall} 480w, ${anime.imageUrl} 800w`"
        :alt="`Poster de ${anime.title}`"
        :class="{ 'is-active': activeAnime === anime.id }"
        loading="lazy"
      )
    .anime-card__overlay(aria-hidden="true")
    .anime-card__content
      header.anime-card__header
        .anime-card__score(v-if="anime.score")
          span.anime-card__score-icon(aria-hidden="true") ★
          span.anime-card__score-value {{ anime.score.toFixed(1) }}
      footer.anime-card__footer
        h3.anime-card__title(
          :class="{ 'is-active': activeAnime === anime.id }"
        ) {{ anime.title }}
        .anime-card__details
          .anime-card__meta
            span.anime-card__meta-item.anime-card__meta-item--year {{ anime.year || 'N/A' }}
            span.anime-card__meta-separator(aria-hidden="true") •
            span.anime-card__meta-item.anime-card__meta-item--type {{ anime.type }}
            template(v-if="anime.episodes")
              span.anime-card__meta-separator(aria-hidden="true") •
              span.anime-card__meta-item {{ anime.episodes }} eps
          .anime-card__genres(v-if="anime.genres && anime.genres.length")
            span.anime-card__genre(
              v-for="genre in anime.genres.slice(0, 3)"
              :key="genre.mal_id"
            ) {{ genre.name }}
</template>

<script setup lang="ts">
import type { AnimeCard } from '~/types/anime.types';

interface Props {
  anime: AnimeCard;
}

const props = defineProps<Props>();

// Shared state for tracking active anime during View Transition
const activeAnime = useState<number | null>('activeAnime', () => null);

const handleClick = () => {
  activeAnime.value = props.anime.id;
  navigateTo(`/anime/${props.anime.id}`);
};
</script>

<style lang="scss" scoped>
.anime-card {
  position: relative;
  aspect-ratio: 2 / 3;
  border-radius: $radius-xl;
  overflow: visible;
  cursor: pointer;
  transition: transform $transition-medium $ease-card-hover, 
              box-shadow $transition-medium $ease-out;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: $shadow-card;
  contain: layout;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: $shadow-card-hover;

      .anime-card__glow {
        opacity: 0.7;
        transform: scale(1.1);
        filter: blur(50px) saturate(2) brightness(1.5);
      }

      .anime-card__image {
        transform: scale(1.15);
      }

      .anime-card__overlay {
        opacity: 1;
      }

      .anime-card__footer {
        transform: translateY(-4px);
      }

      .anime-card__details {
        max-height: 150px;
        opacity: 1;
      }

      .anime-card__genres {
        max-height: 100px;
        opacity: 1;
      }
    }
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: 2px solid $color-primary;
    outline-offset: 4px;
  }

  &__glow {
    position: absolute;
    inset: -5%;
    border-radius: $radius-2xl;
    background-image: var(--card-bg);
    background-size: cover;
    background-position: center;
    filter: blur(40px) saturate(1.8) brightness(1.3);
    opacity: 0;
    transform: scale(0.95);
    transition: opacity $transition-medium $ease-out, 
                transform $transition-medium $ease-out, 
                filter $transition-medium $ease-out;
    z-index: $z-index-hide;
    pointer-events: none;
  }

  &__main {
    position: absolute;
    inset: 0;
    border-radius: $radius-xl;
    overflow: hidden;
    transition: transform $transition-medium $ease-card-hover;
  }

  &__figure {
    position: absolute;
    inset: 0;
    overflow: hidden;
    margin: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.6s $ease-card-hover;
    
    // Only the clicked anime has view-transition-name for smooth navigation
    &.is-active {
      view-transition-name: selected-anime-image;
      contain: layout;
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top, 
      $color-overlay-darker 0%, 
      $color-overlay-medium 40%, 
      rgba(0, 0, 0, 0) 100%
    );
    opacity: 0.8;
    transition: opacity $transition-medium $ease-out;
  }

  &__content {
    position: absolute;
    inset: 0;
    padding: $spacing-lg;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: $z-index-content;
  }

  &__header {
    display: flex;
    justify-content: flex-end;
    opacity: 1;
    transition: opacity $transition-base $ease-out;
  }

  &__score {
    background: $color-overlay-medium;
    backdrop-filter: $backdrop-blur-md;
    border-radius: $radius-md;
    padding: $spacing-xxs $spacing-sm;
    display: flex;
    align-items: center;
    gap: $spacing-xxs;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    color: $color-warning;
    border: 1px solid rgba($color-warning, 0.3);
  }

  &__score-icon {
    font-size: $font-size-sm;
    line-height: $line-height-none;
  }

  &__score-value {
    line-height: $line-height-none;
  }

  &__footer {
    transform: translateY(0);
    opacity: 1;
    transition: transform $transition-medium $ease-card-hover;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-extrabold;
    color: $color-text-primary;
    text-shadow: $shadow-text-lg;
    margin-bottom: $spacing-xs;
    line-height: $line-height-tight;
    @include truncate-text(2);
    
    &.is-active {
      view-transition-name: selected-anime-title;
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height $transition-medium $ease-out,
                opacity $transition-medium $ease-out;
  }

  &__meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: $spacing-xs;
    font-size: $font-size-xs;
    color: $color-text-secondary;
    text-shadow: $shadow-text-lg;
  }

  &__meta-item {
    &--year {
      font-weight: $font-weight-semibold;
    }

    &--type {
      text-transform: uppercase;
      font-weight: $font-weight-bold;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
  }

  &__meta-separator {
    color: rgba(255, 255, 255, 0.5);
  }

  &__genres {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height $transition-medium $ease-out, 
                opacity $transition-medium $ease-out;
  }

  &__genre {
    background: $color-overlay-white-15;
    backdrop-filter: $backdrop-blur-sm;
    border-radius: $radius-sm;
    padding: $spacing-xxs $spacing-xs;
    font-size: 11px;
    color: $color-text-secondary;
    white-space: nowrap;
    font-weight: $font-weight-medium;
  }
}

@include mobile {
  .anime-card {
    border-radius: $radius-lg;

    &__glow {
      inset: -3%;
      border-radius: $radius-xl;
      filter: blur(30px) saturate(1.5) brightness(1.2);
    }

    &:hover .anime-card__glow {
      filter: blur(40px) saturate(1.8) brightness(1.3);
    }

    &__content {
      padding: $spacing-md;
    }

    &__title {
      font-size: $font-size-md;
    }

    &__meta,
    &__score {
      font-size: 11px;
    }

    &__genre {
      font-size: 10px;
      padding: 3px 7px;
    }

    &__genres {
      display: none;
    }
  }
}
</style>

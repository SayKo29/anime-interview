<template lang="pug">
section.anime-list
  //- Skeleton loading state
  ul.anime-list__grid.anime-list__grid--loading(
    v-if="loading && animes.length === 0"
    aria-label="Cargando animes"
    aria-busy="true"
  )
    li.anime-list__item(
      v-for="i in 24"
      :key="`skeleton-${i}`"
    )
      SkeletonCard

  //- Grid of anime cards
  ul.anime-list__grid(
    v-else-if="animes.length > 0"
    aria-label="Listado de animes"
  )
    li.anime-list__item(
      v-for="anime in animes"
      :key="anime.id"
    )
      AnimeCard(:anime="anime")

  //- Empty state
  article.anime-list__empty(
    v-else
    role="status"
  )
    span.anime-list__empty-icon(aria-hidden="true") 📺
    h2.anime-list__empty-title No se encontraron animes
    p.anime-list__empty-text No hay animes disponibles en este momento

  //- Infinite scroll trigger
  footer.anime-list__footer(
    ref="scrollTrigger"
    role="status"
    aria-live="polite"
  )
    //- Loading indicator
    .anime-list__loading(v-if="loading")
      span.anime-list__spinner(aria-hidden="true")
      p.anime-list__loading-text Cargando más animes...

    //- End message
    .anime-list__end(v-else-if="!hasMore && animes.length > 0")
      span.anime-list__end-icon(aria-hidden="true") ✨
      p.anime-list__end-text Has llegado al final de la lista

  //- Error message
  aside.anime-list__error(
    v-if="error"
    role="alert"
    aria-live="assertive"
  )
    span.anime-list__error-icon(aria-hidden="true") ⚠️
    p.anime-list__error-text {{ error }}
</template>

<script setup lang="ts">
import type { AnimeCard } from '~/types/anime.types';

// Props
interface Props {
  animes: AnimeCard[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
}

defineProps<Props>();

// Emits
const emit = defineEmits<{
  loadMore: [];
}>();

// Infinite scroll - connects the ref to the DOM element
const { target: scrollTrigger } = useInfiniteScroll(() => {
  emit('loadMore');
});
</script>

<style lang="scss" scoped>
.anime-list {
  width: 100%;
  max-width: $container-max-width;
  margin: 0 auto;
  padding: $spacing-xl $spacing-md;

  // Element: Grid container
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: $spacing-2xl;
    list-style: none;
    padding: $spacing-lg 0;
    margin: 0 0 $spacing-2xl 0;

    // Modifier: Loading state
    @include modifier(loading) {
      opacity: 0.8;
    }
  }

  // Element: Grid item (li wrapper)
  &__item {
    display: contents;
  }

  // Element: Empty state container
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-3xl $spacing-lg;
    text-align: center;
  }

  &__empty-icon {
    font-size: 64px;
    margin-bottom: $spacing-md;
  }

  &__empty-title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin: 0 0 $spacing-sm 0;
  }

  &__empty-text {
    font-size: $font-size-md;
    color: $color-text-secondary;
    margin: 0;
    max-width: 400px;
  }

  // Element: Footer (scroll trigger)
  &__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $spacing-2xl $spacing-lg;
    min-height: 120px;
  }

  // Element: Loading indicator
  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-md;
  }

  &__spinner {
    display: block;
    width: 48px;
    height: 48px;
    border: 4px solid $color-overlay-white-05;
    border-top-color: $color-primary;
    border-radius: $radius-full;
    animation: spin 0.8s $ease-linear infinite;
  }

  &__loading-text {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-muted;
    margin: 0;
  }

  // Element: End message
  &__end {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-lg;
  }

  &__end-icon {
    font-size: 32px;
  }

  &__end-text {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-muted;
    margin: 0;
    text-align: center;
  }

  // Element: Error message
  &__error {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-md $spacing-lg;
    margin: $spacing-lg 0;
    background: $color-error-bg;
    border: 1px solid $color-error-border;
    border-radius: $radius-xl;
    color: $color-error-text;
  }

  &__error-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  &__error-text {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    margin: 0;
    line-height: $line-height-normal;
  }
}

// ===== ANIMATIONS =====
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// ===== RESPONSIVE =====

@include tablet {
  .anime-list {
    padding: $spacing-2xl $spacing-xl;

    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: $spacing-2xl;
      padding: $spacing-xl 0;
    }
  }
}

@include desktop {
  .anime-list {
    padding: $spacing-2xl $spacing-2xl;

    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: $spacing-3xl;
      padding: $spacing-xl 0;
    }
  }
}

@include large-desktop {
  .anime-list {
    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: $spacing-3xl;
      padding: $spacing-2xl 0;
    }
  }
}

@include mobile {
  .anime-list {
    padding: $spacing-md;

    &__grid {
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-md;
      padding: $spacing-md 0;
    }

    &__spinner {
      width: 40px;
      height: 40px;
    }

    &__loading-text,
    &__end-text {
      font-size: $font-size-sm;
    }

    &__empty-icon {
      font-size: 48px;
    }

    &__empty-title {
      font-size: $font-size-xl;
    }

    &__empty-text {
      font-size: $font-size-sm;
    }
  }
}
</style>

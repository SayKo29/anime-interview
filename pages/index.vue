<template lang="pug">
.home-page
  section.immersive-hero(v-if="heroAnime")
    .hero-backdrop
      img.hero-image(
        :src="heroAnime.imageUrlLarge"
        :srcset="`${heroAnime.imageUrl} 800w, ${heroAnime.imageUrlLarge} 1200w`"
        sizes="100vw"
        :alt="heroAnime.title"
      )
      .hero-gradient
      .hero-vignette
    nav.hero-nav
      h1.brand-logo
        | ANIME
        span.highlight COLLECTION
    .hero-content
      .hero-badges
        span.rank-badge Tendencia #1
        .meta-badge
          span.star ★
          |  {{ heroAnime.score }}
        span.meta-badge {{ heroAnime.year || 'Clásico' }}
        span.meta-badge {{ heroAnime.type }}
      h2.hero-title {{ heroAnime.title }}
      .hero-genres(v-if="heroAnime.genres && heroAnime.genres.length")
        span.genre-text(
          v-for="genre in heroAnime.genres.slice(0, 3)"
          :key="genre.mal_id"
        ) {{ genre.name }}
      button.hero-cta(@click="navigateTo(`/anime/${heroAnime.id}`)")
        span.icon ▶
        |  Ver Detalles
  main.main-content
    .content-header
      h3.section-title Explorar Catálogo
      .section-line
    .error-container(
      v-if="initialError"
      role="alert"
    )
      .error-content
        span.error-icon ⚠️
        p {{ initialError }}
        button.retry-btn(@click="refreshNuxtData()") Reintentar
    AnimeList(
      v-else
      :animes="animeList"
      :loading="loading"
      :has-more="hasMore"
      :error="loadMoreError"
      @load-more="handleLoadMore"
    )
  footer.page-footer
    p
      | Powered by 
      a(href="https://jikan.moe" target="_blank") Jikan API
</template>

<script setup lang="ts">
import { transformToAnimeCard } from '~/utils/transformers';
import { ITEMS_PER_PAGE, INITIAL_PAGE } from '~/constants';

useHead({
  title: 'Anime Collection - Premium',
  meta: [
    { name: 'description', content: 'Explora el universo del anime con la mejor calidad visual.' }
  ]
});

const { getAnimeList } = useJikanApi();
const { 
  animeList, 
  loading, 
  hasMore, 
  error: loadMoreError, 
  loadMore,
  initializeList 
} = useAnimeList();

// Computed Hero Anime - Show Naruto as featured
const heroAnime = computed(() => {
  if (animeList.value && animeList.value.length > 0) {
    const naruto = animeList.value.find(anime => anime.title.toLowerCase().includes('naruto'));
    return naruto || animeList.value[0];
  }
  return null;
});

const initialError = ref<string | null>(null);

/**
 * SSR data fetching with aggressive caching
 */
const { data: initialData, error: fetchError } = await useAsyncData(
  'anime-list-initial',
  async () => {
    try {
      const response = await getAnimeList(INITIAL_PAGE, ITEMS_PER_PAGE);
      return {
        animes: response.data.map(transformToAnimeCard),
        pagination: {
          currentPage: response.pagination.current_page,
          totalPages: response.pagination.last_visible_page,
          hasMore: response.pagination.has_next_page
        }
      };
    } catch (err) {
      console.error('Error fetching initial anime list:', err);
      throw err;
    }
  },
  {
    getCachedData: (key) => useNuxtApp().payload.data[key] || useNuxtApp().static.data[key]
  }
);

if (fetchError.value) {
  initialError.value = 'No se pudo conectar con el servidor de anime.';
}

if (initialData.value && !fetchError.value) {
  initializeList(initialData.value.animes, initialData.value.pagination);
}

const handleLoadMore = () => {
  if (!loading.value && hasMore.value) {
    loadMore();
  }
};
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background-color: $color-bg-primary;
  font-family: $font-primary;
}

.immersive-hero {
  position: relative;
  width: 100%;
  height: $hero-height;
  min-height: $hero-min-height;
  display: flex;
  align-items: flex-end;
  padding: $spacing-3xl;
  overflow: hidden;
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  z-index: $z-index-base;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  transform: scale(1.05);
  animation: slowZoom 20s infinite alternate;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba($color-bg-primary, 0.95) 0%,
    rgba($color-bg-primary, 0.7) 40%,
    rgba($color-bg-primary, 0.1) 100%
  );
}

.hero-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, $color-bg-primary 100%);
  opacity: 0.6;
}

.hero-nav {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: $spacing-2xl $spacing-3xl;
  z-index: $z-index-dropdown;
}

.brand-logo {
  font-size: $font-size-xl;
  font-weight: $font-weight-extrabold;
  color: $color-text-primary;
  letter-spacing: 2px;
  margin: 0;

  .highlight {
    color: $color-primary;
  }
}

.hero-content {
  position: relative;
  z-index: $z-index-content;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.hero-badges {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.rank-badge {
  background: $color-error;
  color: $color-text-primary;
  font-weight: $font-weight-bold;
  font-size: $font-size-sm;
  padding: 6px 12px;
  border-radius: $radius-md;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.meta-badge {
  @include glassmorphism(10px, 0.1);
  color: $color-text-secondary;
  font-weight: $font-weight-semibold;
  padding: 6px 12px;
  border-radius: $radius-md;
  border: 1px solid $color-overlay-white-20;
  display: flex;
  align-items: center;
  gap: 6px;
}

.star {
  color: $color-warning;
}

.hero-title {
  font-size: 84px;
  font-weight: $font-weight-black;
  color: $color-text-primary;
  margin: 0;
  line-height: 0.95;
  text-transform: uppercase;
  letter-spacing: -2px;
  text-shadow: 0 10px 30px $color-overlay-dark;
}

.hero-genres {
  display: flex;
  gap: $spacing-md;
  color: $color-text-muted;
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
}

.genre-text {
  &::after {
    content: '•';
    margin-left: $spacing-md;
    opacity: 0.5;
  }

  &:last-child::after {
    display: none;
  }
}

.hero-cta {
  align-self: flex-start;
  margin-top: $spacing-md;
  padding: $font-size-md $spacing-2xl;
  background: $color-primary;
  color: $color-text-primary;
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  border: none;
  border-radius: $radius-full;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  transition: all $transition-medium $ease-out;
  box-shadow: 0 0 0 4px rgba($color-primary, 0.2);

  &:hover {
    background: $color-primary-dark;
    transform: scale(1.05);
    box-shadow: 0 0 0 8px rgba($color-primary, 0.3);
  }
}

// ===== LOADING STATE =====

.hero-loading {
  height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  width: 50px;
  height: 50px;
  border: 5px solid $color-overlay-white-10;
  border-top-color: $color-primary;
  border-radius: $radius-full;
  animation: spin 1s $ease-linear infinite;
}

.main-content {
  padding: $spacing-3xl;
  background: $color-bg-primary;
  position: relative;
  z-index: $z-index-content;
}

.content-header {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  margin-bottom: $spacing-2xl;
}

.section-title {
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin: 0;
  white-space: nowrap;
}

.section-line {
  height: 2px;
  width: 100%;
  background: $color-overlay-white-10;
}

// ===== ERROR STATE =====

.error-container {
  padding: $spacing-3xl $spacing-2xl;
  display: flex;
  justify-content: center;
}

.error-content {
  text-align: center;
  color: $color-error-text;
}

.error-icon {
  font-size: $font-size-4xl;
  margin-bottom: $spacing-md;
}

.retry-btn {
  margin-top: $spacing-md;
  padding: $spacing-sm $spacing-lg;
  background: $color-text-primary;
  color: $color-bg-primary;
  border: none;
  border-radius: $radius-md;
  cursor: pointer;
  font-weight: $font-weight-semibold;
  transition: transform $transition-base $ease-out;

  &:hover {
    transform: scale(1.05);
  }
}

// ===== FOOTER =====

.page-footer {
  padding: $spacing-2xl;
  text-align: center;
  color: $color-text-muted;
  border-top: 1px solid $color-overlay-white-05;

  a {
    color: $color-text-primary;
    text-decoration: none;
    @include hover-effect {
      color: $color-primary;
    }
  }
}

@keyframes slowZoom {
  from { transform: scale(1.0); }
  to { transform: scale(1.1); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@include desktop {
  .hero-title {
    font-size: 64px;
  }
  
  .immersive-hero {
    height: $hero-height;
    padding: $spacing-2xl;
  }
}

@include tablet {
  .immersive-hero {
    padding: $spacing-lg;
    height: 60vh;
    align-items: center;
    justify-content: flex-end;
  }

  .hero-nav {
    padding: $spacing-md $spacing-lg;
  }

  .hero-content {
    text-align: center;
    align-items: center;
  }

  .hero-gradient {
    background: linear-gradient(
      to top, 
      $color-bg-primary 0%, 
      rgba($color-bg-primary, 0.8) 60%, 
      transparent 100%
    );
  }

  .hero-title {
    font-size: 42px;
  }

  .main-content {
    padding: $spacing-lg;
  }

  .hero-badges {
    justify-content: center;
  }

  .hero-cta {
    width: 100%;
    justify-content: center;
  }
}

@include mobile {
  .hero-title {
    font-size: $font-size-3xl;
  }

  .immersive-hero {
    padding: $spacing-md;
    min-height: 500px;
  }

  .hero-nav {
    padding: $spacing-md;
  }

  .brand-logo {
    font-size: $font-size-lg;
  }

  .main-content {
    padding: $spacing-md;
  }

  .content-header {
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
  }

  .section-title {
    font-size: $font-size-2xl;
  }
}
</style>
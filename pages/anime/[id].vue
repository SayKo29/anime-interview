<template lang="pug">
  .anime-page(v-if="anime" :class="{ 'is-loaded': !pending }")
    .anime-page__backdrop
      .anime-page__backdrop-image(
        :style="{ backgroundImage: `url(${anime.images.jpg.large_image_url})` }"
      )
      .anime-page__backdrop-overlay
      .anime-page__particles
    button.anime-page__back(@click="goBack" aria-label="Back to list")
      .anime-page__back-icon
        svg(width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
          path(d="M19 12H5M12 19l-7-7 7-7")
      span Back
    .anime-page__content
      header.anime-hero
        .anime-hero__visual
          .anime-hero__poster-wrapper
            img.anime-hero__poster(
              :src="anime.images.jpg.large_image_url"
              :alt="anime.title"
              loading="eager"
            )
            .anime-hero__poster-reflection
        .anime-hero__info
          .anime-hero__meta
            span.anime-tag.anime-tag--rank(v-if="anime.rank") #Rank {{ anime.rank }}
            span.anime-tag.anime-tag--year(v-if="anime.year") {{ anime.year }}
            span.anime-tag.anime-tag--status(:class="`is-${anime.status?.toLowerCase().replace(/\\s/g, '-')}`") {{ anime.status }}
          h1.anime-hero__title 
            span(v-html="anime.title")
          h2.anime-hero__subtitle(v-if="anime.title_japanese") {{ anime.title_japanese }}
          .anime-stats
            .anime-stat
              .anime-stat__ring(:style="`--score: ${anime.score ? anime.score * 10 : 0}%`")
                svg.anime-stat__icon(viewBox="0 0 24 24" fill="currentColor")
                  path(d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z")
              .anime-stat__data
                span.anime-stat__value {{ anime.score || 'N/A' }}
                span.anime-stat__label Score
            .anime-stat
              .anime-stat__icon-box
                svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                  rect(x="2" y="3" width="20" height="14" rx="2")
                  path(d="M8 21h8M12 17v4")
                  circle(cx="12" cy="10" r="2" fill="currentColor")
              .anime-stat__data
                span.anime-stat__value {{ anime.episodes || '?' }}
                span.anime-stat__label Episodes
            .anime-stat
              .anime-stat__icon-box
                svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                  circle(cx="12" cy="12" r="10")
                  polyline(points="12 6 12 12 16 14")
              .anime-stat__data
                span.anime-stat__value {{ anime.duration?.split(' ')[0] || '24' }}m
                span.anime-stat__label Duration
      .anime-grid
        .anime-grid__main
          section.anime-section.anime-synopsis
            h3.anime-section__title Synopsis
            p.anime-synopsis__text {{ anime.synopsis }}
          section.anime-section
            .anime-tags-cloud
              span.anime-pill(
                v-for="genre in anime.genres" 
                :key="genre.mal_id"
              ) {{ genre.name }}
              span.anime-pill(
                v-for="theme in anime.themes" 
                :key="theme.mal_id"
              ) {{ theme.name }}
          section.anime-section(v-if="episodes")
            .anime-section__header
              h3.anime-section__title Episodes
              span.anime-section__count {{ episodes.data.length }} available
            EpisodeList(
              :episodes="episodes.data"
              :loading="episodesLoading"
              @episode-click="handleEpisodeClick"
            )
  
        //- Sidebar Information
        aside.anime-grid__sidebar
          .anime-info-card
            h4.anime-info-card__title Information
            
            .anime-info-row
              span.label Type
              span.value {{ anime.type }}
            .anime-info-row
              span.label Source
              span.value {{ anime.source }}
            .anime-info-row(v-if="anime.studios?.length")
              span.label Studios
              span.value.highlight {{ anime.studios.map(s => s.name).join(', ') }}
            .anime-info-row
              span.label Rating
              span.value {{ anime.rating }}
            .anime-info-row
              span.label Members
              span.value {{ formatNumber(anime.members) }}
          
          //- Trailer
          .anime-trailer(v-if="anime.trailer?.youtube_id")
            iframe(
              :src="`https://www.youtube.com/embed/${anime.trailer.youtube_id}`"
              title="Trailer"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            )
  
  //- Loading State
  .page-loader(v-else-if="pending")
    .page-loader__spinner
    span.page-loader__text Summoning Anime...
  
  //- Error State
  .page-error(v-else-if="error")
    h1 404
    p Anime not found in this timeline.
    button.anime-page__back(@click="goBack") Return Home
  
  //- Episode Modal
  EpisodeModal(
    v-model="isEpisodeModalOpen"
    :anime-id="animeId"
    :episode="selectedEpisode"
    :anime-name="anime?.title"
  )
  </template>
  
  <script setup lang="ts">
  import type { JikanEpisode } from '~/types/jikan.types';
  
const route = useRoute();
const animeId = route.params.id as string;

const isEpisodeModalOpen = ref(false);
const selectedEpisode = ref<JikanEpisode | null>(null);

const { getAnimeDetail, getAnimeEpisodes } = useApi();

const { data: animeData, error, pending } = await getAnimeDetail(animeId);
const anime = computed(() => animeData.value?.data);

const { data: episodesData, pending: episodesLoading } = await getAnimeEpisodes(animeId);
const episodes = computed(() => episodesData.value);

const formatNumber = (num: number | null) => {
  return num ? new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num) : '0';
};

const handleEpisodeClick = (episode: JikanEpisode) => {
  selectedEpisode.value = episode;
  isEpisodeModalOpen.value = true;
};

const goBack = () => navigateTo('/');

if (anime.value) {
  useHead({
    title: `${anime.value.title} - Anime Collection`,
    meta: [
      { name: 'description', content: anime.value.synopsis?.slice(0, 160) || `Watch ${anime.value.title} - Anime details, episodes, and more.` },
      { name: 'keywords', content: `${anime.value.title}, anime, ${anime.value.genres?.map(g => g.name).join(', ') || 'anime series'}, watch anime` },
      { property: 'og:title', content: `${anime.value.title} - Anime Collection` },
      { property: 'og:description', content: anime.value.synopsis?.slice(0, 160) || `Watch ${anime.value.title}` },
      { property: 'og:image', content: anime.value.images.jpg.large_image_url },
      { property: 'og:type', content: 'video.tv_show' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: anime.value.title },
      { name: 'twitter:description', content: anime.value.synopsis?.slice(0, 160) || '' },
      { name: 'twitter:image', content: anime.value.images.jpg.large_image_url }
    ]
  });
}

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Anime not found' });
}
  </script>
  
  <style lang="scss" scoped>
  // Local variables for the component
  $z-back: 0;
  $z-content: 10;
  $z-nav: 20;
  
  .anime-page {
    position: relative;
    min-height: 100dvh;
    width: 100%;
    color: $color-text-primary;
    overflow-x: hidden;
    padding-bottom: $spacing-4xl;
  
    // 1. CINEMATIC BACKDROP
    @include element(backdrop) {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100dvh;
      z-index: $z-back;
      overflow: hidden;
  
      @include element(backdrop-image) {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
      filter: blur(30px) brightness(0.4);
      transform: scale(1.1);
      transition: transform 10s ease-out;
    }

    @include element(backdrop-overlay) {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at top right, rgba($color-primary, 0.1), transparent 70%),
                    linear-gradient(to bottom, transparent, $color-bg-primary 90%);
      }
    }

    @include element(back) {
      position: fixed;
      top: $spacing-xl;
      left: $spacing-xl;
      z-index: $z-nav;
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm $spacing-lg;
      background: rgba($color-bg-secondary, 0.5);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: $radius-full;
      color: $color-text-primary;
      font-weight: 600;
      transition: all $transition-medium;
  
      &:hover {
        background: rgba($color-primary, 0.2);
        transform: translateX(-4px);
        border-color: rgba($color-primary, 0.3);
      }
    }

  @include element(content) {
      position: relative;
      z-index: $z-content;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 $spacing-xl;
      padding-top: 120px;
    }
  }

.anime-hero {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: $spacing-3xl;
    margin-bottom: $spacing-4xl;
    animation: fade-in-up 0.8s $ease-out;
  
    @include element(visual) {
      perspective: 1000px;
    }
  
    @include element(poster-wrapper) {
      position: relative;
      width: 100%;
      aspect-ratio: 2/3;
      border-radius: $radius-xl;
      animation: levitate 6s ease-in-out infinite;
      
      &::after {
        content: '';
        position: absolute;
        inset: -2px;
        background: linear-gradient(45deg, $color-primary, transparent, $color-secondary);
        z-index: -1;
        border-radius: inherit;
        opacity: 0.5;
        filter: blur(10px);
      }
    }
  
    @include element(poster) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: $radius-xl;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      view-transition-name: selected-anime-image;
    }
  
    @include element(info) {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding-bottom: $spacing-lg;
    }
  
    @include element(meta) {
      display: flex;
      gap: $spacing-sm;
      margin-bottom: $spacing-md;
      flex-wrap: wrap;
    }
  
    @include element(title) {
      font-size: clamp(2.5rem, 5dvw, 4.5rem);
      font-weight: 900;
      line-height: 1;
      margin: 0;
      margin-bottom: $spacing-xs;
      background: linear-gradient(to right, #fff, $color-text-secondary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 10px 30px rgba(0,0,0,0.5);
      view-transition-name: selected-anime-title;
    }
  
    @include element(subtitle) {
      font-size: $font-size-xl;
      color: $color-primary-light;
      margin-bottom: $spacing-xl;
      font-weight: 500;
      opacity: 0.8;
    }
  }
  
  // TAGS & BADGES
  .anime-tag {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.1);
  
    &--rank { background: $color-primary; border-color: $color-primary; color: #fff; }
    &--status.is-currently-airing { color: $color-success; border-color: rgba($color-success, 0.3); }
  }
  
  // STATS
  .anime-stats {
    display: flex;
    gap: $spacing-xl;
    padding: $spacing-lg;
    background: rgba($color-bg-secondary, 0.4);
    border: 1px solid rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    border-radius: $radius-xl;
    width: fit-content;
    margin-top: auto;
  }
  
  .anime-stat {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  
    @include element(icon-box) {
      color: $color-primary;
      width: 24px;
      height: 24px;
    }
  
    @include element(data) {
      display: flex;
      flex-direction: column;
    }
  
    @include element(value) {
      font-size: 1.25rem;
      font-weight: 800;
      line-height: 1;
    }
  
    @include element(label) {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: $color-text-muted;
      letter-spacing: 0.5px;
    }
  }
  
  // MAIN GRID
  .anime-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: $spacing-3xl;
    animation: fade-in-up 0.8s $ease-out 0.2s backwards;
  
    @include tablet {
      grid-template-columns: 1fr;
    }

    @include element(main) {
      display: flex;
      flex-direction: column;
      gap: $spacing-2xl;
    }
  }

  .anime-section {
    @include element(title) {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: $spacing-lg;
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      
      &::before {
        content: '';
        display: block;
        width: 4px;
        height: 24px;
        background: $color-primary;
        border-radius: 2px;
      }
    }
  }
  
  .anime-synopsis {
    font-size: 1.1rem;
    line-height: 1.8;
    color: $color-text-secondary;
    padding: $spacing-xl;
    background: linear-gradient(to right, rgba($color-bg-secondary, 0.3), transparent);
    border-left: 1px solid rgba($color-primary, 0.2);
    border-radius: 0 $radius-lg $radius-lg 0;
  }
  
  // PILLS
  .anime-tags-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }
  
  .anime-pill {
    padding: 6px 16px;
    background: rgba($color-bg-tertiary, 0.8);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 100px;
    font-size: 0.9rem;
    color: $color-text-secondary;
    transition: all 0.2s;
  
    &:hover {
      background: $color-primary;
      color: #fff;
      transform: translateY(-2px);
    }
  }
  
  .anime-info-card {
    padding: $spacing-xl;
    background: $color-bg-card;
    border-radius: $radius-xl;
    border: 1px solid rgba(255,255,255,0.05);
  
    &__title {
      margin-bottom: $spacing-lg;
      font-size: 1.2rem;
      color: #fff;
    }
  }
  
  .anime-info-row {
    display: flex;
    justify-content: space-between;
    padding: $spacing-sm 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 0.95rem;
  
    .label { color: $color-text-muted; }
    .value { font-weight: 600; text-align: right; }
    .highlight { color: $color-primary-light; }
    
    &:last-child { border-bottom: none; }
  }
  
  .anime-trailer {
    margin-top: $spacing-xl;
    border-radius: $radius-lg;
    overflow: hidden;
    aspect-ratio: 16/9;
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
    
    iframe {
      width: 100%;
      height: 100%;
    }
  }
  
  // ANIMATIONS
  @keyframes levitate {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  // LOADER & ERROR
  .page-loader, .page-error {
    height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-lg;
    
    &__spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba($color-primary, 0.3);
      border-top-color: $color-primary;
      border-radius: 50%;
      animation: spin 1s infinite linear;
    }
  }

  // ===== MOBILE STYLES =====
  @include mobile {
    .anime-page {
      padding-bottom: $spacing-2xl;

      &__back {
        top: $spacing-sm;
        left: $spacing-sm;
        padding: $spacing-xs $spacing-sm;
        font-size: $font-size-sm;
        min-width: 44px;
        min-height: 44px;
        justify-content: center;

        span {
          display: none;
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }

      &__content {
        padding: 0 $spacing-md;
        padding-top: 70px;
      }
    }

    .anime-hero {
      grid-template-columns: 1fr;
      gap: $spacing-xl;
      text-align: center;
      margin-bottom: $spacing-xl;

      &__poster-wrapper {
        max-width: 220px;
        margin: 0 auto;
        animation: none;

        &::after {
          filter: blur(8px);
        }
      }

      &__info {
        padding-bottom: 0;
        align-items: center;
      }

      &__meta {
        justify-content: center;
      }

      &__title {
        font-size: clamp(1.75rem, 8vw, 2.5rem);
        line-height: 1.1;
        margin-bottom: $spacing-sm;
        text-align: center;
      }

      &__subtitle {
        font-size: $font-size-base;
        margin-bottom: $spacing-md;
      }
    }

    .anime-tag {
      padding: 3px 10px;
      font-size: 0.65rem;
    }

    .anime-stats {
      width: 100%;
      justify-content: space-around;
      gap: $spacing-sm;
      padding: $spacing-md;
      margin-top: $spacing-lg;
    }

    .anime-stat {
      flex-direction: column;
      gap: $spacing-xxs;
      text-align: center;
      min-width: 0;

      &__ring {
        width: 36px;
        height: 36px;
      }

      &__icon {
        width: 16px;
        height: 16px;
      }

      &__icon-box {
        width: 20px;
        height: 20px;

        svg {
          width: 20px;
          height: 20px;
        }
      }

      &__data {
        gap: 2px;
      }

      &__value {
        font-size: $font-size-base;
      }

      &__label {
        font-size: 0.625rem;
      }
    }

    .anime-grid {
      grid-template-columns: 1fr;
      gap: $spacing-xl;
    }

    .anime-section {
      &__title {
        font-size: 1.125rem;
        margin-bottom: $spacing-md;

        &::before {
          width: 3px;
          height: 18px;
        }
      }

      &__header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: $spacing-sm;
        margin-bottom: $spacing-md;
      }

      &__count {
        font-size: $font-size-xs;
        color: $color-text-muted;
      }
    }

    .anime-synopsis {
      font-size: $font-size-sm;
      line-height: 1.65;
      padding: $spacing-md;
      border-radius: $radius-md;

      &__text {
        margin: 0;
      }
    }

    .anime-pills,
    .anime-tags-cloud {
      gap: $spacing-xs;
    }

    .anime-pill {
      padding: 5px 12px;
      font-size: 0.8rem;

      &:hover {
        transform: none;
      }
    }

    .anime-info-card {
      padding: $spacing-lg $spacing-md;

      &__title {
        font-size: $font-size-md;
        margin-bottom: $spacing-md;
      }
    }

    .anime-info-row {
      font-size: $font-size-sm;
      padding: $spacing-sm 0;
      gap: $spacing-md;
      flex-wrap: wrap;

      .label { 
        flex-shrink: 0;
        min-width: 70px;
        font-size: 0.8rem;
      }
      
      .value { 
        word-break: break-word;
        text-align: left;
        flex: 1;
      }
    }

    .anime-trailer {
      margin-top: $spacing-lg;
      border-radius: $radius-md;
    }

    // Disable hover effects on mobile
    .anime-pill:hover {
      background: rgba($color-bg-tertiary, 0.8);
      color: $color-text-secondary;
    }
  }
  </style>
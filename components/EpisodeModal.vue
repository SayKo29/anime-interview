<template lang="pug">
BaseModal(
  v-model="isOpen"
  modal-class="episode-modal"
  aria-labelledby="episode-modal-title"
)
  .episode-modal-content
    .episode-loading(v-if="loading")
      .episode-loading__spinner
        .spinner-ring
        .spinner-ring
        .spinner-ring
      p.episode-loading__text Cargando detalles del episodio...
    .episode-detail(v-else-if="fullEpisodeData")
      header.episode-header
        .episode-header__number
          span.episode-header__label EP
          span.episode-header__value {{ episodeData.mal_id }}
        .episode-header__info
          h2#episode-modal-title.episode-header__title {{ fullEpisodeData.title || `Episode ${fullEpisodeData.mal_id}` }}
          p.episode-header__title-japanese(v-if="fullEpisodeData.title_japanese") {{ fullEpisodeData.title_japanese }}
          p.episode-header__title-romanji(v-if="fullEpisodeData.title_romanji") {{ fullEpisodeData.title_romanji }}
      .episode-meta
        .episode-meta-item(v-if="episodeData.aired")
          svg.episode-meta-item__icon(
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          )
            circle(cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5")
            path(d="M10 5V10L13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round")
          .episode-meta-item__content
            span.episode-meta-item__label Fecha de emisión
            time.episode-meta-item__value(:datetime="fullEpisodeData.aired") {{ formatDate(fullEpisodeData.aired) }}
        .episode-meta-item(v-if="fullEpisodeData.duration")
          svg.episode-meta-item__icon(
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          )
            rect(x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.5")
            path(d="M8 8L12 10L8 12V8Z" fill="currentColor")
          .episode-meta-item__content
            span.episode-meta-item__label Duración
            span.episode-meta-item__value {{ episodeData.duration }} min
      .episode-badges(v-if="fullEpisodeData.filler || fullEpisodeData.recap")
        .episode-badge.episode-badge--filler(v-if="fullEpisodeData.filler")
          svg(width="16" height="16" viewBox="0 0 16 16" fill="currentColor")
            path(d="M8 0L10.4 5.6L16 8L10.4 10.4L8 16L5.6 10.4L0 8L5.6 5.6L8 0Z")
          | Episodio Filler
        .episode-badge.episode-badge--recap(v-if="episodeData.recap")
          svg(width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5")
            path(d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2")
            path(d="M8 2L11 5L8 8" stroke-linecap="round" stroke-linejoin="round")
          | Episodio Recap
      .episode-description(v-if="fullEpisodeData.synopsis")
        h3.episode-description__title Sinopsis
        p.episode-description__text {{ fullEpisodeData.synopsis }}
      .episode-links
        a.episode-link(
          v-if="episodeData.url"
          :href="episodeData.url"
          target="_blank"
          rel="noopener noreferrer"
        )
          svg(width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5")
            path(d="M10 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H16C17.1 18 18 17.1 18 16V10")
            path(d="M12 2H18V8M18 2L8 12" stroke-linecap="round")
          | Ver en MyAnimeList
        a.episode-link(
          v-if="fullEpisodeData.forum_url"
          :href="fullEpisodeData.forum_url"
          target="_blank"
          rel="noopener noreferrer"
        )
          svg(width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5")
            rect(x="2" y="2" width="16" height="16" rx="2")
            path(d="M6 7H14M6 10H14M6 13H10")
          | Discusión en el foro
</template>

<script setup lang="ts">
import type { JikanEpisode } from '~/types/jikan.types';

interface Props {
  modelValue: boolean;
  animeId: string | number;
  episode: JikanEpisode | null;
  animeName?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const { getEpisodeDetail } = useEpisodeDetail();

const fullEpisodeData = ref<JikanEpisode | null>(props.episode);
const loading = ref(false);

// Fetch full episode details when modal opens
watch(() => props.modelValue, async (isModalOpen) => {
  if (isModalOpen && props.episode && props.animeId) {
    fullEpisodeData.value = props.episode;
    
    loading.value = true;
    try {
      const detail = await getEpisodeDetail(props.animeId, props.episode.mal_id);
      if (detail) {
        fullEpisodeData.value = detail;
      }
    } catch (error) {
      console.error('Error loading episode details:', error);
    } finally {
      loading.value = false;
    }
  }
}, { immediate: true });

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};
</script>

<style lang="scss" scoped>
.episode-modal-content {
  min-height: 200px;
}

.episode-detail {
  display: flex;
  flex-direction: column;
  gap: $spacing-2xl;
  animation: fadeInUp 0.4s ease-out;
}

.episode-info {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  background: linear-gradient(135deg, rgba($color-primary, 0.1), rgba($color-secondary, 0.05));
  border-left: 3px solid $color-primary;
  border-radius: $radius-md;
  margin-bottom: $spacing-lg;
  animation: slideInLeft 0.5s ease-out;
  
  &__anime {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    color: $color-text-primary;
    font-weight: $font-weight-semibold;
    
    svg {
      color: $color-primary;
      flex-shrink: 0;
    }
  }
}

.episode-header {
  display: flex;
  gap: $spacing-xl;
  padding-bottom: $spacing-xl;
  border-bottom: 2px solid rgba($color-primary, 0.2);
  animation: slideInDown 0.5s ease-out;
  
  &__number {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 90px;
    height: 90px;
    background: linear-gradient(135deg, $color-primary, $color-secondary);
    box-shadow: 0 8px 32px rgba($color-primary, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-radius: $radius-2xl;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
      transform: translateX(-100%);
      animation: shimmer 2s infinite;
    }
  }
  
  &__label {
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    color: $color-text-secondary;
    letter-spacing: 2px;
  }
  
  &__value {
    font-size: $font-size-3xl;
    font-weight: $font-weight-black;
    color: $color-primary;
    line-height: 1;
  }
  
  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    justify-content: center;
  }
  
  &__title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-extrabold;
    background: linear-gradient(135deg, $color-text-primary, $color-primary-light);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    line-height: 1.2;
  }
  
  &__title-japanese,
  &__title-romanji {
    font-size: $font-size-md;
    color: $color-text-secondary;
    margin: 0;
  }
}

.episode-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-lg;
  animation: fadeIn 0.8s ease-out 0.2s backwards;
}

.episode-meta-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: rgba($color-bg-primary, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-lg;
  
  &__icon {
    color: $color-primary;
    flex-shrink: 0;
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    gap: $spacing-xxs;
  }
  
  &__label {
    font-size: $font-size-xs;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: $color-text-muted;
    font-weight: $font-weight-semibold;
  }
  
  &__value {
    font-size: $font-size-md;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }
}

.episode-badges {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  animation: fadeIn 0.8s ease-out 0.3s backwards;
}

.episode-badge {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &--filler {
    background: rgba($color-accent, 0.15);
    color: $color-accent;
    border: 1px solid rgba($color-accent, 0.3);
  }
  
  &--recap {
    background: rgba($color-secondary, 0.15);
    color: $color-secondary;
    border: 1px solid rgba($color-secondary, 0.3);
  }
}

.episode-description {
  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin: 0 0 $spacing-md;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    
    &::before {
      content: '';
      width: 4px;
      height: 20px;
      background: $color-primary;
      border-radius: 2px;
    }
  }
  
  &__text {
    font-size: $font-size-md;
    line-height: 1.7;
    color: $color-text-secondary;
    margin: 0;
  }
}

.episode-links {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding-top: $spacing-xl;
  border-top: 2px solid rgba($color-primary, 0.2);
  animation: fadeIn 0.8s ease-out 0.5s backwards;
}

.episode-link {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  background: rgba($color-primary, 0.1);
  border: 1px solid rgba($color-primary, 0.2);
  border-radius: $radius-lg;
  color: $color-text-primary;
  text-decoration: none;
  font-weight: $font-weight-semibold;
  transition: all $transition-medium;
  
  svg {
    color: $color-primary;
    flex-shrink: 0;
  }
  
  &:hover {
    background: rgba($color-primary, 0.2);
    border-color: rgba($color-primary, 0.4);
    transform: translateX(4px);
  }
}

// Animations
@keyframes spinRing {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@include mobile {
  .episode-header {
    flex-direction: column;
    text-align: center;
    align-items: center;
    
    &__info {
      align-items: center;
    }
    
    &__number {
      min-width: 70px;
      height: 70px;
    }
    
    &__value {
      font-size: $font-size-2xl;
    }
  }
  
  .episode-meta {
    grid-template-columns: 1fr;
  }
}
</style>

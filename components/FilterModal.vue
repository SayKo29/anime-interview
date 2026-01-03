<template lang="pug">
BaseModal(
  v-model="isOpen"
  modal-class="filter-modal"
  aria-labelledby="filter-modal-title"
  @closed="handleClosed"
)
  .filter-modal-wrapper
    header.filter-modal-header
      h2#filter-modal-title.filter-modal-title Filter Anime
      p.filter-modal-subtitle Select genres and themes to customize your search
    
    .filter-modal-content
      //- Genres Section
      section.filter-section(v-if="!genresLoading && genres.length > 0")
        h3.filter-section-title
          svg.section-icon(
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          )
            path(d="M7 7h10v10H7z")
            path(d="M5 5v14h14")
          | Genres
          span.count ({{ genres.length }})
        
        .genre-grid
          button.genre-chip(
            v-for="genre in genres"
            :key="genre.mal_id"
            :class="{ active: isGenreSelected(genre.mal_id) }"
            @click="toggleGenre(genre.mal_id)"
            type="button"
          )
            span.chip-name {{ genre.name }}
            span.chip-count {{ genre.count }}
      
      .loading-state(v-else-if="genresLoading")
        .spinner
        span Loading genres...
      
      //- Themes Section
      section.filter-section(v-if="!themesLoading && themes.length > 0")
        h3.filter-section-title
          svg.section-icon(
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          )
            path(d="M12 2L2 7l10 5 10-5-10-5z")
            path(d="M2 17l10 5 10-5")
            path(d="M2 12l10 5 10-5")
          | Themes
          span.count ({{ themes.length }})
        
        .genre-grid
          button.genre-chip(
            v-for="theme in themes"
            :key="theme.mal_id"
            :class="{ active: isThemeSelected(theme.mal_id) }"
            @click="toggleTheme(theme.mal_id)"
            type="button"
          )
            span.chip-name {{ theme.name }}
            span.chip-count {{ theme.count }}
      
      .loading-state(v-else-if="themesLoading")
        .spinner
        span Loading themes...
    
    footer.filter-modal-footer
      button.btn.btn-secondary(@click="handleReset" type="button")
        svg(
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        )
          path(d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8")
          path(d="M21 3v5h-5")
        | Clear
      button.btn.btn-primary(@click="handleApply" type="button")
        svg(
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        )
          polyline(points="20 6 9 17 4 12")
        | Apply Filters
</template>

<script setup lang="ts">
import type { JikanGenre } from '~/types/jikan.types';

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'apply': [];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const { getAnimeGenres, getAnimeThemes } = useApi();
const { 
  toggleGenre, 
  toggleTheme, 
  isGenreSelected, 
  isThemeSelected,
  resetFilters
} = useAnimeFilters();

// Fetch genres
const { data: genresData, pending: genresLoading } = await getAnimeGenres();
const genres = computed<JikanGenre[]>(() => genresData.value?.data || []);

// Fetch themes
const { data: themesData, pending: themesLoading } = await getAnimeThemes();
const themes = computed<JikanGenre[]>(() => themesData.value?.data || []);

const handleReset = () => {
  resetFilters();
  isOpen.value = false;
  emit('apply');
};

const handleApply = () => {
  isOpen.value = false;
  emit('apply');
};

const handleClosed = () => {
  // Optional: any cleanup when modal closes
};
</script>

<style lang="scss" scoped>
.filter-modal-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.filter-modal-header {
  padding: $spacing-2xl;
  padding-top: $spacing-xl;
  border-bottom: 1px solid $color-overlay-white-05;
  background: linear-gradient(
    to bottom,
    rgba($color-primary, 0.05),
    transparent
  );
}

.filter-modal-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-extrabold;
  color: $color-text-primary;
  margin: 0 0 $spacing-xs 0;
}

.filter-modal-subtitle {
  font-size: $font-size-sm;
  color: $color-text-muted;
  margin: 0;
}

.filter-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-2xl;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: $color-overlay-white-05;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba($color-primary, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba($color-primary, 0.5);
    }
  }
}

.filter-section {
  margin-bottom: $spacing-3xl;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.filter-section-title {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin: 0 0 $spacing-lg 0;
  
  .section-icon {
    width: 24px;
    height: 24px;
    color: $color-primary;
  }
  
  .count {
    font-size: $font-size-sm;
    color: $color-text-muted;
    font-weight: $font-weight-medium;
  }
}

.genre-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: $spacing-sm;
}

.genre-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  background: $color-bg-tertiary;
  border: 2px solid $color-overlay-white-05;
  border-radius: $radius-lg;
  color: $color-text-secondary;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  font-family: $font-primary;
  cursor: pointer;
  transition: all $transition-medium $ease-out;
  text-align: left;
  
  &:hover {
    border-color: $color-overlay-white-10;
    background: $color-bg-secondary;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &.active {
    background: rgba($color-primary, 0.15);
    border-color: $color-primary;
    color: $color-text-primary;
    
    .chip-name {
      color: $color-primary-light;
      font-weight: $font-weight-semibold;
    }
    
    .chip-count {
      background: $color-primary;
      color: $color-text-primary;
    }
    
    &:hover {
      background: rgba($color-primary, 0.2);
    }
  }
  
  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

.chip-name {
  flex: 1;
  @include truncate-text(1);
}

.chip-count {
  flex-shrink: 0;
  padding: 2px 6px;
  background: $color-overlay-white-10;
  border-radius: $radius-sm;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $color-text-muted;
  transition: all $transition-base $ease-out;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  padding: $spacing-3xl;
  color: $color-text-muted;
  font-size: $font-size-sm;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid $color-overlay-white-10;
  border-top-color: $color-primary;
  border-radius: $radius-full;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.filter-modal-footer {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg $spacing-2xl;
  border-top: 1px solid $color-overlay-white-05;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  border: none;
  border-radius: $radius-lg;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  font-family: $font-primary;
  cursor: pointer;
  transition: all $transition-medium $ease-out;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

.btn-secondary {
  background: $color-bg-tertiary;
  color: $color-text-secondary;
  border: 2px solid $color-overlay-white-10;
  
  &:hover {
    background: $color-bg-secondary;
    border-color: $color-overlay-white-15;
    color: $color-text-primary;
  }
}

.btn-primary {
  background: $color-primary;
  color: $color-text-primary;
  box-shadow: 0 4px 12px rgba($color-primary, 0.3);
  
  &:hover {
    background: $color-primary-dark;
    box-shadow: 0 6px 20px rgba($color-primary, 0.4);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
}

// ===== RESPONSIVE =====

@include mobile {
  .filter-modal-header {
    padding: $spacing-xl $spacing-lg;
    padding-top: $spacing-2xl;
  }
  
  .filter-modal-title {
    font-size: $font-size-2xl;
    margin-bottom: $spacing-sm;
  }
  
  .filter-modal-subtitle {
    font-size: $font-size-sm;
    line-height: 1.4;
  }
  
  .filter-modal-content {
    padding: $spacing-lg;
  }
  
  .filter-section {
    margin-bottom: $spacing-2xl;
  }
  
  .filter-section-title {
    font-size: $font-size-lg;
    margin-bottom: $spacing-md;
    
    .section-icon {
      width: 22px;
      height: 22px;
    }
    
    .count {
      font-size: $font-size-xs;
    }
  }
  
  .genre-grid {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: $spacing-xs;
  }
  
  .genre-chip {
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-sm;
    min-height: 44px; // Better touch target
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  .chip-name {
    font-size: $font-size-sm;
  }
  
  .chip-count {
    padding: 3px 7px;
    font-size: 10px;
  }
  
  .filter-modal-footer {
    flex-direction: column;
    padding: $spacing-lg $spacing-md;
    padding-bottom: $spacing-xl;
    gap: $spacing-md;
  }
  
  .btn {
    width: 100%;
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-md;
    min-height: 48px; // Better touch target
    
    svg {
      width: 22px;
      height: 22px;
    }
  }
}

@include tablet {
  .genre-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style>

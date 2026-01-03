<template lang="pug">
.filter-bar
  .search-input-wrapper
    input.search-input(
      v-model="localSearchQuery"
      type="text"
      placeholder="Search anime..."
      @input="handleSearchInput"
      aria-label="Search anime"
    )
    svg.search-icon(
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    )
      circle(cx="11" cy="11" r="8")
      path(d="M21 21l-4.35-4.35")
  
  button.filter-btn(
    @click="openModal"
    :class="{ 'has-active-filters': hasActiveFilters }"
    aria-label="Open filters"
  )
    svg.filter-icon(
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    )
      path(d="M4 6h16M7 12h10M10 18h4")
    span Filters
    .badge(v-if="activeFilterCount > 0") {{ activeFilterCount }}
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'open-modal': []
  'search-change': [query: string]
}>();

const { filters, hasActiveFilters, activeFilterCount, setSearchQuery } = useAnimeFilters();

// Local model for immediate UI updates
const localSearchQuery = ref(filters.value.searchQuery);

// Debounced search handler
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

const handleSearchInput = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
  
  searchDebounceTimer = setTimeout(() => {
    setSearchQuery(localSearchQuery.value);
    emit('search-change', localSearchQuery.value);
  }, 500); // 500ms debounce
};

const openModal = () => {
  emit('open-modal');
};

// Sync local input with global filter state
// This ensures the input reflects changes from other sources (e.g., reset, navigation)
watch(() => filters.value.searchQuery, (newQuery) => {
  if (localSearchQuery.value !== newQuery) {
    localSearchQuery.value = newQuery;
  }
});

// Cleanup on unmount
onUnmounted(() => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
});
</script>

<style lang="scss" scoped>
.filter-bar {
  display: flex;
  gap: $spacing-md;
  align-items: center;
  width: 100%;
  margin-bottom: $spacing-xl;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: $spacing-md $spacing-md $spacing-md $spacing-3xl;
  background: $color-bg-secondary;
  border: 2px solid $color-overlay-white-05;
  border-radius: $radius-full;
  color: $color-text-primary;
  font-size: $font-size-base;
  font-family: $font-primary;
  transition: all $transition-medium $ease-out;
  
  &::placeholder {
    color: $color-text-muted;
  }
  
  &:focus {
    outline: none;
    border-color: $color-primary;
    background: $color-bg-tertiary;
    box-shadow: 0 0 0 4px rgba($color-primary, 0.1);
  }
  
  &:hover:not(:focus) {
    border-color: $color-overlay-white-10;
  }
}

.search-icon {
  position: absolute;
  left: $spacing-md;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: $color-text-muted;
  pointer-events: none;
  transition: color $transition-base $ease-out;
  
  .search-input:focus ~ & {
    color: $color-primary;
  }
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  background: $color-bg-secondary;
  border: 2px solid $color-overlay-white-05;
  border-radius: $radius-full;
  color: $color-text-primary;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  font-family: $font-primary;
  cursor: pointer;
  transition: all $transition-medium $ease-out;
  white-space: nowrap;
  position: relative;
  
  &:hover {
    border-color: $color-overlay-white-10;
    background: $color-bg-tertiary;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &.has-active-filters {
    border-color: $color-primary;
    background: rgba($color-primary, 0.1);
    
    &:hover {
      background: rgba($color-primary, 0.15);
    }
  }
}

.filter-icon {
  width: 20px;
  height: 20px;
  color: $color-text-secondary;
  transition: color $transition-base $ease-out;
  
  .filter-btn:hover & {
    color: $color-primary;
  }
  
  .filter-btn.has-active-filters & {
    color: $color-primary;
  }
}

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: $color-primary;
  color: $color-text-primary;
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  border-radius: $radius-full;
  animation: badge-pop 0.3s $ease-card-hover;
}

@keyframes badge-pop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

// ===== RESPONSIVE =====

@include mobile {
  .filter-bar {
    flex-direction: row;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-lg;
  }
  
  .search-input-wrapper {
    flex: 1;
    max-width: 100%;
  }
  
  .search-input {
    padding: $spacing-md $spacing-md $spacing-md 48px;
    font-size: $font-size-base;
    border-radius: $radius-xl;
    height: 52px;
    
    &::placeholder {
      font-size: $font-size-sm;
    }
  }
  
  .search-icon {
    left: $spacing-md;
    width: 20px;
    height: 20px;
  }
  
  .filter-btn {
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    padding: 0;
    border-radius: $radius-xl;
    justify-content: center;
    
    span {
      display: none;
    }
  }
  
  .filter-icon {
    width: 24px;
    height: 24px;
  }
  
  .badge {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    font-size: 11px;
    font-weight: $font-weight-bold;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

@include tablet {
  .search-input-wrapper {
    max-width: 400px;
  }
}
</style>

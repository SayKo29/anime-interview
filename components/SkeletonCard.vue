<template lang="pug">
article.skeleton-card(
  role="status"
  aria-busy="true"
  aria-label="Loading anime..."
)
  figure.skeleton-card__image(aria-hidden="true")
    span.sr-only Loading image
  header.skeleton-card__content
    span.skeleton-card__title(aria-hidden="true")
    span.skeleton-card__subtitle(aria-hidden="true")
</template>

<style lang="scss" scoped>
.skeleton-card {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: $radius-xl;
  overflow: hidden;
  background: linear-gradient(135deg, $color-bg-primary 0%, $color-bg-secondary 100%);
  box-shadow: $shadow-md;
  display: flex;
  flex-direction: column;

  // Element: Image placeholder
  &__image {
    width: 100%;
    aspect-ratio: 2 / 3;
    background: linear-gradient(
      90deg, 
      $color-bg-secondary 0%, 
      $color-bg-tertiary 50%, 
      $color-bg-secondary 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s $ease-in-out infinite;
    margin: 0;
    position: relative;
  }

  // Element: Content wrapper
  &__content {
    padding: $spacing-md;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  // Element: Title placeholder
  &__title {
    display: block;
    width: 80%;
    height: 20px;
    border-radius: $radius-xs;
    background: linear-gradient(
      90deg, 
      $color-bg-secondary 0%, 
      $color-bg-tertiary 50%, 
      $color-bg-secondary 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s $ease-in-out infinite;
  }

  // Element: Subtitle placeholder
  &__subtitle {
    display: block;
    width: 60%;
    height: 16px;
    border-radius: $radius-xs;
    background: linear-gradient(
      90deg, 
      $color-bg-secondary 0%, 
      $color-bg-tertiary 50%, 
      $color-bg-secondary 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s $ease-in-out infinite;
    animation-delay: 0.2s;
  }
}

// ===== ANIMATIONS =====
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}


// Screen reader only text
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>

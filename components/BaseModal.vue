<template lang="pug">
Teleport(to="body")
  Transition(
    name="modal"
    @after-enter="onAfterEnter"
    @after-leave="onAfterLeave"
  )
    .modal-overlay(
      v-if="modelValue"
      @click.self="closeModal"
      role="dialog"
      :aria-modal="true"
      :aria-labelledby="ariaLabelledby"
    )
      .modal-container(
        ref="modalRef"
        :class="modalClass"
      )
        button.modal-close(
          @click="closeModal"
          aria-label="Close modal"
          type="button"
        )
          svg(
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          )
            line(x1="18" y1="6" x2="6" y2="18")
            line(x1="6" y1="6" x2="18" y2="18")
        .modal-content
          slot
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  modalClass?: string;
  ariaLabelledby?: string;
  closeOnEsc?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modalClass: '',
  ariaLabelledby: 'modal-title',
  closeOnEsc: true
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'opened': [];
  'closed': [];
}>();

const modalRef = ref<HTMLElement | null>(null);

const closeModal = () => {
  emit('update:modelValue', false);
};

const onAfterEnter = () => {
  emit('opened');
  // Focus trap: auto-focus first interactive element
  if (modalRef.value) {
    const focusable = modalRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      (focusable[0] as HTMLElement).focus();
    }
  }
};

const onAfterLeave = () => {
  emit('closed');
};

const handleKeydown = (e: KeyboardEvent) => {
  if (props.closeOnEsc && e.key === 'Escape' && props.modelValue) {
    closeModal();
  }
};

watch(() => props.modelValue, (isOpen) => {
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeydown);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeydown);
    }
  }
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeydown);
  }
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: $z-index-modal;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-lg;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  overflow-y: auto;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  max-height: 90dvh;
  background: $color-bg-secondary;
  border-radius: $radius-2xl;
  border: 1px solid rgba($color-primary, 0.2);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: $spacing-lg;
  right: $spacing-lg;
  z-index: $z-index-tooltip;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($color-bg-primary, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: $radius-full;
  color: $color-text-secondary;
  cursor: pointer;
  transition: all $transition-medium;
  
  &:hover {
    background: rgba($color-error, 0.2);
    border-color: rgba($color-error, 0.3);
    color: $color-error;
    transform: rotate(90deg) scale(1.1);
  }
  
  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-2xl;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba($color-primary, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba($color-primary, 0.5);
    }
  }
}
.modal-enter-active {
  transition: opacity $transition-slow $ease-out;
  
  .modal-container {
    transition: transform $transition-slow $ease-card-hover;
  }
}

.modal-leave-active {
  transition: opacity 0.2s ease-in;
  
  .modal-container {
    transition: transform 0.2s ease-in;
  }
}

.modal-enter-from {
  opacity: 0;
  
  .modal-container {
    transform: scale(0.9) translateY(30px);
  }
}

.modal-leave-to {
  opacity: 0;
  
  .modal-container {
    transform: scale(0.95) translateY(-10px);
  }
}

@include mobile {
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
    justify-content: stretch;
  }
  
  .modal-container {
    max-width: 100%;
    max-height: 95dvh;
    border-radius: $radius-2xl $radius-2xl 0 0;
    border-bottom: none;
    margin: 0;
    
    // Swipe to close indicator
    &::before {
      content: '';
      position: absolute;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      z-index: 1;
    }
  }
  
  .modal-content {
    padding: $spacing-xl $spacing-md;
    padding-bottom: calc($spacing-2xl + env(safe-area-inset-bottom, 20px));
    padding-top: calc($spacing-lg + 20px);
  }

  .modal-close {
    top: $spacing-md;
    right: $spacing-md;
    width: 36px;
    height: 36px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
  
  .modal-enter-from .modal-container,
  .modal-leave-to .modal-container {
    transform: translateY(100%);
  }
}
</style>

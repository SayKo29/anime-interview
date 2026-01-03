/**
 * Tests for useInfiniteScroll Composable
 * 
 * Tests cover:
 * - IntersectionObserver setup
 * - Callback triggering on intersection
 * - Cleanup on unmount
 * - Multiple elements observation
 * - Configuration options
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { useInfiniteScroll } from '@/composables/useInfiniteScroll';

describe('useInfiniteScroll.ts', () => {
  let observeMock: ReturnType<typeof vi.fn>;
  let disconnectMock: ReturnType<typeof vi.fn>;
  let unobserveMock: ReturnType<typeof vi.fn>;
  let mockIntersectionObserver: any;

  beforeEach(() => {
    observeMock = vi.fn();
    disconnectMock = vi.fn();
    unobserveMock = vi.fn();

    // Mock IntersectionObserver
    mockIntersectionObserver = vi.fn((callback, options) => ({
      observe: observeMock,
      disconnect: disconnectMock,
      unobserve: unobserveMock,
      root: options?.root || null,
      rootMargin: options?.rootMargin || '0px',
      thresholds: options?.threshold ? [options.threshold] : [0],
      takeRecords: () => [],
      callback,
      options
    }));

    (global as any).IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create IntersectionObserver on mount', async () => {
    const callbackFn = vi.fn();
    const targetRef = ref<HTMLElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll(callbackFn, targetRef);
        return { targetRef };
      },
      template: '<div ref="targetRef">Test</div>'
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Wait for setTimeout in useInfiniteScroll
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  it('should observe the target element', async () => {
    const callbackFn = vi.fn();
    const targetRef = ref<HTMLElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll(callbackFn, targetRef);
        return { targetRef };
      },
      template: '<div ref="targetRef">Test</div>'
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Wait for setTimeout
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(observeMock).toHaveBeenCalledWith(wrapper.element);
  });

  it('should call callback when element intersects', async () => {
    const callbackFn = vi.fn();
    const targetRef = ref<HTMLElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll(callbackFn, targetRef);
        return { targetRef };
      },
      template: '<div ref="targetRef">Test</div>'
    });

    mount(TestComponent);
    await new Promise(resolve => setTimeout(resolve, 150));

    // Get the IntersectionObserver callback
    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    // Simulate intersection
    observerCallback([
      {
        isIntersecting: true,
        target: document.createElement('div'),
        intersectionRatio: 0.5
      }
    ]);

    expect(callbackFn).toHaveBeenCalledTimes(1);
  });

  it('should not call callback when element is not intersecting', async () => {
    const callbackFn = vi.fn();
    const targetRef = ref<HTMLElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll(callbackFn, targetRef);
        return { targetRef };
      },
      template: '<div ref="targetRef">Test</div>'
    });

    mount(TestComponent);
    await new Promise(resolve => setTimeout(resolve, 150));

    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    // Simulate no intersection
    observerCallback([
      {
        isIntersecting: false,
        target: document.createElement('div'),
        intersectionRatio: 0
      }
    ]);

    expect(callbackFn).not.toHaveBeenCalled();
  });

  it('should use correct IntersectionObserver options', async () => {
    const callbackFn = vi.fn();
    const targetRef = ref<HTMLElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll(callbackFn, targetRef);
        return { targetRef };
      },
      template: '<div ref="targetRef">Test</div>'
    });

    mount(TestComponent);
    await new Promise(resolve => setTimeout(resolve, 150));

    const options = mockIntersectionObserver.mock.calls[0][1];

    expect(options).toEqual({
      rootMargin: '100px',
      threshold: 0.1
    });
  });

  it('should disconnect observer on unmount', async () => {
    const callbackFn = vi.fn();
    const targetRef = ref<HTMLElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll(callbackFn, targetRef);
        return { targetRef };
      },
      template: '<div ref="targetRef">Test</div>'
    });

    const wrapper = mount(TestComponent);
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(disconnectMock).not.toHaveBeenCalled();

    wrapper.unmount();

    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });

  it('should not create observer if target is null', async () => {
    const callbackFn = vi.fn();
    const targetRef = ref<HTMLElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll(callbackFn, targetRef);
        return {};
      },
      template: '<div>Test</div>'
    });

    mount(TestComponent);
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(observeMock).not.toHaveBeenCalled();
  });

  it('should handle multiple intersection events', async () => {
    const callbackFn = vi.fn();
    const targetRef = ref<HTMLElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll(callbackFn, targetRef);
        return { targetRef };
      },
      template: '<div ref="targetRef">Test</div>'
    });

    mount(TestComponent);
    await new Promise(resolve => setTimeout(resolve, 150));

    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    // Simulate multiple intersections
    observerCallback([{ isIntersecting: true, target: document.createElement('div') }]);
    observerCallback([{ isIntersecting: true, target: document.createElement('div') }]);
    observerCallback([{ isIntersecting: true, target: document.createElement('div') }]);

    expect(callbackFn).toHaveBeenCalledTimes(3);
  });

  it('should only process first entry in entries array', async () => {
    const callbackFn = vi.fn();
    const targetRef = ref<HTMLElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll(callbackFn, targetRef);
        return { targetRef };
      },
      template: '<div ref="targetRef">Test</div>'
    });

    mount(TestComponent);
    await new Promise(resolve => setTimeout(resolve, 150));

    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    // Simulate multiple entries
    observerCallback([
      { isIntersecting: true, target: document.createElement('div') },
      { isIntersecting: false, target: document.createElement('div') },
      { isIntersecting: true, target: document.createElement('div') }
    ]);

    // Should only call callback once for the first entry
    expect(callbackFn).toHaveBeenCalledTimes(1);
  });

  it('should not throw error on server-side (import.meta.server)', async () => {
    // Mock server environment
    const originalMeta = import.meta;
    Object.defineProperty(import.meta, 'server', {
      value: true,
      configurable: true
    });

    const callbackFn = vi.fn();
    const targetRef = ref<HTMLElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll(callbackFn, targetRef);
        return { targetRef };
      },
      template: '<div ref="targetRef">Test</div>'
    });

    expect(() => mount(TestComponent)).not.toThrow();

    // Restore
    Object.defineProperty(import.meta, 'server', {
      value: false,
      configurable: true
    });
  });

  it('should handle rapid ref changes', async () => {
    const callbackFn = vi.fn();
    const targetRef = ref<HTMLElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll(callbackFn, targetRef);
        return { targetRef };
      },
      template: '<div ref="targetRef">Test</div>'
    });

    const wrapper = mount(TestComponent);
    await new Promise(resolve => setTimeout(resolve, 150));

    // Change ref multiple times
    targetRef.value = document.createElement('div');
    await wrapper.vm.$nextTick();
    
    targetRef.value = document.createElement('div');
    await wrapper.vm.$nextTick();

    // Should still work without errors
    expect(disconnectMock).toHaveBeenCalledTimes(0);
  });

  it('should cleanup observer properly when disconnecting', async () => {
    const callbackFn = vi.fn();
    const targetRef = ref<HTMLElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll(callbackFn, targetRef);
        return { targetRef };
      },
      template: '<div ref="targetRef">Test</div>'
    });

    const wrapper = mount(TestComponent);
    await new Promise(resolve => setTimeout(resolve, 150));

    wrapper.unmount();

    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });

  it('should handle edge case with threshold at boundary', async () => {
    const callbackFn = vi.fn();
    const targetRef = ref<HTMLElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll(callbackFn, targetRef);
        return { targetRef };
      },
      template: '<div ref="targetRef">Test</div>'
    });

    mount(TestComponent);
    await new Promise(resolve => setTimeout(resolve, 150));

    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    // Simulate intersection exactly at threshold
    observerCallback([
      {
        isIntersecting: true,
        intersectionRatio: 0.1,
        target: document.createElement('div')
      }
    ]);

    expect(callbackFn).toHaveBeenCalledTimes(1);
  });
});

import { watch, getCurrentInstance, onMounted, onBeforeUnmount, ref, computed, reactive, provide, h, inject } from 'vue';
import { g as createComponent, k as listenOpts, B as noop, v as isRuntimeSsrPreHydration, l as layoutKey, j as emptyRenderFn, p as pageContainerKey } from '../build/server.mjs';
import { s as scrollTargetProp, b as getScrollTarget, a as getVerticalScrollPosition, g as getHorizontalScrollPosition, d as getScrollbarWidth } from './scroll.mjs';
import { Q as QResizeObserver } from './QResizeObserver.mjs';
import { b as hMergeSlot, h as hSlot } from './render.mjs';

const { passive } = listenOpts;
const axisValues = [ 'both', 'horizontal', 'vertical' ];

const QScrollObserver = createComponent({
  name: 'QScrollObserver',

  props: {
    axis: {
      type: String,
      validator: v => axisValues.includes(v),
      default: 'vertical'
    },

    debounce: [ String, Number ],

    scrollTarget: scrollTargetProp
  },

  emits: [ 'scroll' ],

  setup (props, { emit }) {
    const scroll = {
      position: {
        top: 0,
        left: 0
      },

      direction: 'down',
      directionChanged: false,

      delta: {
        top: 0,
        left: 0
      },

      inflectionPoint: {
        top: 0,
        left: 0
      }
    };

    let clearTimer = null, localScrollTarget, parentEl;

    watch(() => props.scrollTarget, () => {
      unconfigureScrollTarget();
      configureScrollTarget();
    });

    function emitEvent () {
      clearTimer?.();

      const top = Math.max(0, getVerticalScrollPosition(localScrollTarget));
      const left = getHorizontalScrollPosition(localScrollTarget);

      const delta = {
        top: top - scroll.position.top,
        left: left - scroll.position.left
      };

      if (
        (props.axis === 'vertical' && delta.top === 0)
        || (props.axis === 'horizontal' && delta.left === 0)
      ) return

      const curDir = Math.abs(delta.top) >= Math.abs(delta.left)
        ? (delta.top < 0 ? 'up' : 'down')
        : (delta.left < 0 ? 'left' : 'right');

      scroll.position = { top, left };
      scroll.directionChanged = scroll.direction !== curDir;
      scroll.delta = delta;

      if (scroll.directionChanged === true) {
        scroll.direction = curDir;
        scroll.inflectionPoint = scroll.position;
      }

      emit('scroll', { ...scroll });
    }

    function configureScrollTarget () {
      localScrollTarget = getScrollTarget(parentEl, props.scrollTarget);
      localScrollTarget.addEventListener('scroll', trigger, passive);
      trigger(true);
    }

    function unconfigureScrollTarget () {
      if (localScrollTarget !== void 0) {
        localScrollTarget.removeEventListener('scroll', trigger, passive);
        localScrollTarget = void 0;
      }
    }

    function trigger (immediately) {
      if (immediately === true || props.debounce === 0 || props.debounce === '0') {
        emitEvent();
      }
      else if (clearTimer === null) {
        const [ timer, fn ] = props.debounce
          ? [ setTimeout(emitEvent, props.debounce), clearTimeout ]
          : [ requestAnimationFrame(emitEvent), cancelAnimationFrame ];

        clearTimer = () => {
          fn(timer);
          clearTimer = null;
        };
      }
    }

    const { proxy } = getCurrentInstance();

    watch(() => proxy.$q.lang.rtl, emitEvent);

    onMounted(() => {
      parentEl = proxy.$el.parentNode;
      configureScrollTarget();
    });

    onBeforeUnmount(() => {
      clearTimer?.();
      unconfigureScrollTarget();
    });

    // expose public methods
    Object.assign(proxy, {
      trigger,
      getPosition: () => scroll
    });

    return noop
  }
});

const __nuxt_component_0 = createComponent({
  name: 'QLayout',

  props: {
    container: Boolean,
    view: {
      type: String,
      default: 'hhh lpr fff',
      validator: v => /^(h|l)h(h|r) lpr (f|l)f(f|r)$/.test(v.toLowerCase())
    },

    onScroll: Function,
    onScrollHeight: Function,
    onResize: Function
  },

  setup (props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance();

    const rootRef = ref(null);

    // page related
    const height = ref($q.screen.height);
    const width = ref(props.container === true ? 0 : $q.screen.width);
    const scroll = ref({ position: 0, direction: 'down', inflectionPoint: 0 });

    // container only prop
    const containerHeight = ref(0);
    const scrollbarWidth = ref(isRuntimeSsrPreHydration.value === true ? 0 : getScrollbarWidth());

    const classes = computed(() =>
      'q-layout q-layout--'
      + (props.container === true ? 'containerized' : 'standard')
    );

    const style = computed(() => (
      props.container === false
        ? { minHeight: $q.screen.height + 'px' }
        : null
    ));

    // used by container only
    const targetStyle = computed(() => (
      scrollbarWidth.value !== 0
        ? { [ $q.lang.rtl === true ? 'left' : 'right' ]: `${ scrollbarWidth.value }px` }
        : null
    ));

    const targetChildStyle = computed(() => (
      scrollbarWidth.value !== 0
        ? {
            [ $q.lang.rtl === true ? 'right' : 'left' ]: 0,
            [ $q.lang.rtl === true ? 'left' : 'right' ]: `-${ scrollbarWidth.value }px`,
            width: `calc(100% + ${ scrollbarWidth.value }px)`
          }
        : null
    ));

    function onPageScroll (data) {
      if (props.container === true || document.qScrollPrevented !== true) {
        const info = {
          position: data.position.top,
          direction: data.direction,
          directionChanged: data.directionChanged,
          inflectionPoint: data.inflectionPoint.top,
          delta: data.delta.top
        };

        scroll.value = info;
        props.onScroll !== void 0 && emit('scroll', info);
      }
    }

    function onPageResize (data) {
      const { height: newHeight, width: newWidth } = data;
      let resized = false;

      if (height.value !== newHeight) {
        resized = true;
        height.value = newHeight;
        props.onScrollHeight !== void 0 && emit('scrollHeight', newHeight);
        updateScrollbarWidth();
      }
      if (width.value !== newWidth) {
        resized = true;
        width.value = newWidth;
      }

      if (resized === true && props.onResize !== void 0) {
        emit('resize', data);
      }
    }

    function onContainerResize ({ height }) {
      if (containerHeight.value !== height) {
        containerHeight.value = height;
        updateScrollbarWidth();
      }
    }

    function updateScrollbarWidth () {
      if (props.container === true) {
        const width = height.value > containerHeight.value
          ? getScrollbarWidth()
          : 0;

        if (scrollbarWidth.value !== width) {
          scrollbarWidth.value = width;
        }
      }
    }

    let animateTimer = null;

    const $layout = {
      instances: {},
      view: computed(() => props.view),
      isContainer: computed(() => props.container),

      rootRef,

      height,
      containerHeight,
      scrollbarWidth,
      totalWidth: computed(() => width.value + scrollbarWidth.value),

      rows: computed(() => {
        const rows = props.view.toLowerCase().split(' ');
        return {
          top: rows[ 0 ].split(''),
          middle: rows[ 1 ].split(''),
          bottom: rows[ 2 ].split('')
        }
      }),

      header: reactive({ size: 0, offset: 0, space: false }),
      right: reactive({ size: 300, offset: 0, space: false }),
      footer: reactive({ size: 0, offset: 0, space: false }),
      left: reactive({ size: 300, offset: 0, space: false }),

      scroll,

      animate () {
        if (animateTimer !== null) {
          clearTimeout(animateTimer);
        }
        else {
          document.body.classList.add('q-body--layout-animate');
        }

        animateTimer = setTimeout(() => {
          animateTimer = null;
          document.body.classList.remove('q-body--layout-animate');
        }, 155);
      },

      update (part, prop, val) {
        $layout[ part ][ prop ] = val;
      }
    };

    provide(layoutKey, $layout);

    return () => {
      const content = hMergeSlot(slots.default, [
        h(QScrollObserver, { onScroll: onPageScroll }),
        h(QResizeObserver, { onResize: onPageResize })
      ]);

      const layout = h('div', {
        class: classes.value,
        style: style.value,
        ref: props.container === true ? void 0 : rootRef,
        tabindex: -1
      }, content);

      if (props.container === true) {
        return h('div', {
          class: 'q-layout-container overflow-hidden',
          ref: rootRef
        }, [
          h(QResizeObserver, { onResize: onContainerResize }),
          h('div', {
            class: 'absolute-full',
            style: targetStyle.value
          }, [
            h('div', {
              class: 'scroll',
              style: targetChildStyle.value
            }, [ layout ])
          ])
        ])
      }

      return layout
    }
  }
});

const __nuxt_component_3 = createComponent({
  name: 'QPageContainer',

  setup (_, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();

    const $layout = inject(layoutKey, emptyRenderFn);
    if ($layout === emptyRenderFn) {
      console.error('QPageContainer needs to be child of QLayout');
      return emptyRenderFn
    }

    provide(pageContainerKey, true);

    const style = computed(() => {
      const css = {};

      if ($layout.header.space === true) {
        css.paddingTop = `${ $layout.header.size }px`;
      }
      if ($layout.right.space === true) {
        css[ `padding${ $q.lang.rtl === true ? 'Left' : 'Right' }` ] = `${ $layout.right.size }px`;
      }
      if ($layout.footer.space === true) {
        css.paddingBottom = `${ $layout.footer.size }px`;
      }
      if ($layout.left.space === true) {
        css[ `padding${ $q.lang.rtl === true ? 'Right' : 'Left' }` ] = `${ $layout.left.size }px`;
      }

      return css
    });

    return () => h('div', {
      class: 'q-page-container',
      style: style.value
    }, hSlot(slots.default))
  }
});

export { __nuxt_component_0 as _, __nuxt_component_3 as a };
//# sourceMappingURL=QPageContainer.mjs.map

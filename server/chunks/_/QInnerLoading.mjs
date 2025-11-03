import { onBeforeUnmount, getCurrentInstance, ref, computed, watch, onMounted, onBeforeUpdate, inject, nextTick, onDeactivated, onActivated, h, Transition, provide, onBeforeMount, onUpdated } from 'vue';
import { q as client, k as listenOpts, s as stopAndPrevent, t as getEventPath, H as History, g as createComponent, v as isRuntimeSsrPreHydration, w as formKey, m as prevent, x as isDeepEqual, o as stop, y as isNumber, z as isDate, A as isObject } from '../build/server.mjs';
import { u as useModelToggleEmits, b as useTransitionProps, c as useModelToggleProps, d as useTransition, e as usePortal, f as useModelToggle, g as addFocusout, h as addEscapeKey, r as removeFocusout, i as removeEscapeKey, j as addFocusFn, k as removeFocusFn, l as __nuxt_component_4$2, _ as __nuxt_component_6, a as __nuxt_component_7, m as __nuxt_component_5$1 } from './QList.mjs';
import { h as hSlot, a as hDir, c as hMergeSlotSafely, b as hMergeSlot, d as hUniqueSlot } from './render.mjs';
import { Q as QSpinner, v as vmIsDestroyed, R as Ripple, s as shouldIgnoreKey, i as isKeyCode, b as vmHasRouter, _ as __nuxt_component_8 } from './QBtn.mjs';
import { _ as __nuxt_component_4$1, a as useSizeProps, b as useSize } from './QIcon.mjs';
import { _ as __nuxt_component_3 } from './QSeparator.mjs';
import { u as useDarkProps, a as useDark } from './use-dark.mjs';
import { g as getHorizontalScrollPosition, a as getVerticalScrollPosition, h as hasScrollbar, c as childHasFocus, s as scrollTargetProp, b as getScrollTarget } from './scroll.mjs';
import { u as useTimeout, a as useTick, b as uid } from './uid.mjs';
import { u as useCheckboxEmits, a as useCheckboxProps, b as useCheckbox, c as useFormProps, d as useFormInputNameAttr } from './use-checkbox.mjs';

function injectProp (target, propName, get, set) {
  Object.defineProperty(target, propName, {
    get,
    set,
    enumerable: true
  });
  return target
}

function injectMultipleProps (target, props) {
  for (const key in props) {
    injectProp(target, key, props[ key ]);
  }
  return target
}

function debounce (fn, wait = 250, immediate) {
  let timer = null;

  function debounced (/* ...args */) {
    const args = arguments;

    const later = () => {
      timer = null;
      {
        fn.apply(this, args);
      }
    };

    if (timer !== null) {
      clearTimeout(timer);
    }
    else if (immediate === true) {
      fn.apply(this, args);
    }

    timer = setTimeout(later, wait);
  }

  debounced.cancel = () => {
    timer !== null && clearTimeout(timer);
  };

  return debounced
}

let
  registered = 0,
  scrollPositionX,
  scrollPositionY,
  maxScrollTop,
  vpPendingUpdate = false,
  bodyLeft,
  bodyTop,
  href,
  closeTimer = null;

function onWheel (e) {
  if (shouldPreventScroll(e)) {
    stopAndPrevent(e);
  }
}

function shouldPreventScroll (e) {
  if (e.target === document.body || e.target.classList.contains('q-layout__backdrop')) {
    return true
  }

  const
    path = getEventPath(e),
    shift = e.shiftKey && !e.deltaX,
    scrollY = !shift && Math.abs(e.deltaX) <= Math.abs(e.deltaY),
    delta = shift || scrollY ? e.deltaY : e.deltaX;

  for (let index = 0; index < path.length; index++) {
    const el = path[ index ];

    if (hasScrollbar(el, scrollY)) {
      return scrollY
        ? (
            delta < 0 && el.scrollTop === 0
              ? true
              : delta > 0 && el.scrollTop + el.clientHeight === el.scrollHeight
          )
        : (
            delta < 0 && el.scrollLeft === 0
              ? true
              : delta > 0 && el.scrollLeft + el.clientWidth === el.scrollWidth
          )
    }
  }

  return true
}

function onAppleScroll (e) {
  if (e.target === document) {
    // required, otherwise iOS blocks further scrolling
    // until the mobile scrollbar dissappears
    document.scrollingElement.scrollTop = document.scrollingElement.scrollTop; // eslint-disable-line
  }
}

function onAppleResize (evt) {
  if (vpPendingUpdate === true) return

  vpPendingUpdate = true;

  requestAnimationFrame(() => {
    vpPendingUpdate = false;

    const
      { height } = evt.target,
      { clientHeight, scrollTop } = document.scrollingElement;

    if (maxScrollTop === void 0 || height !== window.innerHeight) {
      maxScrollTop = clientHeight - height;
      document.scrollingElement.scrollTop = scrollTop;
    }

    if (scrollTop > maxScrollTop) {
      document.scrollingElement.scrollTop -= Math.ceil((scrollTop - maxScrollTop) / 8);
    }
  });
}

function apply (action) {
  const
    body = document.body,
    hasViewport = window.visualViewport !== void 0;

  if (action === 'add') {
    const { overflowY, overflowX } = window.getComputedStyle(body);

    scrollPositionX = getHorizontalScrollPosition(window);
    scrollPositionY = getVerticalScrollPosition(window);
    bodyLeft = body.style.left;
    bodyTop = body.style.top;

    href = window.location.href;

    body.style.left = `-${ scrollPositionX }px`;
    body.style.top = `-${ scrollPositionY }px`;

    if (overflowX !== 'hidden' && (overflowX === 'scroll' || body.scrollWidth > window.innerWidth)) {
      body.classList.add('q-body--force-scrollbar-x');
    }
    if (overflowY !== 'hidden' && (overflowY === 'scroll' || body.scrollHeight > window.innerHeight)) {
      body.classList.add('q-body--force-scrollbar-y');
    }

    body.classList.add('q-body--prevent-scroll');
    document.qScrollPrevented = true;

    if (client.is.ios === true) {
      if (hasViewport === true) {
        window.scrollTo(0, 0);
        window.visualViewport.addEventListener('resize', onAppleResize, listenOpts.passiveCapture);
        window.visualViewport.addEventListener('scroll', onAppleResize, listenOpts.passiveCapture);
        window.scrollTo(0, 0);
      }
      else {
        window.addEventListener('scroll', onAppleScroll, listenOpts.passiveCapture);
      }
    }
  }

  if (client.is.desktop === true && client.is.mac === true) {
    // ref. https://developers.google.com/web/updates/2017/01/scrolling-intervention
    window[ `${ action }EventListener` ]('wheel', onWheel, listenOpts.notPassive);
  }

  if (action === 'remove') {
    if (client.is.ios === true) {
      if (hasViewport === true) {
        window.visualViewport.removeEventListener('resize', onAppleResize, listenOpts.passiveCapture);
        window.visualViewport.removeEventListener('scroll', onAppleResize, listenOpts.passiveCapture);
      }
      else {
        window.removeEventListener('scroll', onAppleScroll, listenOpts.passiveCapture);
      }
    }

    body.classList.remove('q-body--prevent-scroll');
    body.classList.remove('q-body--force-scrollbar-x');
    body.classList.remove('q-body--force-scrollbar-y');

    document.qScrollPrevented = false;

    body.style.left = bodyLeft;
    body.style.top = bodyTop;

    // scroll back only if route has not changed
    if (window.location.href === href) {
      window.scrollTo(scrollPositionX, scrollPositionY);
    }

    maxScrollTop = void 0;
  }
}

function preventScroll (state) {
  let action = 'add';

  if (state === true) {
    registered++;

    if (closeTimer !== null) {
      clearTimeout(closeTimer);
      closeTimer = null;
      return
    }

    if (registered > 1) return
  }
  else {
    if (registered === 0) return

    registered--;

    if (registered > 0) return

    action = 'remove';

    if (client.is.ios === true && client.is.nativeMobile === true) {
      closeTimer !== null && clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        apply(action);
        closeTimer = null;
      }, 100);
      return
    }
  }

  apply(action);
}

function useHistory (showing, hide, hideOnRouteChange) {
  let historyEntry;

  function removeFromHistory () {
    if (historyEntry !== void 0) {
      History.remove(historyEntry);
      historyEntry = void 0;
    }
  }

  onBeforeUnmount(() => {
    showing.value === true && removeFromHistory();
  });

  return {
    removeFromHistory,

    addToHistory () {
      historyEntry = {
        condition: () => hideOnRouteChange.value === true,
        handler: hide
      };

      History.add(historyEntry);
    }
  }
}

function usePreventScroll () {
  let currentState;

  return {
    preventBodyScroll (state) {
      if (
        state !== currentState
        && (currentState !== void 0 || state === true)
      ) {
        currentState = state;
        preventScroll(state);
      }
    }
  }
}

let maximizedModals = 0;

const positionClass = {
  standard: 'fixed-full flex-center',
  top: 'fixed-top justify-center',
  bottom: 'fixed-bottom justify-center',
  right: 'fixed-right items-center',
  left: 'fixed-left items-center'
};

const defaultTransitions = {
  standard: [ 'scale', 'scale' ],
  top: [ 'slide-down', 'slide-up' ],
  bottom: [ 'slide-up', 'slide-down' ],
  right: [ 'slide-left', 'slide-right' ],
  left: [ 'slide-right', 'slide-left' ]
};

const __nuxt_component_1 = createComponent({
  name: 'QDialog',

  inheritAttrs: false,

  props: {
    ...useModelToggleProps,
    ...useTransitionProps,

    transitionShow: String, // override useTransitionProps
    transitionHide: String, // override useTransitionProps

    persistent: Boolean,
    autoClose: Boolean,
    allowFocusOutside: Boolean,

    noEscDismiss: Boolean,
    noBackdropDismiss: Boolean,
    noRouteDismiss: Boolean,
    noRefocus: Boolean,
    noFocus: Boolean,
    noShake: Boolean,

    seamless: Boolean,

    maximized: Boolean,
    fullWidth: Boolean,
    fullHeight: Boolean,

    square: Boolean,

    backdropFilter: String,

    position: {
      type: String,
      default: 'standard',
      validator: val => [ 'standard', 'top', 'bottom', 'left', 'right' ].includes(val)
    }
  },

  emits: [
    ...useModelToggleEmits,
    'shake', 'click', 'escapeKey'
  ],

  setup (props, { slots, emit, attrs }) {
    const vm = getCurrentInstance();

    const innerRef = ref(null);
    const showing = ref(false);
    const animating = ref(false);

    let shakeTimeout = null, refocusTarget = null, isMaximized, avoidAutoClose;

    const hideOnRouteChange = computed(() =>
      props.persistent !== true
      && props.noRouteDismiss !== true
      && props.seamless !== true
    );

    const { preventBodyScroll } = usePreventScroll();
    const { registerTimeout } = useTimeout();
    const { registerTick, removeTick } = useTick();

    const { transitionStyle } = useTransition(
      props,
      () => defaultTransitions[ props.position ][ 0 ],
      () => defaultTransitions[ props.position ][ 1 ]
    );

    computed(() => (
      transitionStyle.value
      + (
        props.backdropFilter !== void 0
          // Safari requires the -webkit prefix
          ? `;backdrop-filter:${ props.backdropFilter };-webkit-backdrop-filter:${ props.backdropFilter }`
          : ''
      )
    ));

    const { showPortal, hidePortal, portalIsAccessible, renderPortal } = usePortal();

    const { hide } = useModelToggle({
      showing,
      hideOnRouteChange,
      handleShow,
      handleHide,
      processOnMount: true
    });

    const { addToHistory, removeFromHistory } = useHistory(showing, hide, hideOnRouteChange);

    computed(() =>
      'q-dialog__inner flex no-pointer-events'
      + ` q-dialog__inner--${ props.maximized === true ? 'maximized' : 'minimized' }`
      + ` q-dialog__inner--${ props.position } ${ positionClass[ props.position ] }`
      + (animating.value === true ? ' q-dialog__inner--animating' : '')
      + (props.fullWidth === true ? ' q-dialog__inner--fullwidth' : '')
      + (props.fullHeight === true ? ' q-dialog__inner--fullheight' : '')
      + (props.square === true ? ' q-dialog__inner--square' : '')
    );

    const useBackdrop = computed(() => showing.value === true && props.seamless !== true);

    computed(() => (
      props.autoClose === true
        ? { onClick: onAutoClose }
        : {}
    ));

    computed(() => [
      'q-dialog fullscreen no-pointer-events '
        + `q-dialog--${ useBackdrop.value === true ? 'modal' : 'seamless' }`,
      attrs.class
    ]);

    watch(() => props.maximized, state => {
      showing.value === true && updateMaximized(state);
    });

    watch(useBackdrop, val => {
      preventBodyScroll(val);

      if (val === true) {
        addFocusout(onFocusChange);
        addEscapeKey(onEscapeKey);
      }
      else {
        removeFocusout(onFocusChange);
        removeEscapeKey(onEscapeKey);
      }
    });

    function handleShow (evt) {
      addToHistory();

      refocusTarget = props.noRefocus === false && document.activeElement !== null
        ? document.activeElement
        : null;

      updateMaximized(props.maximized);
      showPortal();
      animating.value = true;

      if (props.noFocus !== true) {
        document.activeElement?.blur();
        registerTick(focus);
      }
      else {
        removeTick();
      }

      // should removeTimeout() if this gets removed
      registerTimeout(() => {
        if (vm.proxy.$q.platform.is.ios === true) {
          if (props.seamless !== true && document.activeElement) {
            const
              { top, bottom } = document.activeElement.getBoundingClientRect(),
              { innerHeight } = window,
              height = window.visualViewport !== void 0
                ? window.visualViewport.height
                : innerHeight;

            if (top > 0 && bottom > height / 2) {
              document.scrollingElement.scrollTop = Math.min(
                document.scrollingElement.scrollHeight - height,
                bottom >= innerHeight
                  ? Infinity
                  : Math.ceil(document.scrollingElement.scrollTop + bottom - height / 2)
              );
            }

            document.activeElement.scrollIntoView();
          }

          // required in order to avoid the "double-tap needed" issue
          avoidAutoClose = true;
          innerRef.value.click();
          avoidAutoClose = false;
        }

        showPortal(true); // done showing portal
        animating.value = false;
        emit('show', evt);
      }, props.transitionDuration);
    }

    function handleHide (evt) {
      removeTick();
      removeFromHistory();
      cleanup(true);
      animating.value = true;
      hidePortal();

      if (refocusTarget !== null) {
        ((evt?.type.indexOf('key') === 0
          ? refocusTarget.closest('[tabindex]:not([tabindex^="-"])')
          : void 0
        ) || refocusTarget).focus();

        refocusTarget = null;
      }

      // should removeTimeout() if this gets removed
      registerTimeout(() => {
        hidePortal(true); // done hiding, now destroy
        animating.value = false;
        emit('hide', evt);
      }, props.transitionDuration);
    }

    function focus (selector) {
      addFocusFn(() => {
        let node = innerRef.value;

        if (node === null) return

        if (selector !== void 0) {
          const target = node.querySelector(selector);
          if (target !== null) {
            target.focus({ preventScroll: true });
            return
          }
        }

        if (node.contains(document.activeElement) !== true) {
          node = (
            node.querySelector('[autofocus][tabindex], [data-autofocus][tabindex]')
            || node.querySelector('[autofocus] [tabindex], [data-autofocus] [tabindex]')
            || node.querySelector('[autofocus], [data-autofocus]')
            || node
          );

          node.focus({ preventScroll: true });
        }
      });
    }

    function shake (focusTarget) {
      if (focusTarget && typeof focusTarget.focus === 'function') {
        focusTarget.focus({ preventScroll: true });
      }
      else {
        focus();
      }

      emit('shake');

      const node = innerRef.value;

      if (node !== null) {
        node.classList.remove('q-animate--scale');
        node.classList.add('q-animate--scale');
        shakeTimeout !== null && clearTimeout(shakeTimeout);
        shakeTimeout = setTimeout(() => {
          shakeTimeout = null;
          if (innerRef.value !== null) {
            node.classList.remove('q-animate--scale');
            // some platforms (like desktop Chrome)
            // require calling focus() again
            focus();
          }
        }, 170);
      }
    }

    function onEscapeKey () {
      if (props.seamless !== true) {
        if (props.persistent === true || props.noEscDismiss === true) {
          props.maximized !== true && props.noShake !== true && shake();
        }
        else {
          emit('escapeKey');
          hide();
        }
      }
    }

    function cleanup (hiding) {
      if (shakeTimeout !== null) {
        clearTimeout(shakeTimeout);
        shakeTimeout = null;
      }

      if (hiding === true || showing.value === true) {
        updateMaximized(false);

        if (props.seamless !== true) {
          preventBodyScroll(false);
          removeFocusout(onFocusChange);
          removeEscapeKey(onEscapeKey);
        }
      }

      if (hiding !== true) {
        refocusTarget = null;
      }
    }

    function updateMaximized (active) {
      if (active === true) {
        if (isMaximized !== true) {
          maximizedModals < 1 && document.body.classList.add('q-body--dialog');
          maximizedModals++;

          isMaximized = true;
        }
      }
      else if (isMaximized === true) {
        if (maximizedModals < 2) {
          document.body.classList.remove('q-body--dialog');
        }

        maximizedModals--;
        isMaximized = false;
      }
    }

    function onAutoClose (e) {
      if (avoidAutoClose !== true) {
        hide(e);
        emit('click', e);
      }
    }

    function onFocusChange (evt) {
      // the focus is not in a vue child component
      if (
        props.allowFocusOutside !== true
        && portalIsAccessible.value === true
        && childHasFocus(innerRef.value, evt.target) !== true
      ) {
        focus('[tabindex]:not([tabindex="-1"])');
      }
    }

    Object.assign(vm.proxy, {
      // expose public methods
      focus, shake,

      // private but needed by QSelect
      __updateRefocusTarget (target) {
        refocusTarget = target || null;
      }
    });

    onBeforeUnmount(cleanup);

    return renderPortal
  }
});

function parseValue (val) {
  return val === void 0 || val === null
    ? null
    : val
}

function getId (val, required) {
  return val === void 0 || val === null
    ? (required === true ? `f_${ uid() }` : null)
    : val
}

/**
 * Returns an "id" which is a ref() that can be used as
 * a unique identifier to apply to a DOM node attribute.
 *
 * On SSR, it takes care of generating the id on the client side (only) to
 * avoid hydration errors.
 */
function useId ({ getValue, required = true } = {}) {
  if (isRuntimeSsrPreHydration.value === true) {
    const id = getValue !== void 0
      ? ref(parseValue(getValue()))
      : ref(null);

    if (required === true && id.value === null) {
      onMounted(() => {
        id.value = `f_${ uid() }`; // getId(null, true)
      });
    }

    if (getValue !== void 0) {
      watch(getValue, newId => {
        id.value = getId(newId, required);
      });
    }

    return id
  }

  return getValue !== void 0
    ? computed(() => getId(getValue(), required))
    : ref(`f_${ uid() }`) // getId(null, true)
}

const listenerRE = /^on[A-Z]/;

function useSplitAttrs () {
  const { attrs, vnode } = getCurrentInstance();

  const acc = {
    listeners: ref({}),
    attributes: ref({})
  };

  function update () {
    const attributes = {};
    const listeners = {};

    for (const key in attrs) {
      if (key !== 'class' && key !== 'style' && listenerRE.test(key) === false) {
        attributes[ key ] = attrs[ key ];
      }
    }

    for (const key in vnode.props) {
      if (listenerRE.test(key) === true) {
        listeners[ key ] = vnode.props[ key ];
      }
    }

    acc.attributes.value = attributes;
    acc.listeners.value = listeners;
  }

  onBeforeUpdate(update);

  update();

  return acc
}

function useFormChild ({ validate, resetValidation, requiresQForm }) {
  const $form = inject(formKey, false);

  if ($form !== false) {
    const { props, proxy } = getCurrentInstance();

    // export public method (so it can be used in QForm)
    Object.assign(proxy, { validate, resetValidation });

    watch(() => props.disable, val => {
      if (val === true) {
        typeof resetValidation === 'function' && resetValidation();
        $form.unbindComponent(proxy);
      }
      else {
        $form.bindComponent(proxy);
      }
    });

    onMounted(() => {
      // register to parent QForm
      props.disable !== true && $form.bindComponent(proxy);
    });

    onBeforeUnmount(() => {
      // un-register from parent QForm
      props.disable !== true && $form.unbindComponent(proxy);
    });
  }
  else if (requiresQForm === true) {
    console.error('Parent QForm not found on useFormChild()!');
  }
}

// file referenced from docs

const
  hex = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/,
  hexa = /^#[0-9a-fA-F]{4}([0-9a-fA-F]{4})?$/,
  hexOrHexa = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
  rgb = /^rgb\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5])\)$/,
  rgba = /^rgba\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),(0|0\.[0-9]+[1-9]|0\.[1-9]+|1)\)$/;

// Keep in sync with ui/types/api/validation.d.ts
const testPattern = {
  date: v => /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(v),
  time: v => /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(v),
  fulltime: v => /^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(v),
  timeOrFulltime: v => /^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(v),

  // -- RFC 5322 --
  // -- Added in v2.6.6 --
  // This is a basic helper validation.
  // For something more complex (like RFC 822) you should write and use your own rule.
  // We won't be accepting PRs to enhance the one below because of the reason above.
  // eslint-disable-next-line
  email: v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),

  hexColor: v => hex.test(v),
  hexaColor: v => hexa.test(v),
  hexOrHexaColor: v => hexOrHexa.test(v),

  rgbColor: v => rgb.test(v),
  rgbaColor: v => rgba.test(v),
  rgbOrRgbaColor: v => rgb.test(v) || rgba.test(v),

  hexOrRgbColor: v => hex.test(v) || rgb.test(v),
  hexaOrRgbaColor: v => hexa.test(v) || rgba.test(v),
  anyColor: v => hexOrHexa.test(v) || rgb.test(v) || rgba.test(v)
};

const lazyRulesValues = [ true, false, 'ondemand' ];

const useValidateProps = {
  modelValue: {},

  error: {
    type: Boolean,
    default: null
  },
  errorMessage: String,
  noErrorIcon: Boolean,

  rules: Array,
  reactiveRules: Boolean,
  lazyRules: {
    type: [ Boolean, String ],
    default: false, // statement unneeded but avoids future vue implementation changes
    validator: v => lazyRulesValues.includes(v)
  }
};

function useValidate (focused, innerLoading) {
  const { props, proxy } = getCurrentInstance();

  const innerError = ref(false);
  const innerErrorMessage = ref(null);
  const isDirtyModel = ref(false);

  useFormChild({ validate, resetValidation });

  let validateIndex = 0, unwatchRules;

  const hasRules = computed(() =>
    props.rules !== void 0
    && props.rules !== null
    && props.rules.length !== 0
  );

  const canDebounceValidate = computed(() => (
    props.disable !== true
    && hasRules.value === true
    // Should not have a validation in progress already;
    // It might mean that focus switched to submit btn and
    // QForm's submit() has been called already (ENTER key)
    && innerLoading.value === false
  ));

  const hasError = computed(() =>
    props.error === true || innerError.value === true
  );

  const errorMessage = computed(() => (
    typeof props.errorMessage === 'string' && props.errorMessage.length !== 0
      ? props.errorMessage
      : innerErrorMessage.value
  ));

  watch(() => props.modelValue, () => {
    isDirtyModel.value = true;

    if (
      canDebounceValidate.value === true
      // trigger validation if not using any kind of lazy-rules
      && props.lazyRules === false
    ) {
      debouncedValidate();
    }
  });

  function onRulesChange () {
    if (
      props.lazyRules !== 'ondemand'
      && canDebounceValidate.value === true
      && isDirtyModel.value === true
    ) {
      debouncedValidate();
    }
  }

  watch(() => props.reactiveRules, val => {
    if (val === true) {
      if (unwatchRules === void 0) {
        unwatchRules = watch(() => props.rules, onRulesChange, { immediate: true, deep: true });
      }
    }
    else if (unwatchRules !== void 0) {
      unwatchRules();
      unwatchRules = void 0;
    }
  }, { immediate: true });

  watch(() => props.lazyRules, onRulesChange);

  watch(focused, val => {
    if (val === true) {
      isDirtyModel.value = true;
    }
    else if (
      canDebounceValidate.value === true
      && props.lazyRules !== 'ondemand'
    ) {
      debouncedValidate();
    }
  });

  function resetValidation () {
    validateIndex++;
    innerLoading.value = false;
    isDirtyModel.value = false;
    innerError.value = false;
    innerErrorMessage.value = null;
    debouncedValidate.cancel();
  }

  /*
   * Return value
   *   - true (validation succeeded)
   *   - false (validation failed)
   *   - Promise (pending async validation)
   */
  function validate (val = props.modelValue) {
    if (
      props.disable === true
      || hasRules.value === false
    ) {
      return true
    }

    const index = ++validateIndex;

    const setDirty = innerLoading.value !== true
      ? () => { isDirtyModel.value = true; }
      : () => {};

    const update = (err, msg) => {
      err === true && setDirty();

      innerError.value = err;
      innerErrorMessage.value = msg || null;
      innerLoading.value = false;
    };

    const promises = [];

    for (let i = 0; i < props.rules.length; i++) {
      const rule = props.rules[ i ];
      let res;

      if (typeof rule === 'function') {
        res = rule(val, testPattern);
      }
      else if (typeof rule === 'string' && testPattern[ rule ] !== void 0) {
        res = testPattern[ rule ](val);
      }

      if (res === false || typeof res === 'string') {
        update(true, res);
        return false
      }
      else if (res !== true && res !== void 0) {
        promises.push(res);
      }
    }

    if (promises.length === 0) {
      update(false);
      return true
    }

    innerLoading.value = true;

    return Promise.all(promises).then(
      res => {
        if (res === void 0 || Array.isArray(res) === false || res.length === 0) {
          index === validateIndex && update(false);
          return true
        }

        const msg = res.find(r => r === false || typeof r === 'string');
        index === validateIndex && update(msg !== void 0, msg);
        return msg === void 0
      },
      e => {
        if (index === validateIndex) {
          console.error(e);
          update(true);
        }

        return false
      }
    )
  }

  const debouncedValidate = debounce(validate, 0);

  onBeforeUnmount(() => {
    unwatchRules?.();
    debouncedValidate.cancel();
  });

  // expose public methods & props
  Object.assign(proxy, { resetValidation, validate });
  injectProp(proxy, 'hasError', () => hasError.value);

  return {
    isDirtyModel,
    hasRules,
    hasError,
    errorMessage,

    validate,
    resetValidation
  }
}

function fieldValueIsFilled (val) {
  return val !== void 0
    && val !== null
    && ('' + val).length !== 0
}

const useNonInputFieldProps = {
  ...useDarkProps,
  ...useValidateProps,

  label: String,
  stackLabel: Boolean,
  hint: String,
  hideHint: Boolean,
  prefix: String,
  suffix: String,

  labelColor: String,
  color: String,
  bgColor: String,

  filled: Boolean,
  outlined: Boolean,
  borderless: Boolean,
  standout: [ Boolean, String ],

  square: Boolean,

  loading: Boolean,

  labelSlot: Boolean,

  bottomSlots: Boolean,
  hideBottomSpace: Boolean,

  rounded: Boolean,
  dense: Boolean,
  itemAligned: Boolean,

  counter: Boolean,

  clearable: Boolean,
  clearIcon: String,

  disable: Boolean,
  readonly: Boolean,

  autofocus: Boolean,

  for: String
};

const useFieldProps = {
  ...useNonInputFieldProps,
  maxlength: [ Number, String ]
};

const useFieldEmits = [ 'update:modelValue', 'clear', 'focus', 'blur' ];

function useFieldState ({ requiredForAttr = true, tagProp, changeEvent = false } = {}) {
  const { props, proxy } = getCurrentInstance();

  const isDark = useDark(props, proxy.$q);
  const targetUid = useId({
    required: requiredForAttr,
    getValue: () => props.for
  });

  return {
    requiredForAttr,
    changeEvent,
    tag: tagProp === true
      ? computed(() => props.tag)
      : { value: 'label' },

    isDark,

    editable: computed(() =>
      props.disable !== true && props.readonly !== true
    ),

    innerLoading: ref(false),
    focused: ref(false),
    hasPopupOpen: false,

    splitAttrs: useSplitAttrs(),
    targetUid,

    rootRef: ref(null),
    targetRef: ref(null),
    controlRef: ref(null)

    /**
     * user supplied additionals:

     * innerValue - computed
     * floatingLabel - computed
     * inputRef - computed

     * fieldClass - computed
     * hasShadow - computed

     * controlEvents - Object with fn(e)

     * getControl - fn
     * getInnerAppend - fn
     * getControlChild - fn
     * getShadowControl - fn
     * showPopup - fn
     */
  }
}

function useField (state) {
  const { props, emit, slots, attrs, proxy } = getCurrentInstance();
  const { $q } = proxy;

  let focusoutTimer = null;

  if (state.hasValue === void 0) {
    state.hasValue = computed(() => fieldValueIsFilled(props.modelValue));
  }

  if (state.emitValue === void 0) {
    state.emitValue = value => {
      emit('update:modelValue', value);
    };
  }

  if (state.controlEvents === void 0) {
    state.controlEvents = {
      onFocusin: onControlFocusin,
      onFocusout: onControlFocusout
    };
  }

  Object.assign(state, {
    clearValue,
    onControlFocusin,
    onControlFocusout,
    focus
  });

  if (state.computedCounter === void 0) {
    state.computedCounter = computed(() => {
      if (props.counter !== false) {
        const len = typeof props.modelValue === 'string' || typeof props.modelValue === 'number'
          ? ('' + props.modelValue).length
          : (Array.isArray(props.modelValue) === true ? props.modelValue.length : 0);

        const max = props.maxlength !== void 0
          ? props.maxlength
          : props.maxValues;

        return len + (max !== void 0 ? ' / ' + max : '')
      }
    });
  }

  const {
    isDirtyModel,
    hasRules,
    hasError,
    errorMessage,
    resetValidation
  } = useValidate(state.focused, state.innerLoading);

  const floatingLabel = state.floatingLabel !== void 0
    ? computed(() => props.stackLabel === true || state.focused.value === true || state.floatingLabel.value === true)
    : computed(() => props.stackLabel === true || state.focused.value === true || state.hasValue.value === true);

  const shouldRenderBottom = computed(() =>
    props.bottomSlots === true
    || props.hint !== void 0
    || hasRules.value === true
    || props.counter === true
    || props.error !== null
  );

  const styleType = computed(() => {
    if (props.filled === true) { return 'filled' }
    if (props.outlined === true) { return 'outlined' }
    if (props.borderless === true) { return 'borderless' }
    if (props.standout) { return 'standout' }
    return 'standard'
  });

  const classes = computed(() =>
    `q-field row no-wrap items-start q-field--${ styleType.value }`
    + (state.fieldClass !== void 0 ? ` ${ state.fieldClass.value }` : '')
    + (props.rounded === true ? ' q-field--rounded' : '')
    + (props.square === true ? ' q-field--square' : '')
    + (floatingLabel.value === true ? ' q-field--float' : '')
    + (hasLabel.value === true ? ' q-field--labeled' : '')
    + (props.dense === true ? ' q-field--dense' : '')
    + (props.itemAligned === true ? ' q-field--item-aligned q-item-type' : '')
    + (state.isDark.value === true ? ' q-field--dark' : '')
    + (state.getControl === void 0 ? ' q-field--auto-height' : '')
    + (state.focused.value === true ? ' q-field--focused' : '')
    + (hasError.value === true ? ' q-field--error' : '')
    + (hasError.value === true || state.focused.value === true ? ' q-field--highlighted' : '')
    + (props.hideBottomSpace !== true && shouldRenderBottom.value === true ? ' q-field--with-bottom' : '')
    + (props.disable === true ? ' q-field--disabled' : (props.readonly === true ? ' q-field--readonly' : ''))
  );

  const contentClass = computed(() =>
    'q-field__control relative-position row no-wrap'
    + (props.bgColor !== void 0 ? ` bg-${ props.bgColor }` : '')
    + (
      hasError.value === true
        ? ' text-negative'
        : (
            typeof props.standout === 'string' && props.standout.length !== 0 && state.focused.value === true
              ? ` ${ props.standout }`
              : (props.color !== void 0 ? ` text-${ props.color }` : '')
          )
    )
  );

  const hasLabel = computed(() =>
    props.labelSlot === true || props.label !== void 0
  );

  const labelClass = computed(() =>
    'q-field__label no-pointer-events absolute ellipsis'
    + (props.labelColor !== void 0 && hasError.value !== true ? ` text-${ props.labelColor }` : '')
  );

  const controlSlotScope = computed(() => ({
    id: state.targetUid.value,
    editable: state.editable.value,
    focused: state.focused.value,
    floatingLabel: floatingLabel.value,
    modelValue: props.modelValue,
    emitValue: state.emitValue
  }));

  const attributes = computed(() => {
    const acc = {};

    if (state.targetUid.value) {
      acc.for = state.targetUid.value;
    }

    if (props.disable === true) {
      acc[ 'aria-disabled' ] = 'true';
    }

    return acc
  });

  function focusHandler () {
    const el = document.activeElement;
    let target = state.targetRef?.value;

    if (target && (el === null || el.id !== state.targetUid.value)) {
      target.hasAttribute('tabindex') === true || (target = target.querySelector('[tabindex]'));
      if (target !== el) {
        target?.focus({ preventScroll: true });
      }
    }
  }

  function focus () {
    addFocusFn(focusHandler);
  }

  function blur () {
    removeFocusFn(focusHandler);
    const el = document.activeElement;
    if (el !== null && state.rootRef.value.contains(el)) {
      el.blur();
    }
  }

  function onControlFocusin (e) {
    if (focusoutTimer !== null) {
      clearTimeout(focusoutTimer);
      focusoutTimer = null;
    }

    if (state.editable.value === true && state.focused.value === false) {
      state.focused.value = true;
      emit('focus', e);
    }
  }

  function onControlFocusout (e, then) {
    focusoutTimer !== null && clearTimeout(focusoutTimer);
    focusoutTimer = setTimeout(() => {
      focusoutTimer = null;

      if (
        document.hasFocus() === true && (
          state.hasPopupOpen === true
          || state.controlRef === void 0
          || state.controlRef.value === null
          || state.controlRef.value.contains(document.activeElement) !== false
        )
      ) return

      if (state.focused.value === true) {
        state.focused.value = false;
        emit('blur', e);
      }

      then?.();
    });
  }

  function clearValue (e) {
    // prevent activating the field but keep focus on desktop
    stopAndPrevent(e);

    if ($q.platform.is.mobile !== true) {
      const el = state.targetRef?.value || state.rootRef.value;
      el.focus();
    }
    else if (state.rootRef.value.contains(document.activeElement) === true) {
      document.activeElement.blur();
    }

    if (props.type === 'file') {
      // do not let focus be triggered
      // as it will make the native file dialog
      // appear for another selection
      state.inputRef.value.value = null;
    }

    emit('update:modelValue', null);
    state.changeEvent === true && emit('change', null);
    emit('clear', props.modelValue);

    nextTick(() => {
      const isDirty = isDirtyModel.value;
      resetValidation();
      isDirtyModel.value = isDirty;
    });
  }

  function onClearableKeyup (evt) {
    [ 13, 32 ].includes(evt.keyCode) && clearValue(evt);
  }

  function getContent () {
    const node = [];

    slots.prepend !== void 0 && node.push(
      h('div', {
        class: 'q-field__prepend q-field__marginal row no-wrap items-center',
        key: 'prepend',
        onClick: prevent
      }, slots.prepend())
    );

    node.push(
      h('div', {
        class: 'q-field__control-container col relative-position row no-wrap q-anchor--skip'
      }, getControlContainer())
    );

    hasError.value === true && props.noErrorIcon === false && node.push(
      getInnerAppendNode('error', [
        h(__nuxt_component_4$1, { name: $q.iconSet.field.error, color: 'negative' })
      ])
    );

    if (props.loading === true || state.innerLoading.value === true) {
      node.push(
        getInnerAppendNode(
          'inner-loading-append',
          slots.loading !== void 0
            ? slots.loading()
            : [ h(QSpinner, { color: props.color }) ]
        )
      );
    }
    else if (props.clearable === true && state.hasValue.value === true && state.editable.value === true) {
      node.push(
        getInnerAppendNode('inner-clearable-append', [
          h(__nuxt_component_4$1, {
            class: 'q-field__focusable-action',
            name: props.clearIcon || $q.iconSet.field.clear,
            tabindex: 0,
            role: 'button',
            'aria-hidden': 'false',
            'aria-label': $q.lang.label.clear,
            onKeyup: onClearableKeyup,
            onClick: clearValue
          })
        ])
      );
    }

    slots.append !== void 0 && node.push(
      h('div', {
        class: 'q-field__append q-field__marginal row no-wrap items-center',
        key: 'append',
        onClick: prevent
      }, slots.append())
    );

    state.getInnerAppend !== void 0 && node.push(
      getInnerAppendNode('inner-append', state.getInnerAppend())
    );

    state.getControlChild !== void 0 && node.push(
      state.getControlChild()
    );

    return node
  }

  function getControlContainer () {
    const node = [];

    props.prefix !== void 0 && props.prefix !== null && node.push(
      h('div', {
        class: 'q-field__prefix no-pointer-events row items-center'
      }, props.prefix)
    );

    if (state.getShadowControl !== void 0 && state.hasShadow.value === true) {
      node.push(
        state.getShadowControl()
      );
    }

    if (state.getControl !== void 0) {
      node.push(state.getControl());
    }
    // internal usage only:
    else if (slots.rawControl !== void 0) {
      node.push(slots.rawControl());
    }
    else if (slots.control !== void 0) {
      node.push(
        h('div', {
          ref: state.targetRef,
          class: 'q-field__native row',
          tabindex: -1,
          ...state.splitAttrs.attributes.value,
          'data-autofocus': props.autofocus === true || void 0
        }, slots.control(controlSlotScope.value))
      );
    }

    hasLabel.value === true && node.push(
      h('div', {
        class: labelClass.value
      }, hSlot(slots.label, props.label))
    );

    props.suffix !== void 0 && props.suffix !== null && node.push(
      h('div', {
        class: 'q-field__suffix no-pointer-events row items-center'
      }, props.suffix)
    );

    return node.concat(hSlot(slots.default))
  }

  function getBottom () {
    let msg, key;

    if (hasError.value === true) {
      if (errorMessage.value !== null) {
        msg = [ h('div', { role: 'alert' }, errorMessage.value) ];
        key = `q--slot-error-${ errorMessage.value }`;
      }
      else {
        msg = hSlot(slots.error);
        key = 'q--slot-error';
      }
    }
    else if (props.hideHint !== true || state.focused.value === true) {
      if (props.hint !== void 0) {
        msg = [ h('div', props.hint) ];
        key = `q--slot-hint-${ props.hint }`;
      }
      else {
        msg = hSlot(slots.hint);
        key = 'q--slot-hint';
      }
    }

    const hasCounter = props.counter === true || slots.counter !== void 0;

    if (
      props.hideBottomSpace === true
      && hasCounter === false
      && msg === void 0
    ) return

    const main = h('div', {
      key,
      class: 'q-field__messages col'
    }, msg);

    return h('div', {
      class: 'q-field__bottom row items-start q-field__bottom--'
        + (props.hideBottomSpace !== true ? 'animated' : 'stale'),
      onClick: prevent
    }, [
      props.hideBottomSpace === true
        ? main
        : h(Transition, { name: 'q-transition--field-message' }, () => main),

      hasCounter === true
        ? h('div', {
          class: 'q-field__counter'
        }, slots.counter !== void 0 ? slots.counter() : state.computedCounter.value)
        : null
    ])
  }

  function getInnerAppendNode (key, content) {
    return content === null
      ? null
      : h('div', {
        key,
        class: 'q-field__append q-field__marginal row no-wrap items-center q-anchor--skip'
      }, content)
  }

  let shouldActivate = false;

  onDeactivated(() => {
    shouldActivate = true;
  });

  onActivated(() => {
    shouldActivate === true && props.autofocus === true && proxy.focus();
  });

  props.autofocus === true && onMounted(() => {
    proxy.focus();
  });

  onBeforeUnmount(() => {
    focusoutTimer !== null && clearTimeout(focusoutTimer);
  });

  // expose public methods
  Object.assign(proxy, { focus, blur });

  return function renderField () {
    const labelAttrs = state.getControl === void 0 && slots.control === void 0
      ? {
          ...state.splitAttrs.attributes.value,
          'data-autofocus': props.autofocus === true || void 0,
          ...attributes.value
        }
      : attributes.value;

    return h(state.tag.value, {
      ref: state.rootRef,
      class: [
        classes.value,
        attrs.class
      ],
      style: attrs.style,
      ...labelAttrs
    }, [
      slots.before !== void 0
        ? h('div', {
          class: 'q-field__before q-field__marginal row no-wrap items-center',
          onClick: prevent
        }, slots.before())
        : null,

      h('div', {
        class: 'q-field__inner relative-position col self-stretch'
      }, [
        h('div', {
          ref: state.controlRef,
          class: contentClass.value,
          tabindex: -1,
          ...state.controlEvents
        }, getContent()),

        shouldRenderBottom.value === true
          ? getBottom()
          : null
      ]),

      slots.after !== void 0
        ? h('div', {
          class: 'q-field__after q-field__marginal row no-wrap items-center',
          onClick: prevent
        }, slots.after())
        : null
    ])
  }
}

const isJapanese = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
const isChinese = /[\u4e00-\u9fff\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\uf900-\ufaff\u3300-\u33ff\ufe30-\ufe4f\uf900-\ufaff\u{2f800}-\u{2fa1f}]/u;
const isKorean = /[\u3131-\u314e\u314f-\u3163\uac00-\ud7a3]/;
const isPlainText = /[a-z0-9_ -]$/i;

function useKeyComposition (onInput) {
  return function onComposition (e) {
    if (e.type === 'compositionend' || e.type === 'change') {
      if (e.target.qComposing !== true) return
      e.target.qComposing = false;
      onInput(e);
    }
    else if (
      e.type === 'compositionupdate'
      && e.target.qComposing !== true
      && typeof e.data === 'string'
    ) {
      const isComposing = client.is.firefox === true
        ? isPlainText.test(e.data) === false
        : isJapanese.test(e.data) === true || isChinese.test(e.data) === true || isKorean.test(e.data) === true;

      if (isComposing === true) {
        e.target.qComposing = true;
      }
    }
  }
}

const createBgNode = () => h('div', {
  key: 'svg',
  class: 'q-checkbox__bg absolute'
}, [
  h('svg', {
    class: 'q-checkbox__svg fit absolute-full',
    viewBox: '0 0 24 24'
  }, [
    h('path', {
      class: 'q-checkbox__truthy',
      fill: 'none',
      d: 'M1.73,12.91 8.1,19.28 22.79,4.59'
    }),

    h('path', {
      class: 'q-checkbox__indet',
      d: 'M4,14H20V10H4'
    })
  ])
]);

const QCheckbox = createComponent({
  name: 'QCheckbox',

  props: useCheckboxProps,
  emits: useCheckboxEmits,

  setup (props) {
    const bgNode = createBgNode();

    function getInner (isTrue, isIndeterminate) {
      const icon = computed(() =>
        (isTrue.value === true
          ? props.checkedIcon
          : (isIndeterminate.value === true
              ? props.indeterminateIcon
              : props.uncheckedIcon
            )
        ) || null
      );

      return () => (
        icon.value !== null
          ? [
              h('div', {
                key: 'icon',
                class: 'q-checkbox__icon-container absolute-full flex flex-center no-wrap'
              }, [
                h(__nuxt_component_4$1, {
                  class: 'q-checkbox__icon',
                  name: icon.value
                })
              ])
            ]
          : [ bgNode ]
      )
    }

    return useCheckbox('checkbox', getInner)
  }
});

const __nuxt_component_4 = createComponent({
  name: 'QForm',

  props: {
    autofocus: Boolean,
    noErrorFocus: Boolean,
    noResetFocus: Boolean,
    greedy: Boolean,

    onSubmit: Function
  },

  emits: [ 'reset', 'validationSuccess', 'validationError' ],

  setup (props, { slots, emit }) {
    const vm = getCurrentInstance();
    const rootRef = ref(null);

    let validateIndex = 0;
    const registeredComponents = [];

    function validate (shouldFocus) {
      const focus = typeof shouldFocus === 'boolean'
        ? shouldFocus
        : props.noErrorFocus !== true;

      const index = ++validateIndex;

      const emitEvent = (res, ref) => {
        emit(`validation${ res === true ? 'Success' : 'Error' }`, ref);
      };

      const validateComponent = comp => {
        const valid = comp.validate();

        return typeof valid.then === 'function'
          ? valid.then(
            valid => ({ valid, comp }),
            err => ({ valid: false, comp, err })
          )
          : Promise.resolve({ valid, comp })
      };

      const errorsPromise = props.greedy === true
        ? Promise
          .all(registeredComponents.map(validateComponent))
          .then(res => res.filter(r => r.valid !== true))
        : registeredComponents
          .reduce(
            (acc, comp) => acc.then(() => {
              return validateComponent(comp).then(r => {
                if (r.valid === false) { return Promise.reject(r) }
              })
            }),
            Promise.resolve()
          )
          .catch(error => [ error ]);

      return errorsPromise.then(errors => {
        if (errors === void 0 || errors.length === 0) {
          index === validateIndex && emitEvent(true);
          return true
        }

        // if not outdated already
        if (index === validateIndex) {
          const { comp, err } = errors[ 0 ];

          err !== void 0 && console.error(err);
          emitEvent(false, comp);

          if (focus === true) {
            // Try to focus first mounted and active component
            const activeError = errors.find(({ comp }) => (
              typeof comp.focus === 'function'
              && vmIsDestroyed(comp.$) === false
            ));

            if (activeError !== void 0) {
              activeError.comp.focus();
            }
          }
        }

        return false
      })
    }

    function resetValidation () {
      validateIndex++;

      registeredComponents.forEach(comp => {
        typeof comp.resetValidation === 'function' && comp.resetValidation();
      });
    }

    function submit (evt) {
      evt !== void 0 && stopAndPrevent(evt);

      const index = validateIndex + 1;

      validate().then(val => {
        // if not outdated && validation succeeded
        if (index === validateIndex && val === true) {
          if (props.onSubmit !== void 0) {
            emit('submit', evt);
          }
          else if (evt?.target !== void 0 && typeof evt.target.submit === 'function') {
            evt.target.submit();
          }
        }
      });
    }

    function reset (evt) {
      evt !== void 0 && stopAndPrevent(evt);

      emit('reset');

      nextTick(() => { // allow userland to reset values before
        resetValidation();
        if (props.autofocus === true && props.noResetFocus !== true) {
          focus();
        }
      });
    }

    function focus () {
      addFocusFn(() => {
        if (rootRef.value === null) return

        const target = rootRef.value.querySelector('[autofocus][tabindex], [data-autofocus][tabindex]')
          || rootRef.value.querySelector('[autofocus] [tabindex], [data-autofocus] [tabindex]')
          || rootRef.value.querySelector('[autofocus], [data-autofocus]')
          || Array.prototype.find.call(rootRef.value.querySelectorAll('[tabindex]'), el => el.tabIndex !== -1);

        target?.focus({ preventScroll: true });
      });
    }

    provide(formKey, {
      bindComponent (vmProxy) {
        registeredComponents.push(vmProxy);
      },

      unbindComponent (vmProxy) {
        const index = registeredComponents.indexOf(vmProxy);
        if (index !== -1) {
          registeredComponents.splice(index, 1);
        }
      }
    });

    let shouldActivate = false;

    onDeactivated(() => {
      shouldActivate = true;
    });

    onActivated(() => {
      shouldActivate === true && props.autofocus === true && focus();
    });

    onMounted(() => {
      props.autofocus === true && focus();
    });

    // expose public methods
    Object.assign(vm.proxy, {
      validate,
      resetValidation,
      submit,
      reset,
      focus,
      getValidationComponents: () => registeredComponents
    });

    return () => h('form', {
      class: 'q-form',
      ref: rootRef,
      onSubmit: submit,
      onReset: reset
    }, hSlot(slots.default))
  }
});

const QField = createComponent({
  name: 'QField',

  inheritAttrs: false,

  props: {
    ...useFieldProps,

    tag: {
      type: String,
      default: 'label'
    }
  },

  emits: useFieldEmits,

  setup () {
    return useField(
      useFieldState({ tagProp: true })
    )
  }
});

const defaultSizes$1 = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
};

const QChip = createComponent({
  name: 'QChip',

  props: {
    ...useDarkProps,
    ...useSizeProps,

    dense: Boolean,

    icon: String,
    iconRight: String,
    iconRemove: String,
    iconSelected: String,
    label: [ String, Number ],

    color: String,
    textColor: String,

    modelValue: {
      type: Boolean,
      default: true
    },
    selected: {
      type: Boolean,
      default: null
    },

    square: Boolean,
    outline: Boolean,
    clickable: Boolean,
    removable: Boolean,

    removeAriaLabel: String,

    tabindex: [ String, Number ],
    disable: Boolean,

    ripple: {
      type: [ Boolean, Object ],
      default: true
    }
  },

  emits: [ 'update:modelValue', 'update:selected', 'remove', 'click' ],

  setup (props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance();

    const isDark = useDark(props, $q);
    const sizeStyle = useSize(props, defaultSizes$1);

    const hasLeftIcon = computed(() => props.selected === true || props.icon !== void 0);

    const leftIcon = computed(() => (
      props.selected === true
        ? props.iconSelected || $q.iconSet.chip.selected
        : props.icon
    ));

    const removeIcon = computed(() => props.iconRemove || $q.iconSet.chip.remove);

    const isClickable = computed(() =>
      props.disable === false
      && (props.clickable === true || props.selected !== null)
    );

    const classes = computed(() => {
      const text = props.outline === true
        ? props.color || props.textColor
        : props.textColor;

      return 'q-chip row inline no-wrap items-center'
        + (props.outline === false && props.color !== void 0 ? ` bg-${ props.color }` : '')
        + (text ? ` text-${ text } q-chip--colored` : '')
        + (props.disable === true ? ' disabled' : '')
        + (props.dense === true ? ' q-chip--dense' : '')
        + (props.outline === true ? ' q-chip--outline' : '')
        + (props.selected === true ? ' q-chip--selected' : '')
        + (isClickable.value === true ? ' q-chip--clickable cursor-pointer non-selectable q-hoverable' : '')
        + (props.square === true ? ' q-chip--square' : '')
        + (isDark.value === true ? ' q-chip--dark q-dark' : '')
    });

    const attributes = computed(() => {
      const chip = props.disable === true
        ? { tabindex: -1, 'aria-disabled': 'true' }
        : { tabindex: props.tabindex || 0 };

      const remove = {
        ...chip,
        role: 'button',
        'aria-hidden': 'false',
        'aria-label': props.removeAriaLabel || $q.lang.label.remove
      };

      return { chip, remove }
    });

    function onKeyup (e) {
      e.keyCode === 13 /* ENTER */ && onClick(e);
    }

    function onClick (e) {
      if (!props.disable) {
        emit('update:selected', !props.selected);
        emit('click', e);
      }
    }

    function onRemove (e) {
      if (e.keyCode === void 0 || e.keyCode === 13) {
        stopAndPrevent(e);
        if (props.disable === false) {
          emit('update:modelValue', false);
          emit('remove');
        }
      }
    }

    function getContent () {
      const child = [];

      isClickable.value === true && child.push(
        h('div', { class: 'q-focus-helper' })
      );

      hasLeftIcon.value === true && child.push(
        h(__nuxt_component_4$1, {
          class: 'q-chip__icon q-chip__icon--left',
          name: leftIcon.value
        })
      );

      const label = props.label !== void 0
        ? [ h('div', { class: 'ellipsis' }, [ props.label ]) ]
        : void 0;

      child.push(
        h('div', {
          class: 'q-chip__content col row no-wrap items-center q-anchor--skip'
        }, hMergeSlotSafely(slots.default, label))
      );

      props.iconRight && child.push(
        h(__nuxt_component_4$1, {
          class: 'q-chip__icon q-chip__icon--right',
          name: props.iconRight
        })
      );

      props.removable === true && child.push(
        h(__nuxt_component_4$1, {
          class: 'q-chip__icon q-chip__icon--remove cursor-pointer',
          name: removeIcon.value,
          ...attributes.value.remove,
          onClick: onRemove,
          onKeyup: onRemove
        })
      );

      return child
    }

    return () => {
      if (props.modelValue === false) return

      const data = {
        class: classes.value,
        style: sizeStyle.value
      };

      isClickable.value === true && Object.assign(
        data,
        attributes.value.chip,
        { onClick, onKeyup }
      );

      return hDir(
        'div',
        data,
        getContent(),
        'ripple',
        props.ripple !== false && props.disable !== true,
        () => [ [ Ripple, props.ripple ] ]
      )
    }
  }
});

const QItemLabel = createComponent({
  name: 'QItemLabel',

  props: {
    overline: Boolean,
    caption: Boolean,
    header: Boolean,
    lines: [ Number, String ]
  },

  setup (props, { slots }) {
    const parsedLines = computed(() => parseInt(props.lines, 10));

    const classes = computed(() =>
      'q-item__label'
      + (props.overline === true ? ' q-item__label--overline text-overline' : '')
      + (props.caption === true ? ' q-item__label--caption text-caption' : '')
      + (props.header === true ? ' q-item__label--header' : '')
      + (parsedLines.value === 1 ? ' ellipsis' : '')
    );

    const style = computed(() => {
      return props.lines !== void 0 && parsedLines.value > 1
        ? {
            overflow: 'hidden',
            display: '-webkit-box',
            '-webkit-box-orient': 'vertical',
            '-webkit-line-clamp': parsedLines.value
          }
        : null
    });

    return () => h('div', {
      style: style.value,
      class: classes.value
    }, hSlot(slots.default))
  }
});

const aggBucketSize = 1000;

const scrollToEdges = [
  'start',
  'center',
  'end',
  'start-force',
  'center-force',
  'end-force'
];

const filterProto = Array.prototype.filter;

function sumFn (acc, h) {
  return acc + h
}

function getScrollDetails (
  parent,
  child,
  beforeRef,
  afterRef,
  horizontal,
  rtl,
  stickyStart,
  stickyEnd
) {
  const
    parentCalc = parent === window ? document.scrollingElement || document.documentElement : parent,
    propElSize = horizontal === true ? 'offsetWidth' : 'offsetHeight',
    details = {
      scrollStart: 0,
      scrollViewSize: -stickyStart - stickyEnd,
      scrollMaxSize: 0,
      offsetStart: -stickyStart,
      offsetEnd: -stickyEnd
    };

  if (horizontal === true) {
    if (parent === window) {
      details.scrollStart = window.pageXOffset || window.scrollX || document.body.scrollLeft || 0;
      details.scrollViewSize += document.documentElement.clientWidth;
    }
    else {
      details.scrollStart = parentCalc.scrollLeft;
      details.scrollViewSize += parentCalc.clientWidth;
    }
    details.scrollMaxSize = parentCalc.scrollWidth;

    if (rtl === true) {
      details.scrollStart = (0) - details.scrollStart;
    }
  }
  else {
    if (parent === window) {
      details.scrollStart = window.pageYOffset || window.scrollY || document.body.scrollTop || 0;
      details.scrollViewSize += document.documentElement.clientHeight;
    }
    else {
      details.scrollStart = parentCalc.scrollTop;
      details.scrollViewSize += parentCalc.clientHeight;
    }
    details.scrollMaxSize = parentCalc.scrollHeight;
  }

  if (beforeRef !== null) {
    for (let el = beforeRef.previousElementSibling; el !== null; el = el.previousElementSibling) {
      if (el.classList.contains('q-virtual-scroll--skip') === false) {
        details.offsetStart += el[ propElSize ];
      }
    }
  }

  if (afterRef !== null) {
    for (let el = afterRef.nextElementSibling; el !== null; el = el.nextElementSibling) {
      if (el.classList.contains('q-virtual-scroll--skip') === false) {
        details.offsetEnd += el[ propElSize ];
      }
    }
  }

  if (child !== parent) {
    const
      parentRect = parentCalc.getBoundingClientRect(),
      childRect = child.getBoundingClientRect();

    if (horizontal === true) {
      details.offsetStart += childRect.left - parentRect.left;
      details.offsetEnd -= childRect.width;
    }
    else {
      details.offsetStart += childRect.top - parentRect.top;
      details.offsetEnd -= childRect.height;
    }

    if (parent !== window) {
      details.offsetStart += details.scrollStart;
    }
    details.offsetEnd += details.scrollMaxSize - details.offsetStart;
  }

  return details
}

function setScroll (parent, scroll, horizontal, rtl) {
  if (scroll === 'end') {
    scroll = (parent === window ? document.body : parent)[
      horizontal === true ? 'scrollWidth' : 'scrollHeight'
    ];
  }

  if (parent === window) {
    if (horizontal === true) {
      if (rtl === true) {
        scroll = (0) - scroll;
      }
      window.scrollTo(scroll, window.pageYOffset || window.scrollY || document.body.scrollTop || 0);
    }
    else {
      window.scrollTo(window.pageXOffset || window.scrollX || document.body.scrollLeft || 0, scroll);
    }
  }
  else if (horizontal === true) {
    if (rtl === true) {
      scroll = (0) - scroll;
    }
    parent.scrollLeft = scroll;
  }
  else {
    parent.scrollTop = scroll;
  }
}

function sumSize (sizeAgg, size, from, to) {
  if (from >= to) { return 0 }

  const
    lastTo = size.length,
    fromAgg = Math.floor(from / aggBucketSize),
    toAgg = Math.floor((to - 1) / aggBucketSize) + 1;

  let total = sizeAgg.slice(fromAgg, toAgg).reduce(sumFn, 0);

  if (from % aggBucketSize !== 0) {
    total -= size.slice(fromAgg * aggBucketSize, from).reduce(sumFn, 0);
  }
  if (to % aggBucketSize !== 0 && to !== lastTo) {
    total -= size.slice(to, toAgg * aggBucketSize).reduce(sumFn, 0);
  }

  return total
}

const commonVirtScrollProps = {
  virtualScrollSliceSize: {
    type: [ Number, String ],
    default: 10
  },

  virtualScrollSliceRatioBefore: {
    type: [ Number, String ],
    default: 1
  },

  virtualScrollSliceRatioAfter: {
    type: [ Number, String ],
    default: 1
  },

  virtualScrollItemSize: {
    type: [ Number, String ],
    default: 24
  },

  virtualScrollStickySizeStart: {
    type: [ Number, String ],
    default: 0
  },

  virtualScrollStickySizeEnd: {
    type: [ Number, String ],
    default: 0
  },

  tableColspan: [ Number, String ]
};

const commonVirtScrollPropsList = Object.keys(commonVirtScrollProps);

const useVirtualScrollProps = {
  virtualScrollHorizontal: Boolean,
  onVirtualScroll: Function,
  ...commonVirtScrollProps
};

function useVirtualScroll ({
  virtualScrollLength, getVirtualScrollTarget, getVirtualScrollEl,
  virtualScrollItemSizeComputed // optional
}) {
  const vm = getCurrentInstance();

  const { props, emit, proxy } = vm;
  const { $q } = proxy;

  let prevScrollStart, prevToIndex, localScrollViewSize, virtualScrollSizesAgg = [], virtualScrollSizes;

  const virtualScrollPaddingBefore = ref(0);
  const virtualScrollPaddingAfter = ref(0);
  const virtualScrollSliceSizeComputed = ref({});

  const beforeRef = ref(null);
  const afterRef = ref(null);
  const contentRef = ref(null);

  const virtualScrollSliceRange = ref({ from: 0, to: 0 });

  const colspanAttr = computed(() => (props.tableColspan !== void 0 ? props.tableColspan : 100));

  if (virtualScrollItemSizeComputed === void 0) {
    virtualScrollItemSizeComputed = computed(() => props.virtualScrollItemSize);
  }

  const needsReset = computed(() => virtualScrollItemSizeComputed.value + ';' + props.virtualScrollHorizontal);

  const needsSliceRecalc = computed(() =>
    needsReset.value + ';' + props.virtualScrollSliceRatioBefore + ';' + props.virtualScrollSliceRatioAfter
  );

  watch(needsSliceRecalc, () => { setVirtualScrollSize(); });
  watch(needsReset, reset);

  function reset () {
    localResetVirtualScroll(prevToIndex, true);
  }

  function refresh (toIndex) {
    localResetVirtualScroll(toIndex === void 0 ? prevToIndex : toIndex);
  }

  function scrollTo (toIndex, edge) {
    const scrollEl = getVirtualScrollTarget();

    if (
      scrollEl === void 0
      || scrollEl === null
      || scrollEl.nodeType === 8
    ) return

    const scrollDetails = getScrollDetails(
      scrollEl,
      getVirtualScrollEl(),
      beforeRef.value,
      afterRef.value,
      props.virtualScrollHorizontal,
      $q.lang.rtl,
      props.virtualScrollStickySizeStart,
      props.virtualScrollStickySizeEnd
    );

    localScrollViewSize !== scrollDetails.scrollViewSize && setVirtualScrollSize(scrollDetails.scrollViewSize);

    setVirtualScrollSliceRange(
      scrollEl,
      scrollDetails,
      Math.min(virtualScrollLength.value - 1, Math.max(0, parseInt(toIndex, 10) || 0)),
      0,
      scrollToEdges.indexOf(edge) !== -1 ? edge : (prevToIndex !== -1 && toIndex > prevToIndex ? 'end' : 'start')
    );
  }

  function localOnVirtualScrollEvt () {
    const scrollEl = getVirtualScrollTarget();

    if (
      scrollEl === void 0
      || scrollEl === null
      || scrollEl.nodeType === 8
    ) return

    const
      scrollDetails = getScrollDetails(
        scrollEl,
        getVirtualScrollEl(),
        beforeRef.value,
        afterRef.value,
        props.virtualScrollHorizontal,
        $q.lang.rtl,
        props.virtualScrollStickySizeStart,
        props.virtualScrollStickySizeEnd
      ),
      listLastIndex = virtualScrollLength.value - 1,
      listEndOffset = scrollDetails.scrollMaxSize - scrollDetails.offsetStart - scrollDetails.offsetEnd - virtualScrollPaddingAfter.value;

    if (prevScrollStart === scrollDetails.scrollStart) return

    if (scrollDetails.scrollMaxSize <= 0) {
      setVirtualScrollSliceRange(scrollEl, scrollDetails, 0, 0);
      return
    }

    localScrollViewSize !== scrollDetails.scrollViewSize && setVirtualScrollSize(scrollDetails.scrollViewSize);

    updateVirtualScrollSizes(virtualScrollSliceRange.value.from);

    const scrollMaxStart = Math.floor(scrollDetails.scrollMaxSize
      - Math.max(scrollDetails.scrollViewSize, scrollDetails.offsetEnd)
      - Math.min(virtualScrollSizes[ listLastIndex ], scrollDetails.scrollViewSize / 2));

    if (scrollMaxStart > 0 && Math.ceil(scrollDetails.scrollStart) >= scrollMaxStart) {
      setVirtualScrollSliceRange(
        scrollEl,
        scrollDetails,
        listLastIndex,
        scrollDetails.scrollMaxSize - scrollDetails.offsetEnd - virtualScrollSizesAgg.reduce(sumFn, 0)
      );

      return
    }

    let
      toIndex = 0,
      listOffset = scrollDetails.scrollStart - scrollDetails.offsetStart,
      offset = listOffset;

    if (listOffset <= listEndOffset && listOffset + scrollDetails.scrollViewSize >= virtualScrollPaddingBefore.value) {
      listOffset -= virtualScrollPaddingBefore.value;
      toIndex = virtualScrollSliceRange.value.from;
      offset = listOffset;
    }
    else {
      for (let j = 0; listOffset >= virtualScrollSizesAgg[ j ] && toIndex < listLastIndex; j++) {
        listOffset -= virtualScrollSizesAgg[ j ];
        toIndex += aggBucketSize;
      }
    }

    while (listOffset > 0 && toIndex < listLastIndex) {
      listOffset -= virtualScrollSizes[ toIndex ];
      if (listOffset > -scrollDetails.scrollViewSize) {
        toIndex++;
        offset = listOffset;
      }
      else {
        offset = virtualScrollSizes[ toIndex ] + listOffset;
      }
    }

    setVirtualScrollSliceRange(
      scrollEl,
      scrollDetails,
      toIndex,
      offset
    );
  }

  function setVirtualScrollSliceRange (scrollEl, scrollDetails, toIndex, offset, align) {
    const alignForce = typeof align === 'string' && align.indexOf('-force') !== -1;
    const alignEnd = alignForce === true ? align.replace('-force', '') : align;
    const alignRange = alignEnd !== void 0 ? alignEnd : 'start';

    let
      from = Math.max(0, toIndex - virtualScrollSliceSizeComputed.value[ alignRange ]),
      to = from + virtualScrollSliceSizeComputed.value.total;

    if (to > virtualScrollLength.value) {
      to = virtualScrollLength.value;
      from = Math.max(0, to - virtualScrollSliceSizeComputed.value.total);
    }

    prevScrollStart = scrollDetails.scrollStart;

    const rangeChanged = from !== virtualScrollSliceRange.value.from || to !== virtualScrollSliceRange.value.to;

    if (rangeChanged === false && alignEnd === void 0) {
      emitScroll(toIndex);
      return
    }

    const { activeElement } = document;
    const contentEl = contentRef.value;
    if (
      rangeChanged === true
      && contentEl !== null
      && contentEl !== activeElement
      && contentEl.contains(activeElement) === true
    ) {
      contentEl.addEventListener('focusout', onBlurRefocusFn);

      setTimeout(() => {
        contentEl?.removeEventListener('focusout', onBlurRefocusFn);
      });
    }

    const sizeBefore = alignEnd !== void 0 ? virtualScrollSizes.slice(from, toIndex).reduce(sumFn, 0) : 0;

    if (rangeChanged === true) {
      // vue key matching algorithm works only if
      // the array of VNodes changes on only one of the ends
      // so we first change one end and then the other

      const tempTo = to >= virtualScrollSliceRange.value.from && from <= virtualScrollSliceRange.value.to
        ? virtualScrollSliceRange.value.to
        : to;

      virtualScrollSliceRange.value = { from, to: tempTo };
      virtualScrollPaddingBefore.value = sumSize(virtualScrollSizesAgg, virtualScrollSizes, 0, from);
      virtualScrollPaddingAfter.value = sumSize(virtualScrollSizesAgg, virtualScrollSizes, to, virtualScrollLength.value);

      requestAnimationFrame(() => {
        if (virtualScrollSliceRange.value.to !== to && prevScrollStart === scrollDetails.scrollStart) {
          virtualScrollSliceRange.value = { from: virtualScrollSliceRange.value.from, to };
          virtualScrollPaddingAfter.value = sumSize(virtualScrollSizesAgg, virtualScrollSizes, to, virtualScrollLength.value);
        }
      });
    }

    requestAnimationFrame(() => {
      // if the scroll was changed give up
      // (another call to setVirtualScrollSliceRange before animation frame)
      if (prevScrollStart !== scrollDetails.scrollStart) return

      if (rangeChanged === true) {
        updateVirtualScrollSizes(from);
      }

      const
        sizeAfter = virtualScrollSizes.slice(from, toIndex).reduce(sumFn, 0),
        posStart = sizeAfter + scrollDetails.offsetStart + virtualScrollPaddingBefore.value,
        posEnd = posStart + virtualScrollSizes[ toIndex ];

      let scrollPosition = posStart + offset;

      if (alignEnd !== void 0) {
        const sizeDiff = sizeAfter - sizeBefore;
        const scrollStart = scrollDetails.scrollStart + sizeDiff;

        scrollPosition = alignForce !== true && scrollStart < posStart && posEnd < scrollStart + scrollDetails.scrollViewSize
          ? scrollStart
          : (
              alignEnd === 'end'
                ? posEnd - scrollDetails.scrollViewSize
                : posStart - (alignEnd === 'start' ? 0 : Math.round((scrollDetails.scrollViewSize - virtualScrollSizes[ toIndex ]) / 2))
            );
      }

      prevScrollStart = scrollPosition;

      setScroll(
        scrollEl,
        scrollPosition,
        props.virtualScrollHorizontal,
        $q.lang.rtl
      );

      emitScroll(toIndex);
    });
  }

  function updateVirtualScrollSizes (from) {
    const contentEl = contentRef.value;

    if (contentEl) {
      const
        children = filterProto.call(
          contentEl.children,
          el => el.classList && el.classList.contains('q-virtual-scroll--skip') === false
        ),
        childrenLength = children.length,
        sizeFn = props.virtualScrollHorizontal === true
          ? el => el.getBoundingClientRect().width
          : el => el.offsetHeight;

      let
        index = from,
        size, diff;

      for (let i = 0; i < childrenLength;) {
        size = sizeFn(children[ i ]);
        i++;

        while (i < childrenLength && children[ i ].classList.contains('q-virtual-scroll--with-prev') === true) {
          size += sizeFn(children[ i ]);
          i++;
        }

        diff = size - virtualScrollSizes[ index ];

        if (diff !== 0) {
          virtualScrollSizes[ index ] += diff;
          virtualScrollSizesAgg[ Math.floor(index / aggBucketSize) ] += diff;
        }

        index++;
      }
    }
  }

  function onBlurRefocusFn () {
    contentRef.value?.focus();
  }

  function localResetVirtualScroll (toIndex, fullReset) {
    const defaultSize = 1 * virtualScrollItemSizeComputed.value;

    if (fullReset === true || Array.isArray(virtualScrollSizes) === false) {
      virtualScrollSizes = [];
    }

    const oldVirtualScrollSizesLength = virtualScrollSizes.length;

    virtualScrollSizes.length = virtualScrollLength.value;

    for (let i = virtualScrollLength.value - 1; i >= oldVirtualScrollSizesLength; i--) {
      virtualScrollSizes[ i ] = defaultSize;
    }

    const jMax = Math.floor((virtualScrollLength.value - 1) / aggBucketSize);
    virtualScrollSizesAgg = [];
    for (let j = 0; j <= jMax; j++) {
      let size = 0;
      const iMax = Math.min((j + 1) * aggBucketSize, virtualScrollLength.value);
      for (let i = j * aggBucketSize; i < iMax; i++) {
        size += virtualScrollSizes[ i ];
      }
      virtualScrollSizesAgg.push(size);
    }

    prevToIndex = -1;
    prevScrollStart = void 0;

    virtualScrollPaddingBefore.value = sumSize(virtualScrollSizesAgg, virtualScrollSizes, 0, virtualScrollSliceRange.value.from);
    virtualScrollPaddingAfter.value = sumSize(virtualScrollSizesAgg, virtualScrollSizes, virtualScrollSliceRange.value.to, virtualScrollLength.value);

    if (toIndex >= 0) {
      updateVirtualScrollSizes(virtualScrollSliceRange.value.from);
      nextTick(() => { scrollTo(toIndex); });
    }
    else {
      onVirtualScrollEvt();
    }
  }

  function setVirtualScrollSize (scrollViewSize) {
    if (scrollViewSize === void 0 && "undefined" !== 'undefined') {
      const scrollEl = getVirtualScrollTarget();

      if (scrollEl !== void 0 && scrollEl !== null && scrollEl.nodeType !== 8) {
        scrollViewSize = getScrollDetails(
          scrollEl,
          getVirtualScrollEl(),
          beforeRef.value,
          afterRef.value,
          props.virtualScrollHorizontal,
          $q.lang.rtl,
          props.virtualScrollStickySizeStart,
          props.virtualScrollStickySizeEnd
        ).scrollViewSize;
      }
    }

    localScrollViewSize = scrollViewSize;

    const virtualScrollSliceRatioBefore = parseFloat(props.virtualScrollSliceRatioBefore) || 0;
    const virtualScrollSliceRatioAfter = parseFloat(props.virtualScrollSliceRatioAfter) || 0;
    const multiplier = 1 + virtualScrollSliceRatioBefore + virtualScrollSliceRatioAfter;
    const view = scrollViewSize === void 0 || scrollViewSize <= 0
      ? 1
      : Math.ceil(scrollViewSize / virtualScrollItemSizeComputed.value);

    const baseSize = Math.max(
      1,
      view,
      Math.ceil((props.virtualScrollSliceSize > 0 ? props.virtualScrollSliceSize : 10) / multiplier)
    );

    virtualScrollSliceSizeComputed.value = {
      total: Math.ceil(baseSize * multiplier),
      start: Math.ceil(baseSize * virtualScrollSliceRatioBefore),
      center: Math.ceil(baseSize * (0.5 + virtualScrollSliceRatioBefore)),
      end: Math.ceil(baseSize * (1 + virtualScrollSliceRatioBefore)),
      view
    };
  }

  function padVirtualScroll (tag, content) {
    const paddingSize = props.virtualScrollHorizontal === true ? 'width' : 'height';
    const style = {
      [ '--q-virtual-scroll-item-' + paddingSize ]: virtualScrollItemSizeComputed.value + 'px'
    };

    return [
      tag === 'tbody'
        ? h(tag, {
          class: 'q-virtual-scroll__padding',
          key: 'before',
          ref: beforeRef
        }, [
          h('tr', [
            h('td', {
              style: { [ paddingSize ]: `${ virtualScrollPaddingBefore.value }px`, ...style },
              colspan: colspanAttr.value
            })
          ])
        ])
        : h(tag, {
          class: 'q-virtual-scroll__padding',
          key: 'before',
          ref: beforeRef,
          style: { [ paddingSize ]: `${ virtualScrollPaddingBefore.value }px`, ...style }
        }),

      h(tag, {
        class: 'q-virtual-scroll__content',
        key: 'content',
        ref: contentRef,
        tabindex: -1
      }, content.flat()),

      tag === 'tbody'
        ? h(tag, {
          class: 'q-virtual-scroll__padding',
          key: 'after',
          ref: afterRef
        }, [
          h('tr', [
            h('td', {
              style: { [ paddingSize ]: `${ virtualScrollPaddingAfter.value }px`, ...style },
              colspan: colspanAttr.value
            })
          ])
        ])
        : h(tag, {
          class: 'q-virtual-scroll__padding',
          key: 'after',
          ref: afterRef,
          style: { [ paddingSize ]: `${ virtualScrollPaddingAfter.value }px`, ...style }
        })
    ]
  }

  function emitScroll (index) {
    if (prevToIndex !== index) {
      props.onVirtualScroll !== void 0 && emit('virtualScroll', {
        index,
        from: virtualScrollSliceRange.value.from,
        to: virtualScrollSliceRange.value.to - 1,
        direction: index < prevToIndex ? 'decrease' : 'increase',
        ref: proxy
      });

      prevToIndex = index;
    }
  }

  setVirtualScrollSize();
  const onVirtualScrollEvt = debounce(
    localOnVirtualScrollEvt,
    $q.platform.is.ios === true ? 120 : 35
  );

  onBeforeMount(() => {
    setVirtualScrollSize();
  });

  let shouldActivate = false;

  onDeactivated(() => {
    shouldActivate = true;
  });

  onActivated(() => {
    if (shouldActivate !== true) return

    const scrollEl = getVirtualScrollTarget();

    if (prevScrollStart !== void 0 && scrollEl !== void 0 && scrollEl !== null && scrollEl.nodeType !== 8) {
      setScroll(
        scrollEl,
        prevScrollStart,
        props.virtualScrollHorizontal,
        $q.lang.rtl
      );
    }
    else {
      scrollTo(prevToIndex);
    }
  });

  // expose public methods
  Object.assign(proxy, { scrollTo, reset, refresh });

  return {
    virtualScrollSliceRange,
    virtualScrollSliceSizeComputed,

    setVirtualScrollSize,
    onVirtualScrollEvt,
    localResetVirtualScroll,
    padVirtualScroll,

    scrollTo,
    reset,
    refresh
  }
}

function normalizeToInterval (v, min, max) {
  if (max <= min) {
    return min
  }

  const size = (max - min + 1);

  let index = min + (v - min) % size;
  if (index < min) {
    index = size + index;
  }

  return index === 0 ? 0 : index // fix for (-a % a) => -0
}

const validateNewValueMode = v => [ 'add', 'add-unique', 'toggle' ].includes(v);
const reEscapeList = '.*+?^${}()|[]\\';
const fieldPropsList = Object.keys(useFieldProps);

function getPropValueFn (userPropName, defaultPropName) {
  if (typeof userPropName === 'function') return userPropName

  const propName = userPropName !== void 0
    ? userPropName
    : defaultPropName;

  return opt => ((opt !== null && typeof opt === 'object' && propName in opt) ? opt[ propName ] : opt)
}

const __nuxt_component_5 = createComponent({
  name: 'QSelect',

  inheritAttrs: false,

  props: {
    ...useVirtualScrollProps,
    ...useFormProps,
    ...useFieldProps,

    // override of useFieldProps > modelValue
    modelValue: {
      required: true
    },

    multiple: Boolean,

    displayValue: [ String, Number ],
    displayValueHtml: Boolean,
    dropdownIcon: String,

    options: {
      type: Array,
      default: () => []
    },

    optionValue: [ Function, String ],
    optionLabel: [ Function, String ],
    optionDisable: [ Function, String ],

    hideSelected: Boolean,
    hideDropdownIcon: Boolean,
    fillInput: Boolean,

    maxValues: [ Number, String ],

    optionsDense: Boolean,
    optionsDark: {
      type: Boolean,
      default: null
    },
    optionsSelectedClass: String,
    optionsHtml: Boolean,

    optionsCover: Boolean,

    menuShrink: Boolean,
    menuAnchor: String,
    menuSelf: String,
    menuOffset: Array,

    popupContentClass: String,
    popupContentStyle: [ String, Array, Object ],
    popupNoRouteDismiss: Boolean,

    useInput: Boolean,
    useChips: Boolean,

    newValueMode: {
      type: String,
      validator: validateNewValueMode
    },

    mapOptions: Boolean,
    emitValue: Boolean,

    disableTabSelection: Boolean,

    inputDebounce: {
      type: [ Number, String ],
      default: 500
    },

    inputClass: [ Array, String, Object ],
    inputStyle: [ Array, String, Object ],

    tabindex: {
      type: [ String, Number ],
      default: 0
    },

    autocomplete: String,

    transitionShow: {},
    transitionHide: {},
    transitionDuration: {},

    behavior: {
      type: String,
      validator: v => [ 'default', 'menu', 'dialog' ].includes(v),
      default: 'default'
    },

    // override of useVirtualScrollProps > virtualScrollItemSize (no default)
    virtualScrollItemSize: useVirtualScrollProps.virtualScrollItemSize.type,

    onNewValue: Function,
    onFilter: Function
  },

  emits: [
    ...useFieldEmits,
    'add', 'remove', 'inputValue',
    'keyup', 'keypress', 'keydown',
    'popupShow', 'popupHide',
    'filterAbort'
  ],

  setup (props, { slots, emit }) {
    const { proxy } = getCurrentInstance();
    const { $q } = proxy;

    const menu = ref(false);
    const dialog = ref(false);
    const optionIndex = ref(-1);
    const inputValue = ref('');
    const dialogFieldFocused = ref(false);
    const innerLoadingIndicator = ref(false);

    let filterTimer = null, inputValueTimer = null,
      innerValueCache,
      hasDialog, userInputValue, filterId = null, defaultInputValue,
      transitionShowComputed, searchBuffer, searchBufferExp;

    const inputRef = ref(null);
    const targetRef = ref(null);
    const menuRef = ref(null);
    const dialogRef = ref(null);
    const menuContentRef = ref(null);

    const nameProp = useFormInputNameAttr(props);

    const onComposition = useKeyComposition(onInput);

    const virtualScrollLength = computed(() => (
      Array.isArray(props.options)
        ? props.options.length
        : 0
    ));

    const virtualScrollItemSizeComputed = computed(() => (
      props.virtualScrollItemSize === void 0
        ? (props.optionsDense === true ? 24 : 48)
        : props.virtualScrollItemSize
    ));

    const {
      virtualScrollSliceRange,
      virtualScrollSliceSizeComputed,
      localResetVirtualScroll,
      padVirtualScroll,
      onVirtualScrollEvt,
      scrollTo,
      setVirtualScrollSize
    } = useVirtualScroll({
      virtualScrollLength, getVirtualScrollTarget, getVirtualScrollEl,
      virtualScrollItemSizeComputed
    });

    const state = useFieldState();

    const innerValue = computed(() => {
      const
        mapNull = props.mapOptions === true && props.multiple !== true,
        val = props.modelValue !== void 0 && (props.modelValue !== null || mapNull === true)
          ? (props.multiple === true && Array.isArray(props.modelValue) ? props.modelValue : [ props.modelValue ])
          : [];

      if (props.mapOptions === true && Array.isArray(props.options) === true) {
        const cache = props.mapOptions === true && innerValueCache !== void 0
          ? innerValueCache
          : [];
        const values = val.map(v => getOption(v, cache));

        return props.modelValue === null && mapNull === true
          ? values.filter(v => v !== null)
          : values
      }

      return val
    });

    const innerFieldProps = computed(() => {
      const acc = {};
      fieldPropsList.forEach(key => {
        const val = props[ key ];
        if (val !== void 0) {
          acc[ key ] = val;
        }
      });
      return acc
    });

    const isOptionsDark = computed(() => (
      props.optionsDark === null
        ? state.isDark.value
        : props.optionsDark
    ));

    const hasValue = computed(() => fieldValueIsFilled(innerValue.value));

    const computedInputClass = computed(() => {
      let cls = 'q-field__input q-placeholder col';

      if (props.hideSelected === true || innerValue.value.length === 0) {
        return [ cls, props.inputClass ]
      }

      cls += ' q-field__input--padding';

      return props.inputClass === void 0
        ? cls
        : [ cls, props.inputClass ]
    });

    const menuContentClass = computed(() =>
      (props.virtualScrollHorizontal === true ? 'q-virtual-scroll--horizontal' : '')
      + (props.popupContentClass ? ' ' + props.popupContentClass : '')
    );

    const noOptions = computed(() => virtualScrollLength.value === 0);

    const selectedString = computed(() =>
      innerValue.value
        .map(opt => getOptionLabel.value(opt))
        .join(', ')
    );

    const ariaCurrentValue = computed(() => (props.displayValue !== void 0
      ? props.displayValue
      : selectedString.value
    ));

    const needsHtmlFn = computed(() => (
      props.optionsHtml === true
        ? () => true
        : opt => opt?.html === true
    ));

    const valueAsHtml = computed(() => (
      props.displayValueHtml === true || (
        props.displayValue === void 0 && (
          props.optionsHtml === true
          || innerValue.value.some(needsHtmlFn.value)
        )
      )
    ));

    const tabindex = computed(() => (state.focused.value === true ? props.tabindex : -1));

    const comboboxAttrs = computed(() => {
      const attrs = {
        tabindex: props.tabindex,
        role: 'combobox',
        'aria-label': props.label,
        'aria-readonly': props.readonly === true ? 'true' : 'false',
        'aria-autocomplete': props.useInput === true ? 'list' : 'none',
        'aria-expanded': menu.value === true ? 'true' : 'false',
        'aria-controls': `${ state.targetUid.value }_lb`
      };

      if (optionIndex.value >= 0) {
        attrs[ 'aria-activedescendant' ] = `${ state.targetUid.value }_${ optionIndex.value }`;
      }

      return attrs
    });

    const listboxAttrs = computed(() => ({
      id: `${ state.targetUid.value }_lb`,
      role: 'listbox',
      'aria-multiselectable': props.multiple === true ? 'true' : 'false'
    }));

    const selectedScope = computed(() => {
      return innerValue.value.map((opt, i) => ({
        index: i,
        opt,
        html: needsHtmlFn.value(opt),
        selected: true,
        removeAtIndex: removeAtIndexAndFocus,
        toggleOption,
        tabindex: tabindex.value
      }))
    });

    const optionScope = computed(() => {
      if (virtualScrollLength.value === 0) {
        return []
      }

      const { from, to } = virtualScrollSliceRange.value;

      return props.options.slice(from, to).map((opt, i) => {
        const disable = isOptionDisabled.value(opt) === true;
        const active = isOptionSelected(opt) === true;
        const index = from + i;

        const itemProps = {
          clickable: true,
          active,
          activeClass: computedOptionsSelectedClass.value,
          manualFocus: true,
          focused: false,
          disable,
          tabindex: -1,
          dense: props.optionsDense,
          dark: isOptionsDark.value,
          role: 'option',
          'aria-selected': active === true ? 'true' : 'false',
          id: `${ state.targetUid.value }_${ index }`,
          onClick: () => { toggleOption(opt); }
        };

        if (disable !== true) {
          optionIndex.value === index && (itemProps.focused = true);

          if ($q.platform.is.desktop === true) {
            itemProps.onMousemove = () => { menu.value === true && setOptionIndex(index); };
          }
        }

        return {
          index,
          opt,
          html: needsHtmlFn.value(opt),
          label: getOptionLabel.value(opt),
          selected: itemProps.active,
          focused: itemProps.focused,
          toggleOption,
          setOptionIndex,
          itemProps
        }
      })
    });

    const dropdownArrowIcon = computed(() => (
      props.dropdownIcon !== void 0
        ? props.dropdownIcon
        : $q.iconSet.arrow.dropdown
    ));

    const squaredMenu = computed(() =>
      props.optionsCover === false
      && props.outlined !== true
      && props.standout !== true
      && props.borderless !== true
      && props.rounded !== true
    );

    const computedOptionsSelectedClass = computed(() => (
      props.optionsSelectedClass !== void 0
        ? props.optionsSelectedClass
        : (props.color !== void 0 ? `text-${ props.color }` : '')
    ));

    // returns method to get value of an option;
    // takes into account 'option-value' prop
    const getOptionValue = computed(() => getPropValueFn(props.optionValue, 'value'));

    // returns method to get label of an option;
    // takes into account 'option-label' prop
    const getOptionLabel = computed(() => getPropValueFn(props.optionLabel, 'label'));

    // returns method to tell if an option is disabled;
    // takes into account 'option-disable' prop
    const isOptionDisabled = computed(() => getPropValueFn(props.optionDisable, 'disable'));

    const innerOptionsValue = computed(() => innerValue.value.map(getOptionValue.value));

    const inputControlEvents = computed(() => {
      const evt = {
        onInput,
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        onChange: onComposition,
        onKeydown: onTargetKeydown,
        onKeyup: onTargetAutocomplete,
        onKeypress: onTargetKeypress,
        onFocus: selectInputText,
        onClick (e) { hasDialog === true && stop(e); }
      };

      evt.onCompositionstart = evt.onCompositionupdate = evt.onCompositionend = onComposition;

      return evt
    });

    watch(innerValue, val => {
      innerValueCache = val;

      if (
        props.useInput === true
        && props.fillInput === true
        && props.multiple !== true
        // Prevent re-entering in filter while filtering
        // Also prevent clearing inputValue while filtering
        && state.innerLoading.value !== true
        && ((dialog.value !== true && menu.value !== true) || hasValue.value !== true)
      ) {
        userInputValue !== true && resetInputValue();
        if (dialog.value === true || menu.value === true) {
          filter('');
        }
      }
    }, { immediate: true });

    watch(() => props.fillInput, resetInputValue);

    watch(menu, updateMenu);

    watch(virtualScrollLength, rerenderMenu);

    function getEmittingOptionValue (opt) {
      return props.emitValue === true
        ? getOptionValue.value(opt)
        : opt
    }

    function removeAtIndex (index) {
      if (index !== -1 && index < innerValue.value.length) {
        if (props.multiple === true) {
          const model = props.modelValue.slice();
          emit('remove', { index, value: model.splice(index, 1)[ 0 ] });
          emit('update:modelValue', model);
        }
        else {
          emit('update:modelValue', null);
        }
      }
    }

    function removeAtIndexAndFocus (index) {
      removeAtIndex(index);
      state.focus();
    }

    function add (opt, unique) {
      const val = getEmittingOptionValue(opt);

      if (props.multiple !== true) {
        props.fillInput === true && updateInputValue(
          getOptionLabel.value(opt),
          true,
          true
        );

        emit('update:modelValue', val);
        return
      }

      if (innerValue.value.length === 0) {
        emit('add', { index: 0, value: val });
        emit('update:modelValue', props.multiple === true ? [ val ] : val);
        return
      }

      if (
        unique === true
        && isOptionSelected(opt) === true
      ) return

      if (
        props.maxValues !== void 0
        && props.modelValue.length >= props.maxValues
      ) return

      const model = props.modelValue.slice();

      emit('add', { index: model.length, value: val });
      model.push(val);
      emit('update:modelValue', model);
    }

    function toggleOption (opt, keepOpen) {
      if (
        state.editable.value !== true
        || opt === void 0
        || isOptionDisabled.value(opt) === true
      ) return

      const optValue = getOptionValue.value(opt);

      if (props.multiple !== true) {
        if (keepOpen !== true) {
          updateInputValue(
            props.fillInput === true ? getOptionLabel.value(opt) : '',
            true,
            true
          );

          hidePopup();
        }

        targetRef.value?.focus();

        if (
          innerValue.value.length === 0
          || isDeepEqual(getOptionValue.value(innerValue.value[ 0 ]), optValue) !== true
        ) {
          emit('update:modelValue', props.emitValue === true ? optValue : opt);
        }

        return
      }

      if (hasDialog !== true || dialogFieldFocused.value === true) {
        state.focus();
      }

      selectInputText();

      if (innerValue.value.length === 0) {
        const val = props.emitValue === true ? optValue : opt;
        emit('add', { index: 0, value: val });
        emit('update:modelValue', props.multiple === true ? [ val ] : val);
        return
      }

      const
        model = props.modelValue.slice(),
        index = innerOptionsValue.value.findIndex(v => isDeepEqual(v, optValue));

      if (index !== -1) {
        emit('remove', { index, value: model.splice(index, 1)[ 0 ] });
      }
      else {
        if (
          props.maxValues !== void 0
          && model.length >= props.maxValues
        ) return

        const val = props.emitValue === true ? optValue : opt;

        emit('add', { index: model.length, value: val });
        model.push(val);
      }

      emit('update:modelValue', model);
    }

    function setOptionIndex (index) {
      if ($q.platform.is.desktop !== true) return

      const val = index !== -1 && index < virtualScrollLength.value
        ? index
        : -1;

      if (optionIndex.value !== val) {
        optionIndex.value = val;
      }
    }

    function moveOptionSelection (offset = 1, skipInputValue) {
      if (menu.value === true) {
        let index = optionIndex.value;
        do {
          index = normalizeToInterval(
            index + offset,
            -1,
            virtualScrollLength.value - 1
          );
        }
        while (index !== -1 && index !== optionIndex.value && isOptionDisabled.value(props.options[ index ]) === true)

        if (optionIndex.value !== index) {
          setOptionIndex(index);
          scrollTo(index);

          if (skipInputValue !== true && props.useInput === true && props.fillInput === true) {
            setInputValue(
              index >= 0
                ? getOptionLabel.value(props.options[ index ])
                : defaultInputValue,
              true
            );
          }
        }
      }
    }

    function getOption (value, valueCache) {
      const fn = opt => isDeepEqual(getOptionValue.value(opt), value);
      return props.options.find(fn) || valueCache.find(fn) || value
    }

    function isOptionSelected (opt) {
      const val = getOptionValue.value(opt);
      return innerOptionsValue.value.find(v => isDeepEqual(v, val)) !== void 0
    }

    function selectInputText (e) {
      if (
        props.useInput === true
        && targetRef.value !== null
        && (e === void 0 || (targetRef.value === e.target && e.target.value === selectedString.value))
      ) {
        targetRef.value.select();
      }
    }

    function onTargetKeyup (e) {
      // if ESC and we have an opened menu
      // then stop propagation (might be caught by a QDialog
      // and so it will also close the QDialog, which is wrong)
      if (isKeyCode(e, 27) === true && menu.value === true) {
        stop(e);
        // on ESC we need to close the dialog also
        hidePopup();
        resetInputValue();
      }

      emit('keyup', e);
    }

    function onTargetAutocomplete (e) {
      const { value } = e.target;

      if (e.keyCode !== void 0) {
        onTargetKeyup(e);
        return
      }

      e.target.value = '';

      if (filterTimer !== null) {
        clearTimeout(filterTimer);
        filterTimer = null;
      }
      if (inputValueTimer !== null) {
        clearTimeout(inputValueTimer);
        inputValueTimer = null;
      }

      resetInputValue();

      if (typeof value === 'string' && value.length !== 0) {
        const needle = value.toLocaleLowerCase();
        const findFn = extractFn => {
          const option = props.options.find(opt => String(extractFn.value(opt)).toLocaleLowerCase() === needle);

          if (option === void 0) return false

          if (innerValue.value.indexOf(option) === -1) {
            toggleOption(option);
          }
          else {
            hidePopup();
          }

          return true
        };
        const fillFn = afterFilter => {
          if (
            findFn(getOptionValue) !== true
            && afterFilter !== true
            && findFn(getOptionLabel) !== true
          ) {
            filter(value, true, () => fillFn(true));
          }
        };

        fillFn();
      }
      else {
        state.clearValue(e);
      }
    }

    function onTargetKeypress (e) {
      emit('keypress', e);
    }

    function onTargetKeydown (e) {
      emit('keydown', e);

      if (shouldIgnoreKey(e) === true) return

      const newValueModeValid = inputValue.value.length !== 0
        && (props.newValueMode !== void 0 || props.onNewValue !== void 0);

      const tabShouldSelect = e.shiftKey !== true
        && props.disableTabSelection !== true
        && props.multiple !== true
        && (optionIndex.value !== -1 || newValueModeValid === true);

      // escape
      if (e.keyCode === 27) {
        prevent(e); // prevent clearing the inputValue
        return
      }

      // tab
      if (e.keyCode === 9 && tabShouldSelect === false) {
        closeMenu();
        return
      }

      if (
        e.target === void 0
        || e.target.id !== state.targetUid.value
        || state.editable.value !== true
      ) return

      // down
      if (
        e.keyCode === 40
        && state.innerLoading.value !== true
        && menu.value === false
      ) {
        stopAndPrevent(e);
        showPopup();
        return
      }

      // backspace
      if (
        e.keyCode === 8
        && (
          props.useChips === true
          || props.clearable === true
        )
        && props.hideSelected !== true
        && inputValue.value.length === 0
      ) {
        if (props.multiple === true && Array.isArray(props.modelValue) === true) {
          removeAtIndex(props.modelValue.length - 1);
        }
        else if (props.multiple !== true && props.modelValue !== null) {
          emit('update:modelValue', null);
        }

        return
      }

      // home, end - 36, 35
      if (
        (e.keyCode === 35 || e.keyCode === 36)
        && (typeof inputValue.value !== 'string' || inputValue.value.length === 0)
      ) {
        stopAndPrevent(e);
        optionIndex.value = -1;
        moveOptionSelection(e.keyCode === 36 ? 1 : -1, props.multiple);
      }

      // pg up, pg down - 33, 34
      if (
        (e.keyCode === 33 || e.keyCode === 34)
        && virtualScrollSliceSizeComputed.value !== void 0
      ) {
        stopAndPrevent(e);
        optionIndex.value = Math.max(
          -1,
          Math.min(
            virtualScrollLength.value,
            optionIndex.value + (e.keyCode === 33 ? -1 : 1) * virtualScrollSliceSizeComputed.value.view
          )
        );
        moveOptionSelection(e.keyCode === 33 ? 1 : -1, props.multiple);
      }

      // up, down
      if (e.keyCode === 38 || e.keyCode === 40) {
        stopAndPrevent(e);
        moveOptionSelection(e.keyCode === 38 ? -1 : 1, props.multiple);
      }

      const optionsLength = virtualScrollLength.value;

      // clear search buffer if expired
      if (searchBuffer === void 0 || searchBufferExp < Date.now()) {
        searchBuffer = '';
      }

      // keyboard search when not having use-input
      if (
        optionsLength > 0
        && props.useInput !== true
        && e.key !== void 0
        && e.key.length === 1 // printable char
        && e.altKey === false // not kbd shortcut
        && e.ctrlKey === false // not kbd shortcut
        && e.metaKey === false // not kbd shortcut, especially on macOS with Command key
        && (e.keyCode !== 32 || searchBuffer.length !== 0) // space in middle of search
      ) {
        menu.value !== true && showPopup(e);

        const
          char = e.key.toLocaleLowerCase(),
          keyRepeat = searchBuffer.length === 1 && searchBuffer[ 0 ] === char;

        searchBufferExp = Date.now() + 1500;
        if (keyRepeat === false) {
          stopAndPrevent(e);
          searchBuffer += char;
        }

        const searchRe = new RegExp('^' + searchBuffer.split('').map(l => (reEscapeList.indexOf(l) !== -1 ? '\\' + l : l)).join('.*'), 'i');

        let index = optionIndex.value;

        if (keyRepeat === true || index < 0 || searchRe.test(getOptionLabel.value(props.options[ index ])) !== true) {
          do {
            index = normalizeToInterval(index + 1, -1, optionsLength - 1);
          }
          while (index !== optionIndex.value && (
            isOptionDisabled.value(props.options[ index ]) === true
            || searchRe.test(getOptionLabel.value(props.options[ index ])) !== true
          ))
        }

        if (optionIndex.value !== index) {
          nextTick(() => {
            setOptionIndex(index);
            scrollTo(index);

            if (index >= 0 && props.useInput === true && props.fillInput === true) {
              setInputValue(getOptionLabel.value(props.options[ index ]), true);
            }
          });
        }

        return
      }

      // enter, space (when not using use-input and not in search), or tab (when not using multiple and option selected)
      // same target is checked above
      if (
        e.keyCode !== 13
        && (e.keyCode !== 32 || props.useInput === true || searchBuffer !== '')
        && (e.keyCode !== 9 || tabShouldSelect === false)
      ) return

      e.keyCode !== 9 && stopAndPrevent(e);

      if (optionIndex.value !== -1 && optionIndex.value < optionsLength) {
        toggleOption(props.options[ optionIndex.value ]);
        return
      }

      if (newValueModeValid === true) {
        const done = (val, mode) => {
          if (mode) {
            if (validateNewValueMode(mode) !== true) return
          }
          else {
            mode = props.newValueMode;
          }

          updateInputValue('', props.multiple !== true, true);

          if (val === void 0 || val === null) return

          const fn = mode === 'toggle' ? toggleOption : add;
          fn(val, mode === 'add-unique');

          if (props.multiple !== true) {
            targetRef.value?.focus();
            hidePopup();
          }
        };

        if (props.onNewValue !== void 0) {
          emit('newValue', inputValue.value, done);
        }
        else {
          done(inputValue.value);
        }

        if (props.multiple !== true) return
      }

      if (menu.value === true) {
        closeMenu();
      }
      else if (state.innerLoading.value !== true) {
        showPopup();
      }
    }

    function getVirtualScrollEl () {
      return hasDialog === true
        ? menuContentRef.value
        : (
            menuRef.value !== null && menuRef.value.contentEl !== null
              ? menuRef.value.contentEl
              : void 0
          )
    }

    function getVirtualScrollTarget () {
      return getVirtualScrollEl()
    }

    function getSelection () {
      if (props.hideSelected === true) {
        return []
      }

      if (slots[ 'selected-item' ] !== void 0) {
        return selectedScope.value.map(scope => slots[ 'selected-item' ](scope)).slice()
      }

      if (slots.selected !== void 0) {
        return [].concat(slots.selected())
      }

      if (props.useChips === true) {
        return selectedScope.value.map((scope, i) => h(QChip, {
          key: 'option-' + i,
          removable: state.editable.value === true && isOptionDisabled.value(scope.opt) !== true,
          dense: true,
          textColor: props.color,
          tabindex: tabindex.value,
          onRemove () { scope.removeAtIndex(i); }
        }, () => h('span', {
          class: 'ellipsis',
          [ scope.html === true ? 'innerHTML' : 'textContent' ]: getOptionLabel.value(scope.opt)
        })))
      }

      return [
        h('span', {
          class: 'ellipsis',
          [ valueAsHtml.value === true ? 'innerHTML' : 'textContent' ]: ariaCurrentValue.value
        })
      ]
    }

    function getAllOptions () {
      if (noOptions.value === true) {
        return slots[ 'no-option' ] !== void 0
          ? slots[ 'no-option' ]({ inputValue: inputValue.value })
          : void 0
      }

      const fn = slots.option !== void 0
        ? slots.option
        : scope => {
          return h(__nuxt_component_6, {
            key: scope.index,
            ...scope.itemProps
          }, () => {
            return h(
              __nuxt_component_7,
              () => h(
                QItemLabel,
                () => h('span', {
                  [ scope.html === true ? 'innerHTML' : 'textContent' ]: scope.label
                })
              )
            )
          })
        };

      let options = padVirtualScroll('div', optionScope.value.map(fn));

      if (slots[ 'before-options' ] !== void 0) {
        options = slots[ 'before-options' ]().concat(options);
      }

      return hMergeSlot(slots[ 'after-options' ], options)
    }

    function getInput (fromDialog, isTarget) {
      const attrs = isTarget === true ? { ...comboboxAttrs.value, ...state.splitAttrs.attributes.value } : void 0;

      const data = {
        ref: isTarget === true ? targetRef : void 0,
        key: 'i_t',
        class: computedInputClass.value,
        style: props.inputStyle,
        value: inputValue.value !== void 0 ? inputValue.value : '',
        // required for Android in order to show ENTER key when in form
        type: 'search',
        ...attrs,
        id: isTarget === true ? state.targetUid.value : void 0,
        maxlength: props.maxlength,
        autocomplete: props.autocomplete,
        'data-autofocus': fromDialog === true || props.autofocus === true || void 0,
        disabled: props.disable === true,
        readonly: props.readonly === true,
        ...inputControlEvents.value
      };

      if (fromDialog !== true && hasDialog === true) {
        if (Array.isArray(data.class) === true) {
          data.class = [ ...data.class, 'no-pointer-events' ];
        }
        else {
          data.class += ' no-pointer-events';
        }
      }

      return h('input', data)
    }

    function onInput (e) {
      if (filterTimer !== null) {
        clearTimeout(filterTimer);
        filterTimer = null;
      }
      if (inputValueTimer !== null) {
        clearTimeout(inputValueTimer);
        inputValueTimer = null;
      }

      if (
        e
        && e.target
        && e.target.qComposing === true
      ) return

      setInputValue(e.target.value || '');
      // mark it here as user input so that if updateInputValue is called
      // before filter is called the indicator is reset
      userInputValue = true;
      defaultInputValue = inputValue.value;

      if (
        state.focused.value !== true
        && (hasDialog !== true || dialogFieldFocused.value === true)
      ) {
        state.focus();
      }

      if (props.onFilter !== void 0) {
        filterTimer = setTimeout(() => {
          filterTimer = null;
          filter(inputValue.value);
        }, props.inputDebounce);
      }
    }

    function setInputValue (val, emitImmediately) {
      if (inputValue.value !== val) {
        inputValue.value = val;

        if (emitImmediately === true || props.inputDebounce === 0 || props.inputDebounce === '0') {
          emit('inputValue', val);
        }
        else {
          inputValueTimer = setTimeout(() => {
            inputValueTimer = null;
            emit('inputValue', val);
          }, props.inputDebounce);
        }
      }
    }

    function updateInputValue (val, noFiltering, internal) {
      userInputValue = internal !== true;

      if (props.useInput === true) {
        setInputValue(val, true);

        if (noFiltering === true || internal !== true) {
          defaultInputValue = val;
        }

        noFiltering !== true && filter(val);
      }
    }

    function filter (val, keepClosed, afterUpdateFn) {
      if (
        props.onFilter === void 0
        || (keepClosed !== true && state.focused.value !== true)
      ) return

      if (state.innerLoading.value === true) {
        emit('filterAbort');
      }
      else {
        state.innerLoading.value = true;
        innerLoadingIndicator.value = true;
      }

      if (
        val !== ''
        && props.multiple !== true
        && innerValue.value.length !== 0
        && userInputValue !== true
        && val === getOptionLabel.value(innerValue.value[ 0 ])
      ) {
        val = '';
      }

      const localFilterId = setTimeout(() => {
        menu.value === true && (menu.value = false);
      }, 10);

      filterId !== null && clearTimeout(filterId);
      filterId = localFilterId;

      emit(
        'filter',
        val,
        (fn, afterFn) => {
          if ((keepClosed === true || state.focused.value === true) && filterId === localFilterId) {
            clearTimeout(filterId);

            typeof fn === 'function' && fn();

            // hide indicator to allow arrow to animate
            innerLoadingIndicator.value = false;

            nextTick(() => {
              state.innerLoading.value = false;

              if (state.editable.value === true) {
                if (keepClosed === true) {
                  menu.value === true && hidePopup();
                }
                else if (menu.value === true) {
                  updateMenu(true);
                }
                else {
                  menu.value = true;
                }
              }

              typeof afterFn === 'function' && nextTick(() => { afterFn(proxy); });
              typeof afterUpdateFn === 'function' && nextTick(() => { afterUpdateFn(proxy); });
            });
          }
        },
        () => {
          if (state.focused.value === true && filterId === localFilterId) {
            clearTimeout(filterId);
            state.innerLoading.value = false;
            innerLoadingIndicator.value = false;
          }
          menu.value === true && (menu.value = false);
        }
      );
    }

    function getMenu () {
      return h(__nuxt_component_4$2, {
        ref: menuRef,
        class: menuContentClass.value,
        style: props.popupContentStyle,
        modelValue: menu.value,
        fit: props.menuShrink !== true,
        cover: props.optionsCover === true && noOptions.value !== true && props.useInput !== true,
        anchor: props.menuAnchor,
        self: props.menuSelf,
        offset: props.menuOffset,
        dark: isOptionsDark.value,
        noParentEvent: true,
        noRefocus: true,
        noFocus: true,
        noRouteDismiss: props.popupNoRouteDismiss,
        square: squaredMenu.value,
        transitionShow: props.transitionShow,
        transitionHide: props.transitionHide,
        transitionDuration: props.transitionDuration,
        separateClosePopup: true,
        ...listboxAttrs.value,
        onScrollPassive: onVirtualScrollEvt,
        onBeforeShow: onControlPopupShow,
        onBeforeHide: onMenuBeforeHide,
        onShow: onMenuShow
      }, getAllOptions)
    }

    function onMenuBeforeHide (e) {
      onControlPopupHide(e);
      closeMenu();
    }

    function onMenuShow () {
      setVirtualScrollSize();
    }

    function onDialogFieldFocus (e) {
      stop(e);
      targetRef.value?.focus();
      dialogFieldFocused.value = true;
      window.scrollTo(window.pageXOffset || window.scrollX || document.body.scrollLeft || 0, 0);
    }

    function onDialogFieldBlur (e) {
      stop(e);
      nextTick(() => {
        dialogFieldFocused.value = false;
      });
    }

    function getDialog () {
      const content = [
        h(QField, {
          class: `col-auto ${ state.fieldClass.value }`,
          ...innerFieldProps.value,
          for: state.targetUid.value,
          dark: isOptionsDark.value,
          square: true,
          loading: innerLoadingIndicator.value,
          itemAligned: false,
          filled: true,
          stackLabel: inputValue.value.length !== 0,
          ...state.splitAttrs.listeners.value,
          onFocus: onDialogFieldFocus,
          onBlur: onDialogFieldBlur
        }, {
          ...slots,
          rawControl: () => state.getControl(true),
          before: void 0,
          after: void 0
        })
      ];

      menu.value === true && content.push(
        h('div', {
          ref: menuContentRef,
          class: menuContentClass.value + ' scroll',
          style: props.popupContentStyle,
          ...listboxAttrs.value,
          onClick: prevent,
          onScrollPassive: onVirtualScrollEvt
        }, getAllOptions())
      );

      return h(__nuxt_component_1, {
        ref: dialogRef,
        modelValue: dialog.value,
        position: props.useInput === true ? 'top' : void 0,
        transitionShow: transitionShowComputed,
        transitionHide: props.transitionHide,
        transitionDuration: props.transitionDuration,
        noRouteDismiss: props.popupNoRouteDismiss,
        onBeforeShow: onControlPopupShow,
        onBeforeHide: onDialogBeforeHide,
        onHide: onDialogHide,
        onShow: onDialogShow
      }, () => h('div', {
        class: 'q-select__dialog'
          + (isOptionsDark.value === true ? ' q-select__dialog--dark q-dark' : '')
          + (dialogFieldFocused.value === true ? ' q-select__dialog--focused' : '')
      }, content))
    }

    function onDialogBeforeHide (e) {
      onControlPopupHide(e);

      if (dialogRef.value !== null) {
        dialogRef.value.__updateRefocusTarget(
          state.rootRef.value.querySelector('.q-field__native > [tabindex]:last-child')
        );
      }

      state.focused.value = false;
    }

    function onDialogHide (e) {
      hidePopup();
      state.focused.value === false && emit('blur', e);
      resetInputValue();
    }

    function onDialogShow () {
      const el = document.activeElement;
      if (
        (el === null || el.id !== state.targetUid.value)
        && targetRef.value !== null
        && targetRef.value !== el
      ) {
        targetRef.value.focus();
      }

      setVirtualScrollSize();
    }

    function closeMenu () {
      if (dialog.value === true) return

      optionIndex.value = -1;

      if (menu.value === true) {
        menu.value = false;
      }

      if (state.focused.value === false) {
        if (filterId !== null) {
          clearTimeout(filterId);
          filterId = null;
        }

        if (state.innerLoading.value === true) {
          emit('filterAbort');
          state.innerLoading.value = false;
          innerLoadingIndicator.value = false;
        }
      }
    }

    function showPopup (e) {
      if (state.editable.value !== true) return

      if (hasDialog === true) {
        state.onControlFocusin(e);
        dialog.value = true;
        nextTick(() => {
          state.focus();
        });
      }
      else {
        state.focus();
      }

      if (props.onFilter !== void 0) {
        filter(inputValue.value);
      }
      else if (noOptions.value !== true || slots[ 'no-option' ] !== void 0) {
        menu.value = true;
      }
    }

    function hidePopup () {
      dialog.value = false;
      closeMenu();
    }

    function resetInputValue () {
      props.useInput === true && updateInputValue(
        props.multiple !== true && props.fillInput === true && innerValue.value.length !== 0
          ? getOptionLabel.value(innerValue.value[ 0 ]) || ''
          : '',
        true,
        true
      );
    }

    function updateMenu (show) {
      let optionIndex = -1;

      if (show === true) {
        if (innerValue.value.length !== 0) {
          const val = getOptionValue.value(innerValue.value[ 0 ]);
          optionIndex = props.options.findIndex(v => isDeepEqual(getOptionValue.value(v), val));
        }

        localResetVirtualScroll(optionIndex);
      }

      setOptionIndex(optionIndex);
    }

    function rerenderMenu (newLength, oldLength) {
      if (menu.value === true && state.innerLoading.value === false) {
        localResetVirtualScroll(-1, true);

        nextTick(() => {
          if (menu.value === true && state.innerLoading.value === false) {
            if (newLength > oldLength) {
              localResetVirtualScroll();
            }
            else {
              updateMenu(true);
            }
          }
        });
      }
    }

    function updateMenuPosition () {
      if (dialog.value === false && menuRef.value !== null) {
        menuRef.value.updatePosition();
      }
    }

    function onControlPopupShow (e) {
      e !== void 0 && stop(e);
      emit('popupShow', e);
      state.hasPopupOpen = true;
      state.onControlFocusin(e);
    }

    function onControlPopupHide (e) {
      e !== void 0 && stop(e);
      emit('popupHide', e);
      state.hasPopupOpen = false;
      state.onControlFocusout(e);
    }

    function updatePreState () {
      hasDialog = $q.platform.is.mobile !== true && props.behavior !== 'dialog'
        ? false
        : props.behavior !== 'menu' && (
          props.useInput === true
            ? slots[ 'no-option' ] !== void 0 || props.onFilter !== void 0 || noOptions.value === false
            : true
        );

      transitionShowComputed = $q.platform.is.ios === true && hasDialog === true && props.useInput === true
        ? 'fade'
        : props.transitionShow;
    }

    onBeforeUpdate(updatePreState);
    onUpdated(updateMenuPosition);

    updatePreState();

    onBeforeUnmount(() => {
      filterTimer !== null && clearTimeout(filterTimer);
      inputValueTimer !== null && clearTimeout(inputValueTimer);
    });

    // expose public methods
    Object.assign(proxy, {
      showPopup, hidePopup,
      removeAtIndex, add, toggleOption,
      getOptionIndex: () => optionIndex.value,
      setOptionIndex, moveOptionSelection,
      filter, updateMenuPosition, updateInputValue,
      isOptionSelected,
      getEmittingOptionValue,
      isOptionDisabled: (...args) => isOptionDisabled.value.apply(null, args) === true,
      getOptionValue: (...args) => getOptionValue.value.apply(null, args),
      getOptionLabel: (...args) => getOptionLabel.value.apply(null, args)
    });

    Object.assign(state, {
      innerValue,

      fieldClass: computed(() =>
        `q-select q-field--auto-height q-select--with${ props.useInput !== true ? 'out' : '' }-input`
        + ` q-select--with${ props.useChips !== true ? 'out' : '' }-chips`
        + ` q-select--${ props.multiple === true ? 'multiple' : 'single' }`
      ),

      inputRef,
      targetRef,
      hasValue,
      showPopup,

      floatingLabel: computed(() =>
        (props.hideSelected !== true && hasValue.value === true)
        || typeof inputValue.value === 'number'
        || inputValue.value.length !== 0
        || fieldValueIsFilled(props.displayValue)
      ),

      getControlChild: () => {
        if (
          state.editable.value !== false && (
            dialog.value === true // dialog always has menu displayed, so need to render it
            || noOptions.value !== true
            || slots[ 'no-option' ] !== void 0
          )
        ) {
          return hasDialog === true ? getDialog() : getMenu()
        }
        else if (state.hasPopupOpen === true) {
          // explicitly set it otherwise TAB will not blur component
          state.hasPopupOpen = false;
        }
      },

      controlEvents: {
        onFocusin (e) { state.onControlFocusin(e); },
        onFocusout (e) {
          state.onControlFocusout(e, () => {
            resetInputValue();
            closeMenu();
          });
        },
        onClick (e) {
          // label from QField will propagate click on the input
          prevent(e);

          if (hasDialog !== true && menu.value === true) {
            closeMenu();
            targetRef.value?.focus();
            return
          }

          showPopup(e);
        }
      },

      getControl: fromDialog => {
        const child = getSelection();
        const isTarget = fromDialog === true || dialog.value !== true || hasDialog !== true;

        if (props.useInput === true) {
          child.push(getInput(fromDialog, isTarget));
        }
        // there can be only one (when dialog is opened the control in dialog should be target)
        else if (state.editable.value === true) {
          const attrs = isTarget === true ? comboboxAttrs.value : void 0;

          child.push(
            h('input', {
              ref: isTarget === true ? targetRef : void 0,
              key: 'd_t',
              class: 'q-select__focus-target',
              id: isTarget === true ? state.targetUid.value : void 0,
              value: ariaCurrentValue.value,
              readonly: true,
              'data-autofocus': fromDialog === true || props.autofocus === true || void 0,
              ...attrs,
              onKeydown: onTargetKeydown,
              onKeyup: onTargetKeyup,
              onKeypress: onTargetKeypress
            })
          );

          if (isTarget === true && typeof props.autocomplete === 'string' && props.autocomplete.length !== 0) {
            child.push(
              h('input', {
                class: 'q-select__autocomplete-input',
                autocomplete: props.autocomplete,
                tabindex: -1,
                onKeyup: onTargetAutocomplete
              })
            );
          }
        }

        if (nameProp.value !== void 0 && props.disable !== true && innerOptionsValue.value.length !== 0) {
          const opts = innerOptionsValue.value.map(value => h('option', { value, selected: true }));

          child.push(
            h('select', {
              class: 'hidden',
              name: nameProp.value,
              multiple: props.multiple
            }, opts)
          );
        }

        const attrs = props.useInput === true || isTarget !== true ? void 0 : state.splitAttrs.attributes.value;

        return h('div', {
          class: 'q-field__native row items-center',
          ...attrs,
          ...state.splitAttrs.listeners.value
        }, child)
      },

      getInnerAppend: () => (
        props.loading !== true && innerLoadingIndicator.value !== true && props.hideDropdownIcon !== true
          ? [
              h(__nuxt_component_4$1, {
                class: 'q-select__dropdown-icon' + (menu.value === true ? ' rotate-180' : ''),
                name: dropdownArrowIcon.value
              })
            ]
          : null
      )
    });

    return useField(state)
  }
});

const __nuxt_component_12 = createComponent({
  name: 'QTh',

  props: {
    props: Object,
    autoWidth: Boolean
  },

  emits: [ 'click' ],

  setup (props, { slots, emit }) {
    const vm = getCurrentInstance();
    const { proxy: { $q } } = vm;

    const onClick = evt => { emit('click', evt); };

    return () => {
      if (props.props === void 0) {
        return h('th', {
          class: props.autoWidth === true ? 'q-table--col-auto-width' : '',
          onClick
        }, hSlot(slots.default))
      }

      let col, child;
      const name = vm.vnode.key;

      if (name) {
        col = props.props.colsMap[ name ];
        if (col === void 0) return
      }
      else {
        col = props.props.col;
      }

      if (col.sortable === true) {
        const action = col.align === 'right'
          ? 'unshift'
          : 'push';

        child = hUniqueSlot(slots.default, []);
        child[ action ](
          h(__nuxt_component_4$1, {
            class: col.__iconClass,
            name: $q.iconSet.table.arrowUp
          })
        );
      }
      else {
        child = hSlot(slots.default);
      }

      const data = {
        class: col.__thClass
          + (props.autoWidth === true ? ' q-table--col-auto-width' : ''),
        style: col.headerStyle,
        onClick: evt => {
          col.sortable === true && props.props.sort(col);
          onClick(evt);
        }
      };

      return h('th', data, child)
    }
  }
});

const separatorValues = [ 'horizontal', 'vertical', 'cell', 'none' ];

const QMarkupTable = createComponent({
  name: 'QMarkupTable',

  props: {
    ...useDarkProps,

    dense: Boolean,
    flat: Boolean,
    bordered: Boolean,
    square: Boolean,
    wrapCells: Boolean,

    separator: {
      type: String,
      default: 'horizontal',
      validator: v => separatorValues.includes(v)
    }
  },

  setup (props, { slots }) {
    const vm = getCurrentInstance();
    const isDark = useDark(props, vm.proxy.$q);

    const classes = computed(() =>
      'q-markup-table q-table__container q-table__card'
      + ` q-table--${ props.separator }-separator`
      + (isDark.value === true ? ' q-table--dark q-table__card--dark q-dark' : '')
      + (props.dense === true ? ' q-table--dense' : '')
      + (props.flat === true ? ' q-table--flat' : '')
      + (props.bordered === true ? ' q-table--bordered' : '')
      + (props.square === true ? ' q-table--square' : '')
      + (props.wrapCells === false ? ' q-table--no-wrap' : '')
    );

    return () => h('div', {
      class: classes.value
    }, [
      h('table', { class: 'q-table' }, hSlot(slots.default))
    ])
  }
});

function getTableMiddle (props, content) {
  return h('div', props, [
    h('table', { class: 'q-table' }, content)
  ])
}

const comps = {
  list: __nuxt_component_5$1,
  table: QMarkupTable
};

const typeOptions = [ 'list', 'table', '__qtable' ];

const QVirtualScroll = createComponent({
  name: 'QVirtualScroll',

  props: {
    ...useVirtualScrollProps,

    type: {
      type: String,
      default: 'list',
      validator: v => typeOptions.includes(v)
    },

    items: {
      type: Array,
      default: () => []
    },

    itemsFn: Function,
    itemsSize: Number,

    scrollTarget: scrollTargetProp
  },

  setup (props, { slots, attrs }) {
    let localScrollTarget;
    const rootRef = ref(null);

    const virtualScrollLength = computed(() => (
      props.itemsSize >= 0 && props.itemsFn !== void 0
        ? parseInt(props.itemsSize, 10)
        : (Array.isArray(props.items) ? props.items.length : 0)
    ));

    const {
      virtualScrollSliceRange,
      localResetVirtualScroll,
      padVirtualScroll,
      onVirtualScrollEvt
    } = useVirtualScroll({
      virtualScrollLength, getVirtualScrollTarget, getVirtualScrollEl
    });

    const virtualScrollScope = computed(() => {
      if (virtualScrollLength.value === 0) {
        return []
      }

      const mapFn = (item, i) => ({
        index: virtualScrollSliceRange.value.from + i,
        item
      });

      return props.itemsFn === void 0
        ? props.items.slice(virtualScrollSliceRange.value.from, virtualScrollSliceRange.value.to).map(mapFn)
        : props.itemsFn(virtualScrollSliceRange.value.from, virtualScrollSliceRange.value.to - virtualScrollSliceRange.value.from).map(mapFn)
    });

    const classes = computed(() =>
      'q-virtual-scroll q-virtual-scroll' + (props.virtualScrollHorizontal === true ? '--horizontal' : '--vertical')
      + (props.scrollTarget !== void 0 ? '' : ' scroll')
    );

    const attributes = computed(() => (
      props.scrollTarget !== void 0 ? {} : { tabindex: 0 }
    ));

    watch(virtualScrollLength, () => {
      localResetVirtualScroll();
    });

    watch(() => props.scrollTarget, () => {
      unconfigureScrollTarget();
      configureScrollTarget();
    });

    function getVirtualScrollEl () {
      return rootRef.value.$el || rootRef.value
    }

    function getVirtualScrollTarget () {
      return localScrollTarget
    }

    function configureScrollTarget () {
      localScrollTarget = getScrollTarget(getVirtualScrollEl(), props.scrollTarget);
      localScrollTarget.addEventListener('scroll', onVirtualScrollEvt, listenOpts.passive);
    }

    function unconfigureScrollTarget () {
      if (localScrollTarget !== void 0) {
        localScrollTarget.removeEventListener('scroll', onVirtualScrollEvt, listenOpts.passive);
        localScrollTarget = void 0;
      }
    }

    function __getVirtualChildren () {
      let child = padVirtualScroll(
        props.type === 'list' ? 'div' : 'tbody',
        virtualScrollScope.value.map(slots.default)
      );

      if (slots.before !== void 0) {
        child = slots.before().concat(child);
      }

      return hMergeSlot(slots.after, child)
    }

    onBeforeMount(() => {
      localResetVirtualScroll();
    });

    onMounted(() => {
      configureScrollTarget();
    });

    onActivated(() => {
      configureScrollTarget();
    });

    onDeactivated(() => {
      unconfigureScrollTarget();
    });

    onBeforeUnmount(() => {
      unconfigureScrollTarget();
    });

    return () => {
      if (slots.default === void 0) {
        console.error('QVirtualScroll: default scoped slot is required for rendering');
        return
      }

      return props.type === '__qtable'
        ? getTableMiddle(
          { ref: rootRef, class: 'q-table__middle ' + classes.value },
          __getVirtualChildren()
        )
        : h(comps[ props.type ], {
          ...attrs,
          ref: rootRef,
          class: [ attrs.class, classes.value ],
          ...attributes.value
        }, __getVirtualChildren)
    }
  }
});

const defaultSizes = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 10,
  xl: 14
};

function width (val, reverse, $q) {
  return {
    transform: reverse === true
      ? `translateX(${ $q.lang.rtl === true ? '-' : '' }100%) scale3d(${ -val },1,1)`
      : `scale3d(${ val },1,1)`
  }
}

const QLinearProgress = createComponent({
  name: 'QLinearProgress',

  props: {
    ...useDarkProps,
    ...useSizeProps,

    value: {
      type: Number,
      default: 0
    },
    buffer: Number,

    color: String,
    trackColor: String,

    reverse: Boolean,
    stripe: Boolean,
    indeterminate: Boolean,
    query: Boolean,
    rounded: Boolean,

    animationSpeed: {
      type: [ String, Number ],
      default: 2100
    },

    instantFeedback: Boolean
  },

  setup (props, { slots }) {
    const { proxy } = getCurrentInstance();
    const isDark = useDark(props, proxy.$q);
    const sizeStyle = useSize(props, defaultSizes);

    const motion = computed(() => props.indeterminate === true || props.query === true);
    const widthReverse = computed(() => props.reverse !== props.query);
    const style = computed(() => ({
      ...(sizeStyle.value !== null ? sizeStyle.value : {}),
      '--q-linear-progress-speed': `${ props.animationSpeed }ms`
    }));

    const classes = computed(() =>
      'q-linear-progress'
      + (props.color !== void 0 ? ` text-${ props.color }` : '')
      + (props.reverse === true || props.query === true ? ' q-linear-progress--reverse' : '')
      + (props.rounded === true ? ' rounded-borders' : '')
    );

    const trackStyle = computed(() => width(props.buffer !== void 0 ? props.buffer : 1, widthReverse.value, proxy.$q));
    const transitionSuffix = computed(() => `with${ props.instantFeedback === true ? 'out' : '' }-transition`);

    const trackClass = computed(() =>
      'q-linear-progress__track absolute-full'
      + ` q-linear-progress__track--${ transitionSuffix.value }`
      + ` q-linear-progress__track--${ isDark.value === true ? 'dark' : 'light' }`
      + (props.trackColor !== void 0 ? ` bg-${ props.trackColor }` : '')
    );

    const modelStyle = computed(() => width(motion.value === true ? 1 : props.value, widthReverse.value, proxy.$q));
    const modelClass = computed(() =>
      'q-linear-progress__model absolute-full'
      + ` q-linear-progress__model--${ transitionSuffix.value }`
      + ` q-linear-progress__model--${ motion.value === true ? 'in' : '' }determinate`
    );

    const stripeStyle = computed(() => ({ width: `${ props.value * 100 }%` }));
    const stripeClass = computed(() =>
      `q-linear-progress__stripe absolute-${ props.reverse === true ? 'right' : 'left' }`
      + ` q-linear-progress__stripe--${ transitionSuffix.value }`
    );

    return () => {
      const child = [
        h('div', {
          class: trackClass.value,
          style: trackStyle.value
        }),

        h('div', {
          class: modelClass.value,
          style: modelStyle.value
        })
      ];

      props.stripe === true && motion.value === false && child.push(
        h('div', {
          class: stripeClass.value,
          style: stripeStyle.value
        })
      );

      return h('div', {
        class: classes.value,
        style: style.value,
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': 1,
        'aria-valuenow': props.indeterminate === true
          ? void 0
          : props.value
      }, hMergeSlot(slots.default, child))
    }
  }
});

let counter = 0;

const useFullscreenProps = {
  fullscreen: Boolean,
  noRouteFullscreenExit: Boolean
};

const useFullscreenEmits = [ 'update:fullscreen', 'fullscreen' ];

function useFullscreen () {
  const vm = getCurrentInstance();
  const { props, emit, proxy } = vm;

  let historyEntry, fullscreenFillerNode, container;
  const inFullscreen = ref(false);

  vmHasRouter(vm) === true && watch(() => proxy.$route.fullPath, () => {
    props.noRouteFullscreenExit !== true && exitFullscreen();
  });

  watch(() => props.fullscreen, v => {
    if (inFullscreen.value !== v) {
      toggleFullscreen();
    }
  });

  watch(inFullscreen, v => {
    emit('update:fullscreen', v);
    emit('fullscreen', v);
  });

  function toggleFullscreen () {
    if (inFullscreen.value === true) {
      exitFullscreen();
    }
    else {
      setFullscreen();
    }
  }

  function setFullscreen () {
    if (inFullscreen.value === true) return

    inFullscreen.value = true;
    container = proxy.$el.parentNode;
    container.replaceChild(fullscreenFillerNode, proxy.$el);
    document.body.appendChild(proxy.$el);

    counter++;
    if (counter === 1) {
      document.body.classList.add('q-body--fullscreen-mixin');
    }

    historyEntry = {
      handler: exitFullscreen
    };
    History.add(historyEntry);
  }

  function exitFullscreen () {
    if (inFullscreen.value !== true) return

    if (historyEntry !== void 0) {
      History.remove(historyEntry);
      historyEntry = void 0;
    }

    container.replaceChild(proxy.$el, fullscreenFillerNode);
    inFullscreen.value = false;

    counter = Math.max(0, counter - 1);

    if (counter === 0) {
      document.body.classList.remove('q-body--fullscreen-mixin');

      if (proxy.$el.scrollIntoView !== void 0) {
        setTimeout(() => { proxy.$el.scrollIntoView(); });
      }
    }
  }

  onBeforeMount(() => {
    fullscreenFillerNode = document.createElement('span');
  });

  onMounted(() => {
    props.fullscreen === true && setFullscreen();
  });

  onBeforeUnmount(exitFullscreen);

  // expose public methods
  Object.assign(proxy, {
    toggleFullscreen,
    setFullscreen,
    exitFullscreen
  });

  return {
    inFullscreen,
    toggleFullscreen
  }
}

function sortDate (a, b) {
  return (new Date(a)) - (new Date(b))
}

const useTableSortProps = {
  sortMethod: Function,
  binaryStateSort: Boolean,
  columnSortOrder: {
    type: String,
    validator: v => v === 'ad' || v === 'da',
    default: 'ad'
  }
};

function useTableSort (props, computedPagination, colList, setPagination) {
  const columnToSort = computed(() => {
    const { sortBy } = computedPagination.value;

    return sortBy
      ? colList.value.find(def => def.name === sortBy) || null
      : null
  });

  const computedSortMethod = computed(() => (
    props.sortMethod !== void 0
      ? props.sortMethod
      : (data, sortBy, descending) => {
          const col = colList.value.find(def => def.name === sortBy);
          if (col === void 0 || col.field === void 0) {
            return data
          }

          const
            dir = descending === true ? -1 : 1,
            val = typeof col.field === 'function'
              ? v => col.field(v)
              : v => v[ col.field ];

          return data.sort((a, b) => {
            let
              A = val(a),
              B = val(b);

            if (col.rawSort !== void 0) {
              return col.rawSort(A, B, a, b) * dir
            }
            if (A === null || A === void 0) {
              return -1 * dir
            }
            if (B === null || B === void 0) {
              return 1 * dir
            }
            if (col.sort !== void 0) {
              // gets called without rows that have null/undefined as value
              // due to the above two statements
              return col.sort(A, B, a, b) * dir
            }
            if (isNumber(A) === true && isNumber(B) === true) {
              return (A - B) * dir
            }
            if (isDate(A) === true && isDate(B) === true) {
              return sortDate(A, B) * dir
            }
            if (typeof A === 'boolean' && typeof B === 'boolean') {
              return (A - B) * dir
            }

            [ A, B ] = [ A, B ].map(s => (s + '').toLocaleString().toLowerCase());

            return A < B
              ? -1 * dir
              : (A === B ? 0 : dir)
          })
        }
  ));

  function sort (col /* String(col name) or Object(col definition) */) {
    let sortOrder = props.columnSortOrder;

    if (isObject(col) === true) {
      if (col.sortOrder) {
        sortOrder = col.sortOrder;
      }

      col = col.name;
    }
    else {
      const def = colList.value.find(def => def.name === col);
      if (def?.sortOrder) {
        sortOrder = def.sortOrder;
      }
    }

    let { sortBy, descending } = computedPagination.value;

    if (sortBy !== col) {
      sortBy = col;
      descending = sortOrder === 'da';
    }
    else if (props.binaryStateSort === true) {
      descending = !descending;
    }
    else if (descending === true) {
      if (sortOrder === 'ad') {
        sortBy = null;
      }
      else {
        descending = false;
      }
    }
    else { // ascending
      if (sortOrder === 'ad') {
        descending = true;
      }
      else {
        sortBy = null;
      }
    }

    setPagination({ sortBy, descending, page: 1 });
  }

  return {
    columnToSort,
    computedSortMethod,
    sort
  }
}

const useTableFilterProps = {
  filter: [ String, Object ],
  filterMethod: Function
};

function useTableFilter (props, setPagination) {
  const computedFilterMethod = computed(() => (
    props.filterMethod !== void 0
      ? props.filterMethod
      : (rows, terms, cols, cellValue) => {
          const lowerTerms = terms ? terms.toLowerCase() : '';
          return rows.filter(
            row => cols.some(col => {
              const val = cellValue(col, row) + '';
              const haystack = (val === 'undefined' || val === 'null') ? '' : val.toLowerCase();
              return haystack.indexOf(lowerTerms) !== -1
            })
          )
        }
  ));

  watch(
    () => props.filter,
    () => {
      nextTick(() => {
        setPagination({ page: 1 }, true);
      });
    },
    { deep: true }
  );

  return { computedFilterMethod }
}

function samePagination (oldPag, newPag) {
  for (const prop in newPag) {
    if (newPag[ prop ] !== oldPag[ prop ]) {
      return false
    }
  }
  return true
}

function fixPagination (p) {
  if (p.page < 1) {
    p.page = 1;
  }
  if (p.rowsPerPage !== void 0 && p.rowsPerPage < 1) {
    p.rowsPerPage = 0;
  }
  return p
}

const useTablePaginationProps = {
  pagination: Object,
  rowsPerPageOptions: {
    type: Array,
    default: () => [ 5, 7, 10, 15, 20, 25, 50, 0 ]
  },

  'onUpdate:pagination': [ Function, Array ]
};

function useTablePaginationState (vm, getCellValue) {
  const { props, emit } = vm;

  const innerPagination = ref(
    Object.assign({
      sortBy: null,
      descending: false,
      page: 1,
      rowsPerPage: props.rowsPerPageOptions.length !== 0
        ? props.rowsPerPageOptions[ 0 ]
        : 5
    }, props.pagination)
  );

  const computedPagination = computed(() => {
    const pag = props[ 'onUpdate:pagination' ] !== void 0
      ? { ...innerPagination.value, ...props.pagination }
      : innerPagination.value;

    return fixPagination(pag)
  });

  const isServerSide = computed(() => computedPagination.value.rowsNumber !== void 0);

  function sendServerRequest (pagination) {
    requestServerInteraction({
      pagination,
      filter: props.filter
    });
  }

  function requestServerInteraction (prop = {}) {
    nextTick(() => {
      emit('request', {
        pagination: prop.pagination || computedPagination.value,
        filter: prop.filter || props.filter,
        getCellValue
      });
    });
  }

  function setPagination (val, forceServerRequest) {
    const newPagination = fixPagination({
      ...computedPagination.value,
      ...val
    });

    if (samePagination(computedPagination.value, newPagination) === true) {
      if (isServerSide.value === true && forceServerRequest === true) {
        sendServerRequest(newPagination);
      }
      return
    }

    if (isServerSide.value === true) {
      sendServerRequest(newPagination);
      return
    }

    if (
      props.pagination !== void 0
      && props[ 'onUpdate:pagination' ] !== void 0
    ) {
      emit('update:pagination', newPagination);
    }
    else {
      innerPagination.value = newPagination;
    }
  }

  return {
    innerPagination,
    computedPagination,
    isServerSide,

    requestServerInteraction,
    setPagination
  }
}

function useTablePagination (vm, innerPagination, computedPagination, isServerSide, setPagination, filteredSortedRowsNumber) {
  const { props, emit, proxy: { $q } } = vm;

  const computedRowsNumber = computed(() => (
    isServerSide.value === true
      ? computedPagination.value.rowsNumber || 0
      : filteredSortedRowsNumber.value
  ));

  const firstRowIndex = computed(() => {
    const { page, rowsPerPage } = computedPagination.value;
    return (page - 1) * rowsPerPage
  });

  const lastRowIndex = computed(() => {
    const { page, rowsPerPage } = computedPagination.value;
    return page * rowsPerPage
  });

  const isFirstPage = computed(() => computedPagination.value.page === 1);

  const pagesNumber = computed(() => (
    computedPagination.value.rowsPerPage === 0
      ? 1
      : Math.max(
        1,
        Math.ceil(computedRowsNumber.value / computedPagination.value.rowsPerPage)
      )
  ));

  const isLastPage = computed(() => (
    lastRowIndex.value === 0
      ? true
      : computedPagination.value.page >= pagesNumber.value
  ));

  const computedRowsPerPageOptions = computed(() => {
    const opts = props.rowsPerPageOptions.includes(innerPagination.value.rowsPerPage)
      ? props.rowsPerPageOptions
      : [ innerPagination.value.rowsPerPage ].concat(props.rowsPerPageOptions);

    return opts.map(count => ({
      label: count === 0 ? $q.lang.table.allRows : '' + count,
      value: count
    }))
  });

  watch(pagesNumber, (lastPage, oldLastPage) => {
    if (lastPage === oldLastPage) return

    const currentPage = computedPagination.value.page;
    if (lastPage && !currentPage) {
      setPagination({ page: 1 });
    }
    else if (lastPage < currentPage) {
      setPagination({ page: lastPage });
    }
  });

  function firstPage () {
    setPagination({ page: 1 });
  }

  function prevPage () {
    const { page } = computedPagination.value;
    if (page > 1) {
      setPagination({ page: page - 1 });
    }
  }

  function nextPage () {
    const { page, rowsPerPage } = computedPagination.value;
    if (lastRowIndex.value > 0 && page * rowsPerPage < computedRowsNumber.value) {
      setPagination({ page: page + 1 });
    }
  }

  function lastPage () {
    setPagination({ page: pagesNumber.value });
  }

  if (props[ 'onUpdate:pagination' ] !== void 0) {
    emit('update:pagination', { ...computedPagination.value });
  }

  return {
    firstRowIndex,
    lastRowIndex,
    isFirstPage,
    isLastPage,
    pagesNumber,
    computedRowsPerPageOptions,
    computedRowsNumber,

    firstPage,
    prevPage,
    nextPage,
    lastPage
  }
}

const useTableRowSelectionProps = {
  selection: {
    type: String,
    default: 'none',
    validator: v => [ 'single', 'multiple', 'none' ].includes(v)
  },
  selected: {
    type: Array,
    default: () => []
  }
};

const useTableRowSelectionEmits = [ 'update:selected', 'selection' ];

function useTableRowSelection (props, emit, computedRows, getRowKey) {
  const selectedKeys = computed(() => {
    const keys = {};
    props.selected.map(getRowKey.value).forEach(key => {
      keys[ key ] = true;
    });
    return keys
  });

  const hasSelectionMode = computed(() => {
    return props.selection !== 'none'
  });

  const singleSelection = computed(() => {
    return props.selection === 'single'
  });

  const multipleSelection = computed(() => {
    return props.selection === 'multiple'
  });

  const allRowsSelected = computed(() =>
    computedRows.value.length !== 0 && computedRows.value.every(
      row => selectedKeys.value[ getRowKey.value(row) ] === true
    )
  );

  const someRowsSelected = computed(() =>
    allRowsSelected.value !== true
    && computedRows.value.some(row => selectedKeys.value[ getRowKey.value(row) ] === true)
  );

  const rowsSelectedNumber = computed(() => props.selected.length);

  function isRowSelected (key) {
    return selectedKeys.value[ key ] === true
  }

  function clearSelection () {
    emit('update:selected', []);
  }

  function updateSelection (keys, rows, added, evt) {
    emit('selection', { rows, added, keys, evt });

    const payload = singleSelection.value === true
      ? (added === true ? rows : [])
      : (
          added === true
            ? props.selected.concat(rows)
            : props.selected.filter(
              row => keys.includes(getRowKey.value(row)) === false
            )
        );

    emit('update:selected', payload);
  }

  return {
    hasSelectionMode,
    singleSelection,
    multipleSelection,
    allRowsSelected,
    someRowsSelected,
    rowsSelectedNumber,

    isRowSelected,
    clearSelection,
    updateSelection
  }
}

function getVal (val) {
  return Array.isArray(val)
    ? val.slice()
    : []
}

const useTableRowExpandProps = {
  expanded: Array // v-model:expanded
};

const useTableRowExpandEmits = [ 'update:expanded' ];

function useTableRowExpand (props, emit) {
  const innerExpanded = ref(getVal(props.expanded));

  watch(() => props.expanded, val => {
    innerExpanded.value = getVal(val);
  });

  function isRowExpanded (key) {
    return innerExpanded.value.includes(key)
  }

  function setExpanded (val) {
    if (props.expanded !== void 0) {
      emit('update:expanded', val);
    }
    else {
      innerExpanded.value = val;
    }
  }

  function updateExpanded (key, add) {
    const target = innerExpanded.value.slice();
    const index = target.indexOf(key);

    if (add === true) {
      if (index === -1) {
        target.push(key);
        setExpanded(target);
      }
    }
    else if (index !== -1) {
      target.splice(index, 1);
      setExpanded(target);
    }
  }

  return {
    isRowExpanded,
    setExpanded,
    updateExpanded
  }
}

const useTableColumnSelectionProps = {
  visibleColumns: Array
};

function useTableColumnSelection (props, computedPagination, hasSelectionMode) {
  const colList = computed(() => {
    if (props.columns !== void 0) {
      return props.columns
    }

    // we infer columns from first row
    const row = props.rows[ 0 ];

    return row !== void 0
      ? Object.keys(row).map(name => ({
        name,
        label: name.toUpperCase(),
        field: name,
        align: isNumber(row[ name ]) ? 'right' : 'left',
        sortable: true
      }))
      : []
  });

  const computedCols = computed(() => {
    const { sortBy, descending } = computedPagination.value;

    const cols = props.visibleColumns !== void 0
      ? colList.value.filter(col => col.required === true || props.visibleColumns.includes(col.name) === true)
      : colList.value;

    return cols.map(col => {
      const align = col.align || 'right';
      const alignClass = `text-${ align }`;

      return {
        ...col,
        align,
        __iconClass: `q-table__sort-icon q-table__sort-icon--${ align }`,
        __thClass: alignClass
          + (col.headerClasses !== void 0 ? ' ' + col.headerClasses : '')
          + (col.sortable === true ? ' sortable' : '')
          + (col.name === sortBy ? ` sorted ${ descending === true ? 'sort-desc' : '' }` : ''),

        __tdStyle: col.style !== void 0
          ? (
              typeof col.style !== 'function'
                ? () => col.style
                : col.style
            )
          : () => null,

        __tdClass: col.classes !== void 0
          ? (
              typeof col.classes !== 'function'
                ? () => alignClass + ' ' + col.classes
                : row => alignClass + ' ' + col.classes(row)
            )
          : () => alignClass
      }
    })
  });

  const computedColsMap = computed(() => {
    const names = {};
    computedCols.value.forEach(col => {
      names[ col.name ] = col;
    });
    return names
  });

  const computedColspan = computed(() => {
    return props.tableColspan !== void 0
      ? props.tableColspan
      : computedCols.value.length + (hasSelectionMode.value === true ? 1 : 0)
  });

  return {
    colList,
    computedCols,
    computedColsMap,
    computedColspan
  }
}

const bottomClass = 'q-table__bottom row items-center';

const virtScrollPassthroughProps = {};
commonVirtScrollPropsList.forEach(p => { virtScrollPassthroughProps[ p ] = {}; });

const __nuxt_component_9 = createComponent({
  name: 'QTable',

  props: {
    rows: {
      type: Array,
      required: true
    },
    rowKey: {
      type: [ String, Function ],
      default: 'id'
    },

    columns: Array,
    loading: Boolean,

    iconFirstPage: String,
    iconPrevPage: String,
    iconNextPage: String,
    iconLastPage: String,

    title: String,

    hideHeader: Boolean,

    grid: Boolean,
    gridHeader: Boolean,

    dense: Boolean,
    flat: Boolean,
    bordered: Boolean,
    square: Boolean,
    separator: {
      type: String,
      default: 'horizontal',
      validator: v => [ 'horizontal', 'vertical', 'cell', 'none' ].includes(v)
    },
    wrapCells: Boolean,

    virtualScroll: Boolean,
    virtualScrollTarget: {},
    ...virtScrollPassthroughProps,

    noDataLabel: String,
    noResultsLabel: String,
    loadingLabel: String,
    selectedRowsLabel: Function,
    rowsPerPageLabel: String,
    paginationLabel: Function,

    color: {
      type: String,
      default: 'grey-8'
    },

    titleClass: [ String, Array, Object ],
    tableStyle: [ String, Array, Object ],
    tableClass: [ String, Array, Object ],
    tableHeaderStyle: [ String, Array, Object ],
    tableHeaderClass: [ String, Array, Object ],
    tableRowStyleFn: Function,
    tableRowClassFn: Function,
    cardContainerClass: [ String, Array, Object ],
    cardContainerStyle: [ String, Array, Object ],
    cardStyle: [ String, Array, Object ],
    cardClass: [ String, Array, Object ],
    cardStyleFn: Function,
    cardClassFn: Function,

    hideBottom: Boolean,
    hideSelectedBanner: Boolean,
    hideNoData: Boolean,
    hidePagination: Boolean,

    onRowClick: Function,
    onRowDblclick: Function,
    onRowContextmenu: Function,

    ...useDarkProps,
    ...useFullscreenProps,

    ...useTableColumnSelectionProps,
    ...useTableFilterProps,
    ...useTablePaginationProps,
    ...useTableRowExpandProps,
    ...useTableRowSelectionProps,
    ...useTableSortProps
  },

  emits: [
    'request', 'virtualScroll',
    ...useFullscreenEmits,
    ...useTableRowExpandEmits,
    ...useTableRowSelectionEmits
  ],

  setup (props, { slots, emit }) {
    const vm = getCurrentInstance();
    const { proxy: { $q } } = vm;

    const isDark = useDark(props, $q);
    const { inFullscreen, toggleFullscreen } = useFullscreen();

    const getRowKey = computed(() => (
      typeof props.rowKey === 'function'
        ? props.rowKey
        : row => row[ props.rowKey ]
    ));

    const rootRef = ref(null);
    const virtScrollRef = ref(null);
    const hasVirtScroll = computed(() => props.grid !== true && props.virtualScroll === true);

    const cardDefaultClass = computed(() =>
      ' q-table__card'
      + (isDark.value === true ? ' q-table__card--dark q-dark' : '')
      + (props.square === true ? ' q-table--square' : '')
      + (props.flat === true ? ' q-table--flat' : '')
      + (props.bordered === true ? ' q-table--bordered' : '')
    );

    const containerClass = computed(() =>
      `q-table__container q-table--${ props.separator }-separator column no-wrap`
      + (props.grid === true ? ' q-table--grid' : cardDefaultClass.value)
      + (isDark.value === true ? ' q-table--dark' : '')
      + (props.dense === true ? ' q-table--dense' : '')
      + (props.wrapCells === false ? ' q-table--no-wrap' : '')
      + (inFullscreen.value === true ? ' fullscreen scroll' : '')
    );

    const rootContainerClass = computed(() =>
      containerClass.value + (props.loading === true ? ' q-table--loading' : '')
    );

    watch(
      () => props.tableStyle + props.tableClass + props.tableHeaderStyle + props.tableHeaderClass + containerClass.value,
      () => { hasVirtScroll.value === true && virtScrollRef.value?.reset(); }
    );

    const {
      innerPagination,
      computedPagination,
      isServerSide,

      requestServerInteraction,
      setPagination
    } = useTablePaginationState(vm, getCellValue);

    const { computedFilterMethod } = useTableFilter(props, setPagination);
    const { isRowExpanded, setExpanded, updateExpanded } = useTableRowExpand(props, emit);

    const filteredSortedRows = computed(() => {
      let rows = props.rows;

      if (isServerSide.value === true || rows.length === 0) {
        return rows
      }

      const { sortBy, descending } = computedPagination.value;

      if (props.filter) {
        rows = computedFilterMethod.value(rows, props.filter, computedCols.value, getCellValue);
      }

      if (columnToSort.value !== null) {
        rows = computedSortMethod.value(
          props.rows === rows ? rows.slice() : rows,
          sortBy,
          descending
        );
      }

      return rows
    });

    const filteredSortedRowsNumber = computed(() => filteredSortedRows.value.length);

    const computedRows = computed(() => {
      let rows = filteredSortedRows.value;

      if (isServerSide.value === true) {
        return rows
      }

      const { rowsPerPage } = computedPagination.value;

      if (rowsPerPage !== 0) {
        if (firstRowIndex.value === 0 && props.rows !== rows) {
          if (rows.length > lastRowIndex.value) {
            rows = rows.slice(0, lastRowIndex.value);
          }
        }
        else {
          rows = rows.slice(firstRowIndex.value, lastRowIndex.value);
        }
      }

      return rows
    });

    const {
      hasSelectionMode,
      singleSelection,
      multipleSelection,
      allRowsSelected,
      someRowsSelected,
      rowsSelectedNumber,

      isRowSelected,
      clearSelection,
      updateSelection
    } = useTableRowSelection(props, emit, computedRows, getRowKey);

    const { colList, computedCols, computedColsMap, computedColspan } = useTableColumnSelection(props, computedPagination, hasSelectionMode);

    const { columnToSort, computedSortMethod, sort } = useTableSort(props, computedPagination, colList, setPagination);

    const {
      firstRowIndex,
      lastRowIndex,
      isFirstPage,
      isLastPage,
      pagesNumber,
      computedRowsPerPageOptions,
      computedRowsNumber,

      firstPage,
      prevPage,
      nextPage,
      lastPage
    } = useTablePagination(vm, innerPagination, computedPagination, isServerSide, setPagination, filteredSortedRowsNumber);

    const nothingToDisplay = computed(() => computedRows.value.length === 0);

    const virtProps = computed(() => {
      const acc = {};

      commonVirtScrollPropsList
        .forEach(p => { acc[ p ] = props[ p ]; });

      if (acc.virtualScrollItemSize === void 0) {
        acc.virtualScrollItemSize = props.dense === true ? 28 : 48;
      }

      return acc
    });

    function resetVirtualScroll () {
      hasVirtScroll.value === true && virtScrollRef.value.reset();
    }

    function getBody () {
      if (props.grid === true) {
        return getGridBody()
      }

      const header = props.hideHeader !== true ? getTHead : null;

      if (hasVirtScroll.value === true) {
        const topRow = slots[ 'top-row' ];
        const bottomRow = slots[ 'bottom-row' ];

        const virtSlots = {
          default: props => getTBodyTR(props.item, slots.body, props.index)
        };

        if (topRow !== void 0) {
          const topContent = h('tbody', topRow({ cols: computedCols.value }));

          virtSlots.before = header === null
            ? () => topContent
            : () => [ header() ].concat(topContent);
        }
        else if (header !== null) {
          virtSlots.before = header;
        }

        if (bottomRow !== void 0) {
          virtSlots.after = () => h('tbody', bottomRow({ cols: computedCols.value }));
        }

        return h(QVirtualScroll, {
          ref: virtScrollRef,
          class: props.tableClass,
          style: props.tableStyle,
          ...virtProps.value,
          scrollTarget: props.virtualScrollTarget,
          items: computedRows.value,
          type: '__qtable',
          tableColspan: computedColspan.value,
          onVirtualScroll: onVScroll
        }, virtSlots)
      }

      const child = [
        getTBody()
      ];

      if (header !== null) {
        child.unshift(header());
      }

      return getTableMiddle({
        class: [ 'q-table__middle scroll', props.tableClass ],
        style: props.tableStyle
      }, child)
    }

    function scrollTo (toIndex, edge) {
      if (virtScrollRef.value !== null) {
        virtScrollRef.value.scrollTo(toIndex, edge);
        return
      }

      toIndex = parseInt(toIndex, 10);
      const rowEl = rootRef.value.querySelector(`tbody tr:nth-of-type(${ toIndex + 1 })`);

      if (rowEl !== null) {
        const scrollTarget = rootRef.value.querySelector('.q-table__middle.scroll');
        const offsetTop = rowEl.offsetTop - props.virtualScrollStickySizeStart;
        const direction = offsetTop < scrollTarget.scrollTop ? 'decrease' : 'increase';

        scrollTarget.scrollTop = offsetTop;

        emit('virtualScroll', {
          index: toIndex,
          from: 0,
          to: innerPagination.value.rowsPerPage - 1,
          direction
        });
      }
    }

    function onVScroll (info) {
      emit('virtualScroll', info);
    }

    function getProgress () {
      return [
        h(QLinearProgress, {
          class: 'q-table__linear-progress',
          color: props.color,
          dark: isDark.value,
          indeterminate: true,
          trackColor: 'transparent'
        })
      ]
    }

    function getTBodyTR (row, bodySlot, pageIndex) {
      const
        key = getRowKey.value(row),
        selected = isRowSelected(key);

      if (bodySlot !== void 0) {
        const cfg = {
          key,
          row,
          pageIndex,
          __trClass: selected ? 'selected' : ''
        };

        if (props.tableRowStyleFn !== void 0) {
          cfg.__trStyle = props.tableRowStyleFn(row);
        }

        if (props.tableRowClassFn !== void 0) {
          const cls = props.tableRowClassFn(row);
          if (cls) {
            cfg.__trClass = `${ cls } ${ cfg.__trClass }`;
          }
        }

        return bodySlot(
          getBodyScope(cfg)
        )
      }

      const
        bodyCell = slots[ 'body-cell' ],
        child = computedCols.value.map(col => {
          const
            bodyCellCol = slots[ `body-cell-${ col.name }` ],
            slot = bodyCellCol !== void 0 ? bodyCellCol : bodyCell;

          return slot !== void 0
            ? slot(getBodyCellScope({ key, row, pageIndex, col }))
            : h('td', {
              class: col.__tdClass(row),
              style: col.__tdStyle(row)
            }, getCellValue(col, row))
        });

      if (hasSelectionMode.value === true) {
        const slot = slots[ 'body-selection' ];
        const content = slot !== void 0
          ? slot(getBodySelectionScope({ key, row, pageIndex }))
          : [
              h(QCheckbox, {
                modelValue: selected,
                color: props.color,
                dark: isDark.value,
                dense: props.dense,
                'onUpdate:modelValue': (adding, evt) => {
                  updateSelection([ key ], [ row ], adding, evt);
                }
              })
            ];

        child.unshift(
          h('td', { class: 'q-table--col-auto-width' }, content)
        );
      }

      const data = { key, class: { selected } };

      if (props.onRowClick !== void 0) {
        data.class[ 'cursor-pointer' ] = true;
        data.onClick = evt => {
          emit('rowClick', evt, row, pageIndex);
        };
      }

      if (props.onRowDblclick !== void 0) {
        data.class[ 'cursor-pointer' ] = true;
        data.onDblclick = evt => {
          emit('rowDblclick', evt, row, pageIndex);
        };
      }

      if (props.onRowContextmenu !== void 0) {
        data.class[ 'cursor-pointer' ] = true;
        data.onContextmenu = evt => {
          emit('rowContextmenu', evt, row, pageIndex);
        };
      }

      if (props.tableRowStyleFn !== void 0) {
        data.style = props.tableRowStyleFn(row);
      }

      if (props.tableRowClassFn !== void 0) {
        const cls = props.tableRowClassFn(row);
        if (cls) {
          data.class[ cls ] = true;
        }
      }

      return h('tr', data, child)
    }

    function getTBody () {
      const
        body = slots.body,
        topRow = slots[ 'top-row' ],
        bottomRow = slots[ 'bottom-row' ];

      let child = computedRows.value.map(
        (row, pageIndex) => getTBodyTR(row, body, pageIndex)
      );

      if (topRow !== void 0) {
        child = topRow({ cols: computedCols.value }).concat(child);
      }
      if (bottomRow !== void 0) {
        child = child.concat(bottomRow({ cols: computedCols.value }));
      }

      return h('tbody', child)
    }

    function getBodyScope (data) {
      injectBodyCommonScope(data);

      data.cols = data.cols.map(
        col => injectProp({ ...col }, 'value', () => getCellValue(col, data.row))
      );

      return data
    }

    function getBodyCellScope (data) {
      injectBodyCommonScope(data);
      injectProp(data, 'value', () => getCellValue(data.col, data.row));
      return data
    }

    function getBodySelectionScope (data) {
      injectBodyCommonScope(data);
      return data
    }

    function injectBodyCommonScope (data) {
      Object.assign(data, {
        cols: computedCols.value,
        colsMap: computedColsMap.value,
        sort,
        rowIndex: firstRowIndex.value + data.pageIndex,
        color: props.color,
        dark: isDark.value,
        dense: props.dense
      });

      hasSelectionMode.value === true && injectProp(
        data,
        'selected',
        () => isRowSelected(data.key),
        (adding, evt) => {
          updateSelection([ data.key ], [ data.row ], adding, evt);
        }
      );

      injectProp(
        data,
        'expand',
        () => isRowExpanded(data.key),
        adding => { updateExpanded(data.key, adding); }
      );
    }

    function getCellValue (col, row) {
      const val = typeof col.field === 'function' ? col.field(row) : row[ col.field ];
      return col.format !== void 0 ? col.format(val, row) : val
    }

    const marginalsScope = computed(() => ({
      pagination: computedPagination.value,
      pagesNumber: pagesNumber.value,
      isFirstPage: isFirstPage.value,
      isLastPage: isLastPage.value,
      firstPage,
      prevPage,
      nextPage,
      lastPage,

      inFullscreen: inFullscreen.value,
      toggleFullscreen
    }));

    function getTopDiv () {
      const
        top = slots.top,
        topLeft = slots[ 'top-left' ],
        topRight = slots[ 'top-right' ],
        topSelection = slots[ 'top-selection' ],
        hasSelection = hasSelectionMode.value === true
          && topSelection !== void 0
          && rowsSelectedNumber.value > 0,
        topClass = 'q-table__top relative-position row items-center';

      if (top !== void 0) {
        return h('div', { class: topClass }, [ top(marginalsScope.value) ])
      }

      let child;

      if (hasSelection === true) {
        child = topSelection(marginalsScope.value).slice();
      }
      else {
        child = [];

        if (topLeft !== void 0) {
          child.push(
            h('div', { class: 'q-table__control' }, [
              topLeft(marginalsScope.value)
            ])
          );
        }
        else if (props.title) {
          child.push(
            h('div', { class: 'q-table__control' }, [
              h('div', {
                class: [ 'q-table__title', props.titleClass ]
              }, props.title)
            ])
          );
        }
      }

      if (topRight !== void 0) {
        child.push(
          h('div', { class: 'q-table__separator col' })
        );
        child.push(
          h('div', { class: 'q-table__control' }, [
            topRight(marginalsScope.value)
          ])
        );
      }

      if (child.length === 0) return
      return h('div', { class: topClass }, child)
    }

    const headerSelectedValue = computed(() => (
      someRowsSelected.value === true
        ? null
        : allRowsSelected.value
    ));

    function getTHead () {
      const child = getTHeadTR();

      if (props.loading === true && slots.loading === void 0) {
        child.push(
          h('tr', { class: 'q-table__progress' }, [
            h('th', {
              class: 'relative-position',
              colspan: computedColspan.value
            }, getProgress())
          ])
        );
      }

      return h('thead', child)
    }

    function getTHeadTR () {
      const
        header = slots.header,
        headerCell = slots[ 'header-cell' ];

      if (header !== void 0) {
        return header(
          getHeaderScope({ header: true })
        ).slice()
      }

      const child = computedCols.value.map(col => {
        const
          headerCellCol = slots[ `header-cell-${ col.name }` ],
          slot = headerCellCol !== void 0 ? headerCellCol : headerCell,
          props = getHeaderScope({ col });

        return slot !== void 0
          ? slot(props)
          : h(__nuxt_component_12, {
            key: col.name,
            props
          }, () => col.label)
      });

      if (singleSelection.value === true && props.grid !== true) {
        child.unshift(
          h('th', { class: 'q-table--col-auto-width' }, ' ')
        );
      }
      else if (multipleSelection.value === true) {
        const slot = slots[ 'header-selection' ];
        const content = slot !== void 0
          ? slot(getHeaderScope({}))
          : [
              h(QCheckbox, {
                color: props.color,
                modelValue: headerSelectedValue.value,
                dark: isDark.value,
                dense: props.dense,
                'onUpdate:modelValue': onMultipleSelectionSet
              })
            ];

        child.unshift(
          h('th', { class: 'q-table--col-auto-width' }, content)
        );
      }

      return [
        h('tr', {
          class: props.tableHeaderClass,
          style: props.tableHeaderStyle
        }, child)
      ]
    }

    function getHeaderScope (data) {
      Object.assign(data, {
        cols: computedCols.value,
        sort,
        colsMap: computedColsMap.value,
        color: props.color,
        dark: isDark.value,
        dense: props.dense
      });

      if (multipleSelection.value === true) {
        injectProp(
          data,
          'selected',
          () => headerSelectedValue.value,
          onMultipleSelectionSet
        );
      }

      return data
    }

    function onMultipleSelectionSet (val) {
      if (someRowsSelected.value === true) {
        val = false;
      }

      updateSelection(
        computedRows.value.map(getRowKey.value),
        computedRows.value,
        val
      );
    }

    const navIcon = computed(() => {
      const ico = [
        props.iconFirstPage || $q.iconSet.table.firstPage,
        props.iconPrevPage || $q.iconSet.table.prevPage,
        props.iconNextPage || $q.iconSet.table.nextPage,
        props.iconLastPage || $q.iconSet.table.lastPage
      ];
      return $q.lang.rtl === true ? ico.reverse() : ico
    });

    function getBottomDiv () {
      if (props.hideBottom === true) return

      if (nothingToDisplay.value === true) {
        if (props.hideNoData === true) return

        const message = props.loading === true
          ? props.loadingLabel || $q.lang.table.loading
          : (props.filter ? props.noResultsLabel || $q.lang.table.noResults : props.noDataLabel || $q.lang.table.noData);

        const noData = slots[ 'no-data' ];
        const children = noData !== void 0
          ? [ noData({ message, icon: $q.iconSet.table.warning, filter: props.filter }) ]
          : [
              h(__nuxt_component_4$1, {
                class: 'q-table__bottom-nodata-icon',
                name: $q.iconSet.table.warning
              }),
              message
            ];

        return h('div', { class: bottomClass + ' q-table__bottom--nodata' }, children)
      }

      const bottom = slots.bottom;

      if (bottom !== void 0) {
        return h('div', { class: bottomClass }, [ bottom(marginalsScope.value) ])
      }

      const child = props.hideSelectedBanner !== true && hasSelectionMode.value === true && rowsSelectedNumber.value > 0
        ? [
            h('div', { class: 'q-table__control' }, [
              h('div', [
                (props.selectedRowsLabel || $q.lang.table.selectedRecords)(rowsSelectedNumber.value)
              ])
            ])
          ]
        : [];

      if (props.hidePagination !== true) {
        return h('div', {
          class: bottomClass + ' justify-end'
        }, getPaginationDiv(child))
      }

      if (child.length !== 0) {
        return h('div', { class: bottomClass }, child)
      }
    }

    function onPagSelection (pag) {
      setPagination({
        page: 1,
        rowsPerPage: pag.value
      });
    }

    function getPaginationDiv (child) {
      let control;
      const
        { rowsPerPage } = computedPagination.value,
        paginationLabel = props.paginationLabel || $q.lang.table.pagination,
        paginationSlot = slots.pagination,
        hasOpts = props.rowsPerPageOptions.length > 1;

      child.push(
        h('div', { class: 'q-table__separator col' })
      );

      hasOpts === true && child.push(
        h('div', { class: 'q-table__control' }, [
          h('span', { class: 'q-table__bottom-item' }, [
            props.rowsPerPageLabel || $q.lang.table.recordsPerPage
          ]),
          h(__nuxt_component_5, {
            class: 'q-table__select inline q-table__bottom-item',
            color: props.color,
            modelValue: rowsPerPage,
            options: computedRowsPerPageOptions.value,
            displayValue: rowsPerPage === 0
              ? $q.lang.table.allRows
              : rowsPerPage,
            dark: isDark.value,
            borderless: true,
            dense: true,
            optionsDense: true,
            optionsCover: true,
            'onUpdate:modelValue': onPagSelection
          })
        ])
      );

      if (paginationSlot !== void 0) {
        control = paginationSlot(marginalsScope.value);
      }
      else {
        control = [
          h('span', rowsPerPage !== 0 ? { class: 'q-table__bottom-item' } : {}, [
            rowsPerPage
              ? paginationLabel(firstRowIndex.value + 1, Math.min(lastRowIndex.value, computedRowsNumber.value), computedRowsNumber.value)
              : paginationLabel(1, filteredSortedRowsNumber.value, computedRowsNumber.value)
          ])
        ];

        if (rowsPerPage !== 0 && pagesNumber.value > 1) {
          const btnProps = {
            color: props.color,
            round: true,
            dense: true,
            flat: true
          };

          if (props.dense === true) {
            btnProps.size = 'sm';
          }

          pagesNumber.value > 2 && control.push(
            h(__nuxt_component_8, {
              key: 'pgFirst',
              ...btnProps,
              icon: navIcon.value[ 0 ],
              disable: isFirstPage.value,
              ariaLabel: $q.lang.pagination.first,
              onClick: firstPage
            })
          );

          control.push(
            h(__nuxt_component_8, {
              key: 'pgPrev',
              ...btnProps,
              icon: navIcon.value[ 1 ],
              disable: isFirstPage.value,
              ariaLabel: $q.lang.pagination.prev,
              onClick: prevPage
            }),

            h(__nuxt_component_8, {
              key: 'pgNext',
              ...btnProps,
              icon: navIcon.value[ 2 ],
              disable: isLastPage.value,
              ariaLabel: $q.lang.pagination.next,
              onClick: nextPage
            })
          );

          pagesNumber.value > 2 && control.push(
            h(__nuxt_component_8, {
              key: 'pgLast',
              ...btnProps,
              icon: navIcon.value[ 3 ],
              disable: isLastPage.value,
              ariaLabel: $q.lang.pagination.last,
              onClick: lastPage
            })
          );
        }
      }

      child.push(
        h('div', { class: 'q-table__control' }, control)
      );

      return child
    }

    function getGridHeader () {
      const child = props.gridHeader === true
        ? [
            h('table', { class: 'q-table' }, [
              getTHead()
            ])
          ]
        : (
            props.loading === true && slots.loading === void 0
              ? getProgress()
              : void 0
          );

      return h('div', { class: 'q-table__middle' }, child)
    }

    function getGridBody () {
      const item = slots.item !== void 0
        ? slots.item
        : scope => {
          const child = scope.cols.map(
            col => h('div', { class: 'q-table__grid-item-row' }, [
              h('div', { class: 'q-table__grid-item-title' }, [ col.label ]),
              h('div', { class: 'q-table__grid-item-value' }, [ col.value ])
            ])
          );

          if (hasSelectionMode.value === true) {
            const slot = slots[ 'body-selection' ];
            const content = slot !== void 0
              ? slot(scope)
              : [
                  h(QCheckbox, {
                    modelValue: scope.selected,
                    color: props.color,
                    dark: isDark.value,
                    dense: props.dense,
                    'onUpdate:modelValue': (adding, evt) => {
                      updateSelection([ scope.key ], [ scope.row ], adding, evt);
                    }
                  })
                ];

            child.unshift(
              h('div', { class: 'q-table__grid-item-row' }, content),
              h(__nuxt_component_3, { dark: isDark.value })
            );
          }

          const data = {
            class: [
              'q-table__grid-item-card' + cardDefaultClass.value,
              props.cardClass
            ],
            style: props.cardStyle
          };

          if (props.cardStyleFn !== void 0) {
            data.style = [ data.style, props.cardStyleFn(scope.row) ];
          }

          if (props.cardClassFn !== void 0) {
            const cls = props.cardClassFn(scope.row);
            if (cls) {
              data.class[ 0 ] += ` ${ cls }`;
            }
          }

          if (
            props.onRowClick !== void 0
            || props.onRowDblclick !== void 0
            || props.onRowContextmenu !== void 0
          ) {
            data.class[ 0 ] += ' cursor-pointer';

            if (props.onRowClick !== void 0) {
              data.onClick = evt => {
                emit('RowClick', evt, scope.row, scope.pageIndex);
              };
            }

            if (props.onRowDblclick !== void 0) {
              data.onDblclick = evt => {
                emit('RowDblclick', evt, scope.row, scope.pageIndex);
              };
            }

            if (props.onRowContextmenu !== void 0) {
              data.onContextmenu = evt => {
                emit('rowContextmenu', evt, scope.row, scope.pageIndex);
              };
            }
          }

          return h('div', {
            class: 'q-table__grid-item col-xs-12 col-sm-6 col-md-4 col-lg-3'
              + (scope.selected === true ? ' q-table__grid-item--selected' : '')
          }, [
            h('div', data, child)
          ])
        };

      return h('div', {
        class: [
          'q-table__grid-content row',
          props.cardContainerClass
        ],
        style: props.cardContainerStyle
      }, computedRows.value.map((row, pageIndex) => {
        return item(getBodyScope({
          key: getRowKey.value(row),
          row,
          pageIndex
        }))
      }))
    }

    // expose public methods and needed computed props
    Object.assign(vm.proxy, {
      requestServerInteraction,
      setPagination,
      firstPage,
      prevPage,
      nextPage,
      lastPage,
      isRowSelected,
      clearSelection,
      isRowExpanded,
      setExpanded,
      sort,
      resetVirtualScroll,
      scrollTo,
      getCellValue
    });

    injectMultipleProps(vm.proxy, {
      filteredSortedRows: () => filteredSortedRows.value,
      computedRows: () => computedRows.value,
      computedRowsNumber: () => computedRowsNumber.value
    });

    return () => {
      const child = [ getTopDiv() ];
      const data = { ref: rootRef, class: rootContainerClass.value };

      if (props.grid === true) {
        child.push(getGridHeader());
      }
      else {
        Object.assign(data, {
          class: [ data.class, props.cardClass ],
          style: props.cardStyle
        });
      }

      child.push(
        getBody(),
        getBottomDiv()
      );

      if (props.loading === true && slots.loading !== void 0) {
        child.push(
          slots.loading()
        );
      }

      return h('div', data, child)
    }
  }
});

const __nuxt_component_13 = createComponent({
  name: 'QTd',

  props: {
    props: Object,
    autoWidth: Boolean,
    noHover: Boolean
  },

  setup (props, { slots }) {
    const vm = getCurrentInstance();
    const classes = computed(() =>
      'q-td' + (props.autoWidth === true ? ' q-table--col-auto-width' : '')
      + (props.noHover === true ? ' q-td--no-hover' : '')
      + ' '
    );

    return () => {
      if (props.props === void 0) {
        return h('td', { class: classes.value }, hSlot(slots.default))
      }

      const name = vm.vnode.key;
      const col = (
        (props.props.colsMap !== void 0 ? props.props.colsMap[ name ] : null)
        || props.props.col
      );

      if (col === void 0) return

      const { row } = props.props;

      return h('td', {
        class: classes.value + col.__tdClass(row),
        style: col.__tdStyle(row)
      }, hSlot(slots.default))
    }
  }
});

const __nuxt_component_11 = createComponent({
  name: 'QTr',

  props: {
    props: Object,
    noHover: Boolean
  },

  setup (props, { slots }) {
    const classes = computed(() =>
      'q-tr'
      + (props.props === void 0 || props.props.header === true ? '' : ' ' + props.props.__trClass)
      + (props.noHover === true ? ' q-tr--no-hover' : '')
    );

    return () => h('tr', {
      style: props.props?.__trStyle,
      class: classes.value
    }, hSlot(slots.default))
  }
});

const __nuxt_component_10 = createComponent({
  name: 'QInnerLoading',

  props: {
    ...useDarkProps,
    ...useTransitionProps,

    showing: Boolean,
    color: String,

    size: {
      type: [ String, Number ],
      default: '42px'
    },

    label: String,
    labelClass: String,
    labelStyle: [ String, Array, Object ]
  },

  setup (props, { slots }) {
    const vm = getCurrentInstance();
    const isDark = useDark(props, vm.proxy.$q);

    const { transitionProps, transitionStyle } = useTransition(props);

    const classes = computed(() =>
      'q-inner-loading q--avoid-card-border absolute-full column flex-center'
      + (isDark.value === true ? ' q-inner-loading--dark' : '')
    );

    const labelClass = computed(() =>
      'q-inner-loading__label'
      + (props.labelClass !== void 0 ? ` ${ props.labelClass }` : '')
    );

    function getInner () {
      const child = [
        h(QSpinner, {
          size: props.size,
          color: props.color
        })
      ];

      if (props.label !== void 0) {
        child.push(
          h('div', {
            class: labelClass.value,
            style: props.labelStyle
          }, [ props.label ])
        );
      }

      return child
    }

    function getContent () {
      return props.showing === true
        ? h(
          'div',
          { class: classes.value, style: transitionStyle.value },
          slots.default !== void 0
            ? slots.default()
            : getInner()
        )
        : null
    }

    return () => h(Transition, transitionProps.value, getContent)
  }
});

export { __nuxt_component_1 as _, __nuxt_component_4 as a, __nuxt_component_5 as b, __nuxt_component_9 as c, __nuxt_component_13 as d, __nuxt_component_11 as e, __nuxt_component_12 as f, __nuxt_component_10 as g, useFieldProps as h, fieldValueIsFilled as i, useFieldState as j, useKeyComposition as k, useField as l, injectProp as m, useFieldEmits as u };
//# sourceMappingURL=QInnerLoading.mjs.map

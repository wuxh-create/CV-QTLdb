import { getCurrentInstance, watch, onMounted, computed, ref, h, nextTick, onBeforeUnmount } from 'vue';
import { u as useDarkProps, a as useDark } from './use-dark.mjs';
import { b as vmHasRouter, c as getParentProxy, i as isKeyCode, u as useRouterLinkProps, d as useRouterLink } from './QBtn.mjs';
import { B as noop, g as createComponent, q as client, s as stopAndPrevent, P as Platform, m as prevent, C as addEvt, D as cleanEvt, k as listenOpts, E as position } from '../build/server.mjs';
import { d as hUniqueSlot, h as hSlot } from './render.mjs';
import { a as useTick, u as useTimeout } from './uid.mjs';
import { d as getScrollbarWidth, s as scrollTargetProp, b as getScrollTarget, c as childHasFocus } from './scroll.mjs';

const useModelToggleProps = {
  modelValue: {
    type: Boolean,
    default: null
  },

  'onUpdate:modelValue': [ Function, Array ]
};

const useModelToggleEmits = [
  'beforeShow', 'show', 'beforeHide', 'hide'
];

// handleShow/handleHide -> removeTick(), self (& emit show)

function useModelToggle ({
  showing,
  canShow, // optional
  hideOnRouteChange, // optional
  handleShow, // optional
  handleHide, // optional
  processOnMount // optional
}) {
  const vm = getCurrentInstance();
  const { props, emit, proxy } = vm;

  let payload;

  function toggle (evt) {
    if (showing.value === true) ;
    else {
      show(evt);
    }
  }

  function show (evt) {
    if (
      (props.disable === true)
      || (evt?.qAnchorHandled === true)
      || (canShow !== void 0 && canShow(evt) !== true)
    ) return

    const listener = props[ 'onUpdate:modelValue' ] !== void 0;

    if (props.modelValue === null || listener === false || true) {
      processShow(evt);
    }
  }

  function processShow (evt) {
    if (showing.value === true) return

    showing.value = true;

    emit('beforeShow', evt);

    if (handleShow !== void 0) {
      handleShow(evt);
    }
    else {
      emit('show', evt);
    }
  }

  function hide (evt) {
    return
  }

  function processHide (evt) {
    if (showing.value === false) return

    showing.value = false;

    emit('beforeHide', evt);

    if (handleHide !== void 0) {
      handleHide(evt);
    }
    else {
      emit('hide', evt);
    }
  }

  function processModelChange (val) {
    if (props.disable === true && val === true) {
      if (props[ 'onUpdate:modelValue' ] !== void 0) {
        emit('update:modelValue', false);
      }
    }
    else if ((val === true) !== showing.value) {
      const fn = val === true ? processShow : processHide;
      fn(payload);
    }
  }

  watch(() => props.modelValue, processModelChange);

  if (hideOnRouteChange !== void 0 && vmHasRouter(vm) === true) {
    watch(() => proxy.$route.fullPath, () => {
      if (hideOnRouteChange.value === true && showing.value === true) ;
    });
  }

  onMounted(() => {
    processModelChange(props.modelValue);
  });

  // expose public methods
  const publicMethods = { show, hide, toggle };
  Object.assign(proxy, publicMethods);

  return publicMethods
}

const useTransitionProps = {
  transitionShow: {
    type: String,
    default: 'fade'
  },

  transitionHide: {
    type: String,
    default: 'fade'
  },

  transitionDuration: {
    type: [ String, Number ],
    default: 300
  }
};

function useTransition (props, defaultShowFn = () => {}, defaultHideFn = () => {}) {
  return {
    transitionProps: computed(() => {
      const show = `q-transition--${ props.transitionShow || defaultShowFn() }`;
      const hide = `q-transition--${ props.transitionHide || defaultHideFn() }`;

      return {
        appear: true,

        enterFromClass: `${ show }-enter-from`,
        enterActiveClass: `${ show }-enter-active`,
        enterToClass: `${ show }-enter-to`,

        leaveFromClass: `${ hide }-leave-from`,
        leaveActiveClass: `${ hide }-leave-active`,
        leaveToClass: `${ hide }-leave-to`
      }
    }),

    transitionStyle: computed(() => `--q-transition-duration: ${ props.transitionDuration }ms`)
  }
}

let queue = [];
let waitFlags = [];

function addFocusFn (fn) {
  if (waitFlags.length === 0) {
    fn();
  }
  else {
    queue.push(fn);
  }
}

function removeFocusFn (fn) {
  queue = queue.filter(entry => entry !== fn);
}

const portalProxyList = [];

function closePortalMenus (proxy, evt) {
  do {
    if (proxy.$options.name === 'QMenu') {
      proxy.hide(evt);

      // is this a point of separation?
      if (proxy.$props.separateClosePopup === true) {
        return getParentProxy(proxy)
      }
    }
    else if (proxy.__qPortal === true) {
      // treat it as point of separation if parent is QPopupProxy
      // (so mobile matches desktop behavior)
      // and hide it too
      const parent = getParentProxy(proxy);

      if (parent?.$options.name === 'QPopupProxy') {
        proxy.hide(evt);
        return parent
      }
      else {
        return proxy
      }
    }

    proxy = getParentProxy(proxy);
  } while (proxy !== void 0 && proxy !== null)
}

/**
 * Noop internal component to ease testing
 * of the teleported content.
 *
 * const wrapper = mount(QDialog, { ... })
 * const teleportedWrapper = wrapper.findComponent({ name: 'QPortal' })
 */
createComponent({
  name: 'QPortal',
  setup (_, { slots }) {
    return () => slots.default()
  }
});

// Warning!
// You MUST specify "inheritAttrs: false" in your component

function usePortal (vm, innerRef, renderPortalContent, type) {
  // showing, including while in show/hide transition
  const portalIsActive = ref(false);

  // showing & not in any show/hide transition
  const portalIsAccessible = ref(false);

  {
    return {
      portalIsActive,
      portalIsAccessible,

      showPortal: noop,
      hidePortal: noop,
      renderPortal: noop
    }
  }
}

const handlers$1 = [];
let escDown;

function onKeydown (evt) {
  escDown = evt.keyCode === 27;
}

function onBlur () {
  if (escDown === true) {
    escDown = false;
  }
}

function onKeyup (evt) {
  if (escDown === true) {
    escDown = false;

    if (isKeyCode(evt, 27) === true) {
      handlers$1[ handlers$1.length - 1 ](evt);
    }
  }
}

function update (action) {
  window[ action ]('keydown', onKeydown);
  window[ action ]('blur', onBlur);
  window[ action ]('keyup', onKeyup);
  escDown = false;
}

function addEscapeKey (fn) {
  if (client.is.desktop === true) {
    handlers$1.push(fn);

    if (handlers$1.length === 1) {
      update('addEventListener');
    }
  }
}

function removeEscapeKey (fn) {
  const index = handlers$1.indexOf(fn);
  if (index !== -1) {
    handlers$1.splice(index, 1);

    if (handlers$1.length === 0) {
      update('removeEventListener');
    }
  }
}

const handlers = [];

function trigger (e) {
  handlers[ handlers.length - 1 ](e);
}

function addFocusout (fn) {
  if (client.is.desktop === true) {
    handlers.push(fn);

    if (handlers.length === 1) {
      document.body.addEventListener('focusin', trigger);
    }
  }
}

function removeFocusout (fn) {
  const index = handlers.indexOf(fn);
  if (index !== -1) {
    handlers.splice(index, 1);

    if (handlers.length === 0) {
      document.body.removeEventListener('focusin', trigger);
    }
  }
}

const __nuxt_component_6 = createComponent({
  name: 'QItem',

  props: {
    ...useDarkProps,
    ...useRouterLinkProps,

    tag: {
      type: String,
      default: 'div'
    },

    active: {
      type: Boolean,
      default: null
    },

    clickable: Boolean,
    dense: Boolean,
    insetLevel: Number,

    tabindex: [ String, Number ],

    focused: Boolean,
    manualFocus: Boolean
  },

  emits: [ 'click', 'keyup' ],

  setup (props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance();

    const isDark = useDark(props, $q);
    const { hasLink, linkAttrs, linkClass, linkTag, navigateOnClick } = useRouterLink();

    const rootRef = ref(null);
    const blurTargetRef = ref(null);

    const isActionable = computed(() =>
      props.clickable === true
        || hasLink.value === true
        || props.tag === 'label'
    );

    const isClickable = computed(() =>
      props.disable !== true && isActionable.value === true
    );

    const classes = computed(() =>
      'q-item q-item-type row no-wrap'
      + (props.dense === true ? ' q-item--dense' : '')
      + (isDark.value === true ? ' q-item--dark' : '')
      + (
        hasLink.value === true && props.active === null
          ? linkClass.value
          : (
              props.active === true
                ? ` q-item--active${ props.activeClass !== void 0 ? ` ${ props.activeClass }` : '' }`
                : ''
            )
      )
      + (props.disable === true ? ' disabled' : '')
      + (
        isClickable.value === true
          ? ' q-item--clickable q-link cursor-pointer '
            + (props.manualFocus === true ? 'q-manual-focusable' : 'q-focusable q-hoverable')
            + (props.focused === true ? ' q-manual-focusable--focused' : '')
          : ''
      )
    );

    const style = computed(() => {
      if (props.insetLevel === void 0) {
        return null
      }

      const dir = $q.lang.rtl === true ? 'Right' : 'Left';
      return {
        [ 'padding' + dir ]: (16 + props.insetLevel * 56) + 'px'
      }
    });

    function onClick (e) {
      if (isClickable.value === true) {
        if (blurTargetRef.value !== null && e.qAvoidFocus !== true) {
          if (e.qKeyEvent !== true && document.activeElement === rootRef.value) {
            blurTargetRef.value.focus();
          }
          else if (document.activeElement === blurTargetRef.value) {
            rootRef.value.focus();
          }
        }

        navigateOnClick(e);
      }
    }

    function onKeyup (e) {
      if (isClickable.value === true && isKeyCode(e, [ 13, 32 ]) === true) {
        stopAndPrevent(e);

        // for ripple
        e.qKeyEvent = true;

        // for click trigger
        const evt = new MouseEvent('click', e);
        evt.qKeyEvent = true;
        rootRef.value.dispatchEvent(evt);
      }

      emit('keyup', e);
    }

    function getContent () {
      const child = hUniqueSlot(slots.default, []);

      isClickable.value === true && child.unshift(
        h('div', { class: 'q-focus-helper', tabindex: -1, ref: blurTargetRef })
      );

      return child
    }

    return () => {
      const data = {
        ref: rootRef,
        class: classes.value,
        style: style.value,
        role: 'listitem',
        onClick,
        onKeyup
      };

      if (isClickable.value === true) {
        data.tabindex = props.tabindex || '0';
        Object.assign(data, linkAttrs.value);
      }
      else if (isActionable.value === true) {
        data[ 'aria-disabled' ] = 'true';
      }

      return h(
        linkTag.value,
        data,
        getContent()
      )
    }
  }
});

const __nuxt_component_7 = createComponent({
  name: 'QItemSection',

  props: {
    avatar: Boolean,
    thumbnail: Boolean,
    side: Boolean,
    top: Boolean,
    noWrap: Boolean
  },

  setup (props, { slots }) {
    const classes = computed(() =>
      'q-item__section column'
      + ` q-item__section--${ props.avatar === true || props.side === true || props.thumbnail === true ? 'side' : 'main' }`
      + (props.top === true ? ' q-item__section--top justify-start' : ' justify-center')
      + (props.avatar === true ? ' q-item__section--avatar' : '')
      + (props.thumbnail === true ? ' q-item__section--thumbnail' : '')
      + (props.noWrap === true ? ' q-item__section--nowrap' : '')
    );

    return () => h('div', { class: classes.value }, hSlot(slots.default))
  }
});

function clearSelection () {
  if (window.getSelection !== void 0) {
    const selection = window.getSelection();
    if (selection.empty !== void 0) {
      selection.empty();
    }
    else if (selection.removeAllRanges !== void 0) {
      selection.removeAllRanges();
      Platform.is.mobile !== true && selection.addRange(document.createRange());
    }
  }
  else if (document.selection !== void 0) {
    document.selection.empty();
  }
}

const useAnchorStaticProps = {
  /* SSR does not know about Element */
  target: { default: true }
    ,

  noParentEvent: Boolean
};

const useAnchorProps = {
  ...useAnchorStaticProps,
  contextMenu: Boolean
};

function useAnchor ({
  showing,
  avoidEmit, // required for QPopupProxy (true)
  configureAnchorEl // optional
}) {
  const { props, proxy, emit } = getCurrentInstance();

  const anchorEl = ref(null);

  let touchTimer = null;

  function canShow (evt) {
    // abort with no parent configured or on multi-touch
    return anchorEl.value === null
      ? false
      : (evt === void 0 || evt.touches === void 0 || evt.touches.length <= 1)
  }

  const anchorEvents = {};

  if (configureAnchorEl === void 0) {
    // default configureAnchorEl is designed for
    // QMenu & QPopupProxy (which is why it's handled here)

    Object.assign(anchorEvents, {
      hide (evt) {
        proxy.hide(evt);
      },

      toggle (evt) {
        proxy.toggle(evt);
        evt.qAnchorHandled = true;
      },

      toggleKey (evt) {
        isKeyCode(evt, 13) === true && anchorEvents.toggle(evt);
      },

      contextClick (evt) {
        proxy.hide(evt);
        prevent(evt);
        nextTick(() => {
          proxy.show(evt);
          evt.qAnchorHandled = true;
        });
      },

      prevent,

      mobileTouch (evt) {
        anchorEvents.mobileCleanup(evt);

        if (canShow(evt) !== true) return

        proxy.hide(evt);
        anchorEl.value.classList.add('non-selectable');

        const target = evt.target;
        addEvt(anchorEvents, 'anchor', [
          [ target, 'touchmove', 'mobileCleanup', 'passive' ],
          [ target, 'touchend', 'mobileCleanup', 'passive' ],
          [ target, 'touchcancel', 'mobileCleanup', 'passive' ],
          [ anchorEl.value, 'contextmenu', 'prevent', 'notPassive' ]
        ]);

        touchTimer = setTimeout(() => {
          touchTimer = null;
          proxy.show(evt);
          evt.qAnchorHandled = true;
        }, 300);
      },

      mobileCleanup (evt) {
        anchorEl.value.classList.remove('non-selectable');

        if (touchTimer !== null) {
          clearTimeout(touchTimer);
          touchTimer = null;
        }

        if (showing.value === true && evt !== void 0) {
          clearSelection();
        }
      }
    });

    configureAnchorEl = function (context = props.contextMenu) {
      if (props.noParentEvent === true || anchorEl.value === null) return

      let evts;

      if (context === true) {
        if (proxy.$q.platform.is.mobile === true) {
          evts = [
            [ anchorEl.value, 'touchstart', 'mobileTouch', 'passive' ]
          ];
        }
        else {
          evts = [
            [ anchorEl.value, 'mousedown', 'hide', 'passive' ],
            [ anchorEl.value, 'contextmenu', 'contextClick', 'notPassive' ]
          ];
        }
      }
      else {
        evts = [
          [ anchorEl.value, 'click', 'toggle', 'passive' ],
          [ anchorEl.value, 'keyup', 'toggleKey', 'passive' ]
        ];
      }

      addEvt(anchorEvents, 'anchor', evts);
    };
  }

  function unconfigureAnchorEl () {
    cleanEvt(anchorEvents, 'anchor');
  }

  function setAnchorEl (el) {
    anchorEl.value = el;
    while (anchorEl.value.classList.contains('q-anchor--skip')) {
      anchorEl.value = anchorEl.value.parentNode;
    }
    configureAnchorEl();
  }

  function pickAnchorEl () {
    if (props.target === false || props.target === '' || proxy.$el.parentNode === null) {
      anchorEl.value = null;
    }
    else if (props.target === true) {
      setAnchorEl(proxy.$el.parentNode);
    }
    else {
      let el = props.target;

      if (typeof props.target === 'string') {
        try {
          el = document.querySelector(props.target);
        }
        catch (err) {
          el = void 0;
        }
      }

      if (el !== void 0 && el !== null) {
        anchorEl.value = el.$el || el;
        configureAnchorEl();
      }
      else {
        anchorEl.value = null;
        console.error(`Anchor: target "${ props.target }" not found`);
      }
    }
  }

  watch(() => props.contextMenu, val => {
    if (anchorEl.value !== null) {
      unconfigureAnchorEl();
      configureAnchorEl(val);
    }
  });

  watch(() => props.target, () => {
    if (anchorEl.value !== null) {
      unconfigureAnchorEl();
    }

    pickAnchorEl();
  });

  watch(() => props.noParentEvent, val => {
    if (anchorEl.value !== null) {
      if (val === true) {
        unconfigureAnchorEl();
      }
      else {
        configureAnchorEl();
      }
    }
  });

  onMounted(() => {
    pickAnchorEl();

    if (avoidEmit !== true && props.modelValue === true && anchorEl.value === null) {
      emit('update:modelValue', false);
    }
  });

  onBeforeUnmount(() => {
    touchTimer !== null && clearTimeout(touchTimer);
    unconfigureAnchorEl();
  });

  return {
    anchorEl,
    canShow,
    anchorEvents
  }
}

function useScrollTarget (props, configureScrollTarget) {
  const localScrollTarget = ref(null);
  let scrollFn;

  function changeScrollEvent (scrollTarget, fn) {
    const fnProp = `${ fn !== void 0 ? 'add' : 'remove' }EventListener`;
    const fnHandler = fn !== void 0 ? fn : scrollFn;

    if (scrollTarget !== window) {
      scrollTarget[ fnProp ]('scroll', fnHandler, listenOpts.passive);
    }

    window[ fnProp ]('scroll', fnHandler, listenOpts.passive);

    scrollFn = fn;
  }

  function unconfigureScrollTarget () {
    if (localScrollTarget.value !== null) {
      changeScrollEvent(localScrollTarget.value);
      localScrollTarget.value = null;
    }
  }

  const noParentEventWatcher = watch(() => props.noParentEvent, () => {
    if (localScrollTarget.value !== null) {
      unconfigureScrollTarget();
      configureScrollTarget();
    }
  });

  onBeforeUnmount(noParentEventWatcher);

  return {
    localScrollTarget,
    unconfigureScrollTarget,
    changeScrollEvent
  }
}

const
  { notPassiveCapture } = listenOpts,
  registeredList = [];

function globalHandler (evt) {

  const target = evt.target;

  if (
    target === void 0
    || target.nodeType === 8
    || target.classList.contains('no-pointer-events') === true
  ) return

  // check last portal vm if it's
  // a QDialog and not in seamless mode
  let portalIndex = portalProxyList.length - 1;

  while (portalIndex >= 0) {
    const proxy = portalProxyList[ portalIndex ].$;

    // skip QTooltip portals
    if (proxy.type.name === 'QTooltip') {
      portalIndex--;
      continue
    }

    if (proxy.type.name !== 'QDialog') {
      break
    }

    if (proxy.props.seamless !== true) return

    portalIndex--;
  }

  for (let i = registeredList.length - 1; i >= 0; i--) {
    const state = registeredList[ i ];

    if (
      (
        state.anchorEl.value === null
        || state.anchorEl.value.contains(target) === false
      )
      && (
        target === document.body
        || (
          state.innerRef.value !== null
          && state.innerRef.value.contains(target) === false
        )
      )
    ) {
      // mark the event as being processed by clickOutside
      // used to prevent refocus after menu close
      evt.qClickOutside = true;
      state.onClickOutside(evt);
    }
    else {
      return
    }
  }
}

function addClickOutside (clickOutsideProps) {
  registeredList.push(clickOutsideProps);

  if (registeredList.length === 1) {
    document.addEventListener('mousedown', globalHandler, notPassiveCapture);
    document.addEventListener('touchstart', globalHandler, notPassiveCapture);
  }
}

function removeClickOutside (clickOutsideProps) {
  const index = registeredList.findIndex(h => h === clickOutsideProps);

  if (index !== -1) {
    registeredList.splice(index, 1);

    if (registeredList.length === 0) {

      document.removeEventListener('mousedown', globalHandler, notPassiveCapture);
      document.removeEventListener('touchstart', globalHandler, notPassiveCapture);
    }
  }
}

let vpLeft, vpTop;

function validatePosition (pos) {
  const parts = pos.split(' ');
  if (parts.length !== 2) {
    return false
  }
  if ([ 'top', 'center', 'bottom' ].includes(parts[ 0 ]) !== true) {
    console.error('Anchor/Self position must start with one of top/center/bottom');
    return false
  }
  if ([ 'left', 'middle', 'right', 'start', 'end' ].includes(parts[ 1 ]) !== true) {
    console.error('Anchor/Self position must end with one of left/middle/right/start/end');
    return false
  }
  return true
}

function validateOffset (val) {
  if (!val) { return true }
  if (val.length !== 2) { return false }
  if (typeof val[ 0 ] !== 'number' || typeof val[ 1 ] !== 'number') {
    return false
  }
  return true
}

const horizontalPos = {
  'start#ltr': 'left',
  'start#rtl': 'right',
  'end#ltr': 'right',
  'end#rtl': 'left'
}

;[ 'left', 'middle', 'right' ].forEach(pos => {
  horizontalPos[ `${ pos }#ltr` ] = pos;
  horizontalPos[ `${ pos }#rtl` ] = pos;
});

function parsePosition (pos, rtl) {
  const parts = pos.split(' ');
  return {
    vertical: parts[ 0 ],
    horizontal: horizontalPos[ `${ parts[ 1 ] }#${ rtl === true ? 'rtl' : 'ltr' }` ]
  }
}

function getAnchorProps (el, offset) {
  let { top, left, right, bottom, width, height } = el.getBoundingClientRect();

  if (offset !== void 0) {
    top -= offset[ 1 ];
    left -= offset[ 0 ];
    bottom += offset[ 1 ];
    right += offset[ 0 ];

    width += offset[ 0 ];
    height += offset[ 1 ];
  }

  return {
    top, bottom, height,
    left, right, width,
    middle: left + (right - left) / 2,
    center: top + (bottom - top) / 2
  }
}

function getAbsoluteAnchorProps (el, absoluteOffset, offset) {
  let { top, left } = el.getBoundingClientRect();

  top += absoluteOffset.top;
  left += absoluteOffset.left;

  if (offset !== void 0) {
    top += offset[ 1 ];
    left += offset[ 0 ];
  }

  return {
    top, bottom: top + 1, height: 1,
    left, right: left + 1, width: 1,
    middle: left,
    center: top
  }
}

function getTargetProps (width, height) {
  return {
    top: 0,
    center: height / 2,
    bottom: height,
    left: 0,
    middle: width / 2,
    right: width
  }
}

function getTopLeftProps (anchorProps, targetProps, anchorOrigin, selfOrigin) {
  return {
    top: anchorProps[ anchorOrigin.vertical ] - targetProps[ selfOrigin.vertical ],
    left: anchorProps[ anchorOrigin.horizontal ] - targetProps[ selfOrigin.horizontal ]
  }
}

function setPosition (cfg, retryNumber = 0) {
  if (
    cfg.targetEl === null
    || cfg.anchorEl === null
    || retryNumber > 5 // we should try only a few times
  ) return

  // some browsers report zero height or width because
  // we are trying too early to get these dimensions
  if (cfg.targetEl.offsetHeight === 0 || cfg.targetEl.offsetWidth === 0) {
    setTimeout(() => {
      setPosition(cfg, retryNumber + 1);
    }, 10);
    return
  }

  const {
    targetEl,
    offset,
    anchorEl,
    anchorOrigin,
    selfOrigin,
    absoluteOffset,
    fit,
    cover,
    maxHeight,
    maxWidth
  } = cfg;

  if (client.is.ios === true && window.visualViewport !== void 0) {
    // uses the q-position-engine CSS class

    const el = document.body.style;
    const { offsetLeft: left, offsetTop: top } = window.visualViewport;

    if (left !== vpLeft) {
      el.setProperty('--q-pe-left', left + 'px');
      vpLeft = left;
    }
    if (top !== vpTop) {
      el.setProperty('--q-pe-top', top + 'px');
      vpTop = top;
    }
  }

  // scroll position might change
  // if max-height/-width changes, so we
  // need to restore it after we calculate
  // the new positioning
  const { scrollLeft, scrollTop } = targetEl;

  const anchorProps = absoluteOffset === void 0
    ? getAnchorProps(anchorEl, cover === true ? [ 0, 0 ] : offset)
    : getAbsoluteAnchorProps(anchorEl, absoluteOffset, offset);

  /**
   * We "reset" the critical CSS properties
   * so we can take an accurate measurement.
   *
   * Ensure that targetEl has a max-width & max-height
   * set in CSS and that the value does NOT exceeds 100vw/vh.
   * All users of the position-engine (currently QMenu & QTooltip)
   * have CSS for this.
   */
  Object.assign(targetEl.style, {
    top: 0,
    left: 0,
    minWidth: null,
    minHeight: null,
    maxWidth,
    maxHeight,
    visibility: 'visible'
  });

  const { offsetWidth: origElWidth, offsetHeight: origElHeight } = targetEl;
  const { elWidth, elHeight } = fit === true || cover === true
    ? { elWidth: Math.max(anchorProps.width, origElWidth), elHeight: cover === true ? Math.max(anchorProps.height, origElHeight) : origElHeight }
    : { elWidth: origElWidth, elHeight: origElHeight };

  let elStyle = { maxWidth, maxHeight };

  if (fit === true || cover === true) {
    elStyle.minWidth = anchorProps.width + 'px';
    if (cover === true) {
      elStyle.minHeight = anchorProps.height + 'px';
    }
  }

  Object.assign(targetEl.style, elStyle);

  const targetProps = getTargetProps(elWidth, elHeight);
  let props = getTopLeftProps(anchorProps, targetProps, anchorOrigin, selfOrigin);

  if (absoluteOffset === void 0 || offset === void 0) {
    applyBoundaries(props, anchorProps, targetProps, anchorOrigin, selfOrigin);
  }
  else { // we have touch position or context menu with offset
    const { top, left } = props; // cache initial values

    // apply initial boundaries
    applyBoundaries(props, anchorProps, targetProps, anchorOrigin, selfOrigin);

    let hasChanged = false;

    // did it flip vertically?
    if (props.top !== top) {
      hasChanged = true;
      const offsetY = 2 * offset[ 1 ];
      anchorProps.center = anchorProps.top -= offsetY;
      anchorProps.bottom -= offsetY + 2;
    }

    // did it flip horizontally?
    if (props.left !== left) {
      hasChanged = true;
      const offsetX = 2 * offset[ 0 ];
      anchorProps.middle = anchorProps.left -= offsetX;
      anchorProps.right -= offsetX + 2;
    }

    if (hasChanged === true) {
      // re-calculate props with the new anchor
      props = getTopLeftProps(anchorProps, targetProps, anchorOrigin, selfOrigin);

      // and re-apply boundaries
      applyBoundaries(props, anchorProps, targetProps, anchorOrigin, selfOrigin);
    }
  }

  elStyle = {
    top: props.top + 'px',
    left: props.left + 'px'
  };

  if (props.maxHeight !== void 0) {
    elStyle.maxHeight = props.maxHeight + 'px';

    if (anchorProps.height > props.maxHeight) {
      elStyle.minHeight = elStyle.maxHeight;
    }
  }
  if (props.maxWidth !== void 0) {
    elStyle.maxWidth = props.maxWidth + 'px';

    if (anchorProps.width > props.maxWidth) {
      elStyle.minWidth = elStyle.maxWidth;
    }
  }

  Object.assign(targetEl.style, elStyle);

  // restore scroll position
  if (targetEl.scrollTop !== scrollTop) {
    targetEl.scrollTop = scrollTop;
  }
  if (targetEl.scrollLeft !== scrollLeft) {
    targetEl.scrollLeft = scrollLeft;
  }
}

function applyBoundaries (props, anchorProps, targetProps, anchorOrigin, selfOrigin) {
  const
    currentHeight = targetProps.bottom,
    currentWidth = targetProps.right,
    margin = getScrollbarWidth(),
    innerHeight = window.innerHeight - margin,
    innerWidth = document.body.clientWidth;

  if (props.top < 0 || props.top + currentHeight > innerHeight) {
    if (selfOrigin.vertical === 'center') {
      props.top = anchorProps[ anchorOrigin.vertical ] > innerHeight / 2
        ? Math.max(0, innerHeight - currentHeight)
        : 0;
      props.maxHeight = Math.min(currentHeight, innerHeight);
    }
    else if (anchorProps[ anchorOrigin.vertical ] > innerHeight / 2) {
      const anchorY = Math.min(
        innerHeight,
        anchorOrigin.vertical === 'center'
          ? anchorProps.center
          : (anchorOrigin.vertical === selfOrigin.vertical ? anchorProps.bottom : anchorProps.top)
      );
      props.maxHeight = Math.min(currentHeight, anchorY);
      props.top = Math.max(0, anchorY - currentHeight);
    }
    else {
      props.top = Math.max(0, anchorOrigin.vertical === 'center'
        ? anchorProps.center
        : (anchorOrigin.vertical === selfOrigin.vertical ? anchorProps.top : anchorProps.bottom)
      );
      props.maxHeight = Math.min(currentHeight, innerHeight - props.top);
    }
  }

  if (props.left < 0 || props.left + currentWidth > innerWidth) {
    props.maxWidth = Math.min(currentWidth, innerWidth);
    if (selfOrigin.horizontal === 'middle') {
      props.left = anchorProps[ anchorOrigin.horizontal ] > innerWidth / 2
        ? Math.max(0, innerWidth - currentWidth)
        : 0;
    }
    else if (anchorProps[ anchorOrigin.horizontal ] > innerWidth / 2) {
      const anchorX = Math.min(
        innerWidth,
        anchorOrigin.horizontal === 'middle'
          ? anchorProps.middle
          : (anchorOrigin.horizontal === selfOrigin.horizontal ? anchorProps.right : anchorProps.left)
      );
      props.maxWidth = Math.min(currentWidth, anchorX);
      props.left = Math.max(0, anchorX - props.maxWidth);
    }
    else {
      props.left = Math.max(0, anchorOrigin.horizontal === 'middle'
        ? anchorProps.middle
        : (anchorOrigin.horizontal === selfOrigin.horizontal ? anchorProps.left : anchorProps.right)
      );
      props.maxWidth = Math.min(currentWidth, innerWidth - props.left);
    }
  }
}

const __nuxt_component_4 = createComponent({
  name: 'QMenu',

  inheritAttrs: false,

  props: {
    ...useAnchorProps,
    ...useModelToggleProps,
    ...useDarkProps,
    ...useTransitionProps,

    persistent: Boolean,
    autoClose: Boolean,
    separateClosePopup: Boolean,
    noEscDismiss: Boolean,
    noRouteDismiss: Boolean,
    noRefocus: Boolean,
    noFocus: Boolean,

    fit: Boolean,
    cover: Boolean,

    square: Boolean,

    anchor: {
      type: String,
      validator: validatePosition
    },
    self: {
      type: String,
      validator: validatePosition
    },
    offset: {
      type: Array,
      validator: validateOffset
    },

    scrollTarget: scrollTargetProp,

    touchPosition: Boolean,

    maxHeight: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null
    }
  },

  emits: [
    ...useModelToggleEmits,
    'click', 'escapeKey'
  ],

  setup (props, { slots, emit, attrs }) {
    let refocusTarget = null, absoluteOffset, unwatchPosition, avoidAutoClose;

    const vm = getCurrentInstance();
    const { proxy } = vm;
    const { $q } = proxy;

    const innerRef = ref(null);
    const showing = ref(false);

    const hideOnRouteChange = computed(() =>
      props.persistent !== true
      && props.noRouteDismiss !== true
    );

    const isDark = useDark(props, $q);
    const { registerTick, removeTick } = useTick();
    const { registerTimeout } = useTimeout();
    useTransition(props);
    const { localScrollTarget, changeScrollEvent, unconfigureScrollTarget } = useScrollTarget(props, configureScrollTarget);

    const { anchorEl, canShow } = useAnchor({ showing });

    const { hide } = useModelToggle({
      showing, canShow, handleShow, handleHide,
      hideOnRouteChange,
      processOnMount: true
    });

    const { showPortal, hidePortal, renderPortal } = usePortal();

    const clickOutsideProps = {
      anchorEl,
      innerRef,
      onClickOutside (e) {
        if (props.persistent !== true && showing.value === true) {
          hide(e);

          if (
            // always prevent touch event
            e.type === 'touchstart'
            // prevent click if it's on a dialog backdrop
            || e.target.classList.contains('q-dialog__backdrop')
          ) {
            stopAndPrevent(e);
          }

          return true
        }
      }
    };

    const anchorOrigin = computed(() =>
      parsePosition(
        props.anchor || (
          props.cover === true ? 'center middle' : 'bottom start'
        ),
        $q.lang.rtl
      )
    );

    const selfOrigin = computed(() => (
      props.cover === true
        ? anchorOrigin.value
        : parsePosition(props.self || 'top start', $q.lang.rtl)
    ));

    computed(() =>
      (props.square === true ? ' q-menu--square' : '')
      + (isDark.value === true ? ' q-menu--dark q-dark' : '')
    );

    computed(() => (
      props.autoClose === true
        ? { onClick: onAutoClose }
        : {}
    ));

    const handlesFocus = computed(() =>
      showing.value === true && props.persistent !== true
    );

    watch(handlesFocus, val => {
      if (val === true) {
        addEscapeKey(onEscapeKey);
        addClickOutside(clickOutsideProps);
      }
      else {
        removeEscapeKey(onEscapeKey);
        removeClickOutside(clickOutsideProps);
      }
    });

    function focus () {
      addFocusFn(() => {
        let node = innerRef.value;

        if (node && (node.contains(document.activeElement) !== true)) {
          node = node.querySelector('[autofocus][tabindex], [data-autofocus][tabindex]')
            || node.querySelector('[autofocus] [tabindex], [data-autofocus] [tabindex]')
            || node.querySelector('[autofocus], [data-autofocus]')
            || node;
          node.focus({ preventScroll: true });
        }
      });
    }

    function handleShow (evt) {
      refocusTarget = props.noRefocus === false
        ? document.activeElement
        : null;

      addFocusout(onFocusout);

      showPortal();
      configureScrollTarget();

      absoluteOffset = void 0;

      if (evt !== void 0 && (props.touchPosition || props.contextMenu)) {
        const pos = position(evt);

        if (pos.left !== void 0) {
          const { top, left } = anchorEl.value.getBoundingClientRect();
          absoluteOffset = { left: pos.left - left, top: pos.top - top };
        }
      }

      if (unwatchPosition === void 0) {
        unwatchPosition = watch(
          () => $q.screen.width + '|' + $q.screen.height + '|' + props.self + '|' + props.anchor + '|' + $q.lang.rtl,
          updatePosition
        );
      }

      if (props.noFocus !== true) {
        document.activeElement.blur();
      }

      // should removeTick() if this gets removed
      registerTick(() => {
        updatePosition();
        props.noFocus !== true && focus();
      });

      // should removeTimeout() if this gets removed
      registerTimeout(() => {
        // required in order to avoid the "double-tap needed" issue
        if ($q.platform.is.ios === true) {
          // if auto-close, then this click should
          // not close the menu
          avoidAutoClose = props.autoClose;
          innerRef.value.click();
        }

        updatePosition();
        showPortal(true); // done showing portal
        emit('show', evt);
      }, props.transitionDuration);
    }

    function handleHide (evt) {
      removeTick();
      hidePortal();

      anchorCleanup(true);

      if (
        refocusTarget !== null
        && (
          // menu was hidden from code or ESC plugin
          evt === void 0
          // menu was not closed from a mouse or touch clickOutside
          || evt.qClickOutside !== true
        )
      ) {
        ((evt?.type.indexOf('key') === 0
          ? refocusTarget.closest('[tabindex]:not([tabindex^="-"])')
          : void 0
        ) || refocusTarget).focus();

        refocusTarget = null;
      }

      // should removeTimeout() if this gets removed
      registerTimeout(() => {
        hidePortal(true); // done hiding, now destroy
        emit('hide', evt);
      }, props.transitionDuration);
    }

    function anchorCleanup (hiding) {
      absoluteOffset = void 0;

      if (unwatchPosition !== void 0) {
        unwatchPosition();
        unwatchPosition = void 0;
      }

      if (hiding === true || showing.value === true) {
        removeFocusout(onFocusout);
        unconfigureScrollTarget();
        removeClickOutside(clickOutsideProps);
        removeEscapeKey(onEscapeKey);
      }

      if (hiding !== true) {
        refocusTarget = null;
      }
    }

    function configureScrollTarget () {
      if (anchorEl.value !== null || props.scrollTarget !== void 0) {
        localScrollTarget.value = getScrollTarget(anchorEl.value, props.scrollTarget);
        changeScrollEvent(localScrollTarget.value, updatePosition);
      }
    }

    function onAutoClose (e) {
      // if auto-close, then the ios double-tap fix which
      // issues a click should not close the menu
      if (avoidAutoClose !== true) {
        closePortalMenus(proxy, e);
        emit('click', e);
      }
      else {
        avoidAutoClose = false;
      }
    }

    function onFocusout (evt) {
      // the focus is not in a vue child component
      if (
        handlesFocus.value === true
        && props.noFocus !== true
        && childHasFocus(innerRef.value, evt.target) !== true
      ) {
        focus();
      }
    }

    function onEscapeKey (evt) {
      if (props.noEscDismiss !== true) {
        emit('escapeKey');
        hide(evt);
      }
    }

    function updatePosition () {
      setPosition({
        targetEl: innerRef.value,
        offset: props.offset,
        anchorEl: anchorEl.value,
        anchorOrigin: anchorOrigin.value,
        selfOrigin: selfOrigin.value,
        absoluteOffset,
        fit: props.fit,
        cover: props.cover,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth
      });
    }

    onBeforeUnmount(anchorCleanup);

    // expose public methods
    Object.assign(proxy, { focus, updatePosition });

    return renderPortal
  }
});

const roleAttrExceptions = [ 'ul', 'ol' ];

const __nuxt_component_5 = createComponent({
  name: 'QList',

  props: {
    ...useDarkProps,

    bordered: Boolean,
    dense: Boolean,
    separator: Boolean,
    padding: Boolean,

    tag: {
      type: String,
      default: 'div'
    }
  },

  setup (props, { slots }) {
    const vm = getCurrentInstance();
    const isDark = useDark(props, vm.proxy.$q);

    const role = computed(() => (
      roleAttrExceptions.includes(props.tag) ? null : 'list')
    );

    const classes = computed(() =>
      'q-list'
      + (props.bordered === true ? ' q-list--bordered' : '')
      + (props.dense === true ? ' q-list--dense' : '')
      + (props.separator === true ? ' q-list--separator' : '')
      + (isDark.value === true ? ' q-list--dark' : '')
      + (props.padding === true ? ' q-list--padding' : '')
    );

    return () => h(props.tag, { class: classes.value, role: role.value }, hSlot(slots.default))
  }
});

export { __nuxt_component_6 as _, __nuxt_component_7 as a, useTransitionProps as b, useModelToggleProps as c, useTransition as d, usePortal as e, useModelToggle as f, addFocusout as g, addEscapeKey as h, removeEscapeKey as i, addFocusFn as j, removeFocusFn as k, __nuxt_component_4 as l, __nuxt_component_5 as m, validatePosition as n, useAnchorStaticProps as o, parsePosition as p, useScrollTarget as q, removeFocusout as r, useAnchor as s, addClickOutside as t, useModelToggleEmits as u, validateOffset as v, removeClickOutside as w, setPosition as x, clearSelection as y };
//# sourceMappingURL=QList.mjs.map

import { computed, h, getCurrentInstance, ref, onBeforeUnmount, Transition, withDirectives } from 'vue';
import { u as useSizeDefaults, a as useSizeProps, b as useSize, _ as __nuxt_component_4 } from './QIcon.mjs';
import { g as createComponent, h as createDirective, s as stopAndPrevent, k as listenOpts, m as prevent, o as stop } from '../build/server.mjs';
import { b as hMergeSlot } from './render.mjs';

const useSpinnerProps = {
  size: {
    type: [ String, Number ],
    default: '1em'
  },
  color: String
};

function useSpinner (props) {
  return {
    cSize: computed(() => (
      props.size in useSizeDefaults
        ? `${ useSizeDefaults[ props.size ] }px`
        : props.size
    )),

    classes: computed(() =>
      'q-spinner' + (props.color ? ` text-${ props.color }` : '')
    )
  }
}

const QSpinner = createComponent({
  name: 'QSpinner',

  props: {
    ...useSpinnerProps,

    thickness: {
      type: Number,
      default: 5
    }
  },

  setup (props) {
    const { cSize, classes } = useSpinner(props);

    return () => h('svg', {
      class: classes.value + ' q-spinner-mat',
      width: cSize.value,
      height: cSize.value,
      viewBox: '25 25 50 50'
    }, [
      h('circle', {
        class: 'path',
        cx: '50',
        cy: '50',
        r: '20',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': props.thickness,
        'stroke-miterlimit': '10'
      })
    ])
  }
});

function shouldIgnoreKey (evt) {
  return evt !== Object(evt)
    || evt.isComposing === true
    || evt.qKeyEvent === true
}

function isKeyCode (evt, keyCodes) {
  return shouldIgnoreKey(evt) === true
    ? false
    : [].concat(keyCodes).includes(evt.keyCode)
}

const getSSRProps = () => ({});

const Ripple = createDirective({ name: 'ripple', getSSRProps }
  
);

const alignMap = {
  left: 'start',
  center: 'center',
  right: 'end',
  between: 'between',
  around: 'around',
  evenly: 'evenly',
  stretch: 'stretch'
};

const alignValues = Object.keys(alignMap);

const useAlignProps = {
  align: {
    type: String,
    validator: v => alignValues.includes(v)
  }
};

function useAlign (props) {
  // return alignClass
  return computed(() => {
    const align = props.align === void 0
      ? props.vertical === true ? 'stretch' : 'left'
      : props.align;

    return `${ props.vertical === true ? 'items' : 'justify' }-${ alignMap[ align ] }`
  })
}

// copied to docs too
function getParentProxy (proxy) {
  if (Object(proxy.$parent) === proxy.$parent) {
    return proxy.$parent
  }

  let { parent } = proxy.$;

  while (Object(parent) === parent) {
    if (Object(parent.proxy) === parent.proxy) {
      return parent.proxy
    }

    parent = parent.parent;
  }
}

function fillNormalizedVNodes (children, vnode) {
  if (typeof vnode.type === 'symbol') {
    if (Array.isArray(vnode.children) === true) {
      vnode.children.forEach(child => {
        fillNormalizedVNodes(children, child);
      });
    }
  }
  else {
    children.add(vnode);
  }
}

// vnodes from rendered in advanced slots
function getNormalizedVNodes (vnodes) {
  const children = new Set();

  vnodes.forEach(vnode => {
    fillNormalizedVNodes(children, vnode);
  });

  return Array.from(children)
}

function vmHasRouter (vm) {
  return vm.appContext.config.globalProperties.$router !== void 0
}

function vmIsDestroyed (vm) {
  return vm.isUnmounted === true || vm.isDeactivated === true
}

/*
 * Inspired by RouterLink from Vue Router
 *  --> API should match!
 */


// Get the original path value of a record by following its aliasOf
function getOriginalPath (record) {
  return record
    ? (
        record.aliasOf
          ? record.aliasOf.path
          : record.path
      ) : ''
}

function isSameRouteRecord (a, b) {
  // since the original record has an undefined value for aliasOf
  // but all aliases point to the original record, this will always compare
  // the original record
  return (a.aliasOf || a) === (b.aliasOf || b)
}

function includesParams (outer, inner) {
  for (const key in inner) {
    const
      innerValue = inner[ key ],
      outerValue = outer[ key ];

    if (typeof innerValue === 'string') {
      if (innerValue !== outerValue) {
        return false
      }
    }
    else if (
      Array.isArray(outerValue) === false
      || outerValue.length !== innerValue.length
      || innerValue.some((value, i) => value !== outerValue[ i ])
    ) {
      return false
    }
  }

  return true
}

function isEquivalentArray (a, b) {
  return Array.isArray(b) === true
    ? a.length === b.length && a.every((value, i) => value === b[ i ])
    : a.length === 1 && a[ 0 ] === b
}

function isSameRouteLocationParamsValue (a, b) {
  return Array.isArray(a) === true
    ? isEquivalentArray(a, b)
    : (
        Array.isArray(b) === true
          ? isEquivalentArray(b, a)
          : a === b
      )
}

function isSameRouteLocationParams (a, b) {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false
  }

  for (const key in a) {
    if (isSameRouteLocationParamsValue(a[ key ], b[ key ]) === false) {
      return false
    }
  }

  return true
}

const useRouterLinkNonMatchingProps = {
  // router-link
  to: [ String, Object ],
  replace: Boolean,

  // regular <a> link
  href: String,
  target: String,

  // state
  disable: Boolean
};

const useRouterLinkProps = {
  ...useRouterLinkNonMatchingProps,

  // router-link
  exact: Boolean,
  activeClass: {
    type: String,
    default: 'q-router-link--active'
  },
  exactActiveClass: {
    type: String,
    default: 'q-router-link--exact-active'
  }
};

// external props: type, tag

function useRouterLink ({ fallbackTag, useDisableForRouterLinkProps = true } = {}) {
  const vm = getCurrentInstance();
  const { props, proxy, emit } = vm;

  const hasRouter = vmHasRouter(vm);
  const hasHrefLink = computed(() => props.disable !== true && props.href !== void 0);

  // for perf reasons, we use minimum amount of runtime work
  const hasRouterLinkProps = useDisableForRouterLinkProps === true
    ? computed(() =>
      hasRouter === true
      && props.disable !== true
      && hasHrefLink.value !== true
      && props.to !== void 0 && props.to !== null && props.to !== ''
    )
    : computed(() =>
      hasRouter === true
      && hasHrefLink.value !== true
      && props.to !== void 0 && props.to !== null && props.to !== ''
    );

  const resolvedLink = computed(() => (
    hasRouterLinkProps.value === true
      ? getLink(props.to)
      : null
  ));

  const hasRouterLink = computed(() => resolvedLink.value !== null);
  const hasLink = computed(() => hasHrefLink.value === true || hasRouterLink.value === true);

  const linkTag = computed(() => (
    props.type === 'a' || hasLink.value === true
      ? 'a'
      : (props.tag || fallbackTag || 'div')
  ));

  const linkAttrs = computed(() => (
    hasHrefLink.value === true
      ? {
          href: props.href,
          target: props.target
        }
      : (
          hasRouterLink.value === true
            ? {
                href: resolvedLink.value.href,
                target: props.target
              }
            : {}
        )
  ));

  const linkActiveIndex = computed(() => {
    if (hasRouterLink.value === false) {
      return -1
    }

    const
      { matched } = resolvedLink.value,
      { length } = matched,
      routeMatched = matched[ length - 1 ];

    if (routeMatched === void 0) {
      return -1
    }

    const currentMatched = proxy.$route.matched;

    if (currentMatched.length === 0) {
      return -1
    }

    const index = currentMatched.findIndex(
      isSameRouteRecord.bind(null, routeMatched)
    );

    if (index !== -1) {
      return index
    }

    // possible parent record
    const parentRecordPath = getOriginalPath(matched[ length - 2 ]);

    return (
      // we are dealing with nested routes
      length > 1
      // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      && getOriginalPath(routeMatched) === parentRecordPath
      // avoid comparing the child with its parent
      && currentMatched[ currentMatched.length - 1 ].path !== parentRecordPath
        ? currentMatched.findIndex(
          isSameRouteRecord.bind(null, matched[ length - 2 ])
        )
        : index
    )
  });

  const linkIsActive = computed(() =>
    hasRouterLink.value === true
    && linkActiveIndex.value !== -1
    && includesParams(proxy.$route.params, resolvedLink.value.params)
  );

  const linkIsExactActive = computed(() =>
    linkIsActive.value === true
      && linkActiveIndex.value === proxy.$route.matched.length - 1
      && isSameRouteLocationParams(proxy.$route.params, resolvedLink.value.params)
  );

  const linkClass = computed(() => (
    hasRouterLink.value === true
      ? (
          linkIsExactActive.value === true
            ? ` ${ props.exactActiveClass } ${ props.activeClass }`
            : (
                props.exact === true
                  ? ''
                  : (linkIsActive.value === true ? ` ${ props.activeClass }` : '')
              )
        )
      : ''
  ));

  function getLink (to) {
    try { return proxy.$router.resolve(to) }
    catch (_) {}

    return null
  }

  /**
   * @returns Promise<RouterError | false | undefined>
   */
  function navigateToRouterLink (
    e,
    { returnRouterError, to = props.to, replace = props.replace } = {}
  ) {
    if (props.disable === true) {
      // ensure native navigation is prevented in all cases,
      // like when useDisableForRouterLinkProps === false (QRouteTab)
      e.preventDefault();
      return Promise.resolve(false)
    }

    if (
      // don't redirect with control keys;
      // should match RouterLink from Vue Router
      e.metaKey || e.altKey || e.ctrlKey || e.shiftKey

      // don't redirect on right click
      || (e.button !== void 0 && e.button !== 0)

      // don't redirect if it should open in a new window
      || props.target === '_blank'
    ) {
      return Promise.resolve(false)
    }

    // hinder the native navigation
    e.preventDefault();

    // then() can also return a "soft" router error (Vue Router behavior)
    const promise = proxy.$router[ replace === true ? 'replace' : 'push' ](to);

    return returnRouterError === true
      ? promise
      // else catching hard errors and also "soft" ones - then(err => ...)
      : promise.then(() => {}).catch(() => {})
  }

  // warning! ensure that the component using it has 'click' included in its 'emits' definition prop
  function navigateOnClick (e) {
    if (hasRouterLink.value === true) {
      const go = opts => navigateToRouterLink(e, opts);

      emit('click', e, go);
      e.defaultPrevented !== true && go();
    }
    else {
      emit('click', e);
    }
  }

  return {
    hasRouterLink,
    hasHrefLink,
    hasLink,

    linkTag,
    resolvedLink,
    linkIsActive,
    linkIsExactActive,
    linkClass,
    linkAttrs,

    getLink,
    navigateToRouterLink,
    navigateOnClick
  }
}

const btnPadding = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};

const defaultSizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
};

const formTypes = [ 'button', 'submit', 'reset' ];
const mediaTypeRE = /[^\s]\/[^\s]/;

const btnDesignOptions = [ 'flat', 'outline', 'push', 'unelevated' ];

function getBtnDesign (props, defaultValue) {
  if (props.flat === true) return 'flat'
  if (props.outline === true) return 'outline'
  if (props.push === true) return 'push'
  if (props.unelevated === true) return 'unelevated'
  return defaultValue
}

const nonRoundBtnProps = {
  ...useSizeProps,
  ...useRouterLinkNonMatchingProps,

  type: {
    type: String,
    default: 'button'
  },

  label: [ Number, String ],
  icon: String,
  iconRight: String,

  ...btnDesignOptions.reduce(
    (acc, val) => (acc[ val ] = Boolean) && acc,
    {}
  ),

  square: Boolean,
  rounded: Boolean,
  glossy: Boolean,

  size: String,
  fab: Boolean,
  fabMini: Boolean,
  padding: String,

  color: String,
  textColor: String,
  noCaps: Boolean,
  noWrap: Boolean,
  dense: Boolean,

  tabindex: [ Number, String ],

  ripple: {
    type: [ Boolean, Object ],
    default: true
  },

  align: {
    ...useAlignProps.align,
    default: 'center'
  },
  stack: Boolean,
  stretch: Boolean,
  loading: {
    type: Boolean,
    default: null
  },
  disable: Boolean
};

const useBtnProps = {
  ...nonRoundBtnProps,
  round: Boolean
};

function useBtn (props) {
  const sizeStyle = useSize(props, defaultSizes);
  const alignClass = useAlign(props);
  const { hasRouterLink, hasLink, linkTag, linkAttrs, navigateOnClick } = useRouterLink({
    fallbackTag: 'button'
  });

  const style = computed(() => {
    const obj = props.fab === false && props.fabMini === false
      ? sizeStyle.value
      : {};

    return props.padding !== void 0
      ? Object.assign({}, obj, {
        padding: props.padding
          .split(/\s+/)
          .map(v => (v in btnPadding ? btnPadding[ v ] + 'px' : v))
          .join(' '),
        minWidth: '0',
        minHeight: '0'
      })
      : obj
  });

  const isRounded = computed(() =>
    props.rounded === true || props.fab === true || props.fabMini === true
  );

  const isActionable = computed(() =>
    props.disable !== true && props.loading !== true
  );

  const tabIndex = computed(() => (
    isActionable.value === true ? props.tabindex || 0 : -1
  ));

  const design = computed(() => getBtnDesign(props, 'standard'));

  const attributes = computed(() => {
    const acc = { tabindex: tabIndex.value };

    if (hasLink.value === true) {
      Object.assign(acc, linkAttrs.value);
    }
    else if (formTypes.includes(props.type) === true) {
      acc.type = props.type;
    }

    if (linkTag.value === 'a') {
      if (props.disable === true) {
        acc[ 'aria-disabled' ] = 'true';
      }
      else if (acc.href === void 0) {
        acc.role = 'button';
      }

      if (hasRouterLink.value !== true && mediaTypeRE.test(props.type) === true) {
        acc.type = props.type;
      }
    }
    else if (props.disable === true) {
      acc.disabled = '';
      acc[ 'aria-disabled' ] = 'true';
    }

    if (props.loading === true && props.percentage !== void 0) {
      Object.assign(acc, {
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': props.percentage
      });
    }

    return acc
  });

  const classes = computed(() => {
    let colors;

    if (props.color !== void 0) {
      if (props.flat === true || props.outline === true) {
        colors = `text-${ props.textColor || props.color }`;
      }
      else {
        colors = `bg-${ props.color } text-${ props.textColor || 'white' }`;
      }
    }
    else if (props.textColor) {
      colors = `text-${ props.textColor }`;
    }

    const shape = props.round === true
      ? 'round'
      : `rectangle${ isRounded.value === true ? ' q-btn--rounded' : (props.square === true ? ' q-btn--square' : '') }`;

    return `q-btn--${ design.value } q-btn--${ shape }`
      + (colors !== void 0 ? ' ' + colors : '')
      + (isActionable.value === true ? ' q-btn--actionable q-focusable q-hoverable' : (props.disable === true ? ' disabled' : ''))
      + (props.fab === true ? ' q-btn--fab' : (props.fabMini === true ? ' q-btn--fab-mini' : ''))
      + (props.noCaps === true ? ' q-btn--no-uppercase' : '')
      + (props.dense === true ? ' q-btn--dense' : '')
      + (props.stretch === true ? ' no-border-radius self-stretch' : '')
      + (props.glossy === true ? ' glossy' : '')
      + (props.square ? ' q-btn--square' : '')
  });

  const innerClasses = computed(() =>
    alignClass.value + (props.stack === true ? ' column' : ' row')
    + (props.noWrap === true ? ' no-wrap text-no-wrap' : '')
    + (props.loading === true ? ' q-btn__content--hidden' : '')
  );

  return {
    classes,
    style,
    innerClasses,
    attributes,
    hasLink,
    linkTag,
    navigateOnClick,
    isActionable
  }
}

const { passiveCapture } = listenOpts;

let
  touchTarget = null,
  keyboardTarget = null,
  mouseTarget = null;

const __nuxt_component_8 = createComponent({
  name: 'QBtn',

  props: {
    ...useBtnProps,

    percentage: Number,
    darkPercentage: Boolean,

    onTouchstart: [ Function, Array ]
  },

  emits: [ 'click', 'keydown', 'mousedown', 'keyup' ],

  setup (props, { slots, emit }) {
    const { proxy } = getCurrentInstance();

    const {
      classes, style, innerClasses,
      attributes,
      hasLink, linkTag, navigateOnClick,
      isActionable
    } = useBtn(props);

    const rootRef = ref(null);
    const blurTargetRef = ref(null);

    let localTouchTargetEl = null, avoidMouseRipple, mouseTimer = null;

    const hasLabel = computed(() =>
      props.label !== void 0 && props.label !== null && props.label !== ''
    );

    const ripple = computed(() => (
      props.disable === true || props.ripple === false
        ? false
        : {
            keyCodes: hasLink.value === true ? [ 13, 32 ] : [ 13 ],
            ...(props.ripple === true ? {} : props.ripple)
          }
    ));

    const rippleProps = computed(() => ({ center: props.round }));

    const percentageStyle = computed(() => {
      const val = Math.max(0, Math.min(100, props.percentage));
      return val > 0
        ? { transition: 'transform 0.6s', transform: `translateX(${ val - 100 }%)` }
        : {}
    });

    const onEvents = computed(() => {
      if (props.loading === true) {
        return {
          onMousedown: onLoadingEvt,
          onTouchstart: onLoadingEvt,
          onClick: onLoadingEvt,
          onKeydown: onLoadingEvt,
          onKeyup: onLoadingEvt
        }
      }

      if (isActionable.value === true) {
        const acc = {
          onClick,
          onKeydown,
          onMousedown
        };

        if (proxy.$q.platform.has.touch === true) {
          const suffix = props.onTouchstart !== void 0
            ? ''
            : 'Passive';

          acc[ `onTouchstart${ suffix }` ] = onTouchstart;
        }

        return acc
      }

      return {
        // needed; especially for disabled <a> tags
        onClick: stopAndPrevent
      }
    });

    const nodeProps = computed(() => ({
      ref: rootRef,
      class: 'q-btn q-btn-item non-selectable no-outline ' + classes.value,
      style: style.value,
      ...attributes.value,
      ...onEvents.value
    }));

    function onClick (e) {
      // is it already destroyed?
      if (rootRef.value === null) return

      if (e !== void 0) {
        if (e.defaultPrevented === true) return

        const el = document.activeElement;
        // focus button if it came from ENTER on form
        // prevent the new submit (already done)
        if (
          props.type === 'submit'
          && el !== document.body
          && rootRef.value.contains(el) === false
          // required for iOS and desktop Safari
          && el.contains(rootRef.value) === false
        ) {
          e.qAvoidFocus !== true && rootRef.value.focus();

          const onClickCleanup = () => {
            document.removeEventListener('keydown', stopAndPrevent, true);
            document.removeEventListener('keyup', onClickCleanup, passiveCapture);
            rootRef.value?.removeEventListener('blur', onClickCleanup, passiveCapture);
          };

          document.addEventListener('keydown', stopAndPrevent, true);
          document.addEventListener('keyup', onClickCleanup, passiveCapture);
          rootRef.value.addEventListener('blur', onClickCleanup, passiveCapture);
        }
      }

      navigateOnClick(e);
    }

    function onKeydown (e) {
      // is it already destroyed?
      if (rootRef.value === null) return

      emit('keydown', e);

      if (isKeyCode(e, [ 13, 32 ]) === true && keyboardTarget !== rootRef.value) {
        keyboardTarget !== null && cleanup();

        if (e.defaultPrevented !== true) {
          // focus external button if the focus helper was focused before
          e.qAvoidFocus !== true && rootRef.value.focus();

          keyboardTarget = rootRef.value;
          rootRef.value.classList.add('q-btn--active');
          document.addEventListener('keyup', onPressEnd, true);
          rootRef.value.addEventListener('blur', onPressEnd, passiveCapture);
        }

        stopAndPrevent(e);
      }
    }

    function onTouchstart (e) {
      // is it already destroyed?
      if (rootRef.value === null) return

      emit('touchstart', e);

      if (e.defaultPrevented === true) return

      if (touchTarget !== rootRef.value) {
        touchTarget !== null && cleanup();
        touchTarget = rootRef.value;

        localTouchTargetEl = e.target;
        localTouchTargetEl.addEventListener('touchcancel', onPressEnd, passiveCapture);
        localTouchTargetEl.addEventListener('touchend', onPressEnd, passiveCapture);
      }

      // avoid duplicated mousedown event
      // triggering another early ripple
      avoidMouseRipple = true;
      mouseTimer !== null && clearTimeout(mouseTimer);
      mouseTimer = setTimeout(() => {
        mouseTimer = null;
        avoidMouseRipple = false;
      }, 200);
    }

    function onMousedown (e) {
      // is it already destroyed?
      if (rootRef.value === null) return

      e.qSkipRipple = avoidMouseRipple === true;
      emit('mousedown', e);

      if (e.defaultPrevented !== true && mouseTarget !== rootRef.value) {
        mouseTarget !== null && cleanup();
        mouseTarget = rootRef.value;
        rootRef.value.classList.add('q-btn--active');
        document.addEventListener('mouseup', onPressEnd, passiveCapture);
      }
    }

    function onPressEnd (e) {
      // is it already destroyed?
      if (rootRef.value === null) return

      // needed for IE (because it emits blur when focusing button from focus helper)
      if (
        e?.type === 'blur'
        && document.activeElement === rootRef.value
      ) return

      if (e?.type === 'keyup') {
        if (keyboardTarget === rootRef.value && isKeyCode(e, [ 13, 32 ]) === true) {
          // for click trigger
          const evt = new MouseEvent('click', e);
          evt.qKeyEvent = true;
          e.defaultPrevented === true && prevent(evt);
          e.cancelBubble === true && stop(evt);
          rootRef.value.dispatchEvent(evt);

          stopAndPrevent(e);

          // for ripple
          e.qKeyEvent = true;
        }

        emit('keyup', e);
      }

      cleanup();
    }

    function cleanup (destroying) {
      const blurTarget = blurTargetRef.value;

      if (
        destroying !== true
        && (touchTarget === rootRef.value || mouseTarget === rootRef.value)
        && blurTarget !== null
        && blurTarget !== document.activeElement
      ) {
        blurTarget.setAttribute('tabindex', -1);
        blurTarget.focus();
      }

      if (touchTarget === rootRef.value) {
        if (localTouchTargetEl !== null) {
          localTouchTargetEl.removeEventListener('touchcancel', onPressEnd, passiveCapture);
          localTouchTargetEl.removeEventListener('touchend', onPressEnd, passiveCapture);
        }
        touchTarget = localTouchTargetEl = null;
      }

      if (mouseTarget === rootRef.value) {
        document.removeEventListener('mouseup', onPressEnd, passiveCapture);
        mouseTarget = null;
      }

      if (keyboardTarget === rootRef.value) {
        document.removeEventListener('keyup', onPressEnd, true);
        rootRef.value?.removeEventListener('blur', onPressEnd, passiveCapture);
        keyboardTarget = null;
      }

      rootRef.value?.classList.remove('q-btn--active');
    }

    function onLoadingEvt (evt) {
      stopAndPrevent(evt);
      evt.qSkipRipple = true;
    }

    onBeforeUnmount(() => {
      cleanup(true);
    });

    // expose public methods
    Object.assign(proxy, {
      click: e => {
        if (isActionable.value === true) {
          onClick(e);
        }
      }
    });

    return () => {
      let inner = [];

      props.icon !== void 0 && inner.push(
        h(__nuxt_component_4, {
          name: props.icon,
          left: props.stack !== true && hasLabel.value === true,
          role: 'img'
        })
      );

      hasLabel.value === true && inner.push(
        h('span', { class: 'block' }, [ props.label ])
      );

      inner = hMergeSlot(slots.default, inner);

      if (props.iconRight !== void 0 && props.round === false) {
        inner.push(
          h(__nuxt_component_4, {
            name: props.iconRight,
            right: props.stack !== true && hasLabel.value === true,
            role: 'img'
          })
        );
      }

      const child = [
        h('span', {
          class: 'q-focus-helper',
          ref: blurTargetRef
        })
      ];

      if (props.loading === true && props.percentage !== void 0) {
        child.push(
          h('span', {
            class: 'q-btn__progress absolute-full overflow-hidden' + (props.darkPercentage === true ? ' q-btn__progress--dark' : '')
          }, [
            h('span', {
              class: 'q-btn__progress-indicator fit block',
              style: percentageStyle.value
            })
          ])
        );
      }

      child.push(
        h('span', {
          class: 'q-btn__content text-center col items-center q-anchor--skip ' + innerClasses.value
        }, inner)
      );

      props.loading !== null && child.push(
        h(Transition, {
          name: 'q-transition--fade'
        }, () => (
          props.loading === true
            ? [
                h('span', {
                  key: 'loading',
                  class: 'absolute-full flex flex-center'
                }, slots.loading !== void 0 ? slots.loading() : [ h(QSpinner) ])
              ]
            : null
        ))
      );

      return withDirectives(
        h(
          linkTag.value,
          nodeProps.value,
          child
        ),
        [ [
          Ripple,
          ripple.value,
          void 0,
          rippleProps.value
        ] ]
      )
    }
  }
});

export { QSpinner as Q, Ripple as R, __nuxt_component_8 as _, getNormalizedVNodes as a, vmHasRouter as b, getParentProxy as c, useRouterLink as d, useAlignProps as e, useAlign as f, getSSRProps as g, isKeyCode as i, shouldIgnoreKey as s, useRouterLinkProps as u, vmIsDestroyed as v };
//# sourceMappingURL=QBtn.mjs.map

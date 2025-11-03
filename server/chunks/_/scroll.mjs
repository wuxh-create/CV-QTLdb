import { unref } from 'vue';

function css (element, css) {
  const style = element.style;

  for (const prop in css) {
    style[ prop ] = css[ prop ];
  }
}

// internal
function getElement (el) {
  if (el === void 0 || el === null) {
    return void 0
  }

  if (typeof el === 'string') {
    try {
      return document.querySelector(el) || void 0
    }
    catch (err) {
      return void 0
    }
  }

  const target = unref(el);
  if (target) {
    return target.$el || target
  }
}

// internal
function childHasFocus (el, focusedEl) {
  if (el === void 0 || el === null || el.contains(focusedEl) === true) {
    return true
  }

  for (let next = el.nextElementSibling; next !== null; next = next.nextElementSibling) {
    if (next.contains(focusedEl)) {
      return true
    }
  }

  return false
}

const scrollTargetProp = {} /* SSR does not know about Element */
  ;

const scrollTargets = []
  ;

function getScrollTarget (el, targetEl) {
  let target = getElement(targetEl);

  if (target === void 0) {
    if (el === void 0 || el === null) {
      return window
    }

    target = el.closest('.scroll,.scroll-y,.overflow-auto');
  }

  return scrollTargets.includes(target)
    ? window
    : target
}

function getVerticalScrollPosition (scrollTarget) {
  return scrollTarget === window
    ? window.pageYOffset || window.scrollY || document.body.scrollTop || 0
    : scrollTarget.scrollTop
}

function getHorizontalScrollPosition (scrollTarget) {
  return scrollTarget === window
    ? window.pageXOffset || window.scrollX || document.body.scrollLeft || 0
    : scrollTarget.scrollLeft
}

function animVerticalScrollTo (el, to, duration = 0 /* , prevTime */) {
  const prevTime = arguments[ 3 ] === void 0 ? performance.now() : arguments[ 3 ];
  const pos = getVerticalScrollPosition(el);

  if (duration <= 0) {
    if (pos !== to) {
      setScroll(el, to);
    }
    return
  }

  requestAnimationFrame(nowTime => {
    const frameTime = nowTime - prevTime;
    const newPos = pos + (to - pos) / Math.max(frameTime, duration) * frameTime;
    setScroll(el, newPos);
    if (newPos !== to) {
      animVerticalScrollTo(el, to, duration - frameTime, nowTime);
    }
  });
}

function setScroll (scrollTarget, offset) {
  if (scrollTarget === window) {
    window.scrollTo(window.pageXOffset || window.scrollX || document.body.scrollLeft || 0, offset);
    return
  }
  scrollTarget.scrollTop = offset;
}

function setVerticalScrollPosition (scrollTarget, offset, duration) {
  if (duration) {
    animVerticalScrollTo(scrollTarget, offset, duration);
    return
  }
  setScroll(scrollTarget, offset);
}

let size;
function getScrollbarWidth () {
  if (size !== undefined) {
    return size
  }

  const
    inner = document.createElement('p'),
    outer = document.createElement('div');

  css(inner, {
    width: '100%',
    height: '200px'
  });
  css(outer, {
    position: 'absolute',
    top: '0px',
    left: '0px',
    visibility: 'hidden',
    width: '200px',
    height: '150px',
    overflow: 'hidden'
  });

  outer.appendChild(inner);

  document.body.appendChild(outer);

  const w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  let w2 = inner.offsetWidth;

  if (w1 === w2) {
    w2 = outer.clientWidth;
  }

  outer.remove();
  size = w1 - w2;

  return size
}

function hasScrollbar (el, onY = true) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) {
    return false
  }

  return onY
    ? (
        el.scrollHeight > el.clientHeight && (
          el.classList.contains('scroll')
          || el.classList.contains('overflow-auto')
          || [ 'auto', 'scroll' ].includes(window.getComputedStyle(el)[ 'overflow-y' ])
        )
      )
    : (
        el.scrollWidth > el.clientWidth && (
          el.classList.contains('scroll')
          || el.classList.contains('overflow-auto')
          || [ 'auto', 'scroll' ].includes(window.getComputedStyle(el)[ 'overflow-x' ])
        )
      )
}

export { getVerticalScrollPosition as a, getScrollTarget as b, childHasFocus as c, getScrollbarWidth as d, setVerticalScrollPosition as e, getHorizontalScrollPosition as g, hasScrollbar as h, scrollTargetProp as s };
//# sourceMappingURL=scroll.mjs.map

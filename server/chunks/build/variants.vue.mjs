import { ref, watch, nextTick, computed, getCurrentInstance, onBeforeUnmount, onMounted, h, defineComponent, reactive, mergeProps, withCtx, createVNode, createTextVNode, createBlock, openBlock, Fragment, renderList, unref, toDisplayString, withDirectives, vShow, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { a as queryVariant, q as queryVariantHints } from './query_Variants.mjs';
import lodash from 'lodash';
import { useRoute } from 'vue-router';
import { g as createComponent, o as stop, f as useQuasar } from './server.mjs';
import { _ as __nuxt_component_0 } from '../_/QPage.mjs';
import { _ as __nuxt_component_2 } from '../_/QCard.mjs';
import { _ as __nuxt_component_3 } from '../_/QCardSection.mjs';
import { u as useFieldEmits, h as useFieldProps, i as fieldValueIsFilled, j as useFieldState, k as useKeyComposition, l as useField, m as injectProp, a as __nuxt_component_4, b as __nuxt_component_5, c as __nuxt_component_9, d as __nuxt_component_13, e as __nuxt_component_11, f as __nuxt_component_12, g as __nuxt_component_10 } from '../_/QInnerLoading.mjs';
import { j as addFocusFn, _ as __nuxt_component_6, a as __nuxt_component_7 } from '../_/QList.mjs';
import { s as shouldIgnoreKey, _ as __nuxt_component_8 } from '../_/QBtn.mjs';
import { c as useFormProps, d as useFormInputNameAttr } from '../_/use-checkbox.mjs';
import '../nitro/nitro.mjs';
import 'mongoose';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'consola';
import 'consola/utils';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import '../_/render.mjs';
import '../_/use-dark.mjs';
import '../_/QIcon.mjs';
import '../_/QSeparator.mjs';
import '../_/scroll.mjs';
import '../_/uid.mjs';

// leave NAMED_MASKS at top of file (code referenced from docs)
const NAMED_MASKS = {
  date: '####/##/##',
  datetime: '####/##/## ##:##',
  time: '##:##',
  fulltime: '##:##:##',
  phone: '(###) ### - ####',
  card: '#### #### #### ####'
};

const TOKENS = {
  '#': { pattern: '[\\d]', negate: '[^\\d]' },

  S: { pattern: '[a-zA-Z]', negate: '[^a-zA-Z]' },
  N: { pattern: '[0-9a-zA-Z]', negate: '[^0-9a-zA-Z]' },

  A: { pattern: '[a-zA-Z]', negate: '[^a-zA-Z]', transform: v => v.toLocaleUpperCase() },
  a: { pattern: '[a-zA-Z]', negate: '[^a-zA-Z]', transform: v => v.toLocaleLowerCase() },

  X: { pattern: '[0-9a-zA-Z]', negate: '[^0-9a-zA-Z]', transform: v => v.toLocaleUpperCase() },
  x: { pattern: '[0-9a-zA-Z]', negate: '[^0-9a-zA-Z]', transform: v => v.toLocaleLowerCase() }
};

const KEYS = Object.keys(TOKENS);
KEYS.forEach(key => {
  TOKENS[ key ].regex = new RegExp(TOKENS[ key ].pattern);
});

const
  tokenRegexMask = new RegExp('\\\\([^.*+?^${}()|([\\]])|([.*+?^${}()|[\\]])|([' + KEYS.join('') + '])|(.)', 'g'),
  escRegex = /[.*+?^${}()|[\]\\]/g;

const MARKER = String.fromCharCode(1);

const useMaskProps = {
  mask: String,
  reverseFillMask: Boolean,
  fillMask: [ Boolean, String ],
  unmaskedValue: Boolean
};

function useMask (props, emit, emitValue, inputRef) {
  let maskMarked, maskReplaced, computedMask, computedUnmask, pastedTextStart, selectionAnchor;

  const hasMask = ref(null);
  const innerValue = ref(getInitialMaskedValue());

  function getIsTypeText () {
    return props.autogrow === true
      || [ 'textarea', 'text', 'search', 'url', 'tel', 'password' ].includes(props.type)
  }

  watch(() => props.type + props.autogrow, updateMaskInternals);

  watch(() => props.mask, v => {
    if (v !== void 0) {
      updateMaskValue(innerValue.value, true);
    }
    else {
      const val = unmaskValue(innerValue.value);
      updateMaskInternals();
      props.modelValue !== val && emit('update:modelValue', val);
    }
  });

  watch(() => props.fillMask + props.reverseFillMask, () => {
    hasMask.value === true && updateMaskValue(innerValue.value, true);
  });

  watch(() => props.unmaskedValue, () => {
    hasMask.value === true && updateMaskValue(innerValue.value);
  });

  function getInitialMaskedValue () {
    updateMaskInternals();

    if (hasMask.value === true) {
      const masked = maskValue(unmaskValue(props.modelValue));

      return props.fillMask !== false
        ? fillWithMask(masked)
        : masked
    }

    return props.modelValue
  }

  function getPaddedMaskMarked (size) {
    if (size < maskMarked.length) {
      return maskMarked.slice(-size)
    }

    let pad = '', localMaskMarked = maskMarked;
    const padPos = localMaskMarked.indexOf(MARKER);

    if (padPos !== -1) {
      for (let i = size - localMaskMarked.length; i > 0; i--) {
        pad += MARKER;
      }

      localMaskMarked = localMaskMarked.slice(0, padPos) + pad + localMaskMarked.slice(padPos);
    }

    return localMaskMarked
  }

  function updateMaskInternals () {
    hasMask.value = props.mask !== void 0
      && props.mask.length !== 0
      && getIsTypeText();

    if (hasMask.value === false) {
      computedUnmask = void 0;
      maskMarked = '';
      maskReplaced = '';
      return
    }

    const
      localComputedMask = NAMED_MASKS[ props.mask ] === void 0
        ? props.mask
        : NAMED_MASKS[ props.mask ],
      fillChar = typeof props.fillMask === 'string' && props.fillMask.length !== 0
        ? props.fillMask.slice(0, 1)
        : '_',
      fillCharEscaped = fillChar.replace(escRegex, '\\$&'),
      unmask = [],
      extract = [],
      mask = [];

    let
      firstMatch = props.reverseFillMask === true,
      unmaskChar = '',
      negateChar = '';

    localComputedMask.replace(tokenRegexMask, (_, char1, esc, token, char2) => {
      if (token !== void 0) {
        const c = TOKENS[ token ];
        mask.push(c);
        negateChar = c.negate;
        if (firstMatch === true) {
          extract.push('(?:' + negateChar + '+)?(' + c.pattern + '+)?(?:' + negateChar + '+)?(' + c.pattern + '+)?');
          firstMatch = false;
        }
        extract.push('(?:' + negateChar + '+)?(' + c.pattern + ')?');
      }
      else if (esc !== void 0) {
        unmaskChar = '\\' + (esc === '\\' ? '' : esc);
        mask.push(esc);
        unmask.push('([^' + unmaskChar + ']+)?' + unmaskChar + '?');
      }
      else {
        const c = char1 !== void 0 ? char1 : char2;
        unmaskChar = c === '\\' ? '\\\\\\\\' : c.replace(escRegex, '\\\\$&');
        mask.push(c);
        unmask.push('([^' + unmaskChar + ']+)?' + unmaskChar + '?');
      }
    });

    const
      unmaskMatcher = new RegExp(
        '^'
        + unmask.join('')
        + '(' + (unmaskChar === '' ? '.' : '[^' + unmaskChar + ']') + '+)?'
        + (unmaskChar === '' ? '' : '[' + unmaskChar + ']*') + '$'
      ),
      extractLast = extract.length - 1,
      extractMatcher = extract.map((re, index) => {
        if (index === 0 && props.reverseFillMask === true) {
          return new RegExp('^' + fillCharEscaped + '*' + re)
        }
        else if (index === extractLast) {
          return new RegExp(
            '^' + re
            + '(' + (negateChar === '' ? '.' : negateChar) + '+)?'
            + (props.reverseFillMask === true ? '$' : fillCharEscaped + '*')
          )
        }

        return new RegExp('^' + re)
      });

    computedMask = mask;
    computedUnmask = val => {
      const unmaskMatch = unmaskMatcher.exec(props.reverseFillMask === true ? val : val.slice(0, mask.length + 1));
      if (unmaskMatch !== null) {
        val = unmaskMatch.slice(1).join('');
      }

      const
        extractMatch = [],
        extractMatcherLength = extractMatcher.length;

      for (let i = 0, str = val; i < extractMatcherLength; i++) {
        const m = extractMatcher[ i ].exec(str);

        if (m === null) {
          break
        }

        str = str.slice(m.shift().length);
        extractMatch.push(...m);
      }
      if (extractMatch.length !== 0) {
        return extractMatch.join('')
      }

      return val
    };
    maskMarked = mask.map(v => (typeof v === 'string' ? v : MARKER)).join('');
    maskReplaced = maskMarked.split(MARKER).join(fillChar);
  }

  function updateMaskValue (rawVal, updateMaskInternalsFlag, inputType) {
    const
      inp = inputRef.value,
      end = inp.selectionEnd,
      endReverse = inp.value.length - end,
      unmasked = unmaskValue(rawVal);

    // Update here so unmask uses the original fillChar
    updateMaskInternalsFlag === true && updateMaskInternals();

    const
      preMasked = maskValue(unmasked),
      masked = props.fillMask !== false
        ? fillWithMask(preMasked)
        : preMasked,
      changed = innerValue.value !== masked;

    // We want to avoid "flickering" so we set value immediately
    inp.value !== masked && (inp.value = masked);

    changed === true && (innerValue.value = masked);

    document.activeElement === inp && nextTick(() => {
      if (masked === maskReplaced) {
        const cursor = props.reverseFillMask === true ? maskReplaced.length : 0;
        inp.setSelectionRange(cursor, cursor, 'forward');
        return
      }

      if (inputType === 'insertFromPaste' && props.reverseFillMask !== true) {
        const maxEnd = inp.selectionEnd;
        let cursor = end - 1;
        // each non-marker char means we move once to right
        for (let i = pastedTextStart; i <= cursor && i < maxEnd; i++) {
          if (maskMarked[ i ] !== MARKER) {
            cursor++;
          }
        }

        moveCursor.right(inp, cursor);
        return
      }

      if ([ 'deleteContentBackward', 'deleteContentForward' ].indexOf(inputType) !== -1) {
        const cursor = props.reverseFillMask === true
          ? (
              end === 0
                ? (masked.length > preMasked.length ? 1 : 0)
                : Math.max(0, masked.length - (masked === maskReplaced ? 0 : Math.min(preMasked.length, endReverse) + 1)) + 1
            )
          : end;

        inp.setSelectionRange(cursor, cursor, 'forward');
        return
      }

      if (props.reverseFillMask === true) {
        if (changed === true) {
          const cursor = Math.max(0, masked.length - (masked === maskReplaced ? 0 : Math.min(preMasked.length, endReverse + 1)));

          if (cursor === 1 && end === 1) {
            inp.setSelectionRange(cursor, cursor, 'forward');
          }
          else {
            moveCursor.rightReverse(inp, cursor);
          }
        }
        else {
          const cursor = masked.length - endReverse;
          inp.setSelectionRange(cursor, cursor, 'backward');
        }
      }
      else {
        if (changed === true) {
          const cursor = Math.max(0, maskMarked.indexOf(MARKER), Math.min(preMasked.length, end) - 1);
          moveCursor.right(inp, cursor);
        }
        else {
          const cursor = end - 1;
          moveCursor.right(inp, cursor);
        }
      }
    });

    const val = props.unmaskedValue === true
      ? unmaskValue(masked)
      : masked;

    if (
      String(props.modelValue) !== val
      && (props.modelValue !== null || val !== '')
    ) {
      emitValue(val, true);
    }
  }

  function moveCursorForPaste (inp, start, end) {
    const preMasked = maskValue(unmaskValue(inp.value));

    start = Math.max(0, maskMarked.indexOf(MARKER), Math.min(preMasked.length, start));
    pastedTextStart = start;

    inp.setSelectionRange(start, end, 'forward');
  }

  const moveCursor = {
    left (inp, cursor) {
      const noMarkBefore = maskMarked.slice(cursor - 1).indexOf(MARKER) === -1;
      let i = Math.max(0, cursor - 1);

      for (; i >= 0; i--) {
        if (maskMarked[ i ] === MARKER) {
          cursor = i;
          noMarkBefore === true && cursor++;
          break
        }
      }

      if (
        i < 0
        && maskMarked[ cursor ] !== void 0
        && maskMarked[ cursor ] !== MARKER
      ) {
        return moveCursor.right(inp, 0)
      }

      cursor >= 0 && inp.setSelectionRange(cursor, cursor, 'backward');
    },

    right (inp, cursor) {
      const limit = inp.value.length;
      let i = Math.min(limit, cursor + 1);

      for (; i <= limit; i++) {
        if (maskMarked[ i ] === MARKER) {
          cursor = i;
          break
        }
        else if (maskMarked[ i - 1 ] === MARKER) {
          cursor = i;
        }
      }

      if (
        i > limit
        && maskMarked[ cursor - 1 ] !== void 0
        && maskMarked[ cursor - 1 ] !== MARKER
      ) {
        return moveCursor.left(inp, limit)
      }

      inp.setSelectionRange(cursor, cursor, 'forward');
    },

    leftReverse (inp, cursor) {
      const
        localMaskMarked = getPaddedMaskMarked(inp.value.length);
      let i = Math.max(0, cursor - 1);

      for (; i >= 0; i--) {
        if (localMaskMarked[ i - 1 ] === MARKER) {
          cursor = i;
          break
        }
        else if (localMaskMarked[ i ] === MARKER) {
          cursor = i;
          if (i === 0) {
            break
          }
        }
      }

      if (
        i < 0
        && localMaskMarked[ cursor ] !== void 0
        && localMaskMarked[ cursor ] !== MARKER
      ) {
        return moveCursor.rightReverse(inp, 0)
      }

      cursor >= 0 && inp.setSelectionRange(cursor, cursor, 'backward');
    },

    rightReverse (inp, cursor) {
      const
        limit = inp.value.length,
        localMaskMarked = getPaddedMaskMarked(limit),
        noMarkBefore = localMaskMarked.slice(0, cursor + 1).indexOf(MARKER) === -1;
      let i = Math.min(limit, cursor + 1);

      for (; i <= limit; i++) {
        if (localMaskMarked[ i - 1 ] === MARKER) {
          cursor = i;
          cursor > 0 && noMarkBefore === true && cursor--;
          break
        }
      }

      if (
        i > limit
        && localMaskMarked[ cursor - 1 ] !== void 0
        && localMaskMarked[ cursor - 1 ] !== MARKER
      ) {
        return moveCursor.leftReverse(inp, limit)
      }

      inp.setSelectionRange(cursor, cursor, 'forward');
    }
  };

  function onMaskedClick (e) {
    emit('click', e);

    selectionAnchor = void 0;
  }

  function onMaskedKeydown (e) {
    emit('keydown', e);

    if (
      shouldIgnoreKey(e) === true
      || e.altKey === true // let browser handle these
    ) return

    const
      inp = inputRef.value,
      start = inp.selectionStart,
      end = inp.selectionEnd;

    if (!e.shiftKey) {
      selectionAnchor = void 0;
    }

    if (e.keyCode === 37 || e.keyCode === 39) { // Left / Right
      if (e.shiftKey && selectionAnchor === void 0) {
        selectionAnchor = inp.selectionDirection === 'forward' ? start : end;
      }

      const fn = moveCursor[ (e.keyCode === 39 ? 'right' : 'left') + (props.reverseFillMask === true ? 'Reverse' : '') ];

      e.preventDefault();
      fn(inp, selectionAnchor === start ? end : start);

      if (e.shiftKey) {
        const cursor = inp.selectionStart;
        inp.setSelectionRange(Math.min(selectionAnchor, cursor), Math.max(selectionAnchor, cursor), 'forward');
      }
    }
    else if (
      e.keyCode === 8 // Backspace
      && props.reverseFillMask !== true
      && start === end
    ) {
      moveCursor.left(inp, start);
      inp.setSelectionRange(inp.selectionStart, end, 'backward');
    }
    else if (
      e.keyCode === 46 // Delete
      && props.reverseFillMask === true
      && start === end
    ) {
      moveCursor.rightReverse(inp, end);
      inp.setSelectionRange(start, inp.selectionEnd, 'forward');
    }
  }

  function maskValue (val) {
    if (val === void 0 || val === null || val === '') { return '' }

    if (props.reverseFillMask === true) {
      return maskValueReverse(val)
    }

    const mask = computedMask;

    let valIndex = 0, output = '';

    for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
      const
        valChar = val[ valIndex ],
        maskDef = mask[ maskIndex ];

      if (typeof maskDef === 'string') {
        output += maskDef;
        valChar === maskDef && valIndex++;
      }
      else if (valChar !== void 0 && maskDef.regex.test(valChar)) {
        output += maskDef.transform !== void 0
          ? maskDef.transform(valChar)
          : valChar;
        valIndex++;
      }
      else {
        return output
      }
    }

    return output
  }

  function maskValueReverse (val) {
    const
      mask = computedMask,
      firstTokenIndex = maskMarked.indexOf(MARKER);

    let valIndex = val.length - 1, output = '';

    for (let maskIndex = mask.length - 1; maskIndex >= 0 && valIndex !== -1; maskIndex--) {
      const maskDef = mask[ maskIndex ];

      let valChar = val[ valIndex ];

      if (typeof maskDef === 'string') {
        output = maskDef + output;
        valChar === maskDef && valIndex--;
      }
      else if (valChar !== void 0 && maskDef.regex.test(valChar)) {
        do {
          output = (maskDef.transform !== void 0 ? maskDef.transform(valChar) : valChar) + output;
          valIndex--;
          valChar = val[ valIndex ];
        // eslint-disable-next-line no-unmodified-loop-condition
        } while (firstTokenIndex === maskIndex && valChar !== void 0 && maskDef.regex.test(valChar))
      }
      else {
        return output
      }
    }

    return output
  }

  function unmaskValue (val) {
    return typeof val !== 'string' || computedUnmask === void 0
      ? (typeof val === 'number' ? computedUnmask('' + val) : val)
      : computedUnmask(val)
  }

  function fillWithMask (val) {
    if (maskReplaced.length - val.length <= 0) {
      return val
    }

    return props.reverseFillMask === true && val.length !== 0
      ? maskReplaced.slice(0, -val.length) + val
      : val + maskReplaced.slice(val.length)
  }

  return {
    innerValue,
    hasMask,
    moveCursorForPaste,
    updateMaskValue,
    onMaskedKeydown,
    onMaskedClick
  }
}

function useFileFormDomProps (props, typeGuard) {
  function getFormDomProps () {
    const model = props.modelValue;

    try {
      const dt = 'DataTransfer' in window
        ? new DataTransfer()
        : ('ClipboardEvent' in window
            ? new ClipboardEvent('').clipboardData
            : void 0
          );

      if (Object(model) === model) {
        ('length' in model
          ? Array.from(model)
          : [ model ]
        ).forEach(file => {
          dt.items.add(file);
        });
      }

      return {
        files: dt.files
      }
    }
    catch (e) {
      return {
        files: void 0
      }
    }
  }

  return computed(() => {
      if (props.type !== 'file') return
      return getFormDomProps()
    })
    
}

const __nuxt_component_7$1 = createComponent({
  name: 'QInput',

  inheritAttrs: false,

  props: {
    ...useFieldProps,
    ...useMaskProps,
    ...useFormProps,

    // override of useFieldProps > modelValue
    modelValue: {} // SSR does not know about FileList
      ,

    shadowText: String,

    type: {
      type: String,
      default: 'text'
    },

    debounce: [ String, Number ],

    autogrow: Boolean, // makes a textarea

    inputClass: [ Array, String, Object ],
    inputStyle: [ Array, String, Object ]
  },

  emits: [
    ...useFieldEmits,
    'paste', 'change',
    'keydown', 'click', 'animationend'
  ],

  setup (props, { emit, attrs }) {
    const { proxy } = getCurrentInstance();
    const { $q } = proxy;

    const temp = {};
    let emitCachedValue = NaN, typedNumber, stopValueWatcher, emitTimer = null, emitValueFn;

    const inputRef = ref(null);
    const nameProp = useFormInputNameAttr(props);

    const {
      innerValue,
      hasMask,
      moveCursorForPaste,
      updateMaskValue,
      onMaskedKeydown,
      onMaskedClick
    } = useMask(props, emit, emitValue, inputRef);

    const formDomProps = useFileFormDomProps(props);
    const hasValue = computed(() => fieldValueIsFilled(innerValue.value));

    const onComposition = useKeyComposition(onInput);

    const state = useFieldState({ changeEvent: true });

    const isTextarea = computed(() =>
      props.type === 'textarea' || props.autogrow === true
    );

    const isTypeText = computed(() =>
      isTextarea.value === true
      || [ 'text', 'search', 'url', 'tel', 'password' ].includes(props.type)
    );

    const onEvents = computed(() => {
      const evt = {
        ...state.splitAttrs.listeners.value,
        onInput,
        onPaste,
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        onChange,
        onBlur: onFinishEditing,
        onFocus: stop
      };

      evt.onCompositionstart = evt.onCompositionupdate = evt.onCompositionend = onComposition;

      if (hasMask.value === true) {
        evt.onKeydown = onMaskedKeydown;
        // reset selection anchor on pointer selection
        evt.onClick = onMaskedClick;
      }

      if (props.autogrow === true) {
        evt.onAnimationend = onAnimationend;
      }

      return evt
    });

    const inputAttrs = computed(() => {
      const attrs = {
        tabindex: 0,
        'data-autofocus': props.autofocus === true || void 0,
        rows: props.type === 'textarea' ? 6 : void 0,
        'aria-label': props.label,
        name: nameProp.value,
        ...state.splitAttrs.attributes.value,
        id: state.targetUid.value,
        maxlength: props.maxlength,
        disabled: props.disable === true,
        readonly: props.readonly === true
      };

      if (isTextarea.value === false) {
        attrs.type = props.type;
      }

      if (props.autogrow === true) {
        attrs.rows = 1;
      }

      return attrs
    });

    // some browsers lose the native input value
    // so we need to reattach it dynamically
    // (like type="password" <-> type="text"; see #12078)
    watch(() => props.type, () => {
      if (inputRef.value) {
        inputRef.value.value = props.modelValue;
      }
    });

    watch(() => props.modelValue, v => {
      if (hasMask.value === true) {
        if (stopValueWatcher === true) {
          stopValueWatcher = false;
          if (String(v) === emitCachedValue) return
        }

        updateMaskValue(v);
      }
      else if (innerValue.value !== v) {
        innerValue.value = v;

        if (
          props.type === 'number'
          && temp.hasOwnProperty('value') === true
        ) {
          if (typedNumber === true) {
            typedNumber = false;
          }
          else {
            delete temp.value;
          }
        }
      }

      // textarea only
      props.autogrow === true && nextTick(adjustHeight);
    });

    watch(() => props.autogrow, val => {
      // textarea only
      if (val === true) {
        nextTick(adjustHeight);
      }
      // if it has a number of rows set respect it
      else if (inputRef.value !== null && attrs.rows > 0) {
        inputRef.value.style.height = 'auto';
      }
    });

    watch(() => props.dense, () => {
      props.autogrow === true && nextTick(adjustHeight);
    });

    function focus () {
      addFocusFn(() => {
        const el = document.activeElement;
        if (
          inputRef.value !== null
          && inputRef.value !== el
          && (el === null || el.id !== state.targetUid.value)
        ) {
          inputRef.value.focus({ preventScroll: true });
        }
      });
    }

    function select () {
      inputRef.value?.select();
    }

    function onPaste (e) {
      if (hasMask.value === true && props.reverseFillMask !== true) {
        const inp = e.target;
        moveCursorForPaste(inp, inp.selectionStart, inp.selectionEnd);
      }

      emit('paste', e);
    }

    function onInput (e) {
      if (!e || !e.target) return

      if (props.type === 'file') {
        emit('update:modelValue', e.target.files);
        return
      }

      const val = e.target.value;

      if (e.target.qComposing === true) {
        temp.value = val;
        return
      }

      if (hasMask.value === true) {
        updateMaskValue(val, false, e.inputType);
      }
      else {
        emitValue(val);

        if (isTypeText.value === true && e.target === document.activeElement) {
          const { selectionStart, selectionEnd } = e.target;

          if (selectionStart !== void 0 && selectionEnd !== void 0) {
            nextTick(() => {
              if (e.target === document.activeElement && val.indexOf(e.target.value) === 0) {
                e.target.setSelectionRange(selectionStart, selectionEnd);
              }
            });
          }
        }
      }

      // we need to trigger it immediately too,
      // to avoid "flickering"
      props.autogrow === true && adjustHeight();
    }

    function onAnimationend (e) {
      emit('animationend', e);
      adjustHeight();
    }

    function emitValue (val, stopWatcher) {
      emitValueFn = () => {
        emitTimer = null;

        if (
          props.type !== 'number'
          && temp.hasOwnProperty('value') === true
        ) {
          delete temp.value;
        }

        if (props.modelValue !== val && emitCachedValue !== val) {
          emitCachedValue = val;

          stopWatcher === true && (stopValueWatcher = true);
          emit('update:modelValue', val);

          nextTick(() => {
            emitCachedValue === val && (emitCachedValue = NaN);
          });
        }

        emitValueFn = void 0;
      };

      if (props.type === 'number') {
        typedNumber = true;
        temp.value = val;
      }

      if (props.debounce !== void 0) {
        emitTimer !== null && clearTimeout(emitTimer);
        temp.value = val;
        emitTimer = setTimeout(emitValueFn, props.debounce);
      }
      else {
        emitValueFn();
      }
    }

    // textarea only
    function adjustHeight () {
      requestAnimationFrame(() => {
        const inp = inputRef.value;
        if (inp !== null) {
          const parentStyle = inp.parentNode.style;
          // chrome does not keep scroll #15498
          const { scrollTop } = inp;
          // chrome calculates a smaller scrollHeight when in a .column container
          const { overflowY, maxHeight } = $q.platform.is.firefox === true
            ? {}
            : window.getComputedStyle(inp);
          // on firefox or if overflowY is specified as scroll #14263, #14344
          // we don't touch overflow
          // firefox is not so bad in the end
          const changeOverflow = overflowY !== void 0 && overflowY !== 'scroll';

          // reset height of textarea to a small size to detect the real height
          // but keep the total control size the same
          changeOverflow === true && (inp.style.overflowY = 'hidden');
          parentStyle.marginBottom = (inp.scrollHeight - 1) + 'px';
          inp.style.height = '1px';

          inp.style.height = inp.scrollHeight + 'px';
          // we should allow scrollbars only
          // if there is maxHeight and content is taller than maxHeight
          changeOverflow === true && (inp.style.overflowY = parseInt(maxHeight, 10) < inp.scrollHeight ? 'auto' : 'hidden');
          parentStyle.marginBottom = '';
          inp.scrollTop = scrollTop;
        }
      });
    }

    function onChange (e) {
      onComposition(e);

      if (emitTimer !== null) {
        clearTimeout(emitTimer);
        emitTimer = null;
      }

      emitValueFn?.();

      emit('change', e.target.value);
    }

    function onFinishEditing (e) {
      e !== void 0 && stop(e);

      if (emitTimer !== null) {
        clearTimeout(emitTimer);
        emitTimer = null;
      }

      emitValueFn?.();

      typedNumber = false;
      stopValueWatcher = false;
      delete temp.value;

      // we need to use setTimeout instead of this.$nextTick
      // to avoid a bug where focusout is not emitted for type date/time/week/...
      props.type !== 'file' && setTimeout(() => {
        if (inputRef.value !== null) {
          inputRef.value.value = innerValue.value !== void 0 ? innerValue.value : '';
        }
      });
    }

    function getCurValue () {
      return temp.hasOwnProperty('value') === true
        ? temp.value
        : (innerValue.value !== void 0 ? innerValue.value : '')
    }

    onBeforeUnmount(() => {
      onFinishEditing();
    });

    onMounted(() => {
      // textarea only
      props.autogrow === true && adjustHeight();
    });

    Object.assign(state, {
      innerValue,

      fieldClass: computed(() =>
        `q-${ isTextarea.value === true ? 'textarea' : 'input' }`
        + (props.autogrow === true ? ' q-textarea--autogrow' : '')
      ),

      hasShadow: computed(() =>
        props.type !== 'file'
        && typeof props.shadowText === 'string'
        && props.shadowText.length !== 0
      ),

      inputRef,

      emitValue,

      hasValue,

      floatingLabel: computed(() =>
        (
          hasValue.value === true
          && (props.type !== 'number' || isNaN(innerValue.value) === false)
        )
        || fieldValueIsFilled(props.displayValue)
      ),

      getControl: () => {
        return h(isTextarea.value === true ? 'textarea' : 'input', {
          ref: inputRef,
          class: [
            'q-field__native q-placeholder',
            props.inputClass
          ],
          style: props.inputStyle,
          ...inputAttrs.value,
          ...onEvents.value,
          ...(
            props.type !== 'file'
              ? { value: getCurValue() }
              : formDomProps.value
          )
        })
      },

      getShadowControl: () => {
        return h('div', {
          class: 'q-field__native q-field__shadow absolute-bottom no-pointer-events'
            + (isTextarea.value === true ? '' : ' text-no-wrap')
        }, [
          h('span', { class: 'invisible' }, getCurValue()),
          h('span', props.shadowText)
        ])
      }
    });

    const renderFn = useField(state);

    // expose public methods
    Object.assign(proxy, {
      focus,
      select,
      getNativeElement: () => inputRef.value // deprecated
    });

    injectProp(proxy, 'nativeEl', () => inputRef.value);

    return renderFn
  }
});

const model_variant = [
  {
    name: "Variant_type",
    label: "Variant_type",
    field: "Variant_type",
    sortable: false,
    align: "center"
  },
  {
    name: "Variant_ID",
    label: "Variant_ID",
    field: "Variant_ID",
    sortable: false,
    align: "center"
  },
  {
    name: "Chromosome",
    label: "Chromosome",
    field: "Chromosome",
    sortable: true,
    align: "center"
  },
  {
    name: "Start",
    label: "Start",
    field: "Start",
    sortable: false,
    align: "center"
  },
  {
    name: "End",
    label: "End",
    field: "End",
    sortable: false,
    align: "center"
  },
  {
    name: "Position",
    label: "Position",
    field: "Position",
    sortable: false,
    align: "center"
  },
  {
    name: "Ref",
    label: "Ref",
    field: "Ref",
    sortable: false,
    align: "center"
  },
  {
    name: "Alt",
    label: "Alt",
    field: "Alt",
    sortable: false,
    align: "center"
  },
  {
    name: "MAF",
    label: "MAF",
    field: "MAF",
    sortable: true,
    align: "center",
    format: (val, _row) => Number(val).toFixed(3)
  }
];

const isValidRange = (s) => {
  if (s === "" || s === null) {
    return true;
  } else if (!s.match(/^(chr)?\d+:\d+-\d+$/)) {
    return false;
  } else {
    const match = s.match(/^chr(\d+):(\d+)-(\d+)$/);
    if (!match) {
      return false;
    }
    const [chr, start, end] = match.slice(1, 4).map((v) => Number(v));
    const valid = chr in lodash.range(1, 23) && start > 0 && end > 0 && end > start;
    return valid ? valid : "Invalid genimic range";
  }
};

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "variants",
  __ssrInlineRender: true,
  setup(__props) {
    const $q = useQuasar();
    const small_screen = computed(() => $q.screen.lt.sm);
    useRoute();
    const query_variant_type = ref(null);
    const query_variant_id = ref(null);
    const query_range = ref(null);
    const current_show = reactive({
      variant_type: null,
      variant_id: null,
      variant_range: null
    });
    const data_stat = reactive({
      SNP: 0,
      MNV: 0,
      InDel: 0,
      SV: 0
    });
    const variant_type_options = ["SNP", "MNV", "InDel", "SV"];
    const variant_id_options = ref([]);
    const ref_variant_id = ref(null);
    const onTextInput = (val, update, abort) => {
      update(() => {
        if (val === "") {
          variant_id_options.value = [];
        } else {
          queryVariantHints({
            variant_type: query_variant_type.value,
            input: val
          }).then((response) => {
            const formatResponse = response;
            if (formatResponse.data.length) {
              variant_id_options.value = formatResponse.data;
            } else {
              variant_id_options.value = [val];
            }
            variant_id_options.value = formatResponse.data;
            if (val !== "" && ref_variant_id.value.options.length) {
              ref_variant_id.value.setOptionIndex(-1);
              ref_variant_id.value.moveOptionSelection(1, true);
            }
          }).catch((error) => {
            variant_id_options.value = [val];
          });
        }
      });
      abort(() => {
      });
    };
    const query_range_rules = [isValidRange];
    const formImputed = computed(() => {
      const variantTypeNotEmpty = Boolean(query_variant_type.value);
      const rangeNotEmpty = Boolean(query_range.value);
      return variantTypeNotEmpty || rangeNotEmpty;
    });
    const examples = [
      {
        label: "example1",
        variantType: "SNP",
        variantRange: "chr1:790000-890000",
        variantID: null,
        disable: false
      },
      {
        label: "example2",
        variantType: "MNV",
        variantRange: "chr1:50000-800000",
        variantID: null,
        disable: false
      },
      {
        label: "example3",
        variantType: "InDel",
        variantRange: null,
        variantID: "chr1_814583_T_TAA",
        disable: false
      }
    ];
    const set_example = (example_obj) => {
      query_variant_type.value = example_obj.variantType;
      query_range.value = example_obj.variantRange;
      query_variant_id.value = example_obj.variantID;
    };
    const table_visible = ref(false);
    const table_data = ref([]);
    const table_loading = ref(false);
    const table_pagination = ref({
      page: 1,
      rowsPerPage: 15,
      rowsNumber: 0,
      sortBy: "Chromosome",
      descending: false
    });
    const on_table_request = (props) => {
      table_loading.value = true;
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      queryVariant({
        variant_type: current_show.variant_type,
        variant_id: current_show.variant_id,
        range: current_show.variant_range,
        page,
        pageSize: rowsPerPage,
        sortBy,
        order: descending ? -1 : 1
      }).then((response) => {
        const formatResponse = response;
        table_data.value = formatResponse.data;
        table_pagination.value.rowsNumber = formatResponse.total;
      }).finally(() => {
        table_loading.value = false;
        table_pagination.value.page = page;
        table_pagination.value.rowsPerPage = rowsPerPage;
        table_pagination.value.sortBy = sortBy;
        table_pagination.value.descending = descending;
      });
    };
    ref(false);
    const on_form_submit = () => {
      if (formImputed.value) {
        table_loading.value = true;
        queryVariant({
          variant_type: query_variant_type.value,
          variant_id: query_variant_id.value,
          range: query_range.value,
          page: 1,
          pageSize: table_pagination.value.rowsPerPage,
          sortBy: table_pagination.value.sortBy,
          order: table_pagination.value.descending ? -1 : 1
        }).then((response) => {
          const formatResponse = response;
          if (formatResponse.total) {
            table_data.value = formatResponse.data;
            table_pagination.value.rowsNumber = formatResponse.total;
            current_show.variant_type = query_variant_type.value;
            current_show.variant_id = query_variant_id.value;
            current_show.variant_range = query_range.value;
            data_stat.SNP = formatResponse.stat.SNP;
            data_stat.MNV = formatResponse.stat.MNV;
            data_stat.InDel = formatResponse.stat.InDel;
            data_stat.SV = formatResponse.stat.SV;
          } else {
            $q.notify({
              message: "No data found!",
              color: "negative",
              icon: "warning"
            });
          }
          table_visible.value = true;
          table_loading.value = false;
        }).catch((error) => {
          $q.notify({
            message: error,
            color: "negative",
            icon: "warning"
          });
          table_loading.value = false;
        });
      } else {
        $q.notify({
          message: "Please input at least one field!",
          color: "negative",
          icon: "warning"
        });
      }
    };
    const on_form_reset = () => {
      query_variant_id.value = null;
      query_range.value = null;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_q_page = __nuxt_component_0;
      const _component_q_card = __nuxt_component_2;
      const _component_q_card_section = __nuxt_component_3;
      const _component_q_form = __nuxt_component_4;
      const _component_q_select = __nuxt_component_5;
      const _component_q_item = __nuxt_component_6;
      const _component_q_item_section = __nuxt_component_7;
      const _component_q_input = __nuxt_component_7$1;
      const _component_q_btn = __nuxt_component_8;
      const _component_q_table = __nuxt_component_9;
      const _component_q_inner_loading = __nuxt_component_10;
      const _component_q_tr = __nuxt_component_11;
      const _component_q_th = __nuxt_component_12;
      const _component_q_td = __nuxt_component_13;
      _push(ssrRenderComponent(_component_q_page, mergeProps({
        style: { "min-height": "calc(100vh - 125px)", "margin": "5px auto 0 auto" },
        class: "q-pa-md"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_q_card, {
              flat: "",
              bordered: "",
              style: { "max-width": "1140px" },
              class: "q-mx-auto q-my-none"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_q_card_section, { class: "row q-py-none q-px-none" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold" style="${ssrRenderStyle({ "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" })}"${_scopeId3}> Search variant by type, ID or range </div>`);
                      } else {
                        return [
                          createVNode("div", {
                            class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                            style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                          }, " Search variant by type, ID or range ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_q_card_section, { class: "q-px-md q-pt-md q-pb-sm" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-body1 text-grey-8" style="${ssrRenderStyle({ "line-height": "1.7" })}"${_scopeId3}> This module provides a comprehensive catalog of <span class="text-bold rounded-borders q-px-xs" style="${ssrRenderStyle({ "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" })}"${_scopeId3}> 21,014,915 </span> genetic variants identified from 148 healthy Chinese individuals using PacBio HiFi long-read sequencing, comprising <span class="text-bold rounded-borders q-px-xs" style="${ssrRenderStyle({ "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" })}"${_scopeId3}> 96,203 </span> SVs, <span class="text-bold rounded-borders q-px-xs" style="${ssrRenderStyle({ "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" })}"${_scopeId3}> 18,400,996 </span> SNVs, <span class="text-bold rounded-borders q-px-xs" style="${ssrRenderStyle({ "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" })}"${_scopeId3}> 428,349 </span> MNVs, and <span class="text-bold rounded-borders q-px-xs" style="${ssrRenderStyle({ "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" })}"${_scopeId3}> 2,089,567 </span> InDels. <br${_scopeId3}> These variants were identified through an integrated computational pipeline: SNVs and InDels were called using <span class="text-bold rounded-borders q-px-xs" style="${ssrRenderStyle({ "padding-left": "0", "margin-left": "0", "color": "#f57c20", "background-color": "white" })}"${_scopeId3}> Clair3 </span> , MNVs were detected by <span class="text-bold rounded-borders q-px-xs" style="${ssrRenderStyle({ "padding-left": "0", "margin-left": "0", "color": "#f57c20", "background-color": "white" })}"${_scopeId3}> MNVAnno </span> following SNV phasing with SHAPEIT5, and SVs were identified by integrating four complementary algorithms <span class="text-bold rounded-borders q-px-xs" style="${ssrRenderStyle({ "padding-left": "0", "margin-left": "0", "color": "#f57c20", "background-color": "white" })}"${_scopeId3}> (cuteSV, Sniffles, PBSV, and SVision-pro) </span> using the CAST merging strategy. </div>`);
                      } else {
                        return [
                          createVNode("div", {
                            class: "text-body1 text-grey-8",
                            style: { "line-height": "1.7" }
                          }, [
                            createTextVNode(" This module provides a comprehensive catalog of "),
                            createVNode("span", {
                              class: "text-bold rounded-borders q-px-xs",
                              style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                            }, " 21,014,915 "),
                            createTextVNode(" genetic variants identified from 148 healthy Chinese individuals using PacBio HiFi long-read sequencing, comprising "),
                            createVNode("span", {
                              class: "text-bold rounded-borders q-px-xs",
                              style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                            }, " 96,203 "),
                            createTextVNode(" SVs, "),
                            createVNode("span", {
                              class: "text-bold rounded-borders q-px-xs",
                              style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                            }, " 18,400,996 "),
                            createTextVNode(" SNVs, "),
                            createVNode("span", {
                              class: "text-bold rounded-borders q-px-xs",
                              style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                            }, " 428,349 "),
                            createTextVNode(" MNVs, and "),
                            createVNode("span", {
                              class: "text-bold rounded-borders q-px-xs",
                              style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                            }, " 2,089,567 "),
                            createTextVNode(" InDels. "),
                            createVNode("br"),
                            createTextVNode(" These variants were identified through an integrated computational pipeline: SNVs and InDels were called using "),
                            createVNode("span", {
                              class: "text-bold rounded-borders q-px-xs",
                              style: { "padding-left": "0", "margin-left": "0", "color": "#f57c20", "background-color": "white" }
                            }, " Clair3 "),
                            createTextVNode(" , MNVs were detected by "),
                            createVNode("span", {
                              class: "text-bold rounded-borders q-px-xs",
                              style: { "padding-left": "0", "margin-left": "0", "color": "#f57c20", "background-color": "white" }
                            }, " MNVAnno "),
                            createTextVNode(" following SNV phasing with SHAPEIT5, and SVs were identified by integrating four complementary algorithms "),
                            createVNode("span", {
                              class: "text-bold rounded-borders q-px-xs",
                              style: { "padding-left": "0", "margin-left": "0", "color": "#f57c20", "background-color": "white" }
                            }, " (cuteSV, Sniffles, PBSV, and SVision-pro) "),
                            createTextVNode(" using the CAST merging strategy. ")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_q_form, {
                    onSubmit: on_form_submit,
                    onReset: on_form_reset,
                    class: [{ "q-mx-auto": small_screen.value }, "q-py-sm"]
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="row"${_scopeId3}><div class="col-12 col-sm-6 items-center justify-between q-my-xs"${_scopeId3}><span class="${ssrRenderClass([small_screen.value ? "text-left col-12" : "text-left col-2", "text-bold text-subtitle2 text-primary q-px-sm"])}"${_scopeId3}>Variant Type:</span>`);
                        _push4(ssrRenderComponent(_component_q_select, {
                          dense: "",
                          outlined: "",
                          clearable: "",
                          "use-input": "",
                          "hide-dropdown-icon": "",
                          "label-color": "primary",
                          label: "Select variant type",
                          "input-debounce": "1000",
                          class: "col-sm-10 col-12 q-px-sm q-py-xs",
                          "input-class": "text-primary",
                          modelValue: query_variant_type.value,
                          "onUpdate:modelValue": ($event) => query_variant_type.value = $event,
                          options: variant_type_options
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="col-12 col-sm-6 items-center justify-between q-my-xs"${_scopeId3}><span class="${ssrRenderClass([small_screen.value ? "text-left col-12" : "text-left col-2", "text-bold text-subtitle2 text-primary q-px-sm"])}"${_scopeId3}>Variant ID:</span>`);
                        _push4(ssrRenderComponent(_component_q_select, {
                          dense: "",
                          outlined: "",
                          clearable: "",
                          "use-input": "",
                          "hide-dropdown-icon": "",
                          "label-color": "primary",
                          label: "Input variant ID",
                          "input-debounce": "1000",
                          class: "col-sm-4 col-12 q-px-sm q-py-xs",
                          "input-class": "text-primary",
                          modelValue: query_variant_id.value,
                          "onUpdate:modelValue": ($event) => query_variant_id.value = $event,
                          options: variant_id_options.value,
                          onFilter: onTextInput,
                          ref_key: "ref_variant_id",
                          ref: ref_variant_id
                        }, {
                          "no-option": withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_q_item, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_q_item_section, { class: "text-grey" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(` No results `);
                                        } else {
                                          return [
                                            createTextVNode(" No results ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_q_item_section, { class: "text-grey" }, {
                                        default: withCtx(() => [
                                          createTextVNode(" No results ")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_q_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_q_item_section, { class: "text-grey" }, {
                                      default: withCtx(() => [
                                        createTextVNode(" No results ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="col-12 items-center justify-between q-my-xs"${_scopeId3}><span class="${ssrRenderClass([small_screen.value ? "text-left col-12" : "text-left col-2", "text-bold text-subtitle2 text-primary q-px-sm"])}"${_scopeId3}>Genomic Range:</span>`);
                        _push4(ssrRenderComponent(_component_q_input, {
                          dense: "",
                          outlined: "",
                          clearable: "",
                          "label-color": "primary",
                          label: "Input variant range",
                          class: "col-sm-10 col-12 q-px-sm q-py-xs",
                          "input-class": "text-primary",
                          modelValue: query_range.value,
                          "onUpdate:modelValue": ($event) => query_range.value = $event,
                          rules: query_range_rules
                        }, null, _parent4, _scopeId3));
                        _push4(`</div></div><div class="col-12 col-sm-6"${_scopeId3}><div class="row items-center justify-center q-gutter-x-xl"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_btn, {
                          unelevated: "",
                          "no-caps": "",
                          color: "primary",
                          label: "Submit",
                          type: "submit"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_btn, {
                          unelevated: "",
                          "no-caps": "",
                          color: "negative",
                          label: "Reset",
                          type: "reset"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "row" }, [
                            createVNode("div", { class: "col-12 col-sm-6 items-center justify-between q-my-xs" }, [
                              createVNode("span", {
                                class: ["text-bold text-subtitle2 text-primary q-px-sm", small_screen.value ? "text-left col-12" : "text-left col-2"]
                              }, "Variant Type:", 2),
                              createVNode(_component_q_select, {
                                dense: "",
                                outlined: "",
                                clearable: "",
                                "use-input": "",
                                "hide-dropdown-icon": "",
                                "label-color": "primary",
                                label: "Select variant type",
                                "input-debounce": "1000",
                                class: "col-sm-10 col-12 q-px-sm q-py-xs",
                                "input-class": "text-primary",
                                modelValue: query_variant_type.value,
                                "onUpdate:modelValue": ($event) => query_variant_type.value = $event,
                                options: variant_type_options
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "col-12 col-sm-6 items-center justify-between q-my-xs" }, [
                              createVNode("span", {
                                class: ["text-bold text-subtitle2 text-primary q-px-sm", small_screen.value ? "text-left col-12" : "text-left col-2"]
                              }, "Variant ID:", 2),
                              createVNode(_component_q_select, {
                                dense: "",
                                outlined: "",
                                clearable: "",
                                "use-input": "",
                                "hide-dropdown-icon": "",
                                "label-color": "primary",
                                label: "Input variant ID",
                                "input-debounce": "1000",
                                class: "col-sm-4 col-12 q-px-sm q-py-xs",
                                "input-class": "text-primary",
                                modelValue: query_variant_id.value,
                                "onUpdate:modelValue": ($event) => query_variant_id.value = $event,
                                options: variant_id_options.value,
                                onFilter: onTextInput,
                                ref_key: "ref_variant_id",
                                ref: ref_variant_id
                              }, {
                                "no-option": withCtx(() => [
                                  createVNode(_component_q_item, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_q_item_section, { class: "text-grey" }, {
                                        default: withCtx(() => [
                                          createTextVNode(" No results ")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue", "options"])
                            ]),
                            createVNode("div", { class: "col-12 items-center justify-between q-my-xs" }, [
                              createVNode("span", {
                                class: ["text-bold text-subtitle2 text-primary q-px-sm", small_screen.value ? "text-left col-12" : "text-left col-2"]
                              }, "Genomic Range:", 2),
                              createVNode(_component_q_input, {
                                dense: "",
                                outlined: "",
                                clearable: "",
                                "label-color": "primary",
                                label: "Input variant range",
                                class: "col-sm-10 col-12 q-px-sm q-py-xs",
                                "input-class": "text-primary",
                                modelValue: query_range.value,
                                "onUpdate:modelValue": ($event) => query_range.value = $event,
                                rules: query_range_rules
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ])
                          ]),
                          createVNode("div", { class: "col-12 col-sm-6" }, [
                            createVNode("div", { class: "row items-center justify-center q-gutter-x-xl" }, [
                              createVNode(_component_q_btn, {
                                unelevated: "",
                                "no-caps": "",
                                color: "primary",
                                label: "Submit",
                                type: "submit"
                              }),
                              createVNode(_component_q_btn, {
                                unelevated: "",
                                "no-caps": "",
                                color: "negative",
                                label: "Reset",
                                type: "reset"
                              })
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="row justify-center q-pb-sm q-my-xs"${_scopeId2}><div class="q-px-sm q-gutter-x-xs"${_scopeId2}><!--[-->`);
                  ssrRenderList(examples, (example) => {
                    _push3(ssrRenderComponent(_component_q_btn, {
                      class: "text-indigo-6",
                      key: example.label,
                      label: example.label,
                      dense: small_screen.value,
                      disable: example.disable,
                      flat: "",
                      "no-caps": "",
                      onClick: ($event) => set_example(example)
                    }, null, _parent3, _scopeId2));
                  });
                  _push3(`<!--]--></div></div>`);
                } else {
                  return [
                    createVNode(_component_q_card_section, { class: "row q-py-none q-px-none" }, {
                      default: withCtx(() => [
                        createVNode("div", {
                          class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                          style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                        }, " Search variant by type, ID or range ")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_q_card_section, { class: "q-px-md q-pt-md q-pb-sm" }, {
                      default: withCtx(() => [
                        createVNode("div", {
                          class: "text-body1 text-grey-8",
                          style: { "line-height": "1.7" }
                        }, [
                          createTextVNode(" This module provides a comprehensive catalog of "),
                          createVNode("span", {
                            class: "text-bold rounded-borders q-px-xs",
                            style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                          }, " 21,014,915 "),
                          createTextVNode(" genetic variants identified from 148 healthy Chinese individuals using PacBio HiFi long-read sequencing, comprising "),
                          createVNode("span", {
                            class: "text-bold rounded-borders q-px-xs",
                            style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                          }, " 96,203 "),
                          createTextVNode(" SVs, "),
                          createVNode("span", {
                            class: "text-bold rounded-borders q-px-xs",
                            style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                          }, " 18,400,996 "),
                          createTextVNode(" SNVs, "),
                          createVNode("span", {
                            class: "text-bold rounded-borders q-px-xs",
                            style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                          }, " 428,349 "),
                          createTextVNode(" MNVs, and "),
                          createVNode("span", {
                            class: "text-bold rounded-borders q-px-xs",
                            style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                          }, " 2,089,567 "),
                          createTextVNode(" InDels. "),
                          createVNode("br"),
                          createTextVNode(" These variants were identified through an integrated computational pipeline: SNVs and InDels were called using "),
                          createVNode("span", {
                            class: "text-bold rounded-borders q-px-xs",
                            style: { "padding-left": "0", "margin-left": "0", "color": "#f57c20", "background-color": "white" }
                          }, " Clair3 "),
                          createTextVNode(" , MNVs were detected by "),
                          createVNode("span", {
                            class: "text-bold rounded-borders q-px-xs",
                            style: { "padding-left": "0", "margin-left": "0", "color": "#f57c20", "background-color": "white" }
                          }, " MNVAnno "),
                          createTextVNode(" following SNV phasing with SHAPEIT5, and SVs were identified by integrating four complementary algorithms "),
                          createVNode("span", {
                            class: "text-bold rounded-borders q-px-xs",
                            style: { "padding-left": "0", "margin-left": "0", "color": "#f57c20", "background-color": "white" }
                          }, " (cuteSV, Sniffles, PBSV, and SVision-pro) "),
                          createTextVNode(" using the CAST merging strategy. ")
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_q_form, {
                      onSubmit: on_form_submit,
                      onReset: on_form_reset,
                      class: [{ "q-mx-auto": small_screen.value }, "q-py-sm"]
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "row" }, [
                          createVNode("div", { class: "col-12 col-sm-6 items-center justify-between q-my-xs" }, [
                            createVNode("span", {
                              class: ["text-bold text-subtitle2 text-primary q-px-sm", small_screen.value ? "text-left col-12" : "text-left col-2"]
                            }, "Variant Type:", 2),
                            createVNode(_component_q_select, {
                              dense: "",
                              outlined: "",
                              clearable: "",
                              "use-input": "",
                              "hide-dropdown-icon": "",
                              "label-color": "primary",
                              label: "Select variant type",
                              "input-debounce": "1000",
                              class: "col-sm-10 col-12 q-px-sm q-py-xs",
                              "input-class": "text-primary",
                              modelValue: query_variant_type.value,
                              "onUpdate:modelValue": ($event) => query_variant_type.value = $event,
                              options: variant_type_options
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "col-12 col-sm-6 items-center justify-between q-my-xs" }, [
                            createVNode("span", {
                              class: ["text-bold text-subtitle2 text-primary q-px-sm", small_screen.value ? "text-left col-12" : "text-left col-2"]
                            }, "Variant ID:", 2),
                            createVNode(_component_q_select, {
                              dense: "",
                              outlined: "",
                              clearable: "",
                              "use-input": "",
                              "hide-dropdown-icon": "",
                              "label-color": "primary",
                              label: "Input variant ID",
                              "input-debounce": "1000",
                              class: "col-sm-4 col-12 q-px-sm q-py-xs",
                              "input-class": "text-primary",
                              modelValue: query_variant_id.value,
                              "onUpdate:modelValue": ($event) => query_variant_id.value = $event,
                              options: variant_id_options.value,
                              onFilter: onTextInput,
                              ref_key: "ref_variant_id",
                              ref: ref_variant_id
                            }, {
                              "no-option": withCtx(() => [
                                createVNode(_component_q_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_q_item_section, { class: "text-grey" }, {
                                      default: withCtx(() => [
                                        createTextVNode(" No results ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue", "options"])
                          ]),
                          createVNode("div", { class: "col-12 items-center justify-between q-my-xs" }, [
                            createVNode("span", {
                              class: ["text-bold text-subtitle2 text-primary q-px-sm", small_screen.value ? "text-left col-12" : "text-left col-2"]
                            }, "Genomic Range:", 2),
                            createVNode(_component_q_input, {
                              dense: "",
                              outlined: "",
                              clearable: "",
                              "label-color": "primary",
                              label: "Input variant range",
                              class: "col-sm-10 col-12 q-px-sm q-py-xs",
                              "input-class": "text-primary",
                              modelValue: query_range.value,
                              "onUpdate:modelValue": ($event) => query_range.value = $event,
                              rules: query_range_rules
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ])
                        ]),
                        createVNode("div", { class: "col-12 col-sm-6" }, [
                          createVNode("div", { class: "row items-center justify-center q-gutter-x-xl" }, [
                            createVNode(_component_q_btn, {
                              unelevated: "",
                              "no-caps": "",
                              color: "primary",
                              label: "Submit",
                              type: "submit"
                            }),
                            createVNode(_component_q_btn, {
                              unelevated: "",
                              "no-caps": "",
                              color: "negative",
                              label: "Reset",
                              type: "reset"
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    }, 8, ["class"]),
                    createVNode("div", { class: "row justify-center q-pb-sm q-my-xs" }, [
                      createVNode("div", { class: "q-px-sm q-gutter-x-xs" }, [
                        (openBlock(), createBlock(Fragment, null, renderList(examples, (example) => {
                          return createVNode(_component_q_btn, {
                            class: "text-indigo-6",
                            key: example.label,
                            label: example.label,
                            dense: small_screen.value,
                            disable: example.disable,
                            flat: "",
                            "no-caps": "",
                            onClick: ($event) => set_example(example)
                          }, null, 8, ["label", "dense", "disable", "onClick"]);
                        }), 64))
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_q_card, {
              flat: "",
              bordered: "",
              style: { "max-width": "1140px" },
              class: "q-mx-auto q-my-md q-px-none"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_q_table, {
                    flat: "",
                    "row-key": "label",
                    pagination: table_pagination.value,
                    "onUpdate:pagination": ($event) => table_pagination.value = $event,
                    rows: table_data.value,
                    columns: unref(model_variant),
                    dense: small_screen.value,
                    loading: table_loading.value,
                    "rows-per-page-options": [15, 50, 100],
                    "rows-per-page-label": "Rows per page:",
                    "all-rows-label": "All",
                    "pagination-label": (firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}~${endRowIndex} / ${totalRowsNumber}`,
                    onRequest: on_table_request,
                    separator: "cell",
                    "no-data-label": "No data"
                  }, {
                    loading: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_q_inner_loading, {
                          showing: "",
                          color: "primary"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_q_inner_loading, {
                            showing: "",
                            color: "primary"
                          })
                        ];
                      }
                    }),
                    "top-left": withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="row no-wrap q-pl-md q-gutter-x-lg"${_scopeId3}><!--[-->`);
                        ssrRenderList(Object.keys(data_stat), (key) => {
                          _push4(`<div style="${ssrRenderStyle(data_stat[key] !== 0 ? null : { display: "none" })}" class="col-auto text-center text-subtitle1 text-bold"${_scopeId3}><div${_scopeId3}>${ssrInterpolate(data_stat[key])}</div><div class="text-primary"${_scopeId3}>${ssrInterpolate(key)}</div></div>`);
                        });
                        _push4(`<!--]--></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "row no-wrap q-pl-md q-gutter-x-lg" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(Object.keys(data_stat), (key) => {
                              return withDirectives((openBlock(), createBlock("div", {
                                key,
                                class: "col-auto text-center text-subtitle1 text-bold"
                              }, [
                                createVNode("div", null, toDisplayString(data_stat[key]), 1),
                                createVNode("div", { class: "text-primary" }, toDisplayString(key), 1)
                              ])), [
                                [vShow, data_stat[key] !== 0]
                              ]);
                            }), 128))
                          ])
                        ];
                      }
                    }),
                    "top-right": withCtx((props, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="row no-wrap"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_btn, {
                          flat: "",
                          dense: "",
                          ripple: false,
                          icon: props.inFullscreen ? "fullscreen_exit" : "fullscreen",
                          onClick: props.toggleFullscreen
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "row no-wrap" }, [
                            createVNode(_component_q_btn, {
                              flat: "",
                              dense: "",
                              ripple: false,
                              icon: props.inFullscreen ? "fullscreen_exit" : "fullscreen",
                              onClick: props.toggleFullscreen
                            }, null, 8, ["icon", "onClick"])
                          ])
                        ];
                      }
                    }),
                    header: withCtx((props, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_q_tr, { props }, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(props.cols, (col) => {
                                _push5(ssrRenderComponent(_component_q_th, {
                                  key: col.name,
                                  props,
                                  class: "text-primary",
                                  style: { "font-weight": "bold", "font-size": "14px" }
                                }, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(col.label)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(col.label), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(true), createBlock(Fragment, null, renderList(props.cols, (col) => {
                                  return openBlock(), createBlock(_component_q_th, {
                                    key: col.name,
                                    props,
                                    class: "text-primary",
                                    style: { "font-weight": "bold", "font-size": "14px" }
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(col.label), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["props"]);
                                }), 128))
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_q_tr, { props }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(props.cols, (col) => {
                                return openBlock(), createBlock(_component_q_th, {
                                  key: col.name,
                                  props,
                                  class: "text-primary",
                                  style: { "font-weight": "bold", "font-size": "14px" }
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(col.label), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["props"]);
                              }), 128))
                            ]),
                            _: 2
                          }, 1032, ["props"])
                        ];
                      }
                    }),
                    "body-cell-MNVID": withCtx((props, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_q_td, {
                          class: "text-center",
                          props
                        }, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a class="text-bold"${ssrRenderAttr("href", `http://gong_lab.hzau.edu.cn/MNVList/home/searchmnvid.html?selectValue=${props.row.mnvid}&version=1`)} target="_blank"${_scopeId4}>${ssrInterpolate(props.row.mnvid)}</a>`);
                            } else {
                              return [
                                createVNode("a", {
                                  class: "text-bold",
                                  href: `http://gong_lab.hzau.edu.cn/MNVList/home/searchmnvid.html?selectValue=${props.row.mnvid}&version=1`,
                                  target: "_blank"
                                }, toDisplayString(props.row.mnvid), 9, ["href"])
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_q_td, {
                            class: "text-center",
                            props
                          }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                class: "text-bold",
                                href: `http://gong_lab.hzau.edu.cn/MNVList/home/searchmnvid.html?selectValue=${props.row.mnvid}&version=1`,
                                target: "_blank"
                              }, toDisplayString(props.row.mnvid), 9, ["href"])
                            ]),
                            _: 2
                          }, 1032, ["props"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_q_table, {
                      flat: "",
                      "row-key": "label",
                      pagination: table_pagination.value,
                      "onUpdate:pagination": ($event) => table_pagination.value = $event,
                      rows: table_data.value,
                      columns: unref(model_variant),
                      dense: small_screen.value,
                      loading: table_loading.value,
                      "rows-per-page-options": [15, 50, 100],
                      "rows-per-page-label": "Rows per page:",
                      "all-rows-label": "All",
                      "pagination-label": (firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}~${endRowIndex} / ${totalRowsNumber}`,
                      onRequest: on_table_request,
                      separator: "cell",
                      "no-data-label": "No data"
                    }, {
                      loading: withCtx(() => [
                        createVNode(_component_q_inner_loading, {
                          showing: "",
                          color: "primary"
                        })
                      ]),
                      "top-left": withCtx(() => [
                        createVNode("div", { class: "row no-wrap q-pl-md q-gutter-x-lg" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(Object.keys(data_stat), (key) => {
                            return withDirectives((openBlock(), createBlock("div", {
                              key,
                              class: "col-auto text-center text-subtitle1 text-bold"
                            }, [
                              createVNode("div", null, toDisplayString(data_stat[key]), 1),
                              createVNode("div", { class: "text-primary" }, toDisplayString(key), 1)
                            ])), [
                              [vShow, data_stat[key] !== 0]
                            ]);
                          }), 128))
                        ])
                      ]),
                      "top-right": withCtx((props) => [
                        createVNode("div", { class: "row no-wrap" }, [
                          createVNode(_component_q_btn, {
                            flat: "",
                            dense: "",
                            ripple: false,
                            icon: props.inFullscreen ? "fullscreen_exit" : "fullscreen",
                            onClick: props.toggleFullscreen
                          }, null, 8, ["icon", "onClick"])
                        ])
                      ]),
                      header: withCtx((props) => [
                        createVNode(_component_q_tr, { props }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(props.cols, (col) => {
                              return openBlock(), createBlock(_component_q_th, {
                                key: col.name,
                                props,
                                class: "text-primary",
                                style: { "font-weight": "bold", "font-size": "14px" }
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(col.label), 1)
                                ]),
                                _: 2
                              }, 1032, ["props"]);
                            }), 128))
                          ]),
                          _: 2
                        }, 1032, ["props"])
                      ]),
                      "body-cell-MNVID": withCtx((props) => [
                        createVNode(_component_q_td, {
                          class: "text-center",
                          props
                        }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              class: "text-bold",
                              href: `http://gong_lab.hzau.edu.cn/MNVList/home/searchmnvid.html?selectValue=${props.row.mnvid}&version=1`,
                              target: "_blank"
                            }, toDisplayString(props.row.mnvid), 9, ["href"])
                          ]),
                          _: 2
                        }, 1032, ["props"])
                      ]),
                      _: 1
                    }, 8, ["pagination", "onUpdate:pagination", "rows", "columns", "dense", "loading", "pagination-label"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_q_card, {
                flat: "",
                bordered: "",
                style: { "max-width": "1140px" },
                class: "q-mx-auto q-my-none"
              }, {
                default: withCtx(() => [
                  createVNode(_component_q_card_section, { class: "row q-py-none q-px-none" }, {
                    default: withCtx(() => [
                      createVNode("div", {
                        class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                        style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                      }, " Search variant by type, ID or range ")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_q_card_section, { class: "q-px-md q-pt-md q-pb-sm" }, {
                    default: withCtx(() => [
                      createVNode("div", {
                        class: "text-body1 text-grey-8",
                        style: { "line-height": "1.7" }
                      }, [
                        createTextVNode(" This module provides a comprehensive catalog of "),
                        createVNode("span", {
                          class: "text-bold rounded-borders q-px-xs",
                          style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                        }, " 21,014,915 "),
                        createTextVNode(" genetic variants identified from 148 healthy Chinese individuals using PacBio HiFi long-read sequencing, comprising "),
                        createVNode("span", {
                          class: "text-bold rounded-borders q-px-xs",
                          style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                        }, " 96,203 "),
                        createTextVNode(" SVs, "),
                        createVNode("span", {
                          class: "text-bold rounded-borders q-px-xs",
                          style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                        }, " 18,400,996 "),
                        createTextVNode(" SNVs, "),
                        createVNode("span", {
                          class: "text-bold rounded-borders q-px-xs",
                          style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                        }, " 428,349 "),
                        createTextVNode(" MNVs, and "),
                        createVNode("span", {
                          class: "text-bold rounded-borders q-px-xs",
                          style: { "padding-left": "0", "margin-left": "0", "color": "red", "background-color": "white" }
                        }, " 2,089,567 "),
                        createTextVNode(" InDels. "),
                        createVNode("br"),
                        createTextVNode(" These variants were identified through an integrated computational pipeline: SNVs and InDels were called using "),
                        createVNode("span", {
                          class: "text-bold rounded-borders q-px-xs",
                          style: { "padding-left": "0", "margin-left": "0", "color": "#f57c20", "background-color": "white" }
                        }, " Clair3 "),
                        createTextVNode(" , MNVs were detected by "),
                        createVNode("span", {
                          class: "text-bold rounded-borders q-px-xs",
                          style: { "padding-left": "0", "margin-left": "0", "color": "#f57c20", "background-color": "white" }
                        }, " MNVAnno "),
                        createTextVNode(" following SNV phasing with SHAPEIT5, and SVs were identified by integrating four complementary algorithms "),
                        createVNode("span", {
                          class: "text-bold rounded-borders q-px-xs",
                          style: { "padding-left": "0", "margin-left": "0", "color": "#f57c20", "background-color": "white" }
                        }, " (cuteSV, Sniffles, PBSV, and SVision-pro) "),
                        createTextVNode(" using the CAST merging strategy. ")
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_q_form, {
                    onSubmit: on_form_submit,
                    onReset: on_form_reset,
                    class: [{ "q-mx-auto": small_screen.value }, "q-py-sm"]
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "row" }, [
                        createVNode("div", { class: "col-12 col-sm-6 items-center justify-between q-my-xs" }, [
                          createVNode("span", {
                            class: ["text-bold text-subtitle2 text-primary q-px-sm", small_screen.value ? "text-left col-12" : "text-left col-2"]
                          }, "Variant Type:", 2),
                          createVNode(_component_q_select, {
                            dense: "",
                            outlined: "",
                            clearable: "",
                            "use-input": "",
                            "hide-dropdown-icon": "",
                            "label-color": "primary",
                            label: "Select variant type",
                            "input-debounce": "1000",
                            class: "col-sm-10 col-12 q-px-sm q-py-xs",
                            "input-class": "text-primary",
                            modelValue: query_variant_type.value,
                            "onUpdate:modelValue": ($event) => query_variant_type.value = $event,
                            options: variant_type_options
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", { class: "col-12 col-sm-6 items-center justify-between q-my-xs" }, [
                          createVNode("span", {
                            class: ["text-bold text-subtitle2 text-primary q-px-sm", small_screen.value ? "text-left col-12" : "text-left col-2"]
                          }, "Variant ID:", 2),
                          createVNode(_component_q_select, {
                            dense: "",
                            outlined: "",
                            clearable: "",
                            "use-input": "",
                            "hide-dropdown-icon": "",
                            "label-color": "primary",
                            label: "Input variant ID",
                            "input-debounce": "1000",
                            class: "col-sm-4 col-12 q-px-sm q-py-xs",
                            "input-class": "text-primary",
                            modelValue: query_variant_id.value,
                            "onUpdate:modelValue": ($event) => query_variant_id.value = $event,
                            options: variant_id_options.value,
                            onFilter: onTextInput,
                            ref_key: "ref_variant_id",
                            ref: ref_variant_id
                          }, {
                            "no-option": withCtx(() => [
                              createVNode(_component_q_item, null, {
                                default: withCtx(() => [
                                  createVNode(_component_q_item_section, { class: "text-grey" }, {
                                    default: withCtx(() => [
                                      createTextVNode(" No results ")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ]),
                        createVNode("div", { class: "col-12 items-center justify-between q-my-xs" }, [
                          createVNode("span", {
                            class: ["text-bold text-subtitle2 text-primary q-px-sm", small_screen.value ? "text-left col-12" : "text-left col-2"]
                          }, "Genomic Range:", 2),
                          createVNode(_component_q_input, {
                            dense: "",
                            outlined: "",
                            clearable: "",
                            "label-color": "primary",
                            label: "Input variant range",
                            class: "col-sm-10 col-12 q-px-sm q-py-xs",
                            "input-class": "text-primary",
                            modelValue: query_range.value,
                            "onUpdate:modelValue": ($event) => query_range.value = $event,
                            rules: query_range_rules
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ]),
                      createVNode("div", { class: "col-12 col-sm-6" }, [
                        createVNode("div", { class: "row items-center justify-center q-gutter-x-xl" }, [
                          createVNode(_component_q_btn, {
                            unelevated: "",
                            "no-caps": "",
                            color: "primary",
                            label: "Submit",
                            type: "submit"
                          }),
                          createVNode(_component_q_btn, {
                            unelevated: "",
                            "no-caps": "",
                            color: "negative",
                            label: "Reset",
                            type: "reset"
                          })
                        ])
                      ])
                    ]),
                    _: 1
                  }, 8, ["class"]),
                  createVNode("div", { class: "row justify-center q-pb-sm q-my-xs" }, [
                    createVNode("div", { class: "q-px-sm q-gutter-x-xs" }, [
                      (openBlock(), createBlock(Fragment, null, renderList(examples, (example) => {
                        return createVNode(_component_q_btn, {
                          class: "text-indigo-6",
                          key: example.label,
                          label: example.label,
                          dense: small_screen.value,
                          disable: example.disable,
                          flat: "",
                          "no-caps": "",
                          onClick: ($event) => set_example(example)
                        }, null, 8, ["label", "dense", "disable", "onClick"]);
                      }), 64))
                    ])
                  ])
                ]),
                _: 1
              }),
              createVNode(_component_q_card, {
                flat: "",
                bordered: "",
                style: { "max-width": "1140px" },
                class: "q-mx-auto q-my-md q-px-none"
              }, {
                default: withCtx(() => [
                  createVNode(_component_q_table, {
                    flat: "",
                    "row-key": "label",
                    pagination: table_pagination.value,
                    "onUpdate:pagination": ($event) => table_pagination.value = $event,
                    rows: table_data.value,
                    columns: unref(model_variant),
                    dense: small_screen.value,
                    loading: table_loading.value,
                    "rows-per-page-options": [15, 50, 100],
                    "rows-per-page-label": "Rows per page:",
                    "all-rows-label": "All",
                    "pagination-label": (firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}~${endRowIndex} / ${totalRowsNumber}`,
                    onRequest: on_table_request,
                    separator: "cell",
                    "no-data-label": "No data"
                  }, {
                    loading: withCtx(() => [
                      createVNode(_component_q_inner_loading, {
                        showing: "",
                        color: "primary"
                      })
                    ]),
                    "top-left": withCtx(() => [
                      createVNode("div", { class: "row no-wrap q-pl-md q-gutter-x-lg" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(Object.keys(data_stat), (key) => {
                          return withDirectives((openBlock(), createBlock("div", {
                            key,
                            class: "col-auto text-center text-subtitle1 text-bold"
                          }, [
                            createVNode("div", null, toDisplayString(data_stat[key]), 1),
                            createVNode("div", { class: "text-primary" }, toDisplayString(key), 1)
                          ])), [
                            [vShow, data_stat[key] !== 0]
                          ]);
                        }), 128))
                      ])
                    ]),
                    "top-right": withCtx((props) => [
                      createVNode("div", { class: "row no-wrap" }, [
                        createVNode(_component_q_btn, {
                          flat: "",
                          dense: "",
                          ripple: false,
                          icon: props.inFullscreen ? "fullscreen_exit" : "fullscreen",
                          onClick: props.toggleFullscreen
                        }, null, 8, ["icon", "onClick"])
                      ])
                    ]),
                    header: withCtx((props) => [
                      createVNode(_component_q_tr, { props }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(props.cols, (col) => {
                            return openBlock(), createBlock(_component_q_th, {
                              key: col.name,
                              props,
                              class: "text-primary",
                              style: { "font-weight": "bold", "font-size": "14px" }
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(col.label), 1)
                              ]),
                              _: 2
                            }, 1032, ["props"]);
                          }), 128))
                        ]),
                        _: 2
                      }, 1032, ["props"])
                    ]),
                    "body-cell-MNVID": withCtx((props) => [
                      createVNode(_component_q_td, {
                        class: "text-center",
                        props
                      }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            class: "text-bold",
                            href: `http://gong_lab.hzau.edu.cn/MNVList/home/searchmnvid.html?selectValue=${props.row.mnvid}&version=1`,
                            target: "_blank"
                          }, toDisplayString(props.row.mnvid), 9, ["href"])
                        ]),
                        _: 2
                      }, 1032, ["props"])
                    ]),
                    _: 1
                  }, 8, ["pagination", "onUpdate:pagination", "rows", "columns", "dense", "loading", "pagination-label"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/variants.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=variants.vue.mjs.map

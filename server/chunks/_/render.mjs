import { h, withDirectives } from 'vue';

function hSlot (slot, otherwise) {
  return slot !== void 0
    ? slot() || otherwise
    : otherwise
}

function hUniqueSlot (slot, otherwise) {
  if (slot !== void 0) {
    const vnode = slot();
    if (vnode !== void 0 && vnode !== null) {
      return vnode.slice()
    }
  }

  return otherwise
}

/**
 * Source definitely exists,
 * so it's merged with the possible slot
 */
function hMergeSlot (slot, source) {
  return slot !== void 0
    ? source.concat(slot())
    : source
}

/**
 * Merge with possible slot,
 * even if source might not exist
 */
function hMergeSlotSafely (slot, source) {
  if (slot === void 0) {
    return source
  }

  return source !== void 0
    ? source.concat(slot())
    : slot()
}

/*
 * (String)  key       - unique vnode key
 * (Boolean) condition - should change ONLY when adding/removing directive
 */
function hDir (
  tag,
  data,
  children,
  key,
  condition,
  getDirsFn
) {
  data.key = key + condition;

  const vnode = h(tag, data, children);

  return condition === true
    ? withDirectives(vnode, getDirsFn())
    : vnode
}

export { hDir as a, hMergeSlot as b, hMergeSlotSafely as c, hUniqueSlot as d, hSlot as h };
//# sourceMappingURL=render.mjs.map

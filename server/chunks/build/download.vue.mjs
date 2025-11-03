import { getCurrentInstance, ref, computed, watch, h, Transition, KeepAlive, defineComponent, mergeProps, withCtx, createBlock, openBlock, Fragment, renderList, createVNode, unref, isRef, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { g as createComponent, h as createDirective, f as useQuasar } from './server.mjs';
import { _ as __nuxt_component_0 } from '../_/QPage.mjs';
import { _ as __nuxt_component_2 } from '../_/QCard.mjs';
import { _ as __nuxt_component_3 } from '../_/QCardSection.mjs';
import { g as getSSRProps, a as getNormalizedVNodes, _ as __nuxt_component_8 } from '../_/QBtn.mjs';
import { u as useTabEmits, a as useTabProps, b as useTab, _ as __nuxt_component_2$1 } from '../_/use-tab.mjs';
import { u as useDarkProps, a as useDark } from '../_/use-dark.mjs';
import { u as useTimeout } from '../_/uid.mjs';
import { h as hSlot, a as hDir } from '../_/render.mjs';
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
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import '../_/QIcon.mjs';
import '../_/QResizeObserver.mjs';

const queryDownload = ({
  download_type,
  variant_type,
  phenotype_type
}) => {
  return $fetch.raw(`/api/download`, {
    method: "GET",
    params: {
      download_type,
      variant_type,
      phenotype_type
    }
  });
};

const __nuxt_component_5 = createComponent({
  name: 'QTab',

  props: useTabProps,

  emits: useTabEmits,

  setup (props, { slots, emit }) {
    const { renderTab } = useTab(props, slots, emit);
    return () => renderTab('div')
  }
});

const TouchSwipe = createDirective({ name: 'touch-swipe', getSSRProps }
  
);

function useRenderCache () {
  let cache = Object.create(null);

  return {
    getCache: (_, defaultValue) => (
          typeof defaultValue === 'function'
            ? defaultValue()
            : defaultValue
        )
      ,

    setCache (key, obj) {
      cache[ key ] = obj;
    },

    hasCache (key) {
      return Object.hasOwnProperty.call(cache, key)
    },

    clearCache (key) {
      if (key !== void 0) {
        delete cache[ key ];
      }
      else {
        cache = Object.create(null);
      }
    }
  }
}

const usePanelChildProps = {
  name: { required: true },
  disable: Boolean
};

const PanelWrapper = {
  setup (_, { slots }) {
    return () => h('div', {
      class: 'q-panel scroll',
      role: 'tabpanel'
    }, hSlot(slots.default))
  }
};

const usePanelProps = {
  modelValue: {
    required: true
  },

  animated: Boolean,
  infinite: Boolean,
  swipeable: Boolean,
  vertical: Boolean,

  transitionPrev: String,
  transitionNext: String,
  transitionDuration: {
    type: [ String, Number ],
    default: 300
  },

  keepAlive: Boolean,
  keepAliveInclude: [ String, Array, RegExp ],
  keepAliveExclude: [ String, Array, RegExp ],
  keepAliveMax: Number
};

const usePanelEmits = [ 'update:modelValue', 'beforeTransition', 'transition' ];

function usePanel () {
  const { props, emit, proxy } = getCurrentInstance();
  const { getCache } = useRenderCache();
  const { registerTimeout } = useTimeout();

  let panels, forcedPanelTransition;

  const panelTransition = ref(null);

  /*
   * Should not be reactive because it's assigned on render
   * and it will trigger a subsequent useless render.
   *
   * Should be an object though, because it is being exported.
   * Otherwise, the current value would be exported and no subsequent
   * updates will be reflected in the exported value.
   */
  const panelIndex = { value: null };

  function onSwipe (evt) {
    const dir = props.vertical === true ? 'up' : 'left';
    goToPanelByOffset((proxy.$q.lang.rtl === true ? -1 : 1) * (evt.direction === dir ? 1 : -1));
  }

  const panelDirectives = computed(() => {
    // if props.swipeable
    return [ [
      TouchSwipe,
      onSwipe,
      void 0,
      {
        horizontal: props.vertical !== true,
        vertical: props.vertical,
        mouse: true
      }
    ] ]
  });

  const transitionPrev = computed(() =>
    props.transitionPrev || `slide-${ props.vertical === true ? 'down' : 'right' }`
  );

  const transitionNext = computed(() =>
    props.transitionNext || `slide-${ props.vertical === true ? 'up' : 'left' }`
  );

  const transitionStyle = computed(
    () => `--q-transition-duration: ${ props.transitionDuration }ms`
  );

  const contentKey = computed(() => (
    typeof props.modelValue === 'string' || typeof props.modelValue === 'number'
      ? props.modelValue
      : String(props.modelValue)
  ));

  const keepAliveProps = computed(() => ({
    include: props.keepAliveInclude,
    exclude: props.keepAliveExclude,
    max: props.keepAliveMax
  }));

  const needsUniqueKeepAliveWrapper = computed(() =>
    props.keepAliveInclude !== void 0
    || props.keepAliveExclude !== void 0
  );

  watch(() => props.modelValue, (newVal, oldVal) => {
    const index = isValidPanelName(newVal) === true
      ? getPanelIndex(newVal)
      : -1;

    if (forcedPanelTransition !== true) {
      updatePanelTransition(
        index === -1 ? 0 : (index < getPanelIndex(oldVal) ? -1 : 1)
      );
    }

    if (panelIndex.value !== index) {
      panelIndex.value = index;
      emit('beforeTransition', newVal, oldVal);
      registerTimeout(() => {
        emit('transition', newVal, oldVal);
      }, props.transitionDuration);
    }
  });

  function nextPanel () { goToPanelByOffset(1); }
  function previousPanel () { goToPanelByOffset(-1); }

  function goToPanel (name) {
    emit('update:modelValue', name);
  }

  function isValidPanelName (name) {
    return name !== void 0 && name !== null && name !== ''
  }

  function getPanelIndex (name) {
    return panels.findIndex(panel => {
      return panel.props.name === name
        && panel.props.disable !== ''
        && panel.props.disable !== true
    })
  }

  function getEnabledPanels () {
    return panels.filter(panel => {
      return panel.props.disable !== ''
        && panel.props.disable !== true
    })
  }

  function updatePanelTransition (direction) {
    const val = direction !== 0 && props.animated === true && panelIndex.value !== -1
      ? 'q-transition--' + (direction === -1 ? transitionPrev.value : transitionNext.value)
      : null;

    if (panelTransition.value !== val) {
      panelTransition.value = val;
    }
  }

  function goToPanelByOffset (direction, startIndex = panelIndex.value) {
    let index = startIndex + direction;

    while (index !== -1 && index < panels.length) {
      const opt = panels[ index ];

      if (
        opt !== void 0
        && opt.props.disable !== ''
        && opt.props.disable !== true
      ) {
        updatePanelTransition(direction);
        forcedPanelTransition = true;
        emit('update:modelValue', opt.props.name);
        setTimeout(() => {
          forcedPanelTransition = false;
        });

        return
      }

      index += direction;
    }

    if (props.infinite === true && panels.length !== 0 && startIndex !== -1 && startIndex !== panels.length) {
      goToPanelByOffset(direction, direction === -1 ? panels.length : -1);
    }
  }

  function updatePanelIndex () {
    const index = getPanelIndex(props.modelValue);

    if (panelIndex.value !== index) {
      panelIndex.value = index;
    }

    return true
  }

  function getPanelContentChild () {
    const panel = isValidPanelName(props.modelValue) === true
      && updatePanelIndex()
      && panels[ panelIndex.value ];

    return props.keepAlive === true
      ? [
          h(KeepAlive, keepAliveProps.value, [
            h(
              needsUniqueKeepAliveWrapper.value === true
                ? getCache(contentKey.value, () => ({ ...PanelWrapper, name: contentKey.value }))
                : PanelWrapper,
              { key: contentKey.value, style: transitionStyle.value },
              () => panel
            )
          ])
        ]
      : [
          h('div', {
            class: 'q-panel scroll',
            style: transitionStyle.value,
            key: contentKey.value,
            role: 'tabpanel'
          }, [ panel ])
        ]
  }

  function getPanelContent () {
    if (panels.length === 0) return

    return props.animated === true
      ? [ h(Transition, { name: panelTransition.value }, getPanelContentChild) ]
      : getPanelContentChild()
  }

  function updatePanelsList (slots) {
    panels = getNormalizedVNodes(
      hSlot(slots.default, [])
    ).filter(
      panel => panel.props !== null
        && panel.props.slot === void 0
        && isValidPanelName(panel.props.name) === true
    );

    return panels.length
  }

  function getPanels () {
    return panels
  }

  // expose public methods
  Object.assign(proxy, {
    next: nextPanel,
    previous: previousPanel,
    goTo: goToPanel
  });

  return {
    panelIndex,
    panelDirectives,

    updatePanelsList,
    updatePanelIndex,

    getPanelContent,
    getEnabledPanels,
    getPanels,

    isValidPanelName,

    keepAliveProps,
    needsUniqueKeepAliveWrapper,

    goToPanelByOffset,
    goToPanel,

    nextPanel,
    previousPanel
  }
}

const __nuxt_component_6 = createComponent({
  name: 'QTabPanels',

  props: {
    ...usePanelProps,
    ...useDarkProps
  },

  emits: usePanelEmits,

  setup (props, { slots }) {
    const vm = getCurrentInstance();
    const isDark = useDark(props, vm.proxy.$q);

    const { updatePanelsList, getPanelContent, panelDirectives } = usePanel();

    const classes = computed(() =>
      'q-tab-panels q-panel-parent'
      + (isDark.value === true ? ' q-tab-panels--dark q-dark' : '')
    );

    return () => {
      updatePanelsList(slots);

      return hDir(
        'div',
        { class: classes.value },
        getPanelContent(),
        'pan',
        props.swipeable,
        () => panelDirectives.value
      )
    }
  }
});

const __nuxt_component_7 = createComponent({
  name: 'QTabPanel',

  props: usePanelChildProps,

  setup (_, { slots }) {
    return () => h('div', { class: 'q-tab-panel', role: 'tabpanel' }, hSlot(slots.default))
  }
});

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "download",
  __ssrInlineRender: true,
  setup(__props) {
    const $q = useQuasar();
    const variant_types = ["SNP", "InDel", "SV", "MNV"];
    const qtl_types = ["apaQTL", "eQTL", "meQTL", "sQTL"];
    const tab = ref("apaQTL");
    const downloadData = (params) => {
      queryDownload(params).then((response) => {
        if (response.status !== 200) {
          console.log(response);
          throw new Error(
            `Download failed: ${response.message || "Unknown error"}`
          );
        }
        const contentType = response.headers.get("Content-Type");
        console.log(contentType.startsWith("application/zip"));
        if (contentType && (contentType.startsWith("text/plain") || contentType.startsWith("application/zip") || contentType.startsWith("application/gzip"))) {
          let filename = "downloaded_file";
          let disposition = response.headers.get("Content-Disposition") || "";
          if (disposition) {
            const match = disposition.match(/filename=([^;]+)/);
            if (match && match[1]) {
              filename = decodeURIComponent(match[1].trim());
            }
          }
          const link = (void 0).createElement("a");
          link.href = (void 0).URL.createObjectURL(response._data);
          link.download = filename;
          (void 0).body.appendChild(link);
          link.click();
          (void 0).body.removeChild(link);
          (void 0).URL.revokeObjectURL(link.href);
        }
      }).catch((error) => {
        $q.notify({
          message: error.statusMessage || "Download failed",
          color: "warning",
          position: "bottom",
          timeout: 1e3
        });
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_q_page = __nuxt_component_0;
      const _component_q_card = __nuxt_component_2;
      const _component_q_card_section = __nuxt_component_3;
      const _component_q_btn = __nuxt_component_8;
      const _component_q_tabs = __nuxt_component_2$1;
      const _component_q_tab = __nuxt_component_5;
      const _component_q_tab_panels = __nuxt_component_6;
      const _component_q_tab_panel = __nuxt_component_7;
      _push(ssrRenderComponent(_component_q_page, mergeProps({
        class: "q-mx-auto",
        style: { "min-height": "calc(100vh - 180px)", "margin": "5px auto 0 auto" }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="row" style="${ssrRenderStyle({ "padding": "0 0px" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_q_card, {
              flat: "",
              bordered: "",
              style: { "width": "1140px" },
              class: "col-10 q-mx-auto q-my-sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold" style="${ssrRenderStyle({ "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" })}"${_scopeId2}> 1. Download Variant results </div>`);
                  _push3(ssrRenderComponent(_component_q_card, {
                    flat: "",
                    bordered: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_q_card_section, { class: "q-pa-md q-gutter-md" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(variant_types, (variant_type) => {
                                _push5(ssrRenderComponent(_component_q_btn, {
                                  color: "grey-2",
                                  "text-color": "indigo-8",
                                  key: variant_type,
                                  label: `${variant_type}-data`,
                                  "no-caps": "",
                                  unelevated: "",
                                  size: "15px",
                                  style: { "width": "max-content" },
                                  onClick: ($event) => downloadData({
                                    download_type: "variants",
                                    variant_type,
                                    phenotype_type: null
                                  })
                                }, null, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(), createBlock(Fragment, null, renderList(variant_types, (variant_type) => {
                                  return createVNode(_component_q_btn, {
                                    color: "grey-2",
                                    "text-color": "indigo-8",
                                    key: variant_type,
                                    label: `${variant_type}-data`,
                                    "no-caps": "",
                                    unelevated: "",
                                    size: "15px",
                                    style: { "width": "max-content" },
                                    onClick: ($event) => downloadData({
                                      download_type: "variants",
                                      variant_type,
                                      phenotype_type: null
                                    })
                                  }, null, 8, ["label", "onClick"]);
                                }), 64))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_q_card_section, { class: "q-pa-md q-gutter-md" }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(variant_types, (variant_type) => {
                                return createVNode(_component_q_btn, {
                                  color: "grey-2",
                                  "text-color": "indigo-8",
                                  key: variant_type,
                                  label: `${variant_type}-data`,
                                  "no-caps": "",
                                  unelevated: "",
                                  size: "15px",
                                  style: { "width": "max-content" },
                                  onClick: ($event) => downloadData({
                                    download_type: "variants",
                                    variant_type,
                                    phenotype_type: null
                                  })
                                }, null, 8, ["label", "onClick"]);
                              }), 64))
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", {
                      class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                    }, " 1. Download Variant results "),
                    createVNode(_component_q_card, {
                      flat: "",
                      bordered: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_q_card_section, { class: "q-pa-md q-gutter-md" }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(variant_types, (variant_type) => {
                              return createVNode(_component_q_btn, {
                                color: "grey-2",
                                "text-color": "indigo-8",
                                key: variant_type,
                                label: `${variant_type}-data`,
                                "no-caps": "",
                                unelevated: "",
                                size: "15px",
                                style: { "width": "max-content" },
                                onClick: ($event) => downloadData({
                                  download_type: "variants",
                                  variant_type,
                                  phenotype_type: null
                                })
                              }, null, 8, ["label", "onClick"]);
                            }), 64))
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
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_q_card, {
              flat: "",
              bordered: "",
              style: { "width": "1140px" },
              class: "col-10 q-mx-auto q-my-sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold" style="${ssrRenderStyle({ "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" })}"${_scopeId2}> 2. Download MolQTL results </div>`);
                  _push3(ssrRenderComponent(_component_q_card_section, { class: "no-padding text-body2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_q_tabs, {
                          id: "downloadTab",
                          class: "bg-grey-3",
                          "active-class": "shadow-3 bg-white",
                          "outside-arrows": "",
                          "mobile-arrows": "",
                          "no-caps": "",
                          stretch: "",
                          dense: "",
                          modelValue: unref(tab),
                          "onUpdate:modelValue": ($event) => isRef(tab) ? tab.value = $event : null,
                          align: "left",
                          "narrow-indicator": ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(qtl_types, (qtl_type) => {
                                _push5(ssrRenderComponent(_component_q_tab, {
                                  key: qtl_type,
                                  name: qtl_type,
                                  label: qtl_type,
                                  class: "text-body1 text-bold"
                                }, null, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(), createBlock(Fragment, null, renderList(qtl_types, (qtl_type) => {
                                  return createVNode(_component_q_tab, {
                                    key: qtl_type,
                                    name: qtl_type,
                                    label: qtl_type,
                                    class: "text-body1 text-bold"
                                  }, null, 8, ["name", "label"]);
                                }), 64))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_tab_panels, {
                          modelValue: unref(tab),
                          "onUpdate:modelValue": ($event) => isRef(tab) ? tab.value = $event : null,
                          animated: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(qtl_types, (qtl_type) => {
                                _push5(ssrRenderComponent(_component_q_tab_panel, {
                                  class: "q-gutter-md row",
                                  key: qtl_type,
                                  name: qtl_type
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<!--[-->`);
                                      ssrRenderList(variant_types, (variant_type) => {
                                        _push6(ssrRenderComponent(_component_q_btn, {
                                          key: variant_type,
                                          "no-caps": "",
                                          unelevated: "",
                                          color: "grey-2",
                                          "text-color": "indigo-8",
                                          size: "15px",
                                          label: `${variant_type}-${qtl_type}`,
                                          style: { "width": "max-content" },
                                          onClick: ($event) => downloadData({
                                            download_type: "qtl",
                                            variant_type,
                                            phenotype_type: qtl_type
                                          })
                                        }, null, _parent6, _scopeId5));
                                      });
                                      _push6(`<!--]-->`);
                                    } else {
                                      return [
                                        (openBlock(), createBlock(Fragment, null, renderList(variant_types, (variant_type) => {
                                          return createVNode(_component_q_btn, {
                                            key: variant_type,
                                            "no-caps": "",
                                            unelevated: "",
                                            color: "grey-2",
                                            "text-color": "indigo-8",
                                            size: "15px",
                                            label: `${variant_type}-${qtl_type}`,
                                            style: { "width": "max-content" },
                                            onClick: ($event) => downloadData({
                                              download_type: "qtl",
                                              variant_type,
                                              phenotype_type: qtl_type
                                            })
                                          }, null, 8, ["label", "onClick"]);
                                        }), 64))
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(), createBlock(Fragment, null, renderList(qtl_types, (qtl_type) => {
                                  return createVNode(_component_q_tab_panel, {
                                    class: "q-gutter-md row",
                                    key: qtl_type,
                                    name: qtl_type
                                  }, {
                                    default: withCtx(() => [
                                      (openBlock(), createBlock(Fragment, null, renderList(variant_types, (variant_type) => {
                                        return createVNode(_component_q_btn, {
                                          key: variant_type,
                                          "no-caps": "",
                                          unelevated: "",
                                          color: "grey-2",
                                          "text-color": "indigo-8",
                                          size: "15px",
                                          label: `${variant_type}-${qtl_type}`,
                                          style: { "width": "max-content" },
                                          onClick: ($event) => downloadData({
                                            download_type: "qtl",
                                            variant_type,
                                            phenotype_type: qtl_type
                                          })
                                        }, null, 8, ["label", "onClick"]);
                                      }), 64))
                                    ]),
                                    _: 2
                                  }, 1032, ["name"]);
                                }), 64))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_q_tabs, {
                            id: "downloadTab",
                            class: "bg-grey-3",
                            "active-class": "shadow-3 bg-white",
                            "outside-arrows": "",
                            "mobile-arrows": "",
                            "no-caps": "",
                            stretch: "",
                            dense: "",
                            modelValue: unref(tab),
                            "onUpdate:modelValue": ($event) => isRef(tab) ? tab.value = $event : null,
                            align: "left",
                            "narrow-indicator": ""
                          }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(qtl_types, (qtl_type) => {
                                return createVNode(_component_q_tab, {
                                  key: qtl_type,
                                  name: qtl_type,
                                  label: qtl_type,
                                  class: "text-body1 text-bold"
                                }, null, 8, ["name", "label"]);
                              }), 64))
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(_component_q_tab_panels, {
                            modelValue: unref(tab),
                            "onUpdate:modelValue": ($event) => isRef(tab) ? tab.value = $event : null,
                            animated: ""
                          }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(qtl_types, (qtl_type) => {
                                return createVNode(_component_q_tab_panel, {
                                  class: "q-gutter-md row",
                                  key: qtl_type,
                                  name: qtl_type
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(), createBlock(Fragment, null, renderList(variant_types, (variant_type) => {
                                      return createVNode(_component_q_btn, {
                                        key: variant_type,
                                        "no-caps": "",
                                        unelevated: "",
                                        color: "grey-2",
                                        "text-color": "indigo-8",
                                        size: "15px",
                                        label: `${variant_type}-${qtl_type}`,
                                        style: { "width": "max-content" },
                                        onClick: ($event) => downloadData({
                                          download_type: "qtl",
                                          variant_type,
                                          phenotype_type: qtl_type
                                        })
                                      }, null, 8, ["label", "onClick"]);
                                    }), 64))
                                  ]),
                                  _: 2
                                }, 1032, ["name"]);
                              }), 64))
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", {
                      class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                    }, " 2. Download MolQTL results "),
                    createVNode(_component_q_card_section, { class: "no-padding text-body2" }, {
                      default: withCtx(() => [
                        createVNode(_component_q_tabs, {
                          id: "downloadTab",
                          class: "bg-grey-3",
                          "active-class": "shadow-3 bg-white",
                          "outside-arrows": "",
                          "mobile-arrows": "",
                          "no-caps": "",
                          stretch: "",
                          dense: "",
                          modelValue: unref(tab),
                          "onUpdate:modelValue": ($event) => isRef(tab) ? tab.value = $event : null,
                          align: "left",
                          "narrow-indicator": ""
                        }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(qtl_types, (qtl_type) => {
                              return createVNode(_component_q_tab, {
                                key: qtl_type,
                                name: qtl_type,
                                label: qtl_type,
                                class: "text-body1 text-bold"
                              }, null, 8, ["name", "label"]);
                            }), 64))
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_component_q_tab_panels, {
                          modelValue: unref(tab),
                          "onUpdate:modelValue": ($event) => isRef(tab) ? tab.value = $event : null,
                          animated: ""
                        }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(qtl_types, (qtl_type) => {
                              return createVNode(_component_q_tab_panel, {
                                class: "q-gutter-md row",
                                key: qtl_type,
                                name: qtl_type
                              }, {
                                default: withCtx(() => [
                                  (openBlock(), createBlock(Fragment, null, renderList(variant_types, (variant_type) => {
                                    return createVNode(_component_q_btn, {
                                      key: variant_type,
                                      "no-caps": "",
                                      unelevated: "",
                                      color: "grey-2",
                                      "text-color": "indigo-8",
                                      size: "15px",
                                      label: `${variant_type}-${qtl_type}`,
                                      style: { "width": "max-content" },
                                      onClick: ($event) => downloadData({
                                        download_type: "qtl",
                                        variant_type,
                                        phenotype_type: qtl_type
                                      })
                                    }, null, 8, ["label", "onClick"]);
                                  }), 64))
                                ]),
                                _: 2
                              }, 1032, ["name"]);
                            }), 64))
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_q_card, {
              flat: "",
              bordered: "",
              style: { "width": "1140px" },
              class: "col-10 q-mx-auto q-my-sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold" style="${ssrRenderStyle({ "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" })}"${_scopeId2}> 3. Download GWAS results </div>`);
                  _push3(ssrRenderComponent(_component_q_card, {
                    flat: "",
                    bordered: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_q_card_section, { class: "q-pa-md q-gutter-md" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(variant_types, (variant_type) => {
                                _push5(ssrRenderComponent(_component_q_btn, {
                                  color: "grey-2",
                                  "text-color": "indigo-8",
                                  key: variant_type,
                                  label: `${variant_type}-GWAS`,
                                  "no-caps": "",
                                  unelevated: "",
                                  size: "15px",
                                  style: { "width": "max-content" },
                                  onClick: ($event) => downloadData({
                                    download_type: "gwas",
                                    variant_type,
                                    phenotype_type: null
                                  })
                                }, null, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(), createBlock(Fragment, null, renderList(variant_types, (variant_type) => {
                                  return createVNode(_component_q_btn, {
                                    color: "grey-2",
                                    "text-color": "indigo-8",
                                    key: variant_type,
                                    label: `${variant_type}-GWAS`,
                                    "no-caps": "",
                                    unelevated: "",
                                    size: "15px",
                                    style: { "width": "max-content" },
                                    onClick: ($event) => downloadData({
                                      download_type: "gwas",
                                      variant_type,
                                      phenotype_type: null
                                    })
                                  }, null, 8, ["label", "onClick"]);
                                }), 64))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_q_card_section, { class: "q-pa-md q-gutter-md" }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(variant_types, (variant_type) => {
                                return createVNode(_component_q_btn, {
                                  color: "grey-2",
                                  "text-color": "indigo-8",
                                  key: variant_type,
                                  label: `${variant_type}-GWAS`,
                                  "no-caps": "",
                                  unelevated: "",
                                  size: "15px",
                                  style: { "width": "max-content" },
                                  onClick: ($event) => downloadData({
                                    download_type: "gwas",
                                    variant_type,
                                    phenotype_type: null
                                  })
                                }, null, 8, ["label", "onClick"]);
                              }), 64))
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", {
                      class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                    }, " 3. Download GWAS results "),
                    createVNode(_component_q_card, {
                      flat: "",
                      bordered: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_q_card_section, { class: "q-pa-md q-gutter-md" }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(variant_types, (variant_type) => {
                              return createVNode(_component_q_btn, {
                                color: "grey-2",
                                "text-color": "indigo-8",
                                key: variant_type,
                                label: `${variant_type}-GWAS`,
                                "no-caps": "",
                                unelevated: "",
                                size: "15px",
                                style: { "width": "max-content" },
                                onClick: ($event) => downloadData({
                                  download_type: "gwas",
                                  variant_type,
                                  phenotype_type: null
                                })
                              }, null, 8, ["label", "onClick"]);
                            }), 64))
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
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                class: "row",
                style: { "padding": "0 0px" }
              }, [
                createVNode(_component_q_card, {
                  flat: "",
                  bordered: "",
                  style: { "width": "1140px" },
                  class: "col-10 q-mx-auto q-my-sm"
                }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                    }, " 1. Download Variant results "),
                    createVNode(_component_q_card, {
                      flat: "",
                      bordered: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_q_card_section, { class: "q-pa-md q-gutter-md" }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(variant_types, (variant_type) => {
                              return createVNode(_component_q_btn, {
                                color: "grey-2",
                                "text-color": "indigo-8",
                                key: variant_type,
                                label: `${variant_type}-data`,
                                "no-caps": "",
                                unelevated: "",
                                size: "15px",
                                style: { "width": "max-content" },
                                onClick: ($event) => downloadData({
                                  download_type: "variants",
                                  variant_type,
                                  phenotype_type: null
                                })
                              }, null, 8, ["label", "onClick"]);
                            }), 64))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_q_card, {
                  flat: "",
                  bordered: "",
                  style: { "width": "1140px" },
                  class: "col-10 q-mx-auto q-my-sm"
                }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                    }, " 2. Download MolQTL results "),
                    createVNode(_component_q_card_section, { class: "no-padding text-body2" }, {
                      default: withCtx(() => [
                        createVNode(_component_q_tabs, {
                          id: "downloadTab",
                          class: "bg-grey-3",
                          "active-class": "shadow-3 bg-white",
                          "outside-arrows": "",
                          "mobile-arrows": "",
                          "no-caps": "",
                          stretch: "",
                          dense: "",
                          modelValue: unref(tab),
                          "onUpdate:modelValue": ($event) => isRef(tab) ? tab.value = $event : null,
                          align: "left",
                          "narrow-indicator": ""
                        }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(qtl_types, (qtl_type) => {
                              return createVNode(_component_q_tab, {
                                key: qtl_type,
                                name: qtl_type,
                                label: qtl_type,
                                class: "text-body1 text-bold"
                              }, null, 8, ["name", "label"]);
                            }), 64))
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_component_q_tab_panels, {
                          modelValue: unref(tab),
                          "onUpdate:modelValue": ($event) => isRef(tab) ? tab.value = $event : null,
                          animated: ""
                        }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(qtl_types, (qtl_type) => {
                              return createVNode(_component_q_tab_panel, {
                                class: "q-gutter-md row",
                                key: qtl_type,
                                name: qtl_type
                              }, {
                                default: withCtx(() => [
                                  (openBlock(), createBlock(Fragment, null, renderList(variant_types, (variant_type) => {
                                    return createVNode(_component_q_btn, {
                                      key: variant_type,
                                      "no-caps": "",
                                      unelevated: "",
                                      color: "grey-2",
                                      "text-color": "indigo-8",
                                      size: "15px",
                                      label: `${variant_type}-${qtl_type}`,
                                      style: { "width": "max-content" },
                                      onClick: ($event) => downloadData({
                                        download_type: "qtl",
                                        variant_type,
                                        phenotype_type: qtl_type
                                      })
                                    }, null, 8, ["label", "onClick"]);
                                  }), 64))
                                ]),
                                _: 2
                              }, 1032, ["name"]);
                            }), 64))
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_q_card, {
                  flat: "",
                  bordered: "",
                  style: { "width": "1140px" },
                  class: "col-10 q-mx-auto q-my-sm"
                }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                    }, " 3. Download GWAS results "),
                    createVNode(_component_q_card, {
                      flat: "",
                      bordered: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_q_card_section, { class: "q-pa-md q-gutter-md" }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(variant_types, (variant_type) => {
                              return createVNode(_component_q_btn, {
                                color: "grey-2",
                                "text-color": "indigo-8",
                                key: variant_type,
                                label: `${variant_type}-GWAS`,
                                "no-caps": "",
                                unelevated: "",
                                size: "15px",
                                style: { "width": "max-content" },
                                onClick: ($event) => downloadData({
                                  download_type: "gwas",
                                  variant_type,
                                  phenotype_type: null
                                })
                              }, null, 8, ["label", "onClick"]);
                            }), 64))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/download.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=download.vue.mjs.map

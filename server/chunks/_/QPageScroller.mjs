import { getCurrentInstance, inject, ref, computed, watch, onBeforeUnmount, h, defineComponent, reactive, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, withDirectives, Transition } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrGetDirectiveProps, ssrInterpolate } from 'vue/server-renderer';
import { u as useTabEmits, a as useTabProps, b as useTab, _ as __nuxt_component_2 } from './use-tab.mjs';
import { l as __nuxt_component_4, m as __nuxt_component_5$1, _ as __nuxt_component_6, a as __nuxt_component_7 } from './QList.mjs';
import { g as createComponent, l as layoutKey, j as emptyRenderFn, h as createDirective, f as useQuasar, v as isRuntimeSsrPreHydration } from '../build/server.mjs';
import { Q as QResizeObserver } from './QResizeObserver.mjs';
import { d as hUniqueSlot, h as hSlot, b as hMergeSlot } from './render.mjs';
import { u as useRouterLinkProps, d as useRouterLink, g as getSSRProps } from './QBtn.mjs';
import { b as getScrollTarget, e as setVerticalScrollPosition } from './scroll.mjs';

const headerImage = "" + __buildAssetsURL("header.BgUQoIgX.svg");

const __nuxt_component_0$1 = createComponent({
  name: 'QHeader',

  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    reveal: Boolean,
    revealOffset: {
      type: Number,
      default: 250
    },
    bordered: Boolean,
    elevated: Boolean,

    heightHint: {
      type: [ String, Number ],
      default: 50
    }
  },

  emits: [ 'reveal', 'focusin' ],

  setup (props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance();

    const $layout = inject(layoutKey, emptyRenderFn);
    if ($layout === emptyRenderFn) {
      console.error('QHeader needs to be child of QLayout');
      return emptyRenderFn
    }

    const size = ref(parseInt(props.heightHint, 10));
    const revealed = ref(true);

    const fixed = computed(() =>
      props.reveal === true
      || $layout.view.value.indexOf('H') !== -1
      || ($q.platform.is.ios && $layout.isContainer.value === true)
    );

    const offset = computed(() => {
      if (props.modelValue !== true) {
        return 0
      }
      if (fixed.value === true) {
        return revealed.value === true ? size.value : 0
      }
      const offset = size.value - $layout.scroll.value.position;
      return offset > 0 ? offset : 0
    });

    const hidden = computed(() => props.modelValue !== true
      || (fixed.value === true && revealed.value !== true)
    );

    const revealOnFocus = computed(() =>
      props.modelValue === true && hidden.value === true && props.reveal === true
    );

    const classes = computed(() =>
      'q-header q-layout__section--marginal '
      + (fixed.value === true ? 'fixed' : 'absolute') + '-top'
      + (props.bordered === true ? ' q-header--bordered' : '')
      + (hidden.value === true ? ' q-header--hidden' : '')
      + (props.modelValue !== true ? ' q-layout--prevent-focus' : '')
    );

    const style = computed(() => {
      const
        view = $layout.rows.value.top,
        css = {};

      if (view[ 0 ] === 'l' && $layout.left.space === true) {
        css[ $q.lang.rtl === true ? 'right' : 'left' ] = `${ $layout.left.size }px`;
      }
      if (view[ 2 ] === 'r' && $layout.right.space === true) {
        css[ $q.lang.rtl === true ? 'left' : 'right' ] = `${ $layout.right.size }px`;
      }

      return css
    });

    function updateLayout (prop, val) {
      $layout.update('header', prop, val);
    }

    function updateLocal (prop, val) {
      if (prop.value !== val) {
        prop.value = val;
      }
    }

    function onResize ({ height }) {
      updateLocal(size, height);
      updateLayout('size', height);
    }

    function onFocusin (evt) {
      if (revealOnFocus.value === true) {
        updateLocal(revealed, true);
      }

      emit('focusin', evt);
    }

    watch(() => props.modelValue, val => {
      updateLayout('space', val);
      updateLocal(revealed, true);
      $layout.animate();
    });

    watch(offset, val => {
      updateLayout('offset', val);
    });

    watch(() => props.reveal, val => {
      val === false && updateLocal(revealed, props.modelValue);
    });

    watch(revealed, val => {
      $layout.animate();
      emit('reveal', val);
    });

    watch($layout.scroll, scroll => {
      props.reveal === true && updateLocal(revealed,
        scroll.direction === 'up'
        || scroll.position <= props.revealOffset
        || scroll.position - scroll.inflectionPoint < 100
      );
    });

    const instance = {};

    $layout.instances.header = instance;
    props.modelValue === true && updateLayout('size', size.value);
    updateLayout('space', props.modelValue);
    updateLayout('offset', offset.value);

    onBeforeUnmount(() => {
      if ($layout.instances.header === instance) {
        $layout.instances.header = void 0;
        updateLayout('size', 0);
        updateLayout('offset', 0);
        updateLayout('space', false);
      }
    });

    return () => {
      const child = hUniqueSlot(slots.default, []);

      props.elevated === true && child.push(
        h('div', {
          class: 'q-layout__shadow absolute-full overflow-hidden no-pointer-events'
        })
      );

      child.push(
        h(QResizeObserver, {
          debounce: 0,
          onResize
        })
      );

      return h('header', {
        class: classes.value,
        style: style.value,
        onFocusin
      }, child)
    }
  }
});

const __nuxt_component_1 = createComponent({
  name: 'QToolbar',

  props: {
    inset: Boolean
  },

  setup (props, { slots }) {
    const classes = computed(() =>
      'q-toolbar row no-wrap items-center'
      + (props.inset === true ? ' q-toolbar--inset' : '')
    );

    return () => h('div', { class: classes.value, role: 'toolbar' }, hSlot(slots.default))
  }
});

const __nuxt_component_3 = createComponent({
  name: 'QRouteTab',

  props: {
    ...useRouterLinkProps,
    ...useTabProps
  },

  emits: useTabEmits,

  setup (props, { slots, emit }) {
    const routeData = useRouterLink({
      useDisableForRouterLinkProps: false
    });

    const { renderTab, $tabs } = useTab(
      props,
      slots,
      emit,
      {
        exact: computed(() => props.exact),
        ...routeData
      }
    );

    watch(
      () => `${ props.name } | ${ props.exact } | ${ (routeData.resolvedLink.value || {}).href }`,
      $tabs.verifyRouteModel
    );

    return () => renderTab(routeData.linkTag.value, routeData.linkAttrs.value)
  }
});

const __q_directive_0 = createDirective({ name: 'close-popup', getSSRProps }
  
);

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "header_desktop",
  __ssrInlineRender: true,
  setup(__props) {
    const gwasSubPages = [
      { label: "SNP", path: "/gwas/snp" },
      { label: "MNV", path: "/gwas/mnv" },
      { label: "InDel", path: "/gwas/indel" },
      { label: "SV", path: "/gwas/sv" }
    ];
    const menus = reactive({
      gwas: false
    });
    const hover = reactive({
      gwasTab: false,
      gwasMenu: false
    });
    let closeTimers = {
      gwas: null
    };
    function onHover(key, val) {
      hover[key + "Tab"] = val;
      val ? openMenu(key) : closeMenuWithDelay(key);
    }
    function onMenuHover(key, val) {
      hover[key + "Menu"] = val;
      val ? clearTimeout(closeTimers[key]) : closeMenuWithDelay(key);
    }
    function openMenu(key) {
      clearTimeout(closeTimers[key]);
      menus[key] = true;
    }
    function closeMenuWithDelay(key) {
      closeTimers[key] = setTimeout(() => {
        if (!hover[key + "Tab"] && !hover[key + "Menu"]) {
          menus[key] = false;
        }
      }, 300);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_q_header = __nuxt_component_0$1;
      const _component_q_toolbar = __nuxt_component_1;
      const _component_q_tabs = __nuxt_component_2;
      const _component_q_route_tab = __nuxt_component_3;
      const _component_q_menu = __nuxt_component_4;
      const _component_q_list = __nuxt_component_5$1;
      const _component_q_item = __nuxt_component_6;
      const _component_q_item_section = __nuxt_component_7;
      const _directive_close_popup = __q_directive_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "header-wrapper" }, _attrs))}><div class="header-banner"><img style="${ssrRenderStyle(_ctx.$q.screen.gt.xs ? null : { display: "none" })}"${ssrRenderAttr("src", unref(headerImage))} alt="Header Image" class="header-image"></div>`);
      _push(ssrRenderComponent(_component_q_header, {
        unelevated: "",
        class: "transparent-header"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_q_toolbar, { class: "transparent-toolbar" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="content-container bg-primary"${_scopeId2}><div class="toolbar-content"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_q_tabs, {
                    id: "indexTab",
                    stretch: "",
                    shrink: false,
                    "active-color": "white",
                    "indicator-color": "transparent",
                    class: "navigation-tabs text-white flex-1"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "Home",
                          to: "/",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "Variants",
                          to: "/variants",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "eQTL",
                          to: "/eQTL",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "sQTL",
                          to: "/sQTL",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "apaQTL",
                          to: "/apaQTL",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "meQTL",
                          to: "/meQTL",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "GWAS",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: "",
                          to: "/gwas",
                          onMouseenter: ($event) => onHover("gwas", true),
                          onMouseleave: ($event) => onHover("gwas", false)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_q_menu, {
                                modelValue: menus.gwas,
                                "onUpdate:modelValue": ($event) => menus.gwas = $event,
                                anchor: "bottom middle",
                                self: "top middle",
                                offset: [0, 4],
                                "transition-show": "jump-down",
                                "transition-hide": "jump-up",
                                onMouseenter: ($event) => onMenuHover("gwas", true),
                                onMouseleave: ($event) => onMenuHover("gwas", false),
                                class: "bg-light-purple text-white"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_q_list, { dense: "" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<!--[-->`);
                                          ssrRenderList(gwasSubPages, (sub) => {
                                            _push7(ssrRenderComponent(_component_q_item, mergeProps({
                                              key: sub.label,
                                              clickable: "",
                                              to: sub.path,
                                              class: "qtl-menu-item"
                                            }, ssrGetDirectiveProps(_ctx, _directive_close_popup)), {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_q_item_section, null, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`${ssrInterpolate(sub.label)}`);
                                                      } else {
                                                        return [
                                                          createTextVNode(toDisplayString(sub.label), 1)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_q_item_section, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(sub.label), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          });
                                          _push7(`<!--]-->`);
                                        } else {
                                          return [
                                            (openBlock(), createBlock(Fragment, null, renderList(gwasSubPages, (sub) => {
                                              return withDirectives(createVNode(_component_q_item, {
                                                key: sub.label,
                                                clickable: "",
                                                to: sub.path,
                                                class: "qtl-menu-item"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_q_item_section, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(sub.label), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1032, ["to"]), [
                                                [_directive_close_popup]
                                              ]);
                                            }), 64))
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_q_list, { dense: "" }, {
                                        default: withCtx(() => [
                                          (openBlock(), createBlock(Fragment, null, renderList(gwasSubPages, (sub) => {
                                            return withDirectives(createVNode(_component_q_item, {
                                              key: sub.label,
                                              clickable: "",
                                              to: sub.path,
                                              class: "qtl-menu-item"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_q_item_section, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(sub.label), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["to"]), [
                                              [_directive_close_popup]
                                            ]);
                                          }), 64))
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
                                createVNode(_component_q_menu, {
                                  modelValue: menus.gwas,
                                  "onUpdate:modelValue": ($event) => menus.gwas = $event,
                                  anchor: "bottom middle",
                                  self: "top middle",
                                  offset: [0, 4],
                                  "transition-show": "jump-down",
                                  "transition-hide": "jump-up",
                                  onMouseenter: ($event) => onMenuHover("gwas", true),
                                  onMouseleave: ($event) => onMenuHover("gwas", false),
                                  class: "bg-light-purple text-white"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_q_list, { dense: "" }, {
                                      default: withCtx(() => [
                                        (openBlock(), createBlock(Fragment, null, renderList(gwasSubPages, (sub) => {
                                          return withDirectives(createVNode(_component_q_item, {
                                            key: sub.label,
                                            clickable: "",
                                            to: sub.path,
                                            class: "qtl-menu-item"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_q_item_section, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(sub.label), 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1032, ["to"]), [
                                            [_directive_close_popup]
                                          ]);
                                        }), 64))
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue", "onMouseenter", "onMouseleave"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "Correlation",
                          to: "/correlation",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "Download",
                          to: "/download",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "Help",
                          to: "/help",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_q_route_tab, {
                            label: "Home",
                            to: "/",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "Variants",
                            to: "/variants",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "eQTL",
                            to: "/eQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "sQTL",
                            to: "/sQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "apaQTL",
                            to: "/apaQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "meQTL",
                            to: "/meQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "GWAS",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: "",
                            to: "/gwas",
                            onMouseenter: ($event) => onHover("gwas", true),
                            onMouseleave: ($event) => onHover("gwas", false)
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_q_menu, {
                                modelValue: menus.gwas,
                                "onUpdate:modelValue": ($event) => menus.gwas = $event,
                                anchor: "bottom middle",
                                self: "top middle",
                                offset: [0, 4],
                                "transition-show": "jump-down",
                                "transition-hide": "jump-up",
                                onMouseenter: ($event) => onMenuHover("gwas", true),
                                onMouseleave: ($event) => onMenuHover("gwas", false),
                                class: "bg-light-purple text-white"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_q_list, { dense: "" }, {
                                    default: withCtx(() => [
                                      (openBlock(), createBlock(Fragment, null, renderList(gwasSubPages, (sub) => {
                                        return withDirectives(createVNode(_component_q_item, {
                                          key: sub.label,
                                          clickable: "",
                                          to: sub.path,
                                          class: "qtl-menu-item"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_q_item_section, null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(sub.label), 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1032, ["to"]), [
                                          [_directive_close_popup]
                                        ]);
                                      }), 64))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue", "onMouseenter", "onMouseleave"])
                            ]),
                            _: 1
                          }, 8, ["onMouseenter", "onMouseleave"]),
                          createVNode(_component_q_route_tab, {
                            label: "Correlation",
                            to: "/correlation",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "Download",
                            to: "/download",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "Help",
                            to: "/help",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "content-container bg-primary" }, [
                      createVNode("div", { class: "toolbar-content" }, [
                        createVNode(_component_q_tabs, {
                          id: "indexTab",
                          stretch: "",
                          shrink: false,
                          "active-color": "white",
                          "indicator-color": "transparent",
                          class: "navigation-tabs text-white flex-1"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_q_route_tab, {
                              label: "Home",
                              to: "/",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "Variants",
                              to: "/variants",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "eQTL",
                              to: "/eQTL",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "sQTL",
                              to: "/sQTL",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "apaQTL",
                              to: "/apaQTL",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "meQTL",
                              to: "/meQTL",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "GWAS",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: "",
                              to: "/gwas",
                              onMouseenter: ($event) => onHover("gwas", true),
                              onMouseleave: ($event) => onHover("gwas", false)
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_q_menu, {
                                  modelValue: menus.gwas,
                                  "onUpdate:modelValue": ($event) => menus.gwas = $event,
                                  anchor: "bottom middle",
                                  self: "top middle",
                                  offset: [0, 4],
                                  "transition-show": "jump-down",
                                  "transition-hide": "jump-up",
                                  onMouseenter: ($event) => onMenuHover("gwas", true),
                                  onMouseleave: ($event) => onMenuHover("gwas", false),
                                  class: "bg-light-purple text-white"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_q_list, { dense: "" }, {
                                      default: withCtx(() => [
                                        (openBlock(), createBlock(Fragment, null, renderList(gwasSubPages, (sub) => {
                                          return withDirectives(createVNode(_component_q_item, {
                                            key: sub.label,
                                            clickable: "",
                                            to: sub.path,
                                            class: "qtl-menu-item"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_q_item_section, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(sub.label), 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1032, ["to"]), [
                                            [_directive_close_popup]
                                          ]);
                                        }), 64))
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue", "onMouseenter", "onMouseleave"])
                              ]),
                              _: 1
                            }, 8, ["onMouseenter", "onMouseleave"]),
                            createVNode(_component_q_route_tab, {
                              label: "Correlation",
                              to: "/correlation",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "Download",
                              to: "/download",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "Help",
                              to: "/help",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            })
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_q_toolbar, { class: "transparent-toolbar" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "content-container bg-primary" }, [
                    createVNode("div", { class: "toolbar-content" }, [
                      createVNode(_component_q_tabs, {
                        id: "indexTab",
                        stretch: "",
                        shrink: false,
                        "active-color": "white",
                        "indicator-color": "transparent",
                        class: "navigation-tabs text-white flex-1"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_q_route_tab, {
                            label: "Home",
                            to: "/",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "Variants",
                            to: "/variants",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "eQTL",
                            to: "/eQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "sQTL",
                            to: "/sQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "apaQTL",
                            to: "/apaQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "meQTL",
                            to: "/meQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "GWAS",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: "",
                            to: "/gwas",
                            onMouseenter: ($event) => onHover("gwas", true),
                            onMouseleave: ($event) => onHover("gwas", false)
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_q_menu, {
                                modelValue: menus.gwas,
                                "onUpdate:modelValue": ($event) => menus.gwas = $event,
                                anchor: "bottom middle",
                                self: "top middle",
                                offset: [0, 4],
                                "transition-show": "jump-down",
                                "transition-hide": "jump-up",
                                onMouseenter: ($event) => onMenuHover("gwas", true),
                                onMouseleave: ($event) => onMenuHover("gwas", false),
                                class: "bg-light-purple text-white"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_q_list, { dense: "" }, {
                                    default: withCtx(() => [
                                      (openBlock(), createBlock(Fragment, null, renderList(gwasSubPages, (sub) => {
                                        return withDirectives(createVNode(_component_q_item, {
                                          key: sub.label,
                                          clickable: "",
                                          to: sub.path,
                                          class: "qtl-menu-item"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_q_item_section, null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(sub.label), 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1032, ["to"]), [
                                          [_directive_close_popup]
                                        ]);
                                      }), 64))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue", "onMouseenter", "onMouseleave"])
                            ]),
                            _: 1
                          }, 8, ["onMouseenter", "onMouseleave"]),
                          createVNode(_component_q_route_tab, {
                            label: "Correlation",
                            to: "/correlation",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "Download",
                            to: "/download",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "Help",
                            to: "/help",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          })
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "header_mobile",
  __ssrInlineRender: true,
  setup(__props) {
    const $q = useQuasar();
    $q.dark.mode = "auto";
    const gwasSubPages = [
      { label: "SNP", path: "/gwas/snp" },
      { label: "MNV", path: "/gwas/mnv" },
      { label: "InDel", path: "/gwas/indel" },
      { label: "SV", path: "/gwas/sv" }
    ];
    const menus = reactive({
      gwas: false
    });
    const hover = reactive({
      gwasTab: false,
      gwasMenu: false
    });
    let closeTimers = {
      gwas: null
    };
    function onHover(key, val) {
      hover[key + "Tab"] = val;
      if ($q.platform.is.desktop) {
        val ? openMenu(key) : closeMenuWithDelay(key);
      }
    }
    function onMenuHover(key, val) {
      hover[key + "Menu"] = val;
      if ($q.platform.is.desktop) {
        val ? clearTimeout(closeTimers[key]) : closeMenuWithDelay(key);
      }
    }
    function toggleMenu(key) {
      if (!$q.platform.is.desktop) {
        menus[key] = !menus[key];
      }
    }
    function openMenu(key) {
      clearTimeout(closeTimers[key]);
      menus[key] = true;
    }
    function closeMenuWithDelay(key) {
      closeTimers[key] = setTimeout(() => {
        if (!hover[key + "Tab"] && !hover[key + "Menu"]) {
          menus[key] = false;
        }
      }, 300);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_q_header = __nuxt_component_0$1;
      const _component_q_toolbar = __nuxt_component_1;
      const _component_q_tabs = __nuxt_component_2;
      const _component_q_route_tab = __nuxt_component_3;
      const _component_q_menu = __nuxt_component_4;
      const _component_q_list = __nuxt_component_5$1;
      const _component_q_item = __nuxt_component_6;
      const _component_q_item_section = __nuxt_component_7;
      const _directive_close_popup = __q_directive_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "header-wrapper" }, _attrs))}><div class="header-banner"><img style="${ssrRenderStyle(unref($q).screen.gt.xs ? null : { display: "none" })}"${ssrRenderAttr("src", unref(headerImage))} alt="Header Image" class="header-image"></div>`);
      _push(ssrRenderComponent(_component_q_header, {
        unelevated: "",
        class: "transparent-header"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_q_toolbar, { class: "transparent-toolbar" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="content-container bg-primary"${_scopeId2}><div class="toolbar-content"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_q_tabs, {
                    id: "mobileTab",
                    stretch: "",
                    shrink: true,
                    "active-color": "white",
                    "indicator-color": "transparent",
                    class: "navigation-tabs text-white flex-1"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "Home",
                          to: "/",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "Variants",
                          to: "/variants",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "eQTL",
                          to: "/eQTL",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "apaQTL",
                          to: "/apaQTL",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "sQTL",
                          to: "/sQTL",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "meQTL",
                          to: "/meQTL",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "GWAS",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: "",
                          to: "/gwas",
                          onMouseenter: ($event) => onHover("gwas", true),
                          onMouseleave: ($event) => onHover("gwas", false),
                          onClick: ($event) => toggleMenu("gwas")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_q_menu, {
                                modelValue: menus.gwas,
                                "onUpdate:modelValue": ($event) => menus.gwas = $event,
                                anchor: "bottom middle",
                                self: "top middle",
                                offset: [0, 4],
                                "transition-show": "jump-down",
                                "transition-hide": "jump-up",
                                onMouseenter: ($event) => onMenuHover("gwas", true),
                                onMouseleave: ($event) => onMenuHover("gwas", false),
                                class: "bg-light-purple text-white"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_q_list, { dense: "" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<!--[-->`);
                                          ssrRenderList(gwasSubPages, (sub) => {
                                            _push7(ssrRenderComponent(_component_q_item, mergeProps({
                                              key: sub.label,
                                              clickable: "",
                                              to: sub.path,
                                              class: "qtl-menu-item"
                                            }, ssrGetDirectiveProps(_ctx, _directive_close_popup)), {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_q_item_section, null, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`${ssrInterpolate(sub.label)}`);
                                                      } else {
                                                        return [
                                                          createTextVNode(toDisplayString(sub.label), 1)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_q_item_section, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(sub.label), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          });
                                          _push7(`<!--]-->`);
                                        } else {
                                          return [
                                            (openBlock(), createBlock(Fragment, null, renderList(gwasSubPages, (sub) => {
                                              return withDirectives(createVNode(_component_q_item, {
                                                key: sub.label,
                                                clickable: "",
                                                to: sub.path,
                                                class: "qtl-menu-item"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_q_item_section, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(sub.label), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1032, ["to"]), [
                                                [_directive_close_popup]
                                              ]);
                                            }), 64))
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_q_list, { dense: "" }, {
                                        default: withCtx(() => [
                                          (openBlock(), createBlock(Fragment, null, renderList(gwasSubPages, (sub) => {
                                            return withDirectives(createVNode(_component_q_item, {
                                              key: sub.label,
                                              clickable: "",
                                              to: sub.path,
                                              class: "qtl-menu-item"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_q_item_section, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(sub.label), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["to"]), [
                                              [_directive_close_popup]
                                            ]);
                                          }), 64))
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
                                createVNode(_component_q_menu, {
                                  modelValue: menus.gwas,
                                  "onUpdate:modelValue": ($event) => menus.gwas = $event,
                                  anchor: "bottom middle",
                                  self: "top middle",
                                  offset: [0, 4],
                                  "transition-show": "jump-down",
                                  "transition-hide": "jump-up",
                                  onMouseenter: ($event) => onMenuHover("gwas", true),
                                  onMouseleave: ($event) => onMenuHover("gwas", false),
                                  class: "bg-light-purple text-white"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_q_list, { dense: "" }, {
                                      default: withCtx(() => [
                                        (openBlock(), createBlock(Fragment, null, renderList(gwasSubPages, (sub) => {
                                          return withDirectives(createVNode(_component_q_item, {
                                            key: sub.label,
                                            clickable: "",
                                            to: sub.path,
                                            class: "qtl-menu-item"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_q_item_section, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(sub.label), 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1032, ["to"]), [
                                            [_directive_close_popup]
                                          ]);
                                        }), 64))
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue", "onMouseenter", "onMouseleave"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "Correlation",
                          to: "/correlation",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "Download",
                          to: "/download",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_route_tab, {
                          label: "Help",
                          to: "/help",
                          class: "nav-tab nav-button",
                          "no-caps": "",
                          unelevated: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_q_route_tab, {
                            label: "Home",
                            to: "/",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "Variants",
                            to: "/variants",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "eQTL",
                            to: "/eQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "apaQTL",
                            to: "/apaQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "sQTL",
                            to: "/sQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "meQTL",
                            to: "/meQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "GWAS",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: "",
                            to: "/gwas",
                            onMouseenter: ($event) => onHover("gwas", true),
                            onMouseleave: ($event) => onHover("gwas", false),
                            onClick: ($event) => toggleMenu("gwas")
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_q_menu, {
                                modelValue: menus.gwas,
                                "onUpdate:modelValue": ($event) => menus.gwas = $event,
                                anchor: "bottom middle",
                                self: "top middle",
                                offset: [0, 4],
                                "transition-show": "jump-down",
                                "transition-hide": "jump-up",
                                onMouseenter: ($event) => onMenuHover("gwas", true),
                                onMouseleave: ($event) => onMenuHover("gwas", false),
                                class: "bg-light-purple text-white"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_q_list, { dense: "" }, {
                                    default: withCtx(() => [
                                      (openBlock(), createBlock(Fragment, null, renderList(gwasSubPages, (sub) => {
                                        return withDirectives(createVNode(_component_q_item, {
                                          key: sub.label,
                                          clickable: "",
                                          to: sub.path,
                                          class: "qtl-menu-item"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_q_item_section, null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(sub.label), 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1032, ["to"]), [
                                          [_directive_close_popup]
                                        ]);
                                      }), 64))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue", "onMouseenter", "onMouseleave"])
                            ]),
                            _: 1
                          }, 8, ["onMouseenter", "onMouseleave", "onClick"]),
                          createVNode(_component_q_route_tab, {
                            label: "Correlation",
                            to: "/correlation",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "Download",
                            to: "/download",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "Help",
                            to: "/help",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "content-container bg-primary" }, [
                      createVNode("div", { class: "toolbar-content" }, [
                        createVNode(_component_q_tabs, {
                          id: "mobileTab",
                          stretch: "",
                          shrink: true,
                          "active-color": "white",
                          "indicator-color": "transparent",
                          class: "navigation-tabs text-white flex-1"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_q_route_tab, {
                              label: "Home",
                              to: "/",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "Variants",
                              to: "/variants",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "eQTL",
                              to: "/eQTL",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "apaQTL",
                              to: "/apaQTL",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "sQTL",
                              to: "/sQTL",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "meQTL",
                              to: "/meQTL",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "GWAS",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: "",
                              to: "/gwas",
                              onMouseenter: ($event) => onHover("gwas", true),
                              onMouseleave: ($event) => onHover("gwas", false),
                              onClick: ($event) => toggleMenu("gwas")
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_q_menu, {
                                  modelValue: menus.gwas,
                                  "onUpdate:modelValue": ($event) => menus.gwas = $event,
                                  anchor: "bottom middle",
                                  self: "top middle",
                                  offset: [0, 4],
                                  "transition-show": "jump-down",
                                  "transition-hide": "jump-up",
                                  onMouseenter: ($event) => onMenuHover("gwas", true),
                                  onMouseleave: ($event) => onMenuHover("gwas", false),
                                  class: "bg-light-purple text-white"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_q_list, { dense: "" }, {
                                      default: withCtx(() => [
                                        (openBlock(), createBlock(Fragment, null, renderList(gwasSubPages, (sub) => {
                                          return withDirectives(createVNode(_component_q_item, {
                                            key: sub.label,
                                            clickable: "",
                                            to: sub.path,
                                            class: "qtl-menu-item"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_q_item_section, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(sub.label), 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1032, ["to"]), [
                                            [_directive_close_popup]
                                          ]);
                                        }), 64))
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue", "onMouseenter", "onMouseleave"])
                              ]),
                              _: 1
                            }, 8, ["onMouseenter", "onMouseleave", "onClick"]),
                            createVNode(_component_q_route_tab, {
                              label: "Correlation",
                              to: "/correlation",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "Download",
                              to: "/download",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            }),
                            createVNode(_component_q_route_tab, {
                              label: "Help",
                              to: "/help",
                              class: "nav-tab nav-button",
                              "no-caps": "",
                              unelevated: ""
                            })
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_q_toolbar, { class: "transparent-toolbar" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "content-container bg-primary" }, [
                    createVNode("div", { class: "toolbar-content" }, [
                      createVNode(_component_q_tabs, {
                        id: "mobileTab",
                        stretch: "",
                        shrink: true,
                        "active-color": "white",
                        "indicator-color": "transparent",
                        class: "navigation-tabs text-white flex-1"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_q_route_tab, {
                            label: "Home",
                            to: "/",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "Variants",
                            to: "/variants",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "eQTL",
                            to: "/eQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "apaQTL",
                            to: "/apaQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "sQTL",
                            to: "/sQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "meQTL",
                            to: "/meQTL",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "GWAS",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: "",
                            to: "/gwas",
                            onMouseenter: ($event) => onHover("gwas", true),
                            onMouseleave: ($event) => onHover("gwas", false),
                            onClick: ($event) => toggleMenu("gwas")
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_q_menu, {
                                modelValue: menus.gwas,
                                "onUpdate:modelValue": ($event) => menus.gwas = $event,
                                anchor: "bottom middle",
                                self: "top middle",
                                offset: [0, 4],
                                "transition-show": "jump-down",
                                "transition-hide": "jump-up",
                                onMouseenter: ($event) => onMenuHover("gwas", true),
                                onMouseleave: ($event) => onMenuHover("gwas", false),
                                class: "bg-light-purple text-white"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_q_list, { dense: "" }, {
                                    default: withCtx(() => [
                                      (openBlock(), createBlock(Fragment, null, renderList(gwasSubPages, (sub) => {
                                        return withDirectives(createVNode(_component_q_item, {
                                          key: sub.label,
                                          clickable: "",
                                          to: sub.path,
                                          class: "qtl-menu-item"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_q_item_section, null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(sub.label), 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1032, ["to"]), [
                                          [_directive_close_popup]
                                        ]);
                                      }), 64))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue", "onMouseenter", "onMouseleave"])
                            ]),
                            _: 1
                          }, 8, ["onMouseenter", "onMouseleave", "onClick"]),
                          createVNode(_component_q_route_tab, {
                            label: "Correlation",
                            to: "/correlation",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "Download",
                            to: "/download",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          }),
                          createVNode(_component_q_route_tab, {
                            label: "Help",
                            to: "/help",
                            class: "nav-tab nav-button",
                            "no-caps": "",
                            unelevated: ""
                          })
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});

const __nuxt_component_0 = createComponent({
  name: 'QFooter',

  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    reveal: Boolean,
    bordered: Boolean,
    elevated: Boolean,

    heightHint: {
      type: [ String, Number ],
      default: 50
    }
  },

  emits: [ 'reveal', 'focusin' ],

  setup (props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance();

    const $layout = inject(layoutKey, emptyRenderFn);
    if ($layout === emptyRenderFn) {
      console.error('QFooter needs to be child of QLayout');
      return emptyRenderFn
    }

    const size = ref(parseInt(props.heightHint, 10));
    const revealed = ref(true);
    const windowHeight = ref(
      isRuntimeSsrPreHydration.value === true || $layout.isContainer.value === true
        ? 0
        : window.innerHeight
    );

    const fixed = computed(() =>
      props.reveal === true
      || $layout.view.value.indexOf('F') !== -1
      || ($q.platform.is.ios && $layout.isContainer.value === true)
    );

    const containerHeight = computed(() => (
      $layout.isContainer.value === true
        ? $layout.containerHeight.value
        : windowHeight.value
    ));

    const offset = computed(() => {
      if (props.modelValue !== true) {
        return 0
      }
      if (fixed.value === true) {
        return revealed.value === true ? size.value : 0
      }
      const offset = $layout.scroll.value.position + containerHeight.value + size.value - $layout.height.value;
      return offset > 0 ? offset : 0
    });

    const hidden = computed(() =>
      props.modelValue !== true || (fixed.value === true && revealed.value !== true)
    );

    const revealOnFocus = computed(() =>
      props.modelValue === true && hidden.value === true && props.reveal === true
    );

    const classes = computed(() =>
      'q-footer q-layout__section--marginal '
      + (fixed.value === true ? 'fixed' : 'absolute') + '-bottom'
      + (props.bordered === true ? ' q-footer--bordered' : '')
      + (hidden.value === true ? ' q-footer--hidden' : '')
      + (
        props.modelValue !== true
          ? ' q-layout--prevent-focus' + (fixed.value !== true ? ' hidden' : '')
          : ''
      )
    );

    const style = computed(() => {
      const
        view = $layout.rows.value.bottom,
        css = {};

      if (view[ 0 ] === 'l' && $layout.left.space === true) {
        css[ $q.lang.rtl === true ? 'right' : 'left' ] = `${ $layout.left.size }px`;
      }
      if (view[ 2 ] === 'r' && $layout.right.space === true) {
        css[ $q.lang.rtl === true ? 'left' : 'right' ] = `${ $layout.right.size }px`;
      }

      return css
    });

    function updateLayout (prop, val) {
      $layout.update('footer', prop, val);
    }

    function updateLocal (prop, val) {
      if (prop.value !== val) {
        prop.value = val;
      }
    }

    function onResize ({ height }) {
      updateLocal(size, height);
      updateLayout('size', height);
    }

    function updateRevealed () {
      if (props.reveal !== true) return

      const { direction, position, inflectionPoint } = $layout.scroll.value;

      updateLocal(revealed, (
        direction === 'up'
        || position - inflectionPoint < 100
        || $layout.height.value - containerHeight.value - position - size.value < 300
      ));
    }

    function onFocusin (evt) {
      if (revealOnFocus.value === true) {
        updateLocal(revealed, true);
      }

      emit('focusin', evt);
    }

    watch(() => props.modelValue, val => {
      updateLayout('space', val);
      updateLocal(revealed, true);
      $layout.animate();
    });

    watch(offset, val => {
      updateLayout('offset', val);
    });

    watch(() => props.reveal, val => {
      val === false && updateLocal(revealed, props.modelValue);
    });

    watch(revealed, val => {
      $layout.animate();
      emit('reveal', val);
    });

    watch([ size, $layout.scroll, $layout.height ], updateRevealed);

    watch(() => $q.screen.height, val => {
      $layout.isContainer.value !== true && updateLocal(windowHeight, val);
    });

    const instance = {};

    $layout.instances.footer = instance;
    props.modelValue === true && updateLayout('size', size.value);
    updateLayout('space', props.modelValue);
    updateLayout('offset', offset.value);

    onBeforeUnmount(() => {
      if ($layout.instances.footer === instance) {
        $layout.instances.footer = void 0;
        updateLayout('size', 0);
        updateLayout('offset', 0);
        updateLayout('space', false);
      }
    });

    return () => {
      const child = hMergeSlot(slots.default, [
        h(QResizeObserver, {
          debounce: 0,
          onResize
        })
      ]);

      props.elevated === true && child.push(
        h('div', {
          class: 'q-layout__shadow absolute-full overflow-hidden no-pointer-events'
        })
      );

      return h('footer', {
        class: classes.value,
        style: style.value,
        onFocusin
      }, child)
    }
  }
});

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "footer",
  __ssrInlineRender: true,
  setup(__props) {
    const $q = useQuasar();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_QFooter = __nuxt_component_0;
      _push(ssrRenderComponent(_component_QFooter, mergeProps({
        bordered: unref($q).dark.isActive,
        class: ["row text-center q-pa-md justify-center", unref($q).dark.isActive ? "text-grey-2 bg-dark" : "text-grey-7 bg-grey-3"]
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="col-12"${_scopeId}>${ssrInterpolate("Copyright © 2024 The Gong Lab. All rights reserved.")}</div>`);
          } else {
            return [
              createVNode("div", { class: "col-12" }, toDisplayString("Copyright © 2024 The Gong Lab. All rights reserved."))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

const usePageStickyProps = {
  position: {
    type: String,
    default: 'bottom-right',
    validator: v => [
      'top-right', 'top-left',
      'bottom-right', 'bottom-left',
      'top', 'right', 'bottom', 'left'
    ].includes(v)
  },
  offset: {
    type: Array,
    validator: v => v.length === 2
  },
  expand: Boolean
};

function usePageSticky () {
  const { props, proxy: { $q } } = getCurrentInstance();

  const $layout = inject(layoutKey, emptyRenderFn);
  if ($layout === emptyRenderFn) {
    console.error('QPageSticky needs to be child of QLayout');
    return emptyRenderFn
  }

  const attach = computed(() => {
    const pos = props.position;

    return {
      top: pos.indexOf('top') !== -1,
      right: pos.indexOf('right') !== -1,
      bottom: pos.indexOf('bottom') !== -1,
      left: pos.indexOf('left') !== -1,
      vertical: pos === 'top' || pos === 'bottom',
      horizontal: pos === 'left' || pos === 'right'
    }
  });

  const top = computed(() => $layout.header.offset);
  const right = computed(() => $layout.right.offset);
  const bottom = computed(() => $layout.footer.offset);
  const left = computed(() => $layout.left.offset);

  const style = computed(() => {
    let posX = 0, posY = 0;

    const side = attach.value;
    const dir = $q.lang.rtl === true ? -1 : 1;

    if (side.top === true && top.value !== 0) {
      posY = `${ top.value }px`;
    }
    else if (side.bottom === true && bottom.value !== 0) {
      posY = `${ -bottom.value }px`;
    }

    if (side.left === true && left.value !== 0) {
      posX = `${ dir * left.value }px`;
    }
    else if (side.right === true && right.value !== 0) {
      posX = `${ -dir * right.value }px`;
    }

    const css = { transform: `translate(${ posX }, ${ posY })` };

    if (props.offset) {
      css.margin = `${ props.offset[ 1 ] }px ${ props.offset[ 0 ] }px`;
    }

    if (side.vertical === true) {
      if (left.value !== 0) {
        css[ $q.lang.rtl === true ? 'right' : 'left' ] = `${ left.value }px`;
      }
      if (right.value !== 0) {
        css[ $q.lang.rtl === true ? 'left' : 'right' ] = `${ right.value }px`;
      }
    }
    else if (side.horizontal === true) {
      if (top.value !== 0) {
        css.top = `${ top.value }px`;
      }
      if (bottom.value !== 0) {
        css.bottom = `${ bottom.value }px`;
      }
    }

    return css
  });

  const classes = computed(() =>
    `q-page-sticky row flex-center fixed-${ props.position }`
    + ` q-page-sticky--${ props.expand === true ? 'expand' : 'shrink' }`
  );

  function getStickyContent (slots) {
    const content = hSlot(slots.default);

    return h('div', {
      class: classes.value,
      style: style.value
    },
    props.expand === true
      ? content
      : [ h('div', content) ]
    )
  }

  return {
    $layout,
    getStickyContent
  }
}

const __nuxt_component_5 = createComponent({
  name: 'QPageScroller',

  props: {
    ...usePageStickyProps,

    scrollOffset: {
      type: Number,
      default: 1000
    },

    reverse: Boolean,

    duration: {
      type: Number,
      default: 300
    },

    offset: {
      ...usePageStickyProps.offset,
      default: () => [ 18, 18 ]
    }
  },

  emits: [ 'click' ],

  setup (props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance();
    const { $layout, getStickyContent } = usePageSticky();
    const rootRef = ref(null);

    let heightWatcher;

    const scrollHeight = computed(() => $layout.height.value - (
      $layout.isContainer.value === true
        ? $layout.containerHeight.value
        : $q.screen.height
    ));

    function isVisible () {
      return props.reverse === true
        ? scrollHeight.value - $layout.scroll.value.position > props.scrollOffset
        : $layout.scroll.value.position > props.scrollOffset
    }

    const showing = ref(isVisible());

    function updateVisibility () {
      const newVal = isVisible();
      if (showing.value !== newVal) {
        showing.value = newVal;
      }
    }

    function updateReverse () {
      if (props.reverse === true) {
        if (heightWatcher === void 0) {
          heightWatcher = watch(scrollHeight, updateVisibility);
        }
      }
      else {
        cleanup();
      }
    }

    watch($layout.scroll, updateVisibility);
    watch(() => props.reverse, updateReverse);

    function cleanup () {
      if (heightWatcher !== void 0) {
        heightWatcher();
        heightWatcher = void 0;
      }
    }

    function onClick (e) {
      const target = getScrollTarget(
        $layout.isContainer.value === true
          ? rootRef.value
          : $layout.rootRef.value
      );

      setVerticalScrollPosition(
        target,
        props.reverse === true ? $layout.height.value : 0,
        props.duration
      );

      emit('click', e);
    }

    function getContent () {
      return showing.value === true
        ? h('div', {
          ref: rootRef,
          class: 'q-page-scroller',
          onClick
        }, getStickyContent(slots))
        : null
    }

    updateReverse();

    onBeforeUnmount(cleanup);

    return () => h(
      Transition,
      { name: 'q-transition--fade' },
      getContent
    )
  }
});

export { _sfc_main$2 as _, _sfc_main$1 as a, __nuxt_component_5 as b, _sfc_main as c };
//# sourceMappingURL=QPageScroller.mjs.map

import { f as useQuasar, G as __nuxt_component_4, _ as _export_sfc } from './server.mjs';
import { defineComponent, ref, mergeProps, withCtx, unref, createVNode, createBlock, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { _ as _sfc_main$1, a as _sfc_main$2, b as __nuxt_component_5, c as _sfc_main$3 } from '../_/QPageScroller.mjs';
import { _ as __nuxt_component_0, a as __nuxt_component_3 } from '../_/QPageContainer.mjs';
import { _ as __nuxt_component_8 } from '../_/QBtn.mjs';
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
import '../_/use-tab.mjs';
import '../_/QIcon.mjs';
import '../_/render.mjs';
import '../_/QResizeObserver.mjs';
import '../_/uid.mjs';
import '../_/QList.mjs';
import '../_/use-dark.mjs';
import '../_/scroll.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default copy",
  __ssrInlineRender: true,
  setup(__props) {
    const current_page = ref("Home");
    const tabs = [
      { label: "Variants", path: "/variants" },
      { label: "MolQTL", path: "/qtl" },
      { label: "GWAS", path: "/gwas" },
      { label: "Correlation", path: "/correlation" },
      { label: "Download", path: "/download" },
      { label: "Help", path: "/help" }
    ];
    const $q = useQuasar();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_q_layout = __nuxt_component_0;
      const _component_Header_desktop = _sfc_main$1;
      const _component_Header_mobile = _sfc_main$2;
      const _component_q_page_container = __nuxt_component_3;
      const _component_NuxtPage = __nuxt_component_4;
      const _component_q_page_scroller = __nuxt_component_5;
      const _component_q_btn = __nuxt_component_8;
      const _component_Footer = _sfc_main$3;
      _push(ssrRenderComponent(_component_q_layout, mergeProps({
        view: "lHh LpR lff",
        class: "q-mx-auto no-spacing"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref($q).screen.gt.xs) {
              _push2(ssrRenderComponent(_component_Header_desktop, {
                pages: tabs,
                current_page: current_page.value,
                "onUpdate:current_page": ($event) => current_page.value = $event
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_Header_mobile, {
                pages: tabs,
                current_page: current_page.value,
                "onUpdate:current_page": ($event) => current_page.value = $event
              }, null, _parent2, _scopeId));
            }
            _push2(ssrRenderComponent(_component_q_page_container, { class: "no-padding" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_NuxtPage, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_q_page_scroller, {
                    position: "bottom-right",
                    "scroll-offset": 60,
                    offset: [80, 100]
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_q_btn, {
                          round: "",
                          unelevated: "",
                          icon: "keyboard_arrow_up",
                          color: "primary",
                          size: "md"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_q_btn, {
                            round: "",
                            unelevated: "",
                            icon: "keyboard_arrow_up",
                            color: "primary",
                            size: "md"
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_NuxtPage),
                    createVNode(_component_q_page_scroller, {
                      position: "bottom-right",
                      "scroll-offset": 60,
                      offset: [80, 100]
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_q_btn, {
                          round: "",
                          unelevated: "",
                          icon: "keyboard_arrow_up",
                          color: "primary",
                          size: "md"
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Footer, null, null, _parent2, _scopeId));
          } else {
            return [
              unref($q).screen.gt.xs ? (openBlock(), createBlock(_component_Header_desktop, {
                key: 0,
                pages: tabs,
                current_page: current_page.value,
                "onUpdate:current_page": ($event) => current_page.value = $event
              }, null, 8, ["current_page", "onUpdate:current_page"])) : (openBlock(), createBlock(_component_Header_mobile, {
                key: 1,
                pages: tabs,
                current_page: current_page.value,
                "onUpdate:current_page": ($event) => current_page.value = $event
              }, null, 8, ["current_page", "onUpdate:current_page"])),
              createVNode(_component_q_page_container, { class: "no-padding" }, {
                default: withCtx(() => [
                  createVNode(_component_NuxtPage),
                  createVNode(_component_q_page_scroller, {
                    position: "bottom-right",
                    "scroll-offset": 60,
                    offset: [80, 100]
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_q_btn, {
                        round: "",
                        unelevated: "",
                        icon: "keyboard_arrow_up",
                        color: "primary",
                        size: "md"
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_Footer)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default copy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const default_copy = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cb8e2eb7"]]);

export { default_copy as default };
//# sourceMappingURL=default copy.vue.mjs.map

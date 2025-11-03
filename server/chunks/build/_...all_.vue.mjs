import { mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { f as useQuasar } from './server.mjs';
import { _ as __nuxt_component_0 } from '../_/QPage.mjs';
import { _ as __nuxt_component_1 } from '../_/QToggle.mjs';
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
import '../_/render.mjs';
import '../_/QIcon.mjs';
import '../_/use-checkbox.mjs';
import '../_/use-dark.mjs';

const _sfc_main = {
  __name: "[...all]",
  __ssrInlineRender: true,
  setup(__props) {
    const { dark } = useQuasar();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_q_page = __nuxt_component_0;
      const _component_q_toggle = __nuxt_component_1;
      const _component_q_btn = __nuxt_component_8;
      _push(ssrRenderComponent(_component_q_page, mergeProps({ class: "q-pl-lg" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="fullscreen text-center q-pa-md flex flex-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_q_toggle, {
              "model-value": unref(dark).isActive,
              "checked-icon": "dark_mode",
              "unchecked-icon": "light_mode",
              size: "3rem",
              "onUpdate:modelValue": (val) => unref(dark).set(val)
            }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><div style="${ssrRenderStyle({ "font-size": "30vh" })}"${_scopeId}>404</div><div class="text-h2" style="${ssrRenderStyle({ "opacity": "0.4" })}"${_scopeId}>Oops. Nothing here...</div>`);
            _push2(ssrRenderComponent(_component_q_btn, {
              class: "q-mt-xl",
              color: "white",
              "text-color": "blue",
              unelevated: "",
              to: "/",
              label: "Go Home",
              "no-caps": ""
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "fullscreen text-center q-pa-md flex flex-center" }, [
                createVNode(_component_q_toggle, {
                  "model-value": unref(dark).isActive,
                  "checked-icon": "dark_mode",
                  "unchecked-icon": "light_mode",
                  size: "3rem",
                  "onUpdate:modelValue": (val) => unref(dark).set(val)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                createVNode("div", null, [
                  createVNode("div", { style: { "font-size": "30vh" } }, "404"),
                  createVNode("div", {
                    class: "text-h2",
                    style: { "opacity": "0.4" }
                  }, "Oops. Nothing here..."),
                  createVNode(_component_q_btn, {
                    class: "q-mt-xl",
                    color: "white",
                    "text-color": "blue",
                    unelevated: "",
                    to: "/",
                    label: "Go Home",
                    "no-caps": ""
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[...all].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_...all_.vue.mjs.map

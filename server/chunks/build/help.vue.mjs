import { computed, h, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';
import { g as createComponent, _ as _export_sfc } from './server.mjs';
import { _ as __nuxt_component_0 } from '../_/QPage.mjs';
import { _ as __nuxt_component_2 } from '../_/QCard.mjs';
import { b as hMergeSlot } from '../_/render.mjs';
import { _ as __nuxt_component_3 } from '../_/QSeparator.mjs';
import { _ as __nuxt_component_4 } from '../_/QIcon.mjs';
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
import '../_/use-dark.mjs';

const _imports_0 = "" + __buildAssetsURL("pipeline.btn_ODVM.png");

const _imports_1 = "" + __buildAssetsURL("query.D3hT51PF.png");

const _imports_2 = "" + __buildAssetsURL("plot.q2nKawK2.png");

const _imports_3 = "" + __buildAssetsURL("download.BtRCTYZy.png");

const alignValues = [ 'top', 'middle', 'bottom' ];

const __nuxt_component_2$1 = createComponent({
  name: 'QBadge',

  props: {
    color: String,
    textColor: String,

    floating: Boolean,
    transparent: Boolean,
    multiLine: Boolean,
    outline: Boolean,
    rounded: Boolean,

    label: [ Number, String ],

    align: {
      type: String,
      validator: v => alignValues.includes(v)
    }
  },

  setup (props, { slots }) {
    const style = computed(() => {
      return props.align !== void 0
        ? { verticalAlign: props.align }
        : null
    });

    const classes = computed(() => {
      const text = props.outline === true
        ? props.color || props.textColor
        : props.textColor;

      return 'q-badge flex inline items-center no-wrap'
        + ` q-badge--${ props.multiLine === true ? 'multi' : 'single' }-line`
        + (props.outline === true
          ? ' q-badge--outline'
          : (props.color !== void 0 ? ` bg-${ props.color }` : '')
        )
        + (text !== void 0 ? ` text-${ text }` : '')
        + (props.floating === true ? ' q-badge--floating' : '')
        + (props.rounded === true ? ' q-badge--rounded' : '')
        + (props.transparent === true ? ' q-badge--transparent' : '')
    });

    return () => h('div', {
      class: classes.value,
      style: style.value,
      role: 'status',
      'aria-label': props.label
    }, hMergeSlot(slots.default, props.label !== void 0 ? [ props.label ] : []))
  }
});

const _sfc_main = {
  __name: "help",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_q_page = __nuxt_component_0;
      const _component_q_card = __nuxt_component_2;
      const _component_q_badge = __nuxt_component_2$1;
      const _component_q_separator = __nuxt_component_3;
      const _component_q_icon = __nuxt_component_4;
      _push(ssrRenderComponent(_component_q_page, mergeProps({
        style: { "min-height": "calc(100vh - 125px)", "margin": "5px auto 0 auto" },
        class: "q-pa-md"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${ssrRenderClass([{
              "bg-indigo-10": _ctx.$q.dark.isActive,
              "bg-white text-indigo-8": !_ctx.$q.dark.isActive
            }, "row"])}" style="${ssrRenderStyle({ "padding": "0 calc((100vw - 1180px) / 2)" })}" data-v-09eafd3f${_scopeId}><div class="col-11 col-sm-12 q-px-md" data-v-09eafd3f${_scopeId}>`);
            _push2(ssrRenderComponent(_component_q_card, { class: "col-12 q-mt-sm" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold" style="${ssrRenderStyle({ "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" })}" data-v-09eafd3f${_scopeId2}> About CV-QTLdb </div><div class="row q-pa-md q-my-xs text-body1 text-justify" data-v-09eafd3f${_scopeId2}><div class="col-12" data-v-09eafd3f${_scopeId2}><p style="${ssrRenderStyle({ "font-size": "18px", "line-height": "1.5" })}" data-v-09eafd3f${_scopeId2}> CV-QTLdb is a specialized database that systematically integrates genetic variation data with molecular quantitative trait loci (MolQTL) information derived from a cohort of 148 Chinese individuals. This resource captures complex associations across multiple biological layers, including: </p><ul class="custom-list" data-v-09eafd3f${_scopeId2}><li data-v-09eafd3f${_scopeId2}><span class="text-bold text-primary" style="${ssrRenderStyle({ "font-size": "18px", "line-height": "1" })}" data-v-09eafd3f${_scopeId2}>Genetic variants</span>: four types of genomic variations (SNVs, MNVs, InDels, and SVs)</li><li data-v-09eafd3f${_scopeId2}><span class="text-bold text-primary" style="${ssrRenderStyle({ "font-size": "18px", "line-height": "1" })}" data-v-09eafd3f${_scopeId2}>Molecular phenotypes</span>: four types of molecular phenotypes (Gene expression, Alternative polyadenylation, Alternative splicing, DNA methylation)</li><li data-v-09eafd3f${_scopeId2}><span class="text-bold text-primary" style="${ssrRenderStyle({ "font-size": "18px", "line-height": "1" })}" data-v-09eafd3f${_scopeId2}>Clinical data</span>: six types of comprehensive health indicators (Pathology, Nutrition, Toxin, Measurement, Hormone, Questionnaire)</li></ul></div></div>`);
                } else {
                  return [
                    createVNode("div", {
                      class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                    }, " About CV-QTLdb "),
                    createVNode("div", { class: "row q-pa-md q-my-xs text-body1 text-justify" }, [
                      createVNode("div", { class: "col-12" }, [
                        createVNode("p", { style: { "font-size": "18px", "line-height": "1.5" } }, " CV-QTLdb is a specialized database that systematically integrates genetic variation data with molecular quantitative trait loci (MolQTL) information derived from a cohort of 148 Chinese individuals. This resource captures complex associations across multiple biological layers, including: "),
                        createVNode("ul", { class: "custom-list" }, [
                          createVNode("li", null, [
                            createVNode("span", {
                              class: "text-bold text-primary",
                              style: { "font-size": "18px", "line-height": "1" }
                            }, "Genetic variants"),
                            createTextVNode(": four types of genomic variations (SNVs, MNVs, InDels, and SVs)")
                          ]),
                          createVNode("li", null, [
                            createVNode("span", {
                              class: "text-bold text-primary",
                              style: { "font-size": "18px", "line-height": "1" }
                            }, "Molecular phenotypes"),
                            createTextVNode(": four types of molecular phenotypes (Gene expression, Alternative polyadenylation, Alternative splicing, DNA methylation)")
                          ]),
                          createVNode("li", null, [
                            createVNode("span", {
                              class: "text-bold text-primary",
                              style: { "font-size": "18px", "line-height": "1" }
                            }, "Clinical data"),
                            createTextVNode(": six types of comprehensive health indicators (Pathology, Nutrition, Toxin, Measurement, Hormone, Questionnaire)")
                          ])
                        ])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_q_card, { class: "col-12 q-mt-md" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold" style="${ssrRenderStyle({ "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" })}" data-v-09eafd3f${_scopeId2}> Analysis pipeline </div><div class="row q-pa-md q-my-xs text-body text-justify" data-v-09eafd3f${_scopeId2}><div class="col-12" data-v-09eafd3f${_scopeId2}><p style="${ssrRenderStyle({ "font-size": "18px", "line-height": "1.5" })}" data-v-09eafd3f${_scopeId2}> The research workflow is illustrated in <span class="text-bold text-primary" data-v-09eafd3f${_scopeId2}>Figure 1</span>, which consists of four main components: data acquisition, ​variant identification, ​molecular phenotype characterization, and ​QTL analysis. </p><div class="row justify-around" data-v-09eafd3f${_scopeId2}><div class="col-12 q-mt-sm q-mb-md text-body1 text-center" style="${ssrRenderStyle({ "max-height": "390px" })}" data-v-09eafd3f${_scopeId2}><img${ssrRenderAttr("src", _imports_0)} style="${ssrRenderStyle({ "width": "100%", "max-width": "1140px", "object-fit": "contain" })}" data-v-09eafd3f${_scopeId2}><div class="col-12 text-center text-body2 text-primary text-bold" data-v-09eafd3f${_scopeId2}> Figure 1: Workflow for data processing of CV-QTLdb </div></div></div></div></div>`);
                } else {
                  return [
                    createVNode("div", {
                      class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                    }, " Analysis pipeline "),
                    createVNode("div", { class: "row q-pa-md q-my-xs text-body text-justify" }, [
                      createVNode("div", { class: "col-12" }, [
                        createVNode("p", { style: { "font-size": "18px", "line-height": "1.5" } }, [
                          createTextVNode(" The research workflow is illustrated in "),
                          createVNode("span", { class: "text-bold text-primary" }, "Figure 1"),
                          createTextVNode(", which consists of four main components: data acquisition, ​variant identification, ​molecular phenotype characterization, and ​QTL analysis. ")
                        ]),
                        createVNode("div", { class: "row justify-around" }, [
                          createVNode("div", {
                            class: "col-12 q-mt-sm q-mb-md text-body1 text-center",
                            style: { "max-height": "390px" }
                          }, [
                            createVNode("img", {
                              src: _imports_0,
                              style: { "width": "100%", "max-width": "1140px", "object-fit": "contain" }
                            }),
                            createVNode("div", { class: "col-12 text-center text-body2 text-primary text-bold" }, " Figure 1: Workflow for data processing of CV-QTLdb ")
                          ])
                        ])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_q_card, { class: "col-12 q-mt-md" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold" style="${ssrRenderStyle({ "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" })}" data-v-09eafd3f${_scopeId2}> Functional Overview of CV-QTLdb </div><div class="row q-pa-md q-my-xs text-body1 text-justify" data-v-09eafd3f${_scopeId2}><div class="col-12" data-v-09eafd3f${_scopeId2}><p style="${ssrRenderStyle({ "font-size": "18px", "line-height": "1.5" })}" data-v-09eafd3f${_scopeId2}> The CV-QTLdb website is organized into three core functional modules: <span class="text-bold text-primary" data-v-09eafd3f${_scopeId2}>data retrieval</span>, <span class="text-bold text-primary" data-v-09eafd3f${_scopeId2}>data visualization</span>, and <span class="text-bold text-primary" data-v-09eafd3f${_scopeId2}>data downloading</span>. Below is a detailed introduction to each feature: </p><div class="q-pa-sm text-h6 text-bold text-black" data-v-09eafd3f${_scopeId2}> 1. ​Data Retrieval </div><div class="row justify-around" data-v-09eafd3f${_scopeId2}><div class="col-12 q-mt-sm q-mb-md text-body1 text-center" style="${ssrRenderStyle({ "height": "350px" })}" data-v-09eafd3f${_scopeId2}><img class="col-12 q-mx-auto"${ssrRenderAttr("src", _imports_1)} style="${ssrRenderStyle({ "height": "90%", "width": "90%", "object-fit": "contain" })}" data-v-09eafd3f${_scopeId2}><div class="col-12 text-center text-body2 text-primary text-bold" data-v-09eafd3f${_scopeId2}> Figure 2: ​Data retrievaling in different modules of CV-QTLdb </div></div></div><div class="q-pa-sm text-h6 text-bold text-black" data-v-09eafd3f${_scopeId2}> 2. ​Data Visualization </div><div class="row justify-around" data-v-09eafd3f${_scopeId2}><div class="col-12 q-mt-sm q-mb-md text-body1 text-center" style="${ssrRenderStyle({ "height": "350px" })}" data-v-09eafd3f${_scopeId2}><img class="col-12 q-mx-auto"${ssrRenderAttr("src", _imports_2)} style="${ssrRenderStyle({ "height": "90%", "width": "90%", "object-fit": "contain" })}" data-v-09eafd3f${_scopeId2}><div class="col-12 text-center text-body2 text-primary text-bold" data-v-09eafd3f${_scopeId2}> Figure 3: ​Data visualization in different modules of CV-QTLdb </div></div></div><div class="q-pa-sm text-h6 text-bold text-black" data-v-09eafd3f${_scopeId2}> 3. Data Downloading </div><div class="row justify-around" data-v-09eafd3f${_scopeId2}><div class="col-12 q-mt-sm q-mb-md text-body1 text-center" style="${ssrRenderStyle({ "height": "350px" })}" data-v-09eafd3f${_scopeId2}><img class="col-12 q-mx-auto"${ssrRenderAttr("src", _imports_3)} style="${ssrRenderStyle({ "height": "90%", "width": "90%", "object-fit": "contain" })}" data-v-09eafd3f${_scopeId2}><div class="col-12 text-center text-body2 text-primary text-bold" data-v-09eafd3f${_scopeId2}> Figure 4: ​Data Downloading in CV-QTLdb </div></div></div></div></div>`);
                } else {
                  return [
                    createVNode("div", {
                      class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                    }, " Functional Overview of CV-QTLdb "),
                    createVNode("div", { class: "row q-pa-md q-my-xs text-body1 text-justify" }, [
                      createVNode("div", { class: "col-12" }, [
                        createVNode("p", { style: { "font-size": "18px", "line-height": "1.5" } }, [
                          createTextVNode(" The CV-QTLdb website is organized into three core functional modules: "),
                          createVNode("span", { class: "text-bold text-primary" }, "data retrieval"),
                          createTextVNode(", "),
                          createVNode("span", { class: "text-bold text-primary" }, "data visualization"),
                          createTextVNode(", and "),
                          createVNode("span", { class: "text-bold text-primary" }, "data downloading"),
                          createTextVNode(". Below is a detailed introduction to each feature: ")
                        ]),
                        createVNode("div", { class: "q-pa-sm text-h6 text-bold text-black" }, " 1. ​Data Retrieval "),
                        createVNode("div", { class: "row justify-around" }, [
                          createVNode("div", {
                            class: "col-12 q-mt-sm q-mb-md text-body1 text-center",
                            style: { "height": "350px" }
                          }, [
                            createVNode("img", {
                              class: "col-12 q-mx-auto",
                              src: _imports_1,
                              style: { "height": "90%", "width": "90%", "object-fit": "contain" }
                            }),
                            createVNode("div", { class: "col-12 text-center text-body2 text-primary text-bold" }, " Figure 2: ​Data retrievaling in different modules of CV-QTLdb ")
                          ])
                        ]),
                        createVNode("div", { class: "q-pa-sm text-h6 text-bold text-black" }, " 2. ​Data Visualization "),
                        createVNode("div", { class: "row justify-around" }, [
                          createVNode("div", {
                            class: "col-12 q-mt-sm q-mb-md text-body1 text-center",
                            style: { "height": "350px" }
                          }, [
                            createVNode("img", {
                              class: "col-12 q-mx-auto",
                              src: _imports_2,
                              style: { "height": "90%", "width": "90%", "object-fit": "contain" }
                            }),
                            createVNode("div", { class: "col-12 text-center text-body2 text-primary text-bold" }, " Figure 3: ​Data visualization in different modules of CV-QTLdb ")
                          ])
                        ]),
                        createVNode("div", { class: "q-pa-sm text-h6 text-bold text-black" }, " 3. Data Downloading "),
                        createVNode("div", { class: "row justify-around" }, [
                          createVNode("div", {
                            class: "col-12 q-mt-sm q-mb-md text-body1 text-center",
                            style: { "height": "350px" }
                          }, [
                            createVNode("img", {
                              class: "col-12 q-mx-auto",
                              src: _imports_3,
                              style: { "height": "90%", "width": "90%", "object-fit": "contain" }
                            }),
                            createVNode("div", { class: "col-12 text-center text-body2 text-primary text-bold" }, " Figure 4: ​Data Downloading in CV-QTLdb ")
                          ])
                        ])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_q_card, { class: "col-12 q-mt-md" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold" style="${ssrRenderStyle({ "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" })}" data-v-09eafd3f${_scopeId2}> Contact </div><div class="row justify-evenly q-pa-md" data-v-09eafd3f${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_q_card, {
                    flat: "",
                    bordered: "",
                    class: "col-12 col-sm-6 col-md-5 q-pa-sm"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-center text-bold text-h6" data-v-09eafd3f${_scopeId3}> Gong, Jing <div data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_badge, {
                          class: "q-mx-xs",
                          align: "middle",
                          color: "green-5"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Ph.D`);
                            } else {
                              return [
                                createTextVNode("Ph.D")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_badge, {
                          class: "q-mx-xs",
                          align: "middle",
                          color: "orange-5"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Professor`);
                            } else {
                              return [
                                createTextVNode("Professor")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div></div>`);
                        _push4(ssrRenderComponent(_component_q_separator, { class: "q-my-sm" }, null, _parent4, _scopeId3));
                        _push4(`<div class="row no-wrap q-px-sm" data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_icon, {
                          name: "email",
                          size: "sm",
                          class: "col-1"
                        }, null, _parent4, _scopeId3));
                        _push4(`<canvas id="email1" width="320" height="25" style="${ssrRenderStyle({ "margin": "auto 0" })}" data-v-09eafd3f${_scopeId3}></canvas></div><div class="row no-wrap q-px-sm" data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_icon, {
                          name: "badge",
                          size: "sm",
                          class: "col-1"
                        }, null, _parent4, _scopeId3));
                        _push4(`<a href="http://encoi.hzau.edu.cn/" target="_blank" data-v-09eafd3f${_scopeId3}>College of Informatics</a></div><div class="row no-wrap q-px-sm" data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_icon, {
                          name: "school",
                          size: "sm",
                          class: "col-1"
                        }, null, _parent4, _scopeId3));
                        _push4(`<a href="http://encoi.hzau.edu.cn/" target="_blank" data-v-09eafd3f${_scopeId3}>Huazhong Agricultural University, Wuhan, China</a></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-center text-bold text-h6" }, [
                            createTextVNode(" Gong, Jing "),
                            createVNode("div", null, [
                              createVNode(_component_q_badge, {
                                class: "q-mx-xs",
                                align: "middle",
                                color: "green-5"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Ph.D")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_q_badge, {
                                class: "q-mx-xs",
                                align: "middle",
                                color: "orange-5"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Professor")
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          createVNode(_component_q_separator, { class: "q-my-sm" }),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "email",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("canvas", {
                              id: "email1",
                              width: "320",
                              height: "25",
                              style: { "margin": "auto 0" }
                            })
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "badge",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "College of Informatics")
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "school",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "Huazhong Agricultural University, Wuhan, China")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_q_card, {
                    flat: "",
                    bordered: "",
                    class: "col-12 col-sm-6 col-md-5 q-pa-sm"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-center text-bold text-h6" data-v-09eafd3f${_scopeId3}> Wang Dongyang <div data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_badge, {
                          class: "q-mx-xs",
                          align: "middle",
                          color: "green-5"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Ph.D candidate`);
                            } else {
                              return [
                                createTextVNode("Ph.D candidate")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div></div>`);
                        _push4(ssrRenderComponent(_component_q_separator, { class: "q-my-sm" }, null, _parent4, _scopeId3));
                        _push4(`<div class="row no-wrap q-px-sm" data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_icon, {
                          name: "email",
                          size: "sm",
                          class: "col-1"
                        }, null, _parent4, _scopeId3));
                        _push4(`<canvas id="email3" width="360" height="25" style="${ssrRenderStyle({ "margin": "auto 0" })}" data-v-09eafd3f${_scopeId3}></canvas></div><div class="row no-wrap q-px-sm" data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_icon, {
                          name: "badge",
                          size: "sm",
                          class: "col-1"
                        }, null, _parent4, _scopeId3));
                        _push4(`<a href="http://encoi.hzau.edu.cn/" target="_blank" data-v-09eafd3f${_scopeId3}>College of Informatics</a></div><div class="row no-wrap q-px-sm" data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_icon, {
                          name: "school",
                          size: "sm",
                          class: "col-1"
                        }, null, _parent4, _scopeId3));
                        _push4(`<a href="http://encoi.hzau.edu.cn/" target="_blank" data-v-09eafd3f${_scopeId3}>Huazhong Agricultural University, Wuhan, China</a></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-center text-bold text-h6" }, [
                            createTextVNode(" Wang Dongyang "),
                            createVNode("div", null, [
                              createVNode(_component_q_badge, {
                                class: "q-mx-xs",
                                align: "middle",
                                color: "green-5"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Ph.D candidate")
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          createVNode(_component_q_separator, { class: "q-my-sm" }),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "email",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("canvas", {
                              id: "email3",
                              width: "360",
                              height: "25",
                              style: { "margin": "auto 0" }
                            })
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "badge",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "College of Informatics")
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "school",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "Huazhong Agricultural University, Wuhan, China")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="row justify-evenly q-px-md q-pb-md" data-v-09eafd3f${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_q_card, {
                    flat: "",
                    bordered: "",
                    class: "col-12 col-sm-6 col-md-5 q-pa-sm"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-center text-bold text-h6" data-v-09eafd3f${_scopeId3}> Wu, Xiaohong <div data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_badge, {
                          class: "q-mx-xs",
                          align: "middle",
                          color: "green-5"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Ph.D candidate`);
                            } else {
                              return [
                                createTextVNode("Ph.D candidate")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div></div>`);
                        _push4(ssrRenderComponent(_component_q_separator, { class: "q-my-sm" }, null, _parent4, _scopeId3));
                        _push4(`<div class="row no-wrap q-px-sm" data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_icon, {
                          name: "email",
                          size: "sm",
                          class: "col-1"
                        }, null, _parent4, _scopeId3));
                        _push4(`<canvas id="email2" width="360" height="25" style="${ssrRenderStyle({ "margin": "auto 0" })}" data-v-09eafd3f${_scopeId3}></canvas></div><div class="row no-wrap q-px-sm" data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_icon, {
                          name: "badge",
                          size: "sm",
                          class: "col-1"
                        }, null, _parent4, _scopeId3));
                        _push4(`<a href="http://encoi.hzau.edu.cn/" target="_blank" data-v-09eafd3f${_scopeId3}>College of Informatics</a></div><div class="row no-wrap q-px-sm" data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_icon, {
                          name: "school",
                          size: "sm",
                          class: "col-1"
                        }, null, _parent4, _scopeId3));
                        _push4(`<a href="http://encoi.hzau.edu.cn/" target="_blank" data-v-09eafd3f${_scopeId3}>Huazhong Agricultural University, Wuhan, China</a></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-center text-bold text-h6" }, [
                            createTextVNode(" Wu, Xiaohong "),
                            createVNode("div", null, [
                              createVNode(_component_q_badge, {
                                class: "q-mx-xs",
                                align: "middle",
                                color: "green-5"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Ph.D candidate")
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          createVNode(_component_q_separator, { class: "q-my-sm" }),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "email",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("canvas", {
                              id: "email2",
                              width: "360",
                              height: "25",
                              style: { "margin": "auto 0" }
                            })
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "badge",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "College of Informatics")
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "school",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "Huazhong Agricultural University, Wuhan, China")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_q_card, {
                    flat: "",
                    bordered: "",
                    class: "col-12 col-sm-6 col-md-5 q-pa-sm"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-center text-bold text-h6" data-v-09eafd3f${_scopeId3}> Wu, Tian <div data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_badge, {
                          class: "q-mx-xs",
                          align: "middle",
                          color: "green-5"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`M.S. candidate`);
                            } else {
                              return [
                                createTextVNode("M.S. candidate")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div></div>`);
                        _push4(ssrRenderComponent(_component_q_separator, { class: "q-my-sm" }, null, _parent4, _scopeId3));
                        _push4(`<div class="row no-wrap q-px-sm" data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_icon, {
                          name: "email",
                          size: "sm",
                          class: "col-1"
                        }, null, _parent4, _scopeId3));
                        _push4(`<canvas id="email4" width="320" height="25" style="${ssrRenderStyle({ "margin": "auto 0" })}" data-v-09eafd3f${_scopeId3}></canvas></div><div class="row no-wrap q-px-sm" data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_icon, {
                          name: "badge",
                          size: "sm",
                          class: "col-1"
                        }, null, _parent4, _scopeId3));
                        _push4(`<a href="http://encoi.hzau.edu.cn/" target="_blank" data-v-09eafd3f${_scopeId3}>College of Informatics</a></div><div class="row no-wrap q-px-sm" data-v-09eafd3f${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_q_icon, {
                          name: "school",
                          size: "sm",
                          class: "col-1"
                        }, null, _parent4, _scopeId3));
                        _push4(`<a href="http://encoi.hzau.edu.cn/" target="_blank" data-v-09eafd3f${_scopeId3}>Huazhong Agricultural University, Wuhan, China</a></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-center text-bold text-h6" }, [
                            createTextVNode(" Wu, Tian "),
                            createVNode("div", null, [
                              createVNode(_component_q_badge, {
                                class: "q-mx-xs",
                                align: "middle",
                                color: "green-5"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("M.S. candidate")
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          createVNode(_component_q_separator, { class: "q-my-sm" }),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "email",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("canvas", {
                              id: "email4",
                              width: "320",
                              height: "25",
                              style: { "margin": "auto 0" }
                            })
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "badge",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "College of Informatics")
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "school",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "Huazhong Agricultural University, Wuhan, China")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", {
                      class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                    }, " Contact "),
                    createVNode("div", { class: "row justify-evenly q-pa-md" }, [
                      createVNode(_component_q_card, {
                        flat: "",
                        bordered: "",
                        class: "col-12 col-sm-6 col-md-5 q-pa-sm"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-center text-bold text-h6" }, [
                            createTextVNode(" Gong, Jing "),
                            createVNode("div", null, [
                              createVNode(_component_q_badge, {
                                class: "q-mx-xs",
                                align: "middle",
                                color: "green-5"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Ph.D")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_q_badge, {
                                class: "q-mx-xs",
                                align: "middle",
                                color: "orange-5"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Professor")
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          createVNode(_component_q_separator, { class: "q-my-sm" }),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "email",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("canvas", {
                              id: "email1",
                              width: "320",
                              height: "25",
                              style: { "margin": "auto 0" }
                            })
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "badge",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "College of Informatics")
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "school",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "Huazhong Agricultural University, Wuhan, China")
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_q_card, {
                        flat: "",
                        bordered: "",
                        class: "col-12 col-sm-6 col-md-5 q-pa-sm"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-center text-bold text-h6" }, [
                            createTextVNode(" Wang Dongyang "),
                            createVNode("div", null, [
                              createVNode(_component_q_badge, {
                                class: "q-mx-xs",
                                align: "middle",
                                color: "green-5"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Ph.D candidate")
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          createVNode(_component_q_separator, { class: "q-my-sm" }),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "email",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("canvas", {
                              id: "email3",
                              width: "360",
                              height: "25",
                              style: { "margin": "auto 0" }
                            })
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "badge",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "College of Informatics")
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "school",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "Huazhong Agricultural University, Wuhan, China")
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "row justify-evenly q-px-md q-pb-md" }, [
                      createVNode(_component_q_card, {
                        flat: "",
                        bordered: "",
                        class: "col-12 col-sm-6 col-md-5 q-pa-sm"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-center text-bold text-h6" }, [
                            createTextVNode(" Wu, Xiaohong "),
                            createVNode("div", null, [
                              createVNode(_component_q_badge, {
                                class: "q-mx-xs",
                                align: "middle",
                                color: "green-5"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Ph.D candidate")
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          createVNode(_component_q_separator, { class: "q-my-sm" }),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "email",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("canvas", {
                              id: "email2",
                              width: "360",
                              height: "25",
                              style: { "margin": "auto 0" }
                            })
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "badge",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "College of Informatics")
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "school",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "Huazhong Agricultural University, Wuhan, China")
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_q_card, {
                        flat: "",
                        bordered: "",
                        class: "col-12 col-sm-6 col-md-5 q-pa-sm"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-center text-bold text-h6" }, [
                            createTextVNode(" Wu, Tian "),
                            createVNode("div", null, [
                              createVNode(_component_q_badge, {
                                class: "q-mx-xs",
                                align: "middle",
                                color: "green-5"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("M.S. candidate")
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          createVNode(_component_q_separator, { class: "q-my-sm" }),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "email",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("canvas", {
                              id: "email4",
                              width: "320",
                              height: "25",
                              style: { "margin": "auto 0" }
                            })
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "badge",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "College of Informatics")
                          ]),
                          createVNode("div", { class: "row no-wrap q-px-sm" }, [
                            createVNode(_component_q_icon, {
                              name: "school",
                              size: "sm",
                              class: "col-1"
                            }),
                            createVNode("a", {
                              href: "http://encoi.hzau.edu.cn/",
                              target: "_blank"
                            }, "Huazhong Agricultural University, Wuhan, China")
                          ])
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", {
                class: ["row", {
                  "bg-indigo-10": _ctx.$q.dark.isActive,
                  "bg-white text-indigo-8": !_ctx.$q.dark.isActive
                }],
                style: { "padding": "0 calc((100vw - 1180px) / 2)" }
              }, [
                createVNode("div", { class: "col-11 col-sm-12 q-px-md" }, [
                  createVNode(_component_q_card, { class: "col-12 q-mt-sm" }, {
                    default: withCtx(() => [
                      createVNode("div", {
                        class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                        style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                      }, " About CV-QTLdb "),
                      createVNode("div", { class: "row q-pa-md q-my-xs text-body1 text-justify" }, [
                        createVNode("div", { class: "col-12" }, [
                          createVNode("p", { style: { "font-size": "18px", "line-height": "1.5" } }, " CV-QTLdb is a specialized database that systematically integrates genetic variation data with molecular quantitative trait loci (MolQTL) information derived from a cohort of 148 Chinese individuals. This resource captures complex associations across multiple biological layers, including: "),
                          createVNode("ul", { class: "custom-list" }, [
                            createVNode("li", null, [
                              createVNode("span", {
                                class: "text-bold text-primary",
                                style: { "font-size": "18px", "line-height": "1" }
                              }, "Genetic variants"),
                              createTextVNode(": four types of genomic variations (SNVs, MNVs, InDels, and SVs)")
                            ]),
                            createVNode("li", null, [
                              createVNode("span", {
                                class: "text-bold text-primary",
                                style: { "font-size": "18px", "line-height": "1" }
                              }, "Molecular phenotypes"),
                              createTextVNode(": four types of molecular phenotypes (Gene expression, Alternative polyadenylation, Alternative splicing, DNA methylation)")
                            ]),
                            createVNode("li", null, [
                              createVNode("span", {
                                class: "text-bold text-primary",
                                style: { "font-size": "18px", "line-height": "1" }
                              }, "Clinical data"),
                              createTextVNode(": six types of comprehensive health indicators (Pathology, Nutrition, Toxin, Measurement, Hormone, Questionnaire)")
                            ])
                          ])
                        ])
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_q_card, { class: "col-12 q-mt-md" }, {
                    default: withCtx(() => [
                      createVNode("div", {
                        class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                        style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                      }, " Analysis pipeline "),
                      createVNode("div", { class: "row q-pa-md q-my-xs text-body text-justify" }, [
                        createVNode("div", { class: "col-12" }, [
                          createVNode("p", { style: { "font-size": "18px", "line-height": "1.5" } }, [
                            createTextVNode(" The research workflow is illustrated in "),
                            createVNode("span", { class: "text-bold text-primary" }, "Figure 1"),
                            createTextVNode(", which consists of four main components: data acquisition, ​variant identification, ​molecular phenotype characterization, and ​QTL analysis. ")
                          ]),
                          createVNode("div", { class: "row justify-around" }, [
                            createVNode("div", {
                              class: "col-12 q-mt-sm q-mb-md text-body1 text-center",
                              style: { "max-height": "390px" }
                            }, [
                              createVNode("img", {
                                src: _imports_0,
                                style: { "width": "100%", "max-width": "1140px", "object-fit": "contain" }
                              }),
                              createVNode("div", { class: "col-12 text-center text-body2 text-primary text-bold" }, " Figure 1: Workflow for data processing of CV-QTLdb ")
                            ])
                          ])
                        ])
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_q_card, { class: "col-12 q-mt-md" }, {
                    default: withCtx(() => [
                      createVNode("div", {
                        class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                        style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                      }, " Functional Overview of CV-QTLdb "),
                      createVNode("div", { class: "row q-pa-md q-my-xs text-body1 text-justify" }, [
                        createVNode("div", { class: "col-12" }, [
                          createVNode("p", { style: { "font-size": "18px", "line-height": "1.5" } }, [
                            createTextVNode(" The CV-QTLdb website is organized into three core functional modules: "),
                            createVNode("span", { class: "text-bold text-primary" }, "data retrieval"),
                            createTextVNode(", "),
                            createVNode("span", { class: "text-bold text-primary" }, "data visualization"),
                            createTextVNode(", and "),
                            createVNode("span", { class: "text-bold text-primary" }, "data downloading"),
                            createTextVNode(". Below is a detailed introduction to each feature: ")
                          ]),
                          createVNode("div", { class: "q-pa-sm text-h6 text-bold text-black" }, " 1. ​Data Retrieval "),
                          createVNode("div", { class: "row justify-around" }, [
                            createVNode("div", {
                              class: "col-12 q-mt-sm q-mb-md text-body1 text-center",
                              style: { "height": "350px" }
                            }, [
                              createVNode("img", {
                                class: "col-12 q-mx-auto",
                                src: _imports_1,
                                style: { "height": "90%", "width": "90%", "object-fit": "contain" }
                              }),
                              createVNode("div", { class: "col-12 text-center text-body2 text-primary text-bold" }, " Figure 2: ​Data retrievaling in different modules of CV-QTLdb ")
                            ])
                          ]),
                          createVNode("div", { class: "q-pa-sm text-h6 text-bold text-black" }, " 2. ​Data Visualization "),
                          createVNode("div", { class: "row justify-around" }, [
                            createVNode("div", {
                              class: "col-12 q-mt-sm q-mb-md text-body1 text-center",
                              style: { "height": "350px" }
                            }, [
                              createVNode("img", {
                                class: "col-12 q-mx-auto",
                                src: _imports_2,
                                style: { "height": "90%", "width": "90%", "object-fit": "contain" }
                              }),
                              createVNode("div", { class: "col-12 text-center text-body2 text-primary text-bold" }, " Figure 3: ​Data visualization in different modules of CV-QTLdb ")
                            ])
                          ]),
                          createVNode("div", { class: "q-pa-sm text-h6 text-bold text-black" }, " 3. Data Downloading "),
                          createVNode("div", { class: "row justify-around" }, [
                            createVNode("div", {
                              class: "col-12 q-mt-sm q-mb-md text-body1 text-center",
                              style: { "height": "350px" }
                            }, [
                              createVNode("img", {
                                class: "col-12 q-mx-auto",
                                src: _imports_3,
                                style: { "height": "90%", "width": "90%", "object-fit": "contain" }
                              }),
                              createVNode("div", { class: "col-12 text-center text-body2 text-primary text-bold" }, " Figure 4: ​Data Downloading in CV-QTLdb ")
                            ])
                          ])
                        ])
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_q_card, { class: "col-12 q-mt-md" }, {
                    default: withCtx(() => [
                      createVNode("div", {
                        class: "full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                        style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                      }, " Contact "),
                      createVNode("div", { class: "row justify-evenly q-pa-md" }, [
                        createVNode(_component_q_card, {
                          flat: "",
                          bordered: "",
                          class: "col-12 col-sm-6 col-md-5 q-pa-sm"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "text-center text-bold text-h6" }, [
                              createTextVNode(" Gong, Jing "),
                              createVNode("div", null, [
                                createVNode(_component_q_badge, {
                                  class: "q-mx-xs",
                                  align: "middle",
                                  color: "green-5"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Ph.D")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_q_badge, {
                                  class: "q-mx-xs",
                                  align: "middle",
                                  color: "orange-5"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Professor")
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            createVNode(_component_q_separator, { class: "q-my-sm" }),
                            createVNode("div", { class: "row no-wrap q-px-sm" }, [
                              createVNode(_component_q_icon, {
                                name: "email",
                                size: "sm",
                                class: "col-1"
                              }),
                              createVNode("canvas", {
                                id: "email1",
                                width: "320",
                                height: "25",
                                style: { "margin": "auto 0" }
                              })
                            ]),
                            createVNode("div", { class: "row no-wrap q-px-sm" }, [
                              createVNode(_component_q_icon, {
                                name: "badge",
                                size: "sm",
                                class: "col-1"
                              }),
                              createVNode("a", {
                                href: "http://encoi.hzau.edu.cn/",
                                target: "_blank"
                              }, "College of Informatics")
                            ]),
                            createVNode("div", { class: "row no-wrap q-px-sm" }, [
                              createVNode(_component_q_icon, {
                                name: "school",
                                size: "sm",
                                class: "col-1"
                              }),
                              createVNode("a", {
                                href: "http://encoi.hzau.edu.cn/",
                                target: "_blank"
                              }, "Huazhong Agricultural University, Wuhan, China")
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_q_card, {
                          flat: "",
                          bordered: "",
                          class: "col-12 col-sm-6 col-md-5 q-pa-sm"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "text-center text-bold text-h6" }, [
                              createTextVNode(" Wang Dongyang "),
                              createVNode("div", null, [
                                createVNode(_component_q_badge, {
                                  class: "q-mx-xs",
                                  align: "middle",
                                  color: "green-5"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Ph.D candidate")
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            createVNode(_component_q_separator, { class: "q-my-sm" }),
                            createVNode("div", { class: "row no-wrap q-px-sm" }, [
                              createVNode(_component_q_icon, {
                                name: "email",
                                size: "sm",
                                class: "col-1"
                              }),
                              createVNode("canvas", {
                                id: "email3",
                                width: "360",
                                height: "25",
                                style: { "margin": "auto 0" }
                              })
                            ]),
                            createVNode("div", { class: "row no-wrap q-px-sm" }, [
                              createVNode(_component_q_icon, {
                                name: "badge",
                                size: "sm",
                                class: "col-1"
                              }),
                              createVNode("a", {
                                href: "http://encoi.hzau.edu.cn/",
                                target: "_blank"
                              }, "College of Informatics")
                            ]),
                            createVNode("div", { class: "row no-wrap q-px-sm" }, [
                              createVNode(_component_q_icon, {
                                name: "school",
                                size: "sm",
                                class: "col-1"
                              }),
                              createVNode("a", {
                                href: "http://encoi.hzau.edu.cn/",
                                target: "_blank"
                              }, "Huazhong Agricultural University, Wuhan, China")
                            ])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "row justify-evenly q-px-md q-pb-md" }, [
                        createVNode(_component_q_card, {
                          flat: "",
                          bordered: "",
                          class: "col-12 col-sm-6 col-md-5 q-pa-sm"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "text-center text-bold text-h6" }, [
                              createTextVNode(" Wu, Xiaohong "),
                              createVNode("div", null, [
                                createVNode(_component_q_badge, {
                                  class: "q-mx-xs",
                                  align: "middle",
                                  color: "green-5"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Ph.D candidate")
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            createVNode(_component_q_separator, { class: "q-my-sm" }),
                            createVNode("div", { class: "row no-wrap q-px-sm" }, [
                              createVNode(_component_q_icon, {
                                name: "email",
                                size: "sm",
                                class: "col-1"
                              }),
                              createVNode("canvas", {
                                id: "email2",
                                width: "360",
                                height: "25",
                                style: { "margin": "auto 0" }
                              })
                            ]),
                            createVNode("div", { class: "row no-wrap q-px-sm" }, [
                              createVNode(_component_q_icon, {
                                name: "badge",
                                size: "sm",
                                class: "col-1"
                              }),
                              createVNode("a", {
                                href: "http://encoi.hzau.edu.cn/",
                                target: "_blank"
                              }, "College of Informatics")
                            ]),
                            createVNode("div", { class: "row no-wrap q-px-sm" }, [
                              createVNode(_component_q_icon, {
                                name: "school",
                                size: "sm",
                                class: "col-1"
                              }),
                              createVNode("a", {
                                href: "http://encoi.hzau.edu.cn/",
                                target: "_blank"
                              }, "Huazhong Agricultural University, Wuhan, China")
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_q_card, {
                          flat: "",
                          bordered: "",
                          class: "col-12 col-sm-6 col-md-5 q-pa-sm"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "text-center text-bold text-h6" }, [
                              createTextVNode(" Wu, Tian "),
                              createVNode("div", null, [
                                createVNode(_component_q_badge, {
                                  class: "q-mx-xs",
                                  align: "middle",
                                  color: "green-5"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("M.S. candidate")
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            createVNode(_component_q_separator, { class: "q-my-sm" }),
                            createVNode("div", { class: "row no-wrap q-px-sm" }, [
                              createVNode(_component_q_icon, {
                                name: "email",
                                size: "sm",
                                class: "col-1"
                              }),
                              createVNode("canvas", {
                                id: "email4",
                                width: "320",
                                height: "25",
                                style: { "margin": "auto 0" }
                              })
                            ]),
                            createVNode("div", { class: "row no-wrap q-px-sm" }, [
                              createVNode(_component_q_icon, {
                                name: "badge",
                                size: "sm",
                                class: "col-1"
                              }),
                              createVNode("a", {
                                href: "http://encoi.hzau.edu.cn/",
                                target: "_blank"
                              }, "College of Informatics")
                            ]),
                            createVNode("div", { class: "row no-wrap q-px-sm" }, [
                              createVNode(_component_q_icon, {
                                name: "school",
                                size: "sm",
                                class: "col-1"
                              }),
                              createVNode("a", {
                                href: "http://encoi.hzau.edu.cn/",
                                target: "_blank"
                              }, "Huazhong Agricultural University, Wuhan, China")
                            ])
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    _: 1
                  })
                ])
              ], 2)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/help.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const help = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-09eafd3f"]]);

export { help as default };
//# sourceMappingURL=help.vue.mjs.map

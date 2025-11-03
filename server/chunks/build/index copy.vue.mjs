import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { c as clinicImage, m as methylationImage, a as apaImage, s as splicingImage, e as expressionImage } from './gwasQTL.svg.mjs';
import { C as CorrelationImage, I as InDelImage, S as SVImage, M as MNVImage, a as SNVImage } from './Correlation.svg.mjs';
import { f as useQuasar, _ as _export_sfc } from './server.mjs';
import { _ as __nuxt_component_0 } from '../_/QPage.mjs';
import { _ as __nuxt_component_2 } from '../_/QCard.mjs';
import { _ as __nuxt_component_3 } from '../_/QCardSection.mjs';
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
import '../_/use-dark.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index copy",
  __ssrInlineRender: true,
  setup(__props) {
    useQuasar();
    const statRefs = ref([]);
    const featureRowRef = ref();
    const hoveredIndex = ref(0);
    const stats = [
      {
        title: "SNVs",
        stat: "18,400,996",
        color: "red-6",
        qtl: {
          Expression: [246966, 20938],
          Splicing: [438397, 90085],
          APA: [31997, 1172375],
          Methylation: [5344683, 4002871],
          "Clinic traits": [127245, 0]
        }
      },
      {
        title: "InDels",
        stat: "2,089,567",
        color: "teal-6",
        qtl: {
          Expression: [18432, 1458],
          Splicing: [30899, 6171],
          APA: [2408, 87276],
          Methylation: [392720, 287376],
          "Clinic traits": [9710, 0]
        }
      },
      {
        title: "MNVs",
        stat: "428,349",
        color: "orange-6",
        qtl: {
          Expression: [12949, 1038],
          Splicing: [25612, 4054],
          APA: [1476, 63483],
          Methylation: [296675, 168050],
          "Clinic traits": [6215, 0]
        }
      },
      {
        title: "SVs",
        stat: "96,203",
        color: "indigo-6",
        qtl: {
          Expression: [1318, 150],
          Splicing: [2433, 700],
          APA: [134, 13573],
          Methylation: [21305, 23778],
          "Clinic traits": [1916, 0]
        }
      }
    ];
    const phenotypes = ["Expression", "Splicing", "APA", "Methylation", "Clinic traits"];
    const variantTypes = ["SNP", "MNV", "SV", "InDel", "Correlation"];
    const getPhenotypeImage = (phenotype) => {
      const imageMap = {
        "Expression": expressionImage,
        "Splicing": splicingImage,
        "APA": apaImage,
        "Methylation": methylationImage,
        "Clinic traits": clinicImage
      };
      return imageMap[phenotype];
    };
    const getVariantTypeImage = (variantType) => {
      const imageMap = {
        "SNP": SNVImage,
        // 临时使用，后续替换
        "MNV": MNVImage,
        // 临时使用，后续替换
        "SV": SVImage,
        // 临时使用，后续替换
        "InDel": InDelImage,
        // 临时使用，后续替换
        "Correlation": CorrelationImage
        // 临时使用，后续替换
      };
      return imageMap[variantType];
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_q_page = __nuxt_component_0;
      const _component_q_card = __nuxt_component_2;
      const _component_q_card_section = __nuxt_component_3;
      _push(ssrRenderComponent(_component_q_page, mergeProps({
        class: "q-mx-auto",
        style: { "min-height": "calc(100vh - 180px)", "padding-top": "0" }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="row justify-center q-my-none" style="${ssrRenderStyle({ "width": "1140px", "margin": "3px auto 0 auto" })}" data-v-8c75068a${_scopeId}>`);
            _push2(ssrRenderComponent(_component_q_card, {
              flat: "",
              class: "col-12 q-my-xs",
              style: { "border": "1px solid gainsboro" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="q-px-md q-py-sm text-subtitle2 text-primary text-bold" style="${ssrRenderStyle({ "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" })}" data-v-8c75068a${_scopeId2}> Welcome to CV-QTLdb! </div>`);
                  _push3(ssrRenderComponent(_component_q_card_section, {
                    class: "row text-body2 text-foreground text-justify q-px-md q-pb-none",
                    style: { "font-size": "17px", "line-height": "1.5" }
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<p data-v-8c75068a${_scopeId3}> CV-QTLdb provides <span class="text-primary text-bold q-px-xs" data-v-8c75068a${_scopeId3}> query and visualization tools for genetic variants, MolQTL information, and correlations between variations and clinical traits, </span> aiming to support researchers with a comprehensive resource for functional interpretation of complex genetic variations and advancing genetic research. </p>`);
                        _push4(ssrRenderComponent(_component_q_card, {
                          flat: "",
                          class: "col-11 col-md q-my-none q-py-none",
                          style: { "border": "1px solid white" }
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_q_card_section, {
                                class: "col-md text-body1 text-foreground text-justify q-py-none",
                                style: { "padding-left": "0", "margin-left": "0" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<span class="text-primary text-bold rounded-borders q-px-xs" style="${ssrRenderStyle({ "padding-left": "0", "margin-left": "0" })}" data-v-8c75068a${_scopeId5}>In CV-QTLdb, we provide: </span><br data-v-8c75068a${_scopeId5}><ol class="no-margin q-pl-lg q-py-xs" data-v-8c75068a${_scopeId5}><li class="q-pa-xs" data-v-8c75068a${_scopeId5}> Comprehensive data for <span class="text-primary text-bold rounded-borders q-px-xs" data-v-8c75068a${_scopeId5}> 4 types of genetic variants </span> including SNPs, InDels, MNVs, and SVs; </li><li class="q-pa-xs" data-v-8c75068a${_scopeId5}> Association analysis between <span class="text-primary text-bold rounded-borders q-px-xs" data-v-8c75068a${_scopeId5}> molecular QTLs (eQTL, apaQTL, sQTL, meQTL) </span> and genetic variants; </li><li class="q-pa-xs" data-v-8c75068a${_scopeId5}> GWAS associations for <span class="text-primary text-bold rounded-borders q-px-xs" data-v-8c75068a${_scopeId5}> 180+ clinical traits </span> across different variant types; </li><li class="q-pa-xs" data-v-8c75068a${_scopeId5}> Correlations between <span class="text-primary text-bold rounded-borders q-px-xs" data-v-8c75068a${_scopeId5}> QTLs and clinical traits </span> for functional interpretation; </li></ol>`);
                                  } else {
                                    return [
                                      createVNode("span", {
                                        class: "text-primary text-bold rounded-borders q-px-xs",
                                        style: { "padding-left": "0", "margin-left": "0" }
                                      }, "In CV-QTLdb, we provide: "),
                                      createVNode("br"),
                                      createVNode("ol", { class: "no-margin q-pl-lg q-py-xs" }, [
                                        createVNode("li", { class: "q-pa-xs" }, [
                                          createTextVNode(" Comprehensive data for "),
                                          createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " 4 types of genetic variants "),
                                          createTextVNode(" including SNPs, InDels, MNVs, and SVs; ")
                                        ]),
                                        createVNode("li", { class: "q-pa-xs" }, [
                                          createTextVNode(" Association analysis between "),
                                          createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " molecular QTLs (eQTL, apaQTL, sQTL, meQTL) "),
                                          createTextVNode(" and genetic variants; ")
                                        ]),
                                        createVNode("li", { class: "q-pa-xs" }, [
                                          createTextVNode(" GWAS associations for "),
                                          createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " 180+ clinical traits "),
                                          createTextVNode(" across different variant types; ")
                                        ]),
                                        createVNode("li", { class: "q-pa-xs" }, [
                                          createTextVNode(" Correlations between "),
                                          createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " QTLs and clinical traits "),
                                          createTextVNode(" for functional interpretation; ")
                                        ])
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_q_card_section, {
                                  class: "col-md text-body1 text-foreground text-justify q-py-none",
                                  style: { "padding-left": "0", "margin-left": "0" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", {
                                      class: "text-primary text-bold rounded-borders q-px-xs",
                                      style: { "padding-left": "0", "margin-left": "0" }
                                    }, "In CV-QTLdb, we provide: "),
                                    createVNode("br"),
                                    createVNode("ol", { class: "no-margin q-pl-lg q-py-xs" }, [
                                      createVNode("li", { class: "q-pa-xs" }, [
                                        createTextVNode(" Comprehensive data for "),
                                        createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " 4 types of genetic variants "),
                                        createTextVNode(" including SNPs, InDels, MNVs, and SVs; ")
                                      ]),
                                      createVNode("li", { class: "q-pa-xs" }, [
                                        createTextVNode(" Association analysis between "),
                                        createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " molecular QTLs (eQTL, apaQTL, sQTL, meQTL) "),
                                        createTextVNode(" and genetic variants; ")
                                      ]),
                                      createVNode("li", { class: "q-pa-xs" }, [
                                        createTextVNode(" GWAS associations for "),
                                        createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " 180+ clinical traits "),
                                        createTextVNode(" across different variant types; ")
                                      ]),
                                      createVNode("li", { class: "q-pa-xs" }, [
                                        createTextVNode(" Correlations between "),
                                        createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " QTLs and clinical traits "),
                                        createTextVNode(" for functional interpretation; ")
                                      ])
                                    ])
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_q_card, {
                          flat: "",
                          class: "col-11 col-md q-py-none",
                          style: { "border": "1px solid white", "padding-left": "0", "margin-left": "0" }
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_q_card_section, {
                                class: "col-md text-body1 text-foreground text-justify q-py-none",
                                style: { "border": "1px solid white", "padding-left": "0", "margin-left": "0" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<span class="text-primary text-bold rounded-borders q-px-xs" data-v-8c75068a${_scopeId5}>In CV-QTLdb, users can: </span><br data-v-8c75068a${_scopeId5}><ol class="no-margin q-pl-lg q-py-xs" data-v-8c75068a${_scopeId5}><li class="q-pa-xs" data-v-8c75068a${_scopeId5}> Search for 4 types of variants, including SNPs, InDels, MNVs, and SVs. </li><li class="q-pa-xs" data-v-8c75068a${_scopeId5}> Search for associations between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and 4 types of variants. </li><li class="q-pa-xs" data-v-8c75068a${_scopeId5}> Search for GWAS associations of 180+ clinical traits across 4 types of variants. </li><li class="q-pa-xs" data-v-8c75068a${_scopeId5}> Obtain the correlation between QTLs and 180+ clinical traits. </li></ol>`);
                                  } else {
                                    return [
                                      createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, "In CV-QTLdb, users can: "),
                                      createVNode("br"),
                                      createVNode("ol", { class: "no-margin q-pl-lg q-py-xs" }, [
                                        createVNode("li", { class: "q-pa-xs" }, " Search for 4 types of variants, including SNPs, InDels, MNVs, and SVs. "),
                                        createVNode("li", { class: "q-pa-xs" }, " Search for associations between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and 4 types of variants. "),
                                        createVNode("li", { class: "q-pa-xs" }, " Search for GWAS associations of 180+ clinical traits across 4 types of variants. "),
                                        createVNode("li", { class: "q-pa-xs" }, " Obtain the correlation between QTLs and 180+ clinical traits. ")
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_q_card_section, {
                                  class: "col-md text-body1 text-foreground text-justify q-py-none",
                                  style: { "border": "1px solid white", "padding-left": "0", "margin-left": "0" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, "In CV-QTLdb, users can: "),
                                    createVNode("br"),
                                    createVNode("ol", { class: "no-margin q-pl-lg q-py-xs" }, [
                                      createVNode("li", { class: "q-pa-xs" }, " Search for 4 types of variants, including SNPs, InDels, MNVs, and SVs. "),
                                      createVNode("li", { class: "q-pa-xs" }, " Search for associations between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and 4 types of variants. "),
                                      createVNode("li", { class: "q-pa-xs" }, " Search for GWAS associations of 180+ clinical traits across 4 types of variants. "),
                                      createVNode("li", { class: "q-pa-xs" }, " Obtain the correlation between QTLs and 180+ clinical traits. ")
                                    ])
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("p", null, [
                            createTextVNode(" CV-QTLdb provides "),
                            createVNode("span", { class: "text-primary text-bold q-px-xs" }, " query and visualization tools for genetic variants, MolQTL information, and correlations between variations and clinical traits, "),
                            createTextVNode(" aiming to support researchers with a comprehensive resource for functional interpretation of complex genetic variations and advancing genetic research. ")
                          ]),
                          createVNode(_component_q_card, {
                            flat: "",
                            class: "col-11 col-md q-my-none q-py-none",
                            style: { "border": "1px solid white" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_q_card_section, {
                                class: "col-md text-body1 text-foreground text-justify q-py-none",
                                style: { "padding-left": "0", "margin-left": "0" }
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", {
                                    class: "text-primary text-bold rounded-borders q-px-xs",
                                    style: { "padding-left": "0", "margin-left": "0" }
                                  }, "In CV-QTLdb, we provide: "),
                                  createVNode("br"),
                                  createVNode("ol", { class: "no-margin q-pl-lg q-py-xs" }, [
                                    createVNode("li", { class: "q-pa-xs" }, [
                                      createTextVNode(" Comprehensive data for "),
                                      createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " 4 types of genetic variants "),
                                      createTextVNode(" including SNPs, InDels, MNVs, and SVs; ")
                                    ]),
                                    createVNode("li", { class: "q-pa-xs" }, [
                                      createTextVNode(" Association analysis between "),
                                      createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " molecular QTLs (eQTL, apaQTL, sQTL, meQTL) "),
                                      createTextVNode(" and genetic variants; ")
                                    ]),
                                    createVNode("li", { class: "q-pa-xs" }, [
                                      createTextVNode(" GWAS associations for "),
                                      createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " 180+ clinical traits "),
                                      createTextVNode(" across different variant types; ")
                                    ]),
                                    createVNode("li", { class: "q-pa-xs" }, [
                                      createTextVNode(" Correlations between "),
                                      createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " QTLs and clinical traits "),
                                      createTextVNode(" for functional interpretation; ")
                                    ])
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_q_card, {
                            flat: "",
                            class: "col-11 col-md q-py-none",
                            style: { "border": "1px solid white", "padding-left": "0", "margin-left": "0" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_q_card_section, {
                                class: "col-md text-body1 text-foreground text-justify q-py-none",
                                style: { "border": "1px solid white", "padding-left": "0", "margin-left": "0" }
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, "In CV-QTLdb, users can: "),
                                  createVNode("br"),
                                  createVNode("ol", { class: "no-margin q-pl-lg q-py-xs" }, [
                                    createVNode("li", { class: "q-pa-xs" }, " Search for 4 types of variants, including SNPs, InDels, MNVs, and SVs. "),
                                    createVNode("li", { class: "q-pa-xs" }, " Search for associations between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and 4 types of variants. "),
                                    createVNode("li", { class: "q-pa-xs" }, " Search for GWAS associations of 180+ clinical traits across 4 types of variants. "),
                                    createVNode("li", { class: "q-pa-xs" }, " Obtain the correlation between QTLs and 180+ clinical traits. ")
                                  ])
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", {
                      class: "q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                    }, " Welcome to CV-QTLdb! "),
                    createVNode(_component_q_card_section, {
                      class: "row text-body2 text-foreground text-justify q-px-md q-pb-none",
                      style: { "font-size": "17px", "line-height": "1.5" }
                    }, {
                      default: withCtx(() => [
                        createVNode("p", null, [
                          createTextVNode(" CV-QTLdb provides "),
                          createVNode("span", { class: "text-primary text-bold q-px-xs" }, " query and visualization tools for genetic variants, MolQTL information, and correlations between variations and clinical traits, "),
                          createTextVNode(" aiming to support researchers with a comprehensive resource for functional interpretation of complex genetic variations and advancing genetic research. ")
                        ]),
                        createVNode(_component_q_card, {
                          flat: "",
                          class: "col-11 col-md q-my-none q-py-none",
                          style: { "border": "1px solid white" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_q_card_section, {
                              class: "col-md text-body1 text-foreground text-justify q-py-none",
                              style: { "padding-left": "0", "margin-left": "0" }
                            }, {
                              default: withCtx(() => [
                                createVNode("span", {
                                  class: "text-primary text-bold rounded-borders q-px-xs",
                                  style: { "padding-left": "0", "margin-left": "0" }
                                }, "In CV-QTLdb, we provide: "),
                                createVNode("br"),
                                createVNode("ol", { class: "no-margin q-pl-lg q-py-xs" }, [
                                  createVNode("li", { class: "q-pa-xs" }, [
                                    createTextVNode(" Comprehensive data for "),
                                    createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " 4 types of genetic variants "),
                                    createTextVNode(" including SNPs, InDels, MNVs, and SVs; ")
                                  ]),
                                  createVNode("li", { class: "q-pa-xs" }, [
                                    createTextVNode(" Association analysis between "),
                                    createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " molecular QTLs (eQTL, apaQTL, sQTL, meQTL) "),
                                    createTextVNode(" and genetic variants; ")
                                  ]),
                                  createVNode("li", { class: "q-pa-xs" }, [
                                    createTextVNode(" GWAS associations for "),
                                    createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " 180+ clinical traits "),
                                    createTextVNode(" across different variant types; ")
                                  ]),
                                  createVNode("li", { class: "q-pa-xs" }, [
                                    createTextVNode(" Correlations between "),
                                    createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " QTLs and clinical traits "),
                                    createTextVNode(" for functional interpretation; ")
                                  ])
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_q_card, {
                          flat: "",
                          class: "col-11 col-md q-py-none",
                          style: { "border": "1px solid white", "padding-left": "0", "margin-left": "0" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_q_card_section, {
                              class: "col-md text-body1 text-foreground text-justify q-py-none",
                              style: { "border": "1px solid white", "padding-left": "0", "margin-left": "0" }
                            }, {
                              default: withCtx(() => [
                                createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, "In CV-QTLdb, users can: "),
                                createVNode("br"),
                                createVNode("ol", { class: "no-margin q-pl-lg q-py-xs" }, [
                                  createVNode("li", { class: "q-pa-xs" }, " Search for 4 types of variants, including SNPs, InDels, MNVs, and SVs. "),
                                  createVNode("li", { class: "q-pa-xs" }, " Search for associations between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and 4 types of variants. "),
                                  createVNode("li", { class: "q-pa-xs" }, " Search for GWAS associations of 180+ clinical traits across 4 types of variants. "),
                                  createVNode("li", { class: "q-pa-xs" }, " Obtain the correlation between QTLs and 180+ clinical traits. ")
                                ])
                              ]),
                              _: 1
                            })
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
            _push2(`</div><div class="row justify-around text-indigo-8 full-height relative-position content-section q-py-xl" style="${ssrRenderStyle({ "margin-top": "20px", "margin-bottom": "20px" })}" data-v-8c75068a${_scopeId}><!--[-->`);
            ssrRenderList(stats, (stat, i) => {
              _push2(`<div class="${ssrRenderClass([{ "feature-hover": hoveredIndex.value === i }, "text-center q-py-md cursor-pointer stat-block"])}" style="${ssrRenderStyle({ "flex": "10 10 auto", "width": "195px" })}" data-v-8c75068a${_scopeId}><div class="${ssrRenderClass([`text-${stat.color}`, "text-h4 text-bold"])}" data-v-8c75068a${_scopeId}>${ssrInterpolate(stat.stat)}</div><div class="${ssrRenderClass([`text-${stat.color}`, "text-h6 text-bold"])}" data-v-8c75068a${_scopeId}>${ssrInterpolate(stat.title)}</div></div>`);
            });
            _push2(`<!--]--></div><div class="row justify-center q-my-none" style="${ssrRenderStyle({ "width": "1140px", "margin": "20px auto 0 auto" })}" data-v-8c75068a${_scopeId}>`);
            _push2(ssrRenderComponent(_component_q_card, {
              flat: "",
              class: "col-12 q-my-xs",
              style: { "border": "1px solid gainsboro" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="q-px-md q-py-sm text-subtitle2 text-primary text-bold" style="${ssrRenderStyle({ "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" })}" data-v-8c75068a${_scopeId2}> Data Visualization </div>`);
                  _push3(ssrRenderComponent(_component_q_card_section, { class: "q-pa-none" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="chart-display-area" data-v-8c75068a${_scopeId3}><div class="row justify-center" data-v-8c75068a${_scopeId3}><!--[-->`);
                        ssrRenderList(phenotypes, (phenotype, pIndex) => {
                          _push4(ssrRenderComponent(_component_q_card, {
                            key: phenotype,
                            class: "chart-card",
                            style: { "width": "227px", "flex": "0 0 auto" },
                            flat: "",
                            bordered: ""
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_q_card_section, { class: "text-center chart-card-section-with-title" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div class="image-container-with-title" data-v-8c75068a${_scopeId5}><img${ssrRenderAttr("src", getPhenotypeImage(phenotype))}${ssrRenderAttr("alt", phenotype)} class="phenotype-image" data-v-8c75068a${_scopeId5}></div><div class="card-title" data-v-8c75068a${_scopeId5}>${ssrInterpolate(phenotype)}</div>`);
                                    } else {
                                      return [
                                        createVNode("div", { class: "image-container-with-title" }, [
                                          createVNode("img", {
                                            src: getPhenotypeImage(phenotype),
                                            alt: phenotype,
                                            class: "phenotype-image"
                                          }, null, 8, ["src", "alt"])
                                        ]),
                                        createVNode("div", { class: "card-title" }, toDisplayString(phenotype), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_q_card_section, { class: "text-center chart-card-section-with-title" }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "image-container-with-title" }, [
                                        createVNode("img", {
                                          src: getPhenotypeImage(phenotype),
                                          alt: phenotype,
                                          class: "phenotype-image"
                                        }, null, 8, ["src", "alt"])
                                      ]),
                                      createVNode("div", { class: "card-title" }, toDisplayString(phenotype), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]--></div></div><div class="chart-display-area" data-v-8c75068a${_scopeId3}><div class="row justify-center" data-v-8c75068a${_scopeId3}><!--[-->`);
                        ssrRenderList(variantTypes, (variantType, vIndex) => {
                          _push4(ssrRenderComponent(_component_q_card, {
                            key: variantType,
                            class: "chart-card",
                            style: { "width": "227px", "flex": "0 0 auto" },
                            flat: "",
                            bordered: ""
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_q_card_section, { class: "text-center chart-card-section-with-title" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div class="image-container-with-title" data-v-8c75068a${_scopeId5}><img${ssrRenderAttr("src", getVariantTypeImage(variantType))}${ssrRenderAttr("alt", variantType)} class="phenotype-image" data-v-8c75068a${_scopeId5}></div><div class="card-title" data-v-8c75068a${_scopeId5}>${ssrInterpolate(variantType)}</div>`);
                                    } else {
                                      return [
                                        createVNode("div", { class: "image-container-with-title" }, [
                                          createVNode("img", {
                                            src: getVariantTypeImage(variantType),
                                            alt: variantType,
                                            class: "phenotype-image"
                                          }, null, 8, ["src", "alt"])
                                        ]),
                                        createVNode("div", { class: "card-title" }, toDisplayString(variantType), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_q_card_section, { class: "text-center chart-card-section-with-title" }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "image-container-with-title" }, [
                                        createVNode("img", {
                                          src: getVariantTypeImage(variantType),
                                          alt: variantType,
                                          class: "phenotype-image"
                                        }, null, 8, ["src", "alt"])
                                      ]),
                                      createVNode("div", { class: "card-title" }, toDisplayString(variantType), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]--></div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "chart-display-area" }, [
                            createVNode("div", { class: "row justify-center" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(phenotypes, (phenotype, pIndex) => {
                                return createVNode(_component_q_card, {
                                  key: phenotype,
                                  class: "chart-card",
                                  style: { "width": "227px", "flex": "0 0 auto" },
                                  flat: "",
                                  bordered: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_q_card_section, { class: "text-center chart-card-section-with-title" }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "image-container-with-title" }, [
                                          createVNode("img", {
                                            src: getPhenotypeImage(phenotype),
                                            alt: phenotype,
                                            class: "phenotype-image"
                                          }, null, 8, ["src", "alt"])
                                        ]),
                                        createVNode("div", { class: "card-title" }, toDisplayString(phenotype), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 64))
                            ])
                          ]),
                          createVNode("div", { class: "chart-display-area" }, [
                            createVNode("div", { class: "row justify-center" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(variantTypes, (variantType, vIndex) => {
                                return createVNode(_component_q_card, {
                                  key: variantType,
                                  class: "chart-card",
                                  style: { "width": "227px", "flex": "0 0 auto" },
                                  flat: "",
                                  bordered: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_q_card_section, { class: "text-center chart-card-section-with-title" }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "image-container-with-title" }, [
                                          createVNode("img", {
                                            src: getVariantTypeImage(variantType),
                                            alt: variantType,
                                            class: "phenotype-image"
                                          }, null, 8, ["src", "alt"])
                                        ]),
                                        createVNode("div", { class: "card-title" }, toDisplayString(variantType), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 64))
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", {
                      class: "q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                    }, " Data Visualization "),
                    createVNode(_component_q_card_section, { class: "q-pa-none" }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "chart-display-area" }, [
                          createVNode("div", { class: "row justify-center" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(phenotypes, (phenotype, pIndex) => {
                              return createVNode(_component_q_card, {
                                key: phenotype,
                                class: "chart-card",
                                style: { "width": "227px", "flex": "0 0 auto" },
                                flat: "",
                                bordered: ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_q_card_section, { class: "text-center chart-card-section-with-title" }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "image-container-with-title" }, [
                                        createVNode("img", {
                                          src: getPhenotypeImage(phenotype),
                                          alt: phenotype,
                                          class: "phenotype-image"
                                        }, null, 8, ["src", "alt"])
                                      ]),
                                      createVNode("div", { class: "card-title" }, toDisplayString(phenotype), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024);
                            }), 64))
                          ])
                        ]),
                        createVNode("div", { class: "chart-display-area" }, [
                          createVNode("div", { class: "row justify-center" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(variantTypes, (variantType, vIndex) => {
                              return createVNode(_component_q_card, {
                                key: variantType,
                                class: "chart-card",
                                style: { "width": "227px", "flex": "0 0 auto" },
                                flat: "",
                                bordered: ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_q_card_section, { class: "text-center chart-card-section-with-title" }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "image-container-with-title" }, [
                                        createVNode("img", {
                                          src: getVariantTypeImage(variantType),
                                          alt: variantType,
                                          class: "phenotype-image"
                                        }, null, 8, ["src", "alt"])
                                      ]),
                                      createVNode("div", { class: "card-title" }, toDisplayString(variantType), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024);
                            }), 64))
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div style="${ssrRenderStyle({ "height": "60px" })}" data-v-8c75068a${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", {
                class: "row justify-center q-my-none",
                style: { "width": "1140px", "margin": "3px auto 0 auto" }
              }, [
                createVNode(_component_q_card, {
                  flat: "",
                  class: "col-12 q-my-xs",
                  style: { "border": "1px solid gainsboro" }
                }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      class: "q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                    }, " Welcome to CV-QTLdb! "),
                    createVNode(_component_q_card_section, {
                      class: "row text-body2 text-foreground text-justify q-px-md q-pb-none",
                      style: { "font-size": "17px", "line-height": "1.5" }
                    }, {
                      default: withCtx(() => [
                        createVNode("p", null, [
                          createTextVNode(" CV-QTLdb provides "),
                          createVNode("span", { class: "text-primary text-bold q-px-xs" }, " query and visualization tools for genetic variants, MolQTL information, and correlations between variations and clinical traits, "),
                          createTextVNode(" aiming to support researchers with a comprehensive resource for functional interpretation of complex genetic variations and advancing genetic research. ")
                        ]),
                        createVNode(_component_q_card, {
                          flat: "",
                          class: "col-11 col-md q-my-none q-py-none",
                          style: { "border": "1px solid white" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_q_card_section, {
                              class: "col-md text-body1 text-foreground text-justify q-py-none",
                              style: { "padding-left": "0", "margin-left": "0" }
                            }, {
                              default: withCtx(() => [
                                createVNode("span", {
                                  class: "text-primary text-bold rounded-borders q-px-xs",
                                  style: { "padding-left": "0", "margin-left": "0" }
                                }, "In CV-QTLdb, we provide: "),
                                createVNode("br"),
                                createVNode("ol", { class: "no-margin q-pl-lg q-py-xs" }, [
                                  createVNode("li", { class: "q-pa-xs" }, [
                                    createTextVNode(" Comprehensive data for "),
                                    createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " 4 types of genetic variants "),
                                    createTextVNode(" including SNPs, InDels, MNVs, and SVs; ")
                                  ]),
                                  createVNode("li", { class: "q-pa-xs" }, [
                                    createTextVNode(" Association analysis between "),
                                    createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " molecular QTLs (eQTL, apaQTL, sQTL, meQTL) "),
                                    createTextVNode(" and genetic variants; ")
                                  ]),
                                  createVNode("li", { class: "q-pa-xs" }, [
                                    createTextVNode(" GWAS associations for "),
                                    createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " 180+ clinical traits "),
                                    createTextVNode(" across different variant types; ")
                                  ]),
                                  createVNode("li", { class: "q-pa-xs" }, [
                                    createTextVNode(" Correlations between "),
                                    createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, " QTLs and clinical traits "),
                                    createTextVNode(" for functional interpretation; ")
                                  ])
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_q_card, {
                          flat: "",
                          class: "col-11 col-md q-py-none",
                          style: { "border": "1px solid white", "padding-left": "0", "margin-left": "0" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_q_card_section, {
                              class: "col-md text-body1 text-foreground text-justify q-py-none",
                              style: { "border": "1px solid white", "padding-left": "0", "margin-left": "0" }
                            }, {
                              default: withCtx(() => [
                                createVNode("span", { class: "text-primary text-bold rounded-borders q-px-xs" }, "In CV-QTLdb, users can: "),
                                createVNode("br"),
                                createVNode("ol", { class: "no-margin q-pl-lg q-py-xs" }, [
                                  createVNode("li", { class: "q-pa-xs" }, " Search for 4 types of variants, including SNPs, InDels, MNVs, and SVs. "),
                                  createVNode("li", { class: "q-pa-xs" }, " Search for associations between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and 4 types of variants. "),
                                  createVNode("li", { class: "q-pa-xs" }, " Search for GWAS associations of 180+ clinical traits across 4 types of variants. "),
                                  createVNode("li", { class: "q-pa-xs" }, " Obtain the correlation between QTLs and 180+ clinical traits. ")
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              createVNode("div", {
                ref_key: "featureRowRef",
                ref: featureRowRef,
                class: "row justify-around text-indigo-8 full-height relative-position content-section q-py-xl",
                style: { "margin-top": "20px", "margin-bottom": "20px" }
              }, [
                (openBlock(), createBlock(Fragment, null, renderList(stats, (stat, i) => {
                  return createVNode("div", {
                    class: ["text-center q-py-md cursor-pointer stat-block", { "feature-hover": hoveredIndex.value === i }],
                    key: stat.title,
                    ref_for: true,
                    ref: (el) => statRefs.value[i] = el,
                    onMouseenter: ($event) => hoveredIndex.value = i,
                    onMouseleave: ($event) => hoveredIndex.value = 0,
                    style: { "flex": "10 10 auto", "width": "195px" }
                  }, [
                    createVNode("div", {
                      class: ["text-h4 text-bold", `text-${stat.color}`]
                    }, toDisplayString(stat.stat), 3),
                    createVNode("div", {
                      class: ["text-h6 text-bold", `text-${stat.color}`]
                    }, toDisplayString(stat.title), 3)
                  ], 42, ["onMouseenter", "onMouseleave"]);
                }), 64))
              ], 512),
              createVNode("div", {
                class: "row justify-center q-my-none",
                style: { "width": "1140px", "margin": "20px auto 0 auto" }
              }, [
                createVNode(_component_q_card, {
                  flat: "",
                  class: "col-12 q-my-xs",
                  style: { "border": "1px solid gainsboro" }
                }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      class: "q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "20px", "line-height": "1.3" }
                    }, " Data Visualization "),
                    createVNode(_component_q_card_section, { class: "q-pa-none" }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "chart-display-area" }, [
                          createVNode("div", { class: "row justify-center" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(phenotypes, (phenotype, pIndex) => {
                              return createVNode(_component_q_card, {
                                key: phenotype,
                                class: "chart-card",
                                style: { "width": "227px", "flex": "0 0 auto" },
                                flat: "",
                                bordered: ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_q_card_section, { class: "text-center chart-card-section-with-title" }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "image-container-with-title" }, [
                                        createVNode("img", {
                                          src: getPhenotypeImage(phenotype),
                                          alt: phenotype,
                                          class: "phenotype-image"
                                        }, null, 8, ["src", "alt"])
                                      ]),
                                      createVNode("div", { class: "card-title" }, toDisplayString(phenotype), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024);
                            }), 64))
                          ])
                        ]),
                        createVNode("div", { class: "chart-display-area" }, [
                          createVNode("div", { class: "row justify-center" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(variantTypes, (variantType, vIndex) => {
                              return createVNode(_component_q_card, {
                                key: variantType,
                                class: "chart-card",
                                style: { "width": "227px", "flex": "0 0 auto" },
                                flat: "",
                                bordered: ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_q_card_section, { class: "text-center chart-card-section-with-title" }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "image-container-with-title" }, [
                                        createVNode("img", {
                                          src: getVariantTypeImage(variantType),
                                          alt: variantType,
                                          class: "phenotype-image"
                                        }, null, 8, ["src", "alt"])
                                      ]),
                                      createVNode("div", { class: "card-title" }, toDisplayString(variantType), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024);
                            }), 64))
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              createVNode("div", { style: { "height": "60px" } })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index copy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index_copy = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8c75068a"]]);

export { index_copy as default };
//# sourceMappingURL=index copy.vue.mjs.map

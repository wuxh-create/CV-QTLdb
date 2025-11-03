import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { c as clinicImage, m as methylationImage, a as apaImage, s as splicingImage, e as expressionImage } from './gwasQTL.svg.mjs';
import { f as useQuasar, _ as _export_sfc } from './server.mjs';
import { _ as __nuxt_component_0 } from '../_/QPage.mjs';
import { _ as __nuxt_component_2 } from '../_/QCard.mjs';
import { _ as __nuxt_component_3 } from '../_/QCardSection.mjs';
import { _ as __nuxt_component_8 } from '../_/QBtn.mjs';
import { _ as __nuxt_component_6 } from '../_/QAvatar.mjs';
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
import '../_/QIcon.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index copy 3",
  __ssrInlineRender: true,
  setup(__props) {
    const $q = useQuasar();
    const statRefs = ref([]);
    const phenotypeRefs = ref([]);
    const featureRowRef = ref();
    ref(null);
    ref(null);
    ref(null);
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
    const modules = [
      {
        title: "Variants",
        icon: "las la-dna",
        link: "/variants"
      },
      {
        title: "MolQTL",
        icon: "las la-chart-bar",
        link: "/qtl"
      },
      {
        title: "GWAS",
        icon: "lab la-connectdevelop",
        link: "/gwas"
      },
      {
        title: "Correlation",
        icon: "las la-chart-line",
        link: "/correlation"
      }
    ];
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
    const getQTLLabel = (phenotype, type) => {
      const labels = {
        Expression: { cis: "cis-eQTL", trans: "trans-eQTL" },
        Splicing: { cis: "cis-sQTL", trans: "trans-sQTL" },
        APA: { cis: "cis-apaQTL", trans: "trans-apaQTL" },
        Methylation: { cis: "cis-meQTL", trans: "trans-meQTL" }
      };
      return labels[phenotype][type];
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_q_page = __nuxt_component_0;
      const _component_q_card = __nuxt_component_2;
      const _component_q_card_section = __nuxt_component_3;
      const _component_q_btn = __nuxt_component_8;
      const _component_q_avatar = __nuxt_component_6;
      _push(ssrRenderComponent(_component_q_page, mergeProps({
        class: "q-mx-auto",
        style: { "min-height": "calc(100vh - 180px)", "padding-top": "0" }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="row justify-center q-my-none" style="${ssrRenderStyle({ "width": "1140px", "margin": "120px auto 0 auto" })}" data-v-03f104f6${_scopeId}>`);
            _push2(ssrRenderComponent(_component_q_card, {
              flat: "",
              class: "col-12 q-my-xs",
              style: { "border": "1px solid gainsboro" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="q-px-md q-py-sm text-subtitle2 text-primary text-bold" style="${ssrRenderStyle({ "background-color": "#e3f2fd", "font-size": "19px" })}" data-v-03f104f6${_scopeId2}> Welcome to CV-QTLdb! </div>`);
                  _push3(ssrRenderComponent(_component_q_card_section, {
                    class: "row text-body2 text-foreground text-justify q-px-md q-pb-none",
                    style: { "font-size": "17px", "line-height": "1.5" }
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<p data-v-03f104f6${_scopeId3}> CV-QTLdb provides <span class="text-primary text-bold q-px-xs" data-v-03f104f6${_scopeId3}> query and visualization tools for genetic variants, MolQTL information, and correlations between variations and clinical traits, </span> aiming to support researchers with a comprehensive resource for functional interpretation of complex genetic variations and advancing genetic research. </p>`);
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
                                    _push6(`<span class="text-primary text-bold rounded-borders q-px-xs" style="${ssrRenderStyle({ "padding-left": "0", "margin-left": "0" })}" data-v-03f104f6${_scopeId5}>In CV-QTLdb, we provide: </span><br data-v-03f104f6${_scopeId5}><ol class="no-margin q-pl-lg q-py-xs" data-v-03f104f6${_scopeId5}><li class="q-pa-xs" data-v-03f104f6${_scopeId5}> Comprehensive data for <span class="text-primary text-bold rounded-borders q-px-xs" data-v-03f104f6${_scopeId5}> 4 types of genetic variants </span> including SNPs, InDels, MNVs, and SVs; </li><li class="q-pa-xs" data-v-03f104f6${_scopeId5}> Association analysis between <span class="text-primary text-bold rounded-borders q-px-xs" data-v-03f104f6${_scopeId5}> molecular QTLs (eQTL, apaQTL, sQTL, meQTL) </span> and genetic variants; </li><li class="q-pa-xs" data-v-03f104f6${_scopeId5}> GWAS associations for <span class="text-primary text-bold rounded-borders q-px-xs" data-v-03f104f6${_scopeId5}> 180+ clinical traits </span> across different variant types; </li><li class="q-pa-xs" data-v-03f104f6${_scopeId5}> Correlations between <span class="text-primary text-bold rounded-borders q-px-xs" data-v-03f104f6${_scopeId5}> QTLs and clinical traits </span> for functional interpretation; </li></ol>`);
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
                                    _push6(`<span class="text-primary text-bold rounded-borders q-px-xs" data-v-03f104f6${_scopeId5}>In CV-QTLdb, users can: </span><br data-v-03f104f6${_scopeId5}><ol class="no-margin q-pl-lg q-py-xs" data-v-03f104f6${_scopeId5}><li class="q-pa-xs" data-v-03f104f6${_scopeId5}> Search for 4 types of variants, including SNPs, InDels, MNVs, and SVs. </li><li class="q-pa-xs" data-v-03f104f6${_scopeId5}> Search for associations between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and 4 types of variants. </li><li class="q-pa-xs" data-v-03f104f6${_scopeId5}> Search for GWAS associations of 180+ clinical traits across 4 types of variants. </li><li class="q-pa-xs" data-v-03f104f6${_scopeId5}> Obtain the correlation between QTLs and 180+ clinical traits. </li></ol>`);
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
                      style: { "background-color": "#e3f2fd", "font-size": "19px" }
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
            _push2(`</div><div class="row justify-around text-indigo-8 full-height relative-position content-section q-py-xl" style="${ssrRenderStyle({ "margin-top": "20px", "margin-bottom": "20px" })}" data-v-03f104f6${_scopeId}><!--[-->`);
            ssrRenderList(stats, (stat, i) => {
              _push2(`<div class="${ssrRenderClass([{ "feature-hover": hoveredIndex.value === i }, "text-center q-py-md cursor-pointer stat-block"])}" style="${ssrRenderStyle({ "flex": "10 10 auto", "width": "195px" })}" data-v-03f104f6${_scopeId}><div class="${ssrRenderClass([`text-${stat.color}`, "text-h4 text-bold"])}" data-v-03f104f6${_scopeId}>${ssrInterpolate(stat.stat)}</div><div class="${ssrRenderClass([`text-${stat.color}`, "text-h6 text-bold"])}" data-v-03f104f6${_scopeId}>${ssrInterpolate(stat.title)}</div></div>`);
            });
            _push2(`<!--]--></div><div class="content-section q-mt-lg" data-v-03f104f6${_scopeId}><div class="chart-display-area" data-v-03f104f6${_scopeId}><div class="row justify-around chart-row" data-v-03f104f6${_scopeId}><!--[-->`);
            ssrRenderList(phenotypes, (phenotype, pIndex) => {
              _push2(ssrRenderComponent(_component_q_card, {
                key: phenotype,
                class: "chart-card",
                style: { "width": "223px", "flex": "0 0 auto" },
                flat: "",
                bordered: ""
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_q_card_section, { class: "text-center chart-card-section" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="image-container" data-v-03f104f6${_scopeId3}><img${ssrRenderAttr("src", getPhenotypeImage(phenotype))}${ssrRenderAttr("alt", phenotype)} class="phenotype-image" data-v-03f104f6${_scopeId3}></div>`);
                        } else {
                          return [
                            createVNode("div", { class: "image-container" }, [
                              createVNode("img", {
                                src: getPhenotypeImage(phenotype),
                                alt: phenotype,
                                class: "phenotype-image"
                              }, null, 8, ["src", "alt"])
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_q_card_section, { class: "text-center chart-card-section" }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "image-container" }, [
                            createVNode("img", {
                              src: getPhenotypeImage(phenotype),
                              alt: phenotype,
                              class: "phenotype-image"
                            }, null, 8, ["src", "alt"])
                          ])
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div></div></div><div class="row justify-around text-indigo-8 q-mt-md relative-position content-section" data-v-03f104f6${_scopeId}><!--[-->`);
            ssrRenderList(phenotypes, (p, i) => {
              _push2(`<div class="text-center q-py-md" style="${ssrRenderStyle({ "flex": "0 0 auto", "width": "195px" })}" data-v-03f104f6${_scopeId}><div class="text-h5 text-bold q-mb-md" data-v-03f104f6${_scopeId}>${ssrInterpolate(p)}</div><div class="data-labels" data-v-03f104f6${_scopeId}>`);
              if (p === "Clinic traits") {
                _push2(`<div class="single-label" data-v-03f104f6${_scopeId}><div class="label-item" data-v-03f104f6${_scopeId}><span class="label-dot" style="${ssrRenderStyle({ "background-color": "#ff6b35" })}" data-v-03f104f6${_scopeId}></span> GWAS: ${ssrInterpolate(stats[hoveredIndex.value].qtl[p][0].toLocaleString())}</div></div>`);
              } else {
                _push2(`<div class="dual-labels" data-v-03f104f6${_scopeId}><div class="label-item" data-v-03f104f6${_scopeId}><span class="label-dot" style="${ssrRenderStyle({ "background-color": "#6c5ce7" })}" data-v-03f104f6${_scopeId}></span> ${ssrInterpolate(getQTLLabel(p, "cis"))}: ${ssrInterpolate(stats[hoveredIndex.value].qtl[p][0].toLocaleString())}</div><div class="label-item" data-v-03f104f6${_scopeId}><span class="label-dot" style="${ssrRenderStyle({ "background-color": "#fd79a8" })}" data-v-03f104f6${_scopeId}></span> ${ssrInterpolate(getQTLLabel(p, "trans"))}: ${ssrInterpolate(stats[hoveredIndex.value].qtl[p][1].toLocaleString())}</div></div>`);
              }
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div><div class="row justify-around text-indigo-8 content-section modules-section" data-v-03f104f6${_scopeId}><!--[-->`);
            ssrRenderList(modules, (module) => {
              _push2(ssrRenderComponent(_component_q_btn, {
                class: "q-py-lg col-sm-2 col-12 full-height",
                to: module.link,
                flat: "",
                "no-caps": "",
                key: module.title
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_q_avatar, {
                      icon: module.icon,
                      size: "50px",
                      color: unref($q).dark.isActive ? "primary" : "white"
                    }, null, _parent3, _scopeId2));
                    _push3(`<div class="q-my-md" data-v-03f104f6${_scopeId2}><div class="${ssrRenderClass([{ "text-dark": !unref($q).dark.isActive }, "text-h6 text-bold q-mb-sm"])}" data-v-03f104f6${_scopeId2}>${ssrInterpolate(module.title)}</div><div class="${ssrRenderClass([{
                      "text-grey-4": unref($q).dark.isActive,
                      "text-grey-8": !unref($q).dark.isActive
                    }, "text-subtitle2"])}" data-v-03f104f6${_scopeId2}>${ssrInterpolate(module.subtitle)}</div></div>`);
                  } else {
                    return [
                      createVNode(_component_q_avatar, {
                        icon: module.icon,
                        size: "50px",
                        color: unref($q).dark.isActive ? "primary" : "white"
                      }, null, 8, ["icon", "color"]),
                      createVNode("div", { class: "q-my-md" }, [
                        createVNode("div", {
                          class: ["text-h6 text-bold q-mb-sm", { "text-dark": !unref($q).dark.isActive }]
                        }, toDisplayString(module.title), 3),
                        createVNode("div", {
                          class: ["text-subtitle2", {
                            "text-grey-4": unref($q).dark.isActive,
                            "text-grey-8": !unref($q).dark.isActive
                          }]
                        }, toDisplayString(module.subtitle), 3)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", {
                class: "row justify-center q-my-none",
                style: { "width": "1140px", "margin": "120px auto 0 auto" }
              }, [
                createVNode(_component_q_card, {
                  flat: "",
                  class: "col-12 q-my-xs",
                  style: { "border": "1px solid gainsboro" }
                }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      class: "q-px-md q-py-sm text-subtitle2 text-primary text-bold",
                      style: { "background-color": "#e3f2fd", "font-size": "19px" }
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
              createVNode("div", { class: "content-section q-mt-lg" }, [
                createVNode("div", { class: "chart-display-area" }, [
                  createVNode("div", { class: "row justify-around chart-row" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(phenotypes, (phenotype, pIndex) => {
                      return createVNode(_component_q_card, {
                        key: phenotype,
                        class: "chart-card",
                        style: { "width": "223px", "flex": "0 0 auto" },
                        flat: "",
                        bordered: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_q_card_section, { class: "text-center chart-card-section" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "image-container" }, [
                                createVNode("img", {
                                  src: getPhenotypeImage(phenotype),
                                  alt: phenotype,
                                  class: "phenotype-image"
                                }, null, 8, ["src", "alt"])
                              ])
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
              createVNode("div", { class: "row justify-around text-indigo-8 q-mt-md relative-position content-section" }, [
                (openBlock(), createBlock(Fragment, null, renderList(phenotypes, (p, i) => {
                  return createVNode("div", {
                    class: "text-center q-py-md",
                    key: p,
                    ref_for: true,
                    ref: (el) => phenotypeRefs.value[i] = el,
                    style: { "flex": "0 0 auto", "width": "195px" }
                  }, [
                    createVNode("div", { class: "text-h5 text-bold q-mb-md" }, toDisplayString(p), 1),
                    createVNode("div", { class: "data-labels" }, [
                      p === "Clinic traits" ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "single-label"
                      }, [
                        createVNode("div", { class: "label-item" }, [
                          createVNode("span", {
                            class: "label-dot",
                            style: { "background-color": "#ff6b35" }
                          }),
                          createTextVNode(" GWAS: " + toDisplayString(stats[hoveredIndex.value].qtl[p][0].toLocaleString()), 1)
                        ])
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "dual-labels"
                      }, [
                        createVNode("div", { class: "label-item" }, [
                          createVNode("span", {
                            class: "label-dot",
                            style: { "background-color": "#6c5ce7" }
                          }),
                          createTextVNode(" " + toDisplayString(getQTLLabel(p, "cis")) + ": " + toDisplayString(stats[hoveredIndex.value].qtl[p][0].toLocaleString()), 1)
                        ]),
                        createVNode("div", { class: "label-item" }, [
                          createVNode("span", {
                            class: "label-dot",
                            style: { "background-color": "#fd79a8" }
                          }),
                          createTextVNode(" " + toDisplayString(getQTLLabel(p, "trans")) + ": " + toDisplayString(stats[hoveredIndex.value].qtl[p][1].toLocaleString()), 1)
                        ])
                      ]))
                    ])
                  ]);
                }), 64))
              ]),
              createVNode("div", { class: "row justify-around text-indigo-8 content-section modules-section" }, [
                (openBlock(), createBlock(Fragment, null, renderList(modules, (module) => {
                  return createVNode(_component_q_btn, {
                    class: "q-py-lg col-sm-2 col-12 full-height",
                    to: module.link,
                    flat: "",
                    "no-caps": "",
                    key: module.title
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_q_avatar, {
                        icon: module.icon,
                        size: "50px",
                        color: unref($q).dark.isActive ? "primary" : "white"
                      }, null, 8, ["icon", "color"]),
                      createVNode("div", { class: "q-my-md" }, [
                        createVNode("div", {
                          class: ["text-h6 text-bold q-mb-sm", { "text-dark": !unref($q).dark.isActive }]
                        }, toDisplayString(module.title), 3),
                        createVNode("div", {
                          class: ["text-subtitle2", {
                            "text-grey-4": unref($q).dark.isActive,
                            "text-grey-8": !unref($q).dark.isActive
                          }]
                        }, toDisplayString(module.subtitle), 3)
                      ])
                    ]),
                    _: 2
                  }, 1032, ["to"]);
                }), 64))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index copy 3.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index_copy_3 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-03f104f6"]]);

export { index_copy_3 as default };
//# sourceMappingURL=index copy 3.vue.mjs.map

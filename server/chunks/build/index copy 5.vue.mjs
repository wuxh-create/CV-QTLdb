import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, createBlock, openBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { c as clinicImage, m as methylationImage, a as apaImage, s as splicingImage, e as expressionImage } from './gwasQTL.svg.mjs';
import { I as InDelImage, S as SVImage, M as MNVImage, a as SNVImage, C as CorrelationImage } from './Correlation.svg.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import '../_/render.mjs';
import '../_/use-dark.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index copy 5",
  __ssrInlineRender: true,
  setup(__props) {
    useQuasar();
    const router = useRouter();
    const statRefs = ref([]);
    const featureRowRef = ref();
    const hoveredIndex = ref(0);
    const stats = [
      {
        title: "SNVs",
        stat: "18,400,996",
        targetValue: 18400996,
        color: "red-6"
      },
      {
        title: "InDels",
        stat: "2,089,567",
        targetValue: 2089567,
        color: "teal-6"
      },
      {
        title: "MNVs",
        stat: "428,349",
        targetValue: 428349,
        color: "orange-6"
      },
      {
        title: "SVs",
        stat: "96,203",
        targetValue: 96203,
        color: "indigo-6"
      }
    ];
    const animatedStats = ref(["0", "0", "0", "0"]);
    const phenotypes = ["SNV", "MNV", "SV", "InDel", "Clinic traits"];
    const variantTypes = ["Expression", "Splicing", "APA", "Methylation", "Correlation"];
    const getPhenotypeImage = (phenotype) => {
      const imageMap = {
        "SNV": SNVImage,
        "MNV": MNVImage,
        "SV": SVImage,
        "InDel": InDelImage,
        "Clinic traits": clinicImage
      };
      return imageMap[phenotype];
    };
    const getVariantTypeImage = (variantType) => {
      const imageMap = {
        "Expression": expressionImage,
        "Splicing": splicingImage,
        "APA": apaImage,
        "Methylation": methylationImage,
        "Correlation": CorrelationImage
      };
      return imageMap[variantType];
    };
    const navigateToPhenotype = (phenotype) => {
      const routeMap = {
        "SNV": "/gwas/snp",
        "MNV": "/gwas/mnv",
        "SV": "/gwas/sv",
        "InDel": "/gwas/indel",
        "Clinic traits": "/gwas"
      };
      const route = routeMap[phenotype];
      if (route) {
        router.push(route);
      }
    };
    const navigateToVariantType = (variantType) => {
      const routeMap = {
        "Expression": "/eQTL",
        "Splicing": "/sQTL",
        "APA": "/apaQTL",
        "Methylation": "/meQTL",
        "Correlation": "/correlation"
      };
      const route = routeMap[variantType];
      if (route) {
        router.push(route);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_q_page = __nuxt_component_0;
      const _component_q_card = __nuxt_component_2;
      const _component_q_card_section = __nuxt_component_3;
      _push(ssrRenderComponent(_component_q_page, mergeProps({ class: "q-mx-auto responsive-page" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="row justify-center q-my-none page-container" data-v-5e24c514${_scopeId}>`);
            _push2(ssrRenderComponent(_component_q_card, {
              flat: "",
              class: "col-12 q-my-xs content-card"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-header" data-v-5e24c514${_scopeId2}> Welcome to CV-QTLdb! </div>`);
                  _push3(ssrRenderComponent(_component_q_card_section, { class: "row text-body2 text-foreground text-justify section-content" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<p class="intro-text" data-v-5e24c514${_scopeId3}><span class="highlight-text" style="${ssrRenderStyle({ "border": "1px solid white" })}" data-v-5e24c514${_scopeId3}> CV-QTL (Complex Variant Quantitative Trait Loci) </span> refers to quantitative trait loci associated with complex genetic variants, including SNVs, MNVs, InDels, and SVs. <span class="highlight-text" data-v-5e24c514${_scopeId3}> CV-QTLdb </span> provides query and visualization tools for these genetic variants, MolQTL information, and correlations between variations and clinical traits, aiming to support researchers with a comprehensive resource for functional interpretation of complex genetic variations and advancing genetic research. </p>`);
                        _push4(ssrRenderComponent(_component_q_card, {
                          flat: "",
                          class: "info-card",
                          style: { "border": "1px solid white" }
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_q_card_section, { class: "info-section" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<span class="highlight-text info-title" data-v-5e24c514${_scopeId5}> In CV-QTLdb, we provide: </span><br data-v-5e24c514${_scopeId5}><ul class="no-margin q-pl-lg q-py-xs custom-bullet-list" data-v-5e24c514${_scopeId5}><li class="q-pa-xs list-item" data-v-5e24c514${_scopeId5}> Comprehensive data for four types of genetic variants including SNVs, InDels, MNVs, and SVs; </li><li class="q-pa-xs list-item" data-v-5e24c514${_scopeId5}> Association analysis between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and genetic variants; </li><li class="q-pa-xs list-item" data-v-5e24c514${_scopeId5}> GWAS associations for 162+ clinical traits across different variant types; </li><li class="q-pa-xs list-item" data-v-5e24c514${_scopeId5}> Correlations between QTLs and clinical traits for functional interpretation; </li></ul>`);
                                  } else {
                                    return [
                                      createVNode("span", { class: "highlight-text info-title" }, " In CV-QTLdb, we provide: "),
                                      createVNode("br"),
                                      createVNode("ul", { class: "no-margin q-pl-lg q-py-xs custom-bullet-list" }, [
                                        createVNode("li", { class: "q-pa-xs list-item" }, " Comprehensive data for four types of genetic variants including SNVs, InDels, MNVs, and SVs; "),
                                        createVNode("li", { class: "q-pa-xs list-item" }, " Association analysis between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and genetic variants; "),
                                        createVNode("li", { class: "q-pa-xs list-item" }, " GWAS associations for 162+ clinical traits across different variant types; "),
                                        createVNode("li", { class: "q-pa-xs list-item" }, " Correlations between QTLs and clinical traits for functional interpretation; ")
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_q_card_section, { class: "info-section" }, {
                                  default: withCtx(() => [
                                    createVNode("span", { class: "highlight-text info-title" }, " In CV-QTLdb, we provide: "),
                                    createVNode("br"),
                                    createVNode("ul", { class: "no-margin q-pl-lg q-py-xs custom-bullet-list" }, [
                                      createVNode("li", { class: "q-pa-xs list-item" }, " Comprehensive data for four types of genetic variants including SNVs, InDels, MNVs, and SVs; "),
                                      createVNode("li", { class: "q-pa-xs list-item" }, " Association analysis between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and genetic variants; "),
                                      createVNode("li", { class: "q-pa-xs list-item" }, " GWAS associations for 162+ clinical traits across different variant types; "),
                                      createVNode("li", { class: "q-pa-xs list-item" }, " Correlations between QTLs and clinical traits for functional interpretation; ")
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
                          class: "info-card",
                          style: { "border": "1px solid white" }
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_q_card_section, { class: "info-section" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<span class="highlight-text info-title" data-v-5e24c514${_scopeId5}> In CV-QTLdb, users can: </span><br data-v-5e24c514${_scopeId5}><ul class="no-margin q-pl-lg q-py-xs checkmark-list" data-v-5e24c514${_scopeId5}><li class="q-pa-xs list-item" data-v-5e24c514${_scopeId5}> Query and browse four types of complex variants (SNPs, InDels, MNVs, and SVs). </li><li class="q-pa-xs list-item" data-v-5e24c514${_scopeId5}> Explore associations between molecular QTLs (eQTL, sQTL, apaQTL, meQTL) and complex variants. </li><li class="q-pa-xs list-item" data-v-5e24c514${_scopeId5}> Search GWAS associations for 162+ clinical traits across all variant types to identify disease-related genetic variants. </li><li class="q-pa-xs list-item" data-v-5e24c514${_scopeId5}> Analyze correlations between QTLs and clinical traits. </li></ul>`);
                                  } else {
                                    return [
                                      createVNode("span", { class: "highlight-text info-title" }, " In CV-QTLdb, users can: "),
                                      createVNode("br"),
                                      createVNode("ul", { class: "no-margin q-pl-lg q-py-xs checkmark-list" }, [
                                        createVNode("li", { class: "q-pa-xs list-item" }, " Query and browse four types of complex variants (SNPs, InDels, MNVs, and SVs). "),
                                        createVNode("li", { class: "q-pa-xs list-item" }, " Explore associations between molecular QTLs (eQTL, sQTL, apaQTL, meQTL) and complex variants. "),
                                        createVNode("li", { class: "q-pa-xs list-item" }, " Search GWAS associations for 162+ clinical traits across all variant types to identify disease-related genetic variants. "),
                                        createVNode("li", { class: "q-pa-xs list-item" }, " Analyze correlations between QTLs and clinical traits. ")
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_q_card_section, { class: "info-section" }, {
                                  default: withCtx(() => [
                                    createVNode("span", { class: "highlight-text info-title" }, " In CV-QTLdb, users can: "),
                                    createVNode("br"),
                                    createVNode("ul", { class: "no-margin q-pl-lg q-py-xs checkmark-list" }, [
                                      createVNode("li", { class: "q-pa-xs list-item" }, " Query and browse four types of complex variants (SNPs, InDels, MNVs, and SVs). "),
                                      createVNode("li", { class: "q-pa-xs list-item" }, " Explore associations between molecular QTLs (eQTL, sQTL, apaQTL, meQTL) and complex variants. "),
                                      createVNode("li", { class: "q-pa-xs list-item" }, " Search GWAS associations for 162+ clinical traits across all variant types to identify disease-related genetic variants. "),
                                      createVNode("li", { class: "q-pa-xs list-item" }, " Analyze correlations between QTLs and clinical traits. ")
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
                          createVNode("p", { class: "intro-text" }, [
                            createVNode("span", {
                              class: "highlight-text",
                              style: { "border": "1px solid white" }
                            }, " CV-QTL (Complex Variant Quantitative Trait Loci) "),
                            createTextVNode(" refers to quantitative trait loci associated with complex genetic variants, including SNVs, MNVs, InDels, and SVs. "),
                            createVNode("span", { class: "highlight-text" }, " CV-QTLdb "),
                            createTextVNode(" provides query and visualization tools for these genetic variants, MolQTL information, and correlations between variations and clinical traits, aiming to support researchers with a comprehensive resource for functional interpretation of complex genetic variations and advancing genetic research. ")
                          ]),
                          createVNode(_component_q_card, {
                            flat: "",
                            class: "info-card",
                            style: { "border": "1px solid white" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_q_card_section, { class: "info-section" }, {
                                default: withCtx(() => [
                                  createVNode("span", { class: "highlight-text info-title" }, " In CV-QTLdb, we provide: "),
                                  createVNode("br"),
                                  createVNode("ul", { class: "no-margin q-pl-lg q-py-xs custom-bullet-list" }, [
                                    createVNode("li", { class: "q-pa-xs list-item" }, " Comprehensive data for four types of genetic variants including SNVs, InDels, MNVs, and SVs; "),
                                    createVNode("li", { class: "q-pa-xs list-item" }, " Association analysis between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and genetic variants; "),
                                    createVNode("li", { class: "q-pa-xs list-item" }, " GWAS associations for 162+ clinical traits across different variant types; "),
                                    createVNode("li", { class: "q-pa-xs list-item" }, " Correlations between QTLs and clinical traits for functional interpretation; ")
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_q_card, {
                            flat: "",
                            class: "info-card",
                            style: { "border": "1px solid white" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_q_card_section, { class: "info-section" }, {
                                default: withCtx(() => [
                                  createVNode("span", { class: "highlight-text info-title" }, " In CV-QTLdb, users can: "),
                                  createVNode("br"),
                                  createVNode("ul", { class: "no-margin q-pl-lg q-py-xs checkmark-list" }, [
                                    createVNode("li", { class: "q-pa-xs list-item" }, " Query and browse four types of complex variants (SNPs, InDels, MNVs, and SVs). "),
                                    createVNode("li", { class: "q-pa-xs list-item" }, " Explore associations between molecular QTLs (eQTL, sQTL, apaQTL, meQTL) and complex variants. "),
                                    createVNode("li", { class: "q-pa-xs list-item" }, " Search GWAS associations for 162+ clinical traits across all variant types to identify disease-related genetic variants. "),
                                    createVNode("li", { class: "q-pa-xs list-item" }, " Analyze correlations between QTLs and clinical traits. ")
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
                    createVNode("div", { class: "section-header" }, " Welcome to CV-QTLdb! "),
                    createVNode(_component_q_card_section, { class: "row text-body2 text-foreground text-justify section-content" }, {
                      default: withCtx(() => [
                        createVNode("p", { class: "intro-text" }, [
                          createVNode("span", {
                            class: "highlight-text",
                            style: { "border": "1px solid white" }
                          }, " CV-QTL (Complex Variant Quantitative Trait Loci) "),
                          createTextVNode(" refers to quantitative trait loci associated with complex genetic variants, including SNVs, MNVs, InDels, and SVs. "),
                          createVNode("span", { class: "highlight-text" }, " CV-QTLdb "),
                          createTextVNode(" provides query and visualization tools for these genetic variants, MolQTL information, and correlations between variations and clinical traits, aiming to support researchers with a comprehensive resource for functional interpretation of complex genetic variations and advancing genetic research. ")
                        ]),
                        createVNode(_component_q_card, {
                          flat: "",
                          class: "info-card",
                          style: { "border": "1px solid white" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_q_card_section, { class: "info-section" }, {
                              default: withCtx(() => [
                                createVNode("span", { class: "highlight-text info-title" }, " In CV-QTLdb, we provide: "),
                                createVNode("br"),
                                createVNode("ul", { class: "no-margin q-pl-lg q-py-xs custom-bullet-list" }, [
                                  createVNode("li", { class: "q-pa-xs list-item" }, " Comprehensive data for four types of genetic variants including SNVs, InDels, MNVs, and SVs; "),
                                  createVNode("li", { class: "q-pa-xs list-item" }, " Association analysis between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and genetic variants; "),
                                  createVNode("li", { class: "q-pa-xs list-item" }, " GWAS associations for 162+ clinical traits across different variant types; "),
                                  createVNode("li", { class: "q-pa-xs list-item" }, " Correlations between QTLs and clinical traits for functional interpretation; ")
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_q_card, {
                          flat: "",
                          class: "info-card",
                          style: { "border": "1px solid white" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_q_card_section, { class: "info-section" }, {
                              default: withCtx(() => [
                                createVNode("span", { class: "highlight-text info-title" }, " In CV-QTLdb, users can: "),
                                createVNode("br"),
                                createVNode("ul", { class: "no-margin q-pl-lg q-py-xs checkmark-list" }, [
                                  createVNode("li", { class: "q-pa-xs list-item" }, " Query and browse four types of complex variants (SNPs, InDels, MNVs, and SVs). "),
                                  createVNode("li", { class: "q-pa-xs list-item" }, " Explore associations between molecular QTLs (eQTL, sQTL, apaQTL, meQTL) and complex variants. "),
                                  createVNode("li", { class: "q-pa-xs list-item" }, " Search GWAS associations for 162+ clinical traits across all variant types to identify disease-related genetic variants. "),
                                  createVNode("li", { class: "q-pa-xs list-item" }, " Analyze correlations between QTLs and clinical traits. ")
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
            _push2(`</div><div class="row justify-center q-my-none page-container" data-v-5e24c514${_scopeId}>`);
            _push2(ssrRenderComponent(_component_q_card, {
              flat: "",
              class: "col-12 q-my-xs content-card"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-header" data-v-5e24c514${_scopeId2}> Data Summary </div>`);
                  _push3(ssrRenderComponent(_component_q_card_section, { class: "q-pa-md stats-section" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="row justify-around text-indigo-8 full-height relative-position stats-container" data-v-5e24c514${_scopeId3}><!--[-->`);
                        ssrRenderList(stats, (stat, i) => {
                          _push4(`<div class="${ssrRenderClass([{ "feature-hover": hoveredIndex.value === i }, "text-center q-py-md cursor-pointer stat-block"])}" data-v-5e24c514${_scopeId3}><div class="${ssrRenderClass([`text-${stat.color}`, "stat-number"])}" data-v-5e24c514${_scopeId3}>${ssrInterpolate(animatedStats.value[i])}</div><div class="${ssrRenderClass([`text-${stat.color}`, "stat-title"])}" data-v-5e24c514${_scopeId3}>${ssrInterpolate(stat.title)}</div></div>`);
                        });
                        _push4(`<!--]--></div>`);
                      } else {
                        return [
                          createVNode("div", {
                            ref_key: "featureRowRef",
                            ref: featureRowRef,
                            class: "row justify-around text-indigo-8 full-height relative-position stats-container"
                          }, [
                            (openBlock(), createBlock(Fragment, null, renderList(stats, (stat, i) => {
                              return createVNode("div", {
                                class: ["text-center q-py-md cursor-pointer stat-block", { "feature-hover": hoveredIndex.value === i }],
                                key: stat.title,
                                ref_for: true,
                                ref: (el) => statRefs.value[i] = el,
                                onMouseenter: ($event) => hoveredIndex.value = i,
                                onMouseleave: ($event) => hoveredIndex.value = 0
                              }, [
                                createVNode("div", {
                                  class: ["stat-number", `text-${stat.color}`]
                                }, toDisplayString(animatedStats.value[i]), 3),
                                createVNode("div", {
                                  class: ["stat-title", `text-${stat.color}`]
                                }, toDisplayString(stat.title), 3)
                              ], 42, ["onMouseenter", "onMouseleave"]);
                            }), 64))
                          ], 512)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "section-header" }, " Data Summary "),
                    createVNode(_component_q_card_section, { class: "q-pa-md stats-section" }, {
                      default: withCtx(() => [
                        createVNode("div", {
                          ref_key: "featureRowRef",
                          ref: featureRowRef,
                          class: "row justify-around text-indigo-8 full-height relative-position stats-container"
                        }, [
                          (openBlock(), createBlock(Fragment, null, renderList(stats, (stat, i) => {
                            return createVNode("div", {
                              class: ["text-center q-py-md cursor-pointer stat-block", { "feature-hover": hoveredIndex.value === i }],
                              key: stat.title,
                              ref_for: true,
                              ref: (el) => statRefs.value[i] = el,
                              onMouseenter: ($event) => hoveredIndex.value = i,
                              onMouseleave: ($event) => hoveredIndex.value = 0
                            }, [
                              createVNode("div", {
                                class: ["stat-number", `text-${stat.color}`]
                              }, toDisplayString(animatedStats.value[i]), 3),
                              createVNode("div", {
                                class: ["stat-title", `text-${stat.color}`]
                              }, toDisplayString(stat.title), 3)
                            ], 42, ["onMouseenter", "onMouseleave"]);
                          }), 64))
                        ], 512)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="row justify-center q-my-none page-container" data-v-5e24c514${_scopeId}>`);
            _push2(ssrRenderComponent(_component_q_card, {
              flat: "",
              class: "col-12 q-my-xs content-card"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-header" data-v-5e24c514${_scopeId2}> Data Visualization </div>`);
                  _push3(ssrRenderComponent(_component_q_card_section, { class: "q-pa-none" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="chart-display-area" data-v-5e24c514${_scopeId3}><div class="chart-row" data-v-5e24c514${_scopeId3}><!--[-->`);
                        ssrRenderList(phenotypes, (phenotype, pIndex) => {
                          _push4(ssrRenderComponent(_component_q_card, {
                            key: phenotype,
                            class: "chart-card clickable-card",
                            flat: "",
                            bordered: "",
                            onClick: ($event) => navigateToPhenotype(phenotype)
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_q_card_section, { class: "text-center chart-card-section-with-title" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div class="image-container-with-title" data-v-5e24c514${_scopeId5}><img${ssrRenderAttr("src", getPhenotypeImage(phenotype))}${ssrRenderAttr("alt", phenotype)} class="phenotype-image" data-v-5e24c514${_scopeId5}></div><div class="card-title" data-v-5e24c514${_scopeId5}>${ssrInterpolate(phenotype)}</div>`);
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
                        _push4(`<!--]--></div></div><div class="chart-display-area" data-v-5e24c514${_scopeId3}><div class="chart-row" data-v-5e24c514${_scopeId3}><!--[-->`);
                        ssrRenderList(variantTypes, (variantType, vIndex) => {
                          _push4(ssrRenderComponent(_component_q_card, {
                            key: variantType,
                            class: "chart-card clickable-card",
                            flat: "",
                            bordered: "",
                            onClick: ($event) => navigateToVariantType(variantType)
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_q_card_section, { class: "text-center chart-card-section-with-title" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div class="image-container-with-title" data-v-5e24c514${_scopeId5}><img${ssrRenderAttr("src", getVariantTypeImage(variantType))}${ssrRenderAttr("alt", variantType)} class="phenotype-image" data-v-5e24c514${_scopeId5}></div><div class="card-title" data-v-5e24c514${_scopeId5}>${ssrInterpolate(variantType)}</div>`);
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
                            createVNode("div", { class: "chart-row" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(phenotypes, (phenotype, pIndex) => {
                                return createVNode(_component_q_card, {
                                  key: phenotype,
                                  class: "chart-card clickable-card",
                                  flat: "",
                                  bordered: "",
                                  onClick: ($event) => navigateToPhenotype(phenotype)
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
                                }, 1032, ["onClick"]);
                              }), 64))
                            ])
                          ]),
                          createVNode("div", { class: "chart-display-area" }, [
                            createVNode("div", { class: "chart-row" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(variantTypes, (variantType, vIndex) => {
                                return createVNode(_component_q_card, {
                                  key: variantType,
                                  class: "chart-card clickable-card",
                                  flat: "",
                                  bordered: "",
                                  onClick: ($event) => navigateToVariantType(variantType)
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
                                }, 1032, ["onClick"]);
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
                    createVNode("div", { class: "section-header" }, " Data Visualization "),
                    createVNode(_component_q_card_section, { class: "q-pa-none" }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "chart-display-area" }, [
                          createVNode("div", { class: "chart-row" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(phenotypes, (phenotype, pIndex) => {
                              return createVNode(_component_q_card, {
                                key: phenotype,
                                class: "chart-card clickable-card",
                                flat: "",
                                bordered: "",
                                onClick: ($event) => navigateToPhenotype(phenotype)
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
                              }, 1032, ["onClick"]);
                            }), 64))
                          ])
                        ]),
                        createVNode("div", { class: "chart-display-area" }, [
                          createVNode("div", { class: "chart-row" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(variantTypes, (variantType, vIndex) => {
                              return createVNode(_component_q_card, {
                                key: variantType,
                                class: "chart-card clickable-card",
                                flat: "",
                                bordered: "",
                                onClick: ($event) => navigateToVariantType(variantType)
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
                              }, 1032, ["onClick"]);
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
            _push2(`</div><div class="bottom-spacer" data-v-5e24c514${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", { class: "row justify-center q-my-none page-container" }, [
                createVNode(_component_q_card, {
                  flat: "",
                  class: "col-12 q-my-xs content-card"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "section-header" }, " Welcome to CV-QTLdb! "),
                    createVNode(_component_q_card_section, { class: "row text-body2 text-foreground text-justify section-content" }, {
                      default: withCtx(() => [
                        createVNode("p", { class: "intro-text" }, [
                          createVNode("span", {
                            class: "highlight-text",
                            style: { "border": "1px solid white" }
                          }, " CV-QTL (Complex Variant Quantitative Trait Loci) "),
                          createTextVNode(" refers to quantitative trait loci associated with complex genetic variants, including SNVs, MNVs, InDels, and SVs. "),
                          createVNode("span", { class: "highlight-text" }, " CV-QTLdb "),
                          createTextVNode(" provides query and visualization tools for these genetic variants, MolQTL information, and correlations between variations and clinical traits, aiming to support researchers with a comprehensive resource for functional interpretation of complex genetic variations and advancing genetic research. ")
                        ]),
                        createVNode(_component_q_card, {
                          flat: "",
                          class: "info-card",
                          style: { "border": "1px solid white" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_q_card_section, { class: "info-section" }, {
                              default: withCtx(() => [
                                createVNode("span", { class: "highlight-text info-title" }, " In CV-QTLdb, we provide: "),
                                createVNode("br"),
                                createVNode("ul", { class: "no-margin q-pl-lg q-py-xs custom-bullet-list" }, [
                                  createVNode("li", { class: "q-pa-xs list-item" }, " Comprehensive data for four types of genetic variants including SNVs, InDels, MNVs, and SVs; "),
                                  createVNode("li", { class: "q-pa-xs list-item" }, " Association analysis between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and genetic variants; "),
                                  createVNode("li", { class: "q-pa-xs list-item" }, " GWAS associations for 162+ clinical traits across different variant types; "),
                                  createVNode("li", { class: "q-pa-xs list-item" }, " Correlations between QTLs and clinical traits for functional interpretation; ")
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_q_card, {
                          flat: "",
                          class: "info-card",
                          style: { "border": "1px solid white" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_q_card_section, { class: "info-section" }, {
                              default: withCtx(() => [
                                createVNode("span", { class: "highlight-text info-title" }, " In CV-QTLdb, users can: "),
                                createVNode("br"),
                                createVNode("ul", { class: "no-margin q-pl-lg q-py-xs checkmark-list" }, [
                                  createVNode("li", { class: "q-pa-xs list-item" }, " Query and browse four types of complex variants (SNPs, InDels, MNVs, and SVs). "),
                                  createVNode("li", { class: "q-pa-xs list-item" }, " Explore associations between molecular QTLs (eQTL, sQTL, apaQTL, meQTL) and complex variants. "),
                                  createVNode("li", { class: "q-pa-xs list-item" }, " Search GWAS associations for 162+ clinical traits across all variant types to identify disease-related genetic variants. "),
                                  createVNode("li", { class: "q-pa-xs list-item" }, " Analyze correlations between QTLs and clinical traits. ")
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
              createVNode("div", { class: "row justify-center q-my-none page-container" }, [
                createVNode(_component_q_card, {
                  flat: "",
                  class: "col-12 q-my-xs content-card"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "section-header" }, " Data Summary "),
                    createVNode(_component_q_card_section, { class: "q-pa-md stats-section" }, {
                      default: withCtx(() => [
                        createVNode("div", {
                          ref_key: "featureRowRef",
                          ref: featureRowRef,
                          class: "row justify-around text-indigo-8 full-height relative-position stats-container"
                        }, [
                          (openBlock(), createBlock(Fragment, null, renderList(stats, (stat, i) => {
                            return createVNode("div", {
                              class: ["text-center q-py-md cursor-pointer stat-block", { "feature-hover": hoveredIndex.value === i }],
                              key: stat.title,
                              ref_for: true,
                              ref: (el) => statRefs.value[i] = el,
                              onMouseenter: ($event) => hoveredIndex.value = i,
                              onMouseleave: ($event) => hoveredIndex.value = 0
                            }, [
                              createVNode("div", {
                                class: ["stat-number", `text-${stat.color}`]
                              }, toDisplayString(animatedStats.value[i]), 3),
                              createVNode("div", {
                                class: ["stat-title", `text-${stat.color}`]
                              }, toDisplayString(stat.title), 3)
                            ], 42, ["onMouseenter", "onMouseleave"]);
                          }), 64))
                        ], 512)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              createVNode("div", { class: "row justify-center q-my-none page-container" }, [
                createVNode(_component_q_card, {
                  flat: "",
                  class: "col-12 q-my-xs content-card"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "section-header" }, " Data Visualization "),
                    createVNode(_component_q_card_section, { class: "q-pa-none" }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "chart-display-area" }, [
                          createVNode("div", { class: "chart-row" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(phenotypes, (phenotype, pIndex) => {
                              return createVNode(_component_q_card, {
                                key: phenotype,
                                class: "chart-card clickable-card",
                                flat: "",
                                bordered: "",
                                onClick: ($event) => navigateToPhenotype(phenotype)
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
                              }, 1032, ["onClick"]);
                            }), 64))
                          ])
                        ]),
                        createVNode("div", { class: "chart-display-area" }, [
                          createVNode("div", { class: "chart-row" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(variantTypes, (variantType, vIndex) => {
                              return createVNode(_component_q_card, {
                                key: variantType,
                                class: "chart-card clickable-card",
                                flat: "",
                                bordered: "",
                                onClick: ($event) => navigateToVariantType(variantType)
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
                              }, 1032, ["onClick"]);
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
              createVNode("div", { class: "bottom-spacer" })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index copy 5.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index_copy_5 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5e24c514"]]);

export { index_copy_5 as default };
//# sourceMappingURL=index copy 5.vue.mjs.map

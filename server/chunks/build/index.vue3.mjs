import { defineComponent, computed, ref, reactive, mergeProps, withCtx, createVNode, createTextVNode, createBlock, openBlock, Fragment, renderList, unref, toDisplayString, withDirectives, vShow, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { q as queryQTL, a as queryPhenotypeHints, b as queryBoxplot } from './query_QTL.mjs';
import { _ as _sfc_main$1, m as model_qtl } from './Boxplot.vue2.mjs';
import { useRoute } from 'vue-router';
import { q as queryVariantHints } from './query_Variants.mjs';
import { f as useQuasar } from './server.mjs';
import { _ as __nuxt_component_0 } from '../_/QPage.mjs';
import { _ as __nuxt_component_1, a as __nuxt_component_4, b as __nuxt_component_5, c as __nuxt_component_9, d as __nuxt_component_13, e as __nuxt_component_11, f as __nuxt_component_12, g as __nuxt_component_10 } from '../_/QInnerLoading.mjs';
import { _ as __nuxt_component_2 } from '../_/QCard.mjs';
import { _ as __nuxt_component_3 } from '../_/QCardSection.mjs';
import { _ as __nuxt_component_6, a as __nuxt_component_7 } from '../_/QList.mjs';
import { _ as __nuxt_component_8 } from '../_/QBtn.mjs';
import { _ as __nuxt_component_14 } from '../_/QTooltip.mjs';
import 'echarts/core';
import 'echarts/renderers';
import 'echarts/charts';
import 'echarts/components';
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
import '../_/QIcon.mjs';
import '../_/QSeparator.mjs';
import '../_/use-dark.mjs';
import '../_/scroll.mjs';
import '../_/uid.mjs';
import '../_/use-checkbox.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const $q = useQuasar();
    const small_screen = computed(() => $q.screen.lt.sm);
    useRoute();
    const dialog_visible = ref(false);
    const plot_data = reactive({
      variant: "none",
      phenotype: "none",
      samples: {},
      data: {}
    });
    const showPlot = (row) => {
      queryBoxplot({
        variant_type: row.Variant_type,
        variant_id: row.Variant_ID,
        phenotype_type: row.Phenotype_type,
        phenotype_id: row.Phenotype_ID
      }).then((response) => {
        const formatResponse = response;
        if (formatResponse.data) {
          dialog_visible.value = true;
          plot_data.variant = row.Variant_ID;
          plot_data.phenotype = row.Phenotype_ID;
          for (const key in ["0", "1", "2"]) {
            if (formatResponse.data[`n_${key}`] > 0) {
              plot_data.samples[key] = formatResponse.data[`n_${key}`];
              plot_data.data[key] = formatResponse.data[`data_${key}`].split(",").map(Number);
            } else {
              plot_data.samples[key] = 0;
              plot_data.data[key] = [];
            }
          }
          console.log(plot_data);
        } else {
          $q.notify({
            message: "No data found!",
            color: "negative",
            icon: "warning"
          });
        }
      });
    };
    const query_phenotype_type = ref(null);
    const query_phenotype_id = ref(null);
    const query_variant_type = ref(null);
    const query_variant_id = ref(null);
    const current_show = reactive({
      variant_type: null,
      variant_id: null,
      phenotype_type: null,
      phenotype_id: null
    });
    const data_stat = reactive({
      SNP: 0,
      MNV: 0,
      InDel: 0,
      SV: 0,
      eQTL: 0,
      sQTL: 0,
      apaQTL: 0,
      meQTL: 0
    });
    const variant_type_options = ["SNP", "MNV", "InDel", "SV"];
    const phenotype_type_options = ["eQTL", "apaQTL", "sQTL", "meQTL"];
    const variant_id_options = ref([]);
    const phenotype_id_options = ref([]);
    const ref_variant_id = ref(null);
    const ref_phenotype_id = ref(null);
    const onVariantIDInput = (val, update, abort) => {
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
    const onPhenotypeIDInput = (val, update, abort) => {
      update(() => {
        if (val === "") {
          phenotype_id_options.value = [];
        } else {
          queryPhenotypeHints({
            phenotype_type: query_phenotype_type.value,
            input: val
          }).then((response) => {
            const formatResponse = response;
            if (formatResponse.data.length) {
              phenotype_id_options.value = formatResponse.data;
            } else {
              phenotype_id_options.value = [val];
            }
            phenotype_id_options.value = formatResponse.data;
            if (val !== "" && ref_phenotype_id.value.options.length) {
              ref_phenotype_id.value.setOptionIndex(-1);
              ref_phenotype_id.value.moveOptionSelection(1, true);
            }
          }).catch((error) => {
            phenotype_id_options.value = [val];
          });
        }
      });
      abort(() => {
      });
    };
    const formImputed = computed(() => {
      const variantTypeNotEmpty = Boolean(query_variant_type.value);
      const variantIDNotEmpty = Boolean(query_variant_id.value);
      const phenotypeTypeNotEmpty = Boolean(query_phenotype_type.value);
      const phenotypeIDNotEmpty = Boolean(query_phenotype_id.value);
      return variantTypeNotEmpty || variantIDNotEmpty || phenotypeTypeNotEmpty || phenotypeIDNotEmpty;
    });
    const examples = [
      {
        label: "example1",
        variantType: "InDel",
        variantID: null,
        phenotypeType: "eQTL",
        phenotypeID: null,
        disable: false
      },
      {
        label: "example2",
        variantType: "SV",
        variantID: null,
        phenotypeType: "sQTL",
        phenotypeID: null,
        disable: false
      },
      {
        label: "example3",
        variantType: "MNV",
        variantID: null,
        phenotypeType: "meQTL",
        phenotypeID: null,
        disable: false
      }
    ];
    const set_example = (example_obj) => {
      query_phenotype_type.value = example_obj.phenotypeType;
      query_phenotype_id.value = example_obj.phenotypeID;
      query_variant_type.value = example_obj.variantType;
      query_variant_id.value = example_obj.variantID;
    };
    const table_data = ref([]);
    const table_loading = ref(false);
    const table_pagination = ref({
      page: 1,
      rowsPerPage: 15,
      rowsNumber: 0,
      sortBy: "FDR",
      descending: false
    });
    const on_table_request = (props) => {
      table_loading.value = true;
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      queryQTL({
        variant_type: current_show.variant_type,
        variant_id: current_show.variant_id,
        phenotype_type: current_show.phenotype_type,
        phenotype_id: current_show.phenotype_id,
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
    const download_btn_loading = ref(false);
    const export_table = () => {
      $q.notify({
        message: "Download will be not available untill published",
        color: "negative",
        icon: "warning"
      });
      return;
    };
    const on_form_submit = () => {
      if (formImputed.value) {
        table_loading.value = true;
        queryQTL({
          variant_type: query_variant_type.value,
          variant_id: query_variant_id.value,
          phenotype_type: query_phenotype_type.value,
          phenotype_id: query_phenotype_id.value,
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
            current_show.phenotype_type = query_phenotype_type.value;
            current_show.phenotype_id = query_phenotype_id.value;
            data_stat.SNP = formatResponse.stat.SNP;
            data_stat.MNV = formatResponse.stat.MNV;
            data_stat.InDel = formatResponse.stat.InDel;
            data_stat.SV = formatResponse.stat.SV;
            data_stat.eQTL = formatResponse.stat.eQTL;
            data_stat.sQTL = formatResponse.stat.sQTL;
            data_stat.apaQTL = formatResponse.stat.apaQTL;
            data_stat.meQTL = formatResponse.stat.meQTL;
          } else {
            $q.notify({
              message: "No data found!",
              color: "negative",
              icon: "warning"
            });
          }
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
      query_phenotype_type.value = null;
      query_phenotype_id.value = null;
      query_variant_type.value = null;
      query_variant_id.value = null;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_q_page = __nuxt_component_0;
      const _component_q_dialog = __nuxt_component_1;
      const _component_q_card = __nuxt_component_2;
      const _component_q_card_section = __nuxt_component_3;
      const _component_q_form = __nuxt_component_4;
      const _component_q_select = __nuxt_component_5;
      const _component_q_item = __nuxt_component_6;
      const _component_q_item_section = __nuxt_component_7;
      const _component_q_btn = __nuxt_component_8;
      const _component_q_table = __nuxt_component_9;
      const _component_q_inner_loading = __nuxt_component_10;
      const _component_q_tr = __nuxt_component_11;
      const _component_q_th = __nuxt_component_12;
      const _component_q_td = __nuxt_component_13;
      const _component_q_tooltip = __nuxt_component_14;
      _push(ssrRenderComponent(_component_q_page, mergeProps({
        style: { "min-height": "calc(100vh - 125px)" },
        class: "q-pa-md"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_q_dialog, {
              modelValue: dialog_visible.value,
              "onUpdate:modelValue": ($event) => dialog_visible.value = $event
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_q_card, { style: { "width": "550px", "height": "500px" } }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_q_card_section, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_sfc_main$1, {
                                x_title: plot_data.variant,
                                y_title: plot_data.phenotype,
                                data: plot_data.data,
                                samples: plot_data.samples
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_sfc_main$1, {
                                  x_title: plot_data.variant,
                                  y_title: plot_data.phenotype,
                                  data: plot_data.data,
                                  samples: plot_data.samples
                                }, null, 8, ["x_title", "y_title", "data", "samples"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_q_card_section, null, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$1, {
                                x_title: plot_data.variant,
                                y_title: plot_data.phenotype,
                                data: plot_data.data,
                                samples: plot_data.samples
                              }, null, 8, ["x_title", "y_title", "data", "samples"])
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
                    createVNode(_component_q_card, { style: { "width": "550px", "height": "500px" } }, {
                      default: withCtx(() => [
                        createVNode(_component_q_card_section, null, {
                          default: withCtx(() => [
                            createVNode(_sfc_main$1, {
                              x_title: plot_data.variant,
                              y_title: plot_data.phenotype,
                              data: plot_data.data,
                              samples: plot_data.samples
                            }, null, 8, ["x_title", "y_title", "data", "samples"])
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
              style: { "max-width": "1200px" },
              class: "q-mx-auto q-my-none"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_q_card_section, { class: "row q-py-none q-px-none" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="full-width q-py-sm q-px-md bg-indigo-1 text-primary text-bold text-subtitle1"${_scopeId3}> Search MolQTL by Variant or Phenotype </div>`);
                      } else {
                        return [
                          createVNode("div", { class: "full-width q-py-sm q-px-md bg-indigo-1 text-primary text-bold text-subtitle1" }, " Search MolQTL by Variant or Phenotype ")
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
                        _push4(`<div class="row"${_scopeId3}><div class="col-12 col-sm-4 items-center justify-between q-my-xs"${_scopeId3}><span class="text-bold text-subtitle2 text-primary q-px-sm"${_scopeId3}>Variant Type:</span>`);
                        _push4(ssrRenderComponent(_component_q_select, {
                          dense: "",
                          outlined: "",
                          clearable: "",
                          "use-input": "",
                          "hide-dropdown-icon": "",
                          "label-color": "primary",
                          label: "Select variant type",
                          "input-debounce": "1000",
                          class: "col-sm-4 col-12 q-px-sm q-py-xs",
                          "input-class": "text-primary",
                          modelValue: query_variant_type.value,
                          "onUpdate:modelValue": ($event) => query_variant_type.value = $event,
                          options: variant_type_options
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="col-12 col-sm-8 items-center justify-between q-my-xs"${_scopeId3}><span class="text-bold text-subtitle2 text-primary q-px-sm"${_scopeId3}>Variant ID:</span>`);
                        _push4(ssrRenderComponent(_component_q_select, {
                          dense: "",
                          outlined: "",
                          clearable: "",
                          "use-input": "",
                          "hide-dropdown-icon": "",
                          "label-color": "primary",
                          label: "Input variant ID",
                          "input-debounce": "1000",
                          class: "col-12 col-sm-8 q-px-sm q-py-xs",
                          "input-class": "text-primary",
                          modelValue: query_variant_id.value,
                          "onUpdate:modelValue": ($event) => query_variant_id.value = $event,
                          options: variant_id_options.value,
                          onFilter: onVariantIDInput,
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
                        _push4(`</div></div><div class="row"${_scopeId3}><div class="col-12 col-sm-4 items-center justify-between q-my-xs"${_scopeId3}><span class="text-bold text-subtitle2 text-primary q-px-sm"${_scopeId3}>Phenotype Type:</span>`);
                        _push4(ssrRenderComponent(_component_q_select, {
                          dense: "",
                          outlined: "",
                          clearable: "",
                          "use-input": "",
                          "hide-dropdown-icon": "",
                          "label-color": "primary",
                          label: "Select phenotype type",
                          "input-debounce": "1000",
                          class: "col-sm-10 col-12 q-px-sm q-py-xs",
                          "input-class": "text-primary",
                          modelValue: query_phenotype_type.value,
                          "onUpdate:modelValue": ($event) => query_phenotype_type.value = $event,
                          options: phenotype_type_options
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="col-12 col-sm-8 items-center justify-between q-my-xs"${_scopeId3}><span class="text-bold text-subtitle2 text-primary q-px-sm"${_scopeId3}>Phenotype ID:</span>`);
                        _push4(ssrRenderComponent(_component_q_select, {
                          dense: "",
                          outlined: "",
                          clearable: "",
                          "use-input": "",
                          "hide-dropdown-icon": "",
                          "label-color": "primary",
                          label: "Input phenotype ID",
                          "input-debounce": "1000",
                          class: "col-sm-4 col-12 q-px-sm q-py-xs",
                          "input-class": "text-primary",
                          modelValue: query_phenotype_id.value,
                          "onUpdate:modelValue": ($event) => query_phenotype_id.value = $event,
                          options: phenotype_id_options.value,
                          onFilter: onPhenotypeIDInput,
                          ref_key: "ref_phenotype_id",
                          ref: ref_phenotype_id
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
                            createVNode("div", { class: "col-12 col-sm-4 items-center justify-between q-my-xs" }, [
                              createVNode("span", { class: "text-bold text-subtitle2 text-primary q-px-sm" }, "Variant Type:"),
                              createVNode(_component_q_select, {
                                dense: "",
                                outlined: "",
                                clearable: "",
                                "use-input": "",
                                "hide-dropdown-icon": "",
                                "label-color": "primary",
                                label: "Select variant type",
                                "input-debounce": "1000",
                                class: "col-sm-4 col-12 q-px-sm q-py-xs",
                                "input-class": "text-primary",
                                modelValue: query_variant_type.value,
                                "onUpdate:modelValue": ($event) => query_variant_type.value = $event,
                                options: variant_type_options
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "col-12 col-sm-8 items-center justify-between q-my-xs" }, [
                              createVNode("span", { class: "text-bold text-subtitle2 text-primary q-px-sm" }, "Variant ID:"),
                              createVNode(_component_q_select, {
                                dense: "",
                                outlined: "",
                                clearable: "",
                                "use-input": "",
                                "hide-dropdown-icon": "",
                                "label-color": "primary",
                                label: "Input variant ID",
                                "input-debounce": "1000",
                                class: "col-12 col-sm-8 q-px-sm q-py-xs",
                                "input-class": "text-primary",
                                modelValue: query_variant_id.value,
                                "onUpdate:modelValue": ($event) => query_variant_id.value = $event,
                                options: variant_id_options.value,
                                onFilter: onVariantIDInput,
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
                            ])
                          ]),
                          createVNode("div", { class: "row" }, [
                            createVNode("div", { class: "col-12 col-sm-4 items-center justify-between q-my-xs" }, [
                              createVNode("span", { class: "text-bold text-subtitle2 text-primary q-px-sm" }, "Phenotype Type:"),
                              createVNode(_component_q_select, {
                                dense: "",
                                outlined: "",
                                clearable: "",
                                "use-input": "",
                                "hide-dropdown-icon": "",
                                "label-color": "primary",
                                label: "Select phenotype type",
                                "input-debounce": "1000",
                                class: "col-sm-10 col-12 q-px-sm q-py-xs",
                                "input-class": "text-primary",
                                modelValue: query_phenotype_type.value,
                                "onUpdate:modelValue": ($event) => query_phenotype_type.value = $event,
                                options: phenotype_type_options
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "col-12 col-sm-8 items-center justify-between q-my-xs" }, [
                              createVNode("span", { class: "text-bold text-subtitle2 text-primary q-px-sm" }, "Phenotype ID:"),
                              createVNode(_component_q_select, {
                                dense: "",
                                outlined: "",
                                clearable: "",
                                "use-input": "",
                                "hide-dropdown-icon": "",
                                "label-color": "primary",
                                label: "Input phenotype ID",
                                "input-debounce": "1000",
                                class: "col-sm-4 col-12 q-px-sm q-py-xs",
                                "input-class": "text-primary",
                                modelValue: query_phenotype_id.value,
                                "onUpdate:modelValue": ($event) => query_phenotype_id.value = $event,
                                options: phenotype_id_options.value,
                                onFilter: onPhenotypeIDInput,
                                ref_key: "ref_phenotype_id",
                                ref: ref_phenotype_id
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
                      ripple: false,
                      onClick: ($event) => set_example(example)
                    }, null, _parent3, _scopeId2));
                  });
                  _push3(`<!--]--></div></div>`);
                } else {
                  return [
                    createVNode(_component_q_card_section, { class: "row q-py-none q-px-none" }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "full-width q-py-sm q-px-md bg-indigo-1 text-primary text-bold text-subtitle1" }, " Search MolQTL by Variant or Phenotype ")
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
                          createVNode("div", { class: "col-12 col-sm-4 items-center justify-between q-my-xs" }, [
                            createVNode("span", { class: "text-bold text-subtitle2 text-primary q-px-sm" }, "Variant Type:"),
                            createVNode(_component_q_select, {
                              dense: "",
                              outlined: "",
                              clearable: "",
                              "use-input": "",
                              "hide-dropdown-icon": "",
                              "label-color": "primary",
                              label: "Select variant type",
                              "input-debounce": "1000",
                              class: "col-sm-4 col-12 q-px-sm q-py-xs",
                              "input-class": "text-primary",
                              modelValue: query_variant_type.value,
                              "onUpdate:modelValue": ($event) => query_variant_type.value = $event,
                              options: variant_type_options
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "col-12 col-sm-8 items-center justify-between q-my-xs" }, [
                            createVNode("span", { class: "text-bold text-subtitle2 text-primary q-px-sm" }, "Variant ID:"),
                            createVNode(_component_q_select, {
                              dense: "",
                              outlined: "",
                              clearable: "",
                              "use-input": "",
                              "hide-dropdown-icon": "",
                              "label-color": "primary",
                              label: "Input variant ID",
                              "input-debounce": "1000",
                              class: "col-12 col-sm-8 q-px-sm q-py-xs",
                              "input-class": "text-primary",
                              modelValue: query_variant_id.value,
                              "onUpdate:modelValue": ($event) => query_variant_id.value = $event,
                              options: variant_id_options.value,
                              onFilter: onVariantIDInput,
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
                          ])
                        ]),
                        createVNode("div", { class: "row" }, [
                          createVNode("div", { class: "col-12 col-sm-4 items-center justify-between q-my-xs" }, [
                            createVNode("span", { class: "text-bold text-subtitle2 text-primary q-px-sm" }, "Phenotype Type:"),
                            createVNode(_component_q_select, {
                              dense: "",
                              outlined: "",
                              clearable: "",
                              "use-input": "",
                              "hide-dropdown-icon": "",
                              "label-color": "primary",
                              label: "Select phenotype type",
                              "input-debounce": "1000",
                              class: "col-sm-10 col-12 q-px-sm q-py-xs",
                              "input-class": "text-primary",
                              modelValue: query_phenotype_type.value,
                              "onUpdate:modelValue": ($event) => query_phenotype_type.value = $event,
                              options: phenotype_type_options
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "col-12 col-sm-8 items-center justify-between q-my-xs" }, [
                            createVNode("span", { class: "text-bold text-subtitle2 text-primary q-px-sm" }, "Phenotype ID:"),
                            createVNode(_component_q_select, {
                              dense: "",
                              outlined: "",
                              clearable: "",
                              "use-input": "",
                              "hide-dropdown-icon": "",
                              "label-color": "primary",
                              label: "Input phenotype ID",
                              "input-debounce": "1000",
                              class: "col-sm-4 col-12 q-px-sm q-py-xs",
                              "input-class": "text-primary",
                              modelValue: query_phenotype_id.value,
                              "onUpdate:modelValue": ($event) => query_phenotype_id.value = $event,
                              options: phenotype_id_options.value,
                              onFilter: onPhenotypeIDInput,
                              ref_key: "ref_phenotype_id",
                              ref: ref_phenotype_id
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
                            ripple: false,
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
              style: { "max-width": "1200px" },
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
                    columns: unref(model_qtl),
                    dense: small_screen.value,
                    loading: table_loading.value,
                    "rows-per-page-options": [15, 50, 100, 0],
                    "pagination-label": (firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}~${endRowIndex} / ${totalRowsNumber}`,
                    onRequest: on_table_request,
                    separator: "cell",
                    "no-data-label": "No data",
                    ref: "table"
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
                        _push4(ssrRenderComponent(_component_q_btn, {
                          flat: "",
                          dense: "",
                          ripple: false,
                          loading: download_btn_loading.value,
                          icon: "file_download",
                          onClick: export_table
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
                            }, null, 8, ["icon", "onClick"]),
                            createVNode(_component_q_btn, {
                              flat: "",
                              dense: "",
                              ripple: false,
                              loading: download_btn_loading.value,
                              icon: "file_download",
                              onClick: export_table
                            }, null, 8, ["loading"])
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
                    "body-cell-Plot": withCtx((props, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_q_td, {
                          key: "plot",
                          props
                        }, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_q_btn, {
                                size: "md",
                                color: "primary",
                                icon: "bar_chart",
                                dense: "",
                                rounded: "",
                                outline: "",
                                onClick: ($event) => showPlot(props.row)
                              }, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_q_tooltip, null, {
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(` Show boxplot `);
                                        } else {
                                          return [
                                            createTextVNode(" Show boxplot ")
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_q_tooltip, null, {
                                        default: withCtx(() => [
                                          createTextVNode(" Show boxplot ")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_q_btn, {
                                  size: "md",
                                  color: "primary",
                                  icon: "bar_chart",
                                  dense: "",
                                  rounded: "",
                                  outline: "",
                                  onClick: ($event) => showPlot(props.row)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_q_tooltip, null, {
                                      default: withCtx(() => [
                                        createTextVNode(" Show boxplot ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 2
                                }, 1032, ["onClick"])
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_q_td, {
                            key: "plot",
                            props
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_q_btn, {
                                size: "md",
                                color: "primary",
                                icon: "bar_chart",
                                dense: "",
                                rounded: "",
                                outline: "",
                                onClick: ($event) => showPlot(props.row)
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_q_tooltip, null, {
                                    default: withCtx(() => [
                                      createTextVNode(" Show boxplot ")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 2
                              }, 1032, ["onClick"])
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
                      columns: unref(model_qtl),
                      dense: small_screen.value,
                      loading: table_loading.value,
                      "rows-per-page-options": [15, 50, 100, 0],
                      "pagination-label": (firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}~${endRowIndex} / ${totalRowsNumber}`,
                      onRequest: on_table_request,
                      separator: "cell",
                      "no-data-label": "No data",
                      ref: "table"
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
                          }, null, 8, ["icon", "onClick"]),
                          createVNode(_component_q_btn, {
                            flat: "",
                            dense: "",
                            ripple: false,
                            loading: download_btn_loading.value,
                            icon: "file_download",
                            onClick: export_table
                          }, null, 8, ["loading"])
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
                      "body-cell-Plot": withCtx((props) => [
                        createVNode(_component_q_td, {
                          key: "plot",
                          props
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_q_btn, {
                              size: "md",
                              color: "primary",
                              icon: "bar_chart",
                              dense: "",
                              rounded: "",
                              outline: "",
                              onClick: ($event) => showPlot(props.row)
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_q_tooltip, null, {
                                  default: withCtx(() => [
                                    createTextVNode(" Show boxplot ")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 2
                            }, 1032, ["onClick"])
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
              createVNode(_component_q_dialog, {
                modelValue: dialog_visible.value,
                "onUpdate:modelValue": ($event) => dialog_visible.value = $event
              }, {
                default: withCtx(() => [
                  createVNode(_component_q_card, { style: { "width": "550px", "height": "500px" } }, {
                    default: withCtx(() => [
                      createVNode(_component_q_card_section, null, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$1, {
                            x_title: plot_data.variant,
                            y_title: plot_data.phenotype,
                            data: plot_data.data,
                            samples: plot_data.samples
                          }, null, 8, ["x_title", "y_title", "data", "samples"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_q_card, {
                flat: "",
                bordered: "",
                style: { "max-width": "1200px" },
                class: "q-mx-auto q-my-none"
              }, {
                default: withCtx(() => [
                  createVNode(_component_q_card_section, { class: "row q-py-none q-px-none" }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "full-width q-py-sm q-px-md bg-indigo-1 text-primary text-bold text-subtitle1" }, " Search MolQTL by Variant or Phenotype ")
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
                        createVNode("div", { class: "col-12 col-sm-4 items-center justify-between q-my-xs" }, [
                          createVNode("span", { class: "text-bold text-subtitle2 text-primary q-px-sm" }, "Variant Type:"),
                          createVNode(_component_q_select, {
                            dense: "",
                            outlined: "",
                            clearable: "",
                            "use-input": "",
                            "hide-dropdown-icon": "",
                            "label-color": "primary",
                            label: "Select variant type",
                            "input-debounce": "1000",
                            class: "col-sm-4 col-12 q-px-sm q-py-xs",
                            "input-class": "text-primary",
                            modelValue: query_variant_type.value,
                            "onUpdate:modelValue": ($event) => query_variant_type.value = $event,
                            options: variant_type_options
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", { class: "col-12 col-sm-8 items-center justify-between q-my-xs" }, [
                          createVNode("span", { class: "text-bold text-subtitle2 text-primary q-px-sm" }, "Variant ID:"),
                          createVNode(_component_q_select, {
                            dense: "",
                            outlined: "",
                            clearable: "",
                            "use-input": "",
                            "hide-dropdown-icon": "",
                            "label-color": "primary",
                            label: "Input variant ID",
                            "input-debounce": "1000",
                            class: "col-12 col-sm-8 q-px-sm q-py-xs",
                            "input-class": "text-primary",
                            modelValue: query_variant_id.value,
                            "onUpdate:modelValue": ($event) => query_variant_id.value = $event,
                            options: variant_id_options.value,
                            onFilter: onVariantIDInput,
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
                        ])
                      ]),
                      createVNode("div", { class: "row" }, [
                        createVNode("div", { class: "col-12 col-sm-4 items-center justify-between q-my-xs" }, [
                          createVNode("span", { class: "text-bold text-subtitle2 text-primary q-px-sm" }, "Phenotype Type:"),
                          createVNode(_component_q_select, {
                            dense: "",
                            outlined: "",
                            clearable: "",
                            "use-input": "",
                            "hide-dropdown-icon": "",
                            "label-color": "primary",
                            label: "Select phenotype type",
                            "input-debounce": "1000",
                            class: "col-sm-10 col-12 q-px-sm q-py-xs",
                            "input-class": "text-primary",
                            modelValue: query_phenotype_type.value,
                            "onUpdate:modelValue": ($event) => query_phenotype_type.value = $event,
                            options: phenotype_type_options
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", { class: "col-12 col-sm-8 items-center justify-between q-my-xs" }, [
                          createVNode("span", { class: "text-bold text-subtitle2 text-primary q-px-sm" }, "Phenotype ID:"),
                          createVNode(_component_q_select, {
                            dense: "",
                            outlined: "",
                            clearable: "",
                            "use-input": "",
                            "hide-dropdown-icon": "",
                            "label-color": "primary",
                            label: "Input phenotype ID",
                            "input-debounce": "1000",
                            class: "col-sm-4 col-12 q-px-sm q-py-xs",
                            "input-class": "text-primary",
                            modelValue: query_phenotype_id.value,
                            "onUpdate:modelValue": ($event) => query_phenotype_id.value = $event,
                            options: phenotype_id_options.value,
                            onFilter: onPhenotypeIDInput,
                            ref_key: "ref_phenotype_id",
                            ref: ref_phenotype_id
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
                          ripple: false,
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
                style: { "max-width": "1200px" },
                class: "q-mx-auto q-my-md q-px-none"
              }, {
                default: withCtx(() => [
                  createVNode(_component_q_table, {
                    flat: "",
                    "row-key": "label",
                    pagination: table_pagination.value,
                    "onUpdate:pagination": ($event) => table_pagination.value = $event,
                    rows: table_data.value,
                    columns: unref(model_qtl),
                    dense: small_screen.value,
                    loading: table_loading.value,
                    "rows-per-page-options": [15, 50, 100, 0],
                    "pagination-label": (firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}~${endRowIndex} / ${totalRowsNumber}`,
                    onRequest: on_table_request,
                    separator: "cell",
                    "no-data-label": "No data",
                    ref: "table"
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
                        }, null, 8, ["icon", "onClick"]),
                        createVNode(_component_q_btn, {
                          flat: "",
                          dense: "",
                          ripple: false,
                          loading: download_btn_loading.value,
                          icon: "file_download",
                          onClick: export_table
                        }, null, 8, ["loading"])
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
                    "body-cell-Plot": withCtx((props) => [
                      createVNode(_component_q_td, {
                        key: "plot",
                        props
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_q_btn, {
                            size: "md",
                            color: "primary",
                            icon: "bar_chart",
                            dense: "",
                            rounded: "",
                            outline: "",
                            onClick: ($event) => showPlot(props.row)
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_q_tooltip, null, {
                                default: withCtx(() => [
                                  createTextVNode(" Show boxplot ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 2
                          }, 1032, ["onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/qtl/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.vue3.mjs.map

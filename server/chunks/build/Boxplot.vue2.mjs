import { watch, inject, computed, unref, watchEffect, defineComponent, h, shallowRef, toRefs, nextTick, ref, mergeProps } from 'vue';
import { throttle, init, use } from 'echarts/core';
import { ssrRenderComponent } from 'vue/server-renderer';
import { SVGRenderer } from 'echarts/renderers';
import { BoxplotChart, ScatterChart } from 'echarts/charts';
import { DatasetComponent, TitleComponent, TooltipComponent, ToolboxComponent, GridComponent, LegendComponent } from 'echarts/components';

const model_qtl = [
  {
    name: "Plot",
    label: "Plot",
    field: "",
    sortable: false,
    align: "center"
  },
  {
    name: "QTL_type",
    label: "QTL_type",
    field: "qtl_type",
    sortable: false,
    align: "center"
  },
  {
    name: "Variant_type",
    label: "Variant_type",
    field: "Variant_type",
    sortable: false,
    align: "center"
  },
  {
    name: "Variant_ID",
    label: "Variant_ID",
    field: "Variant_ID",
    sortable: false,
    align: "center"
  },
  {
    name: "Variant_position",
    label: "Variant_position",
    field: "Variant_position",
    sortable: false,
    align: "center"
  },
  {
    name: "Ref",
    label: "Ref",
    field: "Ref",
    sortable: false,
    align: "center"
  },
  {
    name: "Alt",
    label: "Alt",
    field: "Alt",
    sortable: false,
    align: "center"
  },
  {
    name: "Phenotype_type",
    label: "Phenotype_type",
    field: "Phenotype_type",
    sortable: false,
    align: "center"
  },
  {
    name: "Phenotype_ID",
    label: "Phenotype_ID",
    field: "Phenotype_ID",
    sortable: false,
    align: "center"
  },
  {
    name: "Phenotype_position",
    label: "Phenotype_position",
    field: "Phenotype_position",
    sortable: false,
    align: "center"
  },
  {
    name: "Gene",
    label: "Gene",
    field: "Gene",
    sortable: false,
    align: "center"
  },
  {
    name: "distance",
    // name要和field一致，否则会无法排序
    label: "Distance",
    field: "distance",
    sortable: true,
    // sortable: false,
    align: "center",
    format: (val, _row) => Number(val).toFixed(0)
  },
  {
    name: "Beta",
    label: "Beta",
    field: "Beta",
    sortable: true,
    align: "center",
    format: (val, _row) => Number(val).toFixed(3)
  },
  {
    name: "T_stat",
    label: "T_stat",
    field: "T_stat",
    sortable: true,
    align: "center",
    format: (val, _row) => Number(val).toFixed(3)
  },
  {
    name: "Se",
    label: "Se",
    field: "Se",
    sortable: true,
    align: "center",
    format: (val, _row) => Number(val).toFixed(3)
  },
  {
    name: "R_pearson",
    label: "R_pearson",
    field: "R_pearson",
    sortable: true,
    align: "center",
    format: (val, _row) => Number(val).toFixed(3)
  },
  {
    name: "FDR",
    label: "FDR",
    field: "FDR",
    sortable: true,
    align: "center",
    format: (val, _row) => Number(val).toExponential(3)
  }
];

const METHOD_NAMES = [
  "getWidth",
  "getHeight",
  "getDom",
  "getOption",
  "resize",
  "dispatchAction",
  "convertToPixel",
  "convertFromPixel",
  "containPixel",
  "getDataURL",
  "getConnectedDataURL",
  "appendData",
  "clear",
  "isDisposed",
  "dispose"
];
function usePublicAPI(chart) {
  function makePublicMethod(name) {
    return (...args) => {
      if (!chart.value) {
        throw new Error("ECharts is not initialized yet.");
      }
      return chart.value[name].apply(chart.value, args);
    };
  }
  function makePublicMethods() {
    const methods = /* @__PURE__ */ Object.create(null);
    METHOD_NAMES.forEach((name) => {
      methods[name] = makePublicMethod(name);
    });
    return methods;
  }
  return makePublicMethods();
}

function useAutoresize(chart, autoresize, root) {
  watch(
    [root, chart, autoresize],
    ([root2, chart2, autoresize2], _, onCleanup) => {
      let ro = null;
      if (root2 && chart2 && autoresize2) {
        const { offsetWidth, offsetHeight } = root2;
        const autoresizeOptions = autoresize2 === true ? {} : autoresize2;
        const { throttle: wait = 100, onResize } = autoresizeOptions;
        let initialResizeTriggered = false;
        const callback = (entry, ob) => {
          chart2.resize({ height: "auto", width: "auto" });
          onResize == null ? void 0 : onResize(entry, ob);
        };
        const resizeCallback = wait ? (
          // @ts-expect-error callback can accept params
          throttle(callback, wait)
        ) : callback;
        ro = new ResizeObserver((entry, observer) => {
          if (!initialResizeTriggered) {
            initialResizeTriggered = true;
            if (root2.offsetWidth === offsetWidth && root2.offsetHeight === offsetHeight) {
              return;
            }
          }
          resizeCallback(entry, observer);
        });
        ro.observe(root2);
      }
      onCleanup(() => {
        if (ro) {
          ro.disconnect();
          ro = null;
        }
      });
    }
  );
}
const autoresizeProps = {
  autoresize: [Boolean, Object]
};

const LOADING_OPTIONS_KEY = "ecLoadingOptions";
function useLoading(chart, loading, loadingOptions) {
  const defaultLoadingOptions = inject(LOADING_OPTIONS_KEY, {});
  const realLoadingOptions = computed(() => ({
    ...unref(defaultLoadingOptions) || {},
    ...loadingOptions == null ? void 0 : loadingOptions.value
  }));
  watchEffect(() => {
    const instance = chart.value;
    if (!instance) {
      return;
    }
    if (loading.value) {
      instance.showLoading(realLoadingOptions.value);
    } else {
      instance.hideLoading();
    }
  });
}
const loadingProps = {
  loading: Boolean,
  loadingOptions: Object
};

const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
function omitOn(attrs) {
  const result = {};
  for (const key in attrs) {
    if (!isOn(key)) {
      result[key] = attrs[key];
    }
  }
  return result;
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
let registered = null;
const TAG_NAME = "x-vue-echarts";
{
  globalThis.HTMLElement = Object;
}
class EChartsElement extends HTMLElement {
  constructor() {
    super(...arguments);
    __publicField(this, "__dispose", null);
  }
  disconnectedCallback() {
    if (this.__dispose) {
      this.__dispose();
      this.__dispose = null;
    }
  }
}
function register() {
  if (registered != null) {
    return registered;
  }
  if (typeof HTMLElement === "undefined" || typeof customElements === "undefined") {
    return registered = false;
  }
  try {
    if (customElements.get(TAG_NAME) == null) {
      customElements.define(TAG_NAME, EChartsElement);
    }
  } catch {
    return registered = false;
  }
  return registered = true;
}

const THEME_KEY = "ecTheme";
const INIT_OPTIONS_KEY = "ecInitOptions";
const UPDATE_OPTIONS_KEY = "ecUpdateOptions";

register();
const __nuxt_component_0 = defineComponent({
  props: {
    option: Object,
    theme: {
      type: [Object, String]
    },
    initOptions: Object,
    updateOptions: Object,
    group: String,
    manualUpdate: Boolean,
    ...autoresizeProps,
    ...loadingProps
  },
  emits: {},
  inheritAttrs: false,
  setup(props, { attrs }) {
    const root = shallowRef();
    const chart = shallowRef();
    const manualOption = shallowRef();
    const defaultTheme = inject(THEME_KEY, null);
    const defaultInitOptions = inject(INIT_OPTIONS_KEY, null);
    const defaultUpdateOptions = inject(UPDATE_OPTIONS_KEY, null);
    const { autoresize, manualUpdate, loading, loadingOptions } = toRefs(props);
    const realOption = computed(
      () => manualOption.value || props.option || null
    );
    const realTheme = computed(() => props.theme || unref(defaultTheme) || {});
    const realInitOptions = computed(
      () => props.initOptions || unref(defaultInitOptions) || {}
    );
    const realUpdateOptions = computed(
      () => props.updateOptions || unref(defaultUpdateOptions) || {}
    );
    const nativeListeners = shallowRef({});
    const realAttrs = computed(() => ({
      ...omitOn(attrs),
      ...nativeListeners.value
    }));
    const realListeners = {};
    function init$1(option) {
      const _nativeListeners = {};
      Object.keys(attrs).filter((key) => isOn(key)).forEach((key) => {
        let event = key.charAt(2).toLowerCase() + key.slice(3);
        if (event.indexOf("native:") === 0) {
          const nativeKey = `on${event.charAt(7).toUpperCase()}${event.slice(
            8
          )}`;
          _nativeListeners[nativeKey] = attrs[key];
          return;
        }
        if (event.substring(event.length - 4) === "Once") {
          event = `~${event.substring(0, event.length - 4)}`;
        }
        realListeners[event] = attrs[key];
      });
      nativeListeners.value = _nativeListeners;
      if (!root.value) {
        return;
      }
      const instance = chart.value = init(
        root.value,
        realTheme.value,
        realInitOptions.value
      );
      if (props.group) {
        instance.group = props.group;
      }
      Object.keys(realListeners).forEach((key) => {
        let handler = realListeners[key];
        if (!handler) {
          return;
        }
        let event = key.toLowerCase();
        if (event.charAt(0) === "~") {
          event = event.substring(1);
          handler.__once__ = true;
        }
        let target = instance;
        if (event.indexOf("zr:") === 0) {
          target = instance.getZr();
          event = event.substring(3);
        }
        if (handler.__once__) {
          delete handler.__once__;
          const raw = handler;
          handler = (...args) => {
            raw(...args);
            target.off(event, handler);
          };
        }
        target.on(event, handler);
      });
      function resize() {
        if (instance && !instance.isDisposed()) {
          instance.resize();
        }
      }
      function commit() {
        const opt = option || realOption.value;
        if (opt) {
          instance.setOption(opt, realUpdateOptions.value);
        }
      }
      if (autoresize.value) {
        nextTick(() => {
          resize();
          commit();
        });
      } else {
        commit();
      }
    }
    function setOption(option, updateOptions) {
      if (props.manualUpdate) {
        manualOption.value = option;
      }
      if (!chart.value) {
        init$1(option);
      } else {
        chart.value.setOption(option, updateOptions || {});
      }
    }
    function cleanup() {
      if (chart.value) {
        chart.value.dispose();
        chart.value = void 0;
      }
    }
    let unwatchOption = null;
    watch(
      manualUpdate,
      (manualUpdate2) => {
        if (typeof unwatchOption === "function") {
          unwatchOption();
          unwatchOption = null;
        }
        if (!manualUpdate2) {
          unwatchOption = watch(
            () => props.option,
            (option, oldOption) => {
              if (!option) {
                return;
              }
              if (!chart.value) {
                init$1();
              } else {
                chart.value.setOption(option, {
                  // mutating `option` will lead to `notMerge: false` and
                  // replacing it with new reference will lead to `notMerge: true`
                  notMerge: option !== oldOption,
                  ...realUpdateOptions.value
                });
              }
            },
            { deep: true }
          );
        }
      },
      {
        immediate: true
      }
    );
    watch(
      [realTheme, realInitOptions],
      () => {
        cleanup();
        init$1();
      },
      {
        deep: true
      }
    );
    watchEffect(() => {
      if (props.group && chart.value) {
        chart.value.group = props.group;
      }
    });
    const publicApi = usePublicAPI(chart);
    useLoading(chart, loading, loadingOptions);
    useAutoresize(chart, autoresize, root);
    return {
      chart,
      root,
      setOption,
      realAttrs,
      nativeListeners,
      ...publicApi
    };
  },
  render() {
    const attrs = this.realAttrs;
    attrs.ref = "root";
    attrs.class = attrs.class ? ["echarts"].concat(attrs.class) : "echarts";
    return h(TAG_NAME, attrs);
  }
});

const Light_theme = {
  "color": ["#3fb1e3", "#36be92", "#9a7fd1", "#a0a7e6", "#ffb980", "#96dee8"],
  "backgroundColor": "rgba(252,252,252,0)",
  "textStyle": {},
  "title": {
    "textStyle": {
      "color": "#666666"
    },
    "subtextStyle": {
      "color": "#eeeeee"
    }
  },
  "line": {
    "itemStyle": {
      "borderWidth": "2"
    },
    "lineStyle": {
      "width": "3"
    },
    "symbolSize": "8",
    "symbol": "emptyCircle",
    "smooth": false
  },
  "radar": {
    "itemStyle": {
      "borderWidth": "2"
    },
    "lineStyle": {
      "width": "3"
    },
    "symbolSize": "8",
    "symbol": "emptyCircle",
    "smooth": false
  },
  "bar": {
    "itemStyle": {
      "barBorderWidth": 0,
      "barBorderColor": "#666666"
    }
  },
  "pie": {
    "itemStyle": {
      "borderWidth": 0,
      "borderColor": "#666666"
    }
  },
  "scatter": {
    "itemStyle": {
      "borderWidth": 0,
      "borderColor": "#666666"
    }
  },
  "boxplot": {
    "itemStyle": {
      "borderWidth": 2
    }
  },
  "parallel": {
    "itemStyle": {
      "borderWidth": 0,
      "borderColor": "#666666"
    }
  },
  "sankey": {
    "itemStyle": {
      "borderWidth": 0,
      "borderColor": "#666666"
    }
  },
  "funnel": {
    "itemStyle": {
      "borderWidth": 0,
      "borderColor": "#666666"
    }
  },
  "gauge": {
    "itemStyle": {
      "borderWidth": 0,
      "borderColor": "#666666"
    }
  },
  "candlestick": {
    "itemStyle": {
      "color": "#e6a0d2",
      "color0": "transparent",
      "borderColor": "#e6a0d2",
      "borderColor0": "#3fb1e3",
      "borderWidth": "2"
    }
  },
  "graph": {
    "itemStyle": {
      "borderWidth": 0,
      "borderColor": "#666666"
    },
    "lineStyle": {
      "width": "1",
      "color": "#666666"
    },
    "symbolSize": "8",
    "symbol": "emptyCircle",
    "smooth": false,
    "color": ["#3fb1e3", "#6be6c1", "#626c91", "#a0a7e6", "#c4ebad", "#96dee8"],
    "label": {
      "color": "#ffffff"
    }
  },
  "map": {
    "itemStyle": {
      "areaColor": "#eeeeee",
      "borderColor": "#aaaaaa",
      "borderWidth": 0.5
    },
    "label": {
      "color": "#ffffff"
    },
    "emphasis": {
      "itemStyle": {
        "areaColor": "rgba(63,177,227,0.25)",
        "borderColor": "#3fb1e3",
        "borderWidth": 1
      },
      "label": {
        "color": "#3fb1e3"
      }
    }
  },
  "geo": {
    "itemStyle": {
      "areaColor": "#eeeeee",
      "borderColor": "#eeeeee",
      "borderWidth": 0.5
    },
    "label": {
      "color": "#ffffff"
    },
    "emphasis": {
      "itemStyle": {
        "areaColor": "rgba(63,177,227,0.25)",
        "borderColor": "#3fb1e3",
        "borderWidth": 1
      },
      "label": {
        "color": "#3fb1e3"
      }
    }
  },
  "categoryAxis": {
    "axisLine": {
      "show": true,
      "lineStyle": {
        "width": 2,
        "color": "#666666"
      }
    },
    "axisTick": {
      "show": false,
      "lineStyle": {
        "color": "#333"
      }
    },
    "axisLabel": {
      "show": true,
      "color": "#333333"
    },
    "splitLine": {
      "show": true,
      "lineStyle": {
        "color": ["#eeeeee"]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"]
      }
    }
  },
  "valueAxis": {
    "axisLine": {
      "show": true,
      "lineStyle": {
        "width": 2,
        "color": "#666666"
      }
    },
    "axisTick": {
      "show": true,
      "lineStyle": {
        "color": "#333"
      }
    },
    "axisLabel": {
      "show": true,
      "color": "#666666"
    },
    "splitLine": {
      "show": true,
      "lineStyle": {
        "color": ["#dddddd"]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"]
      }
    }
  },
  "logAxis": {
    "axisLine": {
      "show": true,
      "lineStyle": {
        "color": "#666666"
      }
    },
    "axisTick": {
      "show": false,
      "lineStyle": {
        "color": "#333"
      }
    },
    "axisLabel": {
      "show": true,
      "color": "#eeeeee"
    },
    "splitLine": {
      "show": true,
      "lineStyle": {
        "color": ["#333"]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"]
      }
    }
  },
  "timeAxis": {
    "axisLine": {
      "show": true,
      "lineStyle": {
        "color": "#666666"
      }
    },
    "axisTick": {
      "show": false,
      "lineStyle": {
        "color": "#333"
      }
    },
    "axisLabel": {
      "show": true,
      "color": "#eeeeee"
    },
    "splitLine": {
      "show": true,
      "lineStyle": {
        "color": ["#eeeeee"]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"]
      }
    }
  },
  "toolbox": {
    "iconStyle": {
      "borderColor": "#666666"
    },
    "emphasis": {
      "iconStyle": {
        "borderColor": "#666666"
      }
    }
  },
  "legend": {
    "textStyle": {
      "color": "#666666"
    }
  },
  "tooltip": {
    "axisPointer": {
      "lineStyle": {
        "color": "#666666",
        "width": 1
      },
      "crossStyle": {
        "color": "#666666",
        "width": 1
      }
    }
  },
  "timeline": {
    "lineStyle": {
      "color": "#626c91",
      "width": 1
    },
    "itemStyle": {
      "color": "#626c91",
      "borderWidth": 1
    },
    "controlStyle": {
      "color": "#626c91",
      "borderColor": "#626c91",
      "borderWidth": 0.5
    },
    "checkpointStyle": {
      "color": "#3fb1e3",
      "borderColor": "#3fb1e3"
    },
    "label": {
      "color": "#626c91"
    },
    "emphasis": {
      "itemStyle": {
        "color": "#626c91"
      },
      "controlStyle": {
        "color": "#626c91",
        "borderColor": "#626c91",
        "borderWidth": 0.5
      },
      "label": {
        "color": "#626c91"
      }
    }
  },
  "visualMap": {
    "color": ["#2a99c9", "#afe8ff"]
  },
  "dataZoom": {
    "backgroundColor": "rgba(255,255,255,0)",
    "dataBackgroundColor": "rgba(222,222,222,1)",
    "fillerColor": "rgba(114,230,212,0.25)",
    "handleColor": "#666666",
    "handleSize": "100%",
    "textStyle": {
      "color": "#eeeeee"
    }
  },
  "markPoint": {
    "label": {
      "color": "#ffffff"
    },
    "emphasis": {
      "label": {
        "color": "#ffffff"
      }
    }
  }
};

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Boxplot",
  __ssrInlineRender: true,
  props: {
    x_title: {
      type: String,
      default: () => "HN_DEL_64415"
    },
    y_title: {
      type: String,
      default: () => "meth_9120213"
    },
    samples: {
      type: Object,
      default: () => ({
        "0": 39,
        "1": 77,
        "2": 32
      })
    },
    data: {
      type: Object,
      default: () => ({
        "0": [
          1.498,
          1.091,
          1.205,
          0.79,
          0.756,
          0.861,
          0.837,
          0.701,
          1.788,
          1.788,
          1.337,
          1.675,
          1.337,
          2.214,
          0.723,
          1.018,
          1.986,
          1.337,
          0.813,
          0.68,
          2.472,
          1.498,
          1.498,
          1.047,
          1.61,
          0.756,
          1.091,
          1.986,
          0.963,
          0.963,
          0.898,
          0.316,
          1.205,
          0.898,
          0.963,
          0.557,
          1.205,
          1.337,
          1.138
        ],
        "1": [
          0.212,
          0.246,
          -0.352,
          -0.519,
          -0.618,
          -0.434,
          -0.084,
          0.48,
          -0.701,
          -0.152,
          0.538,
          -0.299,
          -0.025,
          -0.272,
          -0.178,
          -0.152,
          0.425,
          0.597,
          -0.519,
          -8e-3,
          0.178,
          -0.745,
          -0.334,
          0.16,
          -0.406,
          -0.434,
          -0.316,
          -0.79,
          0.618,
          0.397,
          -0.519,
          0.093,
          -0.126,
          -0.723,
          0.5,
          0.443,
          -0.246,
          -0.195,
          -0.272,
          0.462,
          -0.212,
          0.017,
          -0.597,
          -0.084,
          -0.577,
          -0.042,
          -0.462,
          -0.229,
          0.334,
          0.042,
          0.118,
          0.076,
          -0.11,
          0.272,
          0.638,
          0.118,
          0.577,
          -0.659,
          0.144,
          0.195,
          0.017,
          0.272,
          0.299,
          0.229,
          -0.68,
          -0.059,
          0.37,
          -0.388,
          -0.557,
          -0.37,
          0.059,
          -0.767,
          -0.48,
          0.352,
          -0.638,
          0.659,
          0.397
        ],
        "2": [
          -1.878,
          -1.076,
          -1.205,
          -1.642,
          -1.205,
          -0.849,
          0.519,
          -1.498,
          -1.076,
          -2.051,
          -1.358,
          -1.205,
          -1.878,
          -1.498,
          -1.498,
          -2.324,
          -0.963,
          -1.358,
          -0.924,
          -0.813,
          -1.205,
          -1.748,
          -0.849,
          -0.886,
          -0.924,
          -1.642,
          -1.358,
          -0.99,
          -1.076,
          -2.324,
          -1.205,
          -1.018
        ]
      })
    }
  },
  setup(__props) {
    use([
      DatasetComponent,
      TitleComponent,
      TooltipComponent,
      ToolboxComponent,
      GridComponent,
      LegendComponent,
      BoxplotChart,
      ScatterChart,
      SVGRenderer
    ]);
    const chart = ref(null);
    const props = __props;
    const filteredData = computed(() => {
      const filteredGenotype = [];
      const filteredData2 = [];
      for (const genotype in ["0", "1", "2"]) {
        if (props.samples[genotype] && props.samples[genotype] >= 5) {
          filteredGenotype.push(genotype);
          filteredData2.push(props.data[genotype]);
        }
      }
      return {
        genotypes: filteredGenotype,
        data: filteredData2
      };
    });
    const option = computed(() => {
      return {
        dataset: [
          {
            source: filteredData.value.data
          },
          {
            transform: {
              type: "boxplot",
              config: {
                itemNameFormatter: (params) => {
                  return `${params.value}
(n=${filteredData.value.data[params.value].length})`;
                }
              }
            }
          },
          {
            fromDatasetIndex: 1,
            fromTransformResult: 1
          }
        ],
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "shadow"
          }
        },
        toolbox: {
          show: true,
          top: 0,
          right: 25,
          iconStyle: {
            borderWidth: 2
          },
          emphasis: {
            iconStyle: {
              borderColor: "#26a69a"
            }
          },
          feature: {
            saveAsImage: {
              name: "Boxplot",
              type: "svg"
            }
          }
        },
        grid: {
          left: 80,
          right: 60,
          top: 50,
          bottom: 80
        },
        xAxis: {
          type: "category",
          name: props.x_title,
          boundaryGap: true,
          nameGap: 40,
          nameLocation: "middle",
          nameTextStyle: {
            align: "center",
            verticalAlign: "top",
            fontSize: 14,
            lineHeight: 18,
            fontWeight: "bold",
            padding: [0, 0, 0, 0]
          },
          splitArea: {
            show: true
          },
          splitLine: {
            show: false
          },
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "value",
          name: props.y_title,
          splitArea: {
            show: true
          },
          nameRotate: 90,
          nameLocation: "middle",
          nameTextStyle: {
            align: "center",
            verticalAlign: "bottom",
            fontSize: 14,
            fontWeight: "bold",
            padding: [0, 0, 40, 0]
          },
          axisTick: {
            alignWithLabel: true
          }
        },
        series: [
          {
            name: "boxplot",
            type: "boxplot",
            datasetIndex: 1,
            colorBy: "data",
            tooltip: {
              formatter: function(param) {
                return [
                  "Genotype: " + param.name.split("\n")[0],
                  "Samples: " + filteredData.value.data[param.dataIndex].length,
                  "upper: " + Number(param.data[5]).toFixed(2),
                  "Q3: " + param.data[4].toFixed(2),
                  "median: " + param.data[3].toFixed(2),
                  "Q1: " + param.data[2].toFixed(2),
                  "lower: " + Number(param.data[1]).toFixed(2)
                ].join("<br/>");
              }
            }
          },
          {
            name: "outlier",
            type: "scatter",
            datasetIndex: 2,
            colorBy: "data",
            tooltip: {
              formatter: function(param) {
                return [
                  "Genotype: " + param.data[0],
                  "Value   : " + param.data[1]
                ].join("<br/>");
              }
            }
          }
        ]
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VChart = __nuxt_component_0;
      _push(ssrRenderComponent(_component_VChart, mergeProps({
        id: "BoxPlot",
        option: option.value,
        theme: unref(Light_theme),
        ref_key: "chart",
        ref: chart,
        class: "no-padding no-margin bg-white",
        style: { "width": "500px", "height": "450px" }
      }, _attrs), null, _parent));
    };
  }
});

export { _sfc_main as _, model_qtl as m };
//# sourceMappingURL=Boxplot.vue2.mjs.map

<template>
  <VChart
    id="BoxPlot"
    :option="option"
    :theme="Light_theme"
    ref="chart"
    class="no-padding no-margin bg-white"
    style="width: 500px; height: 450px"
  />
</template>

<script setup lang="ts">
import { computed, type PropType } from "vue";
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { BoxplotChart, ScatterChart } from "echarts/charts";
import {
  DatasetComponent,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import { Light_theme } from "@/utils/echarts_themes";

use([
  DatasetComponent,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent,
  BoxplotChart,
  ScatterChart,
  SVGRenderer,
]);

type boxplotData = {
  "0": number[];
  "1": number[];
  "2": number[];
};
type boxplotSamples = {
  "0": number;
  "1": number;
  "2": number;
};

const chart = ref(null);
const resizeHandler = () => chart.value?.resize();
onMounted(() => {
  window.addEventListener("resize", resizeHandler);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeHandler);
});

//TODO 定义组件参数
const props = defineProps({
  x_title: {
    type: String,
    default: () => "HN_DEL_64415",
  },
  y_title: {
    type: String,
    default: () => "meth_9120213",
  },
  samples: {
    type: Object as PropType<boxplotSamples>,
    default: () => ({
      "0": 39,
      "1": 77,
      "2": 32,
    }),
  },
  data: {
    type: Object as PropType<boxplotData>,
    default: () => ({
      "0": [
        1.498, 1.091, 1.205, 0.79, 0.756, 0.861, 0.837, 0.701, 1.788, 1.788,
        1.337, 1.675, 1.337, 2.214, 0.723, 1.018, 1.986, 1.337, 0.813, 0.68,
        2.472, 1.498, 1.498, 1.047, 1.61, 0.756, 1.091, 1.986, 0.963, 0.963,
        0.898, 0.316, 1.205, 0.898, 0.963, 0.557, 1.205, 1.337, 1.138,
      ],
      "1": [
        0.212, 0.246, -0.352, -0.519, -0.618, -0.434, -0.084, 0.48, -0.701,
        -0.152, 0.538, -0.299, -0.025, -0.272, -0.178, -0.152, 0.425, 0.597,
        -0.519, -0.008, 0.178, -0.745, -0.334, 0.16, -0.406, -0.434, -0.316,
        -0.79, 0.618, 0.397, -0.519, 0.093, -0.126, -0.723, 0.5, 0.443, -0.246,
        -0.195, -0.272, 0.462, -0.212, 0.017, -0.597, -0.084, -0.577, -0.042,
        -0.462, -0.229, 0.334, 0.042, 0.118, 0.076, -0.11, 0.272, 0.638, 0.118,
        0.577, -0.659, 0.144, 0.195, 0.017, 0.272, 0.299, 0.229, -0.68, -0.059,
        0.37, -0.388, -0.557, -0.37, 0.059, -0.767, -0.48, 0.352, -0.638, 0.659,
        0.397,
      ],
      "2": [
        -1.878, -1.076, -1.205, -1.642, -1.205, -0.849, 0.519, -1.498, -1.076,
        -2.051, -1.358, -1.205, -1.878, -1.498, -1.498, -2.324, -0.963, -1.358,
        -0.924, -0.813, -1.205, -1.748, -0.849, -0.886, -0.924, -1.642, -1.358,
        -0.99, -1.076, -2.324, -1.205, -1.018,
      ],
    }),
  },
});
const filteredData = computed(() => {
  const filteredGenotype = [];
  const filteredData = [];
  for (const genotype in ["0", "1", "2"]) {
    if (props.samples[genotype] && props.samples[genotype] >= 5) {
      filteredGenotype.push(genotype);
      filteredData.push(props.data[genotype]);
    }
  }
  return {
    genotypes: filteredGenotype,
    data: filteredData,
  };
});

const option = computed(() => {
  return {
    dataset: [
      {
        source: filteredData.value.data,
      },
      {
        transform: {
          type: "boxplot",
          config: {
            itemNameFormatter: (params) => {
              return `${params.value}\n(n=${
                filteredData.value.data[params.value].length
              })`;
            },
          },
        },
      },
      {
        fromDatasetIndex: 1,
        fromTransformResult: 1,
      },
    ],
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "shadow",
      },
    },
    toolbox: {
      show: true,
      top: 0,
      right: 25,
      iconStyle: {
        borderWidth: 2,
      },
      emphasis: {
        iconStyle: {
          borderColor: "#26a69a",
        },
      },
      feature: {
        saveAsImage: {
          name: "Boxplot",
          type: "svg",
        },
      },
    },
    grid: {
      left: 80,
      right: 60,
      top: 50,
      bottom: 80,
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
        padding: [0, 0, 0, 0],
      },
      splitArea: {
        show: true,
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: "value",
      name: props.y_title,
      splitArea: {
        show: true,
      },
      nameRotate: 90,
      nameLocation: "middle",
      nameTextStyle: {
        align: "center",
        verticalAlign: "bottom",
        fontSize: 14,
        fontWeight: "bold",
        padding: [0, 0, 40, 0],
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    series: [
      {
        name: "boxplot",
        type: "boxplot",
        datasetIndex: 1,
        colorBy: "data",
        tooltip: {
          formatter: function (param) {
            return [
              "Genotype: " + param.name.split("\n")[0],
              "Samples: " + filteredData.value.data[param.dataIndex].length,
              "upper: " + Number(param.data[5]).toFixed(2),
              "Q3: " + param.data[4].toFixed(2),
              "median: " + param.data[3].toFixed(2),
              "Q1: " + param.data[2].toFixed(2),
              "lower: " + Number(param.data[1]).toFixed(2),
            ].join("<br/>");
          },
        },
      },
      {
        name: "outlier",
        type: "scatter",
        datasetIndex: 2,
        colorBy: "data",
        tooltip: {
          formatter: function (param) {
            return [
              "Genotype: " + param.data[0],
              "Value   : " + param.data[1],
            ].join("<br/>");
          },
        },
      },
    ],
  };
});
</script>

<style scoped lang="less"></style>

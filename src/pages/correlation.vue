<template>
  <q-page style="min-height: calc(100vh - 125px);margin: 5px auto 0 auto;" class="q-pa-md">
    <q-dialog v-model="dialog_visible">
      <q-card style="width: 400px; height: 400px">
        <q-card-section>
          <q-img
            :src="'data:image/png;base64,' + plot_data"
            spinner-color="white"
            fit="contain"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-card flat bordered style="max-width: 1140px" class="q-mx-auto q-my-none">
      <q-card-section class="row q-py-none q-px-none">
        <div
          class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 20px;line-height: 1.3;"
        >
          Search Correaltion by Phenotype or Indicator
        </div>
      </q-card-section>
      <q-card-section class="q-px-md q-pt-md q-pb-sm">
        <div class="text-body1 text-grey-8" style="line-height: 1.7;">
          This module provides comprehensive pairwise correlations identified from 148 healthy Chinese individuals, 
          revealing regulatory connections between genetic variants, molecular phenotypes, and clinical traits. 
          The correlation dataset integrates multi-omics associations, including colocalization between 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
              genetic variants and molecular phenotypes (eQTL, sQTL, apaQTL, meQTL),
          </span>
          colocalization between 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
              molecular phenotypes and clinical traits,
          </span>
          and mediation relationships linking 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
              variants → molecular phenotypes → clinical outcomes.
          </span>
          <br>
          <!-- Colocalization analyses were performed using 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: #f57c20; background-color: white;">
              Coloc and HyPrColoc
          </span>
          methods implemented in the 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: #f57c20; background-color: white;">
              xQTLbiolinks
          </span>
          R package, with colocalization significance defined as 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
              PPH4.ABF > 0.75 and Hypr_posterior > 0.5.
          </span>
          Mediation effects were analyzed using the 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: #f57c20; background-color: white;">
              medflex
          </span>
          R package, with significant mediation defined as 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
              P < 0.05
          </span>
          for both total effects and mediated effects. 
          These analyses constructed multi-layered regulatory networks connecting genetic variants, 
          alternative splicing, DNA methylation, gene expression, and clinical phenotypes. -->
      </div>
      </q-card-section>
      <q-form
        @submit="on_form_submit"
        @reset="on_form_reset"
        :class="{ 'q-mx-auto': small_screen }"
        class="q-py-sm"
      >
        <!-- SECTION Phenotype type -->
        <!-- "col-sm-2 col-12 text-right text-bold text-subtitle2 text-primary q-px-sm" -->
        <div class="row">
          <div class="col-12 col-sm-4 items-center justify-between q-my-xs">
            <span class="text-bold text-subtitle2 text-primary q-px-sm"
              >Phenotype Type:</span
            >
            <q-select
              dense
              outlined
              clearable
              use-input
              hide-dropdown-icon
              label-color="primary"
              label="Select phenotype type"
              input-debounce="1000"
              class="col-sm-4 col-12 q-px-sm q-py-xs"
              input-class="text-primary"
              v-model="query_phenotype_type"
              :options="phenotype_type_options"
            />
          </div>
          <!-- SECTION Phenotype ID -->
          <div class="col-12 col-sm-8 items-center justify-between q-my-xs">
            <span class="text-bold text-subtitle2 text-primary q-px-sm"
              >Phenotype ID:</span
            >
            <q-select
              dense
              outlined
              clearable
              use-input
              hide-dropdown-icon
              label-color="primary"
              label="Input phenotype ID"
              input-debounce="1000"
              class="col-12 col-sm-8 q-px-sm q-py-xs"
              input-class="text-primary"
              v-model="query_phenotype_id"
              :options="phenotype_id_options"
              @filter="onPhenotypeIDInput"
              ref="ref_phenotype_id"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
        <!-- SECTION Indicator type -->
        <!-- "col-sm-2 col-12 text-right text-bold text-subtitle2 text-primary q-px-sm" -->
        <div class="row">
          <div class="col-12 col-sm-4 items-center justify-between q-my-xs">
            <span class="text-bold text-subtitle2 text-primary q-px-sm"
              >Indicator Type:</span
            >
            <q-select
              dense
              outlined
              clearable
              use-input
              hide-dropdown-icon
              label-color="primary"
              label="Select indicator type"
              input-debounce="1000"
              class="col-sm-10 col-12 q-px-sm q-py-xs"
              input-class="text-primary"
              v-model="query_indicator_type"
              :options="indicator_type_options"
            />
          </div>
          <!-- SECTION Phenotype ID -->
          <div class="col-12 col-sm-8 items-center justify-between q-my-xs">
            <span class="text-bold text-subtitle2 text-primary q-px-sm"
              >Indicator name:</span
            >
            <q-select
              dense
              outlined
              clearable
              use-input
              hide-dropdown-icon
              label-color="primary"
              label="Input indicator name"
              input-debounce="1000"
              class="col-sm-4 col-12 q-px-sm q-py-xs"
              input-class="text-primary"
              v-model="query_indicator_name"
              :options="indicator_name_options"
              @filter="onIndicatorNameInput"
              ref="ref_indicator_name"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
        <!-- 提交按钮 -->
        <div class="col-12 col-sm-6">
          <div class="row items-center justify-center q-gutter-x-xl">
            <q-btn
              unelevated
              no-caps
              color="primary"
              label="Submit"
              type="submit"
            >
            </q-btn>
            <q-btn
              unelevated
              no-caps
              color="negative"
              label="Reset"
              type="reset"
            />
          </div>
        </div>
      </q-form>
      <div class="row justify-center q-pb-sm q-my-xs">
        <div class="q-px-sm q-gutter-x-xs">
          <q-btn
            class="text-indigo-6"
            v-for="example in examples"
            :key="example.label"
            :label="example.label"
            :dense="small_screen"
            :disable="example.disable"
            flat
            no-caps
            :ripple="false"
            @click="set_example(example)"
          />
        </div>
      </div>
    </q-card>
    <q-card
      flat
      bordered
      style="max-width: 1140px"
      class="q-mx-auto q-my-md q-px-none"
    >
      <q-table
        flat
        row-key="label"
        v-model:pagination="table_pagination"
        :rows="table_data"
        :columns="model_correlation"
        :dense="small_screen"
        :loading="table_loading"
        :rows-per-page-options="[15, 50, 100]"
        rows-per-page-label="Rows per page:"
        :pagination-label="
          (firstRowIndex, endRowIndex, totalRowsNumber) =>
            `${firstRowIndex}~${endRowIndex} / ${totalRowsNumber}`
        "
        @request="on_table_request"
        separator="cell"
        no-data-label="No data"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template v-slot:top-left>
          <div class="row no-wrap q-pl-md q-gutter-x-lg">
            <div
              v-for="key in Object.keys(data_stat)"
              :key="key"
              v-show="data_stat[key] !== 0"
              class="col-auto text-center text-subtitle1 text-bold"
            >
              <div>{{ data_stat[key] }}</div>
              <div class="text-primary">{{ key }}</div>
            </div>
          </div>
        </template>
        <template v-slot:top-right="props">
          <div class="row no-wrap">
            <q-btn
              flat
              dense
              :ripple="false"
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
            />
            <q-btn
              flat
              dense
              :ripple="false"
              :loading="download_btn_loading"
              icon="file_download"
              @click="export_table"
            /></div
        ></template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-primary"
              style="font-weight: bold; font-size: 14px"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-Plot="props">
          <q-td key="plot" :props="props">
            <q-btn
              size="md"
              color="primary"
              icon="scatter_plot"
              dense
              rounded
              outline
              @click="showPlot(props.row)"
            >
              <q-tooltip> Show doxplot </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, type ComputedRef, reactive, onBeforeMount } from "vue";
import { exportFile, useQuasar } from "quasar";
import {
  type PhenotypeType,
  type IndicatorType,
  queryCorrelation,
  queryDotplot,
  queryPhenotypeHints,
  queryIndicatorHints,
} from "@/api/query_Correlation";
import model_correlation from "@/model/TableCorrelation";
import type { ResponseType } from "@/interface/types_response";
import { useRoute } from "vue-router";

const $q = useQuasar();
const small_screen = computed(() => $q.screen.lt.sm);
const route = useRoute();

//SECTION 图表相关
const dialog_visible = ref(false);
const plot_data = ref("");
const showPlot = (row) => {
  queryDotplot({
    phenotype_type: row.Phenotype_type,
    phenotype_id: row.Phenotype_ID,
    indicator_type: row.Indicator_type,
    indicator_name: row.Indicator_name,
  }).then((response) => {
    const formatResponse = response as ResponseType;
    if (formatResponse.data) {
      dialog_visible.value = true;
      plot_data.value = formatResponse.data.figure_base64_code;
    } else {
      $q.notify({
        message: "No data found!",
        color: "negative",
        icon: "warning",
      });
    }
  });
};
// END-SECTION

//SECTION 查询相关变量
const query_indicator_type = ref<IndicatorType | null>(null);
const query_indicator_name = ref<string | null>(null);
const query_phenotype_type = ref<PhenotypeType | null>(null);
const query_phenotype_id = ref<string | null>(null);

const current_show = reactive({
  phenotype_type: null as PhenotypeType | null,
  phenotype_id: null as string | null,
  indicator_type: null as IndicatorType | null,
  indicator_name: null as string | null,
});
const data_stat = reactive({
  apaQTL: 0,
  eQTL: 0,
  meQTL: 0,
  sQTL: 0,
  Pathology: 0,
  Nutrition: 0,
  Toxin: 0,
  Measurement: 0,
  Hormone: 0,
  Questionnaire: 0,
});
// END-SECTION

// SECTION Hints
const phenotype_type_options = ["apaQTL", "eQTL", "sQTL"];
const indicator_type_options = [
  "Pathology",
  "Nutrition",
  "Toxin",
  "Measurement",
  "Hormone",
  "Questionnaire",
];
const phenotype_id_options = ref<string[]>([]);
const indicator_name_options = ref<string[]>([]);
const ref_phenotype_id = ref(null);
const ref_indicator_name = ref(null);

const onPhenotypeIDInput = (
  val: string,
  update: CallableFunction,
  abort: CallableFunction
) => {
  update(() => {
    if (val === "") {
      phenotype_id_options.value = [];
    } else {
      queryPhenotypeHints({
        phenotype_type: query_phenotype_type.value,
        input: val,
      })
        .then((response) => {
          const formatResponse = response as ResponseType;
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
        })
        .catch((error) => {
          phenotype_id_options.value = [val];
        });
    }
  });
  abort(() => {});
};
const onIndicatorNameInput = (
  val: string,
  update: CallableFunction,
  abort: CallableFunction
) => {
  update(() => {
    if (val === "") {
      indicator_name_options.value = [];
    } else {
      queryIndicatorHints({
        indicator_type: query_indicator_type.value,
        input: val,
      })
        .then((response) => {
          const formatResponse = response as ResponseType;
          if (formatResponse.data.length) {
            indicator_name_options.value = formatResponse.data;
          } else {
            indicator_name_options.value = [val];
          }
          indicator_name_options.value = formatResponse.data;
          if (val !== "" && ref_indicator_name.value.options.length) {
            ref_indicator_name.value.setOptionIndex(-1);
            ref_indicator_name.value.moveOptionSelection(1, true);
          }
        })
        .catch((error) => {
          indicator_name_options.value = [val];
        });
    }
  });
  abort(() => {});
};
// END-SECTION

// SECTION 表单校检
const formImputed: ComputedRef<boolean> = computed(() => {
  const phenotypeTypeNotEmpty = Boolean(query_phenotype_type.value);
  const phenotypeIDNotEmpty = Boolean(query_phenotype_id.value);
  const indicatorTypeNotEmpty = Boolean(query_indicator_type.value);
  const indicatorNameNotEmpty = Boolean(query_indicator_name.value);
  return (
    phenotypeTypeNotEmpty ||
    phenotypeIDNotEmpty ||
    indicatorTypeNotEmpty ||
    indicatorNameNotEmpty
  );
});
// END-SECTION

//SECTION 查询示例
type example_type = {
  label: string;
  phenotypeType: PhenotypeType | null;
  phenotypeID: string | null;
  indicatorType: IndicatorType | null;
  indicatorName: string | null;
  disable: boolean;
};
const examples: example_type[] = [
  {
    label: "example1",
    phenotypeType: "eQTL",
    phenotypeID: "ENSG00000232882.1",
    indicatorType: "Toxin",
    indicatorName: "TPOAb",
    disable: false,
  },
  {
    label: "example2",
    phenotypeType: "sQTL",
    phenotypeID: null,
    indicatorType: "Nutrition",
    indicatorName: "Whole blood Fe",
    disable: false,
  },
  {
    label: "example3",
    phenotypeType: "eQTL",
    phenotypeID: null,
    indicatorType: "Hormone",
    indicatorName: "PTH",
    disable: false,
  },
];
const set_example = (example_obj: example_type) => {
  query_indicator_type.value = example_obj.indicatorType;
  query_indicator_name.value = example_obj.indicatorName;
  query_phenotype_type.value = example_obj.phenotypeType;
  query_phenotype_id.value = example_obj.phenotypeID;
  // on_form_submit();
};
// END-SECTION

// SECTION 表格相关
const table_data = ref([]);
const table_loading = ref(false);
const table_pagination = ref({
  page: 1,
  rowsPerPage: <15 | 50 | 100 | 0>15,
  rowsNumber: 0,
  sortBy: "Cor_pearson",
  descending: true,
});
// END-SECTION

// SECTION 方法
const on_table_request = (props) => {
  table_loading.value = true;
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  // 获取数据
  queryCorrelation({
    phenotype_type: current_show.phenotype_type,
    phenotype_id: current_show.phenotype_id,
    indicator_type: current_show.indicator_type,
    indicator_name: current_show.indicator_name,
    page: page,
    pageSize: rowsPerPage,
    sortBy: sortBy,
    order: descending ? -1 : 1,
  })
    .then((response) => {
      const formatResponse = response as ResponseType;
      table_data.value = formatResponse.data;
      table_pagination.value.rowsNumber = formatResponse.total ?? 0;
    })
    .finally(() => {
      table_loading.value = false;
      // 更新分页
      table_pagination.value.page = page;
      table_pagination.value.rowsPerPage = rowsPerPage;
      table_pagination.value.sortBy = sortBy;
      table_pagination.value.descending = descending;
    });
};
const wrapCsvValue = (val, formatFn?: CallableFunction | void, row?) => {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;
  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);
  formatted = formatted.split('"').join('""');
  return `${formatted}`;
};

const download_btn_loading = ref(false);
const export_table = () => {
  $q.notify({
    message: "Download will be not available untill published",
    color: "negative",
    icon: "warning",
  });
  return;
  download_btn_loading.value = true;
  queryCorrelation({
    phenotype_type: current_show.phenotype_type,
    phenotype_id: current_show.phenotype_id,
    indicator_type: current_show.indicator_type,
    indicator_name: current_show.indicator_name,
    page: 1,
    pageSize: -1,
    sortBy: table_pagination.value.sortBy,
    order: table_pagination.value.descending ? -1 : 1,
  }).then((response) => {
    const formatResponse = response as ResponseType;
    // FIXME 这里根据实际要忽略的列选择
    const content = [
      model_correlation.map((col) => wrapCsvValue(col.label)).join("\t"),
    ]
      .concat(
        formatResponse.data.map((row) =>
          model_correlation
            .map((col) =>
              wrapCsvValue(
                typeof col.field === "function"
                  ? col.field(row)
                  : row[col.field === void 0 ? col.name : col.field],
                col.format,
                row
              )
            )
            .join("\t")
        )
      )
      .join("\r\n");
    const status = exportFile(
      `phenotype_output_${
        new Date()
          .toISOString()
          .replace(/[:.]/g, "-")
          .replace("T", "-")
          .split(".")[0]
      }.tsv`,
      content,
      "text"
    );
    download_btn_loading.value = false;
    if (status !== true) {
      $q.notify({
        message: "Something wrong happened while download...",
        color: "negative",
        icon: "warning",
      });
    }
  });
};
const on_form_submit = () => {
  if (formImputed.value) {
    table_loading.value = true;
    // 更新当前展示的变量
    queryCorrelation({
      phenotype_type: query_phenotype_type.value,
      phenotype_id: query_phenotype_id.value,
      indicator_type: query_indicator_type.value,
      indicator_name: query_indicator_name.value,
      page: 1,
      pageSize: table_pagination.value.rowsPerPage,
      sortBy: table_pagination.value.sortBy,
      order: table_pagination.value.descending ? -1 : 1,
    })
      .then((response) => {
        const formatResponse = response as ResponseType;
        if (formatResponse.total) {
          table_data.value = formatResponse.data;
          table_pagination.value.rowsNumber = formatResponse.total;

          current_show.phenotype_type = query_phenotype_type.value;
          current_show.phenotype_id = query_phenotype_id.value;
          current_show.indicator_type = query_indicator_type.value;
          current_show.indicator_name = query_indicator_name.value;

          data_stat.apaQTL = formatResponse.stat.apaQTL;
          data_stat.eQTL = formatResponse.stat.eQTL;
          data_stat.meQTL = formatResponse.stat.meQTL;
          data_stat.sQTL = formatResponse.stat.sQTL;
          data_stat.Pathology = formatResponse.stat.Pathology;
          data_stat.Nutrition = formatResponse.stat.Nutrition;
          data_stat.Toxin = formatResponse.stat.Toxin;
          data_stat.Measurement = formatResponse.stat.Measurement;
          data_stat.Hormone = formatResponse.stat.Hormone;
          data_stat.Questionnaire = formatResponse.stat.Questionnaire;
        } else {
          $q.notify({
            message: "No data found!",
            color: "negative",
            icon: "warning",
          });
        }
        table_loading.value = false;
      })
      .catch((error) => {
        $q.notify({
          message: error,
          color: "negative",
          icon: "warning",
        });
        table_loading.value = false;
      });
  } else {
    $q.notify({
      message: "Please input at least one field!",
      color: "negative",
      icon: "warning",
    });
  }
};
const on_form_reset = () => {
  query_indicator_type.value = null;
  query_indicator_name.value = null;
  query_phenotype_type.value = null;
  query_phenotype_id.value = null;
};
// END-SECTION
onBeforeMount(() => {
  if (Boolean(Object.keys(route.query).length)) {
    // 如果有 URL 参数，使用 URL 参数
    query_phenotype_type.value = Boolean(route.query.phenotype_type)
      ? (String(route.query.phenotype_type) as PhenotypeType)
      : ("eQTL" as PhenotypeType);
    query_phenotype_id.value = Boolean(route.query.phenotype_id)
      ? (String(route.query.phenotype_id) as string | null)
      : null;
    query_indicator_type.value = Boolean(route.query.indicator_type)
      ? (String(route.query.indicator_type) as IndicatorType)
      : null;
    query_indicator_name.value = Boolean(route.query.indicator_name)  // 修正：原代码写的是 route.query.phenotype_id
      ? (String(route.query.indicator_name) as string | null)
      : null;
  } else {
    // 没有 URL 参数时，使用默认初始查询条件
    query_phenotype_type.value = "eQTL";
    query_phenotype_id.value = null;
    query_indicator_type.value = null;
    query_indicator_name.value = null;
  }
  on_form_submit();
});

</script>
<style>
.q-dialog__inner--minimized > div {
  max-width: unset;
}
</style>

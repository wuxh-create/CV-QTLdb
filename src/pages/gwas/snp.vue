<template>
  <q-page style="min-height: calc(100vh - 125px)" class="q-pa-md">
    <q-dialog v-model="dialog_visible">
      <q-card style="width: 600px; height: 480px">
        <q-card-section>
          <q-img
            :src="'data:image/png;base64,' + plot_data"
            spinner-color="white"
            fit="scale-down"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-card flat bordered style="max-width: 1140px" class="q-mx-auto q-my-none">
      <q-card-section class="row q-py-none q-px-none">
        <div
          class="full-width q-py-sm q-px-md bg-indigo-1 text-primary text-bold text-subtitle1"
        >
          Search SNV-GWAS by Variant or Indicator
        </div>
      </q-card-section>
      <q-form
        @submit="on_form_submit"
        @reset="on_form_reset"
        :class="{ 'q-mx-auto': small_screen }"
        class="q-py-sm"
      >
        <!-- SECTION Variant ID -->
        <div class="col-12 items-center justify-between q-my-xs">
          <span class="text-bold text-subtitle2 text-primary q-px-sm"
            >Variant ID:</span
          >
          <q-select
            dense
            outlined
            clearable
            use-input
            hide-dropdown-icon
            label-color="primary"
            label="Input variant ID"
            input-debounce="1000"
            class="col-12 q-px-sm q-py-xs"
            input-class="text-primary"
            v-model="query_variant_id"
            :options="variant_id_options"
            @filter="onVariantIDInput"
            ref="ref_variant_id"
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

        <!-- SECTION Indicator Type -->
        <div class="col-12 items-center justify-between q-my-xs">
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
            class="col-12 q-px-sm q-py-xs"
            input-class="text-primary"
            v-model="query_indicator_type"
            :options="indicator_type_options"
          />
        </div>

        <!-- SECTION Indicator Name -->
        <div class="col-12 items-center justify-between q-my-xs">
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
            class="col-12 q-px-sm q-py-xs"
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

        <!-- 提交按钮 -->
        <div class="col-12">
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
        :columns="model_gwas"
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
              icon="bar_chart"
              dense
              rounded
              outline
              @click="showPlot(props.row)"
            >
              <q-tooltip> Show boxplot </q-tooltip>
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
  type VariantType,
  type IndicatorType,
  queryGWAS,
  queryManhattan,
  queryVariantHints,
  queryIndicatorHints,
} from "@/api/query_GWAS_SNP";
import model_gwas from "~/model/TableGWAS";
import type { ResponseType } from "@/interface/types_response";
import { useRoute } from "vue-router";

const $q = useQuasar();
const small_screen = computed(() => $q.screen.lt.sm);
const route = useRoute();

//SECTION 图表相关
const dialog_visible = ref(false);
const plot_data = ref("");
const showPlot = (row) => {
  queryManhattan({
    variant_type: row.Variant_type,
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
const query_variant_type = ref<VariantType | null>(null);
const query_variant_id = ref<string | null>(null);

const current_show = reactive({
  variant_type: null as VariantType | null,
  variant_id: null as string | null,
  indicator_type: null as IndicatorType | null,
  indicator_name: null as string | null,
});
const data_stat = reactive({
  Pathology: 0,
  Nutrition: 0,
  Toxin: 0,
  Measurement: 0,
  Hormone: 0,
  Questionnaire: 0,
});
// END-SECTION

// SECTION Hints
const variant_type_options = ["SNP", "MNV", "InDel", "SV"];
const indicator_type_options = [
  "Pathology",
  "Nutrition",
  "Toxin",
  "Measurement",
  "Hormone",
  "Questionnaire",
];
const variant_id_options = ref<string[]>([]);
const indicator_name_options = ref<string[]>([]);
const ref_variant_id = ref(null);
const ref_indicator_name = ref(null);

const onVariantIDInput = (
  val: string,
  update: CallableFunction,
  abort: CallableFunction
) => {
  update(() => {
    if (val === "") {
      variant_id_options.value = [];
    } else {
      queryVariantHints({
        variant_type: query_variant_type.value,
        input: val,
      })
        .then((response) => {
          const formatResponse = response as ResponseType;
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
        })
        .catch((error) => {
          variant_id_options.value = [val];
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
  const variantTypeNotEmpty = Boolean(query_variant_type.value);
  const variantIDNotEmpty = Boolean(query_variant_id.value);
  const indicatorTypeNotEmpty = Boolean(query_indicator_type.value);
  const indicatorNameNotEmpty = Boolean(query_indicator_name.value);
  return (
    variantTypeNotEmpty ||
    variantIDNotEmpty ||
    indicatorTypeNotEmpty ||
    indicatorNameNotEmpty
  );
});
// END-SECTION

//SECTION 查询示例
type example_type = {
  label: string;
  variantType: VariantType | null;
  variantID: string | null;
  indicatorType: PhenotypeType | null;
  indicatorName: string | null;
  disable: boolean;
};
const examples: example_type[] = [
  {
    label: "example1",
    variantID: null,
    indicatorType: "Pathology",
    indicatorName: null,
    disable: false,
  },
  {
    label: "example2",
    variantID: null,
    indicatorType: null,
    indicatorName: "Hemoglobin",
    disable: false,
  },
  {
    label: "example3",
    variantID: "chr11_61753846_G_A",
    indicatorType: null,
    indicatorName: null,
    disable: false,
  },
];
const set_example = (example_obj: example_type) => {
  query_indicator_type.value = example_obj.indicatorType;
  query_indicator_name.value = example_obj.indicatorName;
  query_variant_type.value = example_obj.variantType;
  query_variant_id.value = example_obj.variantID;
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
  sortBy: "FDR",
  descending: false,
});
// END-SECTION

// SECTION 方法
const on_table_request = (props) => {
  table_loading.value = true;
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  // 获取数据
  queryGWAS({
    variant_type: current_show.variant_type,
    variant_id: current_show.variant_id,
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
      table_pagination.value.rowsNumber = formatResponse.total;
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
  queryGWAS({
    variant_type: current_show.variant_type,
    variant_id: current_show.variant_id,
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
      model_gwas.map((col) => wrapCsvValue(col.label)).join("\t"),
    ]
      .concat(
        formatResponse.data.map((row) =>
          model_gwas
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
      `variant_output_${
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
    queryGWAS({
      variant_id: query_variant_id.value,
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

          current_show.variant_id = query_variant_id.value;
          current_show.indicator_type = query_indicator_type.value;
          current_show.indicator_name = query_indicator_name.value;

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
  query_variant_type.value = null;
  query_variant_id.value = null;
};
// END-SECTION

onBeforeMount(() => {
  if (Boolean(Object.keys(route.query).length)) {
    query_variant_type.value = Boolean(route.query.variant_type)
      ? (String(route.query.variant_type) as VariantType)
      : ("SV" as VariantType);
    query_variant_id.value = Boolean(route.query.variant_id)
      ? (String(route.query.variant_id) as string | null)
      : null;
    query_indicator_type.value = Boolean(route.query.indicator_type)
      ? (String(route.query.indicator_type) as PhenotypeType)
      : ("eQTL" as PhenotypeType);
    query_indicator_name.value = Boolean(route.query.variant_id)
      ? (String(route.query.variant_id) as string | null)
      : null;
    on_form_submit();
  } else {
    // 没有路由参数时，使用默认查询
    query_indicator_type.value = "Pathology";
    on_form_submit();
  }
});
</script>
<style>
.q-dialog__inner--minimized > div {
  max-width: unset;
}
</style>

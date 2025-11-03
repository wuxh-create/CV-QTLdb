<template>
  <q-page style="min-height: calc(100vh - 125px)" class="q-pa-md">
    <q-dialog v-model="dialog_visible">
      <q-card style="width: 550px; height: 500px">
        <q-card-section>
          <Boxplot
            :x_title="plot_data.variant"
            :y_title="plot_data.phenotype"
            :data="plot_data.data"
            :samples="plot_data.samples"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-card flat bordered style="max-width: 1200px" class="q-mx-auto q-my-none">
      <q-card-section class="row q-py-none q-px-none">
        <div
          class="full-width q-py-sm q-px-md bg-indigo-1 text-primary text-bold text-subtitle1"
        >
          Search MNV-QTL by Variant or Phenotype
        </div>
      </q-card-section>
      <q-form
        @submit="on_form_submit"
        @reset="on_form_reset"
        :class="{ 'q-mx-auto': small_screen }"
        class="q-py-sm"
      >
        <!-- 竖向排列查询条件 -->
        <div class="column q-gutter-y-md">
          <!-- Variant ID -->
          <div>
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
              class="q-px-sm q-py-xs"
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
          
          <!-- Phenotype Type -->
          <div>
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
              class="q-px-sm q-py-xs"
              input-class="text-primary"
              v-model="query_phenotype_type"
              :options="phenotype_type_options"
            />
          </div>
          
          <!-- Phenotype ID -->
          <div>
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
              class="q-px-sm q-py-xs"
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
      style="max-width: 1200px"
      class="q-mx-auto q-my-md q-px-none"
    >
      <q-table
        flat
        row-key="label"
        v-model:pagination="table_pagination"
        :rows="table_data"
        :columns="model_qtl"
        :dense="small_screen"
        :loading="table_loading"
        :rows-per-page-options="[15, 50, 100, 0]"
        :pagination-label="
          (firstRowIndex, endRowIndex, totalRowsNumber) =>
            `${firstRowIndex}~${endRowIndex} / ${totalRowsNumber}`
        "
        @request="on_table_request"
        separator="cell"
        no-data-label="No data"
        ref="table"
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
  type PhenotypeType,
  queryMNV,
  queryBoxplot,
  queryVariantHints,
  queryPhenotypeHints,
} from "@/api/query_QTL_MNV";
import model_qtl from "~/model/TableQTL";
import type { ResponseType } from "@/interface/types_response";
import { useRoute } from "vue-router";
import Boxplot from "~/components/Boxplot.vue";

const $q = useQuasar();
const small_screen = computed(() => $q.screen.lt.sm);
const route = useRoute();

const dialog_visible = ref(false);
const plot_data = reactive({
  variant: "none" as string,
  phenotype: "none" as string,
  samples: {} as {
    "0": number;
    "1": number;
    "2": number;
  },
  data: {} as {
    "0": number[];
    "1": number[];
    "2": number[];
  },
});
const showPlot = (row) => {
  queryBoxplot({
    variant_id: row.Variant_ID,
    phenotype_type: row.Phenotype_type,
    phenotype_id: row.Phenotype_ID,
  }).then((response) => {
    const formatResponse = response as ResponseType;
    if (formatResponse.data) {
      dialog_visible.value = true;
      plot_data.variant = row.Variant_ID;
      plot_data.phenotype = row.Phenotype_ID;
      for (const key in ["0", "1", "2"]) {
        if (formatResponse.data[`n_${key}`] > 0) {
          plot_data.samples[key] = formatResponse.data[`n_${key}`];
          plot_data.data[key] = formatResponse.data[`data_${key}`]
            .split(",")
            .map(Number);
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
        icon: "warning",
      });
    }
  });
};

//SECTION 查询相关变量
const query_phenotype_type = ref<PhenotypeType | null>(null);
const query_phenotype_id = ref<string | null>(null);
const query_variant_id = ref<string | null>(null);

const current_show = reactive({
  variant_id: null as string | null,
  phenotype_type: null as PhenotypeType | null,
  phenotype_id: null as string | null,
});
const data_stat = reactive({
  eQTL: 0,
  sQTL: 0,
  apaQTL: 0,
  meQTL: 0,
});
// END-SECTION

// SECTION Hints
const phenotype_type_options = ["eQTL", "apaQTL", "sQTL", "meQTL"];
const variant_id_options = ref<string[]>([]);
const phenotype_id_options = ref<string[]>([]);
const ref_variant_id = ref(null);
const ref_phenotype_id = ref(null);

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
// END-SECTION

// SECTION 表单校检
const formImputed: ComputedRef<boolean> = computed(() => {
  const variantIDNotEmpty = Boolean(query_variant_id.value);
  const phenotypeTypeNotEmpty = Boolean(query_phenotype_type.value);
  const phenotypeIDNotEmpty = Boolean(query_phenotype_id.value);
  return variantIDNotEmpty || phenotypeTypeNotEmpty || phenotypeIDNotEmpty;
});
// END-SECTION

//SECTION 查询示例
type example_type = {
  label: string;
  variantID: string | null;
  phenotypeType: PhenotypeType | null;
  phenotypeID: string | null;
  disable: boolean;
};
const examples: example_type[] = [
  {
    label: "example1",
    variantID: "HNMNV140207528",
    phenotypeType: "eQTL",
    phenotypeID: "ENSG00000071246.11",
    disable: false,
  },
  {
    label: "example2",
    variantID: "HNMNV010217172",
    phenotypeType: "sQTL",
    phenotypeID: "",
    disable: false,
  },
  {
    label: "example3",
    variantID: null,
    phenotypeType: "meQTL",
    phenotypeID: null,
    disable: false,
  }
];
const set_example = (example_obj: example_type) => {
  query_phenotype_type.value = example_obj.phenotypeType;
  query_phenotype_id.value = example_obj.phenotypeID;
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
  queryMNV({
    variant_id: current_show.variant_id,
    phenotype_type: current_show.phenotype_type,
    phenotype_id: current_show.phenotype_id,
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
  queryMNV({
    variant_id: current_show.variant_id,
    phenotype_type: current_show.phenotype_type,
    phenotype_id: current_show.phenotype_id,
    page: 1,
    pageSize: -1,
    sortBy: table_pagination.value.sortBy,
    order: table_pagination.value.descending ? -1 : 1,
  }).then((response) => {
    const formatResponse = response as ResponseType;
    // FIXME 这里根据实际要忽略的列选择
    const content = [model_qtl.map((col) => wrapCsvValue(col.label)).join("\t")]
      .concat(
        formatResponse.data.map((row) =>
          model_qtl
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
    // 更新当前展示的变量
    queryMNV({
      variant_id: query_variant_id.value,
      phenotype_type: query_phenotype_type.value,
      phenotype_id: query_phenotype_id.value,
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
          current_show.phenotype_type = query_phenotype_type.value;
          current_show.phenotype_id = query_phenotype_id.value;

          data_stat.eQTL = formatResponse.stat.eQTL;
          data_stat.sQTL = formatResponse.stat.sQTL;
          data_stat.apaQTL = formatResponse.stat.apaQTL;
          data_stat.meQTL = formatResponse.stat.meQTL;
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
  query_phenotype_type.value = null;
  query_phenotype_id.value = null;
  query_variant_id.value = null;
};
// END-SECTION

onBeforeMount(() => {
  if (Boolean(Object.keys(route.query).length)) {
    query_variant_id.value = Boolean(route.query.variant_id)
      ? (String(route.query.variant_id) as string | null)
      : null;
    query_phenotype_type.value = Boolean(route.query.phenotype_type)
      ? (String(route.query.phenotype_type) as PhenotypeType)
      : ("eQTL" as PhenotypeType);
    query_phenotype_id.value = Boolean(route.query.variant_id)
      ? (String(route.query.variant_id) as string | null)
      : null;
    on_form_submit();
  }
});
</script>
<style>
.q-dialog__inner--minimized > div {
  max-width: unset;
}
</style>

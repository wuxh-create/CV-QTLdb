<template>
  <q-page style="min-height: calc(100vh - 125px);margin: 5px auto 0 auto;" class="q-pa-md">
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
    <q-card flat bordered style="max-width: 1140px" class="q-mx-auto q-my-none">
      <q-card-section class="row q-py-none q-px-none">
        <div
          class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 20px;line-height: 1.3;"
        >
          Search meQTL by Variant or Gene
        </div>
      </q-card-section>
      <q-card-section class="q-px-md q-pt-md q-pb-sm">
        <div class="text-body1 text-grey-8" style="line-height: 1.5;">
          This module provides 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
            10,537,458
          </span>
          meQTLs identified across 148 healthy Chinese individuals.
          The meQTL dataset links genetic variants to DNA methylation levels at 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
            13,757,124
          </span>
          high-quality CpG sites genome-wide, encompassing 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
            5,344,683 
          </span>
          cis-meQTL pairs and 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
            4,002,871
          </span>
          trans-meQTL pairs from SNVs, 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
            392,720 
          </span>
          cis-meQTL pairs and 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
            287,376
          </span>
          trans-meQTL pairs from InDels, 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
            296,675 
          </span>
          cis-meQTL pairs and 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
            168,050 
          </span>
          trans-meQTL pairs from MNVs, and 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
            21,305 
          </span>cis-meQTL pairs and 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
            23,778 
          </span>
          trans-meQTL pairs from SVs.<br>
          <!-- meQTLs were mapped using linear regression models implemented in 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: #f57c20; background-color: white;">
              MatrixEQTL,
          </span>
          adjusting for age, sex, 15 PEER factors, and five genetic principal components. 
          Associations were classified as 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: #f57c20; background-color: white;">
              cis-meQTLs (variant-gene distance ≤ 1 Mb)
          </span>
           or 
           <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: #f57c20; background-color: white;">
              trans-meQTLs (distance > 1 Mb),
          </span> 
          with statistical significance defined as 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
            FDR < 0.05.
          </span> -->
        </div>
      </q-card-section>
      <q-form
        @submit="on_form_submit"
        @reset="on_form_reset"
        :class="{ 'q-mx-auto': small_screen }"
        class="q-py-sm"
      >
        <div class="row">
          <div class="col-12 col-sm-4 items-center justify-between q-my-xs">
            <span class="text-bold text-subtitle2 text-primary q-px-sm"
              >Variant Type:</span
            >
            <q-select
              dense
              outlined
              clearable
              use-input
              hide-dropdown-icon
              label-color="primary"
              label="Select variant type"
              input-debounce="1000"
              class="col-sm-4 col-12 q-px-sm q-py-xs"
              input-class="text-primary"
              v-model="query_variant_type"
              :options="variant_type_options"
            />
          </div>
          <div class="col-12 col-sm-8 items-center justify-between q-my-xs">
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
              class="col-12 col-sm-8 q-px-sm q-py-xs"
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
        </div>
        <div class="row">
          <div class="col-12 col-sm-8 items-center justify-between q-my-xs">
            <span class="text-bold text-subtitle2 text-primary q-px-sm"
              >Gene ID:</span
            >
            <q-select
              dense
              outlined
              clearable
              use-input
              hide-dropdown-icon
              label-color="primary"
              label="Input gene ID"
              input-debounce="1000"
              class="col-sm-4 col-12 q-px-sm q-py-xs"
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
      <div class="row justify-center q-pb-md q-my-xs">
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
        :columns="model_qtl"
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
  type VariantType,
  queryQTL,
  queryBoxplot,
  queryVariantHints,
  queryPhenotypeHints,
} from "@/api/query_QTL";
import model_qtl from "~/model/TableQTL";
import type { ResponseType } from "@/interface/types_response";
import { useRoute } from "vue-router";
import Boxplot from "~/components/Boxplot.vue";

const $q = useQuasar();
const small_screen = computed(() => $q.screen.lt.sm);
const route = useRoute();

const PHENOTYPE_TYPE = "meQTL";

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
    variant_type: row.Variant_type,
    variant_id: row.Variant_ID,
    phenotype_type: PHENOTYPE_TYPE,
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
    } else {
      $q.notify({
        message: "No data found!",
        color: "negative",
        icon: "warning",
      });
    }
  });
};

const query_phenotype_id = ref<string | null>(null);
const query_variant_type = ref<VariantType | null>(null);
const query_variant_id = ref<string | null>(null);

const current_show = reactive({
  variant_type: null as VariantType | null,
  variant_id: null as string | null,
  phenotype_id: null as string | null,
});

const data_stat = reactive({
  SNP: 0,
  MNV: 0,
  InDel: 0,
  SV: 0,
});

const variant_type_options = ["SNP", "MNV", "InDel", "SV"];
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
        phenotype_type: PHENOTYPE_TYPE,
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

const formImputed: ComputedRef<boolean> = computed(() => {
  const variantTypeNotEmpty = Boolean(query_variant_type.value);
  const variantIDNotEmpty = Boolean(query_variant_id.value);
  const phenotypeIDNotEmpty = Boolean(query_phenotype_id.value);
  return variantTypeNotEmpty || variantIDNotEmpty || phenotypeIDNotEmpty;
});

type example_type = {
  label: string;
  variantType: VariantType | null;
  variantID: string | null;
  phenotypeID: string | null;
  disable: boolean;
};

const examples: example_type[] = [
  {
    label: "example1",
    variantType: "SNP",
    variantID: null,
    phenotypeID: null,
    disable: false,
  },
  {
    label: "example2",
    variantType: "InDel",
    variantID: null,
    phenotypeID: null,
    disable: false,
  },
];

const set_example = (example_obj: example_type) => {
  query_phenotype_id.value = example_obj.phenotypeID;
  query_variant_type.value = example_obj.variantType;
  query_variant_id.value = example_obj.variantID;
};

const table_data = ref([]);
const table_loading = ref(false);
const table_pagination = ref({
  page: 1,
  rowsPerPage: <15 | 50 | 100 | 0>15,
  rowsNumber: 0,
  sortBy: "FDR",
  descending: false,
});

const on_table_request = (props) => {
  table_loading.value = true;
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  queryQTL({
    variant_type: current_show.variant_type,
    variant_id: current_show.variant_id,
    phenotype_type: PHENOTYPE_TYPE,
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
  queryQTL({
    variant_type: current_show.variant_type,
    variant_id: current_show.variant_id,
    phenotype_type: PHENOTYPE_TYPE,
    phenotype_id: current_show.phenotype_id,
    page: 1,
    pageSize: -1,
    sortBy: table_pagination.value.sortBy,
    order: table_pagination.value.descending ? -1 : 1,
  }).then((response) => {
    const formatResponse = response as ResponseType;
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
      `eQTL_output_${
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
    queryQTL({
      variant_type: query_variant_type.value,
      variant_id: query_variant_id.value,
      phenotype_type: PHENOTYPE_TYPE,
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

          current_show.variant_type = query_variant_type.value;
          current_show.variant_id = query_variant_id.value;
          current_show.phenotype_id = query_phenotype_id.value;

          data_stat.SNP = formatResponse.stat.SNP;
          data_stat.MNV = formatResponse.stat.MNV;
          data_stat.InDel = formatResponse.stat.InDel;
          data_stat.SV = formatResponse.stat.SV;
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
  query_phenotype_id.value = null;
  query_variant_type.value = null;
  query_variant_id.value = null;
};

// onBeforeMount(() => {
//   if (Boolean(Object.keys(route.query).length)) {
//     query_variant_type.value = Boolean(route.query.variant_type)
//       ? (String(route.query.variant_type) as VariantType)
//       : ("SNP" as VariantType);
//     query_variant_id.value = Boolean(route.query.variant_id)
//       ? (String(route.query.variant_id) as string | null)
//       : null;
//     query_phenotype_id.value = Boolean(route.query.phenotype_id)
//       ? (String(route.query.phenotype_id) as string | null)
//       : null;
//     on_form_submit();
//   }

onBeforeMount(() => {
  if (Boolean(Object.keys(route.query).length)) {
    // 如果有 URL 参数，使用 URL 参数
    query_variant_type.value = Boolean(route.query.variant_type)
      ? (String(route.query.variant_type) as VariantType)
      : ("SNP" as VariantType);
    query_variant_id.value = Boolean(route.query.variant_id)
      ? (String(route.query.variant_id) as string | null)
      : null;
    query_phenotype_id.value = Boolean(route.query.phenotype_id)
      ? (String(route.query.phenotype_id) as string | null)
      : null;
  } else {
    // 没有 URL 参数时，使用默认初始查询条件
    query_variant_type.value = "SV";
    query_variant_id.value = null;
    query_phenotype_id.value = null;
  }
  // 执行查询
  on_form_submit();
});
</script>
<style>
.q-dialog__inner--minimized > div {
  max-width: unset;
}
</style>
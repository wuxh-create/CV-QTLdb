<template>
  <q-page style="min-height: calc(100vh - 125px); margin: 5px auto 0 auto;" class="q-pa-md">
    <q-card flat bordered style="max-width: 1140px" class="q-mx-auto q-my-none">
      <q-card-section class="row q-py-none q-px-none">
        <div
          class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 20px;line-height: 1.3;"
        >
          Search variant by type, ID or range
        </div>
      </q-card-section>
      <q-card-section class="q-px-md q-pt-md q-pb-sm">
        <div class="text-body1 text-grey-8" style="line-height: 1.7;">
          This module provides a comprehensive catalog of 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
              21,014,915
          </span>
           genetic variants identified from 148 healthy Chinese individuals 
          using PacBio HiFi long-read sequencing, comprising 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
              96,203
          </span> 
          SVs, 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
              18,400,996
          </span> 
          SNVs, 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
              428,349
          </span> 
          MNVs, and 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: red; background-color: white;">
              2,089,567
          </span>
          InDels.
          <br>
          These variants were identified through an integrated computational pipeline: 
          SNVs and InDels were called using 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: #f57c20; background-color: white;">
              Clair3
          </span>
          , 
          MNVs were detected by 
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: #f57c20; background-color: white;">
              MNVAnno
          </span>
          following SNV phasing with SHAPEIT5, 
          and SVs were identified by integrating four complementary algorithms
          <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: #f57c20; background-color: white;">
              (cuteSV, Sniffles, PBSV, and SVision-pro)
          </span> 
          using the CAST merging strategy. 
        </div>
      </q-card-section>

      <q-form
        @submit="on_form_submit"
        @reset="on_form_reset"
        :class="{ 'q-mx-auto': small_screen }"
        class="q-py-sm"
      >
        <!-- SECTION variant_type -->
        <!-- "col-sm-2 col-12 text-right text-bold text-subtitle2 text-primary q-px-sm" -->
        <div class="row">
          <div class="col-12 col-sm-6 items-center justify-between q-my-xs">
            <span
              class="text-bold text-subtitle2 text-primary q-px-sm"
              :class="small_screen ? 'text-left col-12' : 'text-left col-2'"
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
              class="col-sm-10 col-12 q-px-sm q-py-xs"
              input-class="text-primary"
              v-model="query_variant_type"
              :options="variant_type_options"
            />
          </div>
          <!-- SECTION variant_id -->
          <div class="col-12 col-sm-6 items-center justify-between q-my-xs">
            <span
              class="text-bold text-subtitle2 text-primary q-px-sm"
              :class="small_screen ? 'text-left col-12' : 'text-left col-2'"
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
              class="col-sm-4 col-12 q-px-sm q-py-xs"
              input-class="text-primary"
              v-model="query_variant_id"
              :options="variant_id_options"
              @filter="onTextInput"
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
          <!-- SECTION variant_range -->
          <div class="col-12 items-center justify-between q-my-xs">
            <span
              class="text-bold text-subtitle2 text-primary q-px-sm"
              :class="small_screen ? 'text-left col-12' : 'text-left col-2'"
              >Genomic Range:</span
            >
            <q-input
              dense
              outlined
              clearable
              label-color="primary"
              label="Input variant range"
              class="col-sm-10 col-12 q-px-sm q-py-xs"
              input-class="text-primary"
              v-model="query_range"
              :rules="query_range_rules"
            />
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
        :columns="model_variant"
        :dense="small_screen"
        :loading="table_loading"
        :rows-per-page-options="[15, 50, 100]"
        rows-per-page-label="Rows per page:"
        all-rows-label="All"
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
        <template v-slot:body-cell-MNVID="props">
          <q-td class="text-center" :props="props">
            <a
              class="text-bold"
              :href="`http://gong_lab.hzau.edu.cn/MNVList/home/searchmnvid.html?selectValue=${props.row.mnvid}&version=1`"
              target="_blank"
            >
              {{ props.row.mnvid }}</a
            >
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
  queryVariant,
  queryVariantHints,
} from "@/api/query_Variants";
import model_variant from "~/model/TableVariant";
import type { ResponseType } from "@/interface/types_response";
import isValidRange from "@/utils/validate_genomic_range";
import { useRoute } from "vue-router";

const $q = useQuasar();
const small_screen = computed(() => $q.screen.lt.sm);
const route = useRoute();

//SECTION 查询相关变量
const query_variant_type = ref<VariantType | null>(null);
const query_variant_id = ref<string | null>(null);
const query_range = ref<string | null>(null);
const current_show = reactive({
  variant_type: null as VariantType | null,
  variant_id: null as string | null,
  variant_range: null as string | null,
});
const data_stat = reactive<Record<string, number>>({
  SNP: 0,
  MNV: 0,
  InDel: 0,
  SV: 0,
});
// END-SECTION

// SECTION Hints
const variant_type_options = ["SNP", "MNV", "InDel", "SV"];
const variant_id_options = ref<string[]>([]);
const ref_variant_id = ref(null);

const onTextInput = (
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
// END-SECTION

// SECTION 表单校检
const query_range_rules = [isValidRange];
const formImputed: ComputedRef<boolean> = computed(() => {
  const variantTypeNotEmpty = Boolean(query_variant_type.value);
  const rangeNotEmpty = Boolean(query_range.value);
  return variantTypeNotEmpty || rangeNotEmpty;
});
// END-SECTION

//SECTION 查询示例
type example_type = {
  label: string;
  variantType: VariantType | null;
  variantRange: string | null;
  variantID: string | null;
  disable: boolean;
};
const examples: example_type[] = [
  {
    label: "example1",
    variantType: "SNP",
    variantRange: "chr1:790000-890000",
    variantID: null,
    disable: false,
  },
  {
    label: "example2",
    variantType: "MNV",
    variantRange: "chr1:50000-800000",
    variantID: null,
    disable: false,
  },
  {
    label: "example3",
    variantType: "InDel",
    variantRange: null,
    variantID: "chr1_814583_T_TAA",
    disable: false,
  },
];
const set_example = (example_obj: example_type) => {
  query_variant_type.value = example_obj.variantType;
  query_range.value = example_obj.variantRange;
  query_variant_id.value = example_obj.variantID;
  // on_form_submit();
};
// END-SECTION

// SECTION 当前展示
const table_visible = ref(false);
// END-SECTION

// SECTION 表格相关
const table_data = ref([]);
const table_loading = ref(false);
const table_pagination = ref({
  page: 1,
  rowsPerPage: <15 | 50 | 100 | 0>15,
  rowsNumber: 0,
  sortBy: "Chromosome",
  descending: false,
});
// END-SECTION

// SECTION 方法
const on_table_request = (props) => {
  table_loading.value = true;
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  // 获取数据
  queryVariant({
    variant_type: current_show.variant_type,
    variant_id: current_show.variant_id,
    range: current_show.variant_range,
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
const on_form_submit = () => {
  if (formImputed.value) {
    table_loading.value = true;
    // 更新当前展示的变量
    queryVariant({
      variant_type: query_variant_type.value,
      variant_id: query_variant_id.value,
      range: query_range.value,
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
          current_show.variant_range = query_range.value;
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
        table_visible.value = true;
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
  query_variant_id.value = null;
  query_range.value = null;
};
// END-SECTION

// onBeforeMount(() => {
//   if (Boolean(Object.keys(route.query).length)) {
//     query_variant_type.value = Boolean(route.query.variant_type)
//       ? (String(route.query.variant_type) as VariantType)
//       : ("SNP" as VariantType);
//     query_range.value = Boolean(route.query.rage)
//       ? (String(route.query.range) as string | null)
//       : null;
//     query_variant_id.value = Boolean(route.query.variant_id)
//       ? (String(route.query.variant_id) as string | null)
//       : null;
//     on_form_submit();
//   }


onBeforeMount(() => {
  if (Boolean(Object.keys(route.query).length)) {
    // 如果有 URL 参数，使用 URL 参数
    query_variant_type.value = Boolean(route.query.variant_type)
      ? (String(route.query.variant_type) as VariantType)
      : ("SNP" as VariantType);
    query_range.value = Boolean(route.query.range)  // 修正拼写错误：rage -> range
      ? (String(route.query.range) as string | null)
      : null;
    query_variant_id.value = Boolean(route.query.variant_id)
      ? (String(route.query.variant_id) as string | null)
      : null;
  } else {
    // 没有 URL 参数时，使用默认初始查询条件
    query_variant_type.value = "SNP";
    query_range.value = "chr1:797000-800000";
    query_variant_id.value = null;
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

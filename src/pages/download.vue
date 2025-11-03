<template>
  <q-page class="q-mx-auto" style="min-height: calc(100vh - 180px);margin: 5px auto 0 auto;">
    <div class="row" style="padding: 0 0px">
      <!-- 下载变异信息 -->
      <q-card
        flat
        bordered
        style="width: 1140px"
        class="col-10 q-mx-auto q-my-sm"
      >
        <div
          class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 20px;line-height: 1.3;"
        >
          1. Download Variant results
        </div>
        <q-card flat bordered>
          <q-card-section class="q-pa-md q-gutter-md">
            <q-btn
              v-for="variant_type in variant_types"
              color="grey-2"
              text-color="indigo-8"
              :key="variant_type"
              :label="`${variant_type}-data`"
              no-caps
              unelevated
              size="15px"
              style="width: max-content"
              @click="
                downloadData({
                  download_type: 'variants',
                  variant_type: variant_type,
                  phenotype_type: null,
                  indicator_type: null,
                })
              "
            />
          </q-card-section>
        </q-card>
      </q-card>
      <!-- 下载QTL信息 -->
      <q-card
        flat
        bordered
        style="width: 1140px"
        class="col-10 q-mx-auto q-my-sm"
      >
        <div
          class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 20px;line-height: 1.3;"
        >
          2. Download MolQTL results
        </div>

        <q-card-section class="no-padding text-body2">
          <q-tabs
            id="downloadTab"
            class="bg-grey-3"
            active-class="shadow-3 bg-white"
            outside-arrows
            mobile-arrows
            no-caps
            stretch
            dense
            v-model="tab"
            align="left"
            narrow-indicator
          >
            <q-tab
              v-for="qtl_type in qtl_types"
              :key="qtl_type"
              :name="qtl_type"
              :label="qtl_type"
              class="text-body1 text-bold"
            />
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel
              class="q-gutter-md row"
              v-for="qtl_type in qtl_types"
              :key="qtl_type"
              :name="qtl_type"
            >
              <q-btn
                v-for="variant_type in variant_types"
                :key="variant_type"
                no-caps
                unelevated
                color="grey-2"
                text-color="indigo-8"
                size="15px"
                :label="`${variant_type}-${qtl_type}`"
                style="width: max-content"
                @click="
                  downloadData({
                    download_type: 'qtl',
                    variant_type: variant_type,
                    phenotype_type: qtl_type,
                    indicator_type: null,
                  })
                "
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
      <!-- 下载GWAS -->
      <q-card
        flat
        bordered
        style="width: 1140px"
        class="col-10 q-mx-auto q-my-sm"
      >
        <div
          class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 20px;line-height: 1.3;"
        >
          3. Download GWAS results
        </div>
        <q-card flat bordered>
          <q-card-section class="q-pa-md q-gutter-md">
            <q-btn
              v-for="variant_type in variant_types"
              color="grey-2"
              text-color="indigo-8"
              :key="variant_type"
              :label="`${variant_type}-GWAS`"
              no-caps
              unelevated
              size="15px"
              style="width: max-content"
              @click="
                downloadData({
                  download_type: 'gwas',
                  variant_type: variant_type,
                  phenotype_type: null,
                  indicator_type: null,
                })
              "
            />
          </q-card-section>
        </q-card>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { type VariantType, type PhenotypeType } from "@/interface/types_query";
import { queryDownload, type QueryDownloadParams } from "@/api/query_Download";
import { useQuasar } from "quasar";

const $q = useQuasar();

const variant_types: VariantType[] = ["SNP", "InDel", "SV", "MNV"];
const qtl_types: PhenotypeType[] = ["apaQTL", "eQTL", "meQTL", "sQTL"];
const tab = ref("apaQTL");

const downloadData = (params: QueryDownloadParams) => {
  queryDownload(params)
    .then((response) => {
      if (response.status !== 200) {
        console.log(response);
        throw new Error(
          `Download failed: ${response.message || "Unknown error"}`
        );
      }
      // 判断返回类型是否为文件
      const contentType = response.headers.get("Content-Type");
      console.log(contentType.startsWith("application/zip"));
      if (
        contentType &&
        (contentType.startsWith("text/plain") ||
          contentType.startsWith("application/zip") ||
          contentType.startsWith("application/gzip"))
      ) {
        // 处理文件下载
        let filename = "downloaded_file";
        let disposition = response.headers.get("Content-Disposition") || "";
        if (disposition) {
          const match = disposition.match(/filename=([^;]+)/);
          if (match && match[1]) {
            filename = decodeURIComponent(match[1].trim());
          }
        }
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(response._data);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }
    })
    .catch((error) => {
      $q.notify({
        message: error.statusMessage || "Download failed",
        color: "warning",
        position: "bottom",
        timeout: 1000,
      });
    });
};
</script>

<style lang="scss">
#downloadTab .q-tab__label {
  font-size: 15px;
  font-weight: 600;
}
</style>

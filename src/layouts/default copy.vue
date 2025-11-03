<template>
  <q-layout view="lHh LpR lff" class="q-mx-auto no-spacing">
    <Header_desktop
      v-if="$q.screen.gt.xs"
      :pages="tabs"
      v-model:current_page="current_page"
    />
    <Header_mobile v-else :pages="tabs" v-model:current_page="current_page" />
    <q-page-container class="no-padding">
      <!-- <q-banner class="bg-negative text-white text-center">
        This website contains preliminary research data that has not been peer-reviewed or published. Results are subject to change. Please DO NOT cite, distribute, or use this data in other research without permission.
      </q-banner> -->
      <NuxtPage />
      <q-page-scroller
        position="bottom-right"
        :scroll-offset="60"
        :offset="[80, 100]"
      >
        <q-btn round unelevated icon="keyboard_arrow_up" color="primary" size="md" />
      </q-page-scroller>
    </q-page-container>
    <Footer />
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";

const current_page = ref("Home");
const tabs = [
  { label: "Variants", path: "/variants" },
  { label: "MolQTL", path: "/qtl" },
  { label: "GWAS", path: "/gwas" },
  { label: "Correlation", path: "/correlation" },
  { label: "Download", path: "/download" },
  { label: "Help", path: "/help" },
];

const $q = useQuasar();
</script>

<style scoped lang="scss">
/* 移除布局间距 */
.no-spacing {
  .q-layout__section--marginal {
    margin: 0;
    padding: 0;
  }
}

/* 移除页面容器内边距 */
.no-padding {
  padding: 0 !important;
  margin: 0 !important;
}

/* 移除页面默认间距 */
:deep(.q-page) {
  padding: 0;
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.q-tabs {
  height: 60px;
  border-radius: 9999px;
  border: 1px solid var(--q-primary);
  box-shadow: 0 0 0 10px rgba(var(--q-primary), 0.2);
}
.q-tab {
  font-size: 12px;
  padding: 0 20px;
  font-weight: bold;
}

.q-toolbar {
  min-height: 100px;
}
</style>
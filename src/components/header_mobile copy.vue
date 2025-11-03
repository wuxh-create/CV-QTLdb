<template>
  <q-header
    :bordered="$q.dark.isActive"
    class="q-mx-auto"
  >
    <q-toolbar class="q-px-lg bg-primary">
      <q-btn-dropdown
        dense
        square
        flat
        no-caps
        dropdown-icon="menu"
        no-icon-animation
        :ripple="false"
        v-model="menu"
      >
        <q-list>
          <q-item
            v-for="page in pages"
            :key="page.label"
            v-close-popup
            :to="page.path"
          >
            <q-item-section>
              <q-item-label>
                {{ page.label }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-toolbar-title class="text-bold">
        {{ "dbQTLVar" }}
      </q-toolbar-title>
      <!-- <q-btn
        flat
        round
        dense
        size="md"
        :ripple="false"
        :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
        @click="$q.dark.toggle"
      /> -->
      <!-- <q-btn
        flat
        round
        dense
        size="md"
        :ripple="false"
        :class="$q.dark.isActive ? 'text-white' : 'text-dark'"
        :label="locale === 'zh' ? 'En' : '中'"
        @click="toggle_lang"
      /> -->
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
defineProps({
  pages: {
    type: Array as () => Array<{ label: string; path: string }>,
    default: () => [
      { label: "Variants", path: "/variants" },
      { label: "MolQTL", path: "/qtl" },
      { label: "GWAS", path: "/gwas" },
      { label: "Correlation", path: "/correlation" },
      { label: "Download", path: "/download" },
      { label: "Help", path: "/help" },
    ],
  },
});
const menu = ref(false);

const $q = useQuasar();
$q.dark.mode = "auto"

// const { locale, setLocale } = useI18n();
// const toggle_lang = () => {
//   setLocale(locale.value === "zh" ? "en" : "zh");
// };
</script>

<style scoped lang="scss"></style>

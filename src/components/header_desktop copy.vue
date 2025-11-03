<template>
  <q-header unelevated>
    <q-toolbar class="bg-primary">
      <!-- LOGO -->
      <NuxtLink to="/" class="text-white text-h6 q-px-md text-bold">
        dbQTLVar
      </NuxtLink>

      <q-space />

      <!-- 菜单 -->
      <q-tabs
        id="indexTab"
        stretch
        :shrink="true"
        active-color="amber-6"
        class="row justify-between text-white"
      >
        <!-- Variants -->
        <q-route-tab
          label="Variants"
          to="/variants"
          class="col-sm-auto"
          no-caps
          unelevated
          :ripple="false"
        />

        <!-- MolQTL 带下拉 -->
        <q-route-tab
          label="MolQTL"
          no-caps
          unelevated
          :ripple="false"
          to="/qtl"
          @mouseenter="onHover('qtl', true)"
          @mouseleave="onHover('qtl', false)"
        >
          <q-menu
            v-model="menus.qtl"
            anchor="bottom middle"
            self="top middle"
            :offset="[0, 4]"
            transition-show="jump-down"
            transition-hide="jump-up"
            @mouseenter="onMenuHover('qtl', true)"
            @mouseleave="onMenuHover('qtl', false)"
            class="bg-light-purple text-white"
          >
            <q-list dense>
              <q-item
                v-for="sub in qtlSubPages"
                :key="sub.label"
                clickable
                v-close-popup
                :to="sub.path"
                class="qtl-menu-item"
              >
                <q-item-section>{{ sub.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-route-tab>

        <!-- GWAS 带下拉 -->
        <q-route-tab
          label="GWAS"
          no-caps
          unelevated
          :ripple="false"
          to="/gwas"
          @mouseenter="onHover('gwas', true)"
          @mouseleave="onHover('gwas', false)"
        >
          <q-menu
            v-model="menus.gwas"
            anchor="bottom middle"
            self="top middle"
            :offset="[0, 4]"
            transition-show="jump-down"
            transition-hide="jump-up"
            @mouseenter="onMenuHover('gwas', true)"
            @mouseleave="onMenuHover('gwas', false)"
            class="bg-light-purple text-white"
          >
            <q-list dense>
              <q-item
                v-for="sub in gwasSubPages"
                :key="sub.label"
                clickable
                v-close-popup
                :to="sub.path"
                class="qtl-menu-item"
              >
                <q-item-section>{{ sub.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-route-tab>

        <!-- Correlation -->
        <q-route-tab
          label="Correlation"
          to="/correlation"
          class="col-sm-auto"
          no-caps
          unelevated
          :ripple="false"
        />

        <!-- Download -->
        <q-route-tab
          label="Download"
          to="/download"
          class="col-sm-auto"
          no-caps
          unelevated
          :ripple="false"
        />

        <!-- Help -->
        <q-route-tab
          label="Help"
          to="/help"
          class="col-sm-auto"
          no-caps
          unelevated
          :ripple="false"
        />
      </q-tabs>

      <q-space />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const qtlSubPages = [
  { label: 'SNP',   path: '/qtl/snp' },
  { label: 'MNV',   path: '/qtl/mnv' },
  { label: 'InDel', path: '/qtl/indel' },
  { label: 'SV',    path: '/qtl/sv' },
]

const gwasSubPages = [
  { label: 'SNP',   path: '/gwas/snp' },
  { label: 'MNV',   path: '/gwas/mnv' },
  { label: 'InDel', path: '/gwas/indel' },
  { label: 'SV',    path: '/gwas/sv' },
]

/* 两个下拉菜单的开关状态 */
const menus = reactive({
  qtl:  false,
  gwas: false,
})

/* 鼠标是否悬停在 Tab 或 Menu 上 */
const hover = reactive({
  qtlTab:  false,
  qtlMenu: false,
  gwasTab: false,
  gwasMenu:false,
})

let closeTimers = {
  qtl:  null as any,
  gwas: null as any,
}

/* 统一处理 Tab 的鼠标进出 */
function onHover(key: 'qtl'|'gwas', val: boolean) {
  hover[key + 'Tab' as keyof typeof hover] = val
  val ? openMenu(key) : closeMenuWithDelay(key)
}

/* 统一处理 Menu 的鼠标进出 */
function onMenuHover(key: 'qtl'|'gwas', val: boolean) {
  hover[key + 'Menu' as keyof typeof hover] = val
  val ? clearTimeout(closeTimers[key]) : closeMenuWithDelay(key)
}

function openMenu(key: 'qtl'|'gwas') {
  clearTimeout(closeTimers[key])
  menus[key] = true
}

function closeMenuWithDelay(key: 'qtl'|'gwas') {
  closeTimers[key] = setTimeout(() => {
    if (!hover[key + 'Tab' as keyof typeof hover] && !hover[key + 'Menu' as keyof typeof hover]) {
      menus[key] = false
    }
  }, 300)
}
</script>

<style lang="scss">
#indexTab .q-tab {
  .q-tab__label {
    font-size: 16px;
  }
}
.q-toolbar {
  min-height: 50px;
}
.bg-light-purple {
  background-color: #3F51B5 !important;
  color: white !important;
}
.qtl-menu-item {
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 15px;
}
</style>
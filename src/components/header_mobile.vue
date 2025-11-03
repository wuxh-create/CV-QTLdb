<template>
  <div class="header-wrapper">
    <div class="header-banner">
      <img 
        v-show="$q.screen.gt.xs"
        :src="headerImage"
        alt="Header Image"
        class="header-image"
      />
    </div>
    
    <q-header unelevated class="transparent-header">
      <q-toolbar class="transparent-toolbar">
        <div class="content-container bg-primary">
          <div class="toolbar-content">
            <!-- 移动端使用 q-tabs -->
            <q-tabs
              id="mobileTab"
              stretch
              :shrink="true"
              active-color="white"
              indicator-color="transparent"
              class="navigation-tabs text-white flex-1"
            >
              <!-- Home -->
              <q-route-tab
                label="Home"
                to="/"
                class="nav-tab nav-button"
                no-caps
                unelevated
              />

              <!-- Variants -->
              <q-route-tab
                label="Variants"
                to="/variants"
                class="nav-tab nav-button"
                no-caps
                unelevated
              />

              <!-- eQTL -->
              <q-route-tab
                label="eQTL"
                to="/eQTL"
                class="nav-tab nav-button"
                no-caps
                unelevated
              />

              <!-- apaQTL -->
              <q-route-tab
                label="apaQTL"
                to="/apaQTL"
                class="nav-tab nav-button"
                no-caps
                unelevated
              />

              <!-- sQTL -->
              <q-route-tab
                label="sQTL"
                to="/sQTL"
                class="nav-tab nav-button"
                no-caps
                unelevated
              />

              <!-- meQTL -->
              <q-route-tab
                label="meQTL"
                to="/meQTL"
                class="nav-tab nav-button"
                no-caps
                unelevated
              />

              <!-- GWAS 带下拉 -->
              <q-route-tab
                label="GWAS"
                class="nav-tab nav-button"
                no-caps
                unelevated
                to="/gwas"
                @mouseenter="onHover('gwas', true)"
                @mouseleave="onHover('gwas', false)"
                @click="toggleMenu('gwas')"
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
                class="nav-tab nav-button"
                no-caps
                unelevated
              />

              <!-- Download -->
              <q-route-tab
                label="Download"
                to="/download"
                class="nav-tab nav-button"
                no-caps
                unelevated
              />

              <!-- Help -->
              <q-route-tab
                label="Help"
                to="/help"
                class="nav-tab nav-button"
                no-caps
                unelevated
              />
            </q-tabs>
          </div>
        </div>
      </q-toolbar>
    </q-header>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useQuasar } from 'quasar'
// 导入SVG图片
import headerImage from '~/assets/header.svg'

const $q = useQuasar()
$q.dark.mode = "auto"

const gwasSubPages = [
  { label: 'SNP',   path: '/gwas/snp' },
  { label: 'MNV',   path: '/gwas/mnv' },
  { label: 'InDel', path: '/gwas/indel' },
  { label: 'SV',    path: '/gwas/sv' },
]

/* GWAS下拉菜单的开关状态 */
const menus = reactive({
  gwas: false,
})

/* 鼠标是否悬停在 Tab 或 Menu 上 */
const hover = reactive({
  gwasTab: false,
  gwasMenu: false,
})

let closeTimers = {
  gwas: null as any,
}

/* 统一处理 Tab 的鼠标进出 */
function onHover(key: 'gwas', val: boolean) {
  hover[key + 'Tab' as keyof typeof hover] = val
  if ($q.platform.is.desktop) {
    val ? openMenu(key) : closeMenuWithDelay(key)
  }
}

/* 统一处理 Menu 的鼠标进出 */
function onMenuHover(key: 'gwas', val: boolean) {
  hover[key + 'Menu' as keyof typeof hover] = val
  if ($q.platform.is.desktop) {
    val ? clearTimeout(closeTimers[key]) : closeMenuWithDelay(key)
  }
}

/* 移动端点击切换菜单 */
function toggleMenu(key: 'gwas') {
  if (!$q.platform.is.desktop) {
    menus[key] = !menus[key]
  }
}

function openMenu(key: 'gwas') {
  clearTimeout(closeTimers[key])
  menus[key] = true
}

function closeMenuWithDelay(key: 'gwas') {
  closeTimers[key] = setTimeout(() => {
    if (!hover[key + 'Tab' as keyof typeof hover] && !hover[key + 'Menu' as keyof typeof hover]) {
      menus[key] = false
    }
  }, 300)
}
</script>

<style lang="scss">
/* 整体头部容器 */
.header-wrapper {
  position: relative;
  width: 100%;
}

/* header banner 样式 - 移动端适配 */
.header-banner {
  width: 100%;
  max-width: 1140px;
  height: 100px; /* 移动端降低高度 */
  margin: 0 auto;
  background-color: #f5f5f5;
  border-bottom: 1px solid white;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0;
}

/* 透明的 header 和 toolbar */
.transparent-header {
  background-color: transparent !important;
  position: relative !important;
  top: 0;
}

.transparent-toolbar {
  background-color: transparent !important;
  padding: 0;
  position: relative;
  z-index: 2;
}

/* 内容容器 - 移动端适配 */
.content-container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  background-color: #e1f3fc !important;
  position: relative;
  padding: 8px 10px; /* 移动端减少内边距 */
}

.toolbar-content {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0;
}

.navigation-tabs {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin: 0;
  
  .q-tab {
    margin-right: 5px; /* 移动端减少间距 */
    
    &:last-child {
      margin-right: 0;
    }
  }
}

/* 导航按钮样式 - 移动端适配 */
.nav-button {
  background-color: #1976D2 !important;
  border-radius: 4px;
  min-height: 28px !important; /* 移动端减小高度 */
  max-height: 36px;
  padding: 0px 8px; /* 移动端减小内边距 */
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;
  
  .q-tab__label {
    font-size: 12px !important; /* 移动端减小字体 */
    font-weight: 400;
    color: white !important;
    white-space: nowrap;
    line-height: 1.5;
  }

  &:hover {
    background-color: #4488cc !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &.q-tab--active {
    background-color: #4488cc !important;
    font-weight: bold;
    .q-tab__label {
      color: orange !important;
    }
  }
}

/* 移除默认的indicator */
.navigation-tabs .q-tabs__content {
  .q-tab__indicator {
    display: none;
  }
}

/* Header图片样式 */
.header-image {
  width: 100%;
  max-width: 1140px;
  height: 100px; /* 移动端调整高度 */
  object-fit: contain;
  opacity: 1;
}

.q-toolbar {
  min-height: 28px; /* 移动端减小高度 */
}

.bg-light-purple {
  background-color: #b0baee !important;
  color: white !important;
}

.qtl-menu-item {
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 13px;
}

/* 平板和桌面端适配 */
@media (min-width: 769px) {
  .header-banner {
    height: 150px;
  }
  
  .header-image {
    height: 150px;
  }
  
  .content-container {
    padding: 10px 15px;
  }
  
  .nav-button {
    min-height: 30px !important;
    padding: 0px 15px;
    
    .q-tab__label {
      font-size: 18px !important;
    }
  }
  
  .navigation-tabs .q-tab {
    margin-right: 10px;
  }
  
  .q-toolbar {
    min-height: 30px;
  }
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  .header-banner {
    height: 60px;
  }
  
  .header-image {
    height: 60px;
  }
  
  .nav-button {
    min-height: 24px !important;
    padding: 0px 6px;
    margin-right: 3px;
    
    .q-tab__label {
      font-size: 10px !important;
    }
  }
  
  .navigation-tabs {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .content-container {
    padding: 6px 8px;
  }
  
  .qtl-menu-item {
    font-size: 11px;
    padding-top: 6px;
    padding-bottom: 6px;
  }
}
</style>
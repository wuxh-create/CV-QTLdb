<template>
  <div class="header-wrapper">
    <!-- 上方空白背景版 - 确保在导航栏上方 -->
    <div class="header-banner">
      <!-- 添加 SVG 医疗图标 -->
      <svg_medical_care1
        v-show="$q.screen.gt.xs"
        class="header-svg-component"
      />
      <!-- 这里可以放置其他内容 -->
    </div>
    
    <q-header unelevated class="transparent-header">
      <q-toolbar class="transparent-toolbar">
        <div class="content-container bg-primary">
          <div class="toolbar-content">
            <!-- LOGO 作为导航项 -->
            <q-tabs
              id="indexTab"
              stretch
              :shrink="false"
              active-color="amber-6"
              class="navigation-tabs text-white flex-1"
            >
              <!-- dbQTLVar 作为第一个导航项 -->
              <q-route-tab
                label="Home"
                to="/"
                class="nav-tab logo-tab"
                no-caps
                unelevated
                :ripple="false"
              />

              <!-- Variants -->
              <q-route-tab
                label="Variants"
                to="/variants"
                class="nav-tab"
                no-caps
                unelevated
                :ripple="false"
              />

              <!-- eQTL -->
              <q-route-tab
                label="eQTL"
                to="/eqtl"
                class="nav-tab"
                no-caps
                unelevated
                :ripple="false"
              />

              <!-- apaQTL -->
              <q-route-tab
                label="apaQTL"
                to="/apaqtl"
                class="nav-tab"
                no-caps
                unelevated
                :ripple="false"
              />

              <!-- sQTL -->
              <q-route-tab
                label="sQTL"
                to="/sqtl"
                class="nav-tab"
                no-caps
                unelevated
                :ripple="false"
              />

              <!-- meQTL -->
              <q-route-tab
                label="meQTL"
                to="/meqtl"
                class="nav-tab"
                no-caps
                unelevated
                :ripple="false"
              />

              <!-- GWAS 带下拉 -->
              <q-route-tab
                label="GWAS"
                class="nav-tab"
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
                class="nav-tab"
                no-caps
                unelevated
                :ripple="false"
              />

              <!-- Download -->
              <q-route-tab
                label="Download"
                to="/download"
                class="nav-tab"
                no-caps
                unelevated
                :ripple="false"
              />

              <!-- Help -->
              <q-route-tab
                label="Help"
                to="/help"
                class="nav-tab"
                no-caps
                unelevated
                :ripple="false"
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
  val ? openMenu(key) : closeMenuWithDelay(key)
}

/* 统一处理 Menu 的鼠标进出 */
function onMenuHover(key: 'gwas', val: boolean) {
  hover[key + 'Menu' as keyof typeof hover] = val
  val ? clearTimeout(closeTimers[key]) : closeMenuWithDelay(key)
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

/* header banner 样式 - 确保在最上方，移除内联样式到CSS */
.header-banner {
  width: 1140px;
  height: 150px;
  margin: 0 auto;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  position: relative;
  z-index: 1;
  display: block;
}

/* 透明的 header 和 toolbar */
.transparent-header {
  background-color: transparent !important;
  position: relative !important; /* 覆盖可能的fixed定位 */
  top: 0;
}

.transparent-toolbar {
  background-color: transparent !important;
  padding: 0;
  position: relative;
  z-index: 2;
}

/* 只有内容容器有蓝色背景，宽度限制为1140px */
.content-container {
  width: 1140px;
  margin: 0 auto;
  background-color: #1976D2; /* Quasar primary 蓝色 */
  position: relative;
}

.toolbar-content {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0; /* 移除左右内边距，让导航项完全填满 */
}

/* 导航标签容器 - 现在包含所有导航项 */
.navigation-tabs {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  margin: 0; /* 移除左右边距 */
}

/* 导航标签样式 - 所有标签统一样式 */
.nav-tab {
  flex: 1;
  
  .q-tab__label {
    font-size: 20px !important;
    font-weight: bold;
    color: white;
  }
}

/* logo标签特殊样式（如果需要的话） */
.logo-tab {
  .q-tab__label {
    font-size: 20px !important;
    font-weight: bold;
    color: white;
  }
}


/* header banner 样式调整 - 支持flex布局 */
.header-banner {
  width: 1140px;
  height: 150px;
  margin: 0 auto;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  position: relative;
  z-index: 1;
  display: flex; /* 改为flex布局 */
  align-items: center; /* 垂直居中 */
  justify-content: flex-end; /* 右对齐，或者用 center 居中，space-between 两端对齐 */
  padding: 0 20px; /* 添加左右内边距 */
}

/* SVG 组件样式 */
.header-svg-component {
  width: 260px; /* 调整SVG宽度 */
  height: 150px; /* 调整SVG高度，小于banner高度 */
  background: green;
  opacity: 1; /* 设置透明度 */
}

/* 响应式调整 */
@media (max-width: 1199px) {
  .header-banner {
    width: 100%;
    padding: 0 15px;
  }
  
  .header-svg-component {
    width: 250px;
    height: 100px;
  }
}

@media (max-width: 768px) {
  .header-banner {
    height: 100px;
  }
  
  .header-svg-component {
    width: 200px;
    height: 80px;
  }
}



/* 确保标签均匀分布 */
#indexTab {
  .q-tab {
    flex: 1;
    justify-content: center;
    
    .q-tab__label {
      font-size: 20px;
      font-weight: bold;
      color: white;
    }
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
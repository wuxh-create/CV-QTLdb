<template>
  <div class="header-wrapper">
    <!-- 上方空白背景版 - 确保在导航栏上方 -->
    <div class="header-banner">
      <!-- 替换为实际的SVG图片 -->
      <img 
        v-show="$q.screen.gt.xs"
        :src="headerImage"
        alt="Header Image"
        class="header-image"
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
              active-color="white"
              indicator-color="transparent"
              class="navigation-tabs text-white flex-1"
            >
              <!-- dbQTLVar 作为第一个导航项 -->
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

              <!-- sQTL -->
              <q-route-tab
                label="sQTL"
                to="/sQTL"
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
// 导入SVG图片
import headerImage from '~/assets/header.svg'

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
  border-bottom: 1px solid white;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 0;
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

/* 只有内容容器有蓝色背景，宽度限制为1140px */
.content-container {
  width: 1140px;
  margin: 0 auto;
  background-color: #e1f3fc !important;
  position: relative;
  padding: 10px 15px; /* 减少上下内边距 */
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
  justify-content: flex-start; /* 或者 center */
  margin: 0;
  
  .q-tab {
    margin-right: 10px; /* 直接给按钮添加右边距 */
    
    &:last-child {
      margin-right: 0; /* 最后一个按钮不需要右边距 */
    }
  }
}
/* 导航按钮样式 - 独立的矩形按钮 */
.nav-button {
  background-color: #1976D2 !important;
  border-radius: 4px;
  min-height: 30px !important; /* 减少按钮高度，从40px改为32px */
  max-height: 50px;
  padding: 0px 15px; /* 减少内边距，从8px 12px改为6px 10px */
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;
  
  .q-tab__label {
    font-size: 18px !important; /* 可选：稍微减小字体 */
    font-weight: 400;
    color: white !important;
    white-space: nowrap;
    line-height: 1.5;
  }

  &:hover {
    background-color: #4488cc !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &.q-tab--active {
    background-color: #4488cc !important;
    font-weight: bold;
    .q-tab__label {
      color: orange !important; /* 激活状态字体改为橙色 */
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
  width: 1140px;
  height: 150px;
  object-fit: contain;
  opacity: 1;
}

/* 响应式调整 */
@media (max-width: 1199px) {
  .header-banner,
  .content-container {
    width: 100%;
    padding-left: 0px;
    padding-right: 0px;
  }
  
  .header-image {
    width: 100%;
    height: 10px;
  }

  .nav-button .q-tab__label {
    font-size: 14px !important;
  }
}

@media (max-width: 768px) {
  .header-banner {
    height: 100px;
  }
  
  .navigation-tabs {
    flex-wrap: wrap;
    gap: 15px;
  }

  .nav-button {
    min-height: 30px;
    padding: 6px 6px;
    
    .q-tab__label {
      font-size: 12px !important;
    }
  }
}

.q-toolbar {
  min-height: 30px; /* 减少toolbar高度，从60px改为48px */
}

.bg-light-purple {
  background-color: #b0baee !important;
  color: white !important;
}

.qtl-menu-item {
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 15px;
}
</style>
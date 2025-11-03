<template>
  <q-page class="q-mx-auto" style="min-height: calc(100vh - 180px); padding-top: 0;">
    <!-- 顶部欢迎区域 -->
    

    <div class="row justify-center q-my-none" style="width: 1140px; margin: 120px auto 0 auto;">
      <q-card flat class="col-12 q-my-xs" style="border: 1px solid gainsboro;">
        <div
          class="q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 19px;"
        >
          Welcome to CV-QTLdb!
        </div>
        <q-card-section
          class="row text-body2 text-foreground text-justify q-px-md q-pb-none"
          style="font-size: 17px; line-height: 1.5;"
        >
          <p>
            CV-QTLdb provides
            <span class="text-primary text-bold q-px-xs">
              query and visualization tools for genetic variants, MolQTL information, 
              and correlations between variations and clinical traits,
            </span>
            aiming to support researchers with a comprehensive resource for functional 
            interpretation of complex genetic variations and advancing genetic research.
          </p>
          
          <q-card flat class="col-11 col-md q-my-none q-py-none" style="border: 1px solid white;"
          >
            <q-card-section
              class="col-md text-body1 text-foreground text-justify q-py-none" style="padding-left: 0; margin-left: 0;"
            >
              <span class="text-primary text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0;"
                >In CV-QTLdb, we provide:
              </span>
              <br />
              <ol class="no-margin q-pl-lg q-py-xs">
                <li class="q-pa-xs">
                  Comprehensive data for
                  <span class="text-primary text-bold rounded-borders q-px-xs">
                    4 types of genetic variants
                  </span>
                  including SNPs, InDels, MNVs, and SVs;
                </li>
                <li class="q-pa-xs">
                  Association analysis between
                  <span class="text-primary text-bold rounded-borders q-px-xs">
                    molecular QTLs (eQTL, apaQTL, sQTL, meQTL)
                  </span>
                  and genetic variants;
                </li>
                <li class="q-pa-xs">
                  GWAS associations for
                  <span class="text-primary text-bold rounded-borders q-px-xs">
                    180+ clinical traits
                  </span>
                  across different variant types;
                </li>
                <li class="q-pa-xs">
                  Correlations between
                  <span class="text-primary text-bold rounded-borders q-px-xs">
                    QTLs and clinical traits
                  </span>
                  for functional interpretation;
                </li>
              </ol>
            </q-card-section>
          </q-card>
          
          <q-card flat class="col-11 col-md q-py-none" style="border: 1px solid white; padding-left: 0; margin-left: 0;">
            <q-card-section
              class="col-md text-body1 text-foreground text-justify q-py-none" 
              style="border: 1px solid white; padding-left: 0; margin-left: 0;"
            >
              <span class="text-primary text-bold rounded-borders q-px-xs" 
                >In CV-QTLdb, users can:
              </span>
              <br />
              <ol class="no-margin q-pl-lg q-py-xs">
                <li class="q-pa-xs">
                  Search for 4 types of variants, including SNPs, InDels, MNVs, and SVs.
                </li>
                <li class="q-pa-xs">
                  Search for associations between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) 
                  and 4 types of variants.
                </li>
                <li class="q-pa-xs">
                  Search for GWAS associations of 180+ clinical traits across 4 types of variants.
                </li>
                <li class="q-pa-xs">
                  Obtain the correlation between QTLs and 180+ clinical traits.
                </li>
              </ol>
            </q-card-section>
          </q-card>
        </q-card-section>
        
        
        <!-- <q-card flat class="col-11 col-md">
          <q-card-section
            class="col-md text-body2 text-foreground text-justify q-pb-none"
          >
            <span class="text-primary text-bold rounded-borders q-px-md"
              >Citation:
            </span>
            <a class="text-subtitle2 text-primary text-bold" href="#" target="_blank">
              CV-QTLdb: A comprehensive resource for genetic variant quantitative trait loci
            </a>
            <q-btn flat dense rounded size="sm" icon="content_copy" @click="copyCite" />
          </q-card-section>
        </q-card> -->
      </q-card>
    </div>

    
    <!-- 变异类型统计卡片 -->
    <div
      ref="featureRowRef"
      class="row justify-around text-indigo-8 full-height relative-position content-section q-py-xl"
      style="margin-top: 20px; margin-bottom: 20px;"
    >
      <div
        class="text-center q-py-md cursor-pointer stat-block"
        v-for="(stat, i) in stats"
        :key="stat.title"
        :ref="el => statRefs[i] = el"
        :class="{ 'feature-hover': hoveredIndex === i }"
        @mouseenter="hoveredIndex = i"
        @mouseleave="hoveredIndex = 0"
        style="flex: 10 10 auto; width: 195px;"
      >
        <div class="text-h4 text-bold" :class="`text-${stat.color}`">
          {{ stat.stat }}
        </div>
        <div class="text-h6 text-bold" :class="`text-${stat.color}`">
          {{ stat.title }}
        </div>
      </div>
    </div>

    <!-- 数据统计图表区域 - 所有phenotype都显示SVG图片 -->
    <div class="content-section q-mt-lg">
      <div class="chart-display-area">
        <!-- 数据图表区域 - 一排五个框，减小间距 -->
        <div class="row justify-around chart-row">
          <q-card
            v-for="(phenotype, pIndex) in phenotypes"
            :key="phenotype"
            class="chart-card"
            style="width: 223px; flex: 0 0 auto;"
            flat
            bordered
          >
            <q-card-section class="text-center chart-card-section">
              <!-- 所有phenotype都显示对应的SVG图片 -->
              <div class="image-container">
                <img 
                  :src="getPhenotypeImage(phenotype)" 
                  :alt="phenotype"
                  class="phenotype-image"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- 表型模块 - 与图表对齐 -->
    <div
      class="row justify-around text-indigo-8 q-mt-md relative-position content-section"
    >
      <div
        class="text-center q-py-md"
        v-for="(p, i) in phenotypes"
        :key="p"
        :ref="el => phenotypeRefs[i] = el"
        style="flex: 0 0 auto; width: 195px;"
      >
        <!-- 表型块 -->
        <div class="text-h5 text-bold q-mb-md">
          {{ p }}
        </div>
        
        <!-- 数据标签显示在表型下方 -->
        <div class="data-labels">
          <div v-if="p === 'Clinic traits'" class="single-label">
            <div class="label-item">
              <span class="label-dot" style="background-color: #ff6b35;"></span>
              GWAS: {{ stats[hoveredIndex].qtl[p][0].toLocaleString() }}
            </div>
          </div>
          <div v-else class="dual-labels">
            <div class="label-item">
              <span class="label-dot" style="background-color: #6c5ce7;"></span>
              {{ getQTLLabel(p, 'cis') }}: {{ stats[hoveredIndex].qtl[p][0].toLocaleString() }}
            </div>
            <div class="label-item">
              <span class="label-dot" style="background-color: #fd79a8;"></span>
              {{ getQTLLabel(p, 'trans') }}: {{ stats[hoveredIndex].qtl[p][1].toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模块按钮 -->
    <div
      class="row justify-around text-indigo-8 content-section modules-section"
    >
      <q-btn
        class="q-py-lg col-sm-2 col-12 full-height"
        :to="module.link"
        flat
        no-caps
        v-for="module in modules"
        :key="module.title"
      >
        <q-avatar
          :icon="module.icon"
          size="50px"
          :color="$q.dark.isActive ? 'primary' : 'white'"
        />
        <div class="q-my-md">
          <div
            class="text-h6 text-bold q-mb-sm"
            :class="{ 'text-dark': !$q.dark.isActive }"
          >
            {{ module.title }}
          </div>
          <div
            class="text-subtitle2"
            :class="{
              'text-grey-4': $q.dark.isActive,
              'text-grey-8': !$q.dark.isActive,
            }"
          >
            {{ module.subtitle }}
          </div>
        </div>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
// 导入所有phenotype对应的图片
import expressionImage from '~/assets/eQTL.svg'
import splicingImage from '~/assets/sQTL.svg'
import apaImage from '~/assets/apaQTL.svg'
import methylationImage from '~/assets/meQTL.svg'
import clinicImage from '~/assets/gwasQTL.svg'
import { useQuasar } from 'quasar'
const $q = useQuasar()

const statRefs = ref<HTMLElement[]>([])
const phenotypeRefs = ref<HTMLElement[]>([])
const featureRowRef = ref<HTMLElement>()

// 鼠标悬停的柱状图
const hoveredBar = ref<string | null>(null)

// 当前激活的分段
const activeSegment = ref<string | null>(null)

// 当前悬停的分段
const hoveredSegment = ref<string | null>(null)

// 默认显示第一个变异类型（SNVs）
const hoveredIndex = ref<number>(0)

const stats = [
  {
    title: 'SNVs',
    stat: '18,400,996',
    color: 'red-6',
    qtl: {
      Expression: [246966, 20938],
      Splicing: [438397, 90085],
      APA: [31997, 1172375],
      Methylation: [5344683, 4002871],
      'Clinic traits': [127245, 0],
    },
  },
  {
    title: 'InDels',
    stat: '2,089,567',
    color: 'teal-6',
    qtl: {
      Expression: [18432, 1458],
      Splicing: [30899, 6171],
      APA: [2408, 87276],
      Methylation: [392720, 287376],
      'Clinic traits': [9710, 0],
    },
  },
  {
    title: 'MNVs',
    stat: '428,349',
    color: 'orange-6',
    qtl: {
      Expression: [12949, 1038],
      Splicing: [25612, 4054],
      APA: [1476, 63483],
      Methylation: [296675, 168050],
      'Clinic traits': [6215, 0],
    },
  },
  {
    title: 'SVs',
    stat: '96,203',
    color: 'indigo-6',
    qtl: {
      Expression: [1318, 150],
      Splicing: [2433, 700],
      APA: [134, 13573],
      Methylation: [21305, 23778],
      'Clinic traits': [1916, 0],
    },
  },
]

const phenotypes = ['Expression', 'Splicing', 'APA', 'Methylation', 'Clinic traits']

const modules = [
  {
    title: 'Variants',
    icon: 'las la-dna',
    link: '/variants',
  },
  {
    title: 'MolQTL',
    icon: 'las la-chart-bar',
    link: '/qtl',
  },
  {
    title: 'GWAS',
    icon: 'lab la-connectdevelop',
    link: '/gwas',
  },
  {
    title: 'Correlation',
    icon: 'las la-chart-line',
    link: '/correlation',
  },
]

// 根据phenotype返回对应的图片
const getPhenotypeImage = (phenotype: string) => {
  const imageMap = {
    'Expression': expressionImage,
    'Splicing': splicingImage,
    'APA': apaImage,
    'Methylation': methylationImage,
    'Clinic traits': clinicImage,
  }
  return imageMap[phenotype as keyof typeof imageMap]
}

// 获取QTL标签
const getQTLLabel = (phenotype: string, type: 'cis' | 'trans') => {
  const labels = {
    Expression: { cis: 'cis-eQTL', trans: 'trans-eQTL' },
    Splicing: { cis: 'cis-sQTL', trans: 'trans-sQTL' },
    APA: { cis: 'cis-apaQTL', trans: 'trans-apaQTL' },
    Methylation: { cis: 'cis-meQTL', trans: 'trans-meQTL' }
  }
  return labels[phenotype as keyof typeof labels][type]
}

// 切换分段激活状态
const toggleSegment = (segmentId: string) => {
  if (activeSegment.value === segmentId) {
    activeSegment.value = null
  } else {
    activeSegment.value = segmentId
  }
}

// 获取分段角度
const getSegmentAngle = (values: number[]) => {
  const total = values[0] + values[1]
  if (total === 0) return 180
  return (values[0] / total) * 360
}

// 获取分段颜色
const getSegmentColor = (phenotype: string, hoveredIdx: number, segmentIndex: number) => {
  const segment1Active = activeSegment.value === `${hoveredIdx}-${phenotype}-0`
  const segment2Active = activeSegment.value === `${hoveredIdx}-${phenotype}-1`
  const segment1Hovered = hoveredSegment.value === `${hoveredIdx}-${phenotype}-0`
  const segment2Hovered = hoveredSegment.value === `${hoveredIdx}-${phenotype}-1`
  
  if (segmentIndex === 0) {
    // 第一个分段 (cis)
    if (segment1Active) return '#5a4fcf' // 深紫色
    if (segment1Hovered) return '#7c6bf7' // 亮紫色
    if (segment2Active || segment2Hovered) return '#e8e6f7' // 淡紫色
    return '#6c5ce7' // 默认紫色
  } else {
    // 第二个分段 (trans)
    if (segment2Active) return '#e056a0' // 深粉色
    if (segment2Hovered) return '#fe89b3' // 亮粉色
    if (segment1Active || segment1Hovered) return '#fde2ef' // 淡粉色
    return '#fd79a8' // 默认粉色
  }
}
</script>

<style scoped>
/* 图表卡片特定样式 */
.chart-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(200, 200, 200, 0.3);
  transition: transform 0.2s ease;
  height: 250px; /* 固定卡片高度 */
  overflow: hidden; /* 防止内容溢出 */
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.chart-card-section {
  padding: 1px !important; /* 调整padding控制图片距离方框的距离 */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 图片容器样式 - 统一样式 */
.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 8px; /* 内部padding，控制图片与容器边缘的距离 */
}

.phenotype-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.phenotype-image:hover {
  transform: scale(1.05);
}

/* 图表行样式 - 减小方框之间的间距 */
.chart-row {
  gap: 4px; /* 减小间距从默认的16px到8px */
}

/* 数据标签样式 */
.data-labels {
  margin-bottom: 15px;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.single-label,
.dual-labels {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.label-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 14px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  min-width: 140px;
  white-space: nowrap;
  justify-content: flex-start;
}

.label-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.label-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 欢迎区域宽度控制 */
.welcome-section {
  width: 1140px;
  margin: 0 auto;
  padding: 0 !important;
}

/* 内容区域宽度控制 */
.content-section {
  width: 1140px;
  margin: 0 auto;
  padding: 0 !important;
}

/* 模块按钮区域 */
.modules-section {
  width: 1140px;
  margin: 0 auto;
  padding: 0 !important;
}

/* 分隔线宽度控制 */
.q-separator.content-section {
  width: 1140px;
  margin: 0 auto;
}

.relative-position {
  position: relative;
}

/* 变异统计卡片样式 */
.stat-block {
  transition: box-shadow 0.2s, transform 0.2s;
  border-radius: 12px;
}

.stat-block:hover {
  box-shadow: 0 0 12px rgba(100, 100, 200, 0.4);
  transform: translateY(-2px);
}

/* 图表显示区域 */
.chart-display-area {
  min-height: 200px;
  transition: opacity 0.3s ease;
}

/* 通用卡片样式 */
.q-card:not(.chart-card) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(200, 200, 200, 0.3);
  transition: transform 0.2s ease;
}

.q-card:not(.chart-card):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 功能列表样式 */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.feature-icon {
  flex-shrink: 0;
  margin-right: 0;
}

.feature-text {
  font-size: 20px;
  line-height: 1;
  font-weight: 100;
}

/* 对勾图标样式 */
.bold-icon {
  font-weight: 900 !important;
  text-shadow: 0 0 1px currentColor;
  filter: contrast(1.2);
}

/* svg图模式 */
.svg-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
</style>
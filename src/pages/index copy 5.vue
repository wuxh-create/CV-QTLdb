<template>
  <q-page class="q-mx-auto responsive-page">
    <!-- Welcome Section -->
    <div class="row justify-center q-my-none page-container">
      <q-card flat class="col-12 q-my-xs content-card">
        <div class="section-header">
          Welcome to CV-QTLdb!
        </div>
        <q-card-section class="row text-body2 text-foreground text-justify section-content">
          <p class="intro-text">
            <span class="highlight-text" style="border: 1px solid white;">
              CV-QTL (Complex Variant Quantitative Trait Loci)
            </span>
            refers to quantitative trait loci associated with complex genetic variants, including SNVs, MNVs, InDels, and SVs.
            <span class="highlight-text">
              CV-QTLdb
            </span>
            provides query and visualization tools for these genetic variants, MolQTL information, 
            and correlations between variations and clinical traits,
            aiming to support researchers with a comprehensive resource for functional 
            interpretation of complex genetic variations and advancing genetic research.
          </p>
          
          <q-card flat class="info-card" style="border: 1px solid white;">
            <q-card-section class="info-section">
              <span class="highlight-text info-title">
                In CV-QTLdb, we provide:
              </span>
              <br />
              <ul class="no-margin q-pl-lg q-py-xs custom-bullet-list">
                <li class="q-pa-xs list-item">
                  Comprehensive data for four types of genetic variants including SNVs, InDels, MNVs, and SVs;
                </li>
                <li class="q-pa-xs list-item">
                  Association analysis between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and genetic variants;
                </li>
                <li class="q-pa-xs list-item">
                  GWAS associations for 162+ clinical traits across different variant types;
                </li>
                <li class="q-pa-xs list-item">
                  Correlations between QTLs and clinical traits for functional interpretation;
                </li>
              </ul>
            </q-card-section>
          </q-card>
          
          <q-card flat class="info-card" style="border: 1px solid white;">
            <q-card-section class="info-section">
              <span class="highlight-text info-title">
                In CV-QTLdb, users can:
              </span>
              <br />
              <ul class="no-margin q-pl-lg q-py-xs checkmark-list">
                <li class="q-pa-xs list-item">
                  Query and browse four types of complex variants (SNPs, InDels, MNVs, and SVs).
                </li>
                <li class="q-pa-xs list-item">
                 Explore associations between molecular QTLs (eQTL, sQTL, apaQTL, meQTL) and complex variants.
                </li>
                <li class="q-pa-xs list-item">
                  Search GWAS associations for 162+ clinical traits across all variant types to identify disease-related genetic variants.
                </li>
                <li class="q-pa-xs list-item">
                  Analyze correlations between QTLs and clinical traits.
                </li>
              </ul>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </div>

    
    <!-- Data Summary 卡片 -->
    <div class="row justify-center q-my-none page-container">
      <q-card flat class="col-12 q-my-xs content-card">
        <div class="section-header">
          Data Summary
        </div>
        <q-card-section class="q-pa-md stats-section">
          <div
            ref="featureRowRef"
            class="row justify-around text-indigo-8 full-height relative-position stats-container"
          >
            <div
              class="text-center q-py-md cursor-pointer stat-block"
              v-for="(stat, i) in stats"
              :key="stat.title"
              :ref="el => statRefs[i] = el"
              :class="{ 'feature-hover': hoveredIndex === i }"
              @mouseenter="hoveredIndex = i"
              @mouseleave="hoveredIndex = 0"
            >
              <div class="stat-number" :class="`text-${stat.color}`">
                {{ animatedStats[i] }}
              </div>
              <div class="stat-title" :class="`text-${stat.color}`">
                {{ stat.title }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Data Visualization 区域 -->
    <div class="row justify-center q-my-none page-container">
      <q-card flat class="col-12 q-my-xs content-card">
        <div class="section-header">
          Data Visualization
        </div>
        <q-card-section class="q-pa-none">
          <!-- 第一排: GWAS相关 -->
          <div class="chart-display-area">
            <div class="chart-row">
              <q-card
                v-for="(phenotype, pIndex) in phenotypes"
                :key="phenotype"
                class="chart-card clickable-card"
                flat
                bordered
                @click="navigateToPhenotype(phenotype)"
              >
                <q-card-section class="text-center chart-card-section-with-title">
                  <div class="image-container-with-title">
                    <img 
                      :src="getPhenotypeImage(phenotype)" 
                      :alt="phenotype"
                      class="phenotype-image"
                    />
                  </div>
                  <div class="card-title">
                    {{ phenotype }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          
          <!-- 第二排: QTL和Correlation -->
          <div class="chart-display-area">
            <div class="chart-row">
              <q-card
                v-for="(variantType, vIndex) in variantTypes"
                :key="variantType"
                class="chart-card clickable-card"
                flat
                bordered
                @click="navigateToVariantType(variantType)"
              >
                <q-card-section class="text-center chart-card-section-with-title">
                  <div class="image-container-with-title">
                    <img 
                      :src="getVariantTypeImage(variantType)" 
                      :alt="variantType"
                      class="phenotype-image"
                    />
                  </div>
                  <div class="card-title">
                    {{ variantType }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- 底部间距 -->
    <div class="bottom-spacer"></div>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
// 导入所有phenotype对应的图片
import expressionImage from '~/assets/eQTL.svg'
import splicingImage from '~/assets/sQTL.svg'
import apaImage from '~/assets/apaQTL.svg'
import methylationImage from '~/assets/meQTL.svg'
import clinicImage from '~/assets/gwasQTL.svg'
import SNVImage from '~/assets/SNP.svg'
import MNVImage from '~/assets/MNV.svg'
import SVImage from '~/assets/SV.svg'
import InDelImage from '~/assets/InDel.svg'
import CorrelationImage from '~/assets/Correlation.svg'

const $q = useQuasar()
const router = useRouter()

const statRefs = ref<HTMLElement[]>([])
const featureRowRef = ref<HTMLElement>()

// 默认显示第一个变异类型(SNVs)
const hoveredIndex = ref<number>(0)

// 原始数据
const stats = [
  {
    title: 'SNVs',
    stat: '18,400,996',
    targetValue: 18400996,
    color: 'red-6',
  },
  {
    title: 'InDels',
    stat: '2,089,567',
    targetValue: 2089567,
    color: 'teal-6',
  },
  {
    title: 'MNVs',
    stat: '428,349',
    targetValue: 428349,
    color: 'orange-6',
  },
  {
    title: 'SVs',
    stat: '96,203',
    targetValue: 96203,
    color: 'indigo-6',
  },
]

// 动画显示的数字
const animatedStats = ref<string[]>(['0', '0', '0', '0'])

// 数字格式化函数 - 添加千位分隔符
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 数字增长动画函数
const animateNumber = (index: number, targetValue: number, duration: number = 2000) => {
  const startTime = Date.now()
  const startValue = 0
  
  const updateNumber = () => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // 使用缓动函数,让动画更流畅
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart)
    
    animatedStats.value[index] = formatNumber(currentValue)
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber)
    } else {
      animatedStats.value[index] = formatNumber(targetValue)
    }
  }
  
  requestAnimationFrame(updateNumber)
}

// 组件挂载时启动动画
onMounted(() => {
  // 为每个统计数字启动动画,添加一些延迟让它们依次启动
  stats.forEach((stat, index) => {
    setTimeout(() => {
      animateNumber(index, stat.targetValue)
    }, index * 150) // 每个数字延迟150ms启动
  })
})

// 第一排:GWAS相关
const phenotypes = ['SNV', 'MNV', 'SV', 'InDel', 'Clinic traits']
// 第二排:QTL类型
const variantTypes = ['Expression', 'Splicing', 'APA', 'Methylation', 'Correlation']

// 根据phenotype返回对应的图片(第一排)
const getPhenotypeImage = (phenotype: string) => {
  const imageMap = {
    'SNV': SNVImage,
    'MNV': MNVImage,
    'SV': SVImage,
    'InDel': InDelImage,
    'Clinic traits': clinicImage,
  }
  return imageMap[phenotype as keyof typeof imageMap]
}

// 根据变异类型返回对应的图片(第二排)
const getVariantTypeImage = (variantType: string) => {
  const imageMap = {
    'Expression': expressionImage,
    'Splicing': splicingImage,
    'APA': apaImage,
    'Methylation': methylationImage,
    'Correlation': CorrelationImage,
  }
  return imageMap[variantType as keyof typeof imageMap]
}

// 点击表型图片时的导航函数(第一排)
const navigateToPhenotype = (phenotype: string) => {
  const routeMap: { [key: string]: string } = {
    'SNV': '/gwas/snp',
    'MNV': '/gwas/mnv',
    'SV': '/gwas/sv',
    'InDel': '/gwas/indel',
    'Clinic traits': '/gwas',
  }
  const route = routeMap[phenotype]
  if (route) {
    router.push(route)
  }
}

// 点击变异类型图片时的导航函数(第二排)
const navigateToVariantType = (variantType: string) => {
  const routeMap: { [key: string]: string } = {
    'Expression': '/eQTL',
    'Splicing': '/sQTL',
    'APA': '/apaQTL',
    'Methylation': '/meQTL',
    'Correlation': '/correlation',
  }
  
  const route = routeMap[variantType]
  if (route) {
    router.push(route)
  }
}
</script>

<style scoped lang="scss">
/* ==================== 基础页面布局 ==================== */
.responsive-page {
  min-height: calc(100vh - 180px);
  padding-top: 0;
}

/* 页面容器 - 响应式宽度 */
.page-container {
  width: 100%;
  max-width: 1140px;
  margin: 3px auto 0 auto;
  padding: 0 0px;
}

/* 内容卡片 */
.content-card {
  border: 1px solid gainsboro;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

/* ==================== 标题样式 ==================== */
.section-header {
  padding: 8px 16px;
  font-size: 20px;
  line-height: 1.3;
  font-weight: bold;
  color: #1976d2;
  background-color: #e3f2fd;
}

/* ==================== Welcome Section ==================== */
.section-content {
  font-size: 17px;
  line-height: 1.5;
  padding: 16px;
}

.intro-text {
  margin: 0 0 16px 0;
}

.highlight-text {
  padding-left: 0;
  margin-left: 0;
  padding-right: 4px;
  color: #f57c20;
  background-color: white;
  font-weight: bold;
  border-radius: 4px;
}

.info-card {
  flex: 1 1 50%;
  margin: 0px 0;
  padding: 0;
}

.info-section {
  padding: 0 !important;
  margin: 0;
}

.info-title {
  display: inline-block;
  margin-bottom: 4px;
}

.list-item {
  padding: 0px 10px;
  line-height: 1.4;
}

/* 自定义列表样式 */
.custom-bullet-list {
  list-style: none;
  text-align: left; /* 设置左对齐 */
  padding-left: 18px; /* 移除左边空格 */
  margin-left: 0; /* 确保没有额外的左边距 */
}

.custom-bullet-list li::before {
  content: "⇪";
  color: #f57c20;
  font-size: 1.5em;
  display: inline-block;
  width: 1.0em;
  margin-left: -1.2em;
  vertical-align: middle;
}

.checkmark-list {
  list-style: none;
  text-align: left; /* 设置左对齐 */
  padding-left: 18px; /* 移除左边的内边距 */
  margin-left: 0; 
}

.checkmark-list li::before {
  content: "✓";
  color: #f57c20;
  font-size: 1.5em;
  font-weight: bold;
  display: inline-block;
  width: 1.0em;
  margin-left: -1.2em;
  vertical-align: middle;
}

/* ==================== Data Summary Section ==================== */
.stats-section {
  padding: 16px;
}

.stats-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-around;
}

.stat-block {
  flex: 1 1 auto;
  min-width: 150px;
  max-width: 250px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-block:hover {
  box-shadow: 0 0 12px rgba(100, 100, 200, 0.4);
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.2;
}

.stat-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 8px;
}

/* ==================== Data Visualization Section ==================== */
.chart-display-area {
  min-height: 200px;
}

.chart-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 0px;
}

.chart-card {
  flex: 1 1 auto;
  min-width: 180px;
  max-width: 227px;
  height: 250px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(200, 200, 200, 0.3);
  overflow: hidden;
  margin: 0;
  transition: all 0.3s ease;
}

.clickable-card {
  cursor: pointer;
}

.clickable-card:hover {
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.3);
  border-color: rgba(25, 118, 210, 0.5);
  transform: translateY(-2px);
}

.clickable-card:active {
  transform: translateY(0);
  box-shadow: 0 3px 8px rgba(25, 118, 210, 0.4);
}

.chart-card-section-with-title {
  padding: 8px !important;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.image-container-with-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 8px;
  min-height: 0;
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

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1976d2;
  text-align: center;
  padding: 0px 0px;
  background: rgba(255, 255, 255, 0.9);
  border-top: 1px solid #fffdfd;
  flex-shrink: 0;
}

.bottom-spacer {
  height: 60px;
}

/* ==================== 响应式设计 ==================== */

/* 平板尺寸 (768px - 1024px) */
@media (max-width: 1024px) {
  .page-container {
    padding: 0 12px;
  }

  .section-header {
    font-size: 18px;
    padding: 8px 12px;
  }

  .section-content {
    font-size: 16px;
    padding: 12px;
  }

  .stat-number {
    font-size: 2rem;
  }

  .stat-title {
    font-size: 1.1rem;
  }

  .chart-card {
    min-width: 160px;
    max-width: 200px;
    height: 220px;
  }

  .card-title {
    font-size: 16px;
  }
}

/* 小平板和大手机 (600px - 768px) */
@media (max-width: 768px) {
  .page-container {
    padding: 0 10px;
    margin: 2px auto 0 auto;
  }

  .section-header {
    font-size: 16px;
    padding: 6px 10px;
  }

  .section-content {
    font-size: 15px;
    padding: 10px;
    line-height: 1.4;
  }

  .intro-text {
    margin: 0 0 12px 0;
  }

  .info-card {
    margin: 6px 0;
  }

  .list-item {
    padding: 3px 6px;
    font-size: 14px;
  }

  .custom-bullet-list li::before,
  .checkmark-list li::before {
    font-size: 1.3em;
  }

  /* Data Summary 适配 */
  .stats-section {
    padding: 12px;
  }

  .stats-container {
    gap: 12px;
  }

  .stat-block {
    min-width: 120px;
    padding: 8px;
  }

  .stat-number {
    font-size: 1.75rem;
  }

  .stat-title {
    font-size: 1rem;
  }

  /* 图表卡片适配 */
  .chart-display-area {
    padding: 12px;
  }

  .chart-row {
    gap: 6px;
  }

  .chart-card {
    min-width: 140px;
    max-width: 180px;
    height: 200px;
  }

  .card-title {
    font-size: 14px;
    padding: 6px 3px;
  }

  .bottom-spacer {
    height: 40px;
  }
}

/* 手机尺寸 (480px - 600px) */
@media (max-width: 600px) {
  .page-container {
    padding: 0 8px;
  }

  .section-header {
    font-size: 15px;
    padding: 6px 8px;
  }

  .section-content {
    font-size: 14px;
    padding: 8px;
  }

  .list-item {
    font-size: 13px;
  }

  /* Data Summary 两列布局 */
  .stats-container {
    gap: 10px;
  }

  .stat-block {
    flex: 1 1 calc(50% - 10px);
    min-width: 110px;
    max-width: none;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-title {
    font-size: 0.95rem;
  }

  /* 图表卡片两列布局 */
  .chart-card {
    flex: 1 1 calc(50% - 6px);
    min-width: 130px;
    max-width: none;
    height: 180px;
  }

  .card-title {
    font-size: 13px;
  }
}

/* 小手机尺寸 (< 480px) */
@media (max-width: 480px) {
  .page-container {
    padding: 0 6px;
    margin: 1px auto 0 auto;
  }

  .section-header {
    font-size: 14px;
    padding: 5px 6px;
  }

  .section-content {
    font-size: 13px;
    padding: 6px;
    line-height: 1.3;
  }

  .highlight-text {
    padding-right: 2px;
  }

  .intro-text {
    margin: 0 0 10px 0;
  }

  .info-card {
    margin: 4px 0;
  }

  .list-item {
    padding: 2px 4px;
    font-size: 12px;
  }

  .custom-bullet-list,
  .checkmark-list {
    padding-left: 12px !important;
  }

  .custom-bullet-list li::before,
  .checkmark-list li::before {
    font-size: 1.2em;
  }

  /* Data Summary 单列布局 */
  .stats-section {
    padding: 8px;
  }

  .stats-container {
    gap: 8px;
  }

  .stat-block {
    flex: 1 1 100%;
    min-width: 100px;
    padding: 6px;
  }

  .stat-number {
    font-size: 1.4rem;
  }

  .stat-title {
    font-size: 0.9rem;
  }

  /* 图表卡片单列布局 */
  .chart-display-area {
    padding: 4px;
  }

  .chart-row {
    gap: 4px;
    flex-direction: column;
  }

  .chart-card {
    flex: 1 1 100%;
    min-width: 100%;
    max-width: 100%;
    height: 160px;
  }

  .chart-card-section-with-title {
    padding: 6px !important;
  }

  .image-container-with-title {
    padding: 4px;
  }

  .card-title {
    font-size: 12px;
    padding: 5px 2px;
  }

  .bottom-spacer {
    height: 30px;
  }
}

/* 超小手机 (< 360px) */
@media (max-width: 360px) {
  .section-header {
    font-size: 13px;
    padding: 4px 5px;
  }

  .section-content {
    font-size: 12px;
    padding: 5px;
  }

  .list-item {
    font-size: 11px;
  }

  .stat-number {
    font-size: 1.2rem;
  }

  .stat-title {
    font-size: 0.85rem;
  }

  .chart-card {
    height: 140px;
  }

  .card-title {
    font-size: 11px;
  }
}

/* ==================== 通用工具类 ==================== */
.relative-position {
  position: relative;
}

.no-margin {
  margin: 0;
}
</style>
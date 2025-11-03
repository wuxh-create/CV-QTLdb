<template>
  <q-page class="q-mx-auto" style="min-height: calc(100vh - 180px); padding-top: 0;">
    <div class="row justify-center q-my-none" style="width: 1140px; margin: 3px auto 0 auto;">
      <q-card flat class="col-12 q-my-xs" style="border: 1px solid gainsboro;">
        <div
          class="q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 20px;line-height: 1.3;"
        >
          Welcome to CV-QTLdb!
        </div>
        <q-card-section
          class="row text-body2 text-foreground text-justify q-px-md q-pb-none"
          style="font-size: 17px; line-height: 1.5;"
        >
          <p>
            <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: #f57c20; background-color: white;">
              CV-QTL (Complex Variant Quantitative Trait Loci)
            </span>
            refers to quantitative trait loci associated with complex genetic variants, including SNVs, MNVs, InDels, and SVs.
            <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0; color: #f57c20; background-color: white;">
              CV-QTLdb
            </span>
            provides query and visualization tools for these genetic variants, MolQTL information, 
            and correlations between variations and clinical traits,
            aiming to support researchers with a comprehensive resource for functional 
            interpretation of complex genetic variations and advancing genetic research.
          </p>
          
          <q-card flat class="col-11 col-md q-my-none q-py-none" style="border: 1px solid white;">
            <q-card-section
              class="col-md text-body1 text-foreground text-justify q-py-none" style="padding-left: 0; margin-left: 0;"
            >
              <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0;color: #f57c20; background-color: white;"
                >In CV-QTLdb, we provide:
              </span>
              <br />
              <ul class="no-margin q-pl-lg q-py-xs custom-bullet-list">
                <li class="q-pa-xs">
                  Comprehensive data for four types of genetic variants including SNVs, InDels, MNVs, and SVs;
                </li>
                <li class="q-pa-xs">
                  Association analysis between molecular QTLs (eQTL, apaQTL, sQTL, meQTL) and genetic variants;
                </li>
                <li class="q-pa-xs">
                  GWAS associations for 162+ clinical traits across different variant types;
                </li>
                <li class="q-pa-xs">
                  Correlations between QTLs and clinical traits for functional interpretation;
                </li>
              </ul>
            </q-card-section>
          </q-card>
          
          <q-card flat class="col-11 col-md q-py-none" style="border: 1px solid white; padding-left: 0; margin-left: 0; text-align: left;">
            <q-card-section
              class="col-md text-body1 text-foreground text-justify q-py-none" 
              style="border: 1px solid white; padding-left: 0; margin-left: 0; text-align: left;"
            >
              <span class="text-bold rounded-borders q-px-xs" style="padding-left: 0; margin-left: 0;color: #f57c20; background-color: white;"
                >In CV-QTLdb, users can:
              </span>
              <br />
              <ul class="no-margin q-pl-lg q-py-xs checkmark-list">
                <li class="q-pa-xs">
                  Query and browse four types of complex variants (SNPs, InDels, MNVs, and SVs).
                </li>
                <li class="q-pa-xs">
                  Explore associations between molecular QTLs (eQTL, sQTL, apaQTL, meQTL) and complex variants.
                </li>
                <li class="q-pa-xs">
                  Search GWAS associations for 162+ clinical traits across all variant types to identify disease-related genetic variants.
                </li>
                <li class="q-pa-xs">
                  Analyze correlations between QTLs and clinical traits.
                </li>
              </ul>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </div>

    
    <!-- Data Summary 卡片 - 包含变异类型统计 -->
    <div class="row justify-center q-my-none" style="width: 1140px; margin: 3px auto 0 auto;">
      <q-card flat class="col-12 q-my-xs" style="border: 1px solid gainsboro;">
        <div
          class="q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 20px;line-height: 1.3;"
        >
          Data Summary
        </div>
        <q-card-section class="q-pa-md">
          <div
            ref="featureRowRef"
            class="row justify-around text-indigo-8 full-height relative-position"
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
                {{ animatedStats[i] }}
              </div>
              <div class="text-h6 text-bold" :class="`text-${stat.color}`">
                {{ stat.title }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Data Visualization 区域 - 与 Welcome 框样式一致 -->
    <div class="row justify-center q-my-none" style="width: 1140px; margin: 3px auto 0 auto;">
      <q-card flat class="col-12 q-my-xs" style="border: 1px solid gainsboro;">
        <div
          class="q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 20px;line-height: 1.3;"
        >
          Data Visualization
        </div>
        <q-card-section class="q-pa-none">
          <!-- 第一排:数据统计图表区域 - QTL相关 - 添加点击跳转功能 -->
          <div class="chart-display-area">
            <div class="row justify-center">
              <q-card
                v-for="(phenotype, pIndex) in phenotypes"
                :key="phenotype"
                class="chart-card clickable-card"
                style="width: 227px; flex: 0 0 auto;"
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
          <!-- 第二排:变异类型图表区域 - SNV, MNV, SV, InDel, Correlation - 添加点击跳转功能 -->
          <div class="chart-display-area">
            <div class="row justify-center">
              <q-card
                v-for="(variantType, vIndex) in variantTypes"
                :key="variantType"
                class="chart-card clickable-card"
                style="width: 227px; flex: 0 0 auto;"
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
    <div style="height: 60px;"></div>

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

// 第一排:QTL相关的表型
const phenotypes = ['SNV', 'MNV', 'SV', 'InDel', 'Clinic traits']
// 第二排:变异类型
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

<style scoped>
.checkmark-list {
  list-style: none;
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
/* 图表卡片特定样式 */
.chart-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(200, 200, 200, 0.3);
  height: 250px; /* 固定卡片高度 */
  overflow: hidden; /* 防止内容溢出 */
  margin: 0 !important; /* 移除所有外边距 */
}

/* 去掉跳动效果 */
.chart-card:hover {
  transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 可点击卡片的额外样式 */
.clickable-card {
  cursor: pointer;
}

.clickable-card:hover {
  transform: none;
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.3);
  border-color: rgba(25, 118, 210, 0.5);
}

.clickable-card:active {
  transform: none;
  box-shadow: 0 3px 8px rgba(25, 118, 210, 0.4);
}

.custom-bullet-list li::marker {
  content: "⇪"; /* 保留小圆点 */
  color: #f57c20; /* 修改颜色为#c2456b */
  font-size: 1.5em;
}
.clickable-card:hover {
  transform: none;
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.3);
  border-color: rgba(25, 118, 210, 0.5);
}

.clickable-card:active {
  transform: none;
  box-shadow: 0 3px 8px rgba(25, 118, 210, 0.4);
}

/* 带标题的卡片section - 使用flex布局 */
.chart-card-section-with-title {
  padding: 8px !important;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 图片容器样式 - 占据剩余空间 */
.image-container-with-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0px;
  min-height: 0; /* 重要:允许flex item缩小 */
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

/* 卡片底部标题样式 */
.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1976d2;
  text-align: center;
  padding: 0px 2px 0px 2px;
  background: rgba(255, 255, 255, 0.9);
  border-top: 1px solid #ffffff;
  flex-shrink: 0; /* 防止标题被压缩 */
}

/* 图表行样式 - 框之间无间距 */
.chart-row {
  gap: 0;
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

.relative-position {
  position: relative;
}

/* 变异统计卡片样式 */
.stat-block {
  border-radius: 12px;
}

.stat-block:hover {
  box-shadow: 0 0 12px rgba(100, 100, 200, 0.4);
}

/* 图表显示区域 */
.chart-display-area {
  min-height: 200px;
}

/* 通用卡片样式 */
.q-card:not(.chart-card) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(200, 200, 200, 0.3);
  transition: transform 0.2s ease;
}

.q-card:not(.chart-card):hover {
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.15);
}
</style>
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

    <!-- Data Visualization 区域 - 与 Welcome 框样式一致 -->
    <div class="row justify-center q-my-none" style="width: 1140px; margin: 20px auto 0 auto;">
      <q-card flat class="col-12 q-my-xs" style="border: 1px solid gainsboro;">
        <div
          class="q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 20px;line-height: 1.3;"
        >
          Data Visualization
        </div>
        <q-card-section class="q-pa-none">
          <!-- 第一排：数据统计图表区域 - QTL相关 -->
          <div class="chart-display-area">
            <div class="row justify-center">
              <q-card
                v-for="(phenotype, pIndex) in phenotypes"
                :key="phenotype"
                class="chart-card"
                style="width: 227px; flex: 0 0 auto;"
                flat
                bordered
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

          <!-- 第二排：变异类型图表区域 - SNP, MNV, SV, InDel, Correlation -->
          <div class="chart-display-area">
            <div class="row justify-center">
              <q-card
                v-for="(variantType, vIndex) in variantTypes"
                :key="variantType"
                class="chart-card"
                style="width: 227px; flex: 0 0 auto;"
                flat
                bordered
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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
// 导入所有phenotype对应的图片
import expressionImage from '~/assets/eQTL.svg'
import splicingImage from '~/assets/sQTL.svg'
import apaImage from '~/assets/apaQTL.svg'
import methylationImage from '~/assets/meQTL.svg'
import clinicImage from '~/assets/gwasQTL.svg'
import SNPImage from '~/assets/SNP.svg'
import MNVImage from '~/assets/MNV.svg'
import SVImage from '~/assets/SV.svg'
import InDelImage from '~/assets/InDel.svg'
import CorrelationImage from '~/assets/Correlation.svg'

const $q = useQuasar()

const statRefs = ref<HTMLElement[]>([])
const featureRowRef = ref<HTMLElement>()

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

// 第一排：QTL相关的表型
const phenotypes = ['Expression', 'Splicing', 'APA', 'Methylation', 'Clinic traits']

// 第二排：变异类型
const variantTypes = ['SNP', 'MNV', 'SV', 'InDel', 'Correlation']

// 根据phenotype返回对应的图片（第一排）
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

// 根据变异类型返回对应的图片（第二排）
// 暂时使用第一排的图片，后续可以替换
const getVariantTypeImage = (variantType: string) => {
  const imageMap = {
    'SNP': SNPImage,      // 临时使用，后续替换
    'MNV': MNVImage,         // 临时使用，后续替换
    'SV': SVImage,               // 临时使用，后续替换
    'InDel': InDelImage,    // 临时使用，后续替换
    'Correlation': CorrelationImage,   // 临时使用，后续替换
  }
  return imageMap[variantType as keyof typeof imageMap]
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
  margin: 0 !important; /* 移除所有外边距 */
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  min-height: 0; /* 重要：允许flex item缩小 */
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
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.15);
}
</style>
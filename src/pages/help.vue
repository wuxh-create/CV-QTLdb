<template>
  <q-page style="min-height: calc(100vh - 125px);margin: 5px auto 0 auto;" class="q-pa-md">
  <div
      class="row"
      :class="{
        'bg-indigo-10': $q.dark.isActive,
        'bg-white text-indigo-8': !$q.dark.isActive,
      }"
      style="padding: 0 calc((100vw - 1180px) / 2)"
    >
    <div class="col-11 col-sm-12 q-px-md">
      <!-- 1. About dbQTLVar -->
      <q-card class="col-12 q-mt-sm">
        <div
          class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 20px;line-height: 1.3;"
        >
          About CV-QTLdb
        </div>
        <div class="row q-pa-md q-my-xs text-body1 text-justify">
          <div class="col-12">
            <p style="font-size: 18px;line-height: 1.5;">
              CV-QTLdb is a specialized database that systematically integrates genetic variation data with molecular quantitative trait loci (MolQTL) information derived from a cohort of 148 Chinese individuals. This resource captures complex associations across multiple biological layers, including:
            </p>
            <ul class="custom-list">
              <li><span class="text-bold text-primary" style="font-size: 18px;line-height: 1;">Genetic variants</span>: four types of genomic variations (SNVs, MNVs, InDels, and SVs)</li>
              <li><span class="text-bold text-primary" style="font-size: 18px;line-height: 1;">Molecular phenotypes</span>: four types of molecular phenotypes (Gene expression, Alternative polyadenylation, Alternative splicing, DNA methylation)</li>
              <li><span class="text-bold text-primary" style="font-size: 18px;line-height: 1;">Clinical data</span>: six types of comprehensive health indicators (Pathology, Nutrition, Toxin, Measurement, Hormone, Questionnaire)</li>
            </ul>
          </div>  
        </div>
      </q-card>
      <!-- 2. Analysis pipeline -->
      <q-card class="col-12 q-mt-md" >
        <div
          class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 20px;line-height: 1.3;"
        >
          Analysis pipeline
        </div>
        <div class="row q-pa-md q-my-xs text-body text-justify">
          <div class="col-12">
            <p style="font-size: 18px;line-height: 1.5;">
              The research workflow is illustrated in <span class="text-bold text-primary">Figure 1</span>, which consists of four main components: data acquisition, ​variant identification, ​molecular phenotype characterization, and ​QTL analysis.
            </p>
            <div class="row justify-around">
              <div class="col-12 q-mt-sm q-mb-md text-body1 text-center" style="max-height: 390px;">
                <img
                  src="~assets/pipeline.png"
                  style="width: 100%; max-width: 1140px; object-fit: contain;"
                />
                <div class="col-12 text-center text-body2 text-primary text-bold">
                  Figure 1: Workflow for data processing of CV-QTLdb
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>
      <!-- 3. user guide -->
      <q-card class="col-12 q-mt-md" >
        <div
          class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 20px;line-height: 1.3;"
        >
          Functional Overview of CV-QTLdb
        </div>
        <div class="row q-pa-md q-my-xs text-body1 text-justify">
          <div class="col-12">
            <p style="font-size: 18px;line-height: 1.5;">
              The CV-QTLdb website is organized into three core functional modules: <span class="text-bold text-primary">data retrieval</span>, <span class="text-bold text-primary">data visualization</span>, and <span class="text-bold text-primary">data downloading</span>. Below is a detailed introduction to each feature:
            </p>
            <div
              class="q-pa-sm text-h6 text-bold text-black"
            >
              1. ​Data Retrieval
            </div>
            <div class="row justify-around">
              <div class="col-12 q-mt-sm q-mb-md text-body1 text-center" style="height: 350px;">
                <img
                  class="col-12 q-mx-auto"
                  src="~assets/query.png"
                  style="height: 90%; width: 90%; object-fit: contain;"
                />
                <div class="col-12 text-center text-body2 text-primary text-bold">
                  Figure 2: ​Data retrievaling in different modules of CV-QTLdb
                </div>
              </div>
            </div>
            <div
              class="q-pa-sm text-h6 text-bold text-black"
            >
              2. ​Data Visualization
            </div>
            <div class="row justify-around">
              <div class="col-12 q-mt-sm q-mb-md text-body1 text-center" style="height: 350px;">
                <img
                  class="col-12 q-mx-auto"
                  src="~assets/plot.png"
                  style="height: 90%; width: 90%; object-fit: contain;"
                />
                <div class="col-12 text-center text-body2 text-primary text-bold">
                  Figure 3: ​Data visualization in different modules of CV-QTLdb
                </div>
              </div>
            </div>
            <div
              class="q-pa-sm text-h6 text-bold text-black"
            >
              3. Data Downloading
            </div>
            <div class="row justify-around">
            <div class="col-12 q-mt-sm q-mb-md text-body1 text-center" style="height: 350px;">
                <img
                  class="col-12 q-mx-auto"
                  src="~assets/download.png"
                  style="height: 90%; width: 90%; object-fit: contain;"
                />
                <div class="col-12 text-center text-body2 text-primary text-bold">
                  Figure 4: ​Data Downloading in CV-QTLdb
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>
      <!-- 4. Contact -->
      <q-card class="col-12 q-mt-md">
        <div
          class="full-width q-px-md q-py-sm text-subtitle2 text-primary text-bold"
          style="background-color: #e3f2fd;font-size: 20px;line-height: 1.3;"
        >
          Contact
        </div>
        
        <div class="row justify-evenly q-pa-md">
          <q-card flat bordered class="col-12 col-sm-6 col-md-5 q-pa-sm">
            <div class="text-center text-bold text-h6">
              Gong, Jing
              <div>
                <q-badge class="q-mx-xs" align="middle" color="green-5">Ph.D</q-badge>
                <q-badge class="q-mx-xs" align="middle" color="orange-5">Professor</q-badge>
              </div>
            </div>
            <q-separator class="q-my-sm"/>
            <div class="row no-wrap q-px-sm">
              <q-icon name="email" size="sm" class="col-1"/>
              <canvas id="email1" width="320" height="25" style="margin: auto 0;"></canvas>
            </div>
            <div class="row no-wrap q-px-sm">
              <q-icon name="badge" size="sm" class="col-1"/>
              <a href="http://encoi.hzau.edu.cn/" target="_blank">College of Informatics</a>
            </div>
            <div class="row no-wrap q-px-sm">
              <q-icon name="school" size="sm" class="col-1"/>
              <a href="http://encoi.hzau.edu.cn/" target="_blank">Huazhong Agricultural University, Wuhan, China</a>
            </div>
          </q-card>

          <q-card flat bordered class="col-12 col-sm-6 col-md-5 q-pa-sm">
            <div class="text-center text-bold text-h6">
              Wang Dongyang
              <div>
                <q-badge class="q-mx-xs" align="middle" color="green-5">Ph.D candidate</q-badge>
              </div>
            </div>
            <q-separator class="q-my-sm"/>
            <div class="row no-wrap q-px-sm">
              <q-icon name="email" size="sm" class="col-1"/>
              <canvas id="email3" width="360" height="25" style="margin: auto 0;"></canvas>
            </div>
            <div class="row no-wrap q-px-sm">
              <q-icon name="badge" size="sm" class="col-1"/>
              <a href="http://encoi.hzau.edu.cn/" target="_blank">College of Informatics</a>
            </div>
            <div class="row no-wrap q-px-sm">
              <q-icon name="school" size="sm" class="col-1"/>
              <a href="http://encoi.hzau.edu.cn/" target="_blank">Huazhong Agricultural University, Wuhan, China</a>
            </div>
          </q-card>
        </div>

        <!-- 第二行：2个卡片左右排列 -->
        <div class="row justify-evenly q-px-md q-pb-md">
          <q-card flat bordered class="col-12 col-sm-6 col-md-5 q-pa-sm">
            <div class="text-center text-bold text-h6">
              Wu, Xiaohong
              <div>
                <q-badge class="q-mx-xs" align="middle" color="green-5">Ph.D candidate</q-badge>
              </div>
            </div>
            <q-separator class="q-my-sm"/>
            <div class="row no-wrap q-px-sm">
              <q-icon name="email" size="sm" class="col-1"/>
              <canvas id="email2" width="360" height="25" style="margin: auto 0;"></canvas>
            </div>
            <div class="row no-wrap q-px-sm">
              <q-icon name="badge" size="sm" class="col-1"/>
              <a href="http://encoi.hzau.edu.cn/" target="_blank">College of Informatics</a>
            </div>
            <div class="row no-wrap q-px-sm">
              <q-icon name="school" size="sm" class="col-1"/>
              <a href="http://encoi.hzau.edu.cn/" target="_blank">Huazhong Agricultural University, Wuhan, China</a>
            </div>
          </q-card>

          <q-card flat bordered class="col-12 col-sm-6 col-md-5 q-pa-sm">
            <div class="text-center text-bold text-h6">
              Wu, Tian
              <div>
                <q-badge class="q-mx-xs" align="middle" color="green-5">M.S. candidate</q-badge>
              </div>
            </div>
            <q-separator class="q-my-sm"/>
            <div class="row no-wrap q-px-sm">
              <q-icon name="email" size="sm" class="col-1"/>
              <canvas id="email4" width="320" height="25" style="margin: auto 0;"></canvas>
            </div>
            <div class="row no-wrap q-px-sm">
              <q-icon name="badge" size="sm" class="col-1"/>
              <a href="http://encoi.hzau.edu.cn/" target="_blank">College of Informatics</a>
            </div>
            <div class="row no-wrap q-px-sm">
              <q-icon name="school" size="sm" class="col-1"/>
              <a href="http://encoi.hzau.edu.cn/" target="_blank">Huazhong Agricultural University, Wuhan, China</a>
            </div>
          </q-card>
        </div>
      </q-card>

    </div>
  </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'

// 绘制邮箱地址到 canvas
const drawEmail = (canvasId, emailText) => {
  const canvas = document.getElementById(canvasId)
  if (canvas) {
    const context = canvas.getContext('2d')
    context.font = '16px Arial'
    context.fillStyle = '#000'
    context.fillText(emailText, 5, 18)
  }
}

// 组件挂载后绘制所有邮箱
onMounted(() => {
  drawEmail('email1', 'gong.jing@mail.hzau.edu.cn')
  drawEmail('email2', 'wu.xiaohong@webmail.hzau.edu.cn')
  drawEmail('email3', 'wangdongyang@webmail.hzau.edu.cn')
  drawEmail('email4', 'wu.tian@webmail.hzau.edu.cn')
})
</script>

<style scoped lang="scss">
.custom-header {
  background-color: #e3f2fd;
  color: #1565c0;
}

// 自定义列表样式
.custom-list {
  list-style: none;
  padding-left: 0;
  text-align: left;
  top: 2px;

  
  li {
    position: relative;
    padding-left: 30px;
    margin-bottom: 12px;
    text-align: left;
    line-height: 1.6;
    
    &::before {
      content: "●";
      position: absolute;
      left: 10px;
      color: #1976d2;
      font-size: 20px; // 调整图标大小
      line-height: 1;
    }
  }
}

canvas {
  display: inline-block;
  vertical-align: middle;
}

a,
a:link,
a:visited,
a:active {
  text-decoration: none;
  color: var(--q-foreground);
}

a:hover {
  text-decoration: underline;
  color: var(--q-primary);
}

.q-table th {
  font-size: unset;
  font-weight: unset;
}
</style>

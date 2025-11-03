// // https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   app: {
//     baseURL: '/CV-QTLdb/',
//     head: {
//       title: 'CV-QTLdb',
//       htmlAttrs: {
//         lang: 'en',
//       },
//       meta: [
//         { name: 'viewport', content: 'width=device-width, initial-scale=1' },
//         { charset: 'utf-8' },
//         { name: 'description', content: 'A database for Variant-Phenotype associations data' },
//         { name: "keyword", content: "QTL" }
//       ],
//       link: [
//         { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
//       ],
//     },
//     pageTransition: { name: 'fade', mode: 'out-in', duration: 300 },
//   },
//   devServer: {
//     port: 4000,
//   },
//   devtools: {
//     enabled: false,
//   },
//   modules: ["nuxt-quasar-ui", 'nuxt-mongoose', 'nuxt-echarts'],
//   quasar: {
//     sassVariables: 'assets/custom.scss',
//     quietSassWarnings: true,
//     lang: "zh-CN",
//     plugins: ["Dialog", "Loading", "Notify"],
//     config: {},
//     extras: {
//       animations: [],
//       fontIcons: ['line-awesome'],
//     },
//   },
//   mongoose: {
//     // uri: "mongodb://dbQTLVar_admin:CCZPFy*dW3Pw@mongodb:27017/dbQTLVar",
//     uri: process.env.NODE_ENV === 'production' 
//       ? "mongodb://dbQTLVar_admin:CCZPFy*dW3Pw@mongodb:27017/dbQTLVar"
//       : "mongodb://dbQTLVar_admin:CCZPFy*dW3Pw@localhost:30000/dbQTLVar",
//     options: {},
//     modelsDir: 'models',
//     devtools: false,
//   },
//   echarts: {
//     renderer: 'svg',
//     charts: ['BoxplotChart', 'ScatterChart'],
//     components: [
//       'DatasetComponent',
//       'TooltipComponent',
//       'ToolboxComponent',
//       'TitleComponent',
//       'LegendComponent',
//       'GridComponent',
//     ],
//   },
//   compatibilityDate: "2024-07-24",
// })


// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    baseURL: '/CV-QTLdb/',
    head: {
      title: 'CV-QTLdb',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'description', content: 'A database for Variant-Phenotype associations data' },
        { name: "keyword", content: "QTL" }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/CV-QTLdb/favicon.ico' },
      ],
      // style 应该在这里，head 里面
      style: [
        {
          children: `.nuxt-loading-indicator { display: none !important; opacity: 0 !important; visibility: hidden !important; height: 0 !important; }`,
          type: 'text/css'
        }
      ],
    },
    // 完全禁用过渡效果和加载条
    pageTransition: false,
    layoutTransition: false,
  },
  
  // 完全禁用 Nuxt 的 loading indicator
  loadingIndicator: false,
  
  devServer: {
    port: 4000,
  },
  devtools: {
    enabled: false,
  },
  modules: ["nuxt-quasar-ui", 'nuxt-mongoose', 'nuxt-echarts'],
  quasar: {
    sassVariables: 'assets/custom.scss',
    quietSassWarnings: true,
    lang: "zh-CN",
    plugins: ["Dialog", "Loading", "Notify"],
    config: {
      // 完全禁用 Quasar LoadingBar
      loadingBar: false,
    },
    extras: {
      animations: [],
      fontIcons: ['line-awesome'],
    },
  },
  mongoose: {
    uri: process.env.NODE_ENV === 'production' 
      ? "mongodb://dbQTLVar_admin:CCZPFy*dW3Pw@mongodb:27017/dbQTLVar"
      : "mongodb://dbQTLVar_admin:CCZPFy*dW3Pw@localhost:30000/dbQTLVar",
    options: {},
    modelsDir: 'models',
    devtools: false,
  },
  echarts: {
    renderer: 'svg',
    charts: ['BoxplotChart', 'ScatterChart'],
    components: [
      'DatasetComponent',
      'TooltipComponent',
      'ToolboxComponent',
      'TitleComponent',
      'LegendComponent',
      'GridComponent',
    ],
  },
  compatibilityDate: "2024-07-24",
})
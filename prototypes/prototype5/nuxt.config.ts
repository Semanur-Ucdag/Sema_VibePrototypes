export default defineNuxtConfig({
  extends: ['../shared'],

  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt'
  ],

  devServer: { port: 3005 },

  css: ['~/../../app/assets/css/main.css']
})

export default defineNuxtConfig({
  extends: ['../shared'],

  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt'
  ],

  devServer: { port: 3004 },

  css: ['~/../../app/assets/css/main.css']
})

export default defineNuxtConfig({
  extends: ['../shared'],

  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt'
  ],

  css: ['~/../../app/assets/css/main.css']
})

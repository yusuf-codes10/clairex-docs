import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/ui'],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  vite: {
    plugins: [tailwindcss()]
  },
  css: ['~/assets/css/main.css']
})

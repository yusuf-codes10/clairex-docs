<<<<<<< HEAD
// https://nuxt.com/docs/api/configuration/nuxt-config
=======
import tailwindcss from '@tailwindcss/vite'
>>>>>>> 7c0c25d (fixing stuff)

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/ui'],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
<<<<<<< HEAD
=======
  vite: {
    plugins: [tailwindcss()]
  },
>>>>>>> 7c0c25d (fixing stuff)
  css: ['~/assets/css/main.css']
})

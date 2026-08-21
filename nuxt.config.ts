import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@nuxt/content", "@nuxt/ui"],
  devtools: { enabled: true },
  compatibilityDate: "2024-04-03",
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      title: "ClaireX",
      titleTemplate: "%s · ClaireX",
      link: [{ rel: "icon", type: "image/png", href: "/images/favicon.png" }],
      meta: [
        {
          name: "description",
          content: "A class-based, explicitly-typed web framework for Bun.",
        },
      ],
    },
  },
});

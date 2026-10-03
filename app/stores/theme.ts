import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  // nuxt server renderer does not have localSorae
  const dark = ref(import.meta.client && localStorage.getItem("theme") === "dark");

  const toggleTheme = () => {
    dark.value = !dark.value;
  };

  watch(
    dark,
    (isDark) => {
      if (!import.meta.client) return;
      document.documentElement.classList.toggle("dark", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    },
    { immediate: true },
  );

  return { dark, toggleTheme };
});
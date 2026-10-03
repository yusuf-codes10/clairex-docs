import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
    const dark = ref(localStorage.getItem("theme") === "dark");

  const toggleTheme = () => {
    dark.value = !dark.value;
  };

  // a watch for the state
  // single place that touches the DOM — runs on load and on every change
  watch(
    dark,
    (isDark) => {
      document.documentElement.classList.toggle("dark", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    },
    { immediate: true },
  );

  return {
    dark,
    toggleTheme,
  };
});

import { defineNuxtPlugin } from '#app'
import { useThemeStore } from "../stores/theme";

export default defineNuxtPlugin(() => {
  useThemeStore();
})
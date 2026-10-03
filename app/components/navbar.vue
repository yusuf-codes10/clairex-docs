<script setup lang="ts">
import { useThemeStore } from '#imports';

const themeStore = useThemeStore();
</script>

<template>
  <nav
    class="sticky top-0 flex justify-between items-center py-3 px-6 w-full border-b border-border bg-background"
  >
    <NuxtLink :to="'/'">
      <logo width="120" />
    </NuxtLink>
    <!-- <ul class="inline-flex gap-6 text-sm font-medium text-muted-foreground">
      <li class="hover:text-primary cursor-pointer transition-colors">Docs</li>
      <li class="hover:text-primary cursor-pointer transition-colors">Test</li>
      <li class="hover:text-primary cursor-pointer transition-colors">More</li>
    </ul> -->

    <div class="flex gap-2">

      <button
        aria-label="Toggle theme"
        class="cursor-pointer text-muted-foreground hover:text-primary transition-colors"
        @click="themeStore.toggleTheme()"
      >
        <!-- shown in light mode -->
        <Icon name="lucide:moon" size="22" class="block dark:hidden" />
        <!-- shown in dark mode -->
        <Icon name="lucide:sun" size="22" class="hidden dark:block" />
      </button>
  
      <a href="https://github.com/yusuf-codes10/clairex-core" target="_blank">
        <Icon
          name="lucide:github"
          size="22"
          class="cursor-pointer text-muted-foreground hover:text-primary transition-colors"
        />
      </a>
    </div>
  </nav>
</template>

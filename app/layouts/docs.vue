<script setup lang="ts">
import { ref } from "vue";

const open = ref<boolean>(false);
</script>

<template>
  <div class="flex min-h-screen bg-background">
    <!-- Backdrop, mobile only -->
    <Transition
      enter-from-class="opacity-0"
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
        @click="open = false"
      />
    </Transition>

    <Sidebar v-model:open="open" />

    <!-- min-w-0 stops wide code blocks forcing the whole page to scroll sideways -->
    <main class="min-w-0 flex-1">
      <div
        class="sticky top-13.25 z-20 border-b border-border bg-background px-4 py-2 lg:hidden"
      >
        <button
          class="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          aria-label="Open navigation"
          @click="open = true"
        >
          <Icon name="lucide:menu" size="18" />
          Menu
        </button>
      </div>

      <slot />
    </main>
  </div>
</template>

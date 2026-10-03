<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from 'vue-router';

type SidebarSection = {
  title: string;
  children: { label: string; path: string }[];
};

const sections: SidebarSection[] = [
  {
    title: "Getting Started",
    children: [
      { label: "Introduction",     path: "/docs/getting-started/introduction" },
      { label: "Installation",     path: "/docs/getting-started/installation" },
      { label: "Your First API",   path: "/docs/getting-started/first-api" },
      { label: "Project Structure",path: "/docs/getting-started/project-structure" },
    ],
  },
];


const openSections = ref<Record<number, boolean>>({ 0: true, 1: true });

function toggle(index: number): void {
  openSections.value[index] = !openSections.value[index];
}

// Mobile drawer state — owned by the docs layout via v-model:open
const open = defineModel<boolean>("open", { default: false });

// Close the drawer on navigation, otherwise it covers the page you just opened
const route = useRoute();
watch(
  () => route.path,
  (): void => {
    open.value = false;
  },
);
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] overflow-y-auto border-r border-border bg-background px-4 py-6 transition-transform duration-200 ease-out lg:sticky lg:inset-y-auto lg:top-13.25 lg:z-auto lg:h-[calc(100vh-3.3125rem)] lg:w-64 lg:max-w-none lg:shrink-0 lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <!-- Drawer header, mobile only -->
    <div class="mb-4 flex items-center justify-between lg:hidden">
      <span class="px-3 text-sm font-semibold text-foreground">Documentation</span>
      <button
        class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
        aria-label="Close navigation"
        @click="open = false"
      >
        <Icon name="lucide:x" size="18" />
      </button>
    </div>

    <nav>
      <ul class="flex flex-col gap-1">
        <li v-for="(section, index) in sections" :key="section.title">
          <!-- Section header -->
          <button
            @click="toggle(index)"
            class="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-accent transition-colors"
          >
            {{ section.title }}
            <Icon
              name="lucide:chevron-right"
              size="16"
              class="transition-transform duration-200 text-muted-foreground"
              :class="{ 'rotate-90': openSections[index] }"
            />
          </button>

          <!-- Children -->
          <ul
            v-show="openSections[index]"
            class="ml-3 mt-1 flex flex-col gap-0.5 border-l border-border pl-3"
          >
            <li v-for="child in section.children" :key="child.path">
              <NuxtLink
                :to="child.path"
                class="block px-3 py-1.5 text-sm text-muted-foreground rounded-md hover:text-primary hover:bg-accent transition-colors"
                active-class="text-primary bg-accent font-medium"
              >
                {{ child.label }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

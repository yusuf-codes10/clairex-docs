<script setup lang="ts">
import { ref } from "vue";

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
  {
    title: "Guides",
    children: [
      { label: "Defining Routes",      path: "/docs/guides/routes" },
      { label: "Reading Requests",     path: "/docs/guides/requests" },
      { label: "Sending Responses",    path: "/docs/guides/responses" },
      { label: "Validating Input",     path: "/docs/guides/validation" },
      { label: "Partial Updates",      path: "/docs/guides/partial-updates" },
      { label: "Writing Middleware",   path: "/docs/guides/middleware" },
      { label: "Protecting Routes",    path: "/docs/guides/auth" },
      { label: "Handling Errors",      path: "/docs/guides/errors" },
      { label: "Enabling CORS",        path: "/docs/guides/cors" },
    ],
  },
  {
    title: ".claire Files",
    children: [
      { label: "Overview",      path: "/docs/claire-files/overview" },
      { label: "Rules",         path: "/docs/claire-files/rules" },
      { label: "Editor Setup",  path: "/docs/claire-files/editor-setup" },
    ],
  },
  {
    title: "Concepts",
    children: [
      { label: "Architecture",              path: "/docs/concepts/architecture" },
      { label: "ClaireKey: Five Roles",     path: "/docs/concepts/claire-key" },
      { label: "The Middleware Onion",      path: "/docs/concepts/middleware-onion" },
      { label: "Why Explicit Types",        path: "/docs/concepts/explicit-types" },
    ],
  },
  {
    title: "API Reference",
    children: [
      { label: "ClaireX",           path: "/docs/api/clairex" },
      { label: "ClaireKey",         path: "/docs/api/claire-key" },
      { label: "ClaireContext",     path: "/docs/api/claire-context" },
      { label: "ClaireRequest",     path: "/docs/api/claire-request" },
      { label: "ClaireResponse",    path: "/docs/api/claire-response" },
      { label: "ClaireMiddleware",  path: "/docs/api/claire-middleware" },
      { label: "ClaireValidator",   path: "/docs/api/claire-validator" },
      { label: "ClaireException",   path: "/docs/api/claire-exception" },
      { label: "ClaireUtil",        path: "/docs/api/claire-util" },
      { label: "Built-in Middleware", path: "/docs/api/built-in-middleware" },
      { label: "Types",             path: "/docs/api/types" },
    ],
  },
];


const openSections = ref<Record<number, boolean>>({ 0: true, 1: true });

function toggle(index: number): void {
  openSections.value[index] = !openSections.value[index];
}
</script>

<template>
  <aside
    class="w-64 h-screen sticky top-13.25 overflow-y-auto border-r border-border bg-background py-6 px-4"
  >
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

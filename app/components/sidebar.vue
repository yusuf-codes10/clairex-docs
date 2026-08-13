<script setup lang="ts">
import { ref } from 'vue'

type SidebarSection = {
  title: string
  children: { label: string; path: string }[]
}

const sections: SidebarSection[] = [
  {
    title: 'Getting Started',
    children: [
      { label: 'Introduction', path: '/docs/getting-started/introduction' },
      { label: 'Installation', path: '/docs/getting-started/installation' },
      { label: 'Quick Start', path: '/docs/getting-started/quick-start' },
    ],
  },
  {
    title: 'Core',
    children: [
      { label: 'ClaireX', path: '/docs/core/clairex' },
      { label: 'Routing', path: '/docs/core/routing' },
      { label: 'Context', path: '/docs/core/context' },
      { label: 'Request', path: '/docs/core/request' },
      { label: 'Response', path: '/docs/core/response' },
    ],
  },
  {
    title: 'Controllers',
    children: [
      { label: 'Overview', path: '/docs/controllers/overview' },
      { label: 'Route Registration', path: '/docs/controllers/route-registration' },
      { label: 'Scoped Middleware', path: '/docs/controllers/scoped-middleware' },
    ],
  },
  {
    title: 'Middleware',
    children: [
      { label: 'Overview', path: '/docs/middleware/overview' },
      { label: 'Before & After', path: '/docs/middleware/before-after' },
      { label: 'Short-Circuiting', path: '/docs/middleware/short-circuiting' },
      { label: 'ClaireLogger', path: '/docs/middleware/claire-logger' },
    ],
  },
  {
    title: 'Exceptions',
    children: [
      { label: 'ClaireException', path: '/docs/exceptions/claire-exception' },
      { label: 'Error Handling', path: '/docs/exceptions/error-handling' },
    ],
  },
  {
    title: 'API Reference',
    children: [
      { label: 'ClaireX', path: '/docs/api/clairex' },
      { label: 'ClaireRouter', path: '/docs/api/router' },
      { label: 'ClaireContext', path: '/docs/api/context' },
      { label: 'ClaireRequest', path: '/docs/api/request' },
      { label: 'ClaireResponse', path: '/docs/api/response' },
      { label: 'ClaireMiddleware', path: '/docs/api/middleware' },
      { label: 'ClaireController', path: '/docs/api/controller' },
      { label: 'ClaireException', path: '/docs/api/exception' },
    ],
  },
]

const openSections = ref<Set<number>>(new Set([0]))

function toggle(index: number): void {
  if (openSections.value.has(index)) {
    openSections.value.delete(index)
  } else {
    openSections.value.add(index)
  }
}
</script>

<template>
  <aside class="w-64 h-screen sticky top-0 overflow-y-auto border-r border-border bg-background py-6 px-4">
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
              :class="{ 'rotate-90': openSections.has(index) }"
            />
          </button>

          <!-- Children -->
          <ul v-show="openSections.has(index)" class="ml-3 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
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

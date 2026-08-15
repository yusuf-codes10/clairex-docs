<script setup lang="ts">
type Feature = {
  icon: string
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: '🔑',
    title: 'ClaireKey Architecture',
    description: 'One class per resource. Routes, handlers, and scoped middleware — all self-contained. No fat route files, no scattered controllers. Unlock and go.',
  },
  {
    icon: '🏗️',
    title: 'OOP First',
    description: 'Everything is a class you extend, override, or instantiate. No decorators, no magic strings, no hidden behavior. You see everything, you declare everything.',
  },
  {
    icon: '🛡️',
    title: 'Built-in Validation',
    description: 'No Zod. No Yup. ClaireValidator validates at runtime and gives you typed data. Extend, define rules, attach as middleware. Three steps to type safety.',
  },
  {
    icon: '⚡',
    title: 'Bun-Native & Explicit',
    description: 'Built on Bun.serve. Zero external dependencies. Every type declared — no inference, no any, no guessing. If it compiles, you meant it.',
  },
]
</script>

<template>
  <section class="px-6 py-20 bg-background">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="flex flex-col gap-3 p-6 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors"
      >
        <span class="text-3xl">{{ feature.icon }}</span>
        <h3 class="text-base font-semibold text-foreground">{{ feature.title }}</h3>
        <p class="text-sm text-muted-foreground leading-relaxed">{{ feature.description }}</p>
      </div>
    </div>
  </section>
</template>

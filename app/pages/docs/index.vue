<script setup lang="ts">
definePageMeta({ layout: 'docs' })

const { data: docs } = await useAsyncData(() => queryCollection("docs").all());
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
    <h2 class="font-mono text-xs uppercase tracking-widest mb-6 text-muted-foreground">docs</h2>
    <ArticleCard v-for="doc in docs" :key="doc.id" :doc="doc" />
  </div>
</template>

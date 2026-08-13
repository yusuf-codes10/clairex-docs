<script setup lang="ts">
const { data: docs } = await useAsyncData(() => queryCollection("docs").all());
</script>

<template>
  <div class="flex min-h-screen bg-background">
    <Sidebar />
    <main class="flex-1 px-6 py-12">
      <div class="max-w-2xl mx-auto">
        <h2 class="font-mono text-xs uppercase tracking-widest mb-6 text-muted-foreground">docs</h2>

        <ArticleCard v-for="doc in docs" :key="doc.id" :doc="doc" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">

const {data: docs} = await useAsyncData(() =>
  queryCollection('docs').all()
)
console.log('hey there');
console.log('docs: ', docs.value);
</script>

<template>
  <div class="bg-[#0D0D0D] min-h-screen px-6 py-12 flex flex-col items-center">
    <div class="w-full max-w-2xl">

      <h2 class="font-mono text-xs text-[#C0392B] uppercase tracking-widest mb-6">
        // all articles
      </h2>

      <ArticleCard v-for="doc in docs" :key="doc.id" :doc="doc"/>
    </div>
</template>
<script setup lang="ts">
const { slug } = useRoute().params;

const { data: doc } = await useAsyncData(() =>
  queryCollection("docs").path(`/docs/${slug}`).first(),
);
</script>

<template>
  <div class="bg-[#0D0D0D] min-h-screen px-6 py-12 flex flex-col items-center">
    <div class="w-full max-w-2xl font-mono">
      <ContentRenderer
        :value="doc"
        class="prose prose-invert prose-headings:font-mono prose-headings:text-[#E8E6E1] prose-p:text-[#A0A0A0] prose-p:leading-relaxed prose-code:text-[#C0392B] prose-code:bg-[#1A1A1A] prose-code:px-1 prose-code:rounded"
      />
    </div>
  </div>
</template>

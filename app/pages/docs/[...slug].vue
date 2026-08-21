<script setup lang="ts">
definePageMeta({ layout: 'docs' })

const route = useRoute();
const slug = route.params.slug;
const path = Array.isArray(slug) ? slug.join('/') : slug;

const { data: doc } = await useAsyncData(`doc-${path}`, () =>
  queryCollection("docs").path(`/docs/${path}`).first(),
);
</script>

<template>
  <div class="w-full max-w-3xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
    <ContentRenderer
      v-if="doc"
      :value="doc"
      class="claire-prose"
    />
  </div>
</template>

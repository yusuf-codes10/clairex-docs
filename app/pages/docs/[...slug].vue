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
  <div class="w-full max-w-3xl mx-auto py-12 px-6">
    <ContentRenderer
      v-if="doc"
      :value="doc"
      class="claire-prose"
    />
  </div>
</template>

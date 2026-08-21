<script setup lang="ts">
useHead({
  titleTemplate: (title) =>
    title
      ? `${title} · ClaireX`
      : "ClaireX",
});
</script>

<template>
  <div>
    <Navbar />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

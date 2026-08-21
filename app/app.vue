<script setup lang="ts">
useHead({
  titleTemplate: (title) =>
    title
      ? `${title} · ClaireX`
      : "ClaireX — a class-based, explicitly-typed web framework for Bun",
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

<script setup lang="ts">
</script>

<template>
  <div class="flex items-center justify-between gap-12 px-6 py-20 max-w-6xl mx-auto bg-background">
    <!-- headline -->
    <div class="flex flex-col gap-6 max-w-lg">
      <h1 class="text-5xl font-bold text-foreground leading-tight">
        <span class="text-primary">ClaireX</span><br />
        The class-based web framework for Bun.
      </h1>
      <p class="text-lg text-muted-foreground leading-relaxed">
        Type once. Validate everywhere. No magic — just classes.
      </p>
      <p class="text-sm text-muted-foreground">
        Classes you instantiate. Types you declare. Validation that's built in.
      </p>
      <div class="flex gap-4 mt-2">
        <NuxtLink to="docs/getting-started/introduction" class="px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors">
          Get Started
        </NuxtLink>
        <a href="https://github.com/yusuf-codes10/clairex-core" target="_blank" class="px-5 py-2.5 rounded-md border border-border text-foreground text-sm font-medium hover:bg-accent transition-colors">
          View on GitHub
        </a>
      </div>
    </div>

    <!-- image -->
    <div class="hidden lg:block shrink-0">
      <img src="/images/example.png" alt="ClaireX code example" class="w-120 h-auto rounded-lg shadow-lg border border-border">
    </div>
  </div>
</template>

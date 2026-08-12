<script setup lang="ts">
</script>

<template>
  <nav class="flex justify-between items-center py-3 px-6 w-full border-b border-border bg-background">
    <logo width="120" />
    <ul class="inline-flex gap-6 text-sm font-medium text-muted-foreground">
      <li class="hover:text-primary cursor-pointer transition-colors">Docs</li>
      <li class="hover:text-primary cursor-pointer transition-colors">Test</li>
      <li class="hover:text-primary cursor-pointer transition-colors">More</li>
    </ul>
    <a href="https://github.com/yusuf-codes10/clairex-core" target="_blank">
      <Icon name="lucide:github" size="22" class="cursor-pointer text-muted-foreground hover:text-primary transition-colors"/>
    </a>
  </nav>
</template>

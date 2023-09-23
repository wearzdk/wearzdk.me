<script setup lang="ts">
defineProps<{
  repo: string
  name?: string
}>()
</script>

<template>
  <span ws-nowrap>
    <carbon-logo-github class="inline-block" />
    <a
      class="ml-1 font-mono opacity-70"
      :href="`https://github.com/${repo}`"
      target="_blank"
    >{{ name || (repo.startsWith('wearzdk/') ? repo.slice(6) : repo) }}</a>
  </span>
</template>

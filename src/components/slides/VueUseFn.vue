<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <div class="mt-4 block flex items-center gap2 px-2 py-2 -mx-2">
    <img src="https://vueuse.org/favicon.svg" class="h-1.5rem flex-none !my-0 !w-1.5rem">
    <span class="opacity-75">Avaliable in VueUse: </span><a class="ml-2 font-mono opacity-75 hover:opacity-100" :href="`https://vueuse.org/${name}`">{{ name }}</a>
  </div>
</template>

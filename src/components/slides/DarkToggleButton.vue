<script setup lang="ts">
import { isDark, toggleDark } from '~/logics'
</script>

<template>
  <button
    class="inline-block border-b-2 border-green-900 rounded bg-[#42b883] px-2 pb-1 pt-1.5 text-sm text-white hover:bg-opacity-85 !outline-none"
    @click="toggleDark"
  >
    <div class="flex">
      <div i-ri-sun-line dark:i-ri-moon-line />
      <span class="ml-2 mr-1">{{ isDark ? 'Dark' : 'Light' }}</span>
    </div>
  </button>
</template>

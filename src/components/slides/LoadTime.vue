<script lang='ts' setup>
// 页面加载时间
const loadSpeed = ref(0)
onMounted(() => {
  const mustLoadTime = setInterval(() => {
    const perfEntries = performance.getEntriesByType('navigation')
    const [entry] = perfEntries
    const { duration } = entry
    loadSpeed.value = Math.round(duration)
    if (duration !== 0)
      clearInterval(mustLoadTime)
  }, 10)
})
// 速度颜色
const speedColor = computed(() => {
  const speed = loadSpeed.value
  if (speed < 600)
    return '#00e676'
  if (speed < 1000)
    return '#ffeb3b'
  if (speed < 2000)
    return '#ff9800'
  return '#f44336'
})
</script>

<template>
  <div v-if="loadSpeed">
    <a class="flex items-center lt-md:hidden" :title="$t('loading-speed')" :style="{ color: speedColor }">
      <div class="i-mingcute:flash-fill" />
      <span class="ml-1 text-sm">
        {{ loadSpeed }} ms
      </span>
    </a>
  </div>
</template>

<style lang='scss' scoped>

</style>

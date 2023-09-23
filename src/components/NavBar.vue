<script setup lang="ts">
import LoadTime from './slides/LoadTime.vue'
import { I18nLocate, getLocalePath, getReverseLocale } from '~/logics/i18n'

function toTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
const { y: scroll } = useWindowScroll()
const route = useRoute()
const router = useRouter()
function toggleI18n() {
  I18nLocate.value = getReverseLocale(I18nLocate.value)
  // 检查是否有可用翻译页面
  if (route.meta.frontmatter.autoTranslation)
    autoJump()
}
function autoJump() {
  const newPath = getLocalePath(route.path, I18nLocate.value)

  router.push({
    path: newPath,
  })
}
</script>

<template>
  <header class="header z-40">
    <RouterLink
      class="absolute m-5 h-12 w-12 select-none outline-none xl:fixed"
      to="/"
      focusable="false"
    >
      <Logo />
    </RouterLink>
    <button
      :title="$t('scroll-to-top')"

      fixed bottom-3 right-3 z-100 h-10 w-10 flex items-center justify-center rounded-full transition duration-300 print:hidden hover-bg-hex-8883 hover:op100
      :class="scroll > 300 ? 'op30' : 'op0! pointer-events-none'"
      @click="toTop()"
    >
      <div i-ri-arrow-up-line text-base />
    </button>
    <nav class="nav">
      <div class="spacer" />
      <div class="right" print:op0>
        <!-- 加载时间 -->
        <client-only>
          <LoadTime />
        </client-only>
        <RouterLink to="/posts" title="Blog">
          <span class="lt-md:hidden">{{ $t('blog') }}</span>
          <div i-ri-article-line md:hidden />
        </RouterLink>
        <a href="https://github.com/wearzdk" target="_blank" title="GitHub" class="lt-md:hidden">
          <div i-uil-github-alt />
        </a>
        <a href="/feed.xml" target="_blank" title="RSS" class="lt-md:hidden">
          <div i-la-rss-square style="font-size:1.25rem; margin: 0 -0.125rem;" />
        </a>
        <!-- i18n -->
        <a class="lt-md:hidden" :title="$t('toggle-i18n')" @click="toggleI18n()">
          <div class="i-la:language text-1.25rem" />
        </a>

        <toggle-theme />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header h1 {
  margin-bottom: 0;
}

.logo {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
}

.nav {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav > * {
  margin: auto;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right > * {
  margin: auto;
}
</style>

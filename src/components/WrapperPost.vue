<script setup lang='ts'>
import { formatDate } from '~/logics'
import { I18nLocate, MainLang, getLocalePath } from '~/logics/i18n'

const { frontmatter } = defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const route = useRoute()
const content = ref<HTMLDivElement>()

const base = 'https://wearzdk.me'
const tweetUrl = computed(() => `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Reading @wearzdk7\'s ${base}${route.path}\n\nI think...`)}`)
const elkUrl = computed(() => `https://elk.zone/intent/post?text=${encodeURIComponent(`Reading @programmer_lz@m.webtoo.ls\'s ${base}${route.path}\n\nI think...`)}`)

onMounted(() => {
  const navigate = () => {
    if (location.hash) {
      const el = document.querySelector(decodeURIComponent(location.hash))
      if (el) {
        const rect = el.getBoundingClientRect()
        const y = window.scrollY + rect.top - 40
        window.scrollTo({
          top: y,
          behavior: 'smooth',
        })
        return true
      }
    }
  }

  const handleAnchors = (
    event: MouseEvent & { target: HTMLElement },
  ) => {
    const link = event.target.closest('a')

    if (
      !event.defaultPrevented
      && link
      && event.button === 0
      && link.target !== '_blank'
      && link.rel !== 'external'
      && !link.download
      && !event.metaKey
      && !event.ctrlKey
      && !event.shiftKey
      && !event.altKey
    ) {
      const url = new URL(link.href)
      if (url.origin !== window.location.origin)
        return

      event.preventDefault()
      const { pathname, hash } = url
      if (hash && (!pathname || pathname === location.pathname)) {
        window.history.replaceState({}, '', hash)
        navigate()
      }
      else {
        router.push({ path: pathname, hash })
      }
    }
  }

  useEventListener(window, 'hashchange', navigate)
  useEventListener(content.value!, 'click', handleAnchors, { passive: false })

  setTimeout(() => {
    if (!navigate())
      setTimeout(navigate, 1000)
  }, 1)
})

const lang = computed(() => route.meta.frontmatter.lang || MainLang)

const isCurrentLang = computed(() => lang.value === I18nLocate.value)
const localeAvailable = computed(() => route.meta.frontmatter.autoTranslation ?? false)

const localePath = computed(() => getLocalePath(route.path, I18nLocate.value))

const localeTitle = computed(() => {
  const actRoute = router.resolve({ path: localePath.value })
  return actRoute.meta.frontmatter.display ?? actRoute.meta.frontmatter.title
})
</script>

<template>
  <div
    v-if="frontmatter.display ?? frontmatter.title"
    class="prose m-auto mb-8"
    :class="[frontmatter.wrapperClass]"
  >
    <h1 class="slide-enter-50 mb-0">
      {{ frontmatter.display ?? frontmatter.title }}
    </h1>
    <p
      v-if="frontmatter.date"
      class="slide-enter-50 opacity-50 !-mt-6"
    >
      {{ formatDate(frontmatter.date, false) }} <span v-if="frontmatter.duration">· {{ frontmatter.duration }}</span>
    </p>
    <p
      v-if="frontmatter.subtitle"
      class="slide-enter italic opacity-50 !-mt-6"
    >
      {{ frontmatter.subtitle }}
    </p>
    <p
      v-if="frontmatter.draft"
      class="slide-enter" border="l-3 orange-4" bg-orange-4:10 px4 py2 text-orange-4
    >
      {{ $t('post-draft-tip') }}
    </p>
    <!-- 是否为当前语言 -->
    <div v-if="!isCurrentLang && localeAvailable" class="slide-enter">
      <blockquote>
        <p class="mt-4">
          {{ $t('translation') }}：
          <RouterLink
            :to="{ path: localePath }"
            v-text="localeTitle"
          />
        </p>
      </blockquote>
    </div>
  </div>
  <article ref="content" :class="[frontmatter.tocAlwaysOn ? 'toc-always-on' : '', frontmatter.class]">
    <slot />
  </article>
  <div v-if="route.path !== '/'" class="prose slide-enter m-auto mb-8 mt-8 animate-delay-500 print:hidden">
    <template v-if="frontmatter.duration">
      <span font-mono op50>> </span>
      <span op50>{{ $t('comment-on') }}</span>
      <a :href="elkUrl" target="_blank" op50>mastodon</a>
      <span op25> / </span>
      <a :href="tweetUrl" target="_blank" op50>twitter</a>
    </template>
    <br>
    <span font-mono op50>> </span>
    <RouterLink
      :to="route.path.split('/').slice(0, -1).join('/') || '/'"
      class="font-mono op50 hover:op75"
      v-text="'cd ..'"
    />
  </div>
</template>

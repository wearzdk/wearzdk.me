<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { englishOnly, formatDate } from '~/logics'
import type { Post } from '~/types'

const props = defineProps<{
  type?: string
  posts?: Post[]
  extra?: Post[]
}>()

const { t } = useI18n()

const router = useRouter()
const routes: Post[] = router.getRoutes()
  .filter(i => i.path.startsWith('/posts') && i.meta.frontmatter.date && !i.meta.frontmatter.draft)
  .filter(i => !i.path.endsWith('.html') && (i.meta.frontmatter.type || 'blog').split('+').includes(props.type))
  .map(i => ({
    path: i.meta.frontmatter.redirect || i.path,
    title: i.meta.frontmatter.title,
    date: i.meta.frontmatter.date,
    lang: i.meta.frontmatter.lang,
    gpt: i.meta.frontmatter.gpt,
    duration: i.meta.frontmatter.duration,
    recording: i.meta.frontmatter.recording,
    upcoming: i.meta.frontmatter.upcoming,
    redirect: i.meta.frontmatter.redirect,
  }))

const posts = computed(() =>
  [...(props.posts || routes), ...props.extra || []]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .filter(i => !englishOnly.value || i.lang !== 'zh'),
)

const getYear = (a: Date | string | number) => new Date(a).getFullYear()
const isFuture = (a?: Date | string | number) => a && new Date(a) > new Date()
const isSameYear = (a?: Date | string | number, b?: Date | string | number) => a && b && getYear(a) === getYear(b)
function isSameGroup(a: Post, b?: Post) {
  return (isFuture(a.date) === isFuture(b?.date)) && isSameYear(a.date, b?.date)
}

function getGroupName(p: Post) {
  if (isFuture(p.date))
    return 'Upcoming'
  return getYear(p.date)
}

useHead({
  title: `${props.type === 'note' ? t('notes') : t('blog')} - ${t('me')}`,
  meta: [
    {
      name: 'description',
      content: t('blog-description'),
    },
  ],
})
</script>

<template>
  <ul>
    <template v-if="!posts.length">
      <div py2 op50>
        { {{ $t('nothing-here-yet') }} }
      </div>
    </template>

    <template v-for="route, idx in posts" :key="route.path">
      <div
        v-if="!isSameGroup(route, posts[idx - 1])"
        slide-enter pointer-events-none relative h20 select-none
        :style="{
          '--enter-stage': idx - 2,
          '--enter-step': '60ms',
        }"
      >
        <span absolute left--3rem top--2rem text-8em font-bold color-transparent text-stroke-2 text-stroke-hex-aaa op10>{{ getGroupName(route) }}</span>
      </div>
      <div
        class="slide-enter"
        :style="{
          '--enter-stage': idx,
          '--enter-step': '60ms',
        }"
      >
        <component
          :is="route.path.includes('://') ? 'a' : 'RouterLink'"
          v-bind="
            route.path.includes('://') ? {
              href: route.path,
              target: '_blank',
              rel: 'noopener noreferrer',
            } : {
              to: route.path,
            }
          "
          class="item mb-6 mt-2 block font-normal no-underline"
        >
          <li class="no-underline" flex="~ col md:row gap-2 md:items-center">
            <div class="title text-lg leading-1.2em" flex="~ gap-2 wrap">
              <span
                v-if="route.lang === 'zh'"
                flex-none align-middle
                class="my-auto ml--12 mr2 hidden rounded bg-zinc:15 px-1 py-0.5 text-xs text-zinc5 md:block"
              >中文</span>
              <span align-middle>{{ route.title }}</span>
            </div>

            <div flex="~ gap-2 items-center">
              <span
                v-if="route.redirect"

                i-carbon-arrow-up-right ml--1 mt--1 flex-none align-middle text-xs op50
                :title="$t('external')"
              />
              <span
                v-if="route.inperson"

                i-ri:group-2-line flex-none align-middle op50
                :title="$t('in-person')"
              />
              <span
                v-if="route.recording || route.video"

                i-ri:film-line flex-none align-middle op50
                :title="$t('provided-in-video')"
              />

              <span ws-nowrap text-sm op50>
                {{ formatDate(route.date, true) }}
              </span>
              <span v-if="route.duration" ws-nowrap text-sm op40>· {{ route.duration }}</span>
              <span v-if="route.platform" ws-nowrap text-sm op40>· {{ route.platform }}</span>
              <span
                v-if="route.lang === 'zh'"
                flex-none align-middle
                class="my-auto rounded bg-zinc:15 px-1 py-0.5 text-xs text-zinc5 md:hidden"
              >中文</span>
            </div>
          </li>
        </component>
      </div>
    </template>
  </ul>
</template>

import { formatDate as formatDateVueuse } from '@vueuse/core'
import { I18nLocate } from './i18n'

export const isDark = useDark()
export const englishOnly = useStorage('wearzdk-english-only', false)

/**
 * Credit to [@hooray](https://github.com/hooray)
 * @see https://github.com/vuejs/vitepress/pull/2347
 */
export function toggleDark(_event: MouseEvent) {
  // @ts-expect-error experimental API
  const isAppearanceTransition = document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition) {
    isDark.value = !isDark.value
    return
  }
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })
  transition.ready
    .then(() => {
      // const clipPath = [
      //   `circle(0px at ${x}px ${y}px)`,
      //   `circle(${endRadius}px at ${x}px ${y}px)`,
      // ]
      // 使用矩形动画
      // const clipPath = [
      //   `inset(0px 0px ${innerHeight}px 0px)`,
      //   'inset(0px 0px 0px 0px)',
      // ]
      // 使用菱形动画
      const mx = innerWidth
      const my = innerHeight
      const mxy = Math.max(mx, my)
      const clipPath = [
        `polygon(${mx}px 0px, ${mx}px 0px, ${mx}px 0px)`,
        `polygon(${-mxy}px 0px, ${mx}px 0px, ${mx}px ${2 * mxy}px)`,
      ]
      document.documentElement.animate(
        {
          clipPath: isDark.value
            ? [...clipPath].reverse()
            : clipPath,
        },
        {
          duration: 600,
          easing: 'linear',
          pseudoElement: isDark.value
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        },
      )
    })
}

function getDateFormat(onlyDate = true) {
  if (onlyDate) {
    switch (I18nLocate.value) {
      case 'zh-CN':
        return 'M月d日'
      default:
        return 'MMMM D'
    }
  }
  switch (I18nLocate.value) {
    case 'zh-CN':
      return 'YYYY年M月d日'
    default:
      return 'MMMM D, YYYY'
  }
}

export function formatDate(d: string | Date, onlyDate = true) {
  const date = new Date(d)
  return formatDateVueuse(date, getDateFormat(onlyDate))
}

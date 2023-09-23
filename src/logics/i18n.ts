import { isClient } from '@vueuse/core'
import type { Locale } from 'vue-i18n'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: '',
  messages: {},
})

const localesMap = Object.fromEntries(
  Object.entries(import.meta.glob('../../locales/*.yml'))
    .map(([path, loadLocale]) => [path.match(/([\w-]*)\.yml$/)?.[1], loadLocale]),
) as Record<Locale, () => Promise<{ default: Record<string, string> }>>

export const availableLocales = Object.keys(localesMap)

const loadedLanguages: string[] = []

function setI18nLanguage(lang: Locale) {
  i18n.global.locale.value = lang as any
  if (typeof document !== 'undefined')
    document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

export async function loadLanguageAsync(lang: string): Promise<Locale> {
  // If the same language
  if (i18n.global.locale.value === lang)
    return setI18nLanguage(lang)

  // If the language was already loaded
  if (loadedLanguages.includes(lang))
    return setI18nLanguage(lang)

  // If the language hasn't been loaded yet
  const messages = await localesMap[lang]()
  i18n.global.setLocaleMessage(lang, messages.default)
  loadedLanguages.push(lang)
  return setI18nLanguage(lang)
}

export const I18nLocate = useStorage('wearzdk-locale', getDefaultLocale())

export const MainLang = 'zh-CN'

watch(I18nLocate, (locale) => {
  loadLanguageAsync(locale)
})

export async function setupI18n(app: any) {
  await loadLanguageAsync(I18nLocate.value)
  app.use(i18n)
}

function getDefaultLocale() {
  let locale = ''
  if (isClient)
    locale = navigator.language

  if (availableLocales.includes(locale))
    return locale
  return 'en'
}

export function getReverseLocale(locale: string) {
  if (locale === 'zh-CN')
    return 'en'
  return 'zh-CN'
}

export function getPathLocaleStr(path: string) {
  const pathArr = path.split('/').filter(item => item !== '')
  const pathLocateStr = pathArr[0] || ''
  return pathLocateStr
}

export function getLocalePath(path: string, locale: string) {
  const pathArr = path.split('/').filter(item => item !== '')
  const pathLocateStr = getPathLocaleStr(path)
  console.log(pathLocateStr)

  if (locale === MainLang) {
    if (pathLocateStr === 'en')
      pathArr.shift()
    console.log(pathArr)
  }
  else {
    if (pathLocateStr !== 'en')
      pathArr.unshift('en')
    console.log(pathArr)
  }

  const newPath = `/${pathArr.join('/')}` || '/'
  console.log(newPath)
  return newPath
}

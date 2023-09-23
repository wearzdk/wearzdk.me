import 'uno.css'
import '@unocss/reset/tailwind.css'
import 'floating-vue/dist/style.css'
import './styles/main.css'
import './styles/prose.css'
import './styles/markdown.css'

import autoRoutes from 'pages-generated'
import NProgress from 'nprogress'
import { ViteSSG } from 'vite-ssg'
import { setupRouterScroller } from 'vue-router-better-scroller'
import FloatingVue from 'floating-vue'
import App from './App.vue'
import { I18nLocate, getLocalePath, setupI18n } from './logics/i18n'

const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith('/')
      ? `${i.path}index.html`
      : `${i.path}.html`,
  }
})

export const createApp = ViteSSG(
  App,
  {
    routes,
  },
  async ({ router, app, isClient }) => {
    app.use(FloatingVue)
    await setupI18n(app)
    if (isClient) {
      const html = document.querySelector('html')!
      setupRouterScroller(router, {
        selectors: {
          html(ctx) {
            // only do the sliding transition when the scroll position is not 0
            if (ctx.savedPosition?.top)
              html.classList.add('no-sliding')
            else
              html.classList.remove('no-sliding')
            return true
          },
        },
        behavior: 'auto',
      })

      router.beforeEach((to, _from, next) => {
        NProgress.start()
        const toLang = to.meta.frontmatter?.lang || I18nLocate.value
        if (I18nLocate.value !== toLang && to.meta.frontmatter.autoTranslation) {
          const newPath = getLocalePath(to.path, I18nLocate.value)
          if (newPath) {
            next({
              path: newPath,
            })
            return
          }
        }
        next()
      })
      router.afterEach(() => {
        NProgress.done()
      })
    }
  },
)

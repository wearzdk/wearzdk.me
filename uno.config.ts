import { defineConfig, presetAttributify, presetUno } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'
import presetIcons from '@unocss/preset-icons'
import presetTheme from 'unocss-preset-theme'

const themes = {
  theme: {
    dark: {
      colors: {
        'canvas': '#252525',
        'text': '#E0E0E0',
        'text-deep': '#FFFFFF',
        'text-deeper': '#FFFFFF',
        'border': '#3A3A3A',
        'fill1': '#1F1F1F',
        'fill2': '#2B2B2B',
        'fill3': '#3A3A3A',
      },
    },
    oneDark: {
      colors: {
        'canvas': '#282C34',
        'border': '#3E4451',
        'text': '#ABB2BF',
        'text-deep': '#ABB2BF',
        'text-deeper': '#FFFFFF',
        'fill1': '#21252B',
        'fill2': '#2C323D',
        'fill3': '#3E4451',
      },
    },
  },
}

export default defineConfig({
  presets: [
    presetAttributify({ /* preset options */}),
    presetUno(),
    presetIcons({
      prefix: 'i-',
    } as any),
    presetTheme(themes as any),
  ],
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    colors: {
      'primary': '#7071F5',
      'secondary': '#5C5CEA',
      'canvas': '#FAFAFA',
      'text': '#555',
      'text-deep': '#222',
      'text-deeper': '#000',
      'border': '#E0E0E0',
      'error': '#FF6666',
      'success': '#79C879',
      'fill1': '#F7F7F7',
      'fill2': '#F2F2F2',
      'fill3': '#EDEDED',
    },
  },
})

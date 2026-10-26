import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createI18n } from 'vue-i18n'

import enMessages from '@/locales/en/main.json' with { type: 'json' }

import { api } from '@/scripts/api'

import BackgroundImageUpload from './BackgroundImageUpload.vue'

vi.mock(import('@/scripts/api'))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: enMessages }
})

const uploadedFile = 'backgrounds/测试 image #1.png'

const expectedViewQuery = new URLSearchParams({
  filename: uploadedFile,
  type: 'input',
  subfolder: 'backgrounds'
}).toString()

function renderUpload(api_base: string) {
  api.api_base = api_base
  vi.mocked(api.fetchApi).mockResolvedValue(
    new Response(
      JSON.stringify({ name: '测试 image #1.png', subfolder: 'backgrounds' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  )
  const onUpdate = vi.fn()
  const user = userEvent.setup()
  render(BackgroundImageUpload, {
    props: { modelValue: '', 'onUpdate:modelValue': onUpdate },
    global: { plugins: [i18n] }
  })
  return { user, onUpdate }
}

describe('BackgroundImageUpload', () => {
  it.for(['', '/comfyui'])(
    'stores the uploaded image as a view URL under the %s base',
    async (base) => {
      const { user, onUpdate } = renderUpload(base)

      await user.upload(
        screen.getByTestId<HTMLInputElement>('background-image-input'),
        new File(['x'], 'cat.png', { type: 'image/png' })
      )

      expect(onUpdate).toHaveBeenCalledWith(
        `${base}/api/view?${expectedViewQuery}`
      )
    }
  )
})

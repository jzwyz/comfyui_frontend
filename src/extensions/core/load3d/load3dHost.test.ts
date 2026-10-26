import { describe, expect, it, vi } from 'vitest'

import { load3dHost } from '@/extensions/core/load3d/load3dHost'
import { api } from '@/scripts/api'

vi.mock(import('@/scripts/api'))
vi.mock(import('@/scripts/app'))

describe('load3dHost.resolveImageURL', () => {
  it.for([
    {
      uploadPath: 'bg.png',
      url: '/api/view?filename=bg.png&type=input&subfolder=&'
    },
    {
      uploadPath: '3d/scenes/bg.png',
      url: '/api/view?filename=bg.png&type=input&subfolder=3d/scenes&'
    },
    {
      uploadPath: 'temp/out.png',
      url: '/api/view?filename=out.png&type=temp&subfolder=&'
    },
    {
      uploadPath: 'output/render.png',
      url: '/api/view?filename=render.png&type=output&subfolder=&'
    }
  ])('resolves $uploadPath to an API view URL', ({ uploadPath, url }) => {
    expect(load3dHost.resolveImageURL(uploadPath)).toBe(url)
  })

  it('keeps the app base path in front of the view route', () => {
    api.api_base = '/comfyui'

    expect(load3dHost.resolveImageURL('3d/scenes/bg.png')).toBe(
      '/comfyui/api/view?filename=bg.png&type=input&subfolder=3d/scenes&'
    )
  })
})

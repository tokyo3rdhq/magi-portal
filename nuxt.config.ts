import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  typescript: {
    strict: true
  },
  app: {
    head: {
      title: 'MAGI Portal',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AI助手聊天界面' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },
  nitro: {
    preset: 'cloudflare-pages',
    output: {
      dir: '.output',
      serverDir: '.output/server',
      publicDir: '.output/public'
    },
    cloudflare: {
      pages: {
        routes: {
          include: ['/*'],
          exclude: ['/api/*']
        }
      }
    }
  }
}) 
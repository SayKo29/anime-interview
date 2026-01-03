// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // SSR enabled (required for technical test)
  ssr: true,

  // Cloudflare Pages configuration
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      autoSubfolderIndex: false,
      crawlLinks: true,
      routes: ['/']
    }
  },

  // TypeScript in strict mode
  typescript: {
    strict: true,
    typeCheck: true
  },
  experimental: {
    viewTransition: true,
  },
  // App configuration
  app: {
    head: {
      title: 'Anime Collection - Discover & Explore Top Anime',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Discover and explore the best anime series and movies. Browse through thousands of titles, filter by genre, rating, and more. Powered by Jikan API.' },
        { name: 'keywords', content: 'anime, manga, jikan, anime list, anime database, anime search, top anime, anime ratings' },
        { name: 'author', content: 'Anime Collection' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Anime Collection' },
        { property: 'og:title', content: 'Anime Collection - Discover & Explore Top Anime' },
        { property: 'og:description', content: 'Discover and explore the best anime series and movies. Browse through thousands of titles with advanced filters.' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Anime Collection - Discover & Explore Top Anime' },
        { name: 'twitter:description', content: 'Discover and explore the best anime series and movies.' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'canonical', href: 'https://anime-collection.app' }
      ]
    }
  },

  // Public environment variables
  runtimeConfig: {
    public: {
      jikanApiBase: 'https://api.jikan.moe/v4'
    }
  },

  // Vite configuration - Auto-import SCSS variables globally
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/css/variables" as *;'
        }
      }
    }
  }
})

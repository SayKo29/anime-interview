// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // SSR enabled (required for technical test)
  ssr: true,

  // TypeScript in strict mode
  typescript: {
    strict: true,
    typeCheck: true
  },

  // View Transitions API for smooth animations
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    viewTransition: true,
    head: {
      title: 'Anime List - Jikan API',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aplicación de listado de animes usando Jikan API' }
      ]
    }
  },

  // Public environment variables
  runtimeConfig: {
    public: {
      jikanApiBase: 'https://api.jikan.moe/v4'
    }
  }
})

# 🎌 Anime Collection - Technical Test

Modern web application to explore and discover anime using the Jikan API (MyAnimeList). Built with **Nuxt 4**, **Vue 3**, and **TypeScript**.

## 🌐 Live Demo

**[https://anime-interview.pages.dev/](https://anime-interview.pages.dev/)**

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Local Setup](#-installation--local-setup)
- [Testing](#-testing)
- [Deployment to Cloudflare Pages](#-deployment-to-cloudflare-pages)
- [Project Structure](#-project-structure)

## ✨ Features

- ✅ **Server-Side Rendering (SSR)** for better SEO and performance
- ✅ **Infinite Scroll** with automatic content loading
- ✅ **Advanced Filters**: genre, type, status, rating, order
- ✅ **Anime Details**: complete information, episodes, synopsis
- ✅ **Episode Modal**: detailed season visualization
- ✅ **Responsive Design**: adapted for mobile, tablet, and desktop
- ✅ **Rate Limiting**: API request control
- ✅ **Skeleton Loaders**: improved loading experience
- ✅ **Unit Tests**: coverage for components and logic

## 🛠️ Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com/) (v4.2.2)
- **UI:** [Vue 3](https://vuejs.org/) (v3.5.26) with Composition API
- **Language:** TypeScript in strict mode
- **Styles:** SCSS with CSS variables
- **Testing:** Vitest + Vue Test Utils
- **API:** [Jikan API v4](https://jikan.moe/) (MyAnimeList)
- **Hosting:** Cloudflare Pages with SSR

## 📦 Prerequisites

- **Node.js** >= 20.x
- **Bun** (recommended) or npm/pnpm/yarn

## 🚀 Installation & Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/SayKo29/anime-interview.git
cd anime-interview
```

### 2. Install dependencies

```bash
# With Bun (recommended)
bun install

# Or with npm
npm install
```

### 3. Run in development mode

```bash
# With Bun
bun run dev

# Or with npm
npm run dev
```

The application will be available at: **[http://localhost:3000](http://localhost:3000)**

### 4. Production build (optional)

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

## 🧪 Testing

```bash
# Run all tests
bun run test

# Tests in watch mode (development)
bun run test:watch

# Generate coverage report
bun run test:coverage

# Type check with TypeScript
bun run typecheck
```

## 🌍 Deployment to Cloudflare Pages

The application is configured for automatic deployment on Cloudflare Pages.

**Simply push to the `main` branch and Cloudflare will automatically build and deploy your changes!** 🚀

The repository is connected to Cloudflare Pages with the following configuration:

```
Framework preset: Nuxt.js
Build command: npm run build
Build output directory: .output/public
Node version: 20
```

Every commit to `main` triggers an automatic deployment. That's it! ✨

## 📁 Project Structure

```
anime-interview/
├── components/          # Reusable Vue components
│   ├── AnimeCard.vue
│   ├── AnimeList.vue
│   ├── BaseModal.vue
│   ├── EpisodeItem.vue
│   ├── EpisodeList.vue
│   ├── EpisodeModal.vue
│   ├── FilterBar.vue
│   ├── FilterModal.vue
│   └── SkeletonCard.vue
├── composables/         # Reusable composition functions (hooks)
│   ├── useAnimeFilters.ts
│   ├── useAnimeList.ts
│   ├── useApi.ts
│   └── useInfiniteScroll.ts
├── pages/              # Pages and routes
│   ├── index.vue
│   └── anime/
│       └── [id].vue
├── utils/              # Utilities and helpers
│   ├── api-error-handler.ts
│   ├── rate-limit.ts
│   └── transformers.ts
├── types/              # TypeScript types
│   ├── anime.types.ts
│   └── jikan.types.ts
├── tests/              # Unit tests
│   ├── components/
│   ├── composables/
│   └── utils/
├── assets/             # Global styles and resources
│   └── css/
├── nuxt.config.ts      # Nuxt configuration
└── package.json        # Project dependencies
```

## 🔧 Available Scripts

```bash
bun run dev          # Development server
bun run build        # Production build
bun run preview      # Preview local build
bun run test         # Run tests
bun run test:watch   # Tests in watch mode
bun run typecheck    # TypeScript type checking
```

## 📝 Technical Notes

- The application implements **SSR (Server-Side Rendering)** for better SEO
- **Rate limiting** is used to respect the free Jikan API limits
- **Filters persist** in the URL to facilitate sharing searches
- The application is optimized for **Core Web Vitals**
- Compatible with **Node.js 20+**

## 📄 License

This project is a technical test and is available for educational purposes.

---

Built with ❤️ using Nuxt 4 and Jikan API

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // runtimeConfig: {
  //   public: {
  //     supabaseUrl: process.env.SUPABASE_URL,
  //     supabaseKey: process.env.SUPABASE_KEY,
  //   },
  // },

  modules: [
    "@unocss/nuxt",
    "shadcn-nuxt",
    "@vueuse/nuxt",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    // "@nuxtjs/supabase",
  ],

  // supabase: {
  //   redirectOptions: {
  //     login: "/login",
  //     callback: "/confirm", // <--
  //     exclude: ["/register", "/forgot-password"],
  //   },
  // },

  css: ["@unocss/reset/tailwind.css"],

  colorMode: {
    classSuffix: "",
  },

  features: {
    // For UnoCSS
    inlineStyles: false,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  routeRules: {
    "/components": { redirect: "/components/accordion" },
    "/settings": { redirect: "/settings/profile" },
  },

  imports: {
    dirs: ["./lib"],
  },

  compatibilityDate: "2024-12-14",
});

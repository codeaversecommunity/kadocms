<script setup lang="ts">
import { Sonner } from "@/components/ui/sonner";
import { ConfigProvider } from "radix-vue";

const colorMode = useColorMode();

const color = computed(() =>
  colorMode.value === "dark" ? "#09090b" : "#ffffff"
);

const { theme, radius } = useCustomize();

useHead({
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: color },
  ],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
  bodyAttrs: {
    class: computed(() => `theme-${theme.value}`),
    style: computed(() => `--radius: ${radius.value}rem;`),
  },
});

const title = "KadoCMS - Headless CMS";
const description =
  "Headless CMS for your next project. KadoCMS is a headless CMS that allows you to create and manage your content easily. It is built with Vue 3, Nuxt 3, and Tailwind CSS.";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: "https://dashboard.dianprata.com",
  ogImage: "https://nuxt-shadcn-dashboard.vercel.app/social-card.png",
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: "https://nuxt-shadcn-dashboard.vercel.app/social-card.png",
  twitterCard: "summary_large_image",
});

const router = useRouter();

defineShortcuts({
  "G-H": () => router.push("/"),
  "G-E": () => router.push("/email"),
});

const useIdFunction = () => useId();

const textDirection = useTextDirection({ initialValue: "ltr" });
const dir = computed(() => (textDirection.value === "rtl" ? "rtl" : "ltr"));
</script>

<template>
  <ConfigProvider :use-id="useIdFunction" :dir="dir">
    <div vaul-drawer-wrapper class="relative">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>

      <AppSettings />
    </div>

    <Toaster />
    <Sonner class="pointer-events-auto" />
  </ConfigProvider>
</template>

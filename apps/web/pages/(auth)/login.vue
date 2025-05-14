<script setup lang="ts">
import SignInForm from "~/components/auth/sign-in-form.vue";

definePageMeta({
  layout: "blank",
});
</script>

<template>
  <LayoutAuth>
    <div class="grid mx-auto max-w-sm gap-6">
      <div class="grid gap-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p class="text-balance text-sm text-muted-foreground">
          Login with your Apple or Google account
        </p>
      </div>
      <SignInForm />

      <p class="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our
        <a
          href="/terms"
          class="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </a>
        and
        <a
          href="/privacy"
          class="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  </LayoutAuth>
</template>

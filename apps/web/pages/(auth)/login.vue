<script setup lang="ts">
import SignInForm from "~/components/auth/sign-in-form.vue";

definePageMeta({
  layout: "blank",
});
</script>

<template>
  <LayoutAuth reverse>
    <div class="grid mx-auto max-w-sm gap-6">
      <div class="grid gap-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p class="text-balance text-sm text-muted-foreground">
          Login with your Apple or Google account
        </p>
      </div>
      <SignInForm />
    </div>
  </LayoutAuth>
</template>

<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import PasswordInput from "~/components/PasswordInput.vue";
import SignInWithGithubButton from "./sign-in-with-github-button.vue";
import SignInWithGoogleButton from "./sign-in-with-google-button.vue";

const email = ref("demo@gmail.com");
const password = ref("password");
const isLoading = ref(false);

function onSubmit(event: Event) {
  event.preventDefault();
  if (!email.value || !password.value) return;

  isLoading.value = true;

  setTimeout(() => {
    if (email.value === "demo@gmail.com" && password.value === "password")
      navigateTo("/");

    isLoading.value = false;
  }, 3000);
}
</script>

<template>
  <form class="grid gap-6" @submit="onSubmit">
    <div class="flex flex-col gap-4">
      <SignInWithGithubButton label="Login with Github" />
      <SignInWithGoogleButton label="Login with Google" />
    </div>
    <Separator label="Or continue with" />
    <div class="grid gap-2">
      <Label for="email"> Email </Label>
      <Input
        id="email"
        v-model="email"
        type="email"
        placeholder="name@example.com"
        :disabled="isLoading"
        auto-capitalize="none"
        auto-complete="email"
        auto-correct="off"
      />
    </div>
    <div class="grid gap-2">
      <div class="flex items-center">
        <Label for="password"> Password </Label>
        <NuxtLink
          to="/forgot-password"
          class="ml-auto inline-block text-sm underline"
        >
          Forgot your password?
        </NuxtLink>
      </div>
      <PasswordInput id="password" v-model="password" />
    </div>
    <Button type="submit" class="w-full" :disabled="isLoading">
      <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
      Login
    </Button>
  </form>
  <div class="mt-4 text-center text-sm text-muted-foreground">
    Don't have an account?
    <NuxtLink to="/register" class="underline"> Sign up </NuxtLink>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-vue-next";
import PasswordInput from "~/components/PasswordInput.vue";
import SignInWithGithubButton from "./sign-in-with-github-button.vue";
import SignInWithGoogleButton from "./sign-in-with-google-button.vue";

const isLoading = ref(false);
async function onSubmit(event: Event) {
  event.preventDefault();
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
}
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="name"> Name </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            type="text"
            auto-capitalize="none"
            auto-complete="name"
            auto-correct="off"
            :disabled="isLoading"
          />
        </div>
        <div class="grid gap-2">
          <Label for="email"> Email </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            auto-capitalize="none"
            auto-complete="email"
            auto-correct="off"
            :disabled="isLoading"
          />
        </div>
        <div class="grid gap-2">
          <Label for="password"> Password </Label>
          <PasswordInput id="password" />
        </div>
        <div class="grid gap-2">
          <Label for="confirm-password"> Confirm Password </Label>
          <PasswordInput id="confirm-password" />
        </div>
        <Button :disabled="isLoading">
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Sign In with Email
        </Button>
      </div>
    </form>
    <Separator label="Or continue with" />
    <div class="flex items-center gap-4">
      <SignInWithGithubButton />
      <SignInWithGoogleButton />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";
import { supabase } from "@repo/supabase";

const props = defineProps({
  class: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Github",
  },
});

async function signInWithGithub() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://localhost:3000/confirm",
    },
  });

  if (error) {
    console.error("Error signing in with Github:", error.message);
  }
}
</script>

<template>
  <Button
    variant="outline"
    :class="cn('w-full gap-2', props.class)"
    @click="signInWithGithub"
  >
    <Icon name="uil:github" class="size-5" />

    {{ props.label }}
  </Button>
</template>

<style scoped></style>

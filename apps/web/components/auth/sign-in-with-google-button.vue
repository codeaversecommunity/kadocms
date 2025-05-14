<script setup lang="ts">
import { cn } from "@/lib/utils";

const props = defineProps({
  class: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Google",
  },
});

const supabase = useSupabaseClient();

async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/confirm",
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error.message);
  }
}
</script>

<template>
  <Button
    variant="outline"
    :class="cn('w-full gap-2', props.class)"
    @click="signInWithGoogle"
  >
    <Icon name="mage:google" class="size-5" />
    {{ props.label }}
  </Button>
</template>

<style scoped></style>

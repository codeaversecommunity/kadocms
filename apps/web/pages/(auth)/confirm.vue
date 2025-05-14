<script setup lang="ts">
definePageMeta({
  layout: "blank",
});

const user = useSupabaseUser();

watch(
  user,
  async () => {
    if (user.value) {
      //   await $fetch("/api/auth/confirm", {
      //     method: "POST",
      //   });

      return navigateTo("/");
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <p>Redirecting...</p>
  </div>
</template>

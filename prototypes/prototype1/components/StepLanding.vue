<script setup lang="ts">
const emit = defineEmits<{
  next: []
}>()
</script>

<template>
  <div class="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
    <div class="mb-8 rounded-full bg-teal-50 p-6">
      <UIcon name="i-lucide-heart-handshake" class="size-16 text-teal-600" />
    </div>

    <h1 class="mb-3 text-3xl font-bold text-gray-900">
      Welcome to Your Personal Assessment
    </h1>

    <p class="mb-2 max-w-lg text-lg text-gray-500">
      This guided session will help us understand you better so we can personalize your care experience.
    </p>

    <p class="mb-10 max-w-md text-sm text-gray-400">
      You'll be guided by a virtual psychologist through a short onboarding survey
      followed by a clinical assessment. Everything is confidential.
    </p>

    <UButton
      size="xl"
      color="primary"
      icon="i-lucide-arrow-right"
      trailing
      @click="emit('next')"
    >
      Get Started
    </UButton>

    <p class="mt-6 text-xs text-gray-400">
      Takes approximately 15–25 minutes
    </p>
  </div>
</template>

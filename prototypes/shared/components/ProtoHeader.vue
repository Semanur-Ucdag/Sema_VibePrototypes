<script setup lang="ts">
interface Props {
  title: string
  description?: string
  prototypeNumber: number
}

defineProps<Props>()
</script>

<template>
  <header class="border-b border-gray-200 bg-white px-6 py-4">
    <div class="flex items-center gap-3">
      <UBadge color="primary" variant="subtle" size="sm">
        Prototype {{ prototypeNumber }}
      </UBadge>
      <div>
        <h1 class="text-xl font-semibold text-gray-900">
          {{ title }}
        </h1>
        <p v-if="description" class="text-sm text-gray-500">
          {{ description }}
        </p>
      </div>
    </div>
  </header>
</template>

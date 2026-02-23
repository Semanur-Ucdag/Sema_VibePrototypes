<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <UCard :ui="{ body: 'p-0' }">
    <template #header>
      <div class="flex items-start justify-between gap-2">
        <div>
          <p class="text-base font-semibold text-highlighted">
            {{ title }}
          </p>
          <p v-if="subtitle" class="text-xs text-muted mt-1">
            {{ subtitle }}
          </p>
        </div>
        <slot name="actions" />
      </div>
    </template>
    <slot />
  </UCard>
</template>

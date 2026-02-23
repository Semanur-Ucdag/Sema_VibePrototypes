<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  showCustomize?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  showCustomize: false
})
</script>

<template>
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 v-if="title" class="text-2xl font-semibold text-highlighted">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mt-1 text-sm text-muted">
        {{ subtitle }}
      </p>
    </div>

    <div class="ml-auto flex items-center gap-2">
      <slot name="right">
        <UButton
          color="primary"
          variant="soft"
          icon="i-lucide-calendar-check-2"
          label="Next session · Today at 9:00"
          class="rounded-full"
        />
        <UButton
          color="neutral"
          variant="ghost"
          square
          icon="i-lucide-copy"
        />
        <UButton
          color="neutral"
          variant="ghost"
          square
          icon="i-lucide-bell"
        />
        <UButton
          color="neutral"
          variant="ghost"
          square
          icon="i-lucide-circle-help"
        />
        <UColorModeButton />
        <UserMenu icon-only />
      </slot>
    </div>

    <div v-if="showCustomize" class="w-full flex justify-end">
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-settings-2"
        label="Customize"
      />
    </div>
  </div>
</template>

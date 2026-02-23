<script setup lang="ts">
type StatusTone = 'neutral' | 'success' | 'warning' | 'error' | 'info'

interface Props {
  label: string
  tone?: StatusTone
}

withDefaults(defineProps<Props>(), {
  tone: 'neutral'
})
</script>

<template>
  <UBadge :color="tone" variant="soft" class="capitalize">
    {{ label }}
  </UBadge>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: number
  delta: number
  completion: number
  tone: 'green' | 'orange' | 'red'
}

const props = defineProps<Props>()

const colorClass = computed<string>(() => {
  if (props.tone === 'green') {
    return 'var(--color-emerald-400)'
  }

  if (props.tone === 'orange') {
    return 'var(--color-amber-400)'
  }

  return 'var(--color-orange-500)'
})

const gaugeStyle = computed(() => ({
  background: `conic-gradient(from 180deg at 50% 100%, ${colorClass.value} ${props.value * 1.8}deg, var(--ui-border) ${props.value * 1.8}deg 180deg)`
}))
</script>

<template>
  <UCard variant="subtle" :ui="{ body: 'p-4' }">
    <div class="flex items-start justify-between gap-2">
      <p class="text-sm font-medium text-highlighted">
        {{ title }}
      </p>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-more-horizontal"
        size="xs"
      />
    </div>

    <div class="mt-2 flex flex-col items-center">
      <div class="gauge-shell" :style="gaugeStyle">
        <div class="gauge-hole">
          <UBadge
            :color="delta > 0 ? 'success' : 'error'"
            variant="soft"
            size="sm"
          >
            {{ delta > 0 ? '+' : '' }}{{ delta }}%
          </UBadge>
        </div>
      </div>
      <p class="mt-2 text-3xl font-semibold text-highlighted">
        {{ value }}
      </p>
      <p class="text-xs text-muted">
        Your score
      </p>
    </div>

    <div class="mt-4">
      <div class="mb-2 flex items-center justify-between text-xs text-muted">
        <span>Completed surveys</span>
        <span>{{ completion }}%</span>
      </div>
      <UProgress :model-value="completion" color="neutral" />
    </div>
  </UCard>
</template>

<style scoped>
.gauge-shell {
  width: 128px;
  height: 64px;
  border-top-left-radius: 128px;
  border-top-right-radius: 128px;
  overflow: hidden;
  position: relative;
}

.gauge-hole {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 0;
  top: 16px;
  border-top-left-radius: 128px;
  border-top-right-radius: 128px;
  background: var(--ui-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

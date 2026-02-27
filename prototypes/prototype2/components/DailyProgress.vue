<script setup lang="ts">
interface Props {
  completed: number
  total: number
  accentColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  accentColor: 'text-teal-500'
})

const radius = 40
const circumference = 2 * Math.PI * radius
const strokeDashoffset = computed(() => {
  if (props.total === 0) return circumference
  const progress = props.completed / props.total
  return circumference * (1 - progress)
})

const strokeColor = computed(() => {
  const colorMap: Record<string, string> = {
    'text-indigo-400': '#818cf8',
    'text-amber-500': '#f59e0b',
    'text-teal-500': '#14b8a6'
  }
  return colorMap[props.accentColor] ?? '#14b8a6'
})
</script>

<template>
  <div class="flex flex-col items-center gap-1">
    <div class="relative size-20">
      <svg class="size-20 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" :r="radius"
          fill="none" stroke="currentColor"
          stroke-width="6"
          class="text-gray-200"
        />
        <circle
          cx="50" cy="50" :r="radius"
          fill="none"
          :stroke="strokeColor"
          stroke-width="6"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          class="transition-all duration-700 ease-out"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-sm font-bold" :class="accentColor">
          {{ completed }}/{{ total }}
        </span>
      </div>
    </div>
    <span class="text-xs text-gray-400">Today's Progress</span>
  </div>
</template>

<script setup lang="ts">
import type { EnergyLevel } from '../composables/useEnergyState'

const emit = defineEmits<{
  selected: []
}>()

const { selectEnergy } = useEnergyState()

interface EnergyOption {
  level: EnergyLevel
  icon: string
  label: string
  sublabel: string
  taskHint: string
  gradient: string
  hoverRing: string
}

const options: EnergyOption[] = [
  {
    level: 'low',
    icon: 'i-lucide-moon',
    label: 'Low Energy',
    sublabel: "It's okay. Let's keep it gentle.",
    taskHint: '2–3 gentle tasks',
    gradient: 'from-indigo-500/20 to-purple-500/20',
    hoverRing: 'hover:ring-indigo-400'
  },
  {
    level: 'medium',
    icon: 'i-lucide-cloud-sun',
    label: 'Medium Energy',
    sublabel: 'A balanced pace works well.',
    taskHint: '4–5 balanced tasks',
    gradient: 'from-amber-500/20 to-orange-500/20',
    hoverRing: 'hover:ring-amber-400'
  },
  {
    level: 'high',
    icon: 'i-lucide-sun',
    label: 'High Energy',
    sublabel: "Great! Let's make the most of it.",
    taskHint: '6–8 engaging tasks',
    gradient: 'from-teal-500/20 to-emerald-500/20',
    hoverRing: 'hover:ring-teal-400'
  }
]

function choose(level: EnergyLevel): void {
  selectEnergy(level)
  emit('selected')
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4">
    <div class="mb-12 text-center">
      <div class="mb-6 inline-flex rounded-full bg-teal-50 p-4">
        <UIcon name="i-lucide-heart-pulse" class="size-10 text-teal-600" />
      </div>
      <h1 class="mb-3 text-3xl font-bold text-gray-900">
        How are you feeling today?
      </h1>
      <p class="max-w-md text-gray-500">
        Choose your energy level to personalize your experience. There's no wrong answer.
      </p>
    </div>

    <div class="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
      <button
        v-for="option in options"
        :key="option.level"
        class="group flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm ring-2 ring-transparent transition-all duration-300 hover:shadow-lg"
        :class="option.hoverRing"
        @click="choose(option.level)"
      >
        <div
          class="flex size-16 items-center justify-center rounded-full bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
          :class="option.gradient"
        >
          <UIcon :name="option.icon" class="size-8 text-gray-700" />
        </div>
        <div class="text-center">
          <p class="text-lg font-semibold text-gray-900">
            {{ option.label }}
          </p>
          <p class="mt-1 text-sm text-gray-500">
            {{ option.sublabel }}
          </p>
        </div>
        <UBadge variant="subtle" color="neutral" size="sm">
          {{ option.taskHint }}
        </UBadge>
      </button>
    </div>
  </div>
</template>

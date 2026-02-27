<script setup lang="ts">
import type { TaskData, TaskFormat } from '../composables/useTaskBoard'

interface Props {
  task: TaskData
  isCompleted: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ select: [] }>()

const { themeConfig } = useEnergyState()
const { getCategoryIcon, getFormatInfo, recommendedFormat } = useTaskBoard()

const formats = computed<TaskFormat[]>(() =>
  Object.keys(props.task.formats) as TaskFormat[]
)
</script>

<template>
  <button
    class="group relative w-full rounded-xl border p-5 text-left shadow-sm transition-all duration-200 hover:shadow-md"
    :class="[
      themeConfig.cardBg,
      themeConfig.border,
      isCompleted ? 'opacity-60' : ''
    ]"
    @click="emit('select')"
  >
    <div v-if="isCompleted" class="absolute right-4 top-4">
      <div class="flex size-6 items-center justify-center rounded-full bg-green-100">
        <UIcon name="i-lucide-check" class="size-4 text-green-600" />
      </div>
    </div>

    <div class="mb-3 flex items-center gap-2">
      <UIcon :name="getCategoryIcon(task.category)" class="size-5" :class="themeConfig.accent" />
      <span class="text-xs font-medium" :class="themeConfig.subtext">
        {{ task.estimatedMinutes }} min
      </span>
    </div>

    <h3 class="mb-1 font-semibold" :class="themeConfig.text">
      {{ task.title }}
    </h3>
    <p class="mb-4 line-clamp-2 text-sm" :class="themeConfig.subtext">
      {{ task.description }}
    </p>

    <div class="flex items-center gap-2">
      <div
        v-for="format in formats"
        :key="format"
        class="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
        :class="format === recommendedFormat
          ? `${themeConfig.accentBg} text-white`
          : `bg-gray-100 ${themeConfig.subtext}`"
      >
        <UIcon :name="getFormatInfo(format).icon" class="size-3" />
        <span>{{ getFormatInfo(format).label }}</span>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { TaskFormat } from '../composables/useTaskBoard'

const { themeConfig } = useEnergyState()
const {
  selectedTask,
  selectedFormat,
  availableFormats,
  recommendedFormat,
  closeTask,
  completeTask,
  isTaskCompleted,
  getFormatInfo
} = useTaskBoard()
const { triggerFeedback } = useTaskFeedback()

const isOpen = computed({
  get: () => selectedTask.value !== null,
  set: (val: boolean) => { if (!val) closeTask() }
})
const completed = computed(() => selectedTask.value ? isTaskCompleted(selectedTask.value.id) : false)

function selectFormat(format: TaskFormat): void {
  selectedFormat.value = format
}

function handleComplete(): void {
  if (!selectedTask.value) return
  completeTask(selectedTask.value.id)
  triggerFeedback(selectedTask.value.title, selectedTask.value.feedbackInsight)
  closeTask()
}

const audioContent = computed(() => {
  const formats = selectedTask.value?.formats as Record<string, { description?: string }> | undefined
  return formats?.audio?.description ?? ''
})

const videoUrl = computed(() => {
  const formats = selectedTask.value?.formats as Record<string, { url?: string }> | undefined
  return formats?.video?.url ?? ''
})

const textContent = computed(() => {
  const formats = selectedTask.value?.formats as Record<string, { content?: string }> | undefined
  return formats?.text?.content ?? ''
})


</script>

<template>
  <USlideover
    v-model:open="isOpen"
    :title="selectedTask?.title ?? 'Task'"
    :ui="{ width: 'max-w-xl w-full' }"
  >
    <template #header>
      <div v-if="selectedTask" class="w-full">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UBadge variant="subtle" color="primary" size="sm">
              {{ selectedTask.category }}
            </UBadge>
            <span class="text-xs" :class="themeConfig.subtext">
              {{ selectedTask.estimatedMinutes }} min
            </span>
          </div>
        </div>
        <h2 class="mt-2 text-xl font-bold" :class="themeConfig.text">
          {{ selectedTask.title }}
        </h2>

        <!-- Format Tabs -->
        <div class="mt-3 flex gap-1">
          <button
            v-for="format in availableFormats"
            :key="format"
            class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="selectedFormat === format
              ? `${themeConfig.accentBg} text-white`
              : `hover:bg-gray-100 ${themeConfig.subtext}`"
            @click="selectFormat(format)"
          >
            <UIcon :name="getFormatInfo(format).icon" class="size-4" />
            <span>{{ getFormatInfo(format).label }}</span>
            <UBadge
              v-if="format === recommendedFormat"
              size="xs"
              variant="subtle"
              color="primary"
              class="ml-1"
            >
              Rec
            </UBadge>
          </button>
        </div>
      </div>
    </template>

    <template #body>
      <div v-if="selectedTask">
        <TaskAudioPlayer
          v-if="selectedFormat === 'audio'"
          :audio-content="audioContent"
          :category="selectedTask.category"
        />
        <TaskVideoPlayer
          v-else-if="selectedFormat === 'video'"
          :video-url="videoUrl"
        />
        <TaskTextContent
          v-else-if="selectedFormat === 'text'"
          :text-content="textContent"
          :task-id="selectedTask.id"
        />
        <TaskInteractive
          v-else-if="selectedFormat === 'interactive'"
          :task="selectedTask"
        />
      </div>
    </template>

    <template #footer>
      <div v-if="selectedTask" class="w-full">
        <UButton
          v-if="!completed"
          block
          color="primary"
          size="lg"
          icon="i-lucide-check-circle"
          @click="handleComplete"
        >
          Mark as Complete
        </UButton>
        <div v-else class="flex items-center justify-center gap-2 text-green-600">
          <UIcon name="i-lucide-check-circle" class="size-5" />
          <span class="font-medium">Completed</span>
        </div>
      </div>
    </template>
  </USlideover>
</template>

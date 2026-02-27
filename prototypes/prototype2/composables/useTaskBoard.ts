import tasksData from '../data/tasks.json'
import type { EnergyLevel } from './useEnergyState'

export type TaskFormat = 'audio' | 'video' | 'text' | 'interactive'

export interface TaskData {
  id: string
  title: string
  description: string
  category: string
  energyLevels: string[]
  estimatedMinutes: number
  formats: Record<string, unknown>
  feedbackInsight: string
}

const CATEGORY_ICONS: Record<string, string> = {
  mood: 'i-lucide-smile',
  journaling: 'i-lucide-pencil-line',
  breathing: 'i-lucide-wind',
  psychoeducation: 'i-lucide-book-open',
  'video-lesson': 'i-lucide-video',
  behavioral: 'i-lucide-calendar-check',
  gratitude: 'i-lucide-heart'
}

const FORMAT_ICONS: Record<TaskFormat, { icon: string; label: string }> = {
  audio: { icon: 'i-lucide-headphones', label: 'Listen' },
  video: { icon: 'i-lucide-play-circle', label: 'Watch' },
  text: { icon: 'i-lucide-book-open', label: 'Read' },
  interactive: { icon: 'i-lucide-list-checks', label: 'Interact' }
}

const RECOMMENDED_FORMATS: Record<EnergyLevel, TaskFormat> = {
  low: 'audio',
  medium: 'text',
  high: 'interactive'
}

const allTasks = tasksData as TaskData[]
const completedTaskIds = reactive(new Set<string>())
const selectedTaskId = ref<string | null>(null)
const selectedFormat = ref<TaskFormat | null>(null)
const interactiveData = reactive<Record<string, Record<string, unknown>>>({})

export function useTaskBoard() {
  const { energyLevel } = useEnergyState()

  const filteredTasks = computed<TaskData[]>(() => {
    if (!energyLevel.value) return []
    return allTasks.filter(t => t.energyLevels.includes(energyLevel.value!))
  })

  const recommendedFormat = computed<TaskFormat>(() => {
    return RECOMMENDED_FORMATS[energyLevel.value ?? 'medium']
  })

  const selectedTask = computed<TaskData | null>(() => {
    if (!selectedTaskId.value) return null
    return allTasks.find(t => t.id === selectedTaskId.value) ?? null
  })

  const availableFormats = computed<TaskFormat[]>(() => {
    if (!selectedTask.value) return []
    return Object.keys(selectedTask.value.formats) as TaskFormat[]
  })

  const completionCount = computed(() => {
    return filteredTasks.value.filter(t => completedTaskIds.has(t.id)).length
  })

  const totalTasks = computed(() => filteredTasks.value.length)

  const progressPercentage = computed(() => {
    if (totalTasks.value === 0) return 0
    return Math.round((completionCount.value / totalTasks.value) * 100)
  })

  function selectTask(taskId: string): void {
    selectedTaskId.value = taskId
    const task = allTasks.find(t => t.id === taskId)
    if (task) {
      const formats = Object.keys(task.formats) as TaskFormat[]
      if (formats.includes(recommendedFormat.value)) {
        selectedFormat.value = recommendedFormat.value
      } else {
        selectedFormat.value = formats[0] ?? null
      }
    }
  }

  function closeTask(): void {
    selectedTaskId.value = null
    selectedFormat.value = null
  }

  function completeTask(taskId: string): void {
    completedTaskIds.add(taskId)
  }

  function isTaskCompleted(taskId: string): boolean {
    return completedTaskIds.has(taskId)
  }

  function getTaskInteractiveData(taskId: string): Record<string, unknown> {
    if (!interactiveData[taskId]) {
      interactiveData[taskId] = {}
    }
    return interactiveData[taskId]
  }

  function setTaskInteractiveData(taskId: string, key: string, value: unknown): void {
    if (!interactiveData[taskId]) {
      interactiveData[taskId] = {}
    }
    interactiveData[taskId][key] = value
  }

  function getCategoryIcon(category: string): string {
    return CATEGORY_ICONS[category] ?? 'i-lucide-circle'
  }

  function getFormatInfo(format: TaskFormat): { icon: string; label: string } {
    return FORMAT_ICONS[format]
  }

  return {
    filteredTasks,
    selectedTask,
    selectedTaskId,
    selectedFormat,
    availableFormats,
    recommendedFormat,
    completedTaskIds,
    completionCount,
    totalTasks,
    progressPercentage,
    selectTask,
    closeTask,
    completeTask,
    isTaskCompleted,
    getTaskInteractiveData,
    setTaskInteractiveData,
    getCategoryIcon,
    getFormatInfo
  }
}

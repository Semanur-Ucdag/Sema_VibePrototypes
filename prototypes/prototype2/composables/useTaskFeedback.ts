export interface FeedbackData {
  insight: string
  taskTitle: string
}

const showFeedback = ref(false)
const currentFeedback = ref<FeedbackData | null>(null)

export function useTaskFeedback() {
  function triggerFeedback(taskTitle: string, insight: string): void {
    currentFeedback.value = { taskTitle, insight }
    showFeedback.value = true
  }

  function dismissFeedback(): void {
    showFeedback.value = false
    currentFeedback.value = null
  }

  return {
    showFeedback,
    currentFeedback,
    triggerFeedback,
    dismissFeedback
  }
}

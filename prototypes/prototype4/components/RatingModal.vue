<script setup lang="ts">
import type { Activity } from '~/composables/useActivities'

interface Props {
  activity: Activity | null
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  logged: [feedback: string]
}>()

const { logActivity } = useActivities()

const pleasureScore = ref(5)
const masteryScore = ref(5)
const feedback = ref('')
const showFeedback = ref(false)

watch(() => props.open, (val) => {
  if (val) {
    pleasureScore.value = 5
    masteryScore.value = 5
    feedback.value = ''
    showFeedback.value = false
  }
})

function handleLog(): void {
  if (!props.activity) return
  const msg = logActivity(props.activity.id, pleasureScore.value, masteryScore.value)
  feedback.value = msg
  showFeedback.value = true

  setTimeout(() => {
    emit('logged', msg)
    emit('close')
  }, 2200)
}

function handleClose(): void {
  if (!showFeedback.value) {
    emit('close')
  }
}

function handleOverlayClick(e: MouseEvent): void {
  if ((e.target as HTMLElement).dataset.overlay) {
    handleClose()
  }
}

function pleasureEmoji(val: number): string {
  if (val <= 2) return '😔'
  if (val <= 4) return '😐'
  if (val <= 6) return '🙂'
  if (val <= 8) return '😊'
  return '😄'
}

function masteryEmoji(val: number): string {
  if (val <= 2) return '🔅'
  if (val <= 4) return '✨'
  if (val <= 6) return '💪'
  if (val <= 8) return '🏆'
  return '⭐'
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        data-overlay="true"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="handleOverlayClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" data-overlay="true" />

        <!-- Modal content -->
        <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 pt-5 pb-3 border-b border-zinc-100">
            <div v-if="activity" class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                <UIcon :name="activity.icon" class="text-xl text-zinc-600" />
              </div>
              <span class="font-semibold text-zinc-800">{{ activity.name }}</span>
            </div>
            <button
              v-if="!showFeedback"
              class="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-colors"
              @click="handleClose"
            >
              <UIcon name="i-lucide-x" class="text-lg text-zinc-400" />
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5">
            <!-- Feedback state -->
            <div v-if="showFeedback" class="flex flex-col items-center justify-center py-6">
              <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4 animate-bounce">
                <UIcon name="i-lucide-check-circle" class="text-3xl text-emerald-500" />
              </div>
              <p class="text-center text-zinc-700 font-medium text-lg leading-relaxed max-w-xs">
                {{ feedback }}
              </p>
            </div>

            <!-- Rating state -->
            <div v-else class="space-y-8">
              <!-- Pleasure slider -->
              <div>
                <div class="flex items-center justify-between mb-4">
                  <label class="text-sm font-semibold text-zinc-700">Pleasure (Enjoyment)</label>
                  <span class="text-2xl">{{ pleasureEmoji(pleasureScore) }}</span>
                </div>
                <input
                  v-model.number="pleasureScore"
                  type="range"
                  :min="0"
                  :max="10"
                  :step="1"
                  class="w-full h-2 rounded-full appearance-none cursor-pointer accent-emerald-500 bg-emerald-100"
                />
                <div class="flex justify-between items-center mt-2">
                  <span class="text-[10px] text-zinc-400">No enjoyment</span>
                  <span class="text-lg font-bold text-emerald-600">{{ pleasureScore }}</span>
                  <span class="text-[10px] text-zinc-400">Maximum joy</span>
                </div>
              </div>

              <!-- Mastery slider -->
              <div>
                <div class="flex items-center justify-between mb-4">
                  <label class="text-sm font-semibold text-zinc-700">Mastery (Achievement)</label>
                  <span class="text-2xl">{{ masteryEmoji(masteryScore) }}</span>
                </div>
                <input
                  v-model.number="masteryScore"
                  type="range"
                  :min="0"
                  :max="10"
                  :step="1"
                  class="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500 bg-blue-100"
                />
                <div class="flex justify-between items-center mt-2">
                  <span class="text-[10px] text-zinc-400">No achievement</span>
                  <span class="text-lg font-bold text-blue-600">{{ masteryScore }}</span>
                  <span class="text-[10px] text-zinc-400">Full mastery</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="!showFeedback" class="flex justify-end gap-3 px-6 pb-5 pt-2 border-t border-zinc-100">
            <button
              class="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
              @click="handleClose"
            >
              Cancel
            </button>
            <button
              class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
              @click="handleLog"
            >
              <UIcon name="i-lucide-check" class="text-base" />
              Log Activity
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-leave-active {
  transition: all 0.2s ease-out;
}
.modal-enter-from {
  opacity: 0;
}
.modal-enter-from > div:last-child {
  transform: scale(0.9) translateY(20px);
}
.modal-leave-to {
  opacity: 0;
}
.modal-leave-to > div:last-child {
  transform: scale(0.95);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 3px solid currentColor;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

input[type="range"].accent-emerald-500::-webkit-slider-thumb {
  border-color: #10b981;
}

input[type="range"].accent-blue-500::-webkit-slider-thumb {
  border-color: #3b82f6;
}

input[type="range"]::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 3px solid currentColor;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
</style>

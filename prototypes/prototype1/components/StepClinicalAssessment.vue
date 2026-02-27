<script setup lang="ts">
const emit = defineEmits<{
  next: []
  back: []
}>()

const { avatarGender, voiceTone, allPhobias, randomHobby } = useOnboardingState()
const {
  selectedScale,
  answers,
  currentQuestionIndex,
  activeQuestions,
  totalQuestions,
  progress,
  currentQuestion,
  isAssessmentComplete
} = useAssessmentState()
const { isSpeaking, displayedText, speak, stop } = useAvatarSpeech()
const { filterIntroText } = usePhobiaFilter()

interface QuestionItem {
  id: number
  text: string
  personalizable?: boolean
  personalizationTemplate?: string
  options?: Array<{ value: number; text: string }>
  subscale?: string
}

const sq48ResponseScale = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'Often' },
  { value: 4, label: 'Very often' }
]

const typedQuestion = computed<QuestionItem | null>(() => currentQuestion.value as QuestionItem | null)

const avatarMessage = computed(() => {
  const q = typedQuestion.value
  if (!q) return ''

  if (q.personalizable && q.personalizationTemplate) {
    const hobby = randomHobby.value
    const personalized = q.personalizationTemplate.replace(/\{hobby\}/g, hobby)
    return filterIntroText(personalized, allPhobias.value)
  }

  const intro = 'Thinking about the past seven days...'
  return `${intro} ${q.text}`
})

function selectAnswer(value: number): void {
  const q = typedQuestion.value
  if (!q) return
  answers[q.id] = value
}

function nextQuestion(): void {
  stop()
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
    speakQuestion()
  } else {
    isAssessmentComplete.value = true
    emit('next')
  }
}

function prevQuestion(): void {
  stop()
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  } else {
    emit('back')
  }
}

function speakQuestion(): void {
  if (avatarMessage.value) {
    speak(avatarMessage.value, avatarGender.value, voiceTone.value)
  }
}

const hasAnswer = computed(() => {
  const q = typedQuestion.value
  if (!q) return false
  return answers[q.id] !== undefined
})

watch(currentQuestionIndex, () => {
  speakQuestion()
})

onMounted(() => {
  speakQuestion()
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-8">
    <!-- Progress -->
    <div class="mb-6">
      <div class="mb-1 flex justify-between text-xs text-gray-400">
        <span>{{ selectedScale === 'qids-sr' ? 'QIDS-SR' : 'SQ-48' }} Assessment</span>
        <span>{{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span>
      </div>
      <UProgress :value="progress" size="sm" color="primary" />
    </div>

    <!-- Avatar -->
    <div class="mb-6 flex flex-col items-center">
      <AvatarAgent
        :gender="avatarGender"
        :is-speaking="isSpeaking"
        :message="displayedText || avatarMessage"
      />
    </div>

    <!-- Question Options -->
    <div v-if="typedQuestion" class="mb-8">
      <!-- QIDS-SR: specific options per question -->
      <template v-if="selectedScale === 'qids-sr' && typedQuestion.options">
        <div class="space-y-2">
          <UCard
            v-for="option in typedQuestion.options"
            :key="option.value"
            class="cursor-pointer transition-all"
            :class="answers[typedQuestion.id] === option.value ? 'ring-2 ring-teal-500 bg-teal-50' : 'ring-1 ring-gray-200 hover:ring-gray-300'"
            @click="selectAnswer(option.value)"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                :class="answers[typedQuestion.id] === option.value ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-500'"
              >
                {{ option.value }}
              </div>
              <p class="text-sm text-gray-700">
                {{ option.text }}
              </p>
            </div>
          </UCard>
        </div>
      </template>

      <!-- SQ-48: shared response scale -->
      <template v-else-if="selectedScale === 'sq-48'">
        <p class="mb-4 text-center text-sm font-medium text-gray-600">
          "{{ typedQuestion.text }}"
        </p>
        <div class="flex justify-center gap-2">
          <button
            v-for="option in sq48ResponseScale"
            :key="option.value"
            class="flex flex-col items-center gap-1 rounded-xl px-3 py-3 text-xs transition-all"
            :class="answers[typedQuestion.id] === option.value
              ? 'bg-teal-500 text-white shadow-md'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200'"
            @click="selectAnswer(option.value)"
          >
            <span class="text-lg font-semibold">{{ option.value }}</span>
            <span class="whitespace-nowrap">{{ option.label }}</span>
          </button>
        </div>
      </template>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between">
      <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" @click="prevQuestion">
        Back
      </UButton>
      <UButton
        color="primary"
        icon="i-lucide-arrow-right"
        trailing
        :disabled="!hasAnswer"
        @click="nextQuestion"
      >
        {{ currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next' }}
      </UButton>
    </div>
  </div>
</template>

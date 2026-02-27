<script setup lang="ts">
const emit = defineEmits<{
  restart: []
}>()

const { avatarGender, voiceTone, onboardingData } = useOnboardingState()
const { getResult, selectedScale } = useAssessmentState()
const { isSpeaking, displayedText, speak, stop } = useAvatarSpeech()

const result = computed(() => getResult())
const showDetails = ref(false)

const patientName = computed(() => onboardingData.preferredName || 'there')

const congratsMessage = computed(() =>
  `Thank you, ${patientName.value}. You did great. Based on your responses, we'll tailor your treatment plan to best support you.`
)

const subscaleLabels: Record<string, string> = {
  Sleep: 'Sleep Quality',
  'Sad Mood': 'Mood',
  'Appetite/Weight': 'Appetite & Weight',
  Concentration: 'Concentration',
  'Self-View': 'Self-Perception',
  'Suicidal Ideation': 'Thoughts of Self-Harm',
  Interest: 'General Interest',
  Energy: 'Energy Level',
  Psychomotor: 'Psychomotor Activity',
  AGGR: 'Aggression',
  AGOR: 'Agoraphobia',
  ANXI: 'Anxiety',
  COGN: 'Cognitive Problems',
  MOOD: 'Depressed Mood',
  SOMA: 'Somatic Complaints',
  SOPH: 'Social Phobia',
  VITA: 'Vitality',
  WORK: 'Work/Study'
}

onMounted(() => {
  speak(congratsMessage.value, avatarGender.value, voiceTone.value)
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-8">
    <!-- Avatar -->
    <div class="mb-8 flex flex-col items-center">
      <AvatarAgent
        :gender="avatarGender"
        :is-speaking="isSpeaking"
        :message="displayedText || congratsMessage"
      />
    </div>

    <!-- Summary Card -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-check-circle" class="size-5 text-teal-500" />
          <h3 class="font-semibold text-gray-900">
            Assessment Complete
          </h3>
        </div>
      </template>

      <div class="space-y-3">
        <p class="text-gray-600">
          Thank you for completing the
          <span class="font-medium">{{ selectedScale === 'qids-sr' ? 'QIDS-SR' : 'SQ-48' }}</span>
          assessment, {{ patientName }}.
        </p>
        <p class="text-gray-600">
          Based on your responses, we'll tailor your treatment plan to best support your wellbeing.
          Your therapist will review the detailed results during your next session.
        </p>
      </div>
    </UCard>

    <!-- Detailed Results (Therapist View) -->
    <UCard class="mb-8">
      <template #header>
        <button
          class="flex w-full items-center justify-between"
          @click="showDetails = !showDetails"
        >
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-stethoscope" class="size-5 text-gray-400" />
            <span class="text-sm font-medium text-gray-500">View Detailed Results (Therapist)</span>
          </div>
          <UIcon
            :name="showDetails ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            class="size-4 text-gray-400"
          />
        </button>
      </template>

      <div v-if="showDetails && result">
        <div class="space-y-4">
          <div class="rounded-lg bg-gray-50 p-3">
            <p class="text-sm text-gray-500">
              Total Score
            </p>
            <p class="text-2xl font-bold text-gray-900">
              {{ result.totalScore }}
            </p>
            <p v-if="result.severity" class="text-sm text-gray-500">
              Severity: <span class="font-medium">{{ result.severity }}</span>
            </p>
          </div>

          <div>
            <p class="mb-2 text-sm font-medium text-gray-700">
              Domain Scores
            </p>
            <div class="space-y-2">
              <div
                v-for="(score, domain) in result.domainScores"
                :key="domain"
                class="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
              >
                <span class="text-sm text-gray-600">
                  {{ subscaleLabels[domain as string] ?? domain }}
                </span>
                <span class="font-mono text-sm font-semibold text-gray-900">{{ score }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Actions -->
    <div class="flex justify-center gap-3">
      <UButton
        variant="outline"
        color="neutral"
        icon="i-lucide-rotate-ccw"
        @click="emit('restart')"
      >
        Start Over
      </UButton>
    </div>
  </div>
</template>

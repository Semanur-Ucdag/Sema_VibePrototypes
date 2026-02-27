<script setup lang="ts">
import type { ScaleId } from '../composables/useAssessmentState'

const emit = defineEmits<{
  next: []
  back: []
}>()

const { avatarGender, voiceTone, onboardingData } = useOnboardingState()
const { selectedScale, skipWorkStudy } = useAssessmentState()
const { isSpeaking, displayedText, speak, stop } = useAvatarSpeech()

const scales: Array<{ id: ScaleId; title: string; description: string; items: number; duration: string }> = [
  {
    id: 'qids-sr',
    title: 'QIDS-SR',
    description: 'Quick Inventory of Depressive Symptomatology — a focused 16-item assessment.',
    items: 16,
    duration: '~5 min'
  },
  {
    id: 'sq-48',
    title: 'SQ-48',
    description: 'Symptom Questionnaire — a comprehensive 48-item assessment covering multiple domains.',
    items: 48,
    duration: '~15 min'
  }
]

function select(id: ScaleId): void {
  selectedScale.value = id
}

onMounted(() => {
  const name = onboardingData.preferredName || 'there'
  speak(`Great job, ${name}. Now let's move on to the clinical assessment. Please choose which questionnaire you'd like to complete.`, avatarGender.value, voiceTone.value)
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-8">
    <!-- Avatar intro -->
    <div class="mb-8 flex flex-col items-center">
      <AvatarAgent
        :gender="avatarGender"
        :is-speaking="isSpeaking"
        :message="displayedText || `Well done, ${onboardingData.preferredName || 'there'}! Now let's choose a clinical assessment.`"
      />
    </div>

    <!-- Scale Selection -->
    <div class="mb-6 grid gap-4">
      <UCard
        v-for="scale in scales"
        :key="scale.id"
        class="cursor-pointer transition-all hover:shadow-lg"
        :class="selectedScale === scale.id ? 'ring-2 ring-teal-500 shadow-lg' : 'ring-1 ring-gray-200'"
        @click="select(scale.id)"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ scale.title }}
              </h3>
              <UBadge v-if="selectedScale === scale.id" color="primary" variant="subtle" size="xs">
                Selected
              </UBadge>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              {{ scale.description }}
            </p>
          </div>
          <div class="text-right text-sm text-gray-400">
            <p>{{ scale.items }} items</p>
            <p>{{ scale.duration }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- SQ-48 work/study skip option -->
    <div v-if="selectedScale === 'sq-48'" class="mb-6 rounded-lg bg-blue-50 p-4">
      <label class="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
        <input
          v-model="skipWorkStudy"
          type="checkbox"
          class="size-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
        >
        I am not currently working or studying (skip work/study questions)
      </label>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between">
      <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" @click="emit('back')">
        Back
      </UButton>
      <UButton
        color="primary"
        icon="i-lucide-arrow-right"
        trailing
        :disabled="!selectedScale"
        @click="emit('next')"
      >
        Start Assessment
      </UButton>
    </div>
  </div>
</template>

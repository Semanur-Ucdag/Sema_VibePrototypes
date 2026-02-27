<script setup lang="ts">
definePageMeta({ layout: false })

const { reset: resetOnboarding } = useOnboardingState()
const { reset: resetAssessment } = useAssessmentState()

type WizardStep = 'landing' | 'avatar-selection' | 'onboarding' | 'assessment-select' | 'clinical-assessment' | 'completion'

const currentStep = ref<WizardStep>('landing')
const transitionName = ref('slide-left')

const stepOrder: WizardStep[] = [
  'landing',
  'avatar-selection',
  'onboarding',
  'assessment-select',
  'clinical-assessment',
  'completion'
]

function goTo(step: WizardStep): void {
  const currentIdx = stepOrder.indexOf(currentStep.value)
  const nextIdx = stepOrder.indexOf(step)
  transitionName.value = nextIdx > currentIdx ? 'slide-left' : 'slide-right'
  currentStep.value = step
}

function next(): void {
  const idx = stepOrder.indexOf(currentStep.value)
  if (idx < stepOrder.length - 1) {
    goTo(stepOrder[idx + 1])
  }
}

function back(): void {
  const idx = stepOrder.indexOf(currentStep.value)
  if (idx > 0) {
    goTo(stepOrder[idx - 1])
  }
}

function restart(): void {
  resetOnboarding()
  resetAssessment()
  goTo('landing')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50/30">
    <!-- Top bar -->
    <header class="border-b border-gray-200/60 bg-white/80 px-6 py-3 backdrop-blur-sm">
      <div class="mx-auto flex max-w-4xl items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-brain" class="size-5 text-teal-600" />
          <span class="text-sm font-semibold text-gray-700">MentalCareGroup</span>
          <UBadge color="primary" variant="subtle" size="xs">
            Prototype 1
          </UBadge>
        </div>
        <UButton
          v-if="currentStep !== 'landing'"
          size="xs"
          variant="ghost"
          color="neutral"
          icon="i-lucide-rotate-ccw"
          @click="restart"
        >
          Restart
        </UButton>
      </div>
    </header>

    <!-- Wizard Content -->
    <main class="mx-auto max-w-4xl">
      <Transition :name="transitionName" mode="out-in">
        <StepLanding v-if="currentStep === 'landing'" @next="next" />
        <StepAvatarSelection v-else-if="currentStep === 'avatar-selection'" @next="next" @back="back" />
        <StepOnboarding v-else-if="currentStep === 'onboarding'" @next="next" @back="back" />
        <StepAssessmentSelect v-else-if="currentStep === 'assessment-select'" @next="next" @back="back" />
        <StepClinicalAssessment v-else-if="currentStep === 'clinical-assessment'" @next="next" @back="back" />
        <StepCompletion v-else-if="currentStep === 'completion'" @restart="restart" />
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.25s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

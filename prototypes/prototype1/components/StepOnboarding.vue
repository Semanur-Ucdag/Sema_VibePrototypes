<script setup lang="ts">
const emit = defineEmits<{
  next: []
  back: []
}>()

const { avatarGender, voiceTone, onboardingData, isOnboardingComplete } = useOnboardingState()
const { isMuted, isSpeaking, displayedText, speak, stop, toggleMute } = useAvatarSpeech()

const substep = ref(0)

const HOBBY_OPTIONS = ['Reading', 'Swimming', 'Walking', 'Cooking', 'Music', 'Gaming', 'Painting', 'Yoga', 'Gardening']
const PHOBIA_OPTIONS = ['Heights', 'Crowds', 'Darkness', 'Water', 'Spiders', 'Enclosed spaces', 'Public speaking', 'None']

const showCustomHobby = computed(() => onboardingData.hobbies.includes('Other'))
const showCustomPhobia = computed(() => onboardingData.phobias.includes('Other'))

interface SubstepConfig {
  question: string
  speechText: string
}

const substeps: SubstepConfig[] = [
  {
    question: 'What are your hobbies or favorite activities?',
    speechText: 'Let\'s start by getting to know you a little better. What are some of your hobbies or favorite activities?'
  },
  {
    question: 'What topics or activities help you relax?',
    speechText: 'That\'s wonderful. Now, could you tell me what helps you relax?'
  },
  {
    question: 'Are there any fears or phobias we should be aware of?',
    speechText: 'Thank you for sharing. Are there any fears or phobias we should be mindful of during our sessions?'
  },
  {
    question: 'How would you like me to address you?',
    speechText: 'I\'d love to make this feel personal. What name would you like me to use?'
  },
  {
    question: 'How comfortable are you with detailed clinical questions?',
    speechText: 'Last question. On a scale of one to five, how comfortable do you feel answering detailed clinical questions?'
  }
]

const currentSubstep = computed(() => substeps[substep.value])

function toggleHobby(hobby: string): void {
  const idx = onboardingData.hobbies.indexOf(hobby)
  if (idx >= 0) {
    onboardingData.hobbies.splice(idx, 1)
  } else {
    onboardingData.hobbies.push(hobby)
  }
}

function togglePhobia(phobia: string): void {
  if (phobia === 'None') {
    onboardingData.phobias = ['None']
    return
  }
  const noneIdx = onboardingData.phobias.indexOf('None')
  if (noneIdx >= 0) onboardingData.phobias.splice(noneIdx, 1)

  const idx = onboardingData.phobias.indexOf(phobia)
  if (idx >= 0) {
    onboardingData.phobias.splice(idx, 1)
  } else {
    onboardingData.phobias.push(phobia)
  }
}

const canProceed = computed(() => {
  switch (substep.value) {
    case 0: return onboardingData.hobbies.length > 0
    case 1: return onboardingData.relaxation.trim().length > 0
    case 2: return onboardingData.phobias.length > 0
    case 3: return onboardingData.preferredName.trim().length > 0
    case 4: return onboardingData.clinicalComfort >= 1 && onboardingData.clinicalComfort <= 5
    default: return false
  }
})

function nextSubstep(): void {
  stop()
  if (substep.value < substeps.length - 1) {
    substep.value++
    speakCurrentQuestion()
  } else {
    isOnboardingComplete.value = true
    emit('next')
  }
}

function prevSubstep(): void {
  stop()
  if (substep.value > 0) {
    substep.value--
  } else {
    emit('back')
  }
}

function speakCurrentQuestion(): void {
  if (currentSubstep.value) {
    speak(currentSubstep.value.speechText, avatarGender.value, voiceTone.value)
  }
}

onMounted(() => {
  speakCurrentQuestion()
})
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-8">
    <!-- Progress -->
    <div class="mb-6">
      <div class="mb-1 flex justify-between text-xs text-gray-400">
        <span>Onboarding</span>
        <span>{{ substep + 1 }} / {{ substeps.length }}</span>
      </div>
      <UProgress :value="((substep + 1) / substeps.length) * 100" size="sm" color="primary" />
    </div>

    <!-- Avatar + Question -->
    <div class="mb-8 flex flex-col items-center">
      <AvatarAgent
        :gender="avatarGender"
        :is-speaking="isSpeaking"
        :message="displayedText || currentSubstep?.question"
      />
      <UButton
        size="xs"
        variant="ghost"
        color="neutral"
        :icon="isMuted ? 'i-lucide-volume-x' : isSpeaking ? 'i-lucide-volume-2' : 'i-lucide-volume-1'"
        class="mt-2"
        @click="toggleMute"
      >
        {{ isMuted ? 'Unmute' : 'Mute' }}
      </UButton>
    </div>

    <!-- Substep Content -->
    <div class="mb-8">
      <!-- Step 1: Hobbies -->
      <div v-if="substep === 0">
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="hobby in HOBBY_OPTIONS"
            :key="hobby"
            size="sm"
            :variant="onboardingData.hobbies.includes(hobby) ? 'solid' : 'outline'"
            :color="onboardingData.hobbies.includes(hobby) ? 'primary' : 'neutral'"
            @click="toggleHobby(hobby)"
          >
            {{ hobby }}
          </UButton>
          <UButton
            size="sm"
            :variant="onboardingData.hobbies.includes('Other') ? 'solid' : 'outline'"
            :color="onboardingData.hobbies.includes('Other') ? 'primary' : 'neutral'"
            @click="toggleHobby('Other')"
          >
            Other
          </UButton>
        </div>
        <UInput
          v-if="showCustomHobby"
          v-model="onboardingData.customHobby"
          placeholder="Enter your hobby..."
          class="mt-3"
        />
      </div>

      <!-- Step 2: Relaxation -->
      <div v-if="substep === 1">
        <UTextarea
          v-model="onboardingData.relaxation"
          placeholder="e.g., Listening to calm music, taking walks in nature..."
          :rows="3"
        />
      </div>

      <!-- Step 3: Phobias -->
      <div v-if="substep === 2">
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="phobia in PHOBIA_OPTIONS"
            :key="phobia"
            size="sm"
            :variant="onboardingData.phobias.includes(phobia) ? 'solid' : 'outline'"
            :color="onboardingData.phobias.includes(phobia) ? 'primary' : 'neutral'"
            @click="togglePhobia(phobia)"
          >
            {{ phobia }}
          </UButton>
          <UButton
            size="sm"
            :variant="onboardingData.phobias.includes('Other') ? 'solid' : 'outline'"
            :color="onboardingData.phobias.includes('Other') ? 'primary' : 'neutral'"
            @click="togglePhobia('Other')"
          >
            Other
          </UButton>
        </div>
        <UInput
          v-if="showCustomPhobia"
          v-model="onboardingData.customPhobia"
          placeholder="Describe your fear..."
          class="mt-3"
        />
      </div>

      <!-- Step 4: Preferred Name -->
      <div v-if="substep === 3">
        <UInput
          v-model="onboardingData.preferredName"
          placeholder="Your preferred name..."
          size="lg"
        />
      </div>

      <!-- Step 5: Clinical Comfort -->
      <div v-if="substep === 4">
        <div class="flex justify-center gap-3">
          <UButton
            v-for="n in 5"
            :key="n"
            size="lg"
            :variant="onboardingData.clinicalComfort === n ? 'solid' : 'outline'"
            :color="onboardingData.clinicalComfort === n ? 'primary' : 'neutral'"
            class="size-14 rounded-xl text-lg"
            @click="onboardingData.clinicalComfort = n"
          >
            {{ n }}
          </UButton>
        </div>
        <div class="mt-3 flex justify-between text-xs text-gray-400">
          <span>Not comfortable</span>
          <span>Very comfortable</span>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between">
      <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" @click="prevSubstep">
        Back
      </UButton>
      <UButton
        color="primary"
        icon="i-lucide-arrow-right"
        trailing
        :disabled="!canProceed"
        @click="nextSubstep"
      >
        {{ substep === substeps.length - 1 ? 'Complete' : 'Next' }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AvatarGender, VoiceTone } from '../composables/useOnboardingState'

const emit = defineEmits<{
  next: []
  back: []
}>()

const { avatarGender, voiceTone } = useOnboardingState()
const { isSpeaking, previewVoice, stop } = useAvatarSpeech()

interface ToneOption {
  id: VoiceTone
  label: string
  description: string
  icon: string
}

const toneOptions: ToneOption[] = [
  { id: 'warm', label: 'Warm', description: 'Soft and caring', icon: 'i-lucide-heart' },
  { id: 'neutral', label: 'Neutral', description: 'Balanced and calm', icon: 'i-lucide-circle' },
  { id: 'professional', label: 'Professional', description: 'Clear and authoritative', icon: 'i-lucide-briefcase' }
]

function select(gender: AvatarGender): void {
  stop()
  avatarGender.value = gender
}

function selectTone(tone: VoiceTone): void {
  voiceTone.value = tone
}

function preview(tone: VoiceTone): void {
  previewVoice('Hello, I\'m here to guide you through this session.', avatarGender.value, tone)
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-8">
    <div class="mb-8 text-center">
      <h2 class="mb-2 text-2xl font-semibold text-gray-900">
        Choose Your Guide
      </h2>
      <p class="text-gray-500">
        Select the virtual psychologist who will guide you through this session.
      </p>
    </div>

    <!-- Avatar Selection -->
    <div class="mb-8 grid grid-cols-2 gap-6">
      <UCard
        class="cursor-pointer transition-all hover:shadow-lg"
        :class="avatarGender === 'female' ? 'ring-2 ring-teal-500 shadow-lg' : 'ring-1 ring-gray-200'"
        @click="select('female')"
      >
        <div class="flex flex-col items-center gap-3 py-4">
          <AvatarAgent gender="female" :show-bubble="false" />
          <div class="text-center">
            <p class="font-semibold text-gray-900">
              Dr. Sophie
            </p>
            <p class="text-sm text-gray-500">
              Female Psychologist
            </p>
          </div>
          <UBadge v-if="avatarGender === 'female'" color="primary" variant="subtle">
            Selected
          </UBadge>
        </div>
      </UCard>

      <UCard
        class="cursor-pointer transition-all hover:shadow-lg"
        :class="avatarGender === 'male' ? 'ring-2 ring-teal-500 shadow-lg' : 'ring-1 ring-gray-200'"
        @click="select('male')"
      >
        <div class="flex flex-col items-center gap-3 py-4">
          <AvatarAgent gender="male" :show-bubble="false" />
          <div class="text-center">
            <p class="font-semibold text-gray-900">
              Dr. James
            </p>
            <p class="text-sm text-gray-500">
              Male Psychologist
            </p>
          </div>
          <UBadge v-if="avatarGender === 'male'" color="primary" variant="subtle">
            Selected
          </UBadge>
        </div>
      </UCard>
    </div>

    <!-- Voice Tone Selection -->
    <div class="mb-10">
      <h3 class="mb-1 text-center text-lg font-semibold text-gray-900">
        Choose Voice Tone
      </h3>
      <p class="mb-4 text-center text-sm text-gray-500">
        Select how {{ avatarGender === 'female' ? 'Dr. Sophie' : 'Dr. James' }} should sound.
      </p>

      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="tone in toneOptions"
          :key="tone.id"
          class="cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md"
          :class="voiceTone === tone.id
            ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500'
            : 'border-gray-200 bg-white hover:border-gray-300'"
          @click="selectTone(tone.id)"
        >
          <div class="flex flex-col items-center gap-2 text-center">
            <UIcon
              :name="tone.icon"
              class="size-6"
              :class="voiceTone === tone.id ? 'text-teal-600' : 'text-gray-400'"
            />
            <p
              class="text-sm font-semibold"
              :class="voiceTone === tone.id ? 'text-teal-700' : 'text-gray-700'"
            >
              {{ tone.label }}
            </p>
            <p class="text-xs text-gray-500">
              {{ tone.description }}
            </p>
            <UButton
              size="xs"
              :variant="voiceTone === tone.id ? 'solid' : 'outline'"
              :color="voiceTone === tone.id ? 'primary' : 'neutral'"
              :icon="isSpeaking && voiceTone === tone.id ? 'i-lucide-volume-2' : 'i-lucide-play'"
              @click.stop="preview(tone.id)"
            >
              Preview
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between">
      <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" @click="emit('back')">
        Back
      </UButton>
      <UButton color="primary" icon="i-lucide-arrow-right" trailing @click="emit('next')">
        Continue
      </UButton>
    </div>
  </div>
</template>

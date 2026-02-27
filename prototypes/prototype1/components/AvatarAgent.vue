<script setup lang="ts">
import type { AvatarGender } from '../composables/useOnboardingState'

interface Props {
  gender: AvatarGender
  isSpeaking?: boolean
  message?: string
  showBubble?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSpeaking: false,
  message: '',
  showBubble: true
})

const avatarSrc = computed(() =>
  props.gender === 'female' ? '/avatars/female.png' : '/avatars/male.png'
)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Speech Bubble -->
    <div
      v-if="showBubble && message"
      class="relative max-w-sm rounded-2xl bg-white px-5 py-4 text-sm leading-relaxed text-gray-700 shadow-md ring-1 ring-gray-100"
    >
      {{ message }}
      <span v-if="isSpeaking" class="ml-0.5 inline-block h-4 w-0.5 animate-blink bg-teal-500" />
      <div class="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path d="M0 0 L8 10 L16 0 Z" fill="white" />
        </svg>
      </div>
    </div>

    <!-- Avatar Image -->
    <div
      class="relative h-40 w-40 overflow-hidden rounded-full shadow-lg transition-all duration-300"
      :class="isSpeaking
        ? 'ring-4 ring-teal-400/60 shadow-teal-200/50 shadow-xl'
        : 'ring-2 ring-gray-200'"
    >
      <img
        :src="avatarSrc"
        :alt="`${gender === 'female' ? 'Dr. Sophie' : 'Dr. James'} - Virtual Psychologist`"
        class="h-full w-full object-cover"
      >
      <div
        v-if="isSpeaking"
        class="absolute inset-0 animate-pulse-ring rounded-full ring-4 ring-teal-400/30"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.animate-blink {
  animation: blink 0.8s infinite;
}

@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(45, 212, 191, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(45, 212, 191, 0); }
  100% { box-shadow: 0 0 0 0 rgba(45, 212, 191, 0); }
}

.animate-pulse-ring {
  animation: pulse-ring 1.5s ease-out infinite;
}
</style>

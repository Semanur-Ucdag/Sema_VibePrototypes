<script setup lang="ts">
const FEMALE_VOICE_PRIORITY = [
  'jenny', 'aria', 'natural', 'online',
  'google uk english female', 'google us english',
  'samantha', 'karen', 'moira', 'tessa', 'fiona',
  'hazel', 'susan', 'zira', 'female'
]

interface Props {
  audioContent: string
  category?: string
}

const props = withDefaults(defineProps<Props>(), {
  category: ''
})

const { themeConfig } = useEnergyState()

const isPlaying = ref(false)
const currentTime = ref(0)
const totalDuration = ref(180)
const speechProgress = ref(0)

const PHASES = ['Breathe In...', 'Hold...', 'Breathe Out...', 'Hold...'] as const
const breathPhase = ref(0)
const breathCycle = ref(0)
const totalCycles = 4
const breathScale = ref(1)
let breathTimer: ReturnType<typeof setInterval> | null = null
let progressTimer: ReturnType<typeof setInterval> | null = null
let currentUtterance: SpeechSynthesisUtterance | null = null

const isBreathing = computed(() => props.category === 'breathing')

const speakableText = computed(() => {
  return props.audioContent
    .replace(/\[Audio:.*?\]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/"/g, '')
    .trim()
})

const formattedTime = computed(() => {
  const mins = Math.floor(currentTime.value / 60)
  const secs = currentTime.value % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

const formattedDuration = computed(() => {
  const mins = Math.floor(totalDuration.value / 60)
  const secs = totalDuration.value % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

const progressPercent = computed(() => {
  if (totalDuration.value === 0) return 0
  return Math.min((currentTime.value / totalDuration.value) * 100, 100)
})

function findFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  const englishVoices = voices.filter(v => v.lang.startsWith('en'))
  if (englishVoices.length === 0) return null

  for (const keyword of FEMALE_VOICE_PRIORITY) {
    const match = englishVoices.find(v => v.name.toLowerCase().includes(keyword))
    if (match) return match
  }
  return englishVoices[0] ?? null
}

function startSpeech(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(speakableText.value)
  utterance.rate = 0.92
  utterance.pitch = 1.05
  utterance.volume = 1.0

  const voice = findFemaleVoice()
  if (voice) utterance.voice = voice
  currentUtterance = utterance

  const estimatedSeconds = Math.ceil(speakableText.value.length / 12)
  totalDuration.value = estimatedSeconds

  utterance.onstart = () => {
    isPlaying.value = true
    startProgressTimer()
  }

  utterance.onend = () => {
    isPlaying.value = false
    currentTime.value = totalDuration.value
    speechProgress.value = 1
    stopProgressTimer()
    currentUtterance = null
  }

  utterance.onerror = () => {
    isPlaying.value = false
    stopProgressTimer()
    currentUtterance = null
  }

  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const freshVoice = findFemaleVoice()
      if (freshVoice) utterance.voice = freshVoice
      window.speechSynthesis.speak(utterance)
      window.speechSynthesis.onvoiceschanged = null
    }
  } else {
    window.speechSynthesis.speak(utterance)
  }
}

function pauseSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.pause()
  }
  isPlaying.value = false
  stopProgressTimer()
}

function resumeSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.resume()
  }
  isPlaying.value = true
  startProgressTimer()
}

function stopSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
  isPlaying.value = false
  currentTime.value = 0
  speechProgress.value = 0
  stopProgressTimer()
  currentUtterance = null
}

function startProgressTimer(): void {
  stopProgressTimer()
  progressTimer = setInterval(() => {
    if (currentTime.value >= totalDuration.value) {
      stopProgressTimer()
      return
    }
    currentTime.value++
  }, 1000)
}

function stopProgressTimer(): void {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

function togglePlay(): void {
  if (!isPlaying.value && currentUtterance === null) {
    currentTime.value = 0
    startSpeech()
    if (isBreathing.value) startBreathing()
  } else if (!isPlaying.value && currentUtterance !== null) {
    resumeSpeech()
    if (isBreathing.value) startBreathing()
  } else {
    pauseSpeech()
    if (isBreathing.value) stopBreathing()
  }
}

function startBreathing(): void {
  breathPhase.value = 0
  breathCycle.value = 0
  updateBreathScale()

  breathTimer = setInterval(() => {
    breathPhase.value = (breathPhase.value + 1) % 4
    if (breathPhase.value === 0) {
      breathCycle.value++
      if (breathCycle.value >= totalCycles) {
        stopBreathing()
        return
      }
    }
    updateBreathScale()
  }, 4000)
}

function updateBreathScale(): void {
  const phase = breathPhase.value
  if (phase === 0) breathScale.value = 1.6
  else if (phase === 1) breathScale.value = 1.6
  else if (phase === 2) breathScale.value = 1
  else breathScale.value = 1
}

function stopBreathing(): void {
  if (breathTimer) {
    clearInterval(breathTimer)
    breathTimer = null
  }
}

onUnmounted(() => {
  stopSpeech()
  stopBreathing()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Breathing Circle -->
    <div v-if="isBreathing" class="flex flex-col items-center gap-4 py-8">
      <div class="relative flex items-center justify-center">
        <div
          class="flex size-40 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-teal-100 transition-transform"
          :style="{ transform: `scale(${breathScale})`, transitionDuration: '4s', transitionTimingFunction: 'ease-in-out' }"
        >
          <span class="text-center text-lg font-medium text-gray-700">
            {{ isPlaying ? PHASES[breathPhase] : 'Press Play' }}
          </span>
        </div>
      </div>
      <p v-if="isPlaying" class="text-sm" :class="themeConfig.subtext">
        Cycle {{ Math.min(breathCycle + 1, totalCycles) }} / {{ totalCycles }}
      </p>
    </div>

    <!-- Audio Player -->
    <div class="rounded-xl border p-4" :class="[themeConfig.cardBg, themeConfig.border]">
      <div class="flex items-center gap-4">
        <UButton
          :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
          size="lg"
          variant="solid"
          color="primary"
          class="shrink-0 rounded-full"
          @click="togglePlay"
        />
        <div class="flex-1">
          <UProgress :value="progressPercent" size="sm" color="primary" />
          <div class="mt-1 flex justify-between text-xs" :class="themeConfig.subtext">
            <span>{{ formattedTime }}</span>
            <span>{{ formattedDuration }}</span>
          </div>
        </div>
        <UButton
          v-if="currentUtterance !== null"
          icon="i-lucide-square"
          size="sm"
          variant="ghost"
          color="neutral"
          @click="stopSpeech"
        />
      </div>
    </div>

    <!-- Transcript -->
    <details class="rounded-xl border" :class="[themeConfig.cardBg, themeConfig.border]">
      <summary class="cursor-pointer px-4 py-3 text-sm font-medium" :class="themeConfig.subtext">
        View Transcript
      </summary>
      <div class="border-t px-4 py-3" :class="themeConfig.border">
        <p class="whitespace-pre-line text-sm leading-relaxed" :class="themeConfig.subtext">
          {{ audioContent }}
        </p>
      </div>
    </details>
  </div>
</template>

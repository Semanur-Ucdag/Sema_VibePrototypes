import type { AvatarGender, VoiceTone } from './useOnboardingState'

interface VoiceParams {
  rate: number
  pitch: number
  volume: number
}

const VOICE_CONFIGS: Record<AvatarGender, Record<VoiceTone, VoiceParams>> = {
  female: {
    warm: { rate: 0.82, pitch: 1.25, volume: 0.8 },
    neutral: { rate: 0.9, pitch: 1.0, volume: 0.8 },
    professional: { rate: 1.0, pitch: 0.85, volume: 0.85 }
  },
  male: {
    warm: { rate: 0.82, pitch: 1.05, volume: 0.8 },
    neutral: { rate: 0.9, pitch: 0.8, volume: 0.8 },
    professional: { rate: 1.0, pitch: 0.6, volume: 0.85 }
  }
}

const VOICE_PREFERENCES: Record<AvatarGender, Record<VoiceTone, string[]>> = {
  female: {
    warm: ['hazel', 'samantha', 'karen', 'female'],
    neutral: ['zira', 'susan', 'tessa', 'female'],
    professional: ['moira', 'fiona', 'victoria', 'female']
  },
  male: {
    warm: ['mark', 'daniel', 'alex', 'male'],
    neutral: ['david', 'george', 'tom', 'male'],
    professional: ['james', 'richard', 'fred', 'male']
  }
}

const isMuted = ref(false)
const isSpeaking = ref(false)
const displayedText = ref('')
const speechProgress = ref(0)

let currentUtterance: SpeechSynthesisUtterance | null = null
let fallbackInterval: ReturnType<typeof setInterval> | null = null
let cachedVoices: SpeechSynthesisVoice[] = []

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) cachedVoices = voices
  return cachedVoices
}

function findVoice(gender: AvatarGender, tone: VoiceTone): SpeechSynthesisVoice | null {
  const voices = loadVoices()
  const englishVoices = voices.filter(v => v.lang.startsWith('en'))
  if (englishVoices.length === 0) return null

  const preferences = VOICE_PREFERENCES[gender][tone]
  for (const keyword of preferences) {
    const match = englishVoices.find(v => v.name.toLowerCase().includes(keyword))
    if (match) return match
  }

  const otherTones = Object.keys(VOICE_PREFERENCES[gender]) as VoiceTone[]
  const usedNames = new Set<string>()
  for (const t of otherTones) {
    if (t === tone) continue
    for (const kw of VOICE_PREFERENCES[gender][t]) {
      const m = englishVoices.find(v => v.name.toLowerCase().includes(kw))
      if (m) usedNames.add(m.name)
    }
  }

  const unused = englishVoices.find(v => !usedNames.has(v.name))
  return unused ?? englishVoices[0] ?? null
}

function clearFallback(): void {
  if (fallbackInterval) {
    clearInterval(fallbackInterval)
    fallbackInterval = null
  }
}

function startFallbackTypewriter(text: string, rate: number): void {
  clearFallback()
  const charsPerSecond = (text.length / (text.length / (rate * 12))) || 12
  const intervalMs = Math.max(30, 1000 / charsPerSecond)
  let charIndex = 0

  fallbackInterval = setInterval(() => {
    charIndex++
    if (charIndex >= text.length) {
      displayedText.value = text
      speechProgress.value = 1
      clearFallback()
      return
    }
    displayedText.value = text.substring(0, charIndex)
    speechProgress.value = charIndex / text.length
  }, intervalMs)
}

export function useAvatarSpeech() {
  function speak(text: string, gender: AvatarGender = 'female', tone: VoiceTone = 'warm'): Promise<void> {
    return new Promise((resolve) => {
      if (isMuted.value || typeof window === 'undefined' || !window.speechSynthesis) {
        displayedText.value = text
        speechProgress.value = 1
        resolve()
        return
      }

      stop()

      displayedText.value = ''
      speechProgress.value = 0

      const params = VOICE_CONFIGS[gender][tone]
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = params.rate
      utterance.pitch = params.pitch
      utterance.volume = params.volume

      const voice = findVoice(gender, tone)
      if (voice) utterance.voice = voice

      currentUtterance = utterance
      let boundaryFired = false

      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        if (event.name === 'word') {
          boundaryFired = true
          clearFallback()
          const endIndex = event.charIndex + (event.charLength || 1)
          displayedText.value = text.substring(0, endIndex)
          speechProgress.value = endIndex / text.length
        }
      }

      utterance.onstart = () => {
        isSpeaking.value = true
        if (!boundaryFired) {
          startFallbackTypewriter(text, params.rate)
        }
      }

      utterance.onend = () => {
        isSpeaking.value = false
        displayedText.value = text
        speechProgress.value = 1
        clearFallback()
        currentUtterance = null
        resolve()
      }

      utterance.onerror = () => {
        isSpeaking.value = false
        displayedText.value = text
        speechProgress.value = 1
        clearFallback()
        currentUtterance = null
        resolve()
      }

      const voices = loadVoices()
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          loadVoices()
          const freshVoice = findVoice(gender, tone)
          if (freshVoice) utterance.voice = freshVoice
          window.speechSynthesis.speak(utterance)
          window.speechSynthesis.onvoiceschanged = null
        }
      } else {
        window.speechSynthesis.speak(utterance)
      }
    })
  }

  function stop(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    isSpeaking.value = false
    clearFallback()
    currentUtterance = null
  }

  function toggleMute(): void {
    isMuted.value = !isMuted.value
    if (isMuted.value) stop()
  }

  function previewVoice(text: string, gender: AvatarGender, tone: VoiceTone): void {
    speak(text, gender, tone)
  }

  onUnmounted(() => {
    stop()
  })

  return {
    isMuted,
    isSpeaking,
    displayedText,
    speechProgress,
    speak,
    stop,
    toggleMute,
    previewVoice
  }
}
